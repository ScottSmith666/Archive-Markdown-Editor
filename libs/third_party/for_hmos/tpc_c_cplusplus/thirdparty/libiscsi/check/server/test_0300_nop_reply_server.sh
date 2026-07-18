#!/bin/sh

. ./functions.sh

echo "NOP reply tests"

start_target "nop_interval=1,nop_count=3"
create_lun

exit 0
