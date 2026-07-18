#!/bin/sh

ERROR_MSG="run bsdiff demo failed!"
SUCCESS_MSG="run bsdiff demo over!!"

BSDIFF=bsdiff
BSPATCH=bspatch
OLD_FILE=note.txt
DIFF_NEW_FILE=note_new.txt
PATCH_FILE=note.patch
PATCH_NEW_FILE=note_news.txt
MD5_CMD=md5sum

if [[ ! -z "$1" ]] &&  [[ $1 == "linux" ]]; then
TEST_RESULT_FILE=test_result_linux.txt
else
TEST_RESULT_FILE=test_result_ohos.txt
BSDIFF=bsdiff_example
BSPATCH=bspatch_example
fi

echo ""
echo "bsdiff demo run notice:"
echo "the demo file[$BSDIFF/$BSPATCH] &&"
echo "the test file[note.txt/note_new.txt]"
echo "must be setted the same folder with $0"
echo ""

if [[ ! -f "$BSDIFF" ]] || [[ ! -f "$BSPATCH" ]]; then
	echo "no test demo file!"
	echo $ERROR_MSG > $TEST_RESULT_FILE
	exit 1
fi

if [[ ! -f "$OLD_FILE" ]] || [[ ! -f "$DIFF_NEW_FILE" ]]; then
	echo "this test demo need a old file(note.txt) and a new file(note_new.txt)!"
	echo $ERROR_MSG > $TEST_RESULT_FILE
	exit 1
fi

echo "start run bsdiff test" > $TEST_RESULT_FILE
./$BSDIFF $OLD_FILE $DIFF_NEW_FILE $PATCH_FILE

if [ $? -ne 0 ]; then
	echo "run bsdiff test failed!" >> $TEST_RESULT_FILE
	echo $ERROR_MSG >> $TEST_RESULT_FILE
	exit 1
fi
echo "run bsdiff test success!" >> $TEST_RESULT_FILE
echo "" >> $TEST_RESULT_FILE

echo "start run bspatch test" >> $TEST_RESULT_FILE
./$BSPATCH $OLD_FILE $PATCH_NEW_FILE $PATCH_FILE
if [[ $? -ne 0 ]] || [[ ! -f "$PATCH_NEW_FILE" ]]; then
	echo "run bspatch test failed!" >> $TEST_RESULT_FILE
	echo $ERROR_MSG >> $TEST_RESULT_FILE
	exit 1
fi
echo "run bspatch test success!" >> $TEST_RESULT_FILE
echo "" >> $TEST_RESULT_FILE

echo "start compare diff new file and patch new file:" >> $TEST_RESULT_FILE
MD5_OLD=`$MD5_CMD $DIFF_NEW_FILE`
MD5_OLD=${MD5_OLD:0:32}
echo "$MD5_OLD" >> $TEST_RESULT_FILE
MD5_NEW=`$MD5_CMD $DIFF_NEW_FILE`
MD5_NEW=${MD5_NEW:0:32}
echo "$MD5_NEW" >> $TEST_RESULT_FILE

if [ "$MD5_OLD" = "$MD5_NEW" ]; then
	echo "check MD5 success" >> $TEST_RESULT_FILE
else
	echo "check MD5 failed" >> $TEST_RESULT_FILE
fi
echo "" >> $TEST_RESULT_FILE
echo "#########################" >> $TEST_RESULT_FILE
echo $SUCCESS_MSG >> $TEST_RESULT_FILE
echo "#########################" >> $TEST_RESULT_FILE
echo "" >> $TEST_RESULT_FILE

cat $TEST_RESULT_FILE

#eof

