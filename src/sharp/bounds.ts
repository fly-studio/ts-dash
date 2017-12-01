namespace sharp {
	import Vector = sharp.Point;

	export class Bounds {
		public min: Point;
		public max: Point;

		constructor(vertices?: Vertices, velocity?: Vector)
		{
			if (vertices == undefined)
			{
				this.min = new Point;
				this.max = new Point;
			}
			else
				this.setTo(vertices, velocity);
		}

		public clone(): Bounds
		{
			let bounds = new Bounds;
			bounds.min = this.min.clone();
			bounds.max = this.max.clone();

			return bounds;
		}

		/**
		 * Set bounds using the given vertices and extends the bounds given a velocity.
		 * @method update
		 * @param {vertices} vertices
		 * @param {vector} velocity 速度 (本质是Point，但是在速度时需要解释为向量)
		 */
		public setTo(vertices: Vertices, velocity?: Vector): Bounds
		{
			this.min.x = Infinity;
			this.max.x = -Infinity;
			this.min.y = Infinity;
			this.max.y = -Infinity;

			for (let i:number = 0; i < vertices.length; i++) {
				let vertex = vertices.items[i];
				if (vertex.x > this.max.x) this.max.x = vertex.x;
				if (vertex.x < this.min.x) this.min.x = vertex.x;
				if (vertex.y > this.max.y) this.max.y = vertex.y;
				if (vertex.y < this.min.y) this.min.y = vertex.y;
			}

			if (velocity) {
				this.velocity(velocity);
			}

			return this;
		}

		/**
		 * 设置速度
		 * @param {vector} velocity 速度向量
		 */
		public velocity(velocity: Vector): Bounds
		{
			if (velocity.x > 0) {
				this.max.x += velocity.x;
			} else {
				this.min.x += velocity.x;
			}

			if (velocity.y > 0) {
				this.max.y += velocity.y;
			} else {
				this.min.y += velocity.y;
			}

			return this;
		}

		/**
		 * 点是否包含在此界限内
		 * Returns true if the bounds contains the given point.
		 * @method contains
		 * @param {vector} point
		 * @return {boolean} True if the bounds contain the point, otherwise false
		 */
		public contains(point: Point): boolean
		{
			return point.x >= this.min.x && point.x <= this.max.x
				&& point.y >= this.min.y && point.y <= this.max.y;
		};

		/**
		 * 是否交集
		 * Returns true if the two bounds intersect.
		 * @method overlaps
		 * @param {bounds} boundsA
		 * @param {bounds} boundsB
		 * @return {boolean} True if the bounds overlap, otherwise false
		 */
		public overlaps(boundsB: Bounds): boolean
		{
			return (this.min.x <= boundsB.max.x && this.max.x >= boundsB.min.x
				&& this.max.y >= boundsB.min.y && this.min.y <= boundsB.max.y);
		};

		/**
		 * 按照质点，重设坐标
		 * Translates this bounds by the given vector.
		 * @method translate
		 * @param {vector} vector
		 */
		public translate(vector: Point): Bounds
		{
			this.min.x += vector.x;
			this.max.x += vector.x;
			this.min.y += vector.y;
			this.max.y += vector.y;

			return this;
		};

		/**
		 * 移动坐标
		 * Shifts this bounds to the given position.
		 * @method shift
		 * @param {vector} position
		 */
		public shift(position: Vector): Bounds
		{
			let deltaX = this.max.x - this.min.x,
				deltaY = this.max.y - this.min.y;

			this.min.x = position.x;
			this.max.x = position.x + deltaX;
			this.min.y = position.y;
			this.max.y = position.y + deltaY;

			return this;
		};
	}
}