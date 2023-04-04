docker run --restart always -d --name webdav --publish 7000:8080 \
           --env WEBDAV_USERNAME=myuser --env WEBDAV_PASSWORD=mypassword \
           --env UID=$UID --volume $PWD:/media ionelmc/webdav