namespace sharp {
	export class Ray {

		public start: Point;
		public angle: number;

		constructor(x?: number, y?: number, angle?: number);
		constructor(p: Point, angle: number);
		constructor(x: any = 0, y: number = 0, angle: number = 0)
		{
			this.setTo(x, y, angle);
		}

		public get x(): number
		{
			return this.start.x;
		}

		public get y(): number
		{
			return this.start.y;
		}

		public setTo(p: Point, angle: number): Ray;
		public setTo(x: number, y: number, angle: number): Ray;
		public setTo(xOrp: any, yOrAngle: number, angle?: number): Ray
		{
			if(xOrp instanceof Point)
			{
				this.start = xOrp.clone();
				this.angle = yOrAngle;
			} else {
				this.start = Point.create(xOrp, yOrAngle);
				if (angle == undefined)
					throw new Error('parameter#2 angle must be a radian.');

				this.angle = angle;
			}

			return this;
		}

		public static create(x?: number, y?: number, angle?: number): Ray;
		public static create(p: Point, angle: number): Ray;
		public static create(x: any = 0, y: number = 0, angle: number = 0): Ray
		{
			return new Ray(x, y, angle);
		}

		public intersectsLine(line: Line): Point|boolean
		{
			if (line.pointOnLine(this.start.x, this.start.y)) return this.start;

			let l = this.virtualLineToLine(line);
			return l.intersects(line, true); // strick intersects
		}

		public reflectLine(line: Line): Ray | boolean
		{
			let p = this.intersectsLine(line);
			if (!(p instanceof Point))
				return false;

			let l = Line.create(this.start, p);
			return new Ray(p, l.reflect(line));
		}

		public intersectsRectangle(rect: Rectangle): Point[]
		{
			let sides = rect.sides;
			let pt: Point[] = [];
			sides.forEach(line => {
				let p = this.intersectsLine(line);
				if (p !== false)
					pt.push(p as Point);
			});

			return pt.sort((p1, p2) => p1.distance(this.start) - p2.distance(this.start)); //按照距离正序排列
		}

		public intersectsCircle(circle: Circle): Point[]
		{
			let line = this.virtualLineToLength(sharp.distance(this.start, circle.centerPoint) + circle.radius);
			return circle.intersectsLine(line);
		}

		public virtualLineToLine(line: Line): Line
		{
			return this.virtualLineToLength(Math.max(sharp.distance(this.start, line.start), sharp.distance(this.start, line.end)));
		}

		public virtualLineToPoint(p: Point): Line
		{
			return this.virtualLineToLength(sharp.distance(p, this.start));
		}

		public virtualLineToLength(length: number): Line
		{
			return Line.createFromAngle(this.start, this.angle, length);
		}
	}
}