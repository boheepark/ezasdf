#!/bin/sh


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
  unzip awscli-bundle.zip
  ./awscli-bundle/install -b ~/bin/aws
  export PATH=~/bin:$PATH
  eval $(aws ecr get-login --region us-east-1 --no-include-email)
  # if [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
  docker pull $REPO/$USERS:$TAG
  docker pull $REPO/$USERS_DB:$TAG
  docker pull $REPO/$CLIENT:$TAG
  docker pull $REPO/$SWAGGER:$TAG
  # fi
fi
