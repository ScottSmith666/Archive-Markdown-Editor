#!/bin/sh

. ./functions.sh

echo "Test that a single call to iscsi_service will process all queued PDUs"

echo -n "Test reading all queued PDUs in a single iscsi_service() call ... "
./prog_read_all_pdus -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 || failure
success

exit 0
