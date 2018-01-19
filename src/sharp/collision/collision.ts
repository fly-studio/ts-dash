namespace sharp {

	export type TOverlapAxes = { overlap: number, axis: Point, axisNumber: number};

	export class ProjectionPoint extends Point {
		public min: number = 0;
		public max: number = 0;
	}

	export class Collision {
		public static _temp = [
			new ProjectionPoint(), new ProjectionPoint(),
			new ProjectionPoint(), new ProjectionPoint(),
			new ProjectionPoint(), new ProjectionPoint(),
		];
		public bodyA: Body;
		public parentA: Body;
		public bodyB: Body;
		public parentB: Body;
		public axisBody: Body;
		public axisNumber: number = 0;
		public collided: boolean = false;
		public reused: boolean = false;
		public depth: number = 0;
		public normal: Point = new Point;
		public tangent: Point = new Point;
		public penetration: Point = new Point;
		public supports: Vertex[] = [];

		constructor(bodyA: Body, bodyB: Body)
		{
			this.bodyA = bodyA;
			this.bodyB = bodyB;
		}

		public static create(bodyA: Body, bodyB: Body, previousCollision?: Collision|null): Collision
		{
			let overlapAB: TOverlapAxes,
				overlapBA: TOverlapAxes,
				minOverlap: TOverlapAxes,
				collision: Collision,
				canReusePrevCol: boolean = false;

			if (previousCollision) {
				// estimate total motion
				let parentA: Body = bodyA.parent,
					parentB: Body = bodyB.parent,
					motion: number = parentA.speed * parentA.speed + parentA.angularSpeed * parentA.angularSpeed
						+ parentB.speed * parentB.speed + parentB.angularSpeed * parentB.angularSpeed;

				// we may be able to (partially) reuse collision result
				// but only safe if collision was resting
				canReusePrevCol = previousCollision && previousCollision.collided && motion < 0.2;

				// reuse collision object
				collision = previousCollision;
			} else {
				collision = new Collision(bodyA, bodyB);
			}

			if (previousCollision && canReusePrevCol) {
				// if we can reuse the collision result
				// we only need to test the previously found axis
				let axisBodyA = collision.axisBody,
					axisBodyB = axisBodyA === bodyA ? bodyB : bodyA,
					axes: Axes = new Axes();
				axes.add(axisBodyA.axes.at(previousCollision.axisNumber));

				minOverlap = Collision._overlapAxes(axisBodyA.vertices, axisBodyB.vertices, axes);
				collision.reused = true;

				if (minOverlap.overlap <= 0) {
					collision.collided = false;
					return collision;
				}
			} else {
				// if we can't reuse a result, perform a full SAT test

				overlapAB = Collision._overlapAxes(bodyA.vertices, bodyB.vertices, bodyA.axes);

				if (overlapAB.overlap <= 0) {
					collision.collided = false;
					return collision;
				}

				overlapBA = Collision._overlapAxes(bodyB.vertices, bodyA.vertices, bodyB.axes);

				if (overlapBA.overlap <= 0) {
					collision.collided = false;
					return collision;
				}

				if (overlapAB.overlap < overlapBA.overlap) {
					minOverlap = overlapAB;
					collision.axisBody = bodyA;
				} else {
					minOverlap = overlapBA;
					collision.axisBody = bodyB;
				}

				// important for reuse later
				collision.axisNumber = minOverlap.axisNumber;
			}

			collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
			collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
			collision.collided = true;
			collision.depth = minOverlap.overlap;
			collision.parentA = collision.bodyA.parent;
			collision.parentB = collision.bodyB.parent;

			bodyA = collision.bodyA;
			bodyB = collision.bodyB;

			// ensure normal is facing away from bodyA
			if (minOverlap.axis.dot(bodyB.position.clone().subtract(bodyA.position.x, bodyA.position.y)) < 0) {
				collision.normal.setTo(minOverlap.axis.x, minOverlap.axis.y);
			} else {
				collision.normal.setTo(-minOverlap.axis.x, -minOverlap.axis.y);
			}

			collision.tangent = collision.normal.clone().perp();

			collision.penetration.setTo(collision.normal.x * collision.depth, collision.normal.y * collision.depth);

			// find support points, there is always either exactly one or two
			let verticesB: Vertices = Collision._findSupports(bodyA, bodyB, collision.normal),
				supports: Vertex[] = [];

			// find the supports from bodyB that are inside bodyA
			if (bodyA.vertices.contains(verticesB.at(0)))
				supports.push(verticesB.at(0));

			if (bodyA.vertices.contains(verticesB.at(1)))
				supports.push(verticesB.at(1));

			// find the supports from bodyA that are inside bodyB
			if (supports.length < 2) {
				let verticesA: Vertices = Collision._findSupports(bodyB, bodyA, collision.normal.clone().negative());

				if (bodyB.vertices.contains(verticesA.at(0)))
					supports.push(verticesA.at(0));

				if (supports.length < 2 && bodyB.vertices.contains(verticesA.at(1)))
					supports.push(verticesA.at(1));
			}

			// account for the edge case of overlapping but no vertex containment
			if (supports.length < 1)
				supports = [verticesB[0]];

			collision.supports = supports;

			return collision;
		}

		/**
		 * Finds all collisions given a list of pairs.
		 * @method collisions
		 * @param {pair[]} broadphasePairs
		 * @param {engine} engine
		 * @return {array} collisions
		 */
		public static getCollisions(broadphasePairs: TypePairs[], engine: Engine) {
			let collisions: Collision[] = [],
				pairsTable: Map<string, Pair> = engine.pairs.table;

			let metrics: Metrics = engine.metrics;

			for (let i = 0; i < broadphasePairs.length; i++) {
				let bodyA: Body = broadphasePairs[i][0],
					bodyB: Body = broadphasePairs[i][1];

				if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
					continue;

				if (!Collision.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
					continue;

				//if (DEBUG)
					metrics.midphaseTests += 1;

				// mid phase
				if (bodyA.bounds.overlaps(bodyB.bounds)) {
					for (let j = bodyA.parts.length > 1 ? 1 : 0; j < bodyA.parts.length; j++) {
						let partA = bodyA.parts[j];

						for (let k = bodyB.parts.length > 1 ? 1 : 0; k < bodyB.parts.length; k++) {
							let partB = bodyB.parts[k];

							if ((partA === bodyA && partB === bodyB) || partA.bounds.overlaps(partB.bounds)) {
								// find a previous collision we could reuse
								let pairId: string = Pair.getID(partA, partB),
									pair: Pair|undefined = pairsTable.get(pairId),
									previousCollision: Collision|null;

								if (pair && pair.isActive) {
									previousCollision = pair.collision;
								} else {
									previousCollision = null;
								}

								// narrow phase
								let collision = Collision.create(partA, partB, previousCollision);

								//if (DEBUG) {
									metrics.narrowphaseTests += 1;
									if (collision.reused)
										metrics.narrowReuseCount += 1;
								//}

								if (collision.collided) {
									collisions.push(collision);
									//if (DEBUG)
										metrics.narrowDetections += 1;

								}
							}
						}
					}
				}
			}

			return collisions;
		};

		/**
		 * Find the overlap between two sets of vertices.
		 * @method _overlapAxes
		 * @private
		 * @param {} verticesA
		 * @param {} verticesB
		 * @param {} axes
		 * @return result
		 */
		protected static _overlapAxes(verticesA: Vertices, verticesB: Vertices, axes: Axes): TOverlapAxes
		{
			let projectionA = Collision._temp[0],
				projectionB = Collision._temp[1],
				result: TOverlapAxes = { overlap: Number.MAX_VALUE, axis: new Vector, axisNumber: 0 },
				overlap: number,
				axis: Point;

			for (let i = 0; i < axes.length; i++)
			{
				axis = axes.at(i);

				Collision._projectToAxis(projectionA, verticesA, axis);
				Collision._projectToAxis(projectionB, verticesB, axis);

				overlap = Math.min(projectionA.max - projectionB.min, projectionB.max - projectionA.min);

				if (overlap <= 0) {
					result.overlap = overlap;
					return result;
				}

				if (overlap < result.overlap) {
					result.overlap = overlap;
					result.axis = axis;
					result.axisNumber = i;
				}
			}

			return result;
		}

		/**
		 * Projects vertices on an axis and returns an interval.
		 * @method _projectToAxis
		 * @private
		 * @param {} projection
		 * @param {} vertices
		 * @param {} axis
		 */
		protected static _projectToAxis(projection: ProjectionPoint, vertices: Vertices, axis: Point): ProjectionPoint
		{
			let min: number = vertices.at(0).dot(axis),
				max: number = min;

			for (let i = 1; i < vertices.length; i += 1) {
				let dot: number = vertices.at(i).dot(axis);

				if (dot > max) {
					max = dot;
				} else if (dot < min) {
					min = dot;
				}
			}

			projection.min = min;
			projection.max = max;
			return projection;
		}

		/**
		 * Finds supporting vertices given two bodies along a given direction using hill-climbing.
		 * @method _findSupports
		 * @private
		 * @param {} bodyA
		 * @param {} bodyB
		 * @param {} normal
		 * @return [vector]
		 */
		protected static _findSupports(bodyA: Body, bodyB: Body, normal: Point): Vertices
		{
			let nearestDistance: number = Number.MAX_VALUE,
				vertexToBody: ProjectionPoint = Collision._temp[0],
				vertices: Vertices = bodyB.vertices,
				bodyAPosition: Point = bodyA.position,
				distance: number,
				vertex: Vertex,
				vertexA: Vertex,
				vertexB: Vertex;

			// find closest vertex on bodyB
			for (let i = 0; i < vertices.length; i++) {
				vertex = vertices.at(i);
				vertexToBody.x = vertex.x - bodyAPosition.x;
				vertexToBody.y = vertex.y - bodyAPosition.y;
				distance = -normal.dot(vertexToBody);

				if (distance < nearestDistance) {
					nearestDistance = distance;
					vertexA = vertex;
				}
			}

			// find next closest vertex using the two connected to it
			let prevIndex: number = vertexA!.index - 1 >= 0 ? vertexA!.index - 1 : vertices.length - 1;
			vertex = vertices.at(prevIndex);
			vertexToBody.x = vertex.x - bodyAPosition.x;
			vertexToBody.y = vertex.y - bodyAPosition.y;
			nearestDistance = -normal.dot(vertexToBody);
			vertexB = vertex;

			let nextIndex = (vertexA!.index + 1) % vertices.length;
			vertex = vertices[nextIndex];
			vertexToBody.x = vertex.x - bodyAPosition.x;
			vertexToBody.y = vertex.y - bodyAPosition.y;
			distance = -normal.dot(vertexToBody);
			if (distance < nearestDistance) {
				vertexB = vertex;
			}

			return new Vertices([vertexA!, vertexB]);
		}

		/**
		 * Returns `true` if both supplied collision filters will allow a collision to occur.
		 * See `body.collisionFilter` for more information.
		 * @method canCollide
		 * @param {base.CollisionFilterOptions} filterA
		 * @param {base.CollisionFilterOptions} filterB
		 * @return {bool} `true` if collision can occur
		 */
		public static canCollide(filterA: options.CollisionFilterOptions, filterB: options.CollisionFilterOptions): boolean {
			if (filterA.group === filterB.group && filterA.group !== 0)
				return filterA.group! > 0;

			return (filterA.mask! & filterB.category!) !== 0 && (filterB.mask! & filterA.category!) !== 0;
		};
	}
}