FROM node:18.12.1-alpine3.16

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn seed-data

EXPOSE 3000

CMD [ "yarn", "dev" ]
