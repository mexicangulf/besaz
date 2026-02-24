#!/bin/bash

set -e

GITHUB_RAW_URL="https://github.com/mexicangulf/besaz"
SCRIPT_NAME="install.js"

echo "Downloading necessary scripts"
curl -L $GITHUB_RAW_URL -o $SCRIPT_NAME

echo "Installing necessary packages"
npm install inquirer

echo "Running the script..."
node $SCRIPT_NAME