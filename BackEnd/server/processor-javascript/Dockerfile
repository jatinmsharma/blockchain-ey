# Use with volumes:
#  - ./client/:/pirate-talk/client/
#  - /pirate-talk/client/node_modules/

FROM node:8

WORKDIR /project/sawtooth-asset

COPY package.json package-lock.json ./
RUN npm install

ENTRYPOINT npm start
