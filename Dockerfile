FROM node:20.18

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . . 

EXPOSE 3333

CMD ["npm", "run", "dev"]
