@ECHO OFF

SETLOCAL

SET FILE=""
SET FAILS=""

IF "%ENV%" == "dev" (
  SET FILE=docker-compose.yml
) ELSE IF "%ENV%" == "stage" (
  SET FILE=docker-compose-stage.yml
) ELSE IF "%ENV%" == "prod" (
  SET FILE=docker-compose-prod.yml
) ELSE (
  ECHO Something went wrong.
  ECHO Check ENV variable.
  EXIT /B 1
)

docker-compose -f %FILE% run users-service flask test --coverage
docker-compose -f %FILE% run users-service flake8 project

IF "%ENV%" == "dev" (
  docker-compose -f %FILE% run client yarn test --coverage
)

testcafe chrome e2e
testcafe firefox e2e

IF NOT %FAILS% == "" (
  ECHO Tests failed: %FAILS%
  EXIT /B 1
) ELSE (
  ECHO Tests passed!
  EXIT /B 0
)

ENDLOCAL
