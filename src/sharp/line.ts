namespace sharp {
	export class Line {

		public start: Point;
		public end: Point;

		constructor(p1: Point, p2: Point)
		constructor(x1?: number, y1?: number, x2?: number, y2?: number);
		constructor(x1: any = 0, y1: any = 0, x2: number = 0, y2: number = 0)
		{
			this.setTo(x1, y1, x2, y2);
		}

		/**
		 * @name sharp.Line#length
		 * @property {number} length - Gets the length of the line segment.
		 * @readonly
		 */
		public get length(): number
		{
			return this.start.distance(this.end);
		}

		/**
		 * @name sharp.Line#angle
		 * @property {number} angle - Gets the angle of the line in radians.
		 * @readonly
		 */
		public get angle(): number
		{
			return this.start.angle(this.end);
		}

		/**
		 * @name sharp.Line#slope
		 * @property {number} slope - Gets the slope of the line (y/x).
		 * @readonly
		 */
		public get slope(): number
		{
			return (this.end.y - this.start.y) / (this.end.x - this.start.x);
		}

		/**
		 * @name sharp.Line#perpSlope
		 * @property {number} perpSlope - Gets the perpendicular slope of the line (x/y).
		 * @readonly
		 */
		public get perpSlope(): number
		{
			return -((this.end.x - this.start.x) / (this.end.y - this.start.y));
		}

		/**
		 * @name sharp.Line#x
		 * @property {number} x - Gets the x coordinate of the top left of the bounds around this line.
		 * @readonly
		 */
		public get x(): number {
			return Math.min(this.start.x, this.end.x);
		}

		/**
		 * @name sharp.Line#y
		 * @property {number} y - Gets the y coordinate of the top left of the bounds around this line.
		 * @readonly
		 */
		public get y(): number {
			return Math.min(this.start.y, this.end.y);
		}

		/**
		 * @name sharp.Line#left
		 * @property {number} left - Gets the left-most point of this line.
		 * @readonly
		 */
		public get left(): number {
			return Math.min(this.start.x, this.end.x);
		}

		/**
		 * @name sharp.Line#right
		 * @property {number} right - Gets the right-most point of this line.
		 * @readonly
		 */
		public get right(): number {
			return Math.max(this.start.x, this.end.x);
		}

		/**
		 * @name sharp.Line#top
		 * @property {number} top - Gets the top-most point of this line.
		 * @readonly
		 */
		public get top(): number {
			return Math.min(this.start.y, this.end.y);
		}

		/**
		 * @name sharp.Line#bottom
		 * @property {number} bottom - Gets the bottom-most point of this line.
		 * @readonly
		 */
		public get bottom(): number {
			return Math.max(this.start.y, this.end.y);
		}

		/**
		 * @name sharp.Line#width
		 * @property {number} width - Gets the width of this bounds of this line.
		 * @readonly
		 */
		public get width(): number {
			return Math.abs(this.start.x - this.end.x);
		}

		/**
		 * @name sharp.Line#height
		 * @property {number} height - Gets the height of this bounds of this line.
		 * @readonly
		 */
		public get height(): number {
			return Math.abs(this.start.y - this.end.y);
		}

		/**
		 * @name sharp.Line#normalX
		 * @property {number} normalX - Gets the x component of the left-hand normal of this line.
		 * @readonly
		 */
		public get normalX(): number {
			return Math.cos(this.angle - 1.5707963267948966);
		}

		/**
		 * @name sharp.Line#normalY
		 * @property {number} normalY - Gets the y component of the left-hand normal of this line.
		 * @readonly
		 */
		public get normalY(): number {
			return Math.sin(this.angle - 1.5707963267948966);
		}

		/**
		 * @name sharp.Line#normalAngle
		 * @property {number} normalAngle - Gets the angle in radians of the normal of this line (line.angle - 90 degrees.)
		 * @readonly
		 */
		public get normalAngle(): number {
			return math.wrap(this.angle - 1.5707963267948966, -Math.PI, Math.PI);
		}

		/**
		 * clone一个新的
		 * Returns a new Line object with the same values for the start and end properties as this Line object.
		 * @method sharp.Line#clone
		 * @return {sharp.Line} The cloned Line object.
		 */
		public clone(): Line {
			return new Line(this.start, this.end);
		}

		public static create(p1: Point, p2:Point): Line;
		public static create(x1?: number, y1?: number, x2?: number, y2?: number): Line;
		public static create(x1: any = 0, y1: any = 0, x2: number = 0, y2: number = 0): Line
		{
			return new Line(x1, y1, x2, y2);
		}

		/**
		 * Sets this line to start at the given `x` and `y` coordinates and for the segment to extend at `angle` for the given `length`.
		 *
		 * @method sharp.Line#fromAngle
		 * @param {number} pt - The start coordinate of the line.
		 * @param {number} angle - The angle of the line in radians.
		 * @param {number} length - The length of the line in pixels.
		 * @return {sharp.Line} This line object
		 */
		public static createFromAngle(p: Point, angle: number, length: number)
		{
			return new Line(p, sharp.circlePoint(p, length, angle));
		}

		/**
		* Sets the components of the Line to the specified values.
		*
		* @method Phaser.Line#setTo
		* @param {sharp.Point} [p1=0] - The start coordinate of the line.
		* @param {number} [p2=0] - The end coordinate of the line.
		* @return {Phaser.Line} This line object
		*/
		public setTo(p1: Point, p2: Point): Line;
		/**
		* Sets the components of the Line to the specified values.
		*
		* @method Phaser.Line#setTo
		* @param {number} x1 - The x coordinate of the start of the line.
		* @param {number} y1 - The y coordinate of the start of the line.
		* @param {number} x2 - The x coordinate of the end of the line.
		* @param {number} y2 - The y coordinate of the end of the line.
		* @return {Phaser.Line} This line object
		*/
		public setTo(x1: number, y1: number, x2: number, y2: number): Line;
		public setTo(p1OrX1: Point | number, p2OrY1: Point | number, x2?: number, y2?: number): Line
		{
			let [p1, p2] = sharp.optional2Points(p1OrX1, p2OrY1, x2, y2);
			this.start = p1.clone();
			this.end = p2.clone();
			return this;
		}

		/**
		 * Rotates the line by the amount specified in `angle`.
		 *
		 * Rotation takes place from the center of the line.
		 * If you wish to rotate around a different point see Line.rotateAround.
		 *
		 * If you wish to rotate the ends of the Line then see Line.start.rotate or Line.end.rotate.
		 *
		 * @method sharp.Line#rotate
		 * @param {number} angle - The angle in radians to rotate the line by.
		 * @return {sharp.Line} This line object
		 */
		public rotate(angle: number): Line
		{
			let cx: number = (this.start.x + this.end.x) / 2;
			let cy: number = (this.start.y + this.end.y) / 2;

			this.start.rotate(cx, cy, angle);
			this.end.rotate(cx, cy, angle);

			return this;
		}

		/**
 		 * Rotates the line by the amount specified in `angle`.
 		 *
 		 * Rotation takes place around the coordinates given.
 		 *
 		 * @method sharp.Line#rotateAround
 		 * @param {number} x - The x coordinate to offset the rotation from.
 		 * @param {number} y - The y coordinate to offset the rotation from.
 		 * @param {number} angle - The angle in radians to rotate the line by.
 		 * @return {sharp.Line} This line object
 		 */
		public rotateAround(x: number, y: number, angle: number): Line
		{
			this.start.rotate(x, y, angle);
			this.end.rotate(x, y, angle);

			return this;
		}

		/**
 		 * Checks for intersection between this line and another Line.
 		 * If asSegment is true it will check for segment intersection. If asSegment is false it will check for line intersection.
 		 * Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
 		 *
 		 * @method sharp.Line#intersects
 		 * @param {sharp.Line} line - The line to check against this one.
 		 * @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
 		 * @param {sharp.Point} [result] - A Point object to store the result in, if not given a new one will be created.
 		 * @return {sharp.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
 		 */
		public intersects(line: Line, asSegment: boolean = true): Point | boolean
		{
			let result = new Point();
			let a = this.start, b = this.end, e = line.start, f = line.end;

			let a1: number = b.y - a.y;
			let a2: number = f.y - e.y;
			let b1: number = a.x - b.x;
			let b2: number = e.x - f.x;
			let c1: number = (b.x * a.y) - (a.x * b.y);
			let c2: number = (f.x * e.y) - (e.x * f.y);
			let denom: number = (a1 * b2) - (a2 * b1);

			if (denom === 0) {
				return false;
			}

			result.x = ((b1 * c2) - (b2 * c1)) / denom;
			result.y = ((a2 * c1) - (a1 * c2)) / denom;

			if (asSegment) {
				let uc: number = ((f.y - e.y) * (b.x - a.x) - (f.x - e.x) * (b.y - a.y));
				let ua: number = (((f.x - e.x) * (a.y - e.y)) - (f.y - e.y) * (a.x - e.x)) / uc;
				let ub: number = (((b.x - a.x) * (a.y - e.y)) - ((b.y - a.y) * (a.x - e.x))) / uc;

				if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
					return result;
				}
				else {
					return false;
				}
			}

			return result;
		}

		/**
		* Checks for intersection between the Line and a Rectangle shape, or a rectangle-like
		* object, with public `x`, `y`, `right` and `bottom` properties, such as a Sprite or Body.
		*
		* An intersection is considered valid if:
		*
		* The line starts within or ends within the rectangle; or
		* The line segment intersects one of the 4 rectangle edges; and
		* The line has a non-zero length; and
		* The rectangle is not empty.
		*
		* For the purposes of this function rectangles are considered 'solid'.
		*
		* @method sharp.Line#intersectsRectangle
		* @param {sharp.Rectangle|object} rect - The rectangle, or rectangle-like object, to check for intersection with.
		* @return {boolean} True if the line intersects with the rectangle edges, or starts or ends within the rectangle.
		*/
		public intersectsRectangle(rect: Rectangle): boolean
		{
			//  Quick bail out
			if (this.length === 0 || rect.empty) {
				return false;
			}

			let x1: number = this.start.x;
			let y1: number = this.start.y;

			let x2: number = this.end.x;
			let y2: number = this.end.y;

			let bx1: number = rect.x;
			let by1: number = rect.y;
			let bx2: number = rect.right;
			let by2: number = rect.bottom;

			let t: number = 0;

			//  If the start or end of the line is inside the rect then we assume
			//  collision, as rects are solid for our use-case.

			if ((x1 >= bx1 && x1 <= bx2 && y1 >= by1 && y1 <= by2) ||
				(x2 >= bx1 && x2 <= bx2 && y2 >= by1 && y2 <= by2)) {
				return true;
			}

			if (x1 < bx1 && x2 >= bx1) {
				//  Left edge
				t = y1 + (y2 - y1) * (bx1 - x1) / (x2 - x1);

				if (t > by1 && t <= by2) {
					return true;
				}
			}
			else if (x1 > bx2 && x2 <= bx2) {
				//  Right edge
				t = y1 + (y2 - y1) * (bx2 - x1) / (x2 - x1);

				if (t >= by1 && t <= by2) {
					return true;
				}
			}

			if (y1 < by1 && y2 >= by1) {
				//  Top edge
				t = x1 + (x2 - x1) * (by1 - y1) / (y2 - y1);

				if (t >= bx1 && t <= bx2) {
					return true;
				}
			}
			else if (y1 > by2 && y2 <= by2) {
				//  Bottom edge
				t = x1 + (x2 - x1) * (by2 - y1) / (y2 - y1);

				if (t >= bx1 && t <= bx2) {
					return true;
				}
			}

			return false;
		}

		/**
		* Finds the closest intersection between the Line and a Rectangle shape, or a rectangle-like
		* object, such as a Sprite or Body.
		*
		* @method sharp.Line#intersectionWithRectangle
		* @param {sharp.Line} line - The line to check for intersection with.
		* @param {sharp.Rectangle} rect - The rectangle, or rectangle-like object, to check for intersection with.
		* @param {sharp.Point} [result] - A Point object to store the result in.
		* @return {?sharp.Point} - The intersection closest to the Line's start, or null if there is no intersection.
		*/
		public intersectionWithRectangle(rect: Rectangle): Point|boolean
		{
			let result = new Point();
			let edgeIntersection: Point|boolean;
			let sides: Line[] = rect.sides;
			let closestDistance = Infinity;
			let distance: number|null = null;

			sides.forEach(side => {
				edgeIntersection = this.intersects(side, true);
				if (edgeIntersection instanceof Point) {
					distance = this.start.distance(edgeIntersection);

					if (distance < closestDistance) {
						closestDistance = distance;
						result.setTo(edgeIntersection);
					}
				}
			});

			return distance != null ? result : false;
		}

		/**
		 * Returns the reflected angle between two lines.
		 * This is the outgoing angle based on the angle of this line and the normalAngle of the given line.
		 *
		 * @method sharp.Line#reflect
		 * @param {sharp.Line} line - The line to reflect off this line.
		 * @return {number} The reflected angle in radians.
		 */
		public reflect(line: Line): number
		{
			return 2 * line.normalAngle - 3.141592653589793 - this.angle;
		}

		/**
		 * Returns a Point object where the x and y values correspond to the center (or midpoint) of the Line segment.
		 *
		 * @method sharp.Line#midPoint
		 * @return {sharp.Point} A Point object with the x and y values set to the center of the line segment.
		 */
		public midPoint(): Point
		{
			return new Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
		}

		/**
		 * Centers this Line on the given coordinates.
		 *
		 * The line is centered by positioning the start and end points so that the lines midpoint matches
		 * the coordinates given.
		 *
		 * @method sharp.Line#centerOn
		 * @param {number} x - The x position to center the line on.
		 * @param {number} y - The y position to center the line on.
		 * @return {sharp.Line} This line object
		 */
		public centerOn(x: number, y: number): Line
		{
			let cx = (this.start.x + this.end.x) / 2;
			let cy = (this.start.y + this.end.y) / 2;

			let tx = x - cx;
			let ty = y - cy;

			this.start.add(tx, ty);
			this.end.add(tx, ty);

			return this;
		}

		/**
		 * Tests if the given coordinates fall on this line. See {@link #pointOnSegment} to test against just the line segment.
		 *
		 * @method sharp.Line#pointOnLine
		 * @param {number} x - The line to check against this one.
		 * @param {number} y - The line to check against this one.
		 * @param {number} [epsilon=0.0001] - Range for a fuzzy comparison, e.g., 0.0001.
		 * @return {boolean} True if the point is on the line, false if not.
		 */
		public pointOnLine(x: number, y: number, epsilon: number = 0.0001): boolean
		{
			return math.fuzzyEquals((x - this.start.x) * (this.end.y - this.start.y), (this.end.x - this.start.x) * (y - this.start.y), epsilon);
		}

		/**
		 * Tests if the given coordinates fall on this line and within the segment. See {@link #pointOnLine} to test against just the line.
		 *
		 * @method sharp.Line#pointOnSegment
		 * @param {number} x - The line to check against this one.
		 * @param {number} y - The line to check against this one.
		 * @param {number} [epsilon=0.0001] - Range for a fuzzy comparison, e.g., 0.0001.
		 * @return {boolean} True if the point is on the line and segment, false if not.
		 */
		public pointOnSegment(x: number, y: number, epsilon: number = 0.0001): boolean
		{
			let xMin: number = Math.min(this.start.x, this.end.x);
			let xMax: number = Math.max(this.start.x, this.end.x);
			let yMin: number = Math.min(this.start.y, this.end.y);
			let yMax: number = Math.max(this.start.y, this.end.y);

			return (this.pointOnLine(x, y, epsilon) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax));
		}

		/**
		 * Picks a random point from anywhere on the Line segment and returns it.
		 *
		 * @method sharp.Line#random
		 *     If no object is provided a new Point object will be created. In high performance areas avoid this by re-using an object.
		 * @return {sharp.Point} An object containing the random point in its `x` and `y` properties.
		 */
		public random(): Point
		{
			let t: number = Math.random();

			return new Point(this.start.x + t * (this.end.x - this.start.x), this.start.y + t * (this.end.y - this.start.y));
		}

		/**
		 * Using Bresenham's line algorithm this will return an array of all coordinates on this line.
		 * The start and end points are rounded before this runs as the algorithm works on integers.
		 *
		 * @method sharp.Line#coordinatesOnLine
		 * @param {number} [stepRate=1] - How many steps will we return? 1 = every coordinate on the line, 2 = every other coordinate, etc.
		 * @param {array} [results] - The array to store the results in. If not provided a new one will be generated.
		 * @return {array} An array of coordinates.
		 */
		public coordinatesOnLine(stepRate: number = 1): Point[]
		{
			let results: Point[] = [];

			let x1: number = Math.round(this.start.x);
			let y1: number = Math.round(this.start.y);
			let x2: number = Math.round(this.end.x);
			let y2: number = Math.round(this.end.y);

			let dx: number = Math.abs(x2 - x1);
			let dy: number = Math.abs(y2 - y1);
			let sx: number = (x1 < x2) ? 1 : -1;
			let sy: number = (y1 < y2) ? 1 : -1;
			let err: number = dx - dy;

			results.push(new Point(x1, y1));

			let i: number = 1;

			while(!((x1 === x2) && (y1 === y2)))
			{
				let e2 = err << 1;

				if (e2 > -dy) {
					err -= dy;
					x1 += sx;
				}

				if (e2 < dx) {
					err += dx;
					y1 += sy;
				}

				if (i % stepRate === 0) {
					results.push(new Point(x1, y1));
				}

				i++;
			}

			return results;
		}
	}
}