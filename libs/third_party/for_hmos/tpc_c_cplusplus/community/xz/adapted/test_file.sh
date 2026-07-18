# Copyright (c) 2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#!/bin/sh
XZ=./xz_test
success=0
failed=0

test -x "$XZ" || XZ=
if test -z "$XZ"; then
    echo "NO xz test!!"
    exit 77
fi
echo ""
echo "test good xz files"
for I in ./files/good-*.xz
do
    if "$XZ" -dc "$I" > /dev/null; then
        let success=$success+1
    else
        echo "Good file failed: $I"
        let failed=$failed+1
    fi
done

echo "test bad xz files"
for I in ./files/bad-*.xz
do
    if "$XZ" -dc "$I" > /dev/null 2>&1; then
        let failed=$failed+1
        echo "Bad file failed: $I"
    else
        let success=$success+1
    fi
done

echo "test good lzma files"
for I in ./files/good-*.lzma
do
    if "$XZ" -dc "$I" > /dev/null; then
        let success=$success+1
    else
        echo "Good file failed: $I"
        let failed=$failed+1
    fi
done

echo "test bad lzma files"
for I in ./files/bad-*.lzma
do
    if test -n "$XZ" && "$XZ" -dc "$I" > /dev/null 2>&1; then
        let failed=$failed+1
        echo "Bad file failed: $I"
    else
        let success=$success+1
    fi
done
echo ""
let total=$success+$failed
echo "XZ TEST OVER"
echo "test items : $total"
echo "SUCCESS:$success"
echo "FAILED:$failed"
#EOF
