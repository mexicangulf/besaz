#!/bin/bash

FILE_URL="https://raw.githubusercontent.com/mexicangulf/besaz/refs/heads/main/install.js"
FILE_NAME="install.js"

echo "Downloading necessary scripts"
curl -o $FILE_NAME $FILE_URL

if [ $? -ne 0 ]; then
    echo "Failed to download file."
    exit 1
fi

echo "Installing necessary packages"
npm install inquirer

echo "Running ${FILE_NAME}..."
node $FILE_NAME