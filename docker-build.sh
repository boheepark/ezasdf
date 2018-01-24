#!/bin/sh


docker_pull_build() {
  args="$@"
  option=""

  error(){
    msg="$1"
    echo "[*] USAGE: docker_pull_build -n name -r repo -b build_arg"
    echo "[.]"
    echo "[.]   name: client / users / users_db / swagger"
    echo "[.]"
    echo "[*] Executed: docker_pull_build $args"
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
      elif [ "$option" == "-r" ] || [ "$option" == "--repo" ]; then
        repo="$arg"
      elif [ "$option" == "-b" ] || [ "$option" == "--build-arg" ]; then
        build_arg="--build-arg $arg"
      else
        error "Invalid option $option."
      fi
      option=""
    fi
  done

  if [ "$TRAVIS_BRANCH" == "dev" ]; then
    docker build $repo -t $name:$COMMIT -f $DOCKERFILE $build_arg
  elif [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
    docker pull $REPO/$name:$TAG
    docker build --cache-from $REPO/$name:$TAG -t $name:$COMMIT -f $DOCKERFILE $build_arg
  fi

}

# curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
# unzip awscli-bundle.zip
# ./awscli-bundle/install -b ~/bin/aws
# export PATH=~/bin:$PATH
# eval $(aws ecr get-login --region us-east-1 --no-include-email)

if [ "$TRAVIS_BRANCH" == "dev" ]; then
  docker_pull_build -n $USERS -r $USERS_REPO
  docker_pull_build -n $USERS_DB -r $USERS_DB_REPO
  docker_pull_build -n $CLIENT -r $CLIENT_REPO -b REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
  docker_pull_build -n $SWAGGER -r $SWAGGER_REPO
elif [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
  docker_pull_build -n $USERS
  docker_pull_build -n $USERS_DB
  docker_pull_build -n $CLIENT -b REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
  docker_pull_build -n $SWAGGER
fi
