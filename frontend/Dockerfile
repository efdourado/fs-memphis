FROM node:18-alpine AS build
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build