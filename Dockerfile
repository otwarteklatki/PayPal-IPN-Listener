# Base
FROM node:16-slim as node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm install

ENV HOST 0.0.0.0
EXPOSE 8080
# start command
CMD ["node", "index.js"]