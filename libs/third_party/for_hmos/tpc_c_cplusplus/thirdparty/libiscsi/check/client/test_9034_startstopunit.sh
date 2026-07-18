#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu StartStopUnit test for fixed media"

echo -n "SCSI.StartStopUnit ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.StartStopUnit --dataloss > /dev/null || failure
success

exit 0
