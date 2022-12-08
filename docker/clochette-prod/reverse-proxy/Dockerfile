FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html/

# Clean the default public folder
RUN rm -rf * .??*

# Copy configuration files
COPY ./docker/clochette-prod/reverse-proxy/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/clochette-prod/reverse-proxy/general.conf /etc/nginx/conf.d/general.conf
COPY ./docker/clochette-prod/reverse-proxy/security.conf /etc/nginx/conf.d/security.conf
COPY ./docker/clochette-prod/reverse-proxy/proxy.conf /etc/nginx/conf.d/proxy.conf
COPY ./docker/clochette-prod/reverse-proxy/clochette.minet.net.conf /etc/nginx/sites-available/clochette.minet.net.conf
RUN chmod 0644 /etc/nginx/conf.d/*
RUN chmod 0644 /etc/nginx/sites-available/clochette.minet.net.conf
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/clochette.minet.net.conf /etc/nginx/sites-enabled/clochette.minet.net.conf

# Copy Diffie-Hellman ciphersuites
COPY ./docker/clochette-prod/reverse-proxy/ssl/dhparam.pem /etc/nginx/dhparam.pem

# Set up environment variables
ENV NGINX_HOST=clochette.minet.net
