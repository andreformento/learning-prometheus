# learning-prometheus

## Comands
- start prometheus `docker-compose up -d --build` 
- reload configs `curl -X POST http://localhost:9090/-/reload`
- [prometheus](http://localhost:9090/graph?g0.expr=up&g0.tab=1&g0.stacked=0&g0.show_exemplars=0&g0.range_input=1h)
- [grafana](http://localhost:3000) _(admin/admin)_
- [alertmanager](http://localhost:9093)
- app node
  - [metrics](http://localhost:8080/metrics)
  - [fast](http://localhost:8080/fast)
  - [slow](http://localhost:8080/slow)

## References
- [create a incoming webhook to Slack](https://api.slack.com/messaging/webhooks)
- https://verbosemode.dev/list/monitoring-stack-with-prometheus-grafana-and-docker-3e6e4b94523c
- https://github.com/ablx/monitoring_stack
- https://www.theairtips.com/post/setting-up-alertmanager-with-docker-compose
- https://docs.kubermatic.com/kubermatic/v2.23/tutorials-howtos/monitoring-logging-alerting/user-cluster/setting-up-alertmanager-with-slack-notifications/
- https://stackabuse.com/nodejs-application-monitoring-with-prometheus-and-grafana/
