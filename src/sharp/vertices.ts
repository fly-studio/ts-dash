namespace sharp {
	export interface VertexStuct {
		x: number,
		y: number,
		index?: number,
		isInternal: boolean,
	}

	export class Vertex {
		public x: number;
		public y: number;
		public index: number;
		public body: body.Base;
		public isInternal: boolean;

		constructor(x: number, y: number, index?: number, isInternal?: boolean);
		constructor(options: VertexStuct);
		constructor(p: Point, index?: number, isInternal?: boolean);
		constructor(x: any| Point, y?: number, index: number|boolean = -1, isInternal: boolean = true) {
			if (x instanceof Point)
			{
				this.x = x.x;
				this.y = x.y;
				this.index = arguments[1] || -1;
				this.isInternal = arguments[2] || true;

			} else if (!isNaN(x)) {
				this.x = x;
				if (arguments.length < 2)
					throw new Error('must set the y');
				this.y = y!;
				this.index = +index;
				this.isInternal = isInternal;
			}
			else
			{
				this.x = x.x;
				this.y = x.y;
				this.index = x.index;
				this.isInternal = x.isInternal;
			}
		}

		public static create(x: number, y: number, index?: number, isInternal?: boolean): Vertex;
		public static create(options: VertexStuct): Vertex;
		public static create(x: any, y?: number, index: number = -1, isInternal: boolean = false): Vertex
		{
			return new Vertex(x, y!, index!, isInternal);
		}

		public clone()
		{
			return new Vertex(this.x, this.y, this.index, this.isInternal);
		}

		public point(): Point
		{
			return new Point(this.x, this.y);
		}
	}

	export class Vertices {
		public items: Vertex[];
		public body: body.Body;

		constructor(path: string);
		constructor(points?: Point[]);
		constructor(vertices: Vertex[])
		constructor(p: any = '')
		{
			this.setTo(p);
		}

		public get length(): number
		{
			return this.items.length;
		}

		public setTo(path: string): Vertices;
		public setTo(points: Point[]): Vertices;
		public setTo(vertices: Vertex[]): Vertices;
		public setTo(p: string | Point[] | Vertex[]): Vertices
		{
			let points: Point[] = [];
			this.items = [];
			if (!p) return this;
			if (p instanceof String)
			{
				let pathPattern = /L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/ig;
				p.replace(pathPattern, (match: string, x: string, y: string) => {
					points.push(Point.create(parseFloat(x), parseFloat(y)));
					return '';
				});
			} else if (p instanceof Array) {
				if (p.length > 0)
				{
					if (p[0] instanceof Vertex) {
						this.items = p as Vertex[];
						return this;
					} else if (p[0] instanceof Point) {
						points = p as Point[];
					}
				}
			}
			for (let i = 0; i < points.length; i++) {
				let point: Point = points[i],
					vertex: Vertex = Vertex.create({
						x: point.x,
						y: point.y,
						index: i,
						//body: body,
						isInternal: false
					})

				this.items.push(vertex);
			}
			return this;
		}

		public static create(path: string): Vertices;
		public static create(points: Point[]): Vertices;
		public static create(vertices: Vertex[]): Vertices;
		public static create(p: any): Vertices
		{
			return new Vertices(p);
		}

		public clone(): Vertices
		{
			let vertices: Vertices = new Vertices([]);
			vertices.items = this.cloneItems();
			return vertices;
		}

		public cloneItems()
		{
			let vertices: Vertex[] = [];
			this.items.forEach(v => {
				vertices.push(v.clone());
			});
			return vertices;
		}

		public at(index: number)
		{
			return this.items[index];
		}

		public getBounds(): Bounds
		{
			return new Bounds(this);
		}

		public getAxes(): Axes
		{
			return new Axes(this);
		}

		public add(...vertices: Vertex[]): Vertices
		{
			for(let vertex of vertices)
			{
				vertex.index = this.length;
				this.items.push(vertex);
			}
			return this;
		}

		public concat(vertices: Vertex[]): Vertices
		{
			return this.add(...vertices);
		}

		/**
		 * Returns the centre (centroid) of the set of vertices.
		 * @method centre
		 * @return {sharp.Point} The centre point
		 */
		public centre(): Point
		{
			let area: number = this.area(true),
				centre: Point = new Point(),
				cross: number,
				temp: Point,
				j: number;

			for (let i: number = 0; i < this.items.length; i++) {
				j = (i + 1) % this.items.length;
				let p1 = this.items[i].point();
				let p2 = this.items[j].point();
				cross = p1.cross(p2);
				temp = p1.add(p2.x, p2.y).multiply(cross);
				centre.add(temp.x, temp.y);
			}

			return centre.divide(6 * area);
		}

		/**
		 * 平均值
		 * Returns the average (mean) of the set of vertices.
		 * @method mean
		 * @return {vector} The average point
		 */
		public mean(): Point
		{
			let average = new Point();
			for (let i = 0; i < this.items.length; i++) {
				average.x += this.items[i].x;
				average.y += this.items[i].y;
			}
			return average.divide(this.items.length);
		}

		/**
		 * 面积
		 * Returns the area of the set of vertices.
		 * @method area
		 * @param {boolean} signed
		 * @return {number} The area
		 */
		public area(signed: boolean = false): number {
			let area: number = 0,
				j: number = this.items.length - 1;

			for (let i = 0; i < this.items.length; i++) {
				area += (this.items[j].x - this.items[i].x) * (this.items[j].y + this.items[i].y);
				j = i;
			}

			if (signed)
				return area / 2;

			return Math.abs(area) / 2;
		}

		/**
		 * 惯性
		 * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
		 * @method inertia
		 * @param {number} mass
		 * @return {number} The polygon's moment of inertia
		 */
		public inertia(mass: number) {
			let numerator: number = 0,
				denominator: number = 0,
				v = this.items,
				cross: number,
				j: number;

			// find the polygon's moment of inertia, using second moment of area
			// from equations at http://www.physicsforums.com/showthread.php?t=25293
			for (let n = 0; n < v.length; n++) {
				j = (n + 1) % v.length;
				let p1 = v[n].point();
				let p2 = v[j].point();

				cross = Math.abs(p2.cross(p1));
				numerator += cross * (p2.dot(p2) + p2.dot(p1) + p1.dot(p1));
				denominator += cross;
			}

			return (mass / 6) * (numerator / denominator);
		}

		/**
		 * 根据质点转换成正常坐标(原坐标都是以(0, 0)开始)
		 * Translates the set of vertices in-place.
		 * @method translate
		 * @param {vector} vector
		 * @param {number} scalar
		 */
		public translate(vector: Point, scalar?: number): Vertices
		{
			let i: number;
			if (scalar) {
				for (i = 0; i < this.items.length; i++) {
					this.items[i].x += vector.x * scalar;
					this.items[i].y += vector.y * scalar;
				}
			} else {
				for (i = 0; i < this.items.length; i++) {
					this.items[i].x += vector.x;
					this.items[i].y += vector.y;
				}
			}

			return this;
		}

		/**
		 * 以质点旋转
		 * Rotates the set of vertices in-place.
		 * @method rotate
		 * @param {number} angle
		 * @param {vector} point
		 */
		public rotate(angle: number, point: Point): Vertices
		{
			if (angle === 0)
				return this;

			let cos = Math.cos(angle),
				sin = Math.sin(angle);

			for (let i = 0; i < this.items.length; i++) {
				let vertice = this.items[i],
					dx = vertice.x - point.x,
					dy = vertice.y - point.y;

				vertice.x = point.x + (dx * cos - dy * sin);
				vertice.y = point.y + (dx * sin + dy * cos);
			}

			return this;
		}

		/**
		 * 包含某点
		 * Returns `true` if the `point` is inside the set of `vertices`.
		 * @method contains
		 * @param {vector} point
		 * @return {boolean} True if the vertices contains point, otherwise false
		 */
		public contains(point: Point): boolean
		{
			for (let i = 0; i < this.items.length; i++) {
				let vertice = this.items[i],
					nextVertice = this.items[(i + 1) % this.items.length];
				if ((point.x - vertice.x) * (nextVertice.y - vertice.y) + (point.y - vertice.y) * (vertice.x - nextVertice.x) > 0) {
					return false;
				}
			}

			return true;
		}

		/**
		 * 以中心点缩放
		 * Scales the vertices from a point (default is centre) in-place.
		 * @method scale
		 * @param {number} scaleX
		 * @param {number} scaleY
		 * @param {vector} point
		 */
		public scale(scaleX: number, scaleY: number, point?: Point): Vertices
		{
			if (scaleX == 1 && scaleY == 1)
				return this;

			point = point || this.centre();

			let vertex: Vertex;

			for (let i = 0; i < this.items.length; i++) {
				vertex = this.items[i];
				let delta = vertex.point().subtract(point.x, point.y);
				this.items[i].x = point.x + delta.x * scaleX;
				this.items[i].y = point.y + delta.y * scaleY;
			}

			return this;
		}

		/**
		 * 添加圆角
		 * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
		 * The radius parameter is a single number or an array to specify the radius for each vertex.
		 * @method chamfer
		 * @param {number[]} radius
		 * @param {number} quality
		 * @param {number} qualityMin
		 * @param {number} qualityMax
		 */
		public chamfer(radius: number[] = [8], quality: number = -1, qualityMin: number = 2, qualityMax: number = 14): Vertices
		{

			let newVertices: Vertex[] = [];

			for (let i = 0; i < this.items.length; i++) {
				let prevVertex = this.items[i - 1 >= 0 ? i - 1 : this.items.length - 1],
					vertex = this.items[i],
					nextVertex = this.items[(i + 1) % this.items.length],
					currentRadius = radius[i < radius.length ? i : radius.length - 1];

				if (currentRadius === 0) {
					newVertices.push(vertex);
					continue;
				}


				let prevNormal = Point.create(vertex.y - prevVertex.y, prevVertex.x - vertex.x).normalize();
				let nextNormal = Point.create(nextVertex.y - vertex.y, vertex.x - nextVertex.x).normalize();

				let diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2));
				let radiusVector = prevNormal.clone().multiply(currentRadius);
				let midNormal = prevNormal.clone().add(nextNormal.x, nextNormal.y).multiply(0.5).normalize();
				let _midNormal = midNormal.clone().multiply(diagonalRadius);
				let scaledVertex = vertex.point().subtract(_midNormal.x, _midNormal.y);

				let precision = quality;

				if (quality === -1) {
					// automatically decide precision
					precision = Math.pow(currentRadius, 0.32) * 1.75;
				}

				precision = math.clamp(precision, qualityMin, qualityMax);

				// use an even value for precision, more likely to reduce axes by using symmetry
				if (precision % 2 === 1)
					precision += 1;

				let alpha = Math.acos(prevNormal.dot(nextNormal)),
					theta = alpha / precision;

				for (let j = 0; j < precision; j++) {
					let p = radiusVector.clone().rotate(theta * j).add(scaledVertex.x, scaledVertex.y);
					newVertices.push(Vertex.create(p.x, p.y, newVertices.length, vertex.isInternal));
				}
			}

			return this.setTo(newVertices);
		}

		/**
		 * 顺时针排序
		 * Sorts the input vertices into clockwise order in place.
		 * @method clockwiseSort
		 * @return {vertices} vertices
		 */
		public clockwiseSort(): Vertices
		{
			let centre = this.mean();

			this.items.sort((vertexA, vertexB) => {
				return centre.angle(vertexA.point()) - centre.angle(vertexB.point());
			});

			return this;
		}

		/**
		 * 是否是凸面，必须先让元素顺时针排序
		 * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
		 * @method isConvex
		 * @return {bool} `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
		 */
		public isConvex() : boolean | null
		{
			// http://paulbourke.net/geometry/polygonmesh/
			// Copyright (c) Paul Bourke (use permitted)

			let flag: number = 0,
				n: number = this.items.length,
				i: number,
				j: number,
				k: number,
				z: number;

			if (n < 3)
				return null;

			for (i = 0; i < n; i++) {
				j = (i + 1) % n;
				k = (i + 2) % n;
				z = (this.items[j].x - this.items[i].x) * (this.items[k].y - this.items[j].y);
				z -= (this.items[j].y - this.items[i].y) * (this.items[k].x - this.items[j].x);

				if (z < 0) {
					flag |= 1;
				} else if (z > 0) {
					flag |= 2;
				}

				if (flag === 3) {
					return false;
				}
			}

			if (flag !== 0) {
				return true;
			} else {
				return null;
			}
		}

		/**
		 * 返回凸面部分的坐标
		 * Returns the convex hull of the input vertices as a new array of points.
		 * @method hull
		 * @return [vertex] vertices
		 */
		public hull(): Vertices
		{
			// http://geomalgorithms.com/a10-_hull-1.html

			let upper: Vertex[] = [],
				lower: Vertex[] = [],
				vertex: Vertex,
				i: number;

			// sort vertices on x-axis (y-axis for ties)
			let vertices = this.cloneItems().slice(0);
			vertices.sort((vertexA, vertexB) => {
				let dx = vertexA.x - vertexB.x;
				return dx !== 0 ? dx : vertexA.y - vertexB.y;
			});

			// build lower hull
			for (i = 0; i < vertices.length; i += 1) {
				vertex = vertices[i];

				while (lower.length >= 2
					&& lower[lower.length - 2].point().cross3(lower[lower.length - 1].point(), vertex.point()) <= 0) {
					lower.pop();
				}

				lower.push(vertex);
			}

			// build upper hull
			for (i = vertices.length - 1; i >= 0; i -= 1) {
				vertex = vertices[i];

				while (upper.length >= 2
					&& upper[upper.length - 2].point().cross3(upper[upper.length - 1].point(), vertex.point()) <= 0) {
					upper.pop();
				}

				upper.push(vertex);
			}

			// concatenation of the lower and upper hulls gives the convex hull
			// omit last points because they are repeated at the beginning of the other list
			upper.pop();
			lower.pop();

			this.items = upper.concat(lower);

			return this;
		}

	}
}