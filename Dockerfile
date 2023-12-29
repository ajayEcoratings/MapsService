FROM node:18
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY . .
# Install application dependencies
RUN npm  install
# Build the application (if necessary)
#RUN npm run build
# Expose a port if your application listens on a specific port
EXPOSE 3100
# Command to start the application
CMD npm start
