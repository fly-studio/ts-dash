namespace sharp.common {

	let _nextId: number = 0;
	let _nowStartTime: number = +(new Date);

	/**
	 * Returns the current timestamp since the time origin (e.g. from page load).
	 * The result will be high-resolution including decimal places if available.
	 * @method now
	 * @return {number} the current timestamp
	 */
	export function now(): number
	{
		if (window.performance) {
			if (window.performance.now) {
				return window.performance.now();
			} else if (typeof window.performance['webkitNow'] != 'undefined') {
				return window.performance['webkitNow']();
			}
		}

		return +(new Date()) - _nowStartTime;
	}

	/**
	 * Returns the next unique sequential ID.
	 * @method nextId
	 * @return {Number} Unique sequential ID
	 */
	export function nextId() {
		return _nextId++;
	}
}