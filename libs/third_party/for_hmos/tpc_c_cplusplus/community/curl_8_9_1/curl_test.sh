#!/bin/bash
# curl 基本功能测试，由于 curl 原生测试环境较为复杂，无法在交付时间内，在OpenHarmony搭建成功。因此采用脚本对核心功能进行测试。
CURL=./src/curl

# DEST_FILE=test_result_linux.txt
DEST_FILE=test_result_OpenHarmony.txt

## 测试拉取整个网页
function testWebSite() {
    URL=www.baidu.com
    TEST_SITE=./tmp.xml
    RESULT_FILE=test.xml

    busybox wget -O $RESULT_FILE $URL

    $CURL -o $TEST_SITE $URL
    if [ $? -ne 0 ]; then
        echo "run curl failed!" >> $DEST_FILE
        return -1
    fi
    cmp $RESULT_FILE $TEST_SITE
    retval=$?
    if [ $retval -ne 0 ] ;
    then
        echo "testWebSite result failed!" >> $DEST_FILE
    else
        echo "testWebSite result success!" >> $DEST_FILE
    fi

    rm $RESULT_FILE $TEST_SITE
}

## 测试拉取一个文件
function testWebData() {
    URL=http://www.baidu.com/img/bdlogo.gif
    SP="/"
    FNAME=${URL##*$SP}
    RESULT=test_$FNAME

    busybox wget -O $RESULT $URL

    $CURL -O $URL
    if [ $? -ne 0 ]; then
        echo "run curl failed!" >> $DEST_FILE
        return -1
    fi

    cmp $RESULT $FNAME
    retval=$?
    if [ $retval -ne 0 ] ;
    then
        echo "testWebData result failed!" >> $DEST_FILE
    else
        echo "testWebData result success!" >> $DEST_FILE
    fi

    rm $RESULT $FNAME
}


##测试GET请求方式
function testHttpGet() {
    URL=http://aiezu.com/test.php
    tmp=`$CURL $URL`
    res=`echo $tmp |grep -n "GET"`
    if [ -z "$res" ]; then
        echo "testHttpGet failed!" >> $DEST_FILE
        return -1
    fi

    res=`echo $tmp |grep -n "Array"`
    if [ -z "$res" ]; then
        echo "testHttpGet failed!" >> $DEST_FILE
        return -1
    fi

    echo "testHttpGet success!" >> $DEST_FILE
    return 0
}

## 测试特定方式发送GET请求数据
function testHttpGetParam(){
    URL=http://aiezu.com/test.php
    PARAMS="en=aiezu&cn=爱E族"
    tmp=`$CURL -G --data $PARAMS $URL`
    res=`echo $tmp |grep -n "GET"`
    if [ -z "$res" ]; then
        echo "testHttpGetParam failed!" >> $DEST_FILE
        return -1
    fi

    res=`echo $tmp |grep -n "Array"`
    if [ -z "$res" ]; then
        echo "testHttpGetParam failed!" >> $DEST_FILE
        return -1
    fi

    echo "testHttpGetParam success!" >> $DEST_FILE
    return 0
}

##测试POST请求方式
function testHttpPost() {
    URL=http://aiezu.com/test.php
    PARAMS="--data 'name=爱E族&site=aiezu.com' --data-urlencode 'code=/&?'"
    tmp=`$CURL $PARAMS $URL`
    res=`echo $tmp |grep -n "POST"`
    if [ -z "$res" ]; then
        echo "testHttpPost failed!" >> $DEST_FILE
        return -1
    fi

    res=`echo $tmp |grep -n "Array"`
    if [ -z "$res" ]; then
        echo "testHttpPost failed!" >> $DEST_FILE
        return -1
    fi

    echo "testHttpPost success!" >> $DEST_FILE
    return 0
}

##测试POST发送表单请求方式
function testHttpPostForm(){
    URL=http://aiezu.com/test.php
    PARAMS1="name=爱E族"
    PARAMS2="site=aiezu.com"
    tmp=`$CURL --form $PARAMS1 -F $PARAMS2 $URL`
    res=`echo $tmp |grep -n "POST"`
    if [ -z "$res" ]; then
        echo "testHttpPostForm failed!" >> $DEST_FILE
        return -1
    fi

    res=`echo $tmp |grep -n "Array"`
    if [ -z "$res" ]; then
        echo "testHttpPostForm failed!" >> $DEST_FILE
        return -1
    fi

    echo "testHttpPostForm success!" >> $DEST_FILE
    return 0
}

##测试POST请求方式上传本地文件
function testHttpPostFile() {
    URL=http://aiezu.com/test.php
    PARAMS=data.txt
   
   if [ ! -f "$PARAMS" ]; then
        echo "no test data file!" >> $DEST_FILE
        echo "testHttpPostFile failed!" >> $DEST_FILE
        return -1
   fi

    tmp=`$CURL --form file=@$PARAMS $URL`
    res=`echo $tmp |grep -n "POST"`
    if [ -z "$res" ]; then
        echo "testHttpPostFile failed!" >> $DEST_FILE
        return -1
    fi

    res=`echo $tmp |grep -n "Array"`
    if [ -z "$res" ]; then
        echo "testHttpPostFile failed!" >> $DEST_FILE
        return -1
    fi

    echo "testHttpPostFile success!" >> $DEST_FILE
    return 0
}

##测试POST请求方式上传JSON数据
function testHttpPostJson() {
    URL=http://aiezu.com/test.php
    PARAMS="{"name":"爱E族","site":"aiezu.com"}"
   
    tmp=`$CURL -H "Content-Type: application/json" --data $PARAMS $URL`
    res=`echo $tmp |grep -n "POST"`
    if [ -z "$res" ]; then
        echo "testHttpPostJson failed!" >> $DEST_FILE
        return -1
    fi

    res=`echo $tmp |grep -n "Array"`
    if [ -z "$res" ]; then
        echo "testHttpPostJson failed!" >> $DEST_FILE
        return -1
    fi

    echo "testHttpPostJson success!" >> $DEST_FILE
    return 0
}

if [ ! -f "$CURL" ]; then
    echo "no curl cmd file!" >> $DEST_FILE
    exit 1
fi

echo "Start Test CURL!" > $DEST_FILE
echo "" >> $DEST_FILE
retval=0
echo "start testWebSite" >> $DEST_FILE
testWebSite
retval=`expr $retval + $?`
echo "start testWebData" >> $DEST_FILE
testWebData
retval=`expr $retval + $?`
echo "start testHttpGet" >> $DEST_FILE
testHttpGet
retval=`expr $retval + $?`
echo "start testHttpGetParam" >> $DEST_FILE
testHttpGetParam
retval=`expr $retval + $?`
echo "start testHttpPost" >> $DEST_FILE
testHttpPost
retval=`expr $retval + $?`
echo "start testHttpPostForm" >> $DEST_FILE
testHttpPostForm
retval=`expr $retval + $?`
echo "start testHttpPostFile" >> $DEST_FILE
testHttpPostFile
retval=`expr $retval + $?`
echo "start testHttpPostJson" >> $DEST_FILE
testHttpPostJson
retval=`expr $retval + $?`
echo "" >> $DEST_FILE
echo "Test CURL OVER!!" >> $DEST_FILE

cat $DEST_FILE

if [ $retval -ne 0 ]
then
    exit 1
else
    exit 0
fi

#EOF
