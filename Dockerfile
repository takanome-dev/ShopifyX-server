FROM node:18.12.1-alpine3.16

WORKDIR /app

RUN addgroup app && adduser -S -G app app

USER app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]
