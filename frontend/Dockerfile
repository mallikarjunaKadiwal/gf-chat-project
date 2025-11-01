# --- Stage 1: Build the React App ---
# Use an official Node.js image
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This leverages Docker's build cache
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the app for production. The files will be in /app/build
RUN npm run build

# --- Stage 2: Serve with Nginx ---
# Use a lightweight, stable Nginx image
FROM nginx:stable-alpine

# Copy the built files from Stage 1 (from /app/build)
# into Nginx's default public HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# We will mount our custom nginx.conf using docker-compose,
# so we don't need to copy it here.

# Expose port 80 (the default Nginx port)
EXPOSE 80

# The default command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]