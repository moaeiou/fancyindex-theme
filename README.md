# fancyindex-theme

A modern, dependency-free theme for Nginx Fancy Index.

## 🚀 Features

Forked from <https://github.com/Naereen/Nginx-Fancyindex-Theme>

- Lightweight: plain HTML, CSS, and JavaScript
- Responsive file listing with light and dark themes
- Client-side search, breadcrumbs, pagination, and file icons

## 🔧 How to use

Install Nginx and the Fancy Index module. Package names differ between Linux

distributions; the following example is for Debian:

```bash
apt update
apt install git nginx libnginx-mod-http-fancyindex
cd /var/www/html
git clone https://github.com/moaeiou/fancyindex-theme.git
```

### 📚 Nginx config

Load the module from the top level of `/etc/nginx/nginx.conf` when your package

does not load it automatically:

```ini
include /etc/nginx/modules-enabled/*.conf;
```

Add the following locations to the relevant `server` block.

Change the alias to the directory you want to publish, and keep the trailing slash:

```ini
location / {
    alias /var/www/html/;
    include mime.types;
    fancyindex on;
    fancyindex_localtime on;
    fancyindex_exact_size off;
    fancyindex_header "/fancyindex-theme/header.html";
    fancyindex_footer "/fancyindex-theme/footer.html";
    fancyindex_ignore "fancyindex-theme";
}
```

To hide Fancy Index's generated path heading,

add this directive inside the`location /` block (the theme renders its own path and breadcrumbs):

```ini
fancyindex_show_path off;
```

Validate and reload the configuration:

```bash
nginx -t
systemctl reload nginx
```

## ⚖️ LICENSE

The source LICENSE was under MIT with Copyright © 2016-17 Lilian Besson [Naereen](https://github.com/Naereen)

This version is licensed under the [MoPL](https://867678.xyz/doc/MoPL).
