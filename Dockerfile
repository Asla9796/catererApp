FROM kyma/docker-nginx
COPY www/ /var/www
CMD 'nginx'
