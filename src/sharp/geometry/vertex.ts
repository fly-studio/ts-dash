namespace sharp {

	export interface VertexStuct {
		x: number,
		y: number,
		index?: number,
		isInternal: boolean,
	}

	export class Vertex extends Point {
		public index: number;
		public isInternal: boolean;

		constructor(x: number, y: number, index?: number, isInternal?: boolean);
		constructor(options: VertexStuct);
		constructor(p: Point, index?: number, isInternal?: boolean);
		constructor(x: any | Point, y?: number, index: number | boolean = -1, isInternal: boolean = false) {
			super();
			if (x instanceof Point) {
				this.x = x.x;
				this.y = x.y;
				this.index = arguments[1] || -1;
				this.isInternal = arguments[2] || false;

			} else if (!isNaN(x)) {
				this.x = x;
				if (arguments.length < 2)
					throw new Error('must set the y');
				this.y = y!;
				this.index = +index;
				this.isInternal = isInternal;
			}
			else {
				this.x = x.x;
				this.y = x.y;
				this.index = x.index;
				this.isInternal = x.isInternal;
			}
		}

		public static create(x: number, y: number, index?: number, isInternal?: boolean): Vertex;
		public static create(options: VertexStuct): Vertex;
		public static create(x: any, y?: number, index: number = -1, isInternal: boolean = false): Vertex {
			return new Vertex(x, y!, index!, isInternal);
		}

		public clone() {
			return new Vertex(this.x, this.y, this.index, this.isInternal);
		}

		public point(): Point {
			return this;
		}
	}
}