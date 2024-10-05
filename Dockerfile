FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY build/ build/
RUN ls

USER node

CMD [ "npm", "start" ]

EXPOSE 80