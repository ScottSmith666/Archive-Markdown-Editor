#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu OrWrite test"

start_target
create_disk_lun 1 100M

exit 0
