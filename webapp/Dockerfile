FROM node:alpine

RUN mkdir -p /src/app
WORKDIR /src/app

RUN apk update
RUN apk add qpdf

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:watch" ]