up:
	docker compose up -d
down:
	docker compose down
reset:
	docker compose down -v
	$(MAKE) build
prisma-status:
	npx prisma migrate status
prisma-deploy:
	npx prisma migrate deploy
prisma-generate:
	npx prisma generate