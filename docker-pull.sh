#!/bin/sh


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  if [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
    docker pull $REPO/$USERS:$TAG
    docker pull $REPO/$USERS_DB:$TAG
    docker pull $REPO/$CLIENT:$TAG
    docker pull $REPO/$SWAGGER:$TAG
  fi
fi
