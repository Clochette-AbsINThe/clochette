FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html/

ARG host_arg
ENV HOST=$host_arg

# Clean the default public folder
RUN rm -rf * .??*

# Copy the nginx template file
COPY ./docker/reverse-proxy/template.conf ./template.conf

# Create the dynamic configuration file with the correct host
RUN apk add gettext libintl && \
    cp /usr/bin/envsubst /usr/local/bin/envsubst && \
    chmod +x /usr/local/bin/envsubst
RUN mkdir -p /etc/nginx/sites-available
RUN envsubst '$HOST' < ./template.conf > /etc/nginx/sites-available/$host_arg.conf
RUN rm ./template.conf

# Copy configuration files
COPY ./docker/reverse-proxy/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/reverse-proxy/general.conf /etc/nginx/conf.d/general.conf
COPY ./docker/reverse-proxy/security.conf /etc/nginx/conf.d/security.conf
COPY ./docker/reverse-proxy/proxy.conf /etc/nginx/conf.d/proxy.conf


RUN chmod 0644 /etc/nginx/conf.d/*
RUN chmod 0644 /etc/nginx/sites-available/$host_arg.conf

RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/$host_arg.conf /etc/nginx/sites-enabled/$host_arg.conf

# Copy Diffie-Hellman ciphersuites
COPY ./docker/reverse-proxy/ssl/dhparam.pem /etc/nginx/dhparam.pem

# Set up environment variables
ENV NGINX_HOST=$host_arg