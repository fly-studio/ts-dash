namespace sharp {

	export interface CompositeExtraOptions {
		isModified?: boolean;
		bodies?: Body[];
		constraints?: Constraint[];
		composites?: Composite[];
	}

	export interface CompositeOptions extends options.Options, CompositeExtraOptions {

	}
	/**
	 * 复合体类
	 */
	export class Composite extends Container {
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

			return vertices.getBounds();
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
				} else if (obj instanceof Constraint) {
						this.addConstraint(obj);
				} else if (obj instanceof Composite) {
						this.addComposite(obj);
				} else if (obj instanceof MouseConstraint) {
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
				} else if (obj instanceof Constraint) {
					this.removeConstraint(obj, deep);
				} else if (obj instanceof Composite) {
					this.removeComposite(obj, deep);
				} else if (obj instanceof MouseConstraint) {
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
		public addConstraint(constraint: Constraint): Composite
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
		public removeConstraint(constraint: Constraint, deep: boolean = false): Composite {
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
		public allConstraints(): Constraint[]
		{
			let constraints: Constraint[] = [...this.constraints];

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
		public rotate(rotation: number, point: Point, recursive: boolean = true): Composite
		{
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
		 * Chains all bodies in the given composite together using constraints.
		 * @method setChain
		 * @param {number} xOffsetA
		 * @param {number} yOffsetA
		 * @param {number} xOffsetB
		 * @param {number} yOffsetB
		 * @param {object} options
		 * @return {composite} A new composite containing objects chained together with constraints
		 */
		public setChain(xOffsetA: number, yOffsetA: number, xOffsetB: number, yOffsetB: number, options: any): Composite
		{
			let bodies = this.bodies;

			for (let i = 1; i < bodies.length; i++) {
				let bodyA = bodies[i - 1],
					bodyB = bodies[i],
					bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y,
					bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x,
					bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y,
					bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;

				let defaults = {
					bodyA: bodyA,
					pointA: new Point(bodyAWidth * xOffsetA, bodyAHeight * yOffsetA),
					bodyB: bodyB,
					pointB: new Point(bodyBWidth * xOffsetB, bodyBHeight * yOffsetB)
				};

				let constraint = object.extend(defaults, options);

				this.addConstraint(new Constraint(constraint));
			}

			this.label += ' Chain';

			return this;
		};

		/**
		 * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
		 * @method createMesh
		 * @param {number} columns
		 * @param {number} rows
		 * @param {boolean} crossBrace
		 * @param {object} options
		 * @return {composite} The composite containing objects meshed together with constraints
		 */
		public setMesh(columns: number, rows: number, crossBrace: boolean, options: any): Composite
		{
			let bodies = this.bodies,
				row: number,
				col: number,
				bodyA: Body,
				bodyB: Body,
				bodyC: Body;

			for (row = 0; row < rows; row++) {
				for (col = 1; col < columns; col++) {
					bodyA = bodies[(col - 1) + (row * columns)];
					bodyB = bodies[col + (row * columns)];
					this.addConstraint(new Constraint(object.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
				}

				if (row > 0) {
					for (col = 0; col < columns; col++) {
						bodyA = bodies[col + ((row - 1) * columns)];
						bodyB = bodies[col + (row * columns)];
						this.addConstraint(new Constraint(object.extend({ bodyA: bodyA, bodyB: bodyB }, options)));

						if (crossBrace && col > 0) {
							bodyC = bodies[(col - 1) + ((row - 1) * columns)];
							this.addConstraint(new Constraint(object.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
						}

						if (crossBrace && col < columns - 1) {
							bodyC = bodies[(col + 1) + ((row - 1) * columns)];
							this.addConstraint(new Constraint(object.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
						}
					}
				}
			}

			this.label += ' Mesh';

			return this;
		}


		/**
		 * Create a new composite containing bodies created in the callback in a grid arrangement.
		 * This function uses the body's bounds to prevent overlaps.
		 * @method createStack
		 * @param {number} xx
		 * @param {number} yy
		 * @param {number} columns
		 * @param {number} rows
		 * @param {number} columnGap
		 * @param {number} rowGap
		 * @param {function} callback
		 * @return {composite} A new composite containing objects created in the callback
		 */
		public static createStack(xx: number, yy: number, columns: number, rows: number, columnGap: number, rowGap: number, callback: (x: number, y: number, column: number, row: number, lastBody: Body|null, i: number) => Body|null): Composite
		{
			let stack = new Composite({ label: 'Stack' }),
				x: number = xx,
				y: number = yy,
				lastBody: Body|null = null,
				i = 0;

			for (let row = 0; row < rows; row++) {
				let maxHeight = 0;

				for (let column = 0; column < columns; column++) {
					let body = callback(x, y, column, row, lastBody, i);

					if (body) {
						let bodyHeight = body.bounds.max.y - body.bounds.min.y,
							bodyWidth = body.bounds.max.x - body.bounds.min.x;

						if (bodyHeight > maxHeight)
							maxHeight = bodyHeight;

						body.translate(new Point(bodyWidth * 0.5, bodyHeight * 0.5));

						x = body.bounds.max.x + columnGap;

						stack.addBody(body);

						lastBody = body;
						i += 1;
					} else {
						x += columnGap;
					}
				}

				y += maxHeight + rowGap;
				x = xx;
			}

			return stack;
		}

		/**
		 * Create a new composite containing bodies created in the callback in a pyramid arrangement.
		 * This function uses the body's bounds to prevent overlaps.
		 * @method createPyramid
		 * @param {number} xx
		 * @param {number} yy
		 * @param {number} columns
		 * @param {number} rows
		 * @param {number} columnGap
		 * @param {number} rowGap
		 * @param {function} callback
		 * @return {composite} A new composite containing objects created in the callback
		 */
		public static createPyramid(xx: number, yy: number, columns: number, rows: number, columnGap: number, rowGap: number, callback: (x: number, y: number, column: number, row: number, lastBody: Body|null, i: number) => Body|null): Composite
		{
			return Composite.createStack(xx, yy, columns, rows, columnGap, rowGap, function(x, y, column, row, lastBody, i) {
				let actualRows: number = Math.min(rows, Math.ceil(columns / 2)),
					lastBodyWidth: number = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;

				if (row > actualRows)
					return null;

				// reverse row order
				row = actualRows - row;

				let start: number = row,
					end: number = columns - 1 - row;

				if (column < start || column > end)
					return null;

				// retroactively fix the first body's position, since width was unknown
				if (i === 1 && lastBody) {
					lastBody.translate(new Point((column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, 0));
				}

				let xOffset = lastBody ? column * lastBodyWidth : 0;

				return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
			});
		}

		/**
		 * Creates a composite with a Newton's Cradle setup of bodies and constraints.
		 * @method createNewtonsCradle
		 * @param {number} xx
		 * @param {number} yy
		 * @param {number} number
		 * @param {number} size
		 * @param {number} length
		 * @return {composite} A new composite newtonsCradle body
		 */
		public static createNewtonsCradle(xx: number, yy: number, number: number, size: number, length: number): Composite
		{
			let newtonsCradle = new Composite({ label: 'Newtons Cradle' });

			for (let i = 0; i < number; i++) {
				let separation: number = 1.9,
					circle = new Circle(xx + i * (size * separation), yy + length, size).toBody({ inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 1 }),
					constraint = new Constraint({ pointA: new Point(xx + i * (size * separation), yy), bodyB: circle});

				newtonsCradle.addBody(circle);
				newtonsCradle.addConstraint(constraint);
			}

			return newtonsCradle;
		}

		/**
		 * Creates a composite with simple car setup of bodies and constraints.
		 * @method createCar
		 * @param {number} xx
		 * @param {number} yy
		 * @param {number} width
		 * @param {number} height
		 * @param {number} wheelSize
		 * @return {composite} A new composite car body
		 */
		public static createCar(xx: number, yy: number, width: number, height: number, wheelSize: number): Composite
		{
			let group: number = Body.nextGroup(true),
				wheelBase: number = 20,
				wheelAOffset: number = -width * 0.5 + wheelBase,
				wheelBOffset: number = width * 0.5 - wheelBase,
				wheelYOffset: number = 0;

			let car = new Composite({ label: 'Car' }),
				body = new Rectangle(xx, yy, width, height).toBody({
					collisionFilter: {
						group: group
					},
					chamfer: {
						radius: height * 0.5
					},
					density: 0.0002
				});

			let wheelA = new Circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize).toBody({
				collisionFilter: {
					group: group
				},
				friction: 0.8
			});

			let wheelB = new Circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize).toBody({
				collisionFilter: {
					group: group
				},
				friction: 0.8
			});

			let axelA = new Constraint({
				bodyB: body,
				pointB: new Point(wheelAOffset, wheelYOffset),
				bodyA: wheelA,
				stiffness: 1,
				length: 0
			});

			let axelB = new Constraint({
				bodyB: body,
				pointB: new Point(wheelBOffset, wheelYOffset),
				bodyA: wheelB,
				stiffness: 1,
				length: 0
			});

			car.addBody(body);
			car.addBody(wheelA);
			car.addBody(wheelB);
			car.addConstraint(axelA);
			car.addConstraint(axelB);

			return car;
		}

		/**
		 * Creates a simple soft body like object.
		 * @method createSoftBody
		 * @param {number} xx
		 * @param {number} yy
		 * @param {number} columns
		 * @param {number} rows
		 * @param {number} columnGap
		 * @param {number} rowGap
		 * @param {boolean} crossBrace
		 * @param {number} particleRadius
		 * @param {} particleOptions
		 * @param {} constraintOptions
		 * @return {composite} A new composite softBody
		 */
		public static createSoftBody(xx: number, yy: number, columns: number, rows: number, columnGap: number, rowGap: number, crossBrace: boolean, particleRadius: number, particleOptions: any, constraintOptions: any): Composite
		{
			particleOptions = object.extend({ inertia: Infinity }, particleOptions);
			constraintOptions = object.extend({ stiffness: 0.2, render: { type: 'line', anchors: false } }, constraintOptions);

			let softBody = Composite.createStack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
				return new Circle(x, y, particleRadius).toBody(particleOptions);
			});

			softBody.setMesh(columns, rows, crossBrace, constraintOptions);

			softBody.label = 'Soft Body';

			return softBody;
		}

	}
}