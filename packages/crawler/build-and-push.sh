#!/usr/bin/sh
set -o errexit
podman build -t 067015433675.dkr.ecr.eu-central-1.amazonaws.com/wasgeit-crawler:production -f ./Dockerfile ../..
podman push 067015433675.dkr.ecr.eu-central-1.amazonaws.com/wasgeit-crawler:production
