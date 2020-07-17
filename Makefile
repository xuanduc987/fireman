dev: dev-app dev-srv
stop: stop-app stop-srv stop-storybook

stop-%:
	@echo "Stop $* server"
	-@xargs kill < logs/$*.pid

dev-%: logs stop-%
	@echo "Start $* dev server"
	cd $*; yarn dev & echo "$$!" > "../logs/$*.pid"

storybook: logs
	@echo "Start app storybook"
	-@xargs kill < logs/storybook.pid
	cd app; yarn storybook & echo "$$!" > "../logs/storybook.pid"

logs:
	mkdir logs

.PHONY: dev dev-% stop stop-% storybook
