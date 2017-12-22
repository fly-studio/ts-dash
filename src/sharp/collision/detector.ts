namespace sharp.detector {
	/**
	* Finds all collisions given a list of pairs.
	* @method collisions
	* @param {pair[]} broadphasePairs
	* @param {engine} engine
	* @return {array} collisions
	*/
	export function collisions(broadphasePairs: Pair[], engine: Engine) {
		let collisions = [],
			pairsTable = engine.pairs.table;

		// @if DEBUG
		let metrics = engine.metrics;
		// @endif

		for (let i = 0; i < broadphasePairs.length; i++) {
			let bodyA: Body = broadphasePairs[i][0],
				bodyB: Body = broadphasePairs[i][1];

			if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
				continue;

			if (!canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
				continue;

			// @if DEBUG
			metrics.midphaseTests += 1;
			// @endif

			// mid phase
			if (bodyA.bounds.overlaps(bodyB.bounds)) {
				for (let j = bodyA.parts.length > 1 ? 1 : 0; j < bodyA.parts.length; j++) {
					let partA = bodyA.parts[j];

					for (let k = bodyB.parts.length > 1 ? 1 : 0; k < bodyB.parts.length; k++) {
						let partB = bodyB.parts[k];

						if ((partA === bodyA && partB === bodyB) || partA.bounds.overlaps(partB.bounds)) {
							// find a previous collision we could reuse
							let pairId = partA.id(partB),
								pair = pairsTable[pairId],
								previousCollision;

							if (pair && pair.isActive) {
								previousCollision = pair.collision;
							} else {
								previousCollision = null;
							}

							// narrow phase
							let collision = SAT.collides(partA, partB, previousCollision);

							// @if DEBUG
							metrics.narrowphaseTests += 1;
							if (collision.reused)
								metrics.narrowReuseCount += 1;
							// @endif

							if (collision.collided) {
								collisions.push(collision);
								// @if DEBUG
								metrics.narrowDetections += 1;
								// @endif
							}
						}
					}
				}
			}
		}

		return collisions;
	};

    /**
     * Returns `true` if both supplied collision filters will allow a collision to occur.
     * See `body.collisionFilter` for more information.
     * @method canCollide
     * @param {base.CollisionFilterOptions} filterA
     * @param {base.CollisionFilterOptions} filterB
     * @return {bool} `true` if collision can occur
     */
	export function canCollide(filterA: base.CollisionFilterOptions, filterB: base.CollisionFilterOptions): boolean
	{
		if (filterA.group === filterB.group && filterA.group !== 0)
			return filterA.group! > 0;

		return (filterA.mask! & filterB.category!) !== 0 && (filterB.mask! & filterA.category!) !== 0;
	};
}