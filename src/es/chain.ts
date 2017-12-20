/**
     * Takes _n_ functions as arguments and returns a new function that calls them in order.
     * The arguments applied when calling the new function will also be applied to every function passed.
     * The value of `this` refers to the last value returned in the chain that was not `undefined`.
     * Therefore if a passed function does not return a value, the previously returned value is maintained.
     * After all passed functions have been called the new function returns the last returned value (if any).
     * If any of the passed functions are a chain, then the chain will be flattened.
     * @method chain
     * @param ...funcs {function} The functions to chain.
     * @return {function} A new function that calls the passed functions in order.
     */
function chain(...args: Function[]): Function
{
	let funcs: Function[] = [];

	for (let i = 0; i < args.length; i += 1) {
		let func = args[i];

		if (func._chained) {
			// flatten already chained functions
			funcs.push.apply(funcs, func._chained);
		} else {
			funcs.push(func);
		}
	}

	let chain = (...args: any[]) => {
		// https://github.com/GoogleChrome/devtools-docs/issues/53#issuecomment-51941358
		let lastResult;

		for (let i = 0; i < funcs.length; i += 1) {
			let result = funcs[i].apply(lastResult, args);

			if (typeof result !== 'undefined') {
				lastResult = result;
			}
		}

		return lastResult;
	};

	chain._chained = funcs;

	return chain;
};

/**
 * Chains a function to excute before the original function on the given `path` relative to `base`.
 * See also docs for `Common.chain`.
 * @method chainPathBefore
 * @param {} base The base object
 * @param {string} path The path relative to `base`
 * @param {function} func The function to chain before the original
 * @return {function} The chained function that replaced the original
 */
function chainPathBefore(base: Object, path: string, func: Function) {
	return object.set(base, path, chain(
		func,
		object.get(base, path)
	));
};

/**
 * Chains a function to excute after the original function on the given `path` relative to `base`.
 * See also docs for `Common.chain`.
 * @method chainPathAfter
 * @param {} base The base object
 * @param {string} path The path relative to `base`
 * @param {function} func The function to chain after the original
 * @return {function} The chained function that replaced the original
 */
function chainPathAfter(base: Object, path: string, func: Function) {
	return object.set(base, path, chain(
		object.get(base, path),
		func
	));
};