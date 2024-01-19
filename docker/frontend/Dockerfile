FROM node:20-alpine

WORKDIR /code

ARG next_public_backend_url
ENV NEXT_PUBLIC_BACKEND_URL=${next_public_backend_url}

# Install pm2
RUN npm install -g pm2

COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json

RUN npm set progress=false

RUN npm install

COPY ./frontend .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000
