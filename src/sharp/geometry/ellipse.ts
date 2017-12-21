namespace sharp {
	/**
	 * 椭圆
	 */
	export class Ellipse {
		public x: number;
		public y: number;
		public width: number;
		public height: number;

		/**
		 * Creates a Ellipse object. A curve on a plane surrounding two focal points.
		 *
		 * @class sharp.Ellipse
		 * @constructor
		 * @param {number} [x=0] - The X coordinate of the upper-left corner of the framing rectangle of this ellipse.
		 * @param {number} [y=0] - The Y coordinate of the upper-left corner of the framing rectangle of this ellipse.
		 * @param {number} [width=0] - The overall width of this ellipse.
		 * @param {number} [height=0] - The overall height of this ellipse.
		 */
		constructor(p: Point, width: number, height: number);
		constructor(x?: number, y?: number, width?: number, height?: number);
		constructor(x: number | Point = 0, y: number = 0, width: number = 0, height: number = 0)
		{
			if (x instanceof Point)
				this.setTo(x, y, width);
			else
				this.setTo(x, y, width, height);
		}

		/**
		 * The left coordinate of the Ellipse. The same as the X coordinate.
		 * @name sharp.Ellipse#left
		 * @propety {number} left - Gets or sets the value of the leftmost point of the ellipse.
		 */
		public get left(): number {
			return this.x;
		}

		public set left(value: number) {
			this.x = value;
		}

		/**
		 * The x coordinate of the rightmost point of the Ellipse. Changing the right property of an Ellipse object has no effect on the x property, but does adjust the width.
		 * @name sharp.Ellipse#right
		 * @property {number} right - Gets or sets the value of the rightmost point of the ellipse.
		 */
		public get right(): number {
			return this.x + this.width;
		}

		public set right(value: number) {
			if (value < this.x) {
				this.width = 0;
			} else {
				this.width = value - this.x;
			}
		}

		/**
		 * The top of the Ellipse. The same as its y property.
		 * @name sharp.Ellipse#top
		 * @property {number} top - Gets or sets the top of the ellipse.
		 */
		public get top(): number {
			return this.y;
		}

		public set top(value: number) {
			this.y = value;
		}


		/**
		 * The sum of the y and height properties. Changing the bottom property of an Ellipse doesn't adjust the y property, but does change the height.
		 * @name sharp.Ellipse#bottom
		 * @property {number} bottom - Gets or sets the bottom of the ellipse.
		 */
		public get bottom(): number {
			return this.y + this.height;
		}

		public set bottom(value: number) {
			if (value < this.y) {
				this.height = 0;
			} else {
				this.height = value - this.y;
			}
		}

		public get point(): Point
		{
			return new Point(this.x, this.y);
		}

		/**
		 * Determines whether or not this Ellipse object is empty. Will return a value of true if the Ellipse objects dimensions are less than or equal to 0; otherwise false.
		 * If set to true it will reset all of the Ellipse objects properties to 0. An Ellipse object is empty if its width or height is less than or equal to 0.
		 * @name sharp.Ellipse#empty
		 * @property {boolean} empty - Gets or sets the empty state of the ellipse.
		 */
		public get empty(): boolean {
			return (this.width === 0 || this.height === 0);
		}

		public set empty(value: boolean) {
			if (value === true) {
				this.setTo(0, 0, 0, 0);
			}
		}

		/**
		 * Sets the members of the Ellipse to the specified values.
		 * @method sharp.Ellipse#setTo
		 * @param {number} x - The X coordinate of the upper-left corner of the framing rectangle of this ellipse.
		 * @param {number} y - The Y coordinate of the upper-left corner of the framing rectangle of this ellipse.
		 * @param {number} width - The overall width of this ellipse.
		 * @param {number} height - The overall height of this ellipse.
		 * @return {sharp.Ellipse} This Ellipse object.
		 */
		public setTo(p: Point, width: number, height: number): Ellipse;
		public setTo(x: number, y: number, width: number, height: number): Ellipse;
		public setTo(x: number | Point, y: number, width: number, height?: number): Ellipse
		{
			if (x instanceof Point) {
				this.x = x.x;
				this.y = x.y;
				this.width = y;
				this.height = width;
			} else {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height!;
			}
			return this;
		}

		/**
		 * Returns the framing rectangle of the ellipse as a sharp.Rectangle object.
		 *
		 * @method sharp.Ellipse#getBounds
		 * @return {sharp.Rectangle} The bounds of the Ellipse.
		 */
		public getBounds(): Rectangle
		{
			return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
		}

		/**
		 * Copies the x, y, width and height properties from any given object to this Ellipse.
		 *
		 * @method sharp.Ellipse#copyFrom
		 * @param {any} source - The object to copy from.
		 * @return {sharp.Ellipse} This Ellipse object.
		 */
		public copyFrom(source: any): Ellipse
		{
			return this.setTo(source.x, source.y, source.width, source.height);
		}

		/**
		 * Copies the x, y, width and height properties from this Ellipse to any given object.
		 * @method sharp.Ellipse#copyTo
		 * @param {any} dest - The object to copy to.
		 * @return {object} This dest object.
		 */
		public copyTo(dest: any)
		{
			dest.x = this.x;
			dest.y = this.y;
			dest.width = this.width;
			dest.height = this.height;

			return dest;
		}

		/**
		 * Returns a new Ellipse object with the same values for the x, y, width, and height properties as this Ellipse object.
		 * @method sharp.Ellipse#clone
		 * @return {sharp.Ellipse} The cloned Ellipse object.
		 */
		public clone(): Ellipse
		{
			return new Ellipse(this.x, this.y, this.width, this.height);
		}

		public toBody(options: any): Body
		{
			options.label = options.label || 'Ellipse';
			options.type = 'Ellipse Body';
			options.vertices = this.vertices();
			options.position = this.point;

			return new Body(options as BodyOptions);
		}

		public static create(p: Point, width: number, height: number): Ellipse;
		public static create(x?: number, y?: number, width?: number, height?: number): Ellipse;
		public static create(x: number | Point = 0, y: number = 0, width: number = 0, height: number = 0): Ellipse
		{
			if (x instanceof Point)
				return new Ellipse(x, y, width);
			else
				return new Ellipse(x, y, width, height);
		}

		public vertices(maxSides: number = 25): Vertices
		{
			return new Vertices;
		}

		/**
		 * Return true if the given x/y coordinates are within this Ellipse object.
		 *
		 * @method sharp.Ellipse#contains
		 * @param {number} x - The X value of the coordinate to test.
		 * @param {number} y - The Y value of the coordinate to test.
		 * @return {boolean} True if the coordinates are within this ellipse, otherwise false.
		 */
		public contains(x: number, y: number): boolean
		{
			if (this.width <= 0 || this.height <= 0)
				return false;

			//  Normalize the coords to an ellipse with center 0,0 and a radius of 0.5
			let normx: number = ((x - this.x) / this.width) - 0.5;
			let normy: number = ((y - this.y) / this.height) - 0.5;

			normx *= normx;
			normy *= normy;

			return (normx + normy < 0.25);
		}

		/**
		 * Returns a uniformly distributed random point from anywhere within this Ellipse.
		 *
		 * @method sharp.Ellipse#random
		 * @return {sharp.Point} An object containing the random point in its `x` and `y` properties.
		 */
		public random(): Point
		{
			let out = new Point();

			let p = Math.random() * Math.PI * 2;
			let r = Math.random();

			out.x = Math.sqrt(r) * Math.cos(p);
			out.y = Math.sqrt(r) * Math.sin(p);

			out.x = this.x + (out.x * this.width / 2.0);
			out.y = this.y + (out.y * this.height / 2.0);

			return out;
		}

		/**
		 * Checks if the given Ellipse and Line objects intersect.
		 * @method sharp.Ellipse.intersectsLine
		 * @param {sharp.Ellipse} e - The Ellipse object to test.
		 * @param {sharp.Line} l - The Line object to test.
		 * @return {Point[]}  - Array Object, Return an array of intersection points.
		 */
		public intersectsLine(l: Line): Point[]
		{
			let h: number = this.x;
			let k: number = this.y;
			let m: number = ((l.end.y - l.start.y) / (l.end.x - l.start.x));
			let n: number = l.end.y - (m * l.end.x);
			let a: number = this.width / 2;
			let b: number = this.height / 2;
			let del: number = n + m * h;

			let x0: number = (h * (b * b) - m * (a * a) * (n - k) + a * b * (Math.sqrt((a * a) * (m * m) + (b * b) - (del * del) - (k * k) + (2 * del * k)))) / ((a * a) * (m * m) + (b * b));
			let x1: number = (h * (b * b) - m * (a * a) * (n - k) - a * b * (Math.sqrt((a * a) * (m * m) + (b * b) - (del * del) - (k * k) + (2 * del * k)))) / ((a * a) * (m * m) + (b * b));

			let y0: number = m * x0 + n;
			let y1: number = m * x1 + n;
			let p0 = new Point(x0, y0);
			let p1 = new Point(x1, y1);
			let p0Exists: boolean = l.pointOnSegment(p0.x, p0.y, 0.01);
			let p1Exists: boolean = l.pointOnSegment(p1.x, p1.y, 0.01);

			if (p0Exists && p1Exists) {
				return [p0, p1];
			} else if (p0Exists) {
				return [p0];
			} else if (p1Exists) {
				return [p1];
			}

			return [];
		};

		/**
		 * Returns a string representation of this object.
		 * @method sharp.Ellipse#toString
		 * @return {string} A string representation of the instance.
		 */
		public toString() {
			return "[{sharp.Ellipse (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")}]";
		}
	}
}