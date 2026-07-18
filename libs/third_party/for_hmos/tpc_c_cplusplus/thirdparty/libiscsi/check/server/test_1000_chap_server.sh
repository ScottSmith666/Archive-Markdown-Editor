#!/bin/sh

. ./functions.sh

echo "CHAP tests"

start_target
create_lun
setup_chap

exit 0
