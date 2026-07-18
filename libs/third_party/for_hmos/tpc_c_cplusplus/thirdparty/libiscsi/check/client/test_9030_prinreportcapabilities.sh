#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu PrinReportCapabilities test"

echo -n "SCSI.PrinReportCapabilities ... "
../test-tool/iscsi-test-cu -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 -t SCSI.PrinReportCapabilities --dataloss > /dev/null || failure
success

exit 0
