#!/bin/bash


if [ -z ${env} ];
then
  env=$1
fi
file=""
fails=""

if [[ "${env}" == "dev" ]];
then
  file="docker-compose-dev.yml"
elif [[ "${env}" == "stage" ]];
then
  file="docker-compose-dev.yml"
elif [[ "${env}" == "prod" ]];
then
  file="docker-compose-prod.yml"
else
  echo "USAGE: sh test.sh environment_name"
  echo "* environment_name: dev, stage, or prod"
  exit 1
fi

inspect() {
  if [ $1 -ne 0 ];
  then
    fails="${fails} $2"
  fi
}

docker-compose -f $file run users-service flask test --coverage
inspect $? users

docker-compose -f $file run users-service flake8 project
inspect $? users-lint

if [[ "${env}" == "dev" ]];
then
  docker-compose -f $file run client yarn test --verbose --coverage
  inspect $? client
fi

testcafe chrome e2e
inspect $? e2e

if [ -n "${fails}" ];
then
  echo "Tests failed: ${fails}"
  exit 1
else
  echo "Tests passed!"
  exit 0
fi
