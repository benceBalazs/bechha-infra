# Use the official Node.js image from the Docker Hub
FROM node:20

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (optional, you can also use a .env file or Docker Compose)
ENV NODE_ENV=production

# Start the application
CMD [ "npm", "start" ]