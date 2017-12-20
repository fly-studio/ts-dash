namespace math {
	export class RandomDataGenerator {
		/**
		 * @property {number} c - Internal var.
		 * @private
		 */
		protected c: number = 1;
		/**
		 * @property {number} s0 - Internal var.
		 * @private
		 */
		protected s0: number = 0;
		/**
		 * @property {number} s1 - Internal var.
		 * @private
		 */
		protected s1: number = 0;
		/**
		 * @property {number} s2 - Internal var.
		 * @private
		 */
		protected s2: number = 0;

		/**
		 * An extremely useful repeatable random data generator.
		 *
		 * Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense.
		 *
		 * The random number genererator is based on the Alea PRNG, but is modified.
		 *  - https://github.com/coverslide/node-alea
		 *  - https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
		 *  - http://baagoe.org/en/wiki/Better_random_numbers_for_javascript (original, perm. 404)
		 *
		 * @class Phaser.RandomDataGenerator
		 * @constructor
		 * @param {any[]|string} [seeds] - An array of values to use as the seed, or a generator state (from {#state}).
		 */
		public constructor(seeds: string|any[] = [])
		{
			if (seeds instanceof String)
				this.state(seeds);
			else
				this.sow(seeds);
		}

		/**
		 * Private random helper.
		 *
		 * @method math.RandomDataGenerator#rnd
		 * @private
		 * @return {number}
		 */
		protected rnd(): number
		{
			let t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

			this.c = t | 0;
			this.s0 = this.s1;
			this.s1 = this.s2;
			this.s2 = t - this.c;

			return this.s2;
		}

		/**
		 * Reset the seed of the random data generator.
		 *
		 * _Note_: the seed array is only processed up to the first `undefined` (or `null`) value, should such be present.
		 *
		 * @method math.RandomDataGenerator#sow
		 * @param {any[]} seeds - The array of seeds: the `toString()` of each value is used.
		 */
		protected sow(seeds: any[]): void
		{
			// Always reset to default seed
			this.s0 = this.hash(' ');
			this.s1 = this.hash(this.s0);
			this.s2 = this.hash(this.s1);
			this.c = 1;

			// Apply any seeds
			for (let i = 0; i < seeds.length && (seeds[i] != null); i++) {
				let seed = seeds[i];

				this.s0 -= this.hash(seed);
				this.s0 += ~~(this.s0 < 0);
				this.s1 -= this.hash(seed);
				this.s1 += ~~(this.s1 < 0);
				this.s2 -= this.hash(seed);
				this.s2 += ~~(this.s2 < 0);
			}
		}

		/**
		 * Internal method that creates a seed hash.
		 *
		 * @method math.RandomDataGenerator#hash
		 * @private
		 * @param {any} data
		 * @return {number} hashed value.
		 */
		protected hash(data: any): number
		{

			let h: number, i: number, n: number;
			n = 0xefc8249d;
			data = data.toString();

			for (i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000;// 2^32
			}

			return (n >>> 0) * 2.3283064365386963e-10;// 2^-32

		}

		/**
		 * Returns a random integer between 0 and 2^32.
		 *
		 * @method math.RandomDataGenerator#integer
		 * @return {number} A random integer between 0 and 2^32.
		 */
		public integer(): number
		{
			return this.rnd.apply(this) * 0x100000000;// 2^32
		}

		/**
		 * Returns a random real number between 0 and 1.
		 *
		 * @method math.RandomDataGenerator#frac
		 * @return {number} A random real number between 0 and 1.
		 */
		public frac(): number
		{
			return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;   // 2^-53
		}

		/**
		 * Returns a random real number between 0 and 2^32.
		 *
		 * @method math.RandomDataGenerator#real
		 * @return {number} A random real number between 0 and 2^32.
		 */
		public real(): number
		{
			return this.integer() + this.frac();
		}

		/**
		 * Returns a random integer between and including min and max.
		 *
		 * @method math.RandomDataGenerator#integerInRange
		 * @param {number} min - The minimum value in the range.
		 * @param {number} max - The maximum value in the range.
		 * @return {number} A random number between min and max.
		 */
		public integerInRange(min: number, max: number): number
		{
			return Math.floor(this.realInRange(0, max - min + 1) + min);
		}

		/**
		 * Returns a random integer between and including min and max.
		 * This method is an alias for RandomDataGenerator.integerInRange.
		 *
		 * @method math.RandomDataGenerator#between
		 * @param {number} min - The minimum value in the range.
		 * @param {number} max - The maximum value in the range.
		 * @return {number} A random number between min and max.
		 */
		public between(min: number, max: number): number
		{
			return this.integerInRange(min, max);
		}

		/**
		 * Returns a random real number between min and max.
		 *
		 * @method math.RandomDataGenerator#realInRange
		 * @param {number} min - The minimum value in the range.
		 * @param {number} max - The maximum value in the range.
		 * @return {number} A random number between min and max.
		 */
		public realInRange(min: number, max: number): number
		{
			return this.frac() * (max - min) + min;
		}

		/**
		 * Returns a random real number between -1 and 1.
		 *
		 * @method math.RandomDataGenerator#normal
		 * @return {number} A random real number between -1 and 1.
		 */
		public normal(): number
		{
			return 1 - 2 * this.frac();
		}

		/**
		 * Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
		 *
		 * @method math.RandomDataGenerator#uuid
		 * @return {string} A valid RFC4122 version4 ID hex string
		 */
		public uuid(): string
		{
			let a: number = 0,
				b: string = '';

			for (;a < 36;a++) {
				b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'
			}
			return b;
		}

		/**
		 * Returns a random member of `array`.
		 *
		 * @method math.RandomDataGenerator#pick
		 * @param {Array} ary - An Array to pick a random member of.
		 * @return {any} A random member of the array.
		 */
		public pick<T>(ary: Array<T>): T
		{
			return ary[this.integerInRange(0, ary.length - 1)];
		}

		/**
		 * Returns a sign to be used with multiplication operator.
		 *
		 * @method math.RandomDataGenerator#sign
		 * @return {number} -1 or +1.
		 */
		public sign(): number
		{
			return this.pick([-1, 1]);
		}

		/**
		 * Returns a random member of `array`, favoring the earlier entries.
		 *
		 * @method math.RandomDataGenerator#weightedPick
		 * @param {Array} ary - An Array to pick a random member of.
		 * @return {any} A random member of the array.
		 */
		public weightedPick<T>(ary: Array<T>): T
		{
			return ary[~~(Math.pow(this.frac(), 2) * (ary.length - 1) + 0.5)];
		}

		/**
		 * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
		 *
		 * @method math.RandomDataGenerator#timestamp
		 * @param {number} min - The minimum value in the range.
		 * @param {number} max - The maximum value in the range.
		 * @return {number} A random timestamp between min and max.
		 */
		public timestamp(min: number = 946684800000, max: number = 1577862000000): number
		{
			return this.realInRange(min, max);
		}

		/**
		 * Returns a random angle between -180 and 180.
		 *
		 * @method math.RandomDataGenerator#angle
		 * @return {number} A random number between -180 and 180.
		 */
		public angle(): number
		{
			return this.integerInRange(-180, 180);
		}

		/**
		 * Gets or Sets the state of the generator. This allows you to retain the values
		 * that the generator is using between games, i.e. in a game save file.
		 *
		 * To seed this generator with a previously saved state you can pass it as the
		 * `seed` value in your game config, or call this method directly after Phaser has booted.
		 *
		 * Call this method with no parameters to return the current state.
		 *
		 * If providing a state it should match the same format that this method
		 * returns, which is a string with a header `!rnd` followed by the `c`,
		 * `s0`, `s1` and `s2` values respectively, each comma-delimited.
		 *
		 * @method math.RandomDataGenerator#state
		 * @param {string} [state] - Generator state to be set.
		 * @return {string} The current state of the generator.
		 */
		public state(state: string): string
		{
			if (typeof state === 'string' && state.match(/^!rnd/)) {
				let stateArr = state.split(',');

				this.c = parseFloat(stateArr[1]);
				this.s0 = parseFloat(stateArr[2]);
				this.s1 = parseFloat(stateArr[3]);
				this.s2 = parseFloat(stateArr[4]);
			}

			return ['!rnd', this.c, this.s0, this.s1, this.s2].join(',');
		}
	}
}