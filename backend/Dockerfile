FROM node:19-alpine

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

CMD ["sh", "-c", "yarn seeder && yarn start"]