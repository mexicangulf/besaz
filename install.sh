#!/bin/bash

set -e

GITHUB_RAW_URL="https://raw.githubusercontent.com/mexicangulf/besaz/refs/heads/main/install.js"
SCRIPT_NAME="install.js"

echo "Downloading necessary scripts"
curl -L $GITHUB_RAW_URL -o $SCRIPT_NAME

echo "Installing necessary packages"
npm install inquirer

echo "Running the script..."
node $SCRIPT_NAME