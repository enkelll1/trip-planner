# Use the official Node.js image from the Docker Hub
FROM node:20.16.0

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run unit tests
RUN npm run test

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]