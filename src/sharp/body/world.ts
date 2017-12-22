namespace sharp {
	export interface WorldExtraOptions {
		gravity?: {
			x: number;
			y: number;
			scale: number;
		};
		//bounds?: Bounds;
	}
	export interface WorldOptions extends CompositeOptions, WorldExtraOptions {

	}
	export class World extends Composite {
		protected options: WorldOptions;
		/**
		 * Creates a new world composite. The options parameter is an object that specifies any properties you wish to override the defaults.
		 * See the properties section below for detailed information on what you can pass via the `options` object.
		 * @constructor
		 * @param {} options
		 * @return {world} A new world
		 */
		constructor(options: WorldOptions)
		{
			super({});

			this.options = object.extend(this.options, { label: 'World' }, {
				gravity: {
					x: 0,
					y: 1,
					scale: 0.001
				},
				//bounds: new Bounds()
			}, options);
		}

		/**
		 * The gravity x component.
		 *
		 * @property gravity.x
		 * @type object
		 * @default 0
		 */
		public get gravityX(): number {
			return this.options.gravity!.x;
		}

		public set gravityX(value: number) {
			this.options.gravity!.x = value;
		}

		 /**
		 * The gravity y component.
		 *
		 * @property gravity.y
		 * @type object
		 * @default 1
		 */
		public get gravityY(): number {
			return this.options.gravity!.x;
		}

		public set gravityY(value: number) {
			this.options.gravity!.y = value;
		}

		/**
		 * The gravity scale factor.
		 *
		 * @property gravity.scale
		 * @type object
		 * @default 0.001
		 */
		public get gravityScale(): number {
			return this.options.gravity!.scale;
		}

		public set gravityScale(value: number) {
			this.options.gravity!.scale = value;
		}

	}
}