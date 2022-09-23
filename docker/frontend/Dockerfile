FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

# Clean the default public folder
RUN rm -rf * .??*

# Copy configuration files
COPY ./docker/frontend/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/frontend/general.conf /etc/nginx/conf.d/general.conf
COPY ./docker/frontend/security.conf /etc/nginx/conf.d/security.conf
COPY ./docker/frontend/proxy.conf /etc/nginx/conf.d/proxy.conf
COPY ./docker/frontend/clochette.dev.conf /etc/nginx/sites-available/clochette.dev.conf
RUN chmod 0644 /etc/nginx/conf.d/*
RUN chmod 0644 /etc/nginx/sites-available/clochette.dev.conf
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/clochette.dev.conf /etc/nginx/sites-enabled/clochette.dev.conf

# Copy certificate
RUN mkdir -p /etc/nginx/ssl
COPY ./docker/frontend/ssl/clochette.dev.key /etc/nginx/ssl/clochette.dev.key
COPY ./docker/frontend/ssl/clochette.dev.crt /etc/nginx/ssl/clochette.dev.crt
RUN chmod 0644 /etc/nginx/ssl/*

# Copy Diffie-Hellman ciphersuites
COPY ./docker/frontend/ssl/dhparam.pem /etc/nginx/dhparam.pem

# Copy the public folder (astro build must be run before this!)
RUN mkdir -p /var/www/clochette.dev/public
COPY ./frontend/dist /var/www/clochette.dev/public
RUN chmod -R 0755 /var/www/clochette.dev

# Set up environment variables
ENV NGINX_HOST=clochette.dev

# Open port
EXPOSE 80
