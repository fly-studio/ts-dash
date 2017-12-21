namespace sharp {
	/**
	 * 梯形/三角形
	 */
	export class Trapezoid extends Polygon {
		public x: number;
		public y: number;
		public width: number;
		public height: number;
		public slope: number;

		/**
		 * Creates a new Trapezoid object with the center coordinate specified by the x and y parameters and the radius specified by the radius parameter.
		 *
		 * @class sharp.Trapezoid
		 * @constructor
		 * @param {number} [x] - The x coordinate of the center of the Trapezoid.
		 * @param {number} [y] - The y coordinate of the center of the Trapezoid.
		 * @param {number} [width] - The width of the center of the Trapezoid.
		 * @param {number} [height] - The height of the center of the Trapezoid.
		 * @param {number} [slope] - The slope of the Trapezoid.
		 */
		constructor(p: Point, width: number, height: number, slope: number);
		constructor(x: number, y: number, width: number, height: number, slope: number);
		constructor(x: number | Point, y: number, width: number, height: number, slope?: number) {
			super();
			if (x instanceof Point)
				this.setToTrapezoid(x, y, width, height);
			else
				this.setToTrapezoid(x, y, width, height, slope!);
		}

		public get point(): Point
		{
			return new Point(this.x, this.y);
		}

		public setToTrapezoid(p: Point, width: number, height: number, slope: number): Trapezoid;
		public setToTrapezoid(x: number, y: number, width: number, height: number, slope: number): Trapezoid;
		public setToTrapezoid(x: number | Point, y: number, width: number, height: number, slope?: number): Trapezoid {
			if (x instanceof Point) {
				this.x = x.x;
				this.y = x.y;
				this.width = y;
				this.height = width;
				this.slope = height;
			} else {
				if (slope == undefined)
					throw new Error('parameter#4 slope must be a number');
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.slope = slope;
			}

			this.setTo(this.toPoints());
			return this;
		}

		public static createTrapezoid(p: Point, width: number, height: number, slope: number): Trapezoid;
		public static createTrapezoid(x: number, y: number, width: number, height: number, slope: number): Trapezoid;
		public static createTrapezoid(x: number | Point, y: number, width: number, height: number, slope?: number): Trapezoid {
			if (x instanceof Point)
				return new Trapezoid(x, y, width, height);
			else
				return new Trapezoid(x, y, width, height, slope!);
		}

		public clone(): Trapezoid {
			return new Trapezoid(this.x, this.y, this.width, this.height, this.slope);
		}

		public toBody(options: any): Body
		{
			options.label = options.label || 'Trapezoid';
			options.vertices = this.vertices();
			options.position = this.point;

			return new Body(options as BodyOptions);
		}

		public vertices() {
			return super.vertices(this.x, this.y);
		}

		protected toPoints(): Point[] {
			let slope = this.slope * 0.5;
			let roof = (1 - (slope * 2)) * this.width;

			let x1 = this.width * slope,
				x2 = x1 + roof,
				x3 = x2 + x1,
				points: Point[] = [new Point(this.x, this.y)];

			if (slope < 0.5) {
				points.push(new Point(x1 + this.x, -this.height + this.y), new Point(x2 + this.x, - this.height + this.y), new Point(x3 + this.x, this.y));
			} else { // 三角形
				points.push(new Point(x2 + this.x, - this.height + this.y), new Point(x3 + this.x, this.y));
			}

			return points;
		}
	}
}