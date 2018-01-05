namespace sharp {
	export interface ConstraintExtraOptions {
		bodyA?: Body;
		pointA?: Point;
		angleA?: number;
		bodyB?: Body|null;
		pointB?: Point|null;
		angleB?: number;
		length?: number;
		stiffness?: number;
		damping?: number;
		angularStiffness ?: number;
		render?: options.RenderOptions;
	}
	export interface ConstraintOptions extends options.Options, ConstraintExtraOptions {

	}
	export class Constraint extends Container {
		protected options: ConstraintOptions;
		public static _warming: number = .4;
		public static _torqueDampen: number = 1;
		public static _minLength: number = .000001;
		protected _length: number = 0;

		 /**
		 * Creates a new constraint.
		 * All properties have default values, and many are pre-calculated automatically based on other properties.
		 * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
		 * If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
		 * For compound bodies, constraints must be applied to the parent body (not one of its parts).
		 * See the properties section below for detailed information on what you can pass via the `options` object.
		 * @constructor
		 * @param {} options
		 * @return {constraint} constraint
		 */
		constructor(options: ConstraintOptions)
		{
			super();
			this.options = object.extend(this.defaultOptions(), options);

			this.bodyA = options.bodyA!;
			this.pointA = options.pointA ? options.pointA : new Point;
			this.bodyB = options.bodyB!;
			this.pointB = options.pointB ? options.pointB : new Point;

			// calculate static length using initial world space points
			let initialPointA = options.bodyA ? this.bodyA.position.clone().add(this.pointA.x, this.pointA.y) : options.pointA!,
				initialPointB = options.bodyB ? this.bodyB.position.clone().add(this.pointB.x, this.pointB.y) : options.pointB!,
				length = initialPointA.subtract(initialPointB.x, initialPointB.y).getMagnitude();

			this._length = typeof options.length !== 'undefined' ? options.length : length;

			this.stiffness = options.stiffness || (this.length > 0 ? 1 : .7);
			this.angleA = options.bodyA ? options.bodyA.angle : options.angleA!;
			this.angleB = options.bodyB ? options.bodyB.angle : options.angleB!;

			if (this.length === 0 && this.stiffness > .1)
			{
				this.render.type = 'pin';
				this.render.anchors = false;
			} else if (this.stiffness < .9) {
				this.render.type = 'spring';
			}
		}

		public get bodyA(): Body {
			return this.options.bodyA!;
		}

		public set bodyA(value: Body) {
			this.options.bodyA = value;
		}

		public get bodyB(): Body | null {
			return this.options.bodyB!;
		}

		public set bodyB(value: Body | null) {
			this.options.bodyB = value;
		}

		public get pointA(): Point {
			return this.options.pointA!;
		}

		public set pointA(value: Point) {
			this.options.pointA = value;
		}

		public get pointB(): Point | null {
			return this.options.pointB!;
		}

		public set pointB(value: Point | null) {
			this.options.pointB = value;
		}

		public get angleA(): number {
			return this.options.angleA!;
		}

		public set angleA(value: number) {
			this.options.angleA = value;
		}

		public get angleB(): number {
			return this.options.angleB!;
		}

		public set angleB(value: number) {
			this.options.angleB = value;
		}

		public get length(): number {
			return this._length;
		}

		public get stiffness(): number {
			return this.options.stiffness!;
		}

		public set stiffness(value: number) {
			this.options.stiffness = value;
		}

		public get damping(): number {
			return this.options.damping !;
		}

		public set damping(value: number) {
			this.options.damping = value;
		}

		public get angularStiffness(): number {
			return this.options.angularStiffness!;
		}

		public set angularStiffness(value: number) {
			this.options.angularStiffness = value;
		}

		public get render(): options.RenderOptions {
			return this.options.render!;
		}

		protected defaultOptions(): ConstraintOptions
		{
			return {
				id: common.nextId(),
				label: 'Constraint',
				type: 'constraint',
				damping: 0,
				angularStiffness: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: 0xffffff,
					type: 'line',
					anchors: true
				},
				plugin: {}
			};
		}

		/**
		 * Solves a distance constraint with Gauss-Siedel method.
		 * @private
		 * @method solve
		 * @param {constraint} constraint
		 * @param {number} timeScale
		 */
		public solve(timeScale: number): Constraint
		{
			let bodyA = this.bodyA,
				bodyB = this.bodyB,
				pointA = this.pointA,
				pointB = this.pointB;

			if (!bodyA && !bodyB)
				return this;

			// update reference angle
			if (bodyA && !bodyA.isStatic) {
				pointA.rotate(bodyA.angle - this.angleA);
				this.angleA = bodyA.angle;
			}

			// update reference angle
			if (bodyB && !bodyB.isStatic) {
				pointB!.rotate(bodyB.angle - this.angleB);
				this.angleB = bodyB.angle;
			}

			let pointAWorld = pointA,
				pointBWorld = pointB;

			if (bodyA) pointAWorld = bodyA.position.clone().add(pointA.x, pointA.y);
			if (bodyB) pointBWorld = bodyB.position.clone().add(pointB!.x, pointB!.y);

			if (!pointAWorld || !pointBWorld)
				return this;

			let delta = pointAWorld.clone().subtract(pointBWorld.x, pointBWorld.x),
				currentLength = delta.getMagnitude();

			// prevent singularity
			if (currentLength < Constraint._minLength) {
				currentLength = Constraint._minLength;
			}

			// solve distance constraint with Gauss-Siedel method
			let difference = (currentLength - this.length) / currentLength,
				stiffness = this.stiffness < 1 ? this.stiffness * timeScale : this.stiffness,
				force = delta.clone().multiply(difference * stiffness),
				massTotal = (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0),
				inertiaTotal = (bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0),
				resistanceTotal = massTotal + inertiaTotal,
				torque: number,
				share: number,
				normal: Point,
				normalVelocity: number = 0,
				relativeVelocity: Point;

			if (this.damping) {
				let zero = Vector.create(),
					pB = bodyB && bodyB.position.clone().subtract(bodyB.positionPrev.x, bodyB.positionPrev.y) || zero,
					pA = bodyA && bodyA.position.clone().subtract(bodyA.positionPrev.x, bodyA.positionPrev.y) || zero;
				normal = delta.clone().divide(currentLength);
				relativeVelocity = pB.clone().subtract(pA.x, pA.y);

				normalVelocity = normal.clone().dot(relativeVelocity);
			}

			if (bodyA && !bodyA.isStatic) {
				share = bodyA.inverseMass / massTotal;

				// keep track of applied impulses for post solving
				bodyA.constraintImpulse.x -= force.x * share;
				bodyA.constraintImpulse.y -= force.y * share;

				// apply forces
				bodyA.position.x -= force.x * share;
				bodyA.position.y -= force.y * share;

				// apply damping
				if (this.damping) {
					bodyA.positionPrev.x -= this.damping * normal!.x * normalVelocity * share;
					bodyA.positionPrev.y -= this.damping * normal!.y * normalVelocity * share;
				}

				// apply torque
				torque = (pointA.cross(force) / resistanceTotal) * Constraint._torqueDampen * bodyA.inverseInertia * (1 - this.angularStiffness);
				bodyA.constraintImpulse.angle -= torque;
				bodyA.angle -= torque;
			}

			if (bodyB && !bodyB.isStatic) {
				share = bodyB.inverseMass / massTotal;

				// keep track of applied impulses for post solving
				bodyB.constraintImpulse.x += force.x * share;
				bodyB.constraintImpulse.y += force.y * share;

				// apply forces
				bodyB.position.x += force.x * share;
				bodyB.position.y += force.y * share;

				// apply damping
				if (this.damping) {
					bodyB.positionPrev.x += this.damping * normal!.x * normalVelocity * share;
					bodyB.positionPrev.y += this.damping * normal!.y * normalVelocity * share;
				}

				// apply torque
				torque = (pointB!.cross(force) / resistanceTotal) * Constraint._torqueDampen * bodyB.inverseInertia * (1 - this.angularStiffness);
				bodyB.constraintImpulse.angle += torque;
				bodyB.angle += torque;
			}

			return this;
		}
	}
}