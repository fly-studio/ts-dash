namespace sharp {
	export class Polygon {
		/**
		 * @property {array} points - An array of Points that make up this Polygon.
		 * @private
		 */
		public points: Point[];
		/**
		 * @property {number} area - The area of this Polygon.
		 */
		public area: number = 0;
		/**
		 * @property {boolean} closed - Is the Polygon closed or not?
		 */
		public closed: boolean = true;

		/**
		 * Creates a new Polygon.
		 *
		 * The points can be set from a variety of formats:
		 *
		 * - An array of Point objects: `[new sharp.Point(x1, y1), ...]`
		 * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
		 * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
		 * - As separate Point arguments: `setTo(new sharp.Point(x1, y1), ...)`
		 * - As separate objects with public x/y properties arguments: `setTo(obj1, obj2, ...)`
		 * - As separate arguments representing point coordinates: `setTo(x1,y1, x2,y2, ...)`
		 *
		 * @class sharp.Polygon
		 * @constructor
		 * @param {sharp.Point[]|number[]|...sharp.Point|...number} points - The points to set.
		 */
		constructor(xy: number[]);
		constructor(points: Point[]);
		constructor(x: number, y:number, ...args:number[]);
		constructor(p1: Point, p2: Point, ...args: Point[]);
		constructor();
		constructor()
		{
			this.area = 0;
			this.points = [];

			if (arguments.length > 0)
				this.setTo.call(this, arguments);
		}

		/**
		 * Sets this Polygon to the given points.
		 *
		 * The points can be set from a variety of formats:
		 *
		 * - An array of Point objects: `[new sharp.Point(x1, y1), ...]`
		 * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
		 * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
		 * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
		 * - As separate Point arguments: `setTo(new sharp.Point(x1, y1), ...)`
		 * - As separate objects with public x/y properties arguments: `setTo(obj1, obj2, ...)`
		 * - As separate arguments representing point coordinates: `setTo(x1,y1, x2,y2, ...)`
		 *
		 * `setTo` may also be called without any arguments to remove all points.
		 *
		 * @method sharp.Polygon#setTo
		 * @param {sharp.Point[]|number[]|...sharp.Point|...number} points - The points to set.
		 * @return {sharp.Polygon} This Polygon object
		 */
		public setTo(xy: number[]): Polygon;
		public setTo(points: Point[]): Polygon;
		public setTo(xy: number[], ...args: Array<number>[]): Polygon;
		public setTo(x: number, y: number, ...args: number[]): Polygon;
		public setTo(p1: Point, p2: Point, ...args: Point[]): Polygon;
		public setTo(args: Point | number | Point[] | number[]): Polygon
		{
			this.area = 0;
			this.points = [];
			let points: Array<any> = [];

			if (arguments.length > 0) {
				//  If args isn't an array, use arguments as the array
				if (!(args instanceof Array)) {
					points = Array.prototype.slice.call(arguments);
				} else {
					points = args;
				}

				let y0 = Number.MAX_VALUE;
				let p: Point;
				//  Allows for mixed-type arguments
				for (let i = 0, len = points.length; i < len; i++) {
					if (typeof points[i] === 'number') { // [x1, y1, x2, y2, ...]
						p = new Point(points[i], points[i + 1]);
						i++;
					} else if (Array.isArray(points[i])) { // [[x1, y1], [x2, y2], ...]
						p = new Point(points[i][0], points[i][1]);
					} else { // [p1, p2, ...]
						p = new Point(points[i].x, points[i].y);
					}

					this.points.push(p);

					//  Lowest boundary
					if (p.y < y0) {
						y0 = p.y;
					}
				}

				this.calculateArea(y0);
			}

			return this;
		}

		/**
		 * Creates a copy of the given Polygon.
		 * This is a deep clone, the resulting copy contains new sharp.Point objects
		 *
		 * @method sharp.Polygon#clone
		 * @return {sharp.Polygon} The cloned (`output`) polygon object.
		 */
		public clone(): Polygon
		{

			let points = this.points.slice();

			return new Polygon(points);
		}

		public toBody(options: any, x: number, y: number): Body
		{
			options.label = options.label || 'Polygon';
			options.type = 'Polygon Body';
			options.vertices = this.vertices(x, y);
			options.position = new Point(x, y);

			return new Body(options as BodyOptions);
		}

		public static create(xy: number[]): Polygon;
		public static create(points: Point[]): Polygon;
		public static create(x: number, y: number, ...args: number[]): Polygon;
		public static create(p1: Point, p2: Point, ...args: Point[]): Polygon;
		public static create(): Polygon
		{
			return new Polygon(...arguments);
		}

		public vertices(x: number = 0, y: number = 0)
		{
			if (x == 0 && y == 0)
				return new Vertices(this.points);

			let polygon = this.clone();
			for (let i = 0; i < polygon.points.length; ++i)
				polygon.points[i].subtract(x, y);

			return new Vertices(polygon.points);
		}

		/**
		 * Export the points as an array of flat numbers, following the sequence [ x,y, x,y, x,y ]
		 *
		 * @method sharp.Polygon#toNumberArray
		 * @return {array} The flattened array.
		 */
		public toNumberArray(): number[]
		{
			let output: number[] = []

			for (let i = 0; i < this.points.length; i++) {
				output.push(this.points[i].x);
				output.push(this.points[i].y);
			}

			return output;
		}

		/**
		 * Checks whether the x and y coordinates are contained within this polygon.
		 *
		 * @method sharp.Polygon#contains
		 * @param {number} x - The X value of the coordinate to test.
		 * @param {number} y - The Y value of the coordinate to test.
		 * @return {boolean} True if the coordinates are within this polygon, otherwise false.
		 */
		public contains(x: number, y: number): boolean
		{

			//  Adapted from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html by Jonas Raoni Soares Silva
			let inside = false;

			for (let i = -1, j = this.points.length - 1; ++i < this.points.length; j = i) {
				let ix = this.points[i].x;
				let iy = this.points[i].y;

				let jx = this.points[j].x;
				let jy = this.points[j].y;

				if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix)) {
					inside = !inside;
				}
			}

			return inside;

		}

		/**
		 * Calcuates the area of the Polygon. This is available in the property Polygon.area
		 *
		 * @method sharp.Polygon#calculateArea
		 * @private
		 * @param {number} y0 - The lowest boundary
		 * @return {number} The area of the Polygon.
		 */
		protected calculateArea(y0: number) {

			let p1: Point;
			let p2: Point;
			let avgHeight: number;
			let width: number;

			for (let i = 0, len = this.points.length; i < len; i++) {
				p1 = this.points[i];

				if (i === len - 1) {
					p2 = this.points[0];
				} else {
					p2 = this.points[i + 1];
				}

				avgHeight = ((p1.y - y0) + (p2.y - y0)) / 2;
				width = p1.x - p2.x;
				this.area += avgHeight * width;
			}

			return this.area;

		}
	}

	export class Polygons {
		public polygons: Polygon[];

		constructor(polygons: Polygon[]);
		constructor(polygon1: Polygon, ...args: Polygon[]);
		constructor()
		{
			this.setTo.call(this, arguments)
		}

		public setTo(polygons: Polygon[]): Polygons;
		public setTo(polygon1: Polygon, ...args: Polygon[]): Polygons;
		public setTo(args: Polygon | Polygon[]): Polygons
		{
			if (args instanceof Polygon)
				this.polygons = Array.prototype.slice.call(arguments);
			else
				this.polygons = args;
			return this;
		}

	}
}