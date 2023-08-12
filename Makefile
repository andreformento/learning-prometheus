run:
	@docker-compose up -d --build

reload:
	@curl -X POST http://localhost:9090/-/reload

call-endpoint:
	@curl -X POST http://localhost:8081/data -H 'Content-Type: application/json' -d '{"a": 1}'
