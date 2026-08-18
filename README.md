# FancyIndex-Theme

A modern, freedom, fastly, easy-to-use, FancyIndex-Theme.

## 🚀 Features

Forked from <https://github.com/Naereen/Nginx-Fancyindex-Theme>

- A beautiful UI to get file fast any easy.
- Support **Light and Dark** theme and aslo have autochange. No flash when open.
- Search, and the word stay in URL so you can share it.
- Copy page URL in one click. File link just right click the name.
- Just only **3 steps** to depoly in any can install nginx devices.
- Release is minify! End file size still so small.

## 🔧 How to use

> If you not using Debian GNU/Linux and software source not have fancyindex module, Please try to self build nginx and addital fancyindex module.
>
> Make sure you are riding at `/var/www/html`

### ⬇️ Install for Debian:

> For based on Fedora, change pm to dnf/rpm and install `nginx-mod-fancyindex`.
>
> You must be already at /var/www/html or nginx root dictionary.
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
>
> If you not add `default_type` and Content-Disposition, file with no suffix will save as `name.bin` in Chrome / aria2-next / Motrix.
>
> File that already have suffix still can preview, we not touch them.

```ini
location / {
    alias /var/www/html/;
    include mime.types;
    default_type application/x-binary;
    if ($uri ~* "/([^/.]+)$") {
        set $fancyindex_cd "attachment; filename=\"$1\"";
    }
    add_header Content-Disposition $fancyindex_cd;
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

### ✏️ If you not at `/`

> Theme path and Root is `/fancyindex-theme` and `/` by default.
>
> If your list is not at web root, change the path in `header.html` (css / js).
>
> You can also put this on the `<html>` tag:

```html
<html
  lang="en"
  data-site-name="MoAEIOU"
  data-theme-base="/fancyindex-theme"
>
```

## ⚖️ LICENSE

This project licensed under the [MoPL](https://867678.xyz/docs/mopl).

The source licensed under the MIT and Copyright © 2016-17 Lilian Besson [Naereen](https://github.com/Naereen)
