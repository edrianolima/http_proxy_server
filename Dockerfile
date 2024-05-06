# Use the Node.js image as the base
FROM node:latest

# Create and set the working directory in the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY . .

# Expose port 4000 to the outside world
EXPOSE 4000

# Command to start the server when the container runs
CMD ["npm", "start"]
