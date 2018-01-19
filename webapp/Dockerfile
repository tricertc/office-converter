FROM node:alpine

RUN mkdir -p /src/app
WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:watch" ]