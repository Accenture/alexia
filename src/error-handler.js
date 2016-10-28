'use strict';

const stackTrace = require('stack-trace');

module.exports = {
    /**
     * @returns {string} formatted stack trace for errors
     * Evaluates every stack trace item and compose them together to make sure nothing important is missing
     */
    parseError: (e) => {
        const error = stackTrace.parse(e);
        let res = [];

        res.push(`Error: ${e.message}`);

        error.forEach((trace) => {
            if (trace.fileName && trace.lineNumber && trace.columnNumber) {
                const functionName = trace.functionName || '';
                const struct = `\t at ${functionName} (${trace.fileName}:${trace.lineNumber}:${trace.columnNumber})`;
                res.push(struct);
            }
        });

        return res.join('\n');
    }
};
