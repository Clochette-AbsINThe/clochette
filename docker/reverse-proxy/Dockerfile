FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html/

# Clean the default public folder
RUN rm -rf * .??*

# Copy configuration files
COPY ./docker/reverse-proxy/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/reverse-proxy/general.conf /etc/nginx/conf.d/general.conf
COPY ./docker/reverse-proxy/security.conf /etc/nginx/conf.d/security.conf
COPY ./docker/reverse-proxy/proxy.conf /etc/nginx/conf.d/proxy.conf
COPY ./docker/reverse-proxy/clochette.dev.conf /etc/nginx/sites-available/clochette.dev.conf
RUN chmod 0644 /etc/nginx/conf.d/*
RUN chmod 0644 /etc/nginx/sites-available/clochette.dev.conf
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/clochette.dev.conf /etc/nginx/sites-enabled/clochette.dev.conf

# Copy certificate
RUN mkdir -p /etc/nginx/ssl
COPY ./docker/reverse-proxy/ssl/clochette.dev.key /etc/nginx/ssl/clochette.dev.key
COPY ./docker/reverse-proxy/ssl/clochette.dev.crt /etc/nginx/ssl/clochette.dev.crt
RUN chmod 0644 /etc/nginx/ssl/*

# Copy Diffie-Hellman ciphersuites
COPY ./docker/reverse-proxy/ssl/dhparam.pem /etc/nginx/dhparam.pem

# Set up environment variables
ENV NGINX_HOST=clochette.dev
