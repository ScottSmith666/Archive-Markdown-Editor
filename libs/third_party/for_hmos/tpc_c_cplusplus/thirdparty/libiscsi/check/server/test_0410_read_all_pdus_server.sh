#!/bin/sh

. ./functions.sh

echo "Test that a single call to iscsi_service will process all queued PDUs"

start_target
create_lun

exit 0
