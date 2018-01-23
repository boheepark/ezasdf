#!/bin/sh -v



echo "SWAGGER_DIR = $SWAGGER_DIR"


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

  export TAG=$TRAVIS_BRANCH

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
    export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
  fi

  if [ "$TRAVIS_BRANCH" == "stage" ]; then
    export REACT_APP_USERS_SERVICE_URL="http://ezasdf-stage-alb-1029481067.us-east-1.elb.amazonaws.com"
  fi

  # if [ "$TRAVIS_BRANCH" == "prod" ]; then
  #   export REACT_APP_USERS_SERVICE_URL="TBD"
  # fi

  if [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
    docker_build_tag_push(){
      args="$@"
      option=""

      error(){
        message="$1"
        echo "[*] USAGE: asdf -s service -r service_repo"
        echo "[.]"
        echo "[.]   services: client / users / users_db / swagger"
        echo "[.]"
        echo "[*] Executed: asdf $args"
        [ -n "$message" ] && echo "[*] $message"
        exit 1
      }

      for arg in ${args[@]}; do
        if [ "${arg:0:1}" == "-" ]; then
          [ -n "$option" ] && error "Cannot pass 2 options consecutively."
          option="$arg"
        elif [ -z "$option" ]; then
          error "Specify an option for $arg."
        else
          if [ "$option" == "-s" ] || [ "$option" == "--service" ]; then
            service="$arg"
          elif [ "$option" == "-r" ] || [ "$option" == "--repo" ]; then
            service_repo="$arg"
          elif [ "$option" == "-b" ] || [ "$option" == "--build-arg" ]; then
            build_arg="--build-arg $arg"
          fi
          option=""
        fi
      done

      docker build $service_repo -t $service:$COMMIT -f $DOCKERFILE $build_arg
      docker tag $service:$COMMIT $REPO/$service:$TAG
      docker push $REPO/$service:$TAG
    }
    docker_build_tag_push -s $USERS -r $USERS_REPO
    docker_build_tag_push -s $USERS_DB -r $USERS_DB_REPO
    docker_build_tag_push -s $CLIENT -r $CLIENT_REPO -b REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
    docker_build_tag_push -s $SWAGGER -r $SWAGGER_REPO

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

fi
