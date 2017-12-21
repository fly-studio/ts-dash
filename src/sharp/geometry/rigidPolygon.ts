namespace sharp {
	/**
	 * 标准多边形
	 */
	export class RigidPolygon extends Polygon {
		public x: number;
		public y: number;
		public radius: number;
		public sides: number;

		/**
		 * Creates a new Rigid Polygon object with the center coordinate specified by the x and y parameters and the radius specified by the radius parameter.
		 *
		 * @class sharp.RigidPolygon
		 * @constructor
		 * @param {number} [x=0] - The x coordinate of the center of the Rigid Polygon.
		 * @param {number} [y=0] - The y coordinate of the center of the Rigid Polygon.
		 * @param {number} [radius=0] - The radius of the Rigid Polygon.
		 */
		constructor(p: Point, sides: number, radius: number);
		constructor(x: number, y: number, sides: number, radius: number);
		constructor(x : number | Point, y: number, sides: number, radius?: number)
		{
			super();
			if (x instanceof Point)
				this.setToRigid(x, y, sides);
			else
				this.setToRigid(x, y, sides, radius!);
		}

		public get centerPoint(): Point
		{
			return new Point(this.x, this.y);
		}

		public setToRigid(p: Point, sides: number, radius: number): RigidPolygon;
		public setToRigid(x: number, y: number, sides: number, radius: number): RigidPolygon;
		public setToRigid(x: number | Point, y: number, sides: number, radius?: number): RigidPolygon
		{
			if (sides < 3)
				throw new Error('Rigid Polygon sides must > 2.');
			if (x instanceof Point)
			{
				this.x = x.x;
				this.y = x.y;
				this.sides = y;
				this.radius = sides;
			} else {
				if (radius == undefined)
					throw new Error('parameter#3 radius must be a number');
				this.x = x;
				this.y = y;
				this.sides = sides;
				this.radius = radius;
			}

			this.setTo(this.toPoints());
			return this;
		}

		public static createRigid(p: Point, sides: number, radius: number): RigidPolygon;
		public static createRigid(x: number, y: number, sides: number, radius: number): RigidPolygon;
		public static createRigid(x: number | Point, y: number, sides: number, radius?: number): RigidPolygon
		{
			if (x instanceof Point)
				return new RigidPolygon(x, y, sides);
			else
				return new RigidPolygon(x, y, sides, radius!);
		}

		public clone(): RigidPolygon
		{
			return new RigidPolygon(this.x, this.y, this.sides, this.radius);
		}

		public toBody(options: any): Body
		{
			options.label = options.label || 'RigidPolygon';
			options.type = 'RigidPolygon Body';
			options.vertices = this.vertices();
			options.position = this.centerPoint;

			return new Body(options as BodyOptions);
		}

		public vertices()
		{
			return super.vertices(this.x, this.y);
		}

		protected toPoints(): Point[]
		{
			let theta = 2 * Math.PI / this.sides,
				offset = theta * 0.5,
				circlePoint: Point = new Point(this.x, this.y),
				points: Point[] = [];
			for (let i = 0; i < this.sides; i += 1) {
				let angle = offset + (i * theta);
				points.push(sharp.circlePoint(circlePoint, this.radius, angle));
			}
			return points;
		}

		/**
		 * Returns a string representation of this object.
		 * @method sharp.RigidPolygon#toString
		 * @return {string} A string representation of the instance.
		 */
		public toString() {
			return "[{sharp.RigidPolygon (x=" + this.x + " y=" + this.y + " radius=" + this.radius + " sides=" + this.sides + ")}]";
		}
	}

}