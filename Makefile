start-dev:
	@NODE_ENV=dev docker compose --env-file .env.dev up --build 

start-test:
	@NODE_ENV=test docker compose --env-file .env.test up --build

start-prod:
	@NODE_ENV=prod docker compose --env-file .env.prod up --build

stop:
	@docker compose down
