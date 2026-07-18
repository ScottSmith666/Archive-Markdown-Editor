#!/bin/sh

. ./functions.sh

echo -n "SCSI.ExtendedCopy ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.ExtendedCopy.* --dataloss > /dev/null || failure
success

exit 0
