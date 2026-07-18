#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu Prefetch10 test"

echo -n "SCSI.Prefetch10 ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.Prefetch10.* --dataloss > /dev/null || failure
success

exit 0
