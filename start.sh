#!/bin/sh

# Start the React app in the background
cd /react-app && npm start &

# Start the Node.js app in the foreground
cd /backend && node server.js
