FROM node:18-alpine

WORKDIR /code

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_URL=https://clochette.minet.net
ENV NEXT_PUBLIC_BACKEND_API_URL=https://clochette.minet.net/api/v1


COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json

# Install pm2
RUN npm install -g pm2

RUN npm install

COPY ./frontend .

RUN npm run build
