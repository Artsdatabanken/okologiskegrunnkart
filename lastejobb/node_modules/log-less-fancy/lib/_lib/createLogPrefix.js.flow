// @flow

const logSymbols = require('log-symbols');

const iconsByType: { [string]: string } = {
	fatal: logSymbols.error,
	error: logSymbols.error,
	success: logSymbols.success,
	warn: logSymbols.warning,
	info: logSymbols.info,
	debug: '•',
	default: ' '
};

function createLogPrefix(namespace: string, type: string): string {
	const icon = iconsByType[type] || iconsByType.default;

	return icon + namespace;
}

module.exports = createLogPrefix;
