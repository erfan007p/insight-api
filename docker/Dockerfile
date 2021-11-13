FROM node:8-alpine

RUN apk add --update --no-cache \
                            git \
                            libzmq \
                            zeromq-dev \
                            python \
                            make \
                            g++

WORKDIR /insight

# Copy gobytecore-node
RUN git clone --branch master --single-branch --depth 1 https://github.com/gobytecoin/gobytecore-node.git .

# Copy config file
COPY gobytecore-node.json .

ARG VERSION

# Install npm packages
RUN npm ci

# Install Insight API module
RUN bin/gobytecore-node install @gobytecoin/insight-api@${VERSION}

FROM node:8-alpine

LABEL maintainer="GoByte Developers <dev@gobyte.network>"
LABEL description="Dockerised Insight API"

WORKDIR /insight

# Copy project files
COPY --from=0 /insight/ .

EXPOSE 3001

CMD ["bin/gobytecore-node", "start"]
