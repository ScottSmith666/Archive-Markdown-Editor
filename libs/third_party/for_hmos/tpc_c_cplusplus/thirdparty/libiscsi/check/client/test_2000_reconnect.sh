#!/bin/sh

. ./functions.sh

echo -n "Test reading from the LUN when a reconnect happens ... "
./prog_reconnect -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 > /dev/null || failure
success

exit 0
