#!/bin/bash


if [ -z ${env} ];
then
  env=$1
fi


file=""
fails=""


if [[ "${env}" == "dev" ]];
then
  file="docker-compose.yml"
elif [[ "${env}" == "stage" ]];
then
  file="docker-compose-stage.yml"
elif [[ "${env}" == "prod" ]];
then
  file="docker-compose-prod.yml"
else
  echo "USAGE: sh test.sh <environment name>"
  echo "* environment_name: dev, stage, or prod"
  exit 1
fi


inspect() {
  if [ $1 -ne 0 ];
  then
    fails="${fails} $2"
  fi
}


test_e2e() {
  if [ $? != 1 ];
  then
    echo "USAGE: test_e2e <file/directory>"
  fi

  e2e=$1

  testcafe chrome $e2e
  inspect $? e2e_chrome

  testcafe firefox $e2e
  inspect $? e2e_firefox
}


/bin/sleep 5

docker-compose -f $file run users-service flask recreate_db
docker-compose -f $file run users-service flask seed_db

docker-compose -f $file run users-service flask test --coverage
inspect $? users-service

docker-compose -f $file run users-service flake8 project
inspect $? users-lint


if [[ "${env}" == "stage" ]];
then
  docker-compose -f $file run client yarn test --verbose --coverage
  inspect $? client

  # testcafe chrome e2e
  # inspect $? e2e_chrome

  test_e2e e2e
else
  # testcafe chrome e2e/index.test.js
  # inspect $? e2e_chrome
  test_e2e e2e/index.test.js
fi


if [ -n "${fails}" ];
then
  echo "Tests failed: ${fails}"
  exit 1
else
  echo "Tests passed!"
  exit 0
fi
