@ECHO OFF

SETLOCAL

SET FILE="docker-compose-%ENV%.yml"
SET FAILS=""


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
