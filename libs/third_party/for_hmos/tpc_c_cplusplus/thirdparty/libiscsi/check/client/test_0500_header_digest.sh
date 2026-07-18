#!/bin/sh

. ./functions.sh

echo -n "Test that we can connect to a target requiring Header Digest ..."
./prog_header_digest -i ${IQNINITIATOR} iscsi://${TGTPORTAL}/${IQNTARGET}/1 > /dev/null || failure
success

exit 0
