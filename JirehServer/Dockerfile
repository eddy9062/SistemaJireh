FROM node:18-alpine as deps
# Instala nano
RUN apk add --no-cache nano
WORKDIR /Server
COPY package.json . 

RUN npm install

COPY . .

EXPOSE 3000
CMD npm start
