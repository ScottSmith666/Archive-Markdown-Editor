#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu TestUnitReady test"

echo -n "SCSI.TestUnitReady ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.TestUnitReady --dataloss > /dev/null || failure
success

exit 0
