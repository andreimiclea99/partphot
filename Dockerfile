# Stage 1: Build the React frontend
FROM node:14-alpine as build-front
WORKDIR /app
COPY my-photo-app/package.json my-photo-app/package-lock.json ./
RUN npm ci
COPY my-photo-app/ ./
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:14-alpine as build-back
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Setup the final Docker image
FROM node:14-alpine as final
WORKDIR /app

# Copy the Node.js backend
COPY --from=build-back /app /app

# Copy the React frontend to the public directory
COPY --from=build-front /app/build ./public

# Expose port 3000 for the Node.js server
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]
