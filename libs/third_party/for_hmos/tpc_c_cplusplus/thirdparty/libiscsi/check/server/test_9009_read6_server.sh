#!/bin/sh

. ./functions.sh

echo "iscsi-test-cu Read6 test"

start_target
create_disk_lun 1 100M

exit 0
