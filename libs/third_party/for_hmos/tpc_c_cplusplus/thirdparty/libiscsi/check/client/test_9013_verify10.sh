#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu Verify10 test"

echo -n "SCSI.Verify10 ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.Verify10 --dataloss > /dev/null || failure
success

exit 0
