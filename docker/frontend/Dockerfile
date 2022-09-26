FROM nginx:1.23

WORKDIR /etc/nginx

COPY ./docker/frontend/nginxconfig.io-clochette.dev.tar.gz ./nginxconfig.io-clochette.dev.tar.gz
RUN tar -xzvf nginxconfig.io-clochette.dev.tar.gz --strip-components=2

# Copy the public folder (astro build must be run before this!)
RUN mkdir -p /var/www/clochette.dev/public
COPY ./frontend/dist /var/www/clochette.dev/public
RUN chmod -R 0755 /var/www/clochette.dev

# Set up environment variables
ENV NGINX_HOST=clochette.dev

# Open port
EXPOSE 80
