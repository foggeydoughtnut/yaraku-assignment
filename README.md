This is the README for the Yaraku coding assignment.

## Getting started

## Running the container

`./vendor/bin/sail up`

### Rebuilding the container

Sometimes you may want to completely rebuild your Sail images to ensure all of the image's packages and software are up to date. You may accomplish this using the build command:

`docker compose down -v`  
`./vendor/bin/sail build --no-cache`  
`./vendor/bin/sail up`

## Accessing web server

Once the container is running, the Laravel instance can be found at `http://localhost`
