#!/bin/bash

# MIT License
# Copyright (c) 2022-present MoyuScript
# See: https://mit-license.org/

echo "Input path: $1"
echo "With subset: $2"
echo "Custom text file: $3"

# Get current file directory
current_dir=$(dirname "$0")

text_file="$current_dir/font-compress-subset-text.txt"

if [ -f "$3" ]; then
    text_file="$3"
fi

# Compress font
compress() {
    # Get file basename
    file_basename=$(basename "$1")
    # Get file extension
    file_extension="${file_basename##*.}"
    # Get file name without extension
    file_name="${file_basename%.*}"

    if [ "$2" = "true" ]; then
        echo "Make subset for $1 with $text_file"
        fonttools subset "$1" --text-file="$text_file" --output-file="$file_name.subset.$file_extension"
        echo "Compressing $1.subset"
        fonttools ttLib.woff2 compress "$file_name.subset.$file_extension" -o "$file_name.subset.woff2"
    else
        echo "Compressing $1"
        fonttools ttLib.woff2 compress "$1" -o "$file_name.woff2"
    fi
}

# Is directory?
if [ -d "$1" ]; then
    echo "Directory"
    for file in "$1"/*.{ttf,otf}; do
        compress "$file" "$2"
    done
else
    echo "File"
    compress "$1" "$2"
fi