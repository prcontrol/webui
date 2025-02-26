FROM node:lts-alpine AS build

ARG BACKEND_URL

WORKDIR /app

COPY . .
RUN npm install
RUN VUE_APP_PRCONTROL_API_URL=$BACKEND_URL npm run build

FROM node:lts-alpine
RUN npm install -g http-server

COPY --from=build /app/dist /dist

WORKDIR /dist

EXPOSE 8080
CMD [ "http-server", "-p", "8080", "-a", "0.0.0.0" ]
