namespace sharp {
	export class Circle {
		public x: number;
		public y: number;
		public radius: number;

		/**
		 * Creates a new Circle object with the center coordinate specified by the x and y parameters and the radius specified by the radius parameter.
		 * If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
		 *
		 * @class sharp.Circle
		 * @constructor
		 * @param {number} [x=0] - The x coordinate of the center of the circle.
		 * @param {number} [y=0] - The y coordinate of the center of the circle.
		 * @param {number} [radius=0] - The radius of the circle.
		 */
		constructor(p: Point, radius?: number);
		constructor(x?: number, y?: number, radius?: number);
		constructor(x: number | Point = 0, y: number = 0, radius: number = 0)
		{
			if (x instanceof Point)
				this.setTo(x, y);
			else
				this.setTo(x, y, radius);
		}

		public get diameter(): number
		{
			return this.radius * 2;
		}

		public set diameter(value: number)
		{
			this.radius = value * 2;
		}

		public get point(): Point
		{
			return new Point(this.x, this.y);
		}

		public get centerPoint(): Point
		{
			return new Point(this.x, this.y);
		}

		public set centerPoint(value: Point)
		{
			this.x = value.x;
			this.y = value.y;
		}

		/**
		 * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
		 * @name sharp.Circle#left
		 * @propety {number} left - Gets or sets the value of the leftmost point of the circle.
		 */
		public get left(): number
		{
			return this.x - this.radius;
		}

		public set left(value: number)
		{
			if (value > this.x) {
				this.radius = 0;
			} else {
				this.radius = this.x - value;
			}
		}

		/**
		 * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
		 * @name sharp.Circle#right
		 * @property {number} right - Gets or sets the value of the rightmost point of the circle.
		 */
		public get right(): number
		{
			return this.x + this.radius;
		}

		public set right(value: number)
		{
			if (value < this.x) {
				this.radius = 0;
			} else {
				this.radius = value - this.x;
			}
		}

		/**
		 * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
		 * @name sharp.Circle#top
		 * @property {number} top - Gets or sets the top of the circle.
		 */
		public get top(): number
		{
			return this.y - this.radius;
		}

		public set top(value: number)
		{
			if (value > this.y) {
				this.radius = 0;
			} else {
				this.radius = this.y - value;
			}
		}

		/**
		 * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
		 * @name sharp.Circle#bottom
		 * @property {number} bottom - Gets or sets the bottom of the circle.
		 */
		public get bottom(): number
		{
			return this.y + this.radius;
		}

		public set bottom(value: number)
		{
			if (value < this.y) {
				this.radius = 0;
			} else {
				this.radius = value - this.y;
			}
		}

		/**
		 * The area of this Circle.
		 * @name sharp.Circle#area
		 * @property {number} area - The area of this circle.
		 * @readonly
		 */
		public get area(): number {
			if (this.radius > 0) {
				return Math.PI * this.radius * this.radius;
			} else {
				return 0;
			}
		}

		/**
		 * 周长
		 * The circumference of the circle.
		 *
		 * @method sharp.Circle#circumference
		 * @return {number} The circumference of the circle.
		 */
		public get circumference() {
			return 2 * (Math.PI * this.radius);
		}

		/**
		 * Determines whether or not this Circle object is empty. Will return a value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
		 * If set to true it will reset all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
		 * @name sharp.Circle#empty
		 * @property {boolean} empty - Gets or sets the empty state of the circle.
		 */
		public get empty(): boolean {
			return this.diameter === 0;
		}

		public set empty(value: boolean) {
			if (value === true) {
				this.setTo(0, 0, 0);
			}
		}

		/**
		 * Sets the members of Circle to the specified values.
		 * @method sharp.Circle#setTo
		 * @param {Point} p - The coordinate of the center of the circle.
		 * @param {number} radius - The radius of the circle.
		 * @return {Circle} This circle object.
		 */
		public setTo(p: Point, diameter: number): Circle;
		/**
		 * Sets the members of Circle to the specified values.
		 * @method sharp.Circle#setTo
		 * @param {number} x - The x coordinate of the center of the circle.
		 * @param {number} y - The y coordinate of the center of the circle.
		 * @param {number} radius - The radius of the circle.
		 * @return {Circle} This circle object.
		 */
		public setTo(x: number, y: number, radius: number): Circle;
		public setTo(x: number | Point, y: number, radius?: number): Circle
		{
			if (x instanceof Point)
			{
				this.x = x.x;
				this.y = x.y;
				this.radius = y;
			} else {
				if (radius == undefined)
					throw new Error('parameter#2 radius must be a number');
				this.x = x;
				this.y = y;
				this.radius = radius;
			}


			return this;
		}

		/**
		 * Returns a new Circle object with the same values for the x, y, width, and height properties as this Circle object.
		 * @method sharp.Circle#clone
		 * @return {sharp.Circle} The cloned Circle object.
		 */
		public clone(): Circle {
			return new Circle(this.x, this.y, this.diameter);
		}

		public toBody(options: any, maxsides?: number): Body
		{
			options.label = options.label || 'Circle';
			options.type = 'Circle Body';
			options.circleRadius = this.centerPoint;
			options.vertices = this.vertices(maxsides);
			options.position = this.point;

			return new Body(options as BodyOptions);
		}

		public static create(p: Point, diameter?: number): Circle;
		public static create(x?: number, y?: number, radius?: number): Circle;
		public static create(x: number | Point = 0, y: number = 0, radius: number = 0): Circle
		{
			if (x instanceof Point)
				return new Circle(x, y);
			else
				return new Circle(x, y, radius);
		}

		public vertices(maxSides: number = 25): Vertices
		{
			// approximate circles with polygons until true circles implemented in SAT
			let sides: number = Math.ceil(Math.max(10, Math.min(maxSides, this.radius)));

			// optimisation: always use even number of sides (half the number of unique axes)
			if (sides % 2 === 1)
				sides += 1;

			return (new RigidPolygon(this.x, this.y, sides, this.radius)).vertices();
		}

		/**
		 * Returns a uniformly distributed random point from anywhere within this Circle.
		 *
		 * @method sharp.Circle#random
		 * @return {sharp.Point} An object containing the random point in its `x` and `y` properties.
		 */
		public random(): Point
		{
        	let t = 2 * Math.PI * Math.random();
			let u = Math.random() + Math.random();
			let r = (u > 1) ? 2 - u : u;
			let x = r * Math.cos(t);
			let y = r * Math.sin(t);

			return new Point(this.x + (x * this.radius), this.y + (y * this.radius));
		}

		/**
		 * Returns the framing rectangle of the circle as a sharp.Rectangle object.
		 *
		 * @method sharp.Circle#getBounds
		 * @return {sharp.Rectangle} The bounds of the Circle.
		 */
		public getBounds(): Rectangle
		{
			return new Rectangle(this.x - this.radius, this.y - this.radius, this.diameter, this.diameter);

		}

		/**
		 * Copies the x, y and diameter properties from any given object to this Circle.
		 * @method sharp.Circle#copyFrom
		 * @param {any} source - The object to copy from.
		 * @return {Circle} This Circle object.
		 */
		public createFrom(source: any): Circle
		{
			return new Circle(source.x, source.y, source.diameter);

		}

		/**
		 * Copies the x, y and diameter properties from this Circle to any given object.
		 * @method sharp.Circle#copyTo
		 * @param {any} dest - The object to copy to.
		 * @return {object} This dest object.
		 */
		public copyTo(dest: any)
		{
			dest.x = this.x;
			dest.y = this.y;
			dest.diameter = this.diameter;

			return dest;
		}

		/**
		 * Returns the distance from the center of the Circle object to the given object
		 * (can be Circle, Point or anything with x/y properties)
		 * @method sharp.Circle#distance
		 * @param {sharp.Point} dest - The target object. Must have visible x and y properties that represent the center of the object.
		 * @param {boolean} [asRounded=false] - Round the distance to the nearest integer.
		 * @return {number} The distance between this Point object and the destination Point object.
		 */
		public distance(dest: Point, asRounded: boolean = false)
		{
			let distance = sharp.distance(this.x, this.y, dest.x, dest.y);
			return asRounded ? Math.round(distance) : distance;
		}

		/**
		 * Return true if the given x/y coordinates are within this Circle object.
		 * @method sharp.Circle#contains
		 * @param {number} x - The X value of the coordinate to test.
		 * @param {number} y - The Y value of the coordinate to test.
		 * @return {boolean} True if the coordinates are within this circle, otherwise false.
		 */
		public contains(x: number, y: number): boolean
		{
			//  Check if x/y are within the bounds first
			if (this.radius > 0 && x >= this.left && x <= this.right && y >= this.top && y <= this.bottom) {
				let dx = (this.x - x) * (this.x - x);
				let dy = (this.y - y) * (this.y - y);

				return (dx + dy) <= (this.radius * this.radius);
			}
			else {
				return false;
			}
		}

		/**
		 * Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
		 * @method sharp.Circle.equals
		 * @param {sharp.Circle} c - The second Circle object.
		 * @return {boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
		 */
		public equals(c: Circle): boolean
		{
			return (this.x === c.x && this.y === c.y && this.diameter === c.diameter);
		}

		/**
		 * 圆周上的点
		 * 等同 sharp.circlePoint 函数
		 * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
		 * @method sharp.Circle#circumferencePoint
		 * @param {number} angle - The angle in radians to return the point from.
		 * @return {sharp.Point} The Point object holding the result.
		 */
		public circumferencePoint(angle: number): Point
		{
			return new Point(this.x + this.radius * Math.cos(angle), this.y + this.radius * Math.sin(angle));
		}


		/**
		 * Creates or positions points on the circle.
		 *
		 * The points are equally distributed in the half-closed interval [startAngle, endAngle). The default arc is the entire circle.
		 *
		 * If the `out` argument is omitted, this method creates and returns an array of {@link sharp.Point points}. If an array is passed as `out`, its items are treated as points and placed in the same way.
		 *
		 * @param {type} [steps=60] - The number of points to place.
		 * @param {type} [startAngle=0] - The starting angle in radians (unless asDegrees is true).
		 * @param {type} [endAngle=sharp.Math.PI2] - The end angle in radians (unless asDegrees is true).
		 * @param {any[]} [out] - An array of points or point-like objects (e.g., sprites). It should start at index 0 and its length should be equal to or greater than `steps`.
		 * @return {any[]} - The modified `out` argument or a new array of points.
		 */
		public sample(steps: number = 60, startAngle: number = 0, endAngle: number = sharp.PI2): Point[]
		{
			let i = 0;
			let result: Point[] = [];
			while (i < steps) {
				result.push(this.circumferencePoint(
					math.linear(startAngle, endAngle, i / steps)
				));
				i += 1;
			}
			return result;
		}

		/**
		 * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
		 * @method sharp.Circle#offset
		 * @param {number} dx - Moves the x value of the Circle object by this amount.
		 * @param {number} dy - Moves the y value of the Circle object by this amount.
		 * @return {Circle} This Circle object.
		 */
		public offset(dx: number, dy: number): Circle
		{
			this.x += dx;
			this.y += dy;

			return this;
		}

		/**
		 * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
		 * @method sharp.Circle#offsetPoint
		 * @param {Point} point A Point object to use to offset this Circle object (or any valid object with exposed x and y properties).
		 * @return {Circle} This Circle object.
		 */
		public offsetPoint(point: Point): Circle
		{
			return this.offset(point.x, point.y);
		}

		/**
		 * Determines whether the two Circle objects intersect.
		 * This method checks the radius distances between the two Circle objects to see if they intersect.
		 * @method sharp.Circle.intersects
		 * @param {sharp.Circle} c - The second Circle object.
		 * @return {boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
		 */
		public intersects(c: Circle): boolean
		{
			return (sharp.distance(this.x, this.y, c.x, c.y) <= (this.radius + c.radius));
		}

		/**
		 * Checks if the given Circle and Rectangle objects intersect.
		 * @method sharp.Circle.intersectsRectangle
		 * @param {sharp.Rectangle} rect - The Rectangle object to test.
		 * @return {boolean} True if the two objects intersect, otherwise false.
		 */
		public intersectsRectangle(rect: Rectangle): boolean
		{

			let cx: number = Math.abs(this.x - rect.x - rect.halfWidth);
			let xDist: number = rect.halfWidth + this.radius;

			if (cx > xDist) {
				return false;
			}

			let cy: number = Math.abs(this.y - rect.y - rect.halfHeight);
			let yDist: number = rect.halfHeight + this.radius;

			if (cy > yDist) {
				return false;
			}

			if (cx <= rect.halfWidth || cy <= rect.halfHeight) {
				return true;
			}

			let xCornerDist: number = cx - rect.halfWidth;
			let yCornerDist: number = cy - rect.halfHeight;
			let xCornerDistSq: number = xCornerDist * xCornerDist;
			let yCornerDistSq: number = yCornerDist * yCornerDist;
			let maxCornerDistSq: number = this.radius * this.radius;

			return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;

		}

		/**
		 * Checks if the given Circle and Line objects intersect.
		 * @method sharp.Circle.intersectsLine
		 * @param {sharp.Circle} c - The Circle object to test.
		 * @param {sharp.Line} l - The Line object to test.
		 * @return {boolean} Array Object, Return an array of intersection points if true, otherwise return [].
		 */
		public intersectsLine(l: Line): Point[]
		{
			let h: number = this.x;
			let k: number = this.y;
			let m: number = ((l.end.y - l.start.y) / (l.end.x - l.start.x));
			let n: number = l.end.y - (m * l.end.x);
			let a: number = this.radius;
			let b: number = this.radius;
			let del: number = n + m * h;

			let x0 = (h * (b * b) - m * (a * a) * (n - k) + a * b * (Math.sqrt((a * a) * (m * m) + (b * b) - (del * del) - (k * k) + (2 * del * k)))) / ((a * a) * (m * m) + (b * b));
			let x1 = (h * (b * b) - m * (a * a) * (n - k) - a * b * (Math.sqrt((a * a) * (m * m) + (b * b) - (del * del) - (k * k) + (2 * del * k)))) / ((a * a) * (m * m) + (b * b));

			let y0: number = m * x0 + n;
			let y1: number = m * x1 + n;
			let p0: Point = new Point(x0, y0);
			let p1: Point = new Point(x1, y1);
			let p0Exists: boolean = l.pointOnSegment(p0.x, p0.y, 0.01);
			let p1Exists: boolean = l.pointOnSegment(p1.x, p1.y, 0.01);

			if (p0Exists && p1Exists) { // 相交
				return [p0, p1];
			} else if (p0Exists) { // 相切
				return [p0];
			} else if (p1Exists) { // 相切
				return [p1];
			}

			return [];
		}

		/**
		 * Returns a string representation of this object.
		 * @method sharp.Circle#toString
		 * @return {string} a string representation of the instance.
		 */
		public toString() {
			return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
		}
	}
}