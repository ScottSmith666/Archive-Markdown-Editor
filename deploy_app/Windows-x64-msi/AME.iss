; 脚本由 Inno Setup 脚本向导生成。
; 有关创建 Inno Setup 脚本文件的详细信息，请参阅帮助文档！

#define MyAppName "Archive Markdown Editor"
#define MyAppVersion "1.0.5"
#define MyAppPublisher "Scott Smith"
#define MyAppURL "https://archive-markdown-editor-ss.pages.dev"
#define MyAppExeName "ArchiveMarkdownEditor.exe"
#define MyAppAssocName "Archive Markdown File"
#define MyAppAssocExt ".mdz"
#define MyAppAssocKey StringChange(MyAppAssocName, " ", "") + MyAppAssocExt

#define MyAppAssocMd ".md"
#define MyAppAssocKeyMd StringChange(MyAppAssocName, " ", "") + MyAppAssocMd

#define MyAppAssocTxt ".txt"
#define MyAppAssocKeyTxt StringChange(MyAppAssocName, " ", "") + MyAppAssocTxt

[Setup]
; 注意：AppId 的值唯一标识此应用程序。不要在其他应用程序的安装程序中使用相同的 AppId 值。
; (若要生成新的 GUID，请在 IDE 中单击 "工具|生成 GUID"。)
AppId={{CFE51624-A1E2-4518-9A81-A5EE92DA2269}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\ArchiveMarkdownEditor
UninstallDisplayIcon={app}\{#MyAppExeName}
; "ArchitecturesAllowed=x64compatible" 指定
; 安装程序只能在 x64 和 Windows 11 on Arm 上运行。
ArchitecturesAllowed=x64compatible
; "ArchitecturesInstallIn64BitMode=x64compatible" 要求
; 在 X64 或 Windows 11 on Arm 上以 "64-位模式" 进行安装，
; 这意味着它应该使用本地 64 位 Program Files 目录
; 和注册表的 64 位视图。
ArchitecturesInstallIn64BitMode=x64compatible
ChangesAssociations=yes
DisableProgramGroupPage=yes
LicenseFile=C:\Users\scottsmith\Desktop\archive_markdown_editor\LICENSE
; 取消注释以下行以在非管理安装模式下运行 (仅为当前用户安装)。
;PrivilegesRequired=lowest
OutputDir=C:\Users\scottsmith\Desktop
OutputBaseFilename=ArchiveMarkdownEditor-1.0.5-win32-x64
SetupIconFile=C:\Users\scottsmith\Desktop\archive_markdown_editor\assets\app_icon\icon.ico
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"
Name: "chinesetraditional"; MessagesFile: "compiler:Languages\ChineseTraditional.isl"
Name: "english"; MessagesFile: "compiler:Languages\English.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "C:\Users\scottsmith\Desktop\archive_markdown_editor\out\ArchiveMarkdownEditor-win32-x64\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\scottsmith\Desktop\archive_markdown_editor\out\ArchiveMarkdownEditor-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; 注意：不要在任何共享系统文件上使用 "Flags: ignoreversion" 

[Registry]
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocExt}\OpenWithProgids"; ValueType: string; ValueName: "{#MyAppAssocKey}"; ValueData: ""; Flags: uninsdeletevalue
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocMd}\OpenWithProgids"; ValueType: string; ValueName: "{#MyAppAssocKeyMd}"; ValueData: ""; Flags: uninsdeletevalue
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocTxt}\OpenWithProgids"; ValueType: string; ValueName: "{#MyAppAssocKeyTxt}"; ValueData: ""; Flags: uninsdeletevalue

Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}"; ValueType: string; ValueName: ""; ValueData: "{#MyAppAssocName}"; Flags: uninsdeletekey
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKeyMd}"; ValueType: string; ValueName: ""; ValueData: "{#MyAppAssocName}"; Flags: uninsdeletekey
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKeyTxt}"; ValueType: string; ValueName: ""; ValueData: "{#MyAppAssocName}"; Flags: uninsdeletekey

Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKeyMd}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKeyTxt}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"

Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" --direct-open-file=""%1"""
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKeyMd}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" --direct-open-file=""%1"""
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKeyTxt}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" --direct-open-file=""%1"""

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

