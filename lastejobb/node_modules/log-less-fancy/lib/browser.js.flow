// @flow

import type {LoggerType} from './types.js';

const createLogPrefix = require('./_lib/createLogPrefix.js');

function createLogger(namespace: string): LoggerType {
	const api = {
		enforceLogging: () => api,
		fatal: console.error.bind(null, createLogPrefix(namespace, 'fatal')),
		error: console.error.bind(null, createLogPrefix(namespace, 'error')),
		success: console.log.bind(null, createLogPrefix(namespace, 'fatal')),
		warn: console.warn.bind(null, createLogPrefix(namespace, 'warn')),
		info: console.info.bind(null, createLogPrefix(namespace, 'info')),
		debug: (console.debug || console.log).bind(null, createLogPrefix(namespace, 'debug')),
		log: console.log.bind(null, createLogPrefix(namespace, 'log'))
	};

	return api;
}

module.exports = createLogger;
