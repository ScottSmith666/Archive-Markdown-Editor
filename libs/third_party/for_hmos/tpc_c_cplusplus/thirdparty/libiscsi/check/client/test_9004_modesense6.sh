#!/bin/sh

. ./functions.sh

echo -n "SCSI.ModeSense6 ... "

../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.ModeSense6 --dataloss > /dev/null || failure
success

exit 0
