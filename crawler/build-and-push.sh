#!/usr/bin/sh
set -o errexit
podman build -t registry.digitalocean.com/darkforest/wasgeit:production -f ./Dockerfile ..
podman push registry.digitalocean.com/darkforest/wasgeit:production
