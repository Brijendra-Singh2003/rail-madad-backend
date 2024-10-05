FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY build/ build/

USER node

CMD [ "npm", "start" ]

EXPOSE 80