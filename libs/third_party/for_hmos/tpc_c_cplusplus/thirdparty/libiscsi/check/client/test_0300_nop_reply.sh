#!/bin/sh

. ./functions.sh

echo -n "Test that we reply to target initiated NOPs correctly ... "
./prog_noop_reply -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 > /dev/null || failure
success

exit 0
