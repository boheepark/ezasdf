#!/bin/sh -v



echo "SWAGGER_DIR = $SWAGGER_DIR"


docker_tag_push(){
  args="$@"
  option=""

  error(){
    msg="$1"
    echo "[*] USAGE: docker_tag_push -n name"
    echo "[.]"
    echo "[.]   name: client / users / users_db / swagger"
    echo "[.]"
    echo "[*] Executed: docker_tag_push $args"
    [ -n "$msg" ] && echo "[*] $msg"
    exit 1
  }

  for arg in ${args[@]}; do
    if [ "${arg:0:1}" == "-" ]; then
      [ -n "$option" ] && error "Specify parameter for $option."
      option="$arg"
    elif [ -z "$option" ]; then
      error "Specify option for $arg."
    else
      if [ "$option" == "-n" ] || [ "$option" == "--name" ]; then
        name="$arg"
      else
        error "Invalid option $option."
      fi
      option=""
    fi
  done

  docker tag $name:$COMMIT $REPO/$name:$TAG
  docker push $REPO/$name:$TAG
}


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

  # if [ "$TRAVIS_BRANCH" == "dev" ]; then
  #   docker login -u $DOCKER_ID -p $DOCKER_PASSWORD
  #   export REPO=$DOCKER_ID
  # fi

  if [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
    curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    unzip awscli-bundle.zip
    ./awscli-bundle/install -b ~/bin/aws
    export PATH=~/bin:$PATH
    eval $(aws ecr get-login --region us-east-1 --no-include-email)
  fi

  if [ "$TRAVIS_BRANCH" == "stage" ]; then
    export REACT_APP_USERS_SERVICE_URL="http://ezasdf-stage-alb-1029481067.us-east-1.elb.amazonaws.com"
  fi

  # if [ "$TRAVIS_BRANCH" == "prod" ]; then
  #   export REACT_APP_USERS_SERVICE_URL="TBD"
  # fi

  docker_tag_push -n $USERS -r $USERS_REPO
  docker_tag_push -n $USERS_DB -r $USERS_DB_REPO
  docker_tag_push -n $CLIENT -r $CLIENT_REPO -b REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
  docker_tag_push -n $SWAGGER -r $SWAGGER_REPO

  # # users
  # docker build $USERS_REPO -t $USERS:$COMMIT -f $DOCKERFILE
  # docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
  # docker push $REPO/$USERS:$TAG
  # # users db
  # docker build $USERS_DB_REPO -t $USERS_DB:$COMMIT
  # docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
  # docker push $REPO/$USERS_DB:$TAG
  # # client
  # docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f $DOCKERFILE --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
  # docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
  # docker push $REPO/$CLIENT:$TAG
  # # swagger
  # docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f $DOCKERFILE
  # # docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f $DOCKERFILE $SWAGGER_DIR
  # docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
  # docker push $REPO/$SWAGGER:$TAG
  # # nginx
  # # docker build $NGINX_REPO -t $NGINX:$COMMIT -f $DOCKERFILE
  # # docker tag $NGINX:$COMMIT $REPO/$NGINX:$TAG
  # # docker push $REPO/$NGINX:$TAG

fi
