This is the README for the Yaraku coding assignment.

## Requirements

- [Docker](https://docs.docker.com/install)
- [Docker Compose](https://docs.docker.com/compose/install)
- [Laravel and Composer](https://laravel.com/docs/12.x/installation#installing-php)

## Getting started

- Clone the repo. (These steps assume you have `laravel`, `composer`, and `php` installed)
- Run `cp .env.example .env`
- Run `npm install` and `npm run build`
- Run `composer install`.
- Run `php artisan key:generate`
- Run `./vendor/bin/sail up --build`
- With the container running now run the migrations in a separate shell: `./vendor/bin/sail php artisan migrate`
  From there you should now be able to navigate to `http://localhost` to see the UI

## Running the container

`./vendor/bin/sail up`

### Rebuilding the container

Sometimes you may want to completely rebuild your Sail images to ensure all of the image's packages and software are up to date. You may accomplish this using the build command:

`docker compose down -v`  
`./vendor/bin/sail build --no-cache`  
`./vendor/bin/sail up`

## Accessing web server

Once the container is running, the Laravel instance can be found at `http://localhost`

## Local dev

Start up the container using the following command: `./vendor/bin/sail up`  
Run `npm run dev` to start `vite` to see changes that you make on the frontend reflected on `localhost`

## Testing

- Run `cp .env.testing.example .env.testing`
- Generate app key using `php artisan key:generate --show` and copy that output and set that value to be the `APP_KEY`.
- Start up the container: `./vendor/bin/sail up`.
- Migrate test table: `./vendor/bin/sail php artisan migrate --env=testing`

Run tests:

- Backend: `./vendor/bin/sail php artisan test --env=testing`
- Frontend: `npm run test`
