#!/usr/bin/sh
set -o errexit
buildah build -t registry.digitalocean.com/trisolaris/wasgeit/crawler:production -f ./Dockerfile ../..
buildah push registry.digitalocean.com/trisolaris/wasgeit/crawler:production
