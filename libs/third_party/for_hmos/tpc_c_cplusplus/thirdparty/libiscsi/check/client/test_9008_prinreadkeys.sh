#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu PrinReadKeys test"

echo -n "SCSI.PrinReadKeys ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.PrinReadKeys --dataloss > /dev/null || failure
success

exit 0
