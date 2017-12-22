namespace sharp {
	export interface MouseConstraintExtraOptions {
		mouse?: Mouse;
		element?: any;
		collisionFilter?: options.CollisionFilterOptions;
	}
	export interface MouseConstraintOptions extends options.Options, MouseConstraintExtraOptions {

	}
	export class MouseConstraint extends Container {
		protected options: MouseConstraintOptions;
		public mouse: Mouse;
		public body: Body | null;
		public constraint: Constraint;

		constructor(engine: Engine, options: MouseConstraintExtraOptions)
		{
			super();
			let mouse = (engine ? engine.mouse : null) || (options ? options.mouse! : null);

			if (!mouse) {
				if (engine && engine.render && engine.render.canvas) {
					this.mouse = new Mouse(engine.render.canvas);
				} else if (options && options.element) {
					this.mouse = new Mouse(options.element);
				} else {
					this.mouse = new Mouse();
					console.warn('MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected');
				}
			} else
				this.mouse = mouse;


			this.constraint = new Constraint({
				label: 'Mouse Constraint',
				pointA: this.mouse!.position,
				pointB: new Point(),
				length: 0.01,
				stiffness: 0.1,
				angularStiffness: 1,
				render: {
					strokeStyle: 0x90EE90,
					lineWidth: 3
				}
			});

			this.options = object.extend(this.defaultOptions(), options);

			engine.on('beforeUpdate', () => {
				let allBodies = engine.world.allBodies();
				this.update(allBodies);
				this._triggerEvents();
			});
		}

		/**
		 * 碰撞参数
		 *
		 */
		public get collisionFilter(): base.CollisionFilterOptions {
			return this.options.collisionFilter!;
		}

		public set collisionFilter(value: base.CollisionFilterOptions) {
			this.options.collisionFilter = value;
		}

		protected defaultOptions(): MouseConstraintOptions
		{
			return {
				type: 'mouseConstraint',
				collisionFilter: {
					category: 0x0001,
					mask: 0xFFFFFFFF,
					group: 0
				}
			};
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
				constraint = this.constraint,
				body = this.body;

			if (mouse.button === 0) {
				if (!constraint.bodyB) {
					for (let i = 0; i < bodies.length; i++) {
						body = bodies[i];
						if (body.bounds.contains(mouse.position)
							&& detector.canCollide(body.collisionFilter, this.collisionFilter)) {
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
		};

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
		};
	}
}