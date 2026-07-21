# 🚀 fancyindex-theme
A morden fancyindex-theme with high performance

Forked from <https://github.com/Naereen/Nginx-Fancyindex-Theme>
## 🔧 How to use
You need Nginx First, and a depend 

(In the others systems, such as ArchLinux, You need compile nginx and add it.)
```
apt update
apt install nginx libnginx-mod-http-fancyindex
cd /var/www/html # Default Nginx website files path if you using debian, you can change it if you need
git clone https://github.com/moaeiou/fancyindex-theme.git
cd fancyindex-theme
rm ./README.md
```
### 📚 Nginx config
> ⚠️ WARN: The alias must be change to a real path, else be fatal.

In Nginx config file header
```
include /etc/nginx/modules-enabled/*.conf;
```
In the `server` part
```
location / {
    alias /var/www/html;
    include mime.types;
    fancyindex on;
    fancyindex_localtime on;
    fancyindex_exact_size off;
    fancyindex_header "/fancyindex-theme/header.html";
    fancyindex_footer "/fancyindex-theme/footer.html";
    fancyindex_ignore "fancyindex-theme";
}
```
To hide the `/` in the up of filename, add nginx config inside `location` to denied
```
fancyindex_show_path off;
```
## ⚖️ LICENSE
> The source LICENSE was under MIT with Copyright © 2016-17 Lilian Besson [Naereen](https://github.com/Naereen)
>
> This version licensed under the [MoPL](https://867678.xyz/doc/MoPL)