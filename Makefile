start: start-app start-srv

stop-%:
	@echo "Stop $* server"
	-@xargs kill < logs/$*.pid

start-%: logs stop-%
	@echo "Start $* server"
	cd $*; yarn start & echo "$$!" > "../logs/$*.pid"

logs:
	mkdir logs

.PHONY: start start-% stop-%
