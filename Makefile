up:
	docker compose up -d
down:
	docker compose down
reset:
	docker compose down -v
	$(MAKE) build
prisma-status:
	docker compose exec api npx prisma migrate status
prisma-deploy:
	npx prisma migrate deploy
prisma-generate:
	npx prisma generate