namespace sharp {
	export type TimingOptions = {
		/**
		 * 时间缩放因子 [1]
		 * 0 为停止, > 1 为快动作, < 1 为慢动作
		 */
		timeScale?: number;
		/**
		 * 当前模拟时间，会根据timeScale计算
		 */
		timestamp?: number;
	};

	export interface EngineExtraOptions {
		/**
		 * 允许休眠
		 */
		enableSleeping?: boolean;
		/**
		 * 约束迭代次数 [2]
		 * 每次update时，计算约束迭代算法的次数，数值越高越真实，但是性能越差
		 */
		constraintIterations?: number;
		/**
		 * 位置迭代次数 [6]
		 * 每次update时，计算位置的迭代算法的次数，数值越高越真实，但是性能越差
		 */
		positionIterations?: number;
		/**
		 * 速度迭代次数 [4]
		 * 每次update时，计算速度的迭代算法的次数，数值越高越真实，但是性能越差
		 */
		velocityIterations?: number;
		timing?: TimingOptions,
		plugin?: Object;

	}

	export interface EngineOptions extends EngineExtraOptions {

	}

	export class Engine extends EventDispatcher {
		protected options: EngineOptions;
		public element: HTMLElement;
		public events: any[] = [];
		public mouse: Mouse;
		public world: World;
		public pairs: Pairs;
		public metrics: Metrics;
		public broadphase: Broadphase;

		/**
		 * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
		 * All properties have default values, and many are pre-calculated automatically based on other properties.
		 * See the properties section below for detailed information on what you can pass via the `options` object.
		 * @method create
		 * @param {object} [options]
		 * @return {engine} engine
		 */
		constructor(element: HTMLElement, options: EngineOptions)
		{
			super();
			this.element = element;
			this.world = new World({});
			this.events = [];
			this.pairs = new Pairs(this);
			this.metrics = new Metrics(this, {});
			this.broadphase = new Broadphase(this);

			//if (DEBUG)
				this.metrics.extended = true;

			let defaults = {
				positionIterations: 6,
				velocityIterations: 4,
				constraintIterations: 2,
				enableSleeping: false,
				timing: {
					timestamp: 0,
					timeScale: 1
				}

			};

			this.options = object.extend(defaults, options);
		}

		public get timing(): TimingOptions {
			return this.options.timing!;
		}

		public set timing(value: TimingOptions) {
			this.options.timing = value;
		}

		public get enableSleeping(): boolean {
			return this.options.enableSleeping!;
		}

		public set enableSleeping(value: boolean) {
			this.options.enableSleeping = value;
		}

		public get constraintIterations(): number {
			return this.options.constraintIterations!;
		}

		public set constraintIterations(value: number) {
			this.options.constraintIterations = value;
		}

		public get positionIterations(): number {
			return this.options.positionIterations!;
		}

		public set positionIterations(value: number) {
			this.options.positionIterations = value;
		}

		public get velocityIterations(): number {
			return this.options.velocityIterations!;
		}

		public set velocityIterations(value: number) {
			this.options.velocityIterations = value;
		}

		/**
		 * Moves the simulation forward in time by `delta` ms.
		 * The `correction` argument is an optional `Number` that specifies the time correction factor to apply to the update.
		 * This can help improve the accuracy of the simulation in cases where `delta` is changing between updates.
		 * The value of `correction` is defined as `delta / lastDelta`, i.e. the percentage change of `delta` over the last step.
		 * Therefore the value is always `1` (no correction) when `delta` constant (or when no correction is desired, which is the default).
		 * See the paper on <a href="http://lonesock.net/article/verlet.html">Time Corrected Verlet</a> for more information.
		 *
		 * Triggers `beforeUpdate` and `afterUpdate` events.
		 * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
		 * @method update
		 * @param {number} [delta=16.666] 60帧下的定时器秒数
		 * @param {number} [correction=1]
		 */
		public update(delta: number = 16.666, correction: number = 1): Engine
		{
			let world: World = this.world,
				timing: TimingOptions = this.timing,
				broadphase: Broadphase = this.broadphase,
				broadphasePairs: TypePairs[]|Body[] = [],
				i: number;

			// increment timestamp
			timing.timestamp! += delta * timing.timeScale!;

			// create an event object
			let event = {
				timestamp: timing.timestamp
			};

			this.trigger('beforeUpdate', event);

			// get lists of all bodies and constraints, no matter what composites they are in
			let allBodies = world.allBodies(),
				allConstraints = world.allConstraints();

			if (this.metrics.extended)
				this.metrics.reset();

			// if sleeping enabled, call the sleeping controller
			if (this.enableSleeping)
				sleeping.update(allBodies, timing.timeScale!);

			// applies gravity to all bodies
			World.applyGravity(allBodies, world.gravity);

			// update all body position and rotation by integration
			World.update(allBodies, delta, timing.timeScale!, correction, world.bounds);

			// update all constraints (first pass)
			World.preSolveAll(allBodies);
			for (i = 0; i < this.constraintIterations; i++) {
				World.solveAll(allConstraints, timing.timeScale!);
			}
			World.postSolveAll(allBodies);

			// broadphase pass: find potential collision pairs
			if (broadphase) {
				// if world is dirty, we must flush the whole grid
				if (world.isModified)
					broadphase.clear();

				// update the grid buckets based on current bodies
				broadphase.update(allBodies, world.isModified);
				broadphasePairs = broadphase.pairsList;
			} else {
				// if no broadphase set, we just pass all bodies
				broadphasePairs = allBodies;
			}

			// clear all composite modified flags
			if (world.isModified) {
				world.setModified(false, false, true);
			}

			// narrowphase pass: find actual collisions, then create or update collision pairs
			let collisions = Collision.getCollisions(broadphasePairs, this);

			// update collision pairs
			let pairs: Pairs = this.pairs,
				timestamp: number = timing.timestamp!;

			pairs.update(collisions, timestamp);
			pairs.removeOld(timestamp);

			// wake up bodies involved in collisions
			if (this.enableSleeping)
				sleeping.afterCollisions(pairs.list, timing.timeScale!);

			// trigger collision events
			if (pairs.collisionStart.length > 0)
				this.trigger('collisionStart', { pairs: pairs.collisionStart });

			// iteratively resolve position between collisions
			Resolver.preSolvePosition(pairs.list);
			for (i = 0; i < this.positionIterations; i++) {
				Resolver.solvePosition(pairs.list, timing.timeScale);
			}
			Resolver.postSolvePosition(allBodies);

			// update all constraints (second pass)
			World.preSolveAll(allBodies);
			for (i = 0; i < this.constraintIterations; i++) {
				World.solveAll(allConstraints, timing.timeScale!);
			}
			World.postSolveAll(allBodies);

			// iteratively resolve velocity between collisions
			Resolver.preSolveVelocity(pairs.list);
			for (i = 0; i < this.velocityIterations; i++) {
				Resolver.solveVelocity(pairs.list, timing.timeScale);
			}

			// trigger collision events
			if (pairs.collisionActive.length > 0)
				this.trigger('collisionActive', { pairs: pairs.collisionActive });

			if (pairs.collisionEnd.length > 0)
				this.trigger('collisionEnd', { pairs: pairs.collisionEnd });

			if (this.metrics.extended)
				this.metrics.update(this);

			// clear force buffers
			World.clearForces(allBodies);

			this.trigger('afterUpdate', event);

			return this;
		}

		/**
		 * Clears the engine including the world, pairs and broadphase.
		 * @method clear
		 */
		public clear() {
			let world = this.world;

			this.pairs.clear();

			let broadphase = this.broadphase;
			if (broadphase) {
				let bodies = world.allBodies();
				broadphase.clear();
				broadphase.update(bodies, true);
			}
		}
	}
}