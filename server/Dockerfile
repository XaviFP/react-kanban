FROM node:lts-slim

RUN mkdir -p /usr/src/app

RUN npm install

WORKDIR /usr/src/app

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "server" ]
