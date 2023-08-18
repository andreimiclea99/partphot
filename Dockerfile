# Fetching the latest node image on alpine linux
FROM node:alpine

# Setting up the work directory for React app
WORKDIR /react-app

# Installing dependencies for React app
COPY ./my-photo-app/package.json ./
RUN npm install

# Copying all the files from React folder
COPY ./my-photo-app ./

# Setup for Node.js backend
WORKDIR /backend
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend ./

# Copy the start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 3000 for the Node.js server
EXPOSE 3000

# Start both apps using the script
CMD ["/start.sh"]
