#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu ReadDefectData10 test"

echo -n "SCSI.ReadDefectData10 ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.ReadDefectData10 --dataloss > /dev/null || failure
success

exit 0
