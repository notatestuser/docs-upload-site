FROM golang:1.10

# Download and install the latest release of dep
ADD https://github.com/golang/dep/releases/download/v0.4.1/dep-linux-amd64 /usr/bin/dep
RUN chmod +x /usr/bin/dep

# Copy the code from the host and compile it
WORKDIR $GOPATH/src/github.com/notatestuser/docs-upload-site
COPY Gopkg.toml Gopkg.lock ./
RUN dep ensure --vendor-only
COPY . ./

RUN chown -R 1000:1000 ./ && \
    chmod 777 ./ ./build/uploads ./build/uploads/*

USER 1000
ENV APP_ENV production
ENV GOCACHE off

RUN go build ./main.go
ENTRYPOINT ["./main"]
