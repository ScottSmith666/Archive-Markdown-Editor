#!/bin/bash
cd $1 && find jbig2enc |grep "allheaders.h" -rF | awk -F : '{print $1}' | xargs sed -i 's/<leptonica\/allheaders\.h>/<allheaders\.h>/g'
