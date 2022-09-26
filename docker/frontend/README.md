# Using HTTPS in developement

NGINX is configured to use https. To do this, you need to :

1.  Add `clochette.dev` &rarr; `127.0.0.1` to your `hosts` file. For example, on linux, you should have something like this:

```conf
# Clochette
127.0.0.1 clochette.dev www.clochette.dev
```

2.  Then, add Absinthe CA's certificate and `clochette.dev` certificate to your system trusted certificates.

On fedora, you just have to do:

```bash
$> sudo trust anchor --store absinthe.ca.pem
$> sudo trust anchor --store clochette.dev.crt
```

On Ubuntu:

```bash
$> sudo apt-get install -y ca-certificates
$> sudo cp /path/to/CAKeyToRegister.pem /usr/local/share/ca-certificates/CAClochette.crt
$> sudo update-ca-certificates
```

3.  Enjoy!
