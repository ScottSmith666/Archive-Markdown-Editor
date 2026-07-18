#!/bin/sh

. ./functions.sh

echo "Header Digest tests"

start_target "nop_interval=1,nop_count=3"
enable_header_digest
create_lun

exit 0
