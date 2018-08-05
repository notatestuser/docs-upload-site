all: install_app_deps build_app build_docker
dev: install_app_deps run_dev
build: build_app build_docker

########################################
### Dependencies

install_app_deps:
	@echo "--> Installing frontend dependencies"
	@yarn

########################################
### Build App

build_app:
	@echo "--> Building frontend app"
	@yarn build

########################################
### Build Docker

build_docker:
	@echo "--> Building Docker container"
	docker build -t docs-upload-site .

########################################
### Run

run_dev:
	@echo "--> Running dev app (access on http://localhost:3000)"
	yarn start

run_server:
	@echo "--> Running dev server (access on http://localhost:8081)"
	go run main.go

run_docker:
	@echo "--> Running Docker container (access on http://localhost:8081)"
	docker run -p 8081:8081 docs-upload-site

########################################
### Testing

test: test_unit

test_unit:
	@yarn test

# https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html
.PHONY: dev build install_app_deps build_app build_docker run_dev run_server run_docker test test_unit
