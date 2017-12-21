namespace sharp {
	export class Hermite {
		/**
		 * @property {number} _p1x - The x coordinate of the start of the curve.
		 * @protected
		 */
		protected _p1x: number;
		/**
		 * @property {number} _p1y - The y coordinate of the start of the curve.
		 * @protected
		 */
		protected _p1y: number;
		/**
		 * @property {number} _p2x - The x coordinate of the end of the curve.
		 * @protected
		 */
		protected _p2x: number;
		/**
		 * @property {number} _p2y - The y coordinate of the end of the curve.
		 * @protected
		 */
		protected _p2y: number;
		/**
		 * @property {number} _v1x - The x component of the tangent vector for the start of the curve.
		 * @protected
		 */
		protected _v1x: number;
		 /**
		 * @property {number} _v1y - The y component of the tangent vector for the start of the curve.
		 * @protected
		 */
		protected _v1y: number;
		 /**
		 * @property {number} _v2x - The x component of the tangent vector for the end of the curve.
		 * @protected
		 */
		protected _v2x: number;
		/**
		 * @property {number} _v2y - The y component of the tangent vector for the end of the curve.
		 * @protected
		 */
		protected _v2y: number;
		/**
		 * @property {number} _accuracy - The amount of points to pre-calculate on the curve.
		 * @protected
		 */
		protected _accuracy: number;

		protected _points: number[];
		protected _temp1: Point;
		protected _temp2: Point;

		protected _ax: number;
		protected _ay: number;
		protected _bx: number;
		protected _by: number;
		protected _length: number;

		/**
		 * A data representation of a Hermite Curve (see http://en.wikipedia.org/wiki/Cubic_Hermite_spline)
		 *
		 * A Hermite curve has a start and end point and tangent vectors for both of them.
		 * The curve will always pass through the two control points and the shape of it is controlled
		 * by the length and direction of the tangent vectors.  At the control points the curve will
		 * be facing exactly in the vector direction.
		 *
		 * As these curves change speed (speed = distance between points separated by an equal change in
		 * 't' value - see Hermite.getPoint) this class attempts to reduce the variation by pre-calculating
		 * the `accuracy` number of points on the curve. The straight-line distances to these points are stored
		 * in the private 'points' array, and this information is used by Hermite.findT() to convert a pixel
		 * distance along the curve into a 'time' value.
		 *
		 * Higher `accuracy` values will result in more even movement, but require more memory for the points
		 * list. 5 works, but 10 seems to be an ideal value for the length of curves found in most games on
		 * a desktop screen. If you use very long curves (more than 400 pixels) you may need to increase
		 * this value further.
		 *
		 * @class sharp.Hermite
		 * @constructor
		 * @param {number} p1x - The x coordinate of the start of the curve.
		 * @param {number} p1y - The y coordinate of the start of the curve.
		 * @param {number} p2x - The x coordinate of the end of the curve.
		 * @param {number} p2y - The y coordinate of the end of the curve.
		 * @param {number} v1x - The x component of the tangent vector for the start of the curve.
		 * @param {number} v1y - The y component of the tangent vector for the start of the curve.
		 * @param {number} v2x - The x component of the tangent vector for the end of the curve.
		 * @param {number} v2y - The y component of the tangent vector for the end of the curve.
		 * @param {number} [accuracy=10] The amount of points to pre-calculate on the curve.
		 */
		constructor(p1x: number, p1y: number, p2x: number, p2y: number, v1x: number, v1y: number, v2x: number, v2y: number, accuracy: number = 10)
		{
			this.setTo(p1x, p1y, p2x, p2y, v1x, v1y, v2x, v2y, accuracy);
		}

		/**
		 * @name sharp.Hermite#p1x
		 * @property {number} p1x - The x coordinate of the start of the curve. Setting this value will recalculate the curve.
		 */
		public get p1x(): number {
			return this._p1x;
		}

		public set p1x(value: number) {
			if (value !== this._p1x) {
				this._p1x = value;
				this.recalculate();
			}
		}

		/**
		 * @name sharp.Hermite#p1y
		 * @property {number} p1y - The y coordinate of the start of the curve. Setting this value will recalculate the curve.
		 */
		public get p1y(): number {
			return this._p1y;
		}

		public set p1y(value: number) {
			if (value !== this._p1y) {
				this._p1y = value;
				this.recalculate();
			}
		}

		/**
		 * @name sharp.Hermite#p2x
		 * @property {number} p2x - The x coordinate of the end of the curve. Setting this value will recalculate the curve.
		 */
		public get p2x(): number {
			return this._p2x;
		}

		public set p2x(value: number) {
			if (value !== this._p2x) {
				this._p2x = value;
				this.recalculate();
			}
		}

		/**
		 * @name sharp.Hermite#p2y
		 * @property {number} p2y - The y coordinate of the end of the curve. Setting this value will recalculate the curve.
		 */
		public get p2y(): number {
			return this._p2y;
		}

		public set p2y(value: number) {
			if (value !== this._p2y) {
				this._p2y = value;
				this.recalculate();
			}
		}

		/**
		 * @name sharp.Hermite#v1x
		 * @property {number} v1x - The x component of the tangent vector for the start of the curve. Setting this value will recalculate the curve.
		 */
		public get v1x(): number {
			return this._v1x;
		}

		public set v1x(value: number) {
			if (value !== this._v1x) {
				this._v1x = value;
				this.recalculate();
			}
		}

		/**
		 * @name sharp.Hermite#v1y
		 * @property {number} v1y - The y component of the tangent vector for the start of the curve. Setting this value will recalculate the curve.
		 */
		public get v1y(): number {
			return this._v1y;
		}

		public set v1y(value: number) {
			if (value !== this._v1y) {
				this._v1y = value;
				this.recalculate();
			}
		}
		/**
		 * @name sharp.Hermite#v2x
		 * @property {number} v2x - The x component of the tangent vector for the end of the curve. Setting this value will recalculate the curve.
		 */
		public get v2x(): number {
			return this._v2x;
		}

		public set v2x(value: number) {
			if (value !== this._v2x) {
				this._v2x = value;
				this.recalculate();
			}
		}

		/**
		 * @name sharp.Hermite#v2y
		 * @property {number} v2y - The y component of the tangent vector for the end of the curve. Setting this value will recalculate the curve.
		 */
		public get v2y(): number {
			return this._v2y;
		}

		public set v2y(value: number) {
			if (value !== this._v2y) {
				this._v2y = value;
				this.recalculate();
			}
		}

		public get ax(): number {
			return this._ax;
		}

		public get ay(): number {
			return this._ax;
		}

		public get bx(): number {
			return this._ax;
		}

		public get by(): number {
			return this._ax;
		}

		public get length(): number {
			return this._ax;
		}

		public get points(): number[] {
			return this._points;
		}

		public setTo(p1x: number, p1y: number, p2x: number, p2y: number, v1x: number, v1y: number, v2x: number, v2y: number, accuracy: number = 10): Hermite
		{
			this._p1x = p1x;
			this._p1y = p1y;
			this._p2x = p2x;
			this._p2y = p2y;
			this._v1x = v1x;
			this._v1y = v1y;
			this._v2x = v2x;
			this._v2y = v2y;
			this._accuracy = accuracy;

			this._points = [];
			this._temp1 = new Point();
			this._temp2 = new Point();
			this.recalculate();

			return this;
		}

		public clone(): Hermite
		{
			return new Hermite(this._p1x, this._p1y, this._p2x, this._p2y, this._v1x, this._v1y, this._v2x, this._v2y, this._accuracy);
		}

		public static create(p1x: number, p1y: number, p2x: number, p2y: number, v1x: number, v1y: number, v2x: number, v2y: number, accuracy: number = 10)
		{
			return new Hermite(p1x, p1y, p2x, p2y, v1x, v1y, v2x, v2y, accuracy);
		}

		/**
		 * Performs the curve calculations.
		 *
		 * This is called automatically if you change any of the curves public properties, such as `Hermite.p1x` or `Hermite.v2y`.
		 *
		 * If you adjust any of the internal private values, then call this to update the points.
		 *
		 * @method sharp.Hermite#recalculate
		 * @return {sharp.Hermite} This object.
		 */
		protected recalculate() {

			this._ax = (2 * this._p1x - 2 * this._p2x + this._v1x + this._v2x);
			this._ay = (2 * this._p1y - 2 * this._p2y + this._v1y + this._v2y);
			this._bx = (-3 * this._p1x + 3 * this._p2x - 2 * this._v1x - this._v2x);
			this._by = (-3 * this._p1y + 3 * this._p2y - 2 * this._v1y - this._v2y);

			this._length = this.calculateEvenPoints();

			return this;
		}

		/**
		 * Calculate a number of points along the curve, based on `Hermite.accuracy`, and stores them in the private `_points` array.
		 *
		 * @method sharp.Hermite#calculateEvenPoints
		 * @return {number} The total length of the curve approximated as straight line distances between the points.
		 */
		protected calculateEvenPoints(): number
		{

			let totalLength = 0;

			this._temp1.setTo(0, 0);                    //  pnt
			this._temp2.setTo(this._p1x, this._p1y);    //  lastPnt

			this._points.push(0);

			for(let i = 1; i <= this._accuracy; i++)
			{
				this._temp1 = this.getPoint(i / this._accuracy);
				totalLength += this._temp1.distance(this._temp2);
				this._points.push(totalLength);
				this._temp2.copyFrom(this._temp1);
			}

			return totalLength;
		}

		/**
		 * Convert a distance along this curve into a `time` value which will be between 0 and 1.
		 *
		 * For example if this curve has a length of 100 pixels then `findT(50)` would return `0.5`.
		 *
		 * @method sharp.Hermite#findT
		 * @param {integer} distance - The distance into the curve in pixels. Should be a positive integer.
		 * @return {number} The time (`t`) value, a float between 0 and 1.
		 */
		public findT(distance: number): number
		{
			if (distance <= 0) {
				return 0;
			}

			//  Find the _points which bracket the distance value
			let ti = Math.floor(distance / this._length * this._accuracy);

			while (ti > 0 && this._points[ti] > distance) {
				ti--;
			}

			while (ti < this._accuracy && this._points[ti] < distance) {
				ti++;
			}

			//  Linear interpolation to get a more accurate fix
			let dt = this._points[ti] - this._points[ti - 1];
			let d = distance - this._points[ti - 1];

			return ((ti - 1) / this._accuracy) + d / (dt * this._accuracy);

		}

		/**
		 * Get the X component of a point on the curve based on the `t` (time) value, which must be between 0 and 1.
		 *
		 * @method sharp.Hermite#getX
		 * @param {number} [t=0] - The time value along the curve from which to extract a point. This is a value between 0 and 1, where 0 represents the start of the curve and 1 the end.
		 * @return {number} The X component of a point on the curve based on the `t` (time) value.
		 */
		public getX(t: number = 0): number
		{
			if (t < 0) {
				t = 0;
			}

			if (t > 1) {
				t = 1;
			}

			let t2 = t * t;
			let t3 = t * t2;

			return (t3 * this._ax + t2 * this._bx + t * this._v1x + this._p1x);
		}

		/**
		 * Get the Y component of a point on the curve based on the `t` (time) value, which must be between 0 and 1.
		 *
		 * @method sharp.Hermite#getY
		 * @param {number} [t=0] - The time value along the curve from which to extract a point. This is a value between 0 and 1, where 0 represents the start of the curve and 1 the end.
		 * @return {number} The Y component of a point on the curve based on the `t` (time) value.
		 */
		public getY(t: number = 0): number
		{
			if (t < 0) {
				t = 0;
			}

			if (t > 1) {
				t = 1;
			}

			let t2 = t * t;
			let t3 = t * t2;

			return (t3 * this._ay + t2 * this._by + t * this._v1y + this._p1y);
		}

		/**
		 * Get a point on the curve using the `t` (time) value, which must be between 0 and 1.
		 *
		 * @method sharp.Hermite#getPoint
		 * @param {number} [t=0] - The time value along the curve from which to extract a point. This is a value between 0 and 1, where 0 represents the start of the curve and 1 the end.
		 * @return {sharp.Point} An Object with the x, y coordinate of the curve at the specified `t` value set in its `x` and `y` properties.
		 */
		public getPoint(t: number = 0): Point
		{
			let point = new Point();

			if (t < 0) {
				t = 0;
			}

			if (t > 1) {
				t = 1;
			}

			let t2 = t * t;
			let t3 = t * t2;

			point.x = t3 * this._ax + t2 * this._bx + t * this._v1x + this._p1x;
			point.y = t3 * this._ay + t2 * this._by + t * this._v1y + this._p1y;

			return point;
		}

		/**
		 * Get a point on the curve using the distance, in pixels, along the curve.
		 *
		 * @method sharp.Hermite#getPointWithDistance
		 * @param {integer} [distance=0] - The distance along the curve to get the point from, given in pixels.
		 * @return {sharp.Point} The point on the line at the specified 'distance' along the curve.
		 */
		public getPointWithDistance(distance: number = 0): Point
		{
			let point = new Point();
			if (distance <= 0) {
				point.x = this._p1x;
				point.y = this._p1y;
			}
			else {
				point = this.getPoint(this.findT(distance));
			}

			return point;
		}

		/**
		 * Calculate and return the angle, in radians, of the curves tangent based on time.
		 *
		 * @method sharp.Hermite#getAngle
		 * @param {number} [t=0] - The `t` (time) value at which to find the angle. Must be between 0 and 1.
		 * @return {number} The angle of the line at the specified `t` time value along the curve. The value is in radians.
		 */
		public getAngle(t: number = 0): number
		{
			this._temp1 = this.getPoint(t - 0.01);
			this._temp2 = this.getPoint(t + 0.01);

			return Math.atan2(this._temp2.y - this._temp1.y, this._temp2.x - this._temp1.x);
		}

		/**
		 * Calculate and return the angle, in radians, of the curves tangent at the given pixel distance along the curves length.
		 *
		 * @method sharp.Hermite#getAngleWithDistance
		 * @param {number} [distance=0] - The distance along the curve to get the angle from, in pixels.
		 * @return {number} The angle of the line at the specified distance along the curve. The value is in radians.
		 */
		public getAngleWithDistance(distance: number = 0): number
		{
			if (distance <= 0) {
				return Math.atan2(this._v1y, this._v1x);
			} else {
				return this.getAngle(this.findT(distance));
			}
		}

		/**
		 * Get the angle of the curves entry point.
		 *
		 * @method sharp.Hermite#getEntryTangent
		 * @return {sharp.Point} A Point object containing the tangent vector of this Hermite curve.
		 */
		public getEntryTangent(): Point
		{
			return new Point(this._v1x, this._v2y);
		}
	}
}