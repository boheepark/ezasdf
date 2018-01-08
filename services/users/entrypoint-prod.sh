#!/bin/sh -v


echo "Waiting for postgres..."

while ! nc -z users-db 5432;
do
    sleep 0.1
done

echo "PostgreSQL started"

flask recreate_db
flask seed_db
gunicorn -b 0.0.0.0:5000 users:app
