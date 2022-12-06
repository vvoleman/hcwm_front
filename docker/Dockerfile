# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "run", "serve" ]

#FROM nginx:stable-alpine as production-stage
#COPY ./dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]