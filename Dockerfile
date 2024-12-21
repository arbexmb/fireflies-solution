FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:22-slim

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY package.json ./
COPY --from=build /app /app

EXPOSE 3000