namespace sharp {

	export interface CompositeOptions extends body.Options {
		isModified?: boolean;
		bodies?: Body[];
		constraints?: Constraint[];
		composites?: Composite[];
	}
	/**
	 * 复合体类
	 */
	export class Composite extends body.Base {
		protected options: CompositeOptions;
		protected isModified: boolean = false;
		public bodies: Body[] = [];
		public constraints: Constraint[] = [];
		public composites: Composite[] = [];

		constructor(options: CompositeOptions)
		{
			super();
			if (options.bodies) {this.bodies = options.bodies; delete options.bodies;}
			if (options.constraints) {this.constraints = options.constraints; delete options.constraints;}
			if (options.composites) {this.composites = options.composites; delete options.composites;}
			this.options = object.extend(this.defaultOptions(), options);
		}

		/**
		 * 父级刚体
		 */
		public get parent(): Composite {
			return this.options.parent!;
		}

		public set parent(value: Composite) {
			this.options.parent = value;
		}

		protected defaultOptions(): CompositeOptions {
			return {
				id: common.nextId(),
				type: 'composite',
				parent: null,
				label: 'Composite',
				plugin: {}
			};
		}

		/**
		 * Sets the composite's `isModified` flag.
		 * If `updateParents` is true, all parents will be set (default: false).
		 * If `updateChildren` is true, all children will be set (default: false).
		 * @method setModified
		 * @param {boolean} isModified
		 * @param {boolean} [updateParents=false]
		 * @param {boolean} [updateChildren=false]
		 */
		public setModified(isModified: boolean, updateParents: boolean = false, updateChildren: boolean = false): Composite
		{
			this.isModified = isModified;

			if (updateParents && this.parent) {
				this.parent.setModified(isModified, updateParents, updateChildren);
			}

			if (updateChildren) {
				for (let i = 0; i < this.composites.length; i++) {
					let childComposite = this.composites[i];
					childComposite.setModified(isModified, updateParents, updateChildren);
				}
			}
			return this;
		}

		/**
		 * Generic add function. Adds one or many body(s), constraint(s) or a composite(s) to the given composite.
		 * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
		 * @method add
		 * @param {} object
		 * @return {composite} The original composite with the objects added
		 */
		public add(...args: any[]) {

			this.trigger('beforeAdd', { object: args });

			for (let i = 0; i < args.length; i++) {
				let obj = args[i];

				if (obj instanceof Body) {
					// skip adding compound parts
						if (obj.parent !== obj) {
							console.warn('Composite.add: skipped adding a compound body part (you must add its parent instead)');
							break;
						}
						this.addBody(obj);
				} else if (obj instanceof constraint.Constraint) {
						this.addConstraint(obj);
				} else if (obj instanceof Composite) {
						this.addComposite(obj);
				} else if (obj instanceof constraint.MouseConstraint) {
						this.addConstraint(obj.constraint);
				}
			}

			this.trigger('afterAdd', { object: args });

			return this;
		}

		/**
		 * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
		 * Optionally searching its children recursively.
		 * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
		 * @method remove
		 * @param {} object
		 * @param {boolean} [deep=false]
		 * @return {composite} The original composite with the objects removed
		 */
		public remove(args: any[], deep: boolean = false) {
			this.trigger('beforeRemove', { object: object });

			for (let i = 0; i < args.length; i++) {
				let obj = args[i];

				if (obj instanceof Body) {
					this.removeBody(obj, deep);
				} else if (obj instanceof constraint.Constraint) {
					this.removeConstraint(obj, deep);
				} else if (obj instanceof Composite) {
					this.removeComposite(obj, deep);
				} else if (obj instanceof constraint.MouseConstraint) {
					this.removeConstraint(obj.constraint);
				}
			}

			this.trigger('afterRemove', { object: object });

			return this;
		}

		/**
		 * Adds a composite to the given composite.
		 * @private
		 * @method addCompositeAB
		 * @return {composite} The original compositeA with the objects from compositeB added
		 */
		public addComposite(compositeB: Composite): Composite
		{
			this.composites.push(compositeB);
			compositeB.parent = this;
			this.setModified(true, true, false);
			return this;
		}

		/**
		 * Removes a composite from the given composite, and optionally searching its children recursively.
		 * @private
		 * @method removeCompositeAB
		 * @param {boolean} [deep=false]
		 * @return {composite} The original compositeA with the composite removed
		 */
		public removeComposite(compositeB: Composite, deep: boolean = false): Composite
		{
			let position = this.composites.indexOf(compositeB);
			if (position !== -1) {
				this.removeCompositeAt(position);
				this.setModified(true, true, false);
			}

			if (deep) {
				for (let i = 0; i < this.composites.length; i++) {
					this.composites[i].removeComposite(compositeB, true);
				}
			}

			return this;
		}

		/**
		 * Removes a composite from the given composite.
		 * @private
		 * @method removeCompositeAt
		 * @param {number} position
		 * @return {composite} The original composite with the composite removed
		 */
		public removeCompositeAt(position: number): Composite
		{
			this.composites.splice(position, 1);
			this.setModified(true, true, false);
			return this;
		}

		/**
		 * Adds a body to the given composite.
		 * @private
		 * @method addBody
		 * @param {body} body
		 * @return {composite} The original composite with the body added
		 */
		public addBody(body: Body): Composite
		{
			this.bodies.push(body);
			this.setModified(true, true, false);
			return this;
		}

		/**
		 * Removes a body from the given composite, and optionally searching its children recursively.
		 * @private
		 * @method removeBody
		 * @param {body} body
		 * @param {boolean} [deep=false]
		 * @return {composite} The original composite with the body removed
		 */
		public removeBody(body: Body, deep: boolean = false) {
			let position = this.bodies.indexOf(body);
			if (position !== -1) {
				this.removeBodyAt(position);
				this.setModified(true, true, false);
			}

			if (deep) {
				for (let i = 0; i < this.composites.length; i++) {
					this.composites[i].removeBody(body, true);
				}
			}

			return this;
		}

		/**
		 * Removes a body from the given composite.
		 * @private
		 * @method removeBodyAt
		 * @param {number} position
		 * @return {composite} The original composite with the body removed
		 */
		public removeBodyAt(position: number): Composite
		{
			this.bodies.splice(position, 1);
			this.setModified(true, true, false);
			return this;
		}

		/**
		 * Adds a constraint to the given composite.
		 * @private
		 * @method addConstraint
		 * @param {constraint} constraint
		 * @return {composite} The original composite with the constraint added
		 */
		public addConstraint(constraint: constraint.Constraint): Composite
		{
			this.constraints.push(constraint);
			this.setModified(true, true, false);
			return this;
		}

		/**
		 * Removes a constraint from the given composite, and optionally searching its children recursively.
		 * @private
		 * @method removeConstraint
		 * @param {constraint} constraint
		 * @param {boolean} [deep=false]
		 * @return {composite} The original composite with the constraint removed
		 */
		public removeConstraint(constraint: constraint.Constraint, deep: boolean): Composite {
			let position = this.constraints.indexOf(constraint);
			if (position !== -1) {
				this.removeConstraintAt(position);
			}

			if (deep) {
				for (let i = 0; i < this.composites.length; i++) {
					this.composites[i].removeConstraint(constraint, true);
				}
			}

			return this;
		}

		/**
		 * Removes a body from the given composite.
		 * @private
		 * @method removeConstraintAt
		 * @param {number} position
		 * @return {composite} The original composite with the constraint removed
		 */
		public removeConstraintAt(position: number): Composite
		{
			this.constraints.splice(position, 1);
			this.setModified(true, true, false);
			return this;
		}

		/**
		 * Removes all bodies, constraints and composites from the given composite.
		 * Optionally clearing its children recursively.
		 * @method clear
		 * @param {boolean} keepStatic
		 * @param {boolean} [deep=false]
		 */
		public clear(keepStatic: boolean, deep: boolean = false): Composite
		{
			if (deep) {
				for (let i = 0; i < this.composites.length; i++) {
					this.composites[i].clear(keepStatic, true);
				}
			}

			if (keepStatic) {
				this.bodies = this.bodies.filter(function (body) { return body.isStatic; });
			} else {
				this.bodies.length = 0;
			}

			this.constraints.length = 0;
			this.composites.length = 0;
			this.setModified(true, true, false);

			return this;
		}

		/**
		 * Returns all bodies in the given composite, including all bodies in its children, recursively.
		 * @method allBodies
		 * @return {body[]} All the bodies
		 */
		public allBodies(): Body[]
		{
			let bodies: Body[] = [...this.bodies];

			for (let i = 0; i < this.composites.length; i++)
				bodies = bodies.concat(this.composites[i].allBodies());

			return bodies;
		}

		/**
		 * Returns all constraints in the given composite, including all constraints in its children, recursively.
		 * @method allConstraints
		 * @return {constraint[]} All the constraints
		 */
		public allConstraints(): constraint.Constraint[]
		{
			let constraints: constraint.Constraint[] = [...this.constraints];

			for (let i = 0; i < this.composites.length; i++)
				constraints = constraints.concat(this.composites[i].allConstraints());

			return constraints;
		}

		/**
		 * Returns all composites in the given composite, including all composites in its children, recursively.
		 * @method allComposites
		 * @return {composite[]} All the composites
		 */
		public allComposites(): Composite[]
		{
			let composites: Composite[] = [...this.composites];

			for (let i = 0; i < this.composites.length; i++)
				composites = composites.concat(this.composites[i].allComposites());

			return composites;
		}

		/**
		 * Searches the composite recursively for an object matching the type and id supplied, null if not found.
		 * @method get
		 * @param {number} id
		 * @param {string} type
		 * @return {object} The requested object, if found
		 */
		public get(id: number, type: string): any
		{
			let objects: any[] = [],
				object;

			switch (type) {
				case 'body':
					objects = this.allBodies();
					break;
				case 'constraint':
					objects = this.allConstraints();
					break;
				case 'composite':
					objects = this.allComposites().concat(this);
					break;
			}

			if (!objects.length)
				return null;

			object = objects.filter(function (object) {
				return object.id.toString() === id.toString();
			});

			return object.length === 0 ? null : object[0];
		}

		/**
		 * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
		 * @method move
		 * @param {compositeA} compositeA
		 * @param {object[]} objects
		 * @param {compositeB} compositeB
		 * @return {composite} Returns compositeA
		 */
		public move(objects: any[], compositeB: Composite): Composite
		{
			this.remove(objects);
			compositeB.add(objects);
			return this;
		}

		/**
		 * Assigns new ids for all objects in the composite, recursively.
		 * @method rebase
		 * @return {composite} Returns composite
		 */
		public rebase(): Composite
		{
			let objects: any[] = ([] as any[]).concat(this.allBodies())
				.concat(this.allConstraints())
				.concat(this.allComposites());

			for (let i = 0; i < objects.length; i++) {
				objects[i].id = common.nextId();
			}

			this.setModified(true, true, false);

			return this;
		}

		/**
		 * Translates all children in the composite by a given vector relative to their current positions,
		 * without imparting any velocity.
		 * @method translate
		 * @param {vector} translation
		 * @param {bool} [recursive=true]
		 */
		public translate(translation: Point, recursive: boolean = true) : Composite
		{
			let bodies = recursive ? this.allBodies() : this.bodies;

			for (let i = 0; i < bodies.length; i++) {
				bodies[i].translate(translation);
			}

			this.setModified(true, true, false);

			return this;
		}

		/**
		 * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
		 * @method rotate
		 * @param {number} rotation
		 * @param {vector} point
		 * @param {bool} [recursive=true]
		 */
		public rotate(rotation: number, point: Point, recursive: boolean = true) {
			let cos = Math.cos(rotation),
				sin = Math.sin(rotation),
				bodies = recursive ? this.allBodies() : this.bodies;

			for (let i = 0; i < bodies.length; i++) {
				let body = bodies[i],
					dx = body.position.x - point.x,
					dy = body.position.y - point.y;

				body.setPosition(new Point(
					point.x + (dx * cos - dy * sin),
					point.y + (dx * sin + dy * cos)
				));

				body.rotate(rotation);
			}

			this.setModified(true, true, false);

			return this;
		}

		/**
		 * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
		 * @method scale
		 * @param {number} scaleX
		 * @param {number} scaleY
		 * @param {vector} point
		 * @param {bool} [recursive=true]
		 */
		public scale(scaleX: number, scaleY: number, point: Point, recursive: boolean = false): Composite
		{
			let bodies = recursive ? this.allBodies() : this.bodies;

			for (let i = 0; i < bodies.length; i++) {
				let body = bodies[i],
					dx = body.position.x - point.x,
					dy = body.position.y - point.y;

				body.setPosition(new Point(
					point.x + dx * scaleX,
					point.y + dy * scaleY
				));

				body.scale(scaleX, scaleY);
			}

			this.setModified(true, true, false);

			return this;
		}

		/**
		 * Returns the union of the bounds of all of the composite's bodies.
		 * @method bounds The composite.
		 * @returns {bounds} The composite bounds.
		 */
		public get bounds(): Bounds
		{
			let bodies = this.allBodies(),
				vertices = new Vertices;

			for (let i = 0; i < bodies.length; i += 1) {
				let body = bodies[i];
				vertices.add(new Vertex(body.bounds.min), new Vertex(body.bounds.max));
			}

			return vertices.getBounds();;
		}
	}
}