#!/usr/bin/sh
set -o errexit
podman build -t registry.digitalocean.com/trisolaris/wasgeit/crawler:production -f ./Dockerfile ../..
podman push registry.digitalocean.com/trisolaris/wasgeit/crawler:production
