// 本地多媒体资源协议名（必须与 src/main/media-protocol.js 中注册的同名常量保持一致）
export const MEDIA_PROTOCOL = "mdz-media-protocol";

// 把“真实绝对文件路径”转换成媒体协议URL
// 旧写法是 "file://" + 路径，依赖主进程关闭同源策略才能加载；
// 现在改走自定义协议，由主进程校验后受控地代理本地文件
export const toMediaUrl = (absolutePath) =>
    `${MEDIA_PROTOCOL}://media?path=${encodeURIComponent(absolutePath)}`;

// Markdown 里的媒体路径允许出现 %20 这类转义（裸空格会打断Markdown解析，
// 复制mdz媒体代码时也是用 encodeURI 写入的），旧写法把它拼进 file:// 后由内核解码。
// 这里显式还原为真实文件路径；遇到 %zz 这类非法转义时保持原样，避免抛异常打断渲染。
export const decodeMediaPath = (markdownPath) => {
    try {
        return decodeURI(markdownPath);
    } catch (e) {
        return markdownPath;
    }
};
