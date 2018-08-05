# docs-upload-site

## Getting started

### Start for development

Please first ensure that you have `GOPATH` configured correctly:

```bash
$ mkdir -p $HOME/go/src/github.com/notatestuser
$ export GOPATH=$HOME/go/src
```

Then clone this repo to `~/go/src/github.com/notatestuser/docs-upload-site`.

You will need to install all dependencies to run or build the app:

```bash
$ cd ~/go/src/github.com/notatestuser/docs-upload-site
$ yarn
$ dep ensure
```

Then use `make dev` to run the dev server in one tab:

```bash
$ make dev
```

And run the backend server in another tab:

```bash
$ make run_server
```

The app will be available at `http://localhost:3000`.

### Start in production

```bash
$ make build_app
$ APP_ENV=production go run main.go
$ open http://localhost:8081
```

### Docker in production

```bash
$ make
$ make run_docker
$ open http://localhost:8081
```
