# FancyIndex-Theme

A modern, freedom, fastly, easy-to-use, FancyIndex-Theme.

## 🚀 Features

Forked from <https://github.com/Naereen/Nginx-Fancyindex-Theme>

- A beautiful UI to get file fast any easy.
- Support **Light and Dark** theme and aslo have autochange.
- Just only **3 steps** to depoly in any can install nginx devices.
- End file size about **9kb**! That is so small!

## 🔧 How to use

> If you not using Debian GNU/Linux and software source not have fancyindex module, Please try to self build nginx and addital fancyindex module.
>
> Make sure you are riding at `/var/www/html`

### ⬇️ Install for Debian:

> For based on Fedora, change pm to dnf/rpm and install `nginx-mod-fancyindex`.
>
> And from line 3 next.

```bash
apt update
apt install wget nginx libnginx-mod-http-fancyindex
rm -rf fancyindex-theme/
mkdir -p fancyindex-theme/
cd fancyindex-theme/
wget https://github.com/moaeiou/fancyindex-theme/releases/latest/download/fit-moaeiou.tar.zst
tar -xvf fit-moaeiou.tar.zst
rm fit-moaeiou.tar.zst
cd ..
```

### ⬆️ Update

```bash
rm -rf fancyindex-theme/
mkdir -p fancyindex-theme/
cd fancyindex-theme/
wget https://github.com/moaeiou/fancyindex-theme/releases/latest/download/fit-moaeiou.tar.zst
tar -xvf fit-moaeiou.tar.zst
rm fit-moaeiou.tar.zst
cd ..
```

### 📶 Nginx

> Include the `fancyindex` module first, add it in the header of nginx config

```ini
include /etc/nginx/modules-enabled/*.conf;
```

> `location` part.

```ini
location / {
    alias /var/www/html/;
    include mime.types;
    fancyindex on;
    fancyindex_localtime on;
    fancyindex_show_path off;
    fancyindex_exact_size off;
    fancyindex_header "/fancyindex-theme/header.html";
    fancyindex_footer "/fancyindex-theme/footer.html";
    fancyindex_ignore "fancyindex-theme";
}
```

> Validate and reload the configuration:

```bash
nginx -t
systemctl reload nginx
```

## ⚖️ LICENSE

This project was licensed under the [MoPL](https://867678.xyz/doc/MoPL).

The source was licensed under MIT with Copyright © 2016-17 Lilian Besson [Naereen](https://github.com/Naereen)
