namespace sharp {

	export type TypePairs = [Body, Body, number];
	export type TypeBucket = Body[];

	export class Broadphase {

		public engine: Engine;
		public buckets: Map<string, TypeBucket> = new Map<string, TypeBucket>();
		public pairs: Map<string, TypePairs> = new Map<string, TypePairs>();
		public pairsList: TypePairs[] = [];
		public bucketWidth: number = 48;
		public bucketHeight: number = 48;

		 /**
		 * Creates a new grid.
		 * @method create
		 * @return {grid} A new grid
		 */
		constructor(engine: Engine)
		{
			this.engine = engine;
		}

		 /**
		 * Updates the grid.
		 * @method update
		 * @param {grid} grid
		 * @param {body[]} bodies
		 * @param {engine} engine
		 * @param {boolean} forceUpdate
		 */
		public update(bodies: Body[], forceUpdate: boolean)
		{
			let i, col, row,
				world = this.engine.world,
				buckets = this.buckets,
				bucket: TypeBucket|undefined,
				bucketId: string,
				gridChanged = false;

			let metrics = this.engine.metrics;
			if (DEBUG)
				metrics.broadphaseTests = 0;

			for (i = 0; i < bodies.length; i++) {
				let body = bodies[i];

				if (body.isSleeping && !forceUpdate)
					continue;

				// don't update out of world bodies
				if (body.bounds.max.x < world.bounds.min.x || body.bounds.min.x > world.bounds.max.x
					|| body.bounds.max.y < world.bounds.min.y || body.bounds.min.y > world.bounds.max.y)
					continue;

				let newRegion = this._getRegion(body);

				// if the body has changed grid region
				if (!body.region || newRegion.id !== body.region.id || forceUpdate) {

					if (DEBUG)
						metrics.broadphaseTests += 1;

					if (!body.region || forceUpdate)
						body.region = newRegion;

					let union: Region = this._regionUnion(newRegion, body.region);

					// update grid buckets affected by region change
					// iterate over the union of both regions
					for (col = union.startCol; col <= union.endCol; col++) {
						for (row = union.startRow; row <= union.endRow; row++) {
							bucketId = this._getBucketId(col, row);
							bucket = buckets.get(bucketId);

							let isInsideNewRegion: boolean = (col >= newRegion.startCol && col <= newRegion.endCol
								&& row >= newRegion.startRow && row <= newRegion.endRow);

							let isInsideOldRegion: boolean = (col >= body.region.startCol && col <= body.region.endCol
								&& row >= body.region.startRow && row <= body.region.endRow);

							// remove from old region buckets
							if (!isInsideNewRegion && isInsideOldRegion) {
								if (isInsideOldRegion) {
									if (bucket)
										this._bucketRemoveBody(bucket, body);
								}
							}

							// add to new region buckets
							if (body.region === newRegion || (isInsideNewRegion && !isInsideOldRegion) || forceUpdate) {
								if (!bucket)
									bucket = this._createBucket(buckets, bucketId);
								this._bucketAddBody(bucket, body);
							}
						}
					}

					// set the new region
					body.region = newRegion;

					// flag changes so we can update pairs
					gridChanged = true;
				}
			}

			// update pairs list only if pairs changed (i.e. a body changed region)
			if (gridChanged)
				this.pairsList = this._createActivePairsList();
		}

		/**
		 * Clears the grid.
		 * @method clear
		 * @param {grid} grid
		 */
		public clear() {
			this.buckets.clear();
			this.pairs.clear();
			this.pairsList = [];
		}

		/**
		 * Finds the union of two regions.
		 * @method _regionUnion
		 * @private
		 * @param {} regionA
		 * @param {} regionB
		 * @return {} region
		 */
		protected _regionUnion(regionA: Region, regionB: Region): Region
		{
			let startCol = Math.min(regionA.startCol, regionB.startCol),
				endCol = Math.max(regionA.endCol, regionB.endCol),
				startRow = Math.min(regionA.startRow, regionB.startRow),
				endRow = Math.max(regionA.endRow, regionB.endRow);

			return new Region(startCol, endCol, startRow, endRow);
		}

		/**
		 * Gets the region a given body falls in for a given grid.
		 * @method _getRegion
		 * @private
		 * @param {} body
		 * @return {} region
		 */
		protected _getRegion(body: Body): Region
		{
			let bounds = body.bounds,
				startCol = Math.floor(bounds.min.x / this.bucketWidth),
				endCol = Math.floor(bounds.max.x / this.bucketWidth),
				startRow = Math.floor(bounds.min.y / this.bucketHeight),
				endRow = Math.floor(bounds.max.y / this.bucketHeight);

			return new Region(startCol, endCol, startRow, endRow);
		}

		/**
		 * Gets the bucket id at the given position.
		 * @method _getBucketId
		 * @private
		 * @param {} column
		 * @param {} row
		 * @return {string} bucket id
		 */
		protected _getBucketId(column: number, row: number): string
		{
			return 'C' + column + 'R' + row;
		}

		/**
		 * Creates a bucket.
		 * @method _createBucket
		 * @private
		 * @param {} buckets
		 * @param {} bucketId
		 * @return {} bucket
		 */
		protected _createBucket(buckets: Map<string, Body[]>, bucketId: string): Body[]
		{
			let bucket: Body[] = [];
			buckets.set(bucketId, bucket);
			return bucket;
		}

		/**
		 * Adds a body to a bucket.
		 * @method _bucketAddBody
		 * @private
		 * @param {} bucket
		 * @param {} body
		 */
		protected _bucketAddBody(bucket: Body[], body: Body) {
			// add new pairs
			for (let i = 0; i < bucket.length; i++) {
				let bodyB = bucket[i];

				if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic))
					continue;

				// keep track of the number of buckets the pair exists in
				// important for Grid.update to work
				let pairId = Pair.getID(body, bodyB),
					pair = this.pairs.get(pairId);

				if (pair) {
					pair[2] += 1;
				} else {
					this.pairs.set(pairId, [body, bodyB, 1]);
				}
			}

			// add to bodies (after pairs, otherwise pairs with self)
			bucket.push(body);
		}

		/**
		 * Removes a body from a bucket.
		 * @method _bucketRemoveBody
		 * @private
		 * @param {} bucket
		 * @param {} body
		 */
		protected _bucketRemoveBody(bucket: Body[], body: Body) {
			// remove from bucket
			bucket.splice(bucket.indexOf(body), 1);

			// update pair counts
			for (let i = 0; i < bucket.length; i++) {
				// keep track of the number of buckets the pair exists in
				// important for _createActivePairsList to work
				let bodyB: Body = bucket[i],
					pairId: string = Pair.getID(body, bodyB),
					pair = this.pairs.get(pairId);

				if (pair)
					pair[2] -= 1;
			}
		}

		/**
		 * Generates a list of the active pairs in the grid.
		 * @method _createActivePairsList
		 * @private
		 * @return [] pairs
		 */
		protected _createActivePairsList(): TypePairs[]
		{
			let pairKeys: string[],
				pair: TypePairs|undefined,
				pairs: TypePairs[] = [];

			// grid.pairs is used as a hashmap
			pairKeys = [...this.pairs.keys()];

			// iterate over grid.pairs
			for (let k = 0; k < pairKeys.length; k++) {
				pair = this.pairs.get(pairKeys[k]);

				// if pair exists in at least one bucket
				// it is a pair that needs further collision testing so push it
				if (pair && pair[2] > 0) {
					pairs.push(pair);
				} else {
					this.pairs.delete(pairKeys[k]);
				}
			}

			return pairs;
		}
	}

}