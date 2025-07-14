FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD sh -c "npm run start:$NODE_ENV"
