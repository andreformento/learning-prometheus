start:
	@docker-compose up -d --build

stop:
	@docker-compose stop -t 1
	@docker-compose rm -f

restart: stop start

reload:
	@curl -X POST http://localhost:9090/-/reload

call-endpoint:
	@curl -s -X POST http://localhost:8081/data -H 'Content-Type: application/json' -d '{"a": 1}' | jq .

logs: 
	@docker-compose logs -f $(service)

restart-service:
	@docker-compose restart -t 0 $(service)
	@docker-compose logs -f $(service)
