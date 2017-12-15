@ECHO OFF

SETLOCAL

SET file=""
SET fails=""

IF "%env%" == "dev" (
  SET file=docker-compose-dev.yml
) ELSE IF "%env%" == "stage" (
  SET file=docker-compose-dev.yml
) ELSE IF "%env%" == "prod" (
  SET file=docker-compose-dev.yml
) ELSE (
  ECHO Something went wrong.
  ECHO Check env variable.
  EXIT /B 1
)

docker-compose -f %file% run users-service flask test
docker-compose -f %file% run users-service flake8 project

IF "%env%" == "dev" (
  docker-compose -f %file% run client yarn test --coverage
)

testcafe chrome e2e

testcafe firefox e2e

IF NOT %fails% == "" (
  ECHO Tests failed: %fails%
  EXIT /B 1
) ELSE (
  ECHO Tests passed!
  EXIT /B 0
)

ENDLOCAL
