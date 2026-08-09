# fancyindex-theme

A modern, freedom, fastly, easy-to-use, FancyIndex-Theme.

## 🚀 Features

Forked from <https://github.com/Naereen/Nginx-Fancyindex-Theme>

- A beautiful UI to get file fast any easy.
- Support **Light and Dark** theme and aslo have autochange.
- Just only **3 steps** to depoly in any can install nginx devices.
- End file size about **9kb**! That is so small!

## 🔧 How to use

If you not using Debian GNU/Linux, Try to self compile nginx and add fancyindex module.

BTW: if you need using mirror by MoAEIOU, it named `fit.tar.zst` 

That because `fancyindex_ignore "fancyindex-theme";` will be ignore any called `fancyindex-theme` file.

Make sure you are riding at `/var/www/html`

The following install example for Debian:

```bash
apt update
apt install wget nginx libnginx-mod-http-fancyindex
rm -rf fancyindex-theme/
mkdir -p fancyindex-theme/
cd fancyindex-theme/
wget https://github.com/moaeiou/fancyindex-theme/releases/latest/download/fancyindex-theme-moaeiou.tar.zst
tar -xvf fancyindex-theme-moaeiou.tar.zst
rm fancyindex-theme-moaeiou.tar.zst
cd ..
```

Update

```bash
rm -rf fancyindex-theme/
mkdir -p fancyindex-theme/
cd fancyindex-theme/
wget https://github.com/moaeiou/fancyindex-theme/releases/latest/download/fancyindex-theme-moaeiou.tar.zst
tar -xvf fancyindex-theme-moaeiou.tar.zst
rm fancyindex-theme-moaeiou.tar.zst
cd ..
```

## 📚 Nginx config

Include the `fancyindex` module first, add it in the header of nginx config

```ini
include /etc/nginx/modules-enabled/*.conf;
```

`http` part, add this.

Else filename may happen some unexpected changes.

```ini
map $uri $download_name {
    ~/(?<basename>[^/]+)$ $basename;
    default "";
}
```

`location` part.

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
    if ($uri !~ /$) {
        add_header Content-Disposition 'attachment; filename="$download_name"' always;
    }
}
```

Validate and reload the configuration:

```bash
nginx -t
systemctl reload nginx
```

## ⚖️ LICENSE

This version is licensed under the [MoPL](https://867678.xyz/doc/MoPL).

The source LICENSE was under MIT with Copyright © 2016-17 Lilian Besson [Naereen](https://github.com/Naereen)
