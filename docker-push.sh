#!/bin/sh -v


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ];
then

  export TAG=$TRAVIS_BRANCH

  # if [ "$TAG" == "dev" ];
  # then
  #   docker login -u $DOCKER_ID -p $DOCKER_PASSWORD
  #   export REPO=$DOCKER_ID
  # fi

  if [ "$TAG" == "stage" ] || [ "$TAG" == "prod" ];
  then
    curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    unzip awscli-bundle.zip
    ./awscli-bundle/install -b ~/bin/aws
    export PATH=~/bin:$PATH
    # add AWS_ACCOUNT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY env vars
    eval $(aws ecr get-login --region us-east-1 --no-include-email)
    export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
  fi

  # if [ "$TAG" == "stage" ];
  # then
  #   export REACT_APP_USERS_SERVICE_URL="TBD"
  #   export SECRET_KEY="secret"
  # fi
  #
  # if [ "$TAG" == "prod" ];
  # then
  #   export REACT_APP_USERS_SERVICE_URL="TBD"
  #   export SECRET_KEY="TBD"
  # fi

  if [ "$TAG" == "stage" ] || [ "$TAG" == "prod" ];
  then
    # users
    docker build $USERS_REPO -t $USERS:$COMMIT -f Dockerfile-$TAG
    docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
    docker push $REPO/$USERS:$TAG
    # users db
    docker build $USERS_DB_REPO -t $USERS_DB:$COMMIT
    docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
    docker push $REPO/$USERS_DB:$TAG
    # client
    docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-$TAG --build arg REACT_APP_USERS_SERVICE_URL=TBD
    docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
    docker push $REPO/$CLIENT:$TAG
    # swagger
    docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f Dockerfile-$TAG $SWAGGER_DIR
    docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
    docker push $REPO/$SWAGGER:$TAG
    # nginx
    # docker build $NGINX_REPO -t $NGINX:$COMMIT -f Dockerfile-$TAG
    # docker tag $NGINX:$COMMIT $REPO/$NGINX:$TAG
    # docker push $REPO/$NGINX:$TAG
  fi

fi