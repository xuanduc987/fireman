start: start-app start-srv

start-%:
	@echo "Start $* server"
	(cd $*; yarn start &)

.PHONY: start start-%
