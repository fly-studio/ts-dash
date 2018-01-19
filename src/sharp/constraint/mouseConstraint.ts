namespace sharp {

	export interface MouseConstraintOptions extends ConstraintOptions, options.ICollisionFilterOptions {

	}

	export class MouseConstraint extends Constraint {
		public options: MouseConstraintOptions;
		public mouse: Mouse;
		public body: Body | null;

		constructor(engine: Engine, options: MouseConstraintOptions)
		{
			let mouse = engine.mouse || new Mouse(engine.element);

			super(object.extend({
				label: 'Mouse Constraint',
				pointA: mouse.position,
				pointB: new Point(),
				length: 0.01,
				stiffness: 0.1,
				angularStiffness: 1,
				render: {
					strokeStyle: 0x90EE90,
					lineWidth: 3
				}
			}, options));

			this.mouse = mouse;
			this.options.collisionFilter = object.extend({
					category: 0x0001,
					mask: 0xFFFFFFFF,
					group: 0
				}, options.collisionFilter);

			engine.on('beforeUpdate', () => {
				let allBodies = engine.world.allBodies();
				this.update(allBodies);
				this._triggerEvents();
			});
		}

		public get collisionFilter(): options.CollisionFilterOptions
		{
			return this.options.collisionFilter!;
		}

		public set collisionFilter(value: options.CollisionFilterOptions)
		{
			this.options.collisionFilter = value;
		}

		/**
		 * Updates the given mouse constraint.
		 * @private
		 * @method update
		 * @param {MouseConstraint} mouseConstraint
		 * @param {body[]} bodies
		 */
		public update(bodies: Body[]) {
			let mouse = this.mouse,
				constraint = this,
				body = this.body;
			// left mouse / touch down
			if (mouse.button === 0) {
				if (!constraint.bodyB) {
					for (let i = 0; i < bodies.length; i++) {
						body = bodies[i];
						// check mouse point in this body
						if (body.bounds.contains(mouse.position)
							&& Collision.canCollide(body.collisionFilter, this.collisionFilter)) {
							for (let j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
								let part = body.parts[j];
								if (part.vertices.contains(mouse.position)) {
									constraint.pointA = mouse.position;
									constraint.bodyB = this.body = body;
									constraint.pointB = new Point(mouse.position.x - body.position.x, mouse.position.y - body.position.y);
									constraint.angleB = body.angle;

									body.setSleeping(false);
									this.trigger('startdrag', { mouse: mouse, body: body });

									break;
								}
							}
						}
					}
				} else {
					constraint.bodyB.setSleeping(false);
					constraint.pointA = mouse.position;
				}
			} else {
				constraint.bodyB = null;
				this.body = null;
				constraint.pointB = null;

				if (body)
					this.trigger('enddrag', { mouse: mouse, body: body });
			}
		}

		/**
		 * Triggers mouse constraint events.
		 * @method _triggerEvents
		 * @private
		 * @param {mouse} mouseConstraint
		 */
		protected _triggerEvents() {
			let mouse = this.mouse,
				mouseEvents = mouse.sourceEvents;

			if (mouseEvents.mousemove)
				this.trigger('mousemove', { mouse: mouse });

			if (mouseEvents.mousedown)
				this.trigger('mousedown', { mouse: mouse });

			if (mouseEvents.mouseup)
				this.trigger('mouseup', { mouse: mouse });

			// reset the mouse state ready for the next step
			mouse.clearSourceEvents();
		}
	}
}