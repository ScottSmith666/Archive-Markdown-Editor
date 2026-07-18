#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu ProutRegister test"

echo -n "SCSI.ProutRegister ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.ProutRegister --dataloss > /dev/null || failure
success

exit 0
