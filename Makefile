start: start-app start-srv

stop-%:
	@echo "Stop $* server"
	-@xargs kill < logs/$*.pid

start-%: logs stop-%
	@echo "Start $* server"
	cd $*; yarn start & echo "$$!" > "../logs/$*.pid"

storybook: logs
	@echo "Start app storybook"
	-@xargs kill < logs/storybook.pid
	cd app; yarn storybook & echo "$$!" > "../logs/storybook.pid"

logs:
	mkdir logs

.PHONY: start start-% stop-% storybook
