{
  "targets": [
    {
      "target_name": "mdz_utils",
      "sources": [ "src/main.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "./include/bit7z"  # <--- 在这里添加你的头文件目录
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "BUILDING_NODE_EXTENSION",
        "NAPI_CPP_EXCEPTIONS",
        "BIT7Z_USE_NATIVE_STRING",
        "BIT7Z_AUTO_FORMAT"
      ],

      # 针对 macOS (Xcode) 开启异常
      "xcode_settings": {
        "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "GCC_OPTIMIZATION_LEVEL": "3",
        "GCC_GENERATE_DEBUGGING_SYMBOLS": "NO",  # 关闭调试符号，减小体积
        "DEAD_CODE_STRIPPING": "YES",  # 去除死代码
        "OTHER_CPLUSPLUSFLAGS": [
          "-O3",
          "-ffast-math",  # 允许更激进的浮点运算优化
          "-flto"  # 开启链接时优化 (Link Time Optimization)，这能跨文件优化代码
        ]
      },

      # 针对 Linux 开启异常
      "cflags_cc": [
        "-fexceptions",
        "-std=c++17",
        "-O3",
        "-fno-omit-frame-pointer", # (可选) 有助于性能分析
        "-flto"  # 开启链接时优化，进一步提速
      ],

      "ldflags": [
        "-flto"  # 如果开启了flto，链接阶段也需要加上
      ],

      # 针对 Windows 开启异常
      "msvs_settings": {
        "VCCLCompilerTool": {
          "AdditionalOptions": [ "-std:c++17", "/EHa" ],
          "ExceptionHandling": 1,
          "Optimization": 3,  # 3 对应 /Ox (Full Optimization)
          "FavorSizeOrSpeed": 1,  # 1 对应 /Ot (Favor Fast Code)
          "WholeProgramOptimization": "true",  # 开启全程序优化 (LTCG)
        },
        "VCLinkerTool": {
          "LinkTimeCodeGeneration": 1  # 配合全程序优化
        }
      },

      # 链接库文件配置
      "conditions": [
        ["OS=='win'", {
          "conditions": [
            ["target_arch=='x64'", {
              "sources": [ "" ],
              "libraries": [ "" ]
            }],
            ["target_arch=='arm64'", {
              "defines": [ "" ],
              "sources": [ "" ],
              "libraries": [ "" ]
            }]
          ]
        }],
        ["OS=='linux'", {
          "conditions": [
            ["target_arch=='x64'", {
              "libraries": [ "" ]
            }],
            ["target_arch=='arm64'", {
              "libraries": [ "" ]
            }]
          ]
        }],
        ["OS=='mac'", {
          "conditions": [
            ["target_arch=='x64'", {
              "libraries": [ "" ],
              "cflags_cc": [ "-std=c++17", "-stdlib=libc++" ]
            }],
            ["target_arch=='arm64'", {
              "libraries": [ "../lib/darwin/arm64/libbit7z64.a" ],
              "cflags_cc": [ "-std=c++17", "-stdlib=libc++" ]
            }]
          ]
        }]
      ]
    }
  ]
}
