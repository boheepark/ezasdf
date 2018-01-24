#!/bin/sh -v



echo "SWAGGER_DIR = $SWAGGER_DIR"


docker_build() {
  args="$@"
  option=""

  error(){
    msg="$1"
    echo "[*] USAGE: docker_build -n name -r repo -b build_arg"
    echo "[.]"
    echo "[.]   name: client / users / users_db / swagger"
    echo "[.]"
    echo "[*] Executed: docker_build $args"
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

  docker build $repo -t $name:$COMMIT -f $DOCKERFILE $build_arg
  docker build --cache-from $REPO/$name:$TAG -t $name:$COMMIT -f $DOCKERFILE $build_arg
}


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  if [ "$TRAVIS_BRANCH" == "stage" ]; then
    export REACT_APP_USERS_SERVICE_URL="http://ezasdf-stage-alb-1029481067.us-east-1.elb.amazonaws.com"
  fi
  # if [ "$TRAVIS_BRANCH" == "prod" ]; then
  #   export REACT_APP_USERS_SERVICE_URL="TBD"
  # fi

  if [ "$TRAVIS_BRANCH" == "stage" ] || [ "$TRAVIS_BRANCH" == "prod" ]; then
    docker_build -n $USERS -r $USERS_REPO
    docker_build -n $USERS_DB -r $USERS_DB_REPO
    docker_build -n $CLIENT -r $CLIENT_REPO -b REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
    docker_build -n $SWAGGER -r $SWAGGER_REPO
  fi
fi
