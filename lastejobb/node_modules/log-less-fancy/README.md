# log-less-fancy

[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)
[![Build Status](https://travis-ci.org/bjornreppen/log-less-fancy.svg?branch=master)](https://travis-ci.org/bjornreppen/log-less-fancy)
[![Dependency Status](https://david-dm.org/bjornreppen/log-less-fancy.svg)](https://david-dm.org/bjornreppen/log-less-fancy)
[![devDependency Status](https://david-dm.org/bjornreppen/log-less-fancy/dev-status.svg)](https://david-dm.org/bjornreppen/log-less-fancy#info=devDependencies&view=table)

> Logging in both Node and the browser the fancy way using the [debug](https://github.com/visionmedia/debug) module with an API that provides log levels.

![output](https://user-images.githubusercontent.com/1557092/29221099-c9c672b4-7ebd-11e7-84ed-f3eba8467bbc.png)

## Installation

```sh
npm i -S log-less-fancy
```

## Usage

The package exports a single function, which takes the namespace of your module as an argument and returns the logger API.

```js
// logger.js
const logger = require("log-less-fancy")("myNamespace");

logger.info("This is not a monolith, but your mother is");
logger.warn("oiii mate, watch out");
logger.success("whee");
logger.debug("why is this even working?");
logger.log("hello");
logger.error("dis is broke m8");
logger.fatal("shit went wrong D:");
```

Now execute the script:

```sh
# Prints all messages and all fatal errors
DEBUG='*' node logger.js

# Prints only warnings and all fatal errors
DEBUG=*WARN* node logger.js

# Prints only messages in your namespace and all fatal errors
DEBUG=*myNamespace* node logger.js
```

## Node API

The logger API consists of 8 methods, namely `fatal`, `error`, `success`, `warn`, `info`, `debug` and `log`. All methods act like the native console API and take as many arguments as you like.

The `fatal` method is the only one with divergent behavior:

*   It traces the log up to the source file which triggered it which helps to debug the exception if necessary.
*   It will always be rendered and does not use the `DEBUG` environment variable / the `debug` module since it doesn't make sense to not to print fatal errors at any time.
*   It exits the process with code `1` which identifies the Node process as crashed.

## Browser API

The logger API in the browser is aligned to the Node API, but only uses the native `console` object to save some bytes down the wire, so no `debug` fancy colored output here.

## Advanved features and methods

#### `.enforceLogging()`

Enforces the log output to be shown. Useful if you cannot set the `DEBUG` env variable yourself.

## Roadmap / Features to develop

*   [ ] Add adapters / plugins, e.g. a plugin which forwards all messages to the `fs` or some logging service. #1
*   [ ] Make the configuration possible via a `.fancylogrc` which will be resolved from the root folder of the processes package . #2

## Code style

Please make sure that you adhere to the code style which is based upon [xo](https://github.com/sindresorhus/eslint-config-xo).

## Licensing

See the `LICENSE` file at the root of the repository.
