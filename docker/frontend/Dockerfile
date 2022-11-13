FROM node:18-alpine

WORKDIR /code

COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json

RUN npm set progress=false
RUN npm install

COPY ./frontend .

RUN npm run build

# Install pm2
RUN npm install -g pm2

# Serve the app
CMD ["pm2-runtime", "start", "npm", "--name", "clochette-frontend" ,"--", "start"]