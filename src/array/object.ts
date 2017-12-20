namespace object {

	/**
	 * Extends the object in the first argument using the object in the second argument.
	 * @method extend
	 * @param {} obj
	 * @param {boolean} deep
	 * @return {} obj extended
	 */
	export function extend(obj: any, deep: any, ...args: any[]) {
		let argsStart: number,
			deepClone: boolean;

		if (typeof deep === 'boolean') {
			argsStart = 2;
			deepClone = deep;
		} else {
			argsStart = 1;
			deepClone = true;
		}

		for (let i = argsStart; i < arguments.length; i++) {
			let source = arguments[i];

			if (source) {
				for (let prop in source) {
					if (deepClone && source[prop] && source[prop].constructor === Object) {
						if (!obj[prop] || obj[prop].constructor === Object) {
							obj[prop] = obj[prop] || {};
							extend(obj[prop], deepClone, source[prop]);
						} else {
							obj[prop] = source[prop];
						}
					} else {
						obj[prop] = source[prop];
					}
				}
			}
		}

		return obj;
	};

	/**
	 * Creates a new clone of the object, if deep is true references will also be cloned.
	 * @method clone
	 * @param {} obj
	 * @param {bool} deep
	 * @return {} obj cloned
	 */
	export function clone(obj: any, deep: boolean) {
		return extend({}, deep, obj);
	};

	/**
	 * Returns the list of keys for the given object.
	 * @method keys
	 * @param {} obj
	 * @return {string[]} keys
	 */
	export function keys(obj: Object): string[]
	{
		if (Object.keys)
			return Object.keys(obj);

		// avoid hasOwnProperty for performance
		let keys: string[] = [];
		for (let key in obj)
			keys.push(key);
		return keys;
	};

	/**
	 * Returns the list of values for the given object.
	 * @method values
	 * @param {} obj
	 * @return {array} Array of the objects property values
	 */
	export function values(obj: Object): Array<any>
	{
		let values = [];

		if (Object.keys) {
			let keys = Object.keys(obj);
			for (let i = 0; i < keys.length; i++) {
				values.push(obj[keys[i]]);
			}
			return values;
		}

		// avoid hasOwnProperty for performance
		for (let key in obj)
			values.push(obj[key]);

		return values;
	}

	/**
	 * Gets a value from `base` relative to the `path` string.
	 * @method get
	 * @param {} obj The base object
	 * @param {string} path The path relative to `base`, e.g. 'Foo.Bar.baz'
	 * @param {number} [begin] Path slice begin
	 * @param {number} [end] Path slice end
	 * @return {} The object at the given path
	 */
	export function get<T>(obj: Object, path: string, begin?: number, end?: number): T {
		let paths = path.split('.').slice(begin, end);
		let o: any = obj;
		for (let i = 0; i < paths.length; i += 1) {
			o = o[paths[i]];
		}
		return o;
	}

	/**
	 * Sets a value on `base` relative to the given `path` string.
	 * @method set
	 * @param {} obj The base object
	 * @param {string} path The path relative to `base`, e.g. 'Foo.Bar.baz'
	 * @param {} val The value to set
	 * @param {number} [begin] Path slice begin
	 * @param {number} [end] Path slice end
	 * @return {} Pass through `val` for chaining
	 */
	export function set<T>(obj: Object, path: string, val: any, begin?: number, end?: number): T {
		let parts = path.split('.').slice(begin, end);
		get<T>(obj, path, 0, -1)[parts[parts.length - 1]] = val;
		return val;
	}


}