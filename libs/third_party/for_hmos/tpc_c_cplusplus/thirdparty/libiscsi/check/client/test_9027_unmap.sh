#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu Unmap test"

echo -n "SCSI.Unmap ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.Unmap --dataloss > /dev/null || failure
success

exit 0
