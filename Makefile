REPORTER = dot

build:

install:

test: build
		@NODE_ENV=test ./node_modules/.bin/mocha test/*

.PHONY: test