#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu Write10 test"

echo -n "SCSI.Write10 ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.Write10 --dataloss > /dev/null || failure
success

exit 0
