# fancyindex-theme

A modern, dependency-free theme for Nginx FancyIndex.

## 🚀 Features

Forked from <https://github.com/Naereen/Nginx-Fancyindex-Theme>

- A beautiful UI to get file fast any easy.
- Support **Light and Dark** theme and aslo have autochange.
- Just only **3 steps** to depoly in any can install nginx devices.
- End file size about **7kb**! That is so small!

## 🔧 How to use

Install Nginx and the Fancy Index module. Package names differ between Linux

distributions; the following example is for Debian:

```bash
apt update
apt install git nginx libnginx-mod-http-fancyindex
cd /var/www/html
mkdir -p fancyindex-theme/
cd fancyindex-theme/
wget https://github.com/moaeiou/fancyindex-theme/releases/latest/download/fancyindex-theme-moaeiou.tar.gz
tar -xzvf fancyindex-theme-moaeiou.tar.gz
rm fancyindex-theme-moaeiou.tar.gz
cd ..
```

Update
```bash
cd /var/www/html
mkdir -p fancyindex-theme/
cd fancyindex-theme/
wget https://github.com/moaeiou/fancyindex-theme/releases/latest/download/fancyindex-theme-moaeiou.tar.gz
tar -xzvf fancyindex-theme-moaeiou.tar.gz -C fancyindex-theme/
rm fancyindex-theme-moaeiou.tar.gz
```

### 📚 Nginx config

Load the module from the top level of `/etc/nginx/nginx.conf` 

when your package does not load it automatically:

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

add this directive inside the`location /` block 

(the theme renders its own path and breadcrumbs):

```ini
fancyindex_show_path off;
```

Validate and reload the configuration:

```bash
nginx -t
systemctl reload nginx
```

## ⚖️ LICENSE
This version is licensed under the [MoPL](https://867678.xyz/doc/MoPL).

The source LICENSE was under MIT with Copyright © 2016-17 Lilian Besson [Naereen](https://github.com/Naereen)