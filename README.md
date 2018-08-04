# docs-upload-site

## Getting started

Please ensure that you have `GOPATH` configured correctly:

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

## Start for development

```bash
$ yarn start
```

## Start in production

```bash
$ yarn build
$ APP_ENV=production go run main.go
```
