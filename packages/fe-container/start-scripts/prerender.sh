#! /bin/sh

sed -i "s/REPLACE_PRERENDER_HOST/$PRERENDER_HOST/g" /etc/nginx/conf.d/website.conf
echo "Prerender host replaced with $PRERENDER_HOST"
