#!/bin/sh

. ./functions.sh

echo -n "SCSI.OrWrite ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.OrWrite.* --dataloss > /dev/null || failure
success

exit 0
