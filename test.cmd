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
echo errorlevel: %errorlevel%
IF NOT %ERRORLEVEL% == 0 (
  SET fails=%fails% user
)

docker-compose -f %file% run users-service flake8 project
echo errorlevel: %errorlevel%
IF NOT %ERRORLEVEL% == 0 (
  SET fails=%fails% users-lint
)

IF "%env%" == "dev" (
  docker-compose -f %file% run client yarn test --coverage
  echo errorlevel: %errorlevel%
  IF NOT %ERRORLEVEL% == 0 (
    SET fails=%fails% client
  )
)

IF NOT %fails% == "" (
  ECHO Tests failed: %fails%
  EXIT /B 1
) ELSE (
  ECHO Tests passed!
  EXIT /B 0
)

ENDLOCAL
