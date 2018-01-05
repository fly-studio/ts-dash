namespace sharp {
	export class Pairs {
		public static _pairMaxIdleLife: number = 1000;
		public engine: Engine;
		public table: Map<string, Pair> = new Map<string, Pair>();
		public list: Pair[] = [];
		public collisionStart: Pair[] = [];
		public collisionActive: Pair[] = [];
		public collisionEnd: Pair[] = [];
		/**
		 * Creates a new pairs structure.
		 * @method create
		 * @param {object} options
		 * @return {pairs} A new pairs structure
		 */
		constructor(engine: Engine)
		{
			this.engine = engine;
		}

		/**
		 * Updates pairs given a list of collisions.
		 * @method update
		 * @param {collision[]} collisions
		 * @param {number} timestamp
		 */
		public update(collisions: Collision[], timestamp: number): Pairs
		{
			var pairsList = this.list,
				pairsTable = this.table,
				collisionStart = this.collisionStart,
				collisionEnd = this.collisionEnd,
				collisionActive = this.collisionActive,
				activePairIds: string[] = [],
				collision,
				pairId: string,
				pair: Pair|undefined,
				i: number;

			// clear collision state arrays, but maintain old reference
			collisionStart.length = 0;
			collisionEnd.length = 0;
			collisionActive.length = 0;

			for (i = 0; i < collisions.length; i++) {
				collision = collisions[i];

				if (collision.collided) {
					pairId = Pair.getID(collision.bodyA, collision.bodyB);
					activePairIds.push(pairId);

					pair = pairsTable.get(pairId);

					if (pair) {
						// pair already exists (but may or may not be active)
						if (pair.isActive) {
							// pair exists and is active
							collisionActive.push(pair);
						} else {
							// pair exists but was inactive, so a collision has just started again
							collisionStart.push(pair);
						}

						// update the pair
						pair.update(collision, timestamp);
					} else {
						// pair did not exist, create a new pair
						pair = new Pair(collision, timestamp);
						pairsTable.set(pairId, pair);

						// push the new pair
						collisionStart.push(pair);
						pairsList.push(pair);
					}
				}
			}

			// deactivate previously active pairs that are now inactive
			for (i = 0; i < pairsList.length; i++) {
				pair = pairsList[i];
				if (pair.isActive && activePairIds.indexOf(pair.id) === -1) {
					pair.setActive(false, timestamp);
					collisionEnd.push(pair);
				}
			}
			return this;
		}

		/**
		 * Finds and removes pairs that have been inactive for a set amount of time.
		 * @method removeOld
		 * @param {number} timestamp
		 */
		public removeOld(timestamp: number): Pairs
		{
			var pairsList = this.list,
				pairsTable = this.table,
				indexesToRemove: number[] = [],
				pair: Pair,
				collision: Collision,
				pairIndex: number,
				i: number;

			for (i = 0; i < pairsList.length; i++) {
				pair = pairsList[i];
				collision = pair.collision;

				// never remove sleeping pairs
				if (collision.bodyA.isSleeping || collision.bodyB.isSleeping) {
					pair.timeUpdated = timestamp;
					continue;
				}

				// if pair is inactive for too long, mark it to be removed
				if (timestamp - pair.timeUpdated > Pairs._pairMaxIdleLife) {
					indexesToRemove.push(i);
				}
			}

			// remove marked pairs
			for (i = 0; i < indexesToRemove.length; i++) {
				pairIndex = indexesToRemove[i] - i;
				pair = pairsList[pairIndex];
				delete pairsTable[pair.id];
				pairsList.splice(pairIndex, 1);
			}
			return this;
		}

		/**
		 * Clears the given pairs structure.
		 * @method clear
		 * @param {pairs} pairs
		 * @return {pairs} pairs
		 */
		public clear(): Pairs
		{
			this.table.clear();
			this.list.length = 0;
			this.collisionStart.length = 0;
			this.collisionActive.length = 0;
			this.collisionEnd.length = 0;
			return this;
		}

	}
}