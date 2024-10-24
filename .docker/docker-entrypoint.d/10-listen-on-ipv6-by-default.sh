#!/bin/sh
# vim:sw=4:ts=4:et

set -e

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

ME=$(basename "$0")
DEFAULT_CONF_FILE="etc/nginx/templates/default.conf.template"

# check if we have ipv6 available
if [ ! -f "/proc/net/if_inet6" ]; then
    entrypoint_log "$ME: info: ipv6 not available"
    exit 0
fi

if [ ! -f "/$DEFAULT_CONF_FILE" ]; then
    entrypoint_log "$ME: info: /$DEFAULT_CONF_FILE is not a file or does not exist"
    exit 0
fi

# check if the file can be modified, e.g. not on a r/o filesystem
touch /$DEFAULT_CONF_FILE 2>/dev/null || { entrypoint_log "$ME: info: can not modify /$DEFAULT_CONF_FILE (read-only file system?)"; exit 0; }

# check if the file is already modified, e.g. on a container restart
grep -q "listen  \[::\]:\${HTTP_PORT} default_server;" /$DEFAULT_CONF_FILE && { entrypoint_log "$ME: info: IPv6 listen already enabled"; exit 0; }

# enable ipv6 on default.conf listen sockets
sed -i "s,listen  \${HTTP_PORT} default_server;,listen  \${HTTP_PORT} default_server;\n    listen  [::]:\${HTTP_PORT} default_server;," /$DEFAULT_CONF_FILE

entrypoint_log "$ME: info: Enabled listen on IPv6 in /$DEFAULT_CONF_FILE"

exit 0
