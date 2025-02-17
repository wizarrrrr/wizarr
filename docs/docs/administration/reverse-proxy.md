# Reverse Proxy

Users can deploy a custom reverse proxy that forwards requests to Wizarr. This way, the reverse proxy can handle TLS termination, load balancing, or other advanced features. All reverse proxies between Wizarr and the user must forward all headers and set the `Host`, `X-Real-IP`, `X-Forwarded-Proto` and `X-Forwarded-For` headers to their appropriate values. By following these practices, you ensure that all custom reverse proxies are fully compatible with Wizarr.

:::caution
Wizarr does not support being served on a sub-path such as `location /wizarr {`. It has to be served on the root path of a (sub)domain.
:::

### Nginx example config

Below is an example config for nginx. Make sure to set `public_url` to the front-facing URL of your instance, and `backend_url` to the path of the Wizarr server.

```nginx
server {
    server_name <public_url>;

    # allow large file uploads
    client_max_body_size 50000M;

    # Set headers
    proxy_set_header Host              $http_host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # enable websockets: http://nginx.org/en/docs/http/websocket.html
    proxy_http_version 1.1;
    proxy_set_header   Upgrade    $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_redirect     off;

    # set timeout
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
    send_timeout       600s;

    location / {
        proxy_pass http://<backend_url>:5690;
    }
}
```

#### Compatibility with Let's Encrypt

In the event that your nginx configuration includes a section for Let's Encrypt, it's likely that you have a segment similar to the following:

```nginx
location ~ /.well-known {
    ...
}
```

This particular `location` directive can inadvertently prevent mobile clients from reaching the `/.well-known/wizarr` path, which is crucial for discovery. Usual error message for this case is: "Your app major version is not compatible with the server". To remedy this, you should introduce an additional location block specifically for this path, ensuring that requests are correctly proxied to the Wizarr server:

```nginx
location = /.well-known/wizarr {
    proxy_pass http://<backend_url>:2283;
}
```

By doing so, you'll maintain the functionality of Let's Encrypt while allowing mobile clients to access the necessary Wizarr path without obstruction.

### Caddy example config

As an alternative to nginx, you can also use [Caddy](https://caddyserver.com/) as a reverse proxy (with automatic HTTPS configuration). Below is an example config.

```
wizarr.example.org {
    reverse_proxy http://<snip>:5690
}
```

### Apache example config

Below is an example config for Apache2 site configuration.

```ApacheConf
<VirtualHost *:80>
   ServerName <snip>
   ProxyRequests Off
   # set timeout in seconds
   ProxyPass / http://127.0.0.1:5690/ timeout=600 upgrade=websocket
   ProxyPassReverse / http://127.0.0.1:5690/
   ProxyPreserveHost On
</VirtualHost>
```

### Traefik Proxy example config

The example below is for Traefik version 3.

`traefik.yaml`

```yaml
[...]
entryPoints:
  websecure:
    address: :443
```

The second part is in the `docker-compose.yml` file where wizarr is in. Add the Traefik specific labels like in the example.

`docker-compose.yml`

```yaml
services:
  wizarr-server:
    [...]
    labels:
      traefik.enable: true
      # increase readingTimeouts for the entrypoint used here
      traefik.http.routers.wizarr.entrypoints: websecure
      traefik.http.routers.wizarr.rule: Host(`wizarr.your-domain.com`)
      traefik.http.services.wizarr.loadbalancer.server.port: 2283
```

Keep in mind, that Traefik needs to communicate with the network where Wizarr is in, usually done
by adding the Traefik network to the `wizarr-server`.
