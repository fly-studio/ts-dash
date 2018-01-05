namespace sharp {
	export class Axes {
		public items: Point[];

		constructor(vertices?: Vertices)
		{
			if (vertices == undefined)
				this.items = [];
			else
				this.setTo(vertices);
		}

		public get length(): number
		{
			return this.items.length;
		}

		public at(index: number): Point
		{
			return this.items[index];
		}

		public add(...args: Point[]): Axes
		{
			for (let i = 0; i < args.length; i++) {
				const p = args[i];
				this.items.push(p);
			}
			return this;
		}

		/**
		 * Creates a new set of axes from the given vertices.
		 * @method fromVertices
		 * @param {vertices} vertices
		 * @return {axes} A new axes from the given vertices
		 */
		public setTo(vertices: Vertices): Axes
		{
			let axes = new Map<string, Point>();

			// find the unique axes, using edge normal gradients
			for (let i: number = 0; i < vertices.length; i++) {
				let j = (i + 1) % vertices.length,
					normal: Point = Point.create(vertices.at(j).y - vertices.at(i).y, vertices.at(i).x - vertices.at(j).x).normalize(),
					gradient: number = (normal.y === 0) ? Infinity : (normal.x / normal.y);

				// limit precision
				let gradientStr: string = gradient.toFixed(3).toString();
				axes.set(gradientStr, normal);
			}
			this.items = [...axes.values()];

			return this;
		}

		public clone(): Axes
		{
			let axes = new Axes;
			axes.items = this.cloneItems();
			return axes;
		}

		public cloneItems(): Point[]
		{
			let items: Point[] = [];
			this.items.forEach(p => items.push(p.clone()));
			return items;
		}

		/**
		 * Rotates this axes by the given angle.
		 * @method rotate
		 * @param {number} angle
		 * @return {axes} this axes
		 */
		public rotate(angle: number): Axes
		{
			if (angle === 0)
				return this;

			let cos = Math.cos(angle),
				sin = Math.sin(angle);

			for (let i = 0; i < this.items.length; i++) {
				let axis: Point = this.items[i],
					xx: number;
				xx = axis.x * cos - axis.y * sin;
				axis.y = axis.x * sin + axis.y * cos;
				axis.x = xx;
			}
			return this;
		}
	}
}