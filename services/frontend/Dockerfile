FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Add environment variables for React development server
ENV WDS_SOCKET_PORT=0
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development

EXPOSE 3000

# Use a shell form of CMD to ensure proper signal handling
CMD ["sh", "-c", "npm start"] 