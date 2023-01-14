FROM node:18-alpine

WORKDIR /code

ARG next_public_base_url
ENV NEXT_PUBLIC_BASE_URL=${next_public_base_url}

ARG next_public_backend_api_url
ENV NEXT_PUBLIC_BACKEND_API_URL=${next_public_backend_api_url}

# Install pm2
RUN npm install -g pm2

COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json

RUN npm set progress=false

RUN npm install

COPY ./frontend .

ENV NODE_ENV=production

RUN npm run build
