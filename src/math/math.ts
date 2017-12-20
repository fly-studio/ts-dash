namespace math {
	let _seed: number = 0;

	/**
	 * Given a number, this function returns the closest number that is a power of two.
	 * This function is from the Starling Framework.
	 *
	 * @method math#getNextPowerOfTwo
	 * @param {number} value - The value to get the closest power of two from.
	 * @return {number} The closest number that is a power of two.
	 */
	export function getNextPowerOfTwo(value: number): number
	{
		if (value > 0 && (value & (value - 1)) === 0) {
			//  http://goo.gl/D9kPj
			return value;
		} else {
			let result: number = 1;

			while (result < value) {
				result <<= 1;
			}

			return result;
		}
	}

	/**
	 * Checks if the given dimensions make a power of two texture.
	 *
	 * @method math#isPowerOfTwo
	 * @param {number} width - The width to check.
	 * @param {number} height - The height to check.
	 * @return {boolean} True if the width and height are a power of two.
	 */
	export function isPowerOfTwo(width: number, height: number): boolean
	{
		return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
	}

	/**
	 * Returns a random float in the range `[min, max)`. If these parameters are not in order than they will be put in order.
	 * Default is 0 for `min` and 1 for `max`.
	 *
	 * @method math#random
	 * @param {number} min - The minimum value. Must be a Number.
	 * @param {number} max - The maximum value. Must be a Number.
	 * @return {number} A floating point number between min (inclusive) and max (exclusive).
	 */
	export function random(min: number = 0, max: number = 1): number
	{
		if (min === max) {
			return min;
		}

		if (min > max) {
			let temp: number = min;
			min = max;
			max = temp;
		}

		return (Math.random() * (max - min) + min);
	}

	/**
	 * Returns a random value between a minimum and a maximum value inclusive.
	 * The function uses a seeded random generator.
	 * @method random
	 * @param {number} min
	 * @param {number} max
	 * @return {number} A random number between min and max inclusive
	 */
	export function linearRandom(min: number = 0, max: number = 1) {
		return min + _seededRandom() * (max - min);
	}

	function _seededRandom() {
		// https://en.wikipedia.org/wiki/Linear_congruential_generator
		_seed = (_seed * 9301 + 49297) % 233280;
		return _seed / 233280;
	}

	/**
	 * Returns a random integer in the range `[min, max]`. If these parameters are not in order than they will be put in order.
	 * Default is 0 for `min` and 1 for `max`.
	 *
	 * @method math#between
	 * @param {number} min - The minimum value. Must be a Number.
	 * @param {number} max - The maximum value. Must be a Number.
	 * @return {number} An integer between min (inclusive) and max (inclusive).
	 */
	export function between(min: number = 0, max: number = 1): number
	{
		if (min === max) {
			return min;
		}

		if (min > max) {
			let temp: number = min;
			min = max;
			max = temp;
		}

		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Two number are fuzzyEqual if their difference is less than epsilon.
	 *
	 * @method math#fuzzyEqual
	 * @param {number} a - The first number to compare.
	 * @param {number} b - The second number to compare.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {boolean} True if |a-b|<epsilon
	 */
	export function fuzzyEquals(a: number, b: number, epsilon: number = 0.0001): boolean
	{
		return Math.abs(a - b) < epsilon;
	}

	/**
	 * `a` is fuzzyLessThan `b` if it is less than b + epsilon.
	 *
	 * @method math#fuzzyLessThan
	 * @param {number} a - The first number to compare.
	 * @param {number} b - The second number to compare.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {boolean} True if a<b+epsilon
	 */
	export function fuzzyLessThan(a: number, b: number, epsilon: number = 0.0001): boolean
	{
		return a < b + epsilon;
	}

	/**
	 * `a` is fuzzyGreaterThan `b` if it is more than b - epsilon.
	 *
	 * @method math#fuzzyGreaterThan
	 * @param {number} a - The first number to compare.
	 * @param {number} b - The second number to compare.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {boolean} True if a>b+epsilon
	 */
	export function fuzzyGreaterThan(a: number, b: number, epsilon: number = 0.0001): boolean
	{
		return a > b - epsilon;
	}

	/**
	 * Applies a fuzzy ceil to the given value.
	 *
	 * @method math#fuzzyCeil
	 * @param {number} val - The value to ceil.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {number} ceiling(val-epsilon)
	 */
	export function fuzzyCeil(val: number, epsilon: number = 0.0001): number
	{
		return Math.ceil(val - epsilon);
	}

	/**
	 * Applies a fuzzy floor to the given value.
	 *
	 * @method math#fuzzyFloor
	 * @param {number} val - The value to floor.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {number} floor(val+epsilon)
	 */
	export function fuzzyFloor(val: number, epsilon: number = 0.0001): number
	{
		return Math.floor(val + epsilon);
	}

	/**
	 * Averages all values passed to the function and returns the result.
	 *
	 * @method math#average
	 * @params {...number} The numbers to average
	 * @return {number} The average of all given values.
	 */
	export function average(...args: number[]): number
	{
		let sum: number = 0;
		let len: number = args.length;

		for (let i = 0; i < len; i++) {
			sum += (+args[i]);
		}

		return sum / len;
	}

	/**
	 * @method math#shear
	 * @param {number} n
	 * @return {number} n mod 1
	 */
	export function shear(n: number): number
	{
		return n % 1;
	}

	/**
	 * Snap a value to nearest grid slice, using rounding.
	 *
	 * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10 whereas 14 will snap to 15.
	 *
	 * @method math#snapTo
	 * @param {number} input - The value to snap.
	 * @param {number} gap - The interval gap of the grid.
	 * @param {number} [start=0] - Optional starting offset for gap.
	 * @return {number} The snapped value.
	 */
	export function snapTo(input: number, gap: number, start: number = 0): number
	{
		if (gap === 0) {
			return input;
		}

		input -= start;
		input = gap * Math.round(input / gap);

		return start + input;
	}

	/**
	 * Snap a value to nearest grid slice, using floor.
	 *
	 * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10.
	 * As will 14 snap to 10... but 16 will snap to 15.
	 *
	 * @method math#snapToFloor
	 * @param {number} input - The value to snap.
	 * @param {number} gap - The interval gap of the grid.
	 * @param {number} [start=0] - Optional starting offset for gap.
	 * @return {number} The snapped value.
	 */
	export function snapToFloor(input: number, gap: number, start: number = 0): number
	{
		if (gap === 0) {
			return input;
		}

		input -= start;
		input = gap * Math.floor(input / gap);

		return start + input;
	}

	/**
	 * Snap a value to nearest grid slice, using ceil.
	 *
	 * Example: if you have an interval gap of 5 and a position of 12... you will snap to 15.
	 * As will 14 will snap to 15... but 16 will snap to 20.
	 *
	 * @method math#snapToCeil
	 * @param {number} input - The value to snap.
	 * @param {number} gap - The interval gap of the grid.
	 * @param {number} [start=0] - Optional starting offset for gap.
	 * @return {number} The snapped value.
	 */
	export function snapToCeil(input: number, gap: number, start: number = 0): number
	{
		if (gap === 0) {
			return input;
		}

		input -= start;
		input = gap * Math.ceil(input / gap);

		return start + input;
	}

	/**
	 * Round to some place comparative to a `base`, default is 10 for decimal place.
	 * The `place` is represented by the power applied to `base` to get that place.
	 *
	 *     e.g. 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
	 *
	 *     roundTo(2000/7,3) === 0
	 *     roundTo(2000/7,2) == 300
	 *     roundTo(2000/7,1) == 290
	 *     roundTo(2000/7,0) == 286
	 *     roundTo(2000/7,-1) == 285.7
	 *     roundTo(2000/7,-2) == 285.71
	 *     roundTo(2000/7,-3) == 285.714
	 *     roundTo(2000/7,-4) == 285.7143
	 *     roundTo(2000/7,-5) == 285.71429
	 *
	 *     roundTo(2000/7,3,2)  == 288       -- 100100000
	 *     roundTo(2000/7,2,2)  == 284       -- 100011100
	 *     roundTo(2000/7,1,2)  == 286       -- 100011110
	 *     roundTo(2000/7,0,2)  == 286       -- 100011110
	 *     roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
	 *     roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
	 *     roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
	 *     roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
	 *     roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
	 *
	 * Note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
	 * because we are rounding 100011.1011011011011011 which rounds up.
	 *
	 * @method math#roundTo
	 * @param {number} value - The value to round.
	 * @param {number} [place=0] - The place to round to.
	 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
	 * @return {number} The rounded value.
	 */
	export function roundTo(value: number, place: number = 0, base: number = 10): number
	{
		let p: number = Math.pow(base, -place);

		return Math.round(value * p) / p;
	}

	/**
	 * Floors to some place comparative to a `base`, default is 10 for decimal place.
	 * The `place` is represented by the power applied to `base` to get that place.
	 *
	 * @method math#floorTo
	 * @param {number} value - The value to round.
	 * @param {number} [place=0] - The place to round to.
	 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
	 * @return {number} The rounded value.
	 */
	export function floorTo(value: number, place: number = 0, base: number = 10): number
	{
		let p: number = Math.pow(base, -place);

		return Math.floor(value * p) / p;
	}

	/**
	 * Ceils to some place comparative to a `base`, default is 10 for decimal place.
	 * The `place` is represented by the power applied to `base` to get that place.
	 *
	 * @method math#ceilTo
	 * @param {number} value - The value to round.
	 * @param {number} [place=0] - The place to round to.
	 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
	 * @return {number} The rounded value.
	 */
	export function ceilTo(value: number, place: number = 0, base: number = 10): number
	{
		let p: number = Math.pow(base, -place);

		return Math.ceil(value * p) / p;
	}

	/**
	 * Adds the given amount to the value, but never lets the value go over the specified maximum.
	 *
	 * @method math#maxAdd
	 * @param {number} value - The value to add the amount to.
	 * @param {number} amount - The amount to add to the value.
	 * @param {number} max - The maximum the value is allowed to be.
	 * @return {number} The new value.
	 */
	export function maxAdd(value: number, amount: number, max: number): number
	{
		return Math.min(value + amount, max);
	}

	/**
	 * Subtracts the given amount from the value, but never lets the value go below the specified minimum.
	 *
	 * @method math#minSub
	 * @param {number} value - The base value.
	 * @param {number} amount - The amount to subtract from the base value.
	 * @param {number} min - The minimum the value is allowed to be.
	 * @return {number} The new value.
	 */
	export function minSub(value: number, amount: number, min: number): number
	{
		return Math.max(value - amount, min);
	}

	/**
	 * Ensures that the value always stays between min and max, by wrapping the value around.
	 *
	 * If `max` is not larger than `min` the result is 0.
	 *
	 * @method math#wrap
	 * @param {number} value - The value to wrap.
	 * @param {number} min - The minimum the value is allowed to be.
	 * @param {number} max - The maximum the value is allowed to be, should be larger than `min`.
	 * @return {number} The wrapped value.
	 */
	export function wrap(value: number, min: number, max: number): number
	{
		let range: number = max - min;

		if (range <= 0) {
			return 0;
		}

		let result: number = (value - min) % range;

		if (result < 0) {
			result += range;
		}

		return result + min;
	}

	/**
	 * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
	 *
	 * Values _must_ be positive integers, and are passed through Math.abs. See {@link math#wrap} for an alternative.
	 *
	 * @method math#wrapValue
	 * @param {number} value - The value to add the amount to.
	 * @param {number} amount - The amount to add to the value.
	 * @param {number} max - The maximum the value is allowed to be.
	 * @return {number} The wrapped value.
	 */
	export function wrapValue(value: number, amount: number, max: number): number
	{
		let diff: number;
		value = Math.abs(value);
		amount = Math.abs(amount);
		max = Math.abs(max);
		diff = (value + amount) % max;

		return diff;
	}

	/**
	 * Returns true if the number given is odd.
	 *
	 * @method math#isOdd
	 * @param {integer} n - The number to check.
	 * @return {boolean} True if the given number is odd. False if the given number is even.
	 */
	export function isOdd(n: number): boolean
	{
		// Does not work with extremely large values
		return !!(n & 1);
	}

	/**
	 * Returns true if the number given is even.
	 *
	 * @method math#isEven
	 * @param {integer} n - The number to check.
	 * @return {boolean} True if the given number is even. False if the given number is odd.
	 */
	export function isEven(n: number): boolean
	{
		// Does not work with extremely large values
		return !(n & 1);
	}

	/**
	 * Variation of Math.min that can be passed either an array of numbers or the numbers as parameters.
	 *
	 * Prefer the standard `Math.min` function when appropriate.
	 *
	 * @method math#min
	 * @return {number} The lowest value from those given.
	 * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
	 */
	export function min(...args: number[]): number
	{
		let data: number[] = args, min: number = 0, len: number = data.length;

		for (let i:number = 1; i < len; i++) {
			if (data[i] < data[min]) {
				min = i;
			}
		}

		return data[min];
	}

	/**
	 * Variation of Math.max that can be passed either an array of numbers or the numbers as parameters.
	 *
	 * Prefer the standard `Math.max` function when appropriate.
	 *
	 * @method math#max
	 * @return {number} The largest value from those given.
	 * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
	 */
	export function max(...args: number[]): number
	{
		let data: number[] = args, max: number = 0, len: number = data.length;

		for (let i: number = 1; i < len; i++) {
			if (data[i] > data[max]) {
				max = i;
			}
		}

		return data[max];
	}

	/**
	 * Variation of Math.min that can be passed a property and either an array of objects or the objects as parameters.
	 * It will find the lowest matching property value from the given objects.
	 *
	 * @method math#minProperty
	 * @return {number} The lowest value from those given.
	 */
	export function minProperty(property: string, ...args: Object[]): number
	{
		let data: Object[] = args, min: number = 0, len: number = data.length;

		for (let i = 1; i < len; i++) {
			if (data[i][property] < data[min][property]) {
				min = i;
			}
		}

		return data[min][property];
	}

	/**
	 * Variation of Math.max that can be passed a property and either an array of objects or the objects as parameters.
	 * It will find the largest matching property value from the given objects.
	 *
	 * @method math#maxProperty
	 * @return {number} The largest value from those given.
	 */
	export function maxProperty(property: string, ...args: Object[]): number
	{
		let data: Object[] = args, max: number = 0, len: number = data.length;

		for (let i = 1; i < len; i++) {
			if (data[i][property] > data[max][property]) {
				max = i;
			}
		}

		return data[max][property];
	}

	/**
	 * A Linear Interpolation Method, mostly used by Phaser.Tween.
	 *
	 * @method math#linearInterpolation
	 * @param {Array} v - The input array of values to interpolate between.
	 * @param {number} k - The percentage of interpolation, between 0 and 1.
	 * @return {number} The interpolated value
	 */
	export function linearInterpolation(v: number[], k: number): number
	{
		let m: number = v.length - 1;
		let f: number = m * k;
		let i: number = Math.floor(f);

		if (k < 0) {
			return linear(v[0], v[1], f);
		}

		if (k > 1) {
			return linear(v[m], v[m - 1], m - f);
		}

		return linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
	}

	/**
	 * A Bezier Interpolation Method, mostly used by Phaser.Tween.
	 *
	 * @method math#bezierInterpolation
	 * @param {Array} v - The input array of values to interpolate between.
	 * @param {number} k - The percentage of interpolation, between 0 and 1.
	 * @return {number} The interpolated value
	 */
	export function bezierInterpolation(v: number[], k: number): number
	{
		let b: number = 0;
		let n: number = v.length - 1;

		for (let i: number = 0; i <= n; i++) {
			b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * bernstein(n, i);
		}

		return b;
	}

	/**
	 * A Catmull Rom Interpolation Method, mostly used by Phaser.Tween.
	 *
	 * @method math#catmullRomInterpolation
	 * @param {Array} v - The input array of values to interpolate between.
	 * @param {number} k - The percentage of interpolation, between 0 and 1.
	 * @return {number} The interpolated value
	 */
	export function catmullRomInterpolation(v: number[], k: number): number
	{
		let m: number = v.length - 1;
		let f: number = m * k;
		let i: number = Math.floor(f);

		if (v[0] === v[m]) {
			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
		}
		else {
			if (k < 0) {
				return v[0] - (catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
		}
	}

	/**
	 * Calculates a linear (interpolation) value over t.
	 *
	 * @method math#linear
	 * @param {number} p0
	 * @param {number} p1
	 * @param {number} t - A value between 0 and 1.
	 * @return {number}
	 */
	export function linear(p0: number, p1: number, t: number): number
	{
		return (p1 - p0) * t + p0;
	}

	/**
	 *
	 *
	 * @method math#bernstein
	 * @protected
	 * @param {number} n
	 * @param {number} i
	 * @return {number}
	 */
	export function bernstein(n: number, i: number): number
	{
		return factorial(n) / factorial(i) / factorial(n - i);
	}

	/**
	 * 阶乘
	 *
	 * @method math#factorial
	 * @param {number} value - the number you want to evaluate
	 * @return {number}
	 */
	export function factorial(value: number)
	{
		if (value === 0) {
			return 1;
		}

		let res: number = value;

		while (--value) {
			res *= value;
		}

		return res;
	}

	/**
	 * Calculates a catmum rom value.
	 *
	 * @method math#catmullRom
	 * @protected
	 * @param {number} p0
	 * @param {number} p1
	 * @param {number} p2
	 * @param {number} p3
	 * @param {number} t
	 * @return {number}
	 */
	export function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number
	{
		let v0: number = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;

		return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
	}

	/**
	 * The absolute difference between two values.
	 *
	 * @method math#difference
	 * @param {number} a - The first value to check.
	 * @param {number} b - The second value to check.
	 * @return {number} The absolute difference between the two values.
	 */
	export function difference(a: number, b: number): number
	{
		return Math.abs(a - b);
	}

	/**
	 * Round to the next whole number _away_ from zero.
	 *
	 * @method math#roundAwayFromZero
	 * @param {number} value - Any number.
	 * @return {integer} The rounded value of that number.
	 */
	export function roundAwayFromZero(value: number): number
	{
		// "Opposite" of truncate.
		return (value > 0) ? Math.ceil(value) : Math.floor(value);
	}

	export interface SinCosGenerator {
		sin: number[];
		cos: number[];
		length: number;
	}

	/**
	 * Generate a sine and cosine table simultaneously and extremely quickly.
	 * The parameters allow you to specify the length, amplitude and frequency of the wave.
	 * This generator is fast enough to be used in real-time.
	 * Code based on research by Franky of scene.at
	 *
	 * @method math#sinCosGenerator
	 * @param {number} length - The length of the wave
	 * @param {number} sinAmplitude - The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	 * @param {number} cosAmplitude - The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	 * @param {number} frequency  - The frequency of the sine and cosine table data
	 * @return {{sin:number[], cos:number[]}} Returns the table data.
	 */
	export function sinCosGenerator(length: number, sinAmplitude: number = 1.0, cosAmplitude: number = 1.0, frequency: number = 1.0): SinCosGenerator
	{
		let sin: number = sinAmplitude;
		let cos: number = cosAmplitude;
		let frq: number = frequency * Math.PI / length;

		let cosTable: number[] = [];
		let sinTable: number[] = [];

		for (let c = 0; c < length; c++) {

			cos -= sin * frq;
			sin += cos * frq;

			cosTable[c] = cos;
			sinTable[c] = sin;

		}

		return { sin: sinTable, cos: cosTable, length: length };
	}

	/**
	 * Force a value within the boundaries by clamping it to the range `min`, `max`.
	 *
	 * @method math#clamp
	 * @param {float} v - The value to be clamped.
	 * @param {float} min - The minimum bounds.
	 * @param {float} max - The maximum bounds.
	 * @return {number} The clamped value.
	 */
	export function clamp(v: number, min: number, max: number): number
	{
		if (v < min) {
			return min;
		} else if (max < v) {
			return max;
		} else {
			return v;
		}
	}

	/**
	 * Clamp `x` to the range `[a, Infinity)`.
	 * Roughly the same as `Math.max(x, a)`, except for NaN handling.
	 *
	 * @method math#clampBottom
	 * @param {number} x
	 * @param {number} a
	 * @return {number}
	 */
	export function clampBottom(x: number, a: number): number
	{
		return x < a ? a : x;
	}

	/**
	 * Checks if two values are within the given tolerance of each other.
	 *
	 * @method math#within
	 * @param {number} a - The first number to check
	 * @param {number} b - The second number to check
	 * @param {number} tolerance - The tolerance. Anything equal to or less than this is considered within the range.
	 * @return {boolean} True if a is <= tolerance of b.
	 * @see {@link fuzzyEqual}
	 */
	export function within(a: number, b: number, tolerance: number): boolean
	{
		return (Math.abs(a - b) <= tolerance);
	}

	/**
	 * Linear mapping from range <a1, a2> to range <b1, b2>
	 *
	 * @method math#mapLinear
	 * @param {number} x - The value to map
	 * @param {number} a1 - First endpoint of the range <a1, a2>
	 * @param {number} a2 - Final endpoint of the range <a1, a2>
	 * @param {number} b1 - First endpoint of the range <b1, b2>
	 * @param {number} b2 - Final endpoint of the range  <b1, b2>
	 * @return {number}
	 */
	export function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number
	{
		return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
	}

	/**
	 * Smoothstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
	 *
	 * @method math#smoothstep
	 * @param {float} x - The input value.
	 * @param {float} min - The left edge. Should be smaller than the right edge.
	 * @param {float} max - The right edge.
	 * @return {float} A value between 0 and 1.
	 */
	export function smoothstep(x: number, min: number, max: number): number
	{
		// Scale, bias and saturate x to 0..1 range
		x = Math.max(0, Math.min(1, (x - min) / (max - min)));

		// Evaluate polynomial
		return x * x * (3 - 2 * x);
	}

	/**
	 * Smootherstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
	 *
	 * @method math#smootherstep
	 * @param {float} x - The input value.
	 * @param {float} min - The left edge. Should be smaller than the right edge.
	 * @param {float} max - The right edge.
	 * @return {float} A value between 0 and 1.
	 */
	export function smootherstep(x: number, min: number, max: number): number
	{
		x = Math.max(0, Math.min(1, (x - min) / (max - min)));

		return x * x * x * (x * (x * 6 - 15) + 10);
	}

	/**
	 * A value representing the sign of the value: -1 for negative, +1 for positive, 0 if value is 0.
	 *
	 * This works differently from `Math.sign` for values of NaN and -0, etc.
	 *
	 * @method math#sign
	 * @param {number} x
	 * @return {integer} An integer in {-1, 0, 1}
	 */
	export function sign(x: number): number
	{
		return (x < 0) ? -1 : ((x > 0) ? 1 : 0);
	}

	/**
	 * Work out what percentage value `a` is of value `b` using the given base.
	 *
	 * @method math#percent
	 * @param {number} a - The value to work out the percentage for.
	 * @param {number} b - The value you wish to get the percentage of.
	 * @param {number} [base=0] - The base value.
	 * @return {number} The percentage a is of b, between 0 and 1.
	 */
	export function percent(a: number, b: number, base: number = 0): number
	{
		if (a > b || base > b) {
			return 1;
		} else if (a < base || base > a) {
			return 0;
		} else {
			return (a - base) / b;
		}
	}
}