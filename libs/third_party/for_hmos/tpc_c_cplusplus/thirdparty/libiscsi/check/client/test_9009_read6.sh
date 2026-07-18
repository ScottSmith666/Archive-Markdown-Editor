#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu Read6 test"

echo -n "SCSI.Read6 ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.Read6 --dataloss > /dev/null || failure
success

exit 0
