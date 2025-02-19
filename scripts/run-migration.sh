#!/bin/bash

# Check if an argument is provided
if [ $# -eq 0 ]; then
  echo "Error: Please provide 'up' or 'down' as an argument"
  exit 1
fi


DIRECTION=$1

# Source the .env file
if [ -f ".env" ]; then
  export $(cat ".env" | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
else
  echo "Error: .env file not found"
  exit 1
fi

DB_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
DATABASE_URL=$DB_URL npm run migrate $DIRECTION

