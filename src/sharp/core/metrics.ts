namespace sharp {
	export interface MetricsOptions {
		extended?: boolean;
		narrowDetections?: number;
		narrowphaseTests?: number;
		narrowReuse?: number;
		narrowReuseCount?: number;
		narrowEff?: number;
		midEff?: number;
		broadEff?: number;
		collisions?: number;
		buckets?: number;
		bodies?: number;
		pairs?: number;
	}
	export class Metrics {
		public options: MetricsOptions;
		public engine: Engine;

		public broadphaseTests: number = 0;
		public midphaseTests: number = 0;

		constructor(engine: Engine, options: MetricsOptions) {
			this.engine = engine;
			let defaults = {
				extended: false,
				narrowDetections: 0,
				narrowphaseTests: 0,
				narrowReuse: 0,
				narrowReuseCount: 0,
				narrowEff: 0.0001,
				midEff: 0.0001,
				broadEff: 0.0001,
				collisions: 0,
				buckets: 0,
				bodies: 0,
				pairs: 0
			};
			this.options = object.extend(defaults, false, this.options);
		}

		public get extended(): boolean {
			return !!this.options.extended;
		}

		public set extended(value: boolean) {
			this.options.extended = value;
		}

		public get narrowDetections(): number {
			return this.options.narrowDetections!;
		}

		public set narrowDetections(value: number) {
			this.options.narrowDetections = value;
		}

		public get narrowphaseTests(): number {
			return this.options.narrowphaseTests!;
		}

		public set narrowphaseTests(value: number) {
			this.options.narrowphaseTests = value;
		}

		public get narrowReuse(): number {
			return this.options.narrowReuse!;
		}

		public set narrowReuse(value: number) {
			this.options.narrowReuse = value;
		}

		public get narrowReuseCount(): number {
			return this.options.narrowReuseCount!;
		}

		public set narrowReuseCount(value: number) {
			this.options.narrowReuseCount = value;
		}

		public get narrowEff(): number {
			return this.options.narrowEff!;
		}

		public set narrowEff(value: number) {
			this.options.narrowEff = value;
		}

		public get midEff(): number {
			return this.options.midEff!;
		}

		public set midEff(value: number) {
			this.options.midEff = value;
		}

		public get broadEff(): number {
			return this.options.broadEff!;
		}

		public set broadEff(value: number) {
			this.options.broadEff = value;
		}

		public get collisions(): number {
			return this.options.collisions!;
		}

		public set collisions(value: number) {
			this.options.collisions = value;
		}

		public get buckets(): number {
			return this.options.buckets!;
		}

		public set buckets(value: number) {
			this.options.buckets = value;
		}

		public get bodies(): number {
			return this.options.bodies!;
		}

		public set bodies(value: number) {
			this.options.bodies = value;
		}

		public get pairs(): number {
			return this.options.pairs!;
		}

		public set pairs(value: number) {
			this.options.pairs = value;
		}

		/**
		 * Resets metrics.
		 * @method reset
		 * @private
		 * @param {metrics} metrics
		 */
		public reset() {
			if (this.extended) {
				this.narrowDetections = 0;
				this.narrowphaseTests = 0;
				this.narrowReuse = 0;
				this.narrowReuseCount = 0;
				this.midphaseTests = 0;
				this.broadphaseTests = 0;
				this.narrowEff = 0;
				this.midEff = 0;
				this.broadEff = 0;
				this.collisions = 0;
				this.buckets = 0;
				this.pairs = 0;
				this.bodies = 0;
			}
		}

		/**
		 * Updates metrics.
		 * @method update
		 * @private
		 * @param {metrics} metrics
		 * @param {engine} engine
		 */
		public update(engine?: Engine)
		{
			if (engine == undefined) engine = this.engine;

			if (this.extended) {
				let world = engine.world,
					bodies = world.allBodies();

				this.collisions = this.narrowDetections;
				this.pairs = engine.pairs.list.length;
				this.bodies = bodies.length;
				this.midEff = parseFloat((this.narrowDetections / (this.midphaseTests || 1)).toFixed(2));
				this.narrowEff = parseFloat((this.narrowDetections / (this.narrowphaseTests || 1)).toFixed(2));
				this.broadEff = parseFloat((1 - (this.broadphaseTests / (bodies.length || 1))).toFixed(2));
				this.narrowReuse = parseFloat((this.narrowReuseCount / (this.narrowphaseTests || 1)).toFixed(2));
				//let broadphase = engine.broadphase[engine.broadphase.current];
				//if (broadphase.instance)
				//    metrics.buckets = Common.keys(broadphase.instance.buckets).length;
			}
		}

	}
}