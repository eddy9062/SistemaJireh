FROM node:18
WORKDIR /Server
COPY package.json  . 
RUN npm install

COPY . .
CMD npm start
