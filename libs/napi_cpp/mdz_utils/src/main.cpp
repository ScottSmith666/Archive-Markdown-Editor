//
// Created by Scott Smith on 2026/4/8.
//

#include <iostream>
#include <thread>
#include <napi.h>
#include <bitfileextractor.hpp>
#include <bitfilecompressor.hpp>
#include <bitarchivereader.hpp>
#include <utility>


bool verifyMdzHasPassword(const std::string& filePath, const std::string& sevenZlibPath)
{
    try
    {
        const bit7z::Bit7zLibrary sevenZlib(sevenZlibPath);
        // 尝试打开压缩包
        const bit7z::BitArchiveReader reader{sevenZlib, filePath};
        // 如果能运行到这里，说明文件头没加密
        // 进一步检查内部是否有文件被加密
        return reader.hasEncryptedItems();
    }
    catch ([[maybe_unused]] const bit7z::BitException& exception)
    {
        // 如果抛出异常，通常是因为文件头加密导致无法读取元数据
        // 此时可以认定该压缩包是受密码保护的
        return true;
    }
}

class MdzUtilsWorker : public Napi::AsyncWorker
{
public:
    /**
     * 异步压缩/解压mdz的类
     *
     * @param operationKind     operationKind参数指示方法采用解压还是压缩操作，值为“compress”和“decompress”
     * @param sevenZlibPath     7-Zip动态链接库的路径
     * @param compressPassword  压缩包提供密码，默认为空字符串，如果为空字符串，生成mdz时就不设置密码
     */
    MdzUtilsWorker(
        Napi::Env env,
        std::string inputPath,
        std::string destPath,
        std::string operationKind,
        std::string sevenZlibPath,
        std::string compressPassword = "",
        std::string decompressPassword = ""
    )
        :
        AsyncWorker(env),
        inputPath(std::move(inputPath)),
        destPath(std::move(destPath)),
        operationKind(std::move(operationKind)),
        sevenZlibPath(std::move(sevenZlibPath)),
        compressPassword(std::move(compressPassword)),
        decompressPassword(std::move(decompressPassword)),
        success(false),
        _deferred(Napi::Promise::Deferred::New(env))
    {
    }

    void Execute() override
    {
        /**
         * 调用压缩/解压逻辑
         * 在后台线程执行（不要在这里操作js对象）
         */
        try
        {
            bit7z::Bit7zLibrary sevenZlib(sevenZlibPath);
            bit7z::BitFileCompressor compressor{sevenZlib, bit7z::BitFormat::SevenZip}; // 生成mdz时默认以7z为容器
            bit7z::BitFileExtractor extractor{sevenZlib, bit7z::BitFormat::Auto}; // 设置Auto可支持压缩解压多种压缩包格式，兼容性更好
            if (operationKind == "compress")
            {
                if (!compressPassword.empty()) // 如果密码不为空，则设置密码
                {
                    compressor.setPassword(compressPassword);
                }
                unsigned int cpuFactThread = std::thread::hardware_concurrency();
                unsigned int wantToUseThread = (cpuFactThread > 1) ? cpuFactThread / 2 : cpuFactThread;
                compressor.setThreadsCount(wantToUseThread);
                compressor.compressDirectory(inputPath, destPath);
                message = "创建mdz成功！";
                success = true;
            }
            else if (operationKind == "decompress")
            {
                if (verifyMdzHasPassword(inputPath, sevenZlibPath)) // 如果经验证这个mdz文件带密码
                {
                    extractor.setPassword(decompressPassword); // 设置解压密码
                }
                extractor.extract(inputPath, destPath);
                message = "打开mdz成功！";
                success = true;
            }
            else
            {
                message = "你指定的指示方法参数值并非compress或decompress，mdz_utils无法工作！";
                success = false;
            }
        }
        catch (const bit7z::BitException& exception)
        {
            message = "操作出错了！" + std::string(exception.what()) + " (错误码: " + std::to_string(
                    exception.code().value()) +
                ")";
            SetError(message);
        }
    }

    void OnOK() override
    /**
     * 完成后回到主线程执行，回调函数返回值（触发 .then）
     */
    {
        Napi::HandleScope scope(Env());
        Napi::Object obj = Napi::Object::New(Env());
        (void)obj.Set("success", success);
        (void)obj.Set("message", message);
        _deferred.Resolve(obj);
    }

    void OnError(const Napi::Error& err) override
    {
        _deferred.Reject(err.Value());
    }

    // 暴露给外部获取Promise对象
    Napi::Promise Promise()
    {
        return _deferred.Promise();
    }

private:
    std::string inputPath;
    std::string destPath;
    std::string operationKind;
    std::string sevenZlibPath;
    std::string compressPassword;
    std::string decompressPassword;
    bool success;
    std::string message;
    Napi::Promise::Deferred _deferred;
};

Napi::Value genOrDecompressMdz(const Napi::CallbackInfo& info)
{
    // js传入6个字符串参数，第1个是输入路径，第2个是输出路径，第3个是指示压缩还是解压（"compress"或"decompress"）
    // 第4个是7-Zip动态链接库路径，第5个是压缩密码（默认空字符串），第6个是解压密码（默认空字符串）
    // 在保存的最后步骤，执行压缩步骤，生成mdz文件
    Napi::Env env = info.Env();

    // 参数校验
    if (info.Length() < 6 ||
        !info[0].IsString() ||
        !info[1].IsString() || !info[2].IsString() ||
        !info[3].IsString() || !info[4].IsString() ||
        !info[5].IsString())
    {
        // 参数校验失败
        std::string msg =
            "本方法参数\n\t第1个是输入路径\n\t第2个是输出路径\n\t第3个是指示压缩还是解压（'compress'或'decompress'）\n\t第4个是7-Zip动态链接库路径\n\t第5个是压缩密码（默认空字符串）\n\t第6个是解压密码（默认空字符串）\n请传递正确的参数！";
        Napi::TypeError::New(env, msg).ThrowAsJavaScriptException();
        return env.Undefined();
    }

    std::string inputPath = info[0].As<Napi::String>();
    std::string destPath = info[1].As<Napi::String>();
    std::string instruction = info[2].As<Napi::String>();
    std::string sevenZlibPath = info[3].As<Napi::String>();
    std::string compressPassword = info[4].As<Napi::String>();
    std::string decompressPassword = info[5].As<Napi::String>();

    auto* worker = new MdzUtilsWorker(
        env,
        inputPath,
        destPath,
        instruction,
        sevenZlibPath,
        compressPassword,
        decompressPassword
    );

    worker->Queue(); // 放入Node.js的线程池执行
    auto promise = worker->Promise();
    return promise;
}

Napi::Object verifyMdzIsEncrypted(const Napi::CallbackInfo& info)
{
    // 验证mdz文件是否添加密码
    // 验证mdz文件是否添加密码并非耗时操作，因此作为同步方法足矣
    // js传入2个字符串参数，第1个参数是要验证的mdz文件路径
    // 第2个参数是7-Zip动态链接库路径
    Napi::Env env = info.Env();
    Napi::Object obj = Napi::Object::New(env);
    // 参数校验
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString())
    {
        // 参数校验失败
        const std::string msg =
            "本方法参数\n\t第1个是要验证的mdz文件路径\n\t第2个是7-Zip动态链接库路径\n请传递正确的参数！";
        Napi::TypeError::New(env, msg).ThrowAsJavaScriptException();
        return obj;
    }

    std::string inputPath = info[0].As<Napi::String>();
    std::string sevenZlibPath = info[1].As<Napi::String>();

    obj.Set("success", Napi::Boolean::New(env, true));
    obj.Set("message", Napi::Boolean::New(env, verifyMdzHasPassword(inputPath, sevenZlibPath)));
    return obj;
}

// 模块初始化，暴露函数给js
Napi::Object InitMdzUtil(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "genOrDecompressMdz"),
                Napi::Function::New(env, genOrDecompressMdz));
    exports.Set(Napi::String::New(env, "verifyMdzIsEncrypted"),
                Napi::Function::New(env, verifyMdzIsEncrypted));
    return exports;
}

// 注册模块
NODE_API_MODULE(mdz_utils, InitMdzUtil)
