FROM node:17.8.0

RUN apt-get update && \
    npm install -g npm@latest

RUN yarn install

WORKDIR /bot
COPY . /bot

EXPOSE 8000

CMD ["npm", "run", "start"]