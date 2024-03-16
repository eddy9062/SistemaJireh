FROM node:18-alpine
ENV DB_HOST="localhost"
ENV DB_LOCAL_PORT=3306
ENV DB_DOCKER_PORT=3306
ENV DB_USER=user
ENV DB_PASSWORD=pass
ENV DB_DATABASE=db
WORKDIR /Server
COPY package.json . 

RUN npm install

COPY . .

EXPOSE 3000
CMD npm start
