namespace sharp {
	export class Region {
		public id: string;
		public startCol: number;
		public endCol: number;
		public startRow: number;
		public endRow: number;

		/**
		 * Creates a region.
		 * @method _createRegion
		 * @private
		 * @param {} startCol
		 * @param {} endCol
		 * @param {} startRow
		 * @param {} endRow
		 * @return {} region
		 */
		constructor(startCol: number, endCol: number, startRow: number, endRow: number)
		{
			this.id = startCol + ',' + endCol + ',' + startRow + ',' + endRow;
			this.startCol = startCol;
			this.endCol = endCol;
			this.startRow = startRow;
			this.endRow = endRow;
		}
	}
}