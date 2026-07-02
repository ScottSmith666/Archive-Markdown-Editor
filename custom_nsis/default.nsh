!macro customInstall
  ; 定义你的 ProgID（必须和 electron-builder 生成的一致）
  ; 通常是 ${APP_ID}.txt 或 ${APP_PACKAGE_NAME}.txt
  ; 如果不确定，可用 ProductName 自定义 ProgID，但这里我们用内置变量组合

  ; ---- 把 .txt 指向 ProgID ----
  WriteRegStr HKCR ".txt" "" "${APP_ID}.txt"
  WriteRegStr HKCR ".txt\OpenWithProgids" "${APP_ID}.txt" ""
  WriteRegStr HKCR "${APP_ID}.txt" "" "Text文件"
  WriteRegStr HKCR "${APP_ID}.txt\DefaultIcon" "" "$INSTDIR\resources\app.asar.unpacked\resources\icon.ico"
  ; 写入自定义 command，注意参数用 --direct-open-file="%1"
  WriteRegStr HKCR "${APP_ID}.txt\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --direct-open-file="%1"'

  ; 如果还关联了其他扩展，同样处理
  WriteRegStr HKCR ".md" "" "${APP_ID}.md"
  WriteRegStr HKCR ".md\OpenWithProgids" "${APP_ID}.md" ""
  WriteRegStr HKCR "${APP_ID}.md" "" "Markdown文件"
  WriteRegStr HKCR "${APP_ID}.md\DefaultIcon" "" "$INSTDIR\resources\app.asar.unpacked\resources\icon.ico"
  WriteRegStr HKCR "${APP_ID}.md\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --direct-open-file="%1"'

  WriteRegStr HKCR ".mdz" "" "${APP_ID}.mdz"
  WriteRegStr HKCR ".mdz\OpenWithProgids" "${APP_ID}.mdz" ""
  WriteRegStr HKCR "${APP_ID}.mdz" "" "Archive Markdown文件"
  WriteRegStr HKCR "${APP_ID}.mdz\DefaultIcon" "" "$INSTDIR\resources\app.asar.unpacked\resources\icon.ico"
  WriteRegStr HKCR "${APP_ID}.mdz\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --direct-open-file="%1"'
!macroend

!macro customUninstall
  DeleteRegKey HKCR ".txt"
  DeleteRegKey HKCR "${APP_ID}.txt"
  DeleteRegKey HKCR ".md"
  DeleteRegKey HKCR "${APP_ID}.md"
  DeleteRegKey HKCR ".mdz"
  DeleteRegKey HKCR "${APP_ID}.mdz"

  SetShellVarContext current
  RMDir /r "$PROFILE\.ame_conf"
!macroend
