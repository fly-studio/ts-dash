namespace sharp {
	export interface GravityOptions {
		x: number;
		y: number;
		scale: number;
	}
	export interface WorldExtraOptions {
		gravity?: GravityOptions;
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

		public get gravity(): GravityOptions {
			return this.gravity;
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

		public preSolveAll() {
			return World.preSolveAll(this.allBodies());
		}

		public solveAll(timeScale: number) {
			return World.solveAll(this.allConstraints(), timeScale);
		}

		public postSolveAll() {
			return World.postSolveAll(this.allBodies());
		}

		public updateSleeping(timeScale: number)	{
			return sleeping.update(this.allBodies(), timeScale);
		}

		public applyGravity(gravity: GravityOptions) {
			return World.applyGravity(this.allBodies(), gravity);
		}

		public clearForces() {
			return World.clearForces(this.allBodies());
		}

		/**
		 * Prepares for solving by constraint warming.
		 * @private
		 * @method preSolveAll
		 * @param {body[]} bodies
		*/
		public static preSolveAll(bodies: Body[]) {
			for (let i = 0; i < bodies.length; i += 1) {
				let body = bodies[i],
					impulse = body.constraintImpulse;

				if (body.isStatic || (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)) {
					continue;
				}

				body.position.x += impulse.x;
				body.position.y += impulse.y;
				body.angle += impulse.angle;
			}
		}

		/**
		 * Performs body updates required after solving constraints.
		 * @private
		 * @method postSolveAll
		 * @param {body[]} bodies
		 */
		public static postSolveAll(bodies: Body[]) {
			for (let i = 0; i < bodies.length; i++) {
				let body = bodies[i],
					impulse = body.constraintImpulse;

				if (body.isStatic || (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)) {
					continue;
				}

				body.setSleeping(false);

				// update geometry and reset
				for (let j = 0; j < body.parts.length; j++) {
					let part = body.parts[j];

					part.vertices.translate(impulse.point);

					if (j > 0) {
						part.position.x += impulse.x;
						part.position.y += impulse.y;
					}

					if (impulse.angle !== 0) {
						part.vertices.rotate(impulse.angle, body.position);
						part.axes.rotate(impulse.angle);
						if (j > 0) {
							part.position.rotateAbout(impulse.angle, body.position);
						}
					}

					part.bounds.setTo(part.vertices, body.velocity);
				}

				// dampen the cached impulse for warming next step
				impulse.angle *= Constraint._warming;
				impulse.x *= Constraint._warming;
				impulse.y *= Constraint._warming;
			}
		}

		/**
		 * Solves all constraints in a list of collisions.
		 * @private
		 * @method solveAll
		 * @param {constraint[]} constraints
		 * @param {number} timeScale
		 */
		public static solveAll(constraints: Constraint[], timeScale: number) {
			// Solve fixed constraints first.
			for (let i = 0; i < constraints.length; i += 1) {
				let constraint = constraints[i],
					fixedA = !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic),
					fixedB = !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic);

				if (fixedA || fixedB) {
					constraints[i].solve(timeScale);
				}
			}

			// Solve free constraints last.
			for (let i = 0; i < constraints.length; i += 1) {
				let constraint = constraints[i],
					fixedA = !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic),
					fixedB = !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic);

				if (!fixedA && !fixedB) {
					constraints[i].solve(timeScale);
				}
			}
		}

		/**
		 * Applys a mass dependant force to all given bodies.
		 * @method _bodiesApplyGravity
		 * @private
		 * @param {body[]} bodies
		 * @param {vector} gravity
		 */
		public static applyGravity(bodies: Body[], gravity: GravityOptions)
		{
			let gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001;

			if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
				return;
			}

			for (let i = 0; i < bodies.length; i++) {
				let body = bodies[i];

				if (body.isStatic || body.isSleeping)
					continue;

				// apply gravity
				body.force.y += body.mass * gravity.y * gravityScale;
				body.force.x += body.mass * gravity.x * gravityScale;
			}
		}

		/**
		 * Zeroes the `body.force` and `body.torque` force buffers.
		 * @method _bodiesClearForces
		 * @private
		 * @param {body[]} bodies
		 */
		public static clearForces(bodies: Body[]) {
			for (let i = 0; i < bodies.length; i++) {
				let body = bodies[i];

				// reset force buffers
				body.force.x = 0;
				body.force.y = 0;
				body.torque = 0;
			}
		}

		/**
		 * Applys `Body.update` to all given `bodies`.
		 * @method _bodiesUpdate
		 * @private
		 * @param {body[]} bodies
		 * @param {number} deltaTime
		 * The amount of time elapsed between updates
		 * @param {number} timeScale
		 * @param {number} correction
		 * The Verlet correction factor (deltaTime / lastDeltaTime)
		 * @param {bounds} worldBounds
		 */
		public static update(bodies: Body[], deltaTime: number, timeScale: number, correction: number, worldBounds?: Bounds) {
			for (let i = 0; i < bodies.length; i++) {
				let body = bodies[i];

				if (body.isStatic || body.isSleeping)
					continue;

				body.update(deltaTime, timeScale, correction);
			}
		};

	}
}