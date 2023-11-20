# When the app is set to the deployment you should add 1 important env files

Go check this [documentation](./reverse-proxy/ssl/README.md) to be able to set up https using docker in development.

## `.env` in the docker/ folder

- GITHUB_USER=\*\*\*
- GITHUB_TOKEN=\*\*\*
- REPOSITORY_NAME=\*\*\*
- REPOSITORY_OWNER=\*\*\*
- POSTGRES_PASSWORD=\*\*\*
- SECRET_KEY=\*\*\*
- BASE_ACCOUNT_USERNAME=\*\*\*
- BASE_ACCOUNT_PASSWORD=\*\*\*
- LOCALE=fr # Or en

You can have a look to the .env.sample file which should be working for development.

## The `db-shared-volume` folder

This folder is used to store the database data. It is mount as a volume for the clochette-backend container under the `/root/db-shared-volume` path.

You can use the following command to dump the database:

```bash
docker exec -it clochette-backend poetry run python app/command.py dump -o /root/db-shared-volume/dump.json
```

You can use the following command to load the database:

```bash
docker exec -it clochette-backend poetry run python app/command.py load -i /root/db-shared-volume/dump.json
```

If you want to migrate the database, you can use the following command:

```bash
docker exec -it clochette-backend poetry run python app/command.py migrate
```

## Certbot

The working of certbot is a bit complicated.
The first thing to do if you deploy on a new server is to create the certificate, then it will be renewed automatically.

Here is a breakdown of the steps to follow (be sur to be in the docker folder):

1. Install certbot on the server

```bash
sudo apt install certbot
```

2. Create the certificate for the domain

```bash
sudo certbot certonly --webroot --webroot-path /var/www/certbot/ -d clochette.h.minet.net
```

3. Create a symlink to the certificate in the docker ssl folder

```bash
sudo ln -s /etc/letsencrypt/live/clochette.h.minet.net/fullchain.pem ./ssl/clochette.h.minet.net.crt
sudo ln -s /etc/letsencrypt/live/clochette.h.minet.net/privkey.pem ./ssl/clochette.h.minet.net.key
```

4. Start the docker compose

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

5. Generate the certificate (you can use the --register-unsafely-without-email option to avoid to give an email)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d clochette.h.minet.net --register-unsafely-without-email
```

6. Create a symlink to the certificate in the docker ssl folder

```bash
sudo rm ./ssl/clochette.h.minet.net.crt
sudo rm ./ssl/clochette.h.minet.net.key
sudo ln -s ./letsencrypt/live/clochette.h.minet.net/fullchain.pem ./ssl/clochette.h.minet.net.crt
sudo ln -s ./letsencrypt/live/clochette.h.minet.net/privkey.pem ./ssl/clochette.h.minet.net.key
```

7. Restart the docker compose

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

8. Renew the certificate (to test the renewal)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot renew --dry-run
```

---

To generate the certificate, you can use the following command (the --dry-run option is used to test the command without generating the certificate)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d clochette.h.minet.net --dry-run
```

To renew the certificate, you can use the following command:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot renew --dry-run
```
