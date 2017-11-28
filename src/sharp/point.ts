namespace sharp {
	export class Point {

		public x: number;
		public y: number;

		/**
		 *
		 * @param {number} x
		 * @param {number} y
		 */
		constructor(x: number = 0, y: number = 0)
		{
			this.setTo(x, y);
		}

		/**
		 * clone一个新的
		 * Creates a copy of the given Point.
		 * @method sharp.Point#clone
		 * @return {sharp.Point} The new Point object.
		 */
		public clone(): Point
		{
			return new Point(this.x, this.y);
		}

		public static create(x: number = 0, y: number = 0)
		{
			return new Point(x, y);
		}

		/**
		 * 设置值到目标
		 * Copies the x and y properties from this Point to any given object.
		 * @method Phaser.Point#copyTo
		 * @param {any} dest - The object to copy to.
		 * @return {object} The dest object.
		 */
		public copyTo(dest: Point): Point
		{
			dest.x = this.x;
			dest.y = this.y;

			return dest;
		}

		/**
		 * 设置
		 * Sets the `x` and `y` values of this Point object to the given values.
		 * If you omit the `y` value then the `x` value will be applied to both, for example:
		 * `Point.setTo(2)` is the same as `Point.setTo(2, 2)`
		 * @method sharp.Point#setTo
		 * @param {number} x - The horizontal value of this point.
		 * @param {number} y - The vertical value of this point. If not given the x value will be used in its place.
		 * @return {sharp.Point} This Point object. Useful for chaining method calls.
		 */
		public setTo(xOrPoint: number | Point, y?: number): Point
		{
			if (xOrPoint instanceof Point) {
				this.x = xOrPoint.x;
				this.y = xOrPoint.y;
			} else {
				this.x = xOrPoint;
				this.y = y == null ? xOrPoint : y;
			}
			return this;
		}

		/**
		 * Sets the `x` and `y` values of this Point object from a given polar coordinate.
		 * @method Phaser.Point#setToPolar
		 * @param {number} azimuth The angular coordinate, in radians 弧度.
		 * @param {number} radius 半径
		 * @return {Phaser.Point} This Point object. Useful for chaining method calls.
		 */
		public setToPolar(azimuth: number, radius: number = 1): Point
		{

			return this.setTo(Math.cos(azimuth) * radius, Math.sin(azimuth) * radius);
		}

		/**
		 * 翻转点
		 * Inverts the x and y values of this Point
		 * @method Phaser.Point#invert
		 * @return {Phaser.Point} This Point object.
		 */
		public invert(): Point
		{
			return this.setTo(this.y, this.x);
		}

		/**
		 * 点减少
		 * Sets the `x` and `y` values of this Point object from a given polar coordinate.
		 * @method Phaser.Point#subtract
		 * @param {number} deltaX - The value to subtract from Point.x.
		 * @param {number} deltaY - The value to subtract from Point.y.
		 * @return {Phaser.Point} This Point object. Useful for chaining method calls.
		 */
		public subtract(deltaX: number, deltaY: number): Point
		{
			this.x -= deltaX;
			this.y -= deltaY;

			return this;
		}

		/**
		 * 点增加
		 * Adds the given x and y values to this Point.
		 * @method Phaser.Point#add
		 * @param {number} deltaX - The value to add to Point.x.
		 * @param {number} deltaY - The value to add to Point.y.
		 * @return {Phaser.Point} This Point object. Useful for chaining method calls.
		 */
		public add(deltaX: number, deltaY: number): Point
		{
			this.x += deltaX;
			this.y += deltaY;

			return this;
		}

		/**
		 * 点乘以
		 * Multiplies Point.x and Point.y by the given x and y values. Sometimes known as `Scale`.
		 * @method Phaser.Point#multiply
		 * @param deltaX - The value to multiply Point.x by.
		 * @param deltaY - The value to multiply Point.x by.
		 * @return {Phaser.Point} This Point object. Useful for chaining method calls.
		 */
		public multiply(deltaX: number, deltaY: number): Point
		{
			this.x *= deltaX;
			this.y *= deltaY;

			return this;
		}

		/**
		 * 点除以
		 * Divides Point.x and Point.y by the given x and y values.
		 * @method Phaser.Point#divide
		 * @param deltaX - The value to divide Point.x by.
		 * @param deltaY - The value to divide Point.x by.
		 * @return {Phaser.Point} This Point object. Useful for chaining method calls.
		 */
		public divide(deltaX: number, deltaY: number): Point
		{
			this.x /= deltaX;
			this.y /= deltaY;

			return this;
		}

		/**
		 * Clamps the x value of this Point to be between the given min and max.
		 *
		 * @method sharp.point#clampX
		 * @param {number} min - The minimum value to clamp this Point to.
		 * @param {number} max - The maximum value to clamp this Point to.
		 * @return {sharp.point} This Point object.
		 */
		public clampX(min: number, max: number): Point
		{
			this.x = math.clamp(this.x, min, max);

			return this;
		}
		/**
		 * Clamps the y value of this Point to be between the given min and max
		 *
		 * @method sharp.point#clampY
		 * @param {number} min - The minimum value to clamp this Point to.
		 * @param {number} max - The maximum value to clamp this Point to.
		 * @return {sharp.point} This Point object.
		 */
		public clampY(min: number, max: number): Point
		{
			this.y = math.clamp(this.y, min, max);

			return this;
		}
		/**
		 * Clamps this Point object values to be between the given min and max.
		 *
		 * @method sharp.point#clamp
		 * @param {number} min - The minimum value to clamp this Point to.
		 * @param {number} max - The maximum value to clamp this Point to.
		 * @return {sharp.point} This Point object.
		 */
		public clamp(min: number, max: number): Point
		{
			this.x = math.clamp(this.x, min, max);
			this.y = math.clamp(this.y, min, max);

			return this;
		}
		/**
		 * If this Point is not within the given object, moves it inside (at the nearest edge).
		 *
		 * @method sharp.point#clip
		 * @param {any} rect - A {@link sharp.Rectangle} or any object with left, top, right, and bottom properties.
		 * @return {sharp.point} This Point object.
		 */
		public clip (rect: Rectangle): Point
		{
			let left: number = rect.left, top: number = rect.top, right: number = rect.right, bottom: number = rect.bottom;

			if(this.x < left )  { this.x = left; }
			else if (this.x > right) { this.x = right; }
			if      (this.y < top)    { this.y = top; }
			else if (this.y > bottom) { this.y = bottom; }

			return this;
		}

		/**
			* Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties)
			*
			* @method sharp.Point#distance
			* @param {object} dest - The target object. Must have visible x and y properties that represent the center of the object.
			* @param {boolean} [round] - Round the distance to the nearest integer (default false).
			* @return {number} The distance between this Point object and the destination Point object.
			*/
		public distance(dest: Point, isRound: boolean = false): number
		{
			let distance = sharp.distance(this, dest);
			return isRound ? Math.round(distance) : distance;
		}

		/**
		* Determines whether the given objects x/y values are equal to this Point object.
		*
		* @method sharp.Point#equals
		* @param {sharp.Point|any} p - The object to compare with this Point.
		* @return {boolean} A value of true if the x and y points are equal, otherwise false.
		*/
		public equals(p: Point): boolean
		{
			return p.x === this.x && p.y === this.y;
		}

		/**
		* Determines whether a set of x-y coordinates are equal to this Point's.
		*
		* @method sharp.Point#equalsXY
		* @param {number} x - The x-coordinate to compare with this Point.
		* @param {number} y - The y-coordinate to compare with this Point.
		* @return {boolean} A value of true if the Point's coordinates are identical to the arguments, otherwise false.
		*/
		public equalsXY(x: number, y: number): boolean
		{
			return this.x === x && this.y === y;
		}

		public fuzzyEquals(p: Point, epsilon: number = 0.0001): boolean
		{
			return math.fuzzyEquals(this.x, p.x, epsilon) &&
				math.fuzzyEquals(this.y, p.y, epsilon);;
		}

		public fuzzyEqualsXY(x: number, y: number, epsilon: number = 0.0001): boolean
		{
			return this.fuzzyEquals(new Point(x, y), epsilon);
		}

		/**
		* Returns the angle between this Point object and another object with public x and y properties.
		*
		* @method sharp.Point#angle
		* @param {sharp.Point|any} p - The object to get the angle from this Point to.
		* @return {number} The angle between the two objects.
		*/
		public angle(p: Point): number
		{
			return Math.atan2(p.y - this.y, p.x - this.x);
		}

		/**
		* Rotates this Point around the x/y coordinates given to the desired angle.
		*
		* @method sharp.Point#rotate
		* @param {number} x - The x coordinate of the anchor point.
		* @param {number} y - The y coordinate of the anchor point.
		* @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
		* @param {number} [distance] - An optional distance constraint between the Point and the anchor.
		* @return {sharp.Point} The modified point object.
		*/
		public rotate(x: number, y: number, angle: number, distance?: number): Point
		{
			if (distance == null) {
				this.subtract(x, y);

				let s: number = Math.sin(angle);
				let c: number = Math.cos(angle);

				let tx: number = c * this.x - s * this.y;
				let ty: number = s * this.x + c * this.y;

				this.x = tx + x;
				this.y = ty + y;
			} else {
				let t: number = angle + Math.atan2(this.y - y, this.x - x);
				this.x = x + distance * Math.cos(t);
				this.y = y + distance * Math.sin(t);
			}

			return this;
		}

		/**
		* Calculates the length of the Point object.
		*
		* @method sharp.Point#getMagnitude
		* @return {number} The length of the Point.
		*/
		public getMagnitude(): number
		{
			return Math.sqrt((this.x * this.x) + (this.y * this.y));
		}

		/**
		* Calculates the length squared of the Point object.
		*
		* @method sharp.Point#getMagnitudeSq
		* @return {number} The length ^ 2 of the Point.
		*/
		public getMagnitudeSq(): number
		{
			return (this.x * this.x) + (this.y * this.y);
		}

		/**
		* Alters the length of the Point without changing the direction.
		*
		* @method sharp.Point#setMagnitude
		* @param {number} magnitude - The desired magnitude of the resulting Point.
		* @return {sharp.Point} This Point object.
		*/
		public setMagnitude(magnitude): Point
		{
			return this.normalize().multiply(magnitude, magnitude);
		}

		/**
		* Alters the Point object so that its length is 1, but it retains the same direction.
		*
		* @method sharp.Point#normalize
		* @return {sharp.Point} This Point object.
		*/
		public normalize(): Point
		{
			if (!this.isZero()) {
				let m: number = this.getMagnitude();
				this.x /= m;
				this.y /= m;
			}

			return this;
		}

		/**
		* Alters the Point object so it's magnitude is at most the max value.
		*
		* @method sharp.Point#limit
		* @param {number} max - The maximum magnitude for the Point.
		* @return {sharp.Point} This Point object.
		*/
		public limit(max: number): Point
		{
			if (this.getMagnitudeSq() > max * max) {
				this.setMagnitude(max);
			}

			return this;
		}

		/**
		* Determine if this point is at 0,0.
		*
		* @method sharp.Point#isZero
		* @return {boolean} True if this Point is 0,0, otherwise false.
		*/
		public isZero(): boolean
		{
			return (this.x === 0 && this.y === 0);
		}

		/**
		* The dot product of this and another Point object.
		*
		* @method sharp.Point#dot
		* @param {sharp.Point} a - The Point object to get the dot product combined with this Point.
		* @return {number} The result.
		*/
		public dot(p: Point): number
		{
			return ((this.x * p.x) + (this.y * p.y));
		}

		/**
		* The cross product of this and another Point object.
		*
		* @method sharp.Point#cross
		* @param {sharp.Point} a - The Point object to get the cross product combined with this Point.
		* @return {number} The result.
		*/
		public cross(p: Point): number
		{
			return ((this.x * p.y) - (this.y * p.x));
		}

		/**
		* Make this Point perpendicular (90 degrees rotation)
		*
		* @method sharp.Point#perp
		* @return {sharp.Point} This Point object.
		*/
		public perp(): Point
		{
			return this.setTo(-this.y, this.x);
		}

		/**
		* Make this Point perpendicular (-90 degrees rotation)
		*
		* @method sharp.Point#rperp
		* @return {sharp.Point} This Point object.
		*/
		public rperp(): Point
		{
			return this.setTo(this.y, -this.x);
		}

		/**
		* Right-hand normalize (make unit length) this Point.
		*
		* @method sharp.Point#normalRightHand
		* @return {sharp.Point} This Point object.
		*/
		public normalRightHand(): Point
		{
			return this.setTo(this.y * -1, this.x);
		}

		/**
		* Math.floor() both the x and y properties of this Point.
		*
		* @method sharp.Point#floor
		* @return {sharp.Point} This Point object.
		*/
		public floor(): Point
		{
			return this.setTo(Math.floor(this.x), Math.floor(this.y));
		}

		/**
		* Math.ceil() both the x and y properties of this Point.
		*
		* @method sharp.Point#ceil
		* @return {sharp.Point} This Point object.
		*/
		public ceil(): Point
		{
			return this.setTo(Math.ceil(this.x), Math.ceil(this.y));
		}

		/**
		 * Creates a negative Point.
		 *
		 * @method sharp.Point#negative
		 * @param {sharp.Point} a - The first Point object.
		 * @param {sharp.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
		 * @return {sharp.Point} The new Point object.
		 */
		public negative(): Point
		{
			return this.setTo(-this.x, -this.y);
		}

		/**
		 * Adds two 2D Points together and multiplies the result by the given scalar.
		 *
		 * @method sharp.Point#multiplyAdd
		 * @param {sharp.Point} p - The second Point object.
		 * @param {number} scaling - The scaling value.
		 * @param {sharp.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
		 * @return {sharp.Point} The new Point object.
		 */
		public multiplyAdd(p: Point, scaling: number): Point
		{
			return new Point(this.x + p.x * scaling, this.y + p.y * scaling);
		}

		/**
		 * Interpolates the two given Points, based on the `f` value (between 0 and 1) and returns a new Point.
		 *
		 * @method sharp.Point#interpolate
		 * @param {sharp.Point} p - The second Point object.
		 * @param {number} f - The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
		 * @param {sharp.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
		 * @return {sharp.Point} The new Point object.
		 */
		public interpolate(p: Point, f: number): Point
		{
			return new Point(this.x + (p.x - this.x) * f, this.y + (p.y - this.y) * f);
		}

		/**
		 * Project two Points onto another Point.
		 *
		 * @method sharp.Point#project
		 * @param {sharp.Point} p - The second Point object.
		 * @return {sharp.Point} The new Point object.
		 */
		public project(p: Point): Point
		{
			let out = new Point();

			let amt: number = this.dot(p) / p.getMagnitudeSq();

			if (amt !== 0) {
				out.setTo(amt * p.x, amt * p.y);
			}

			return out;
		}

		/**
		 * Project two Points onto a Point of unit length.
		 *
		 * @method sharp.Point#projectUnit
		 * @param {sharp.Point} p - The second Point object.
		 * @return {sharp.Point} The new Point object.
		 */
		public projectUnit(p: Point): Point
		{
			let out = new Point();

			let amt: number = this.dot(p);

			if (amt !== 0) {
				out.setTo(amt * p.x, amt * p.y);
			}

			return out;
		}

		/**
		* Returns a string representation of this object.
		*
		* @method sharp.Point#toString
		* @return {string} A string representation of the instance.
		*/
		public toString(): string
		{
			return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
		}

		/**
		 * Parses an object for x and/or y properties and returns a new sharp.Point with matching values.
		 * If the object doesn't contain those properties a Point with x/y of zero will be returned.
		 *
		 * @method sharp.Point#parse
		 * @static
		 * @param {object} obj - The object to parse.
		 * @param {string} [xProp='x'] - The property used to set the Point.x value.
		 * @param {string} [yProp='y'] - The property used to set the Point.y value.
		 * @return {sharp.Point} The new Point object.
		 */
		public static parse(obj: Object, xProp: string = 'x', yProp: string = 'y'): Point
		{
			let point = new Point();

			if (obj[xProp]) {
				point.x = parseInt(obj[xProp], 10);
			}

			if (obj[yProp]) {
				point.y = parseInt(obj[yProp], 10);
			}

			return point;
		}

		/**
		 * Tests a Point or Point-like object.
		 *
		 * @method sharp.Point#isPoint
		 * @static
		 * @return {boolean} - True if the object has numeric x and y properties.
		 */
		public static isPoint(obj: Object): boolean
		{
			return (obj != null) && (typeof obj['x'] === 'number') && (typeof obj['y'] === 'number');
		}

		/**
		 * Calculates centroid (or midpoint) from an array of points. If only one point is provided, that point is returned.
		 *
		 * @method sharp.Point#centroid
		 * @param {sharp.Point[]} points - The array of one or more points.
		 * @return {sharp.Point} The new Point object.
		 */
		public static centroid(...points: Point[]): Point
		{
			let out = new Point();

			let pointslength: number = points.length;

			if (pointslength < 1) {
				throw new Error("sharp.Point# Parameter 'points' array must not be empty");
			}

			if (pointslength === 1) {
				return points[0];
			}

			for (let i: number = 0; i < pointslength; i++) {
				out.add(points[i].x, points[i].y);
			}

			out.divide(pointslength, pointslength);

			return out;
		}

	}
}