FROM node:16

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

RUN yarn tsc

CMD ["yarn", "start"]