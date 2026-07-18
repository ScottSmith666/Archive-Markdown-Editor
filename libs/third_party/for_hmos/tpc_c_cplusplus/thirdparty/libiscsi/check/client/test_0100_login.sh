#!/bin/sh

. ./functions.sh

echo -n "Test logging in to target ... "
../utils/iscsi-inq -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 > /dev/null || failure
success

exit 0
