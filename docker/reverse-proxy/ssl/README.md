# Using HTTPS in developement

NGINX is configured to use https. To do this, you need to :

1.  Add `clochette.dev` &rarr; `127.0.0.1` to your `hosts` file. For example, on linux, you should have something like this:

```
# Clochette
127.0.0.1 clochette.dev www.clochette.dev
```

2.  Then, add Absinthe CA's certificate and `clochette.dev` certificate to the system-wide trust store.

    - On fedora, you just have to do:

    ```
    sudo trust anchor --store absinthe.ca.crt
    ```

    - On ubuntu, you have to do:

    ```
    sudo cp absinthe.ca.crt /usr/local/share/ca-certificates
    sudo update-ca-certificates
    ```

    - On windows, you have to do:

    ```
    certutil -addstore -f "Root" absinthe.ca.crt
    ```

3.  Enjoy!

## Generate a new certificate

To generate a new certificate, you need to have `openssl` installed.

1.  Generate a csr:

```
openssl req -new -key clochette.dev.key -out clochette.dev.csr -config csr.conf
```

2.  Create the crt from the csr using the CA:

```
openssl x509 -req \
    -in clochette.dev.csr \
    -CA absinthe.ca.crt -CAkey absinthe.ca.key \
    -CAcreateserial -out new_clochette.dev.crt \
    -days 1460 \
    -sha256 -extfile cert.conf
```

3. Verify the certificate:

```
openssl x509 -in new_clochette.dev.crt -text -noout
```

4.  Replace the old certificate with the new one:

```
mv new_clochette.dev.crt clochette.dev.crt
```
