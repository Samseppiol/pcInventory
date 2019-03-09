#!/bin/bash
 
echo "Build the binary"
env GOOS=linux GOARCH=amd64 go build -o ./tmp/main pcInventory
 
echo "Create a ZIP file"
zip -j ./tmp/main.zip ./tmp/main

echo "Cleanup"
rm ./tmp/main

