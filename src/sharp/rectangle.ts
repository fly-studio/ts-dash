namespace sharp {
	export class Rectangle {
		public x: number;
		public y: number;
		public width: number;
		public height: number;

		public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
		{
			this.setTo(x, y, width, height);
		}

		/**
		 * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
		 * @name Phaser.Rectangle#left
		 * @property {number} left - The x coordinate of the left of the Rectangle.
		 */
		public get left(): number
		{
			return this.x;
		}

		public set left(value: number)
		{
			if (value >= this.right) {
				this.width = 0;
			} else {
				this.width = this.right - value;
			}
			this.x = value;
		}

		/**
		 * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties, however it does affect the width property.
		 * @name Phaser.Rectangle#right
		 * @property {number} right - The sum of the x and width properties.
		 */
		public get right(): number
		{
			return this.x + this.width;
		}

		public set right(value: number)
		{
			if (value <= this.x) {
				this.width = 0;
			} else {
				this.width = value - this.x;
			}
		}

		/**
		 * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
		 * However it does affect the height property, whereas changing the y value does not affect the height property.
		 * @name Phaser.Rectangle#top
		 * @property {number} top - The y coordinate of the top of the Rectangle.
		 */
		public get top(): number
		{
			return this.y;
		}

		public set top(value: number)
		{
			if (value >= this.bottom) {
				this.height = 0;
				this.y = value;
			} else {
				this.height = (this.bottom - value);
			}
		}

		/**
		 * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
		 * @name Phaser.Rectangle#bottom
		 * @property {number} bottom - The sum of the y and height properties.
		 */
		public get bottom(): number
		{
			return this.y + this.height;
		}

		public set bottom(value: number)
		{
			if (value <= this.y) {
				this.height = 0;
			}
			else {
				this.height = value - this.y;
			}
		}

		/**
		 * The location of the Rectangles top left corner as a Point object.
		 * @name Phaser.Rectangle#topLeft
		 * @property {Phaser.Point} topLeft - The location of the Rectangles top left corner as a Point object.
		 */
		public get topLeft(): Point
		{
			return new Point(this.x, this.y);
		}

		public set topLeft(value: Point)
		{
			this.x = value.x;
			this.y = value.y;
		}

		/**
		 * The location of the Rectangles top right corner as a Point object.
		 * @name Phaser.Rectangle#topRight
		 * @property {Phaser.Point} topRight - The location of the Rectangles top left corner as a Point object.
		 */
		public get topRight(): Point
		{
			return new Point(this.right, this.y);
		}


		public set topRight(value: Point)
		{
			this.right = value.x;
			this.y = value.y;
		}

		/**
		 * The location of the Rectangles bottom left corner as a Point object.
		 * @name Phaser.Rectangle#bottomLeft
		 * @property {Phaser.Point} bottomLeft - Gets or sets the location of the Rectangles bottom left corner as a Point object.
		 */
		public get bottomLeft(): Point
		{
			return new Point(this.x, this.bottom);
		}

		public set bottomLeft(value: Point)
		{
			this.x = value.x;
			this.bottom = value.y;
		}

		/**
		 * The location of the Rectangles bottom right corner as a Point object.
		 * @name Phaser.Rectangle#bottomRight
		 * @property {Phaser.Point} bottomRight - Gets or sets the location of the Rectangles bottom right corner as a Point object.
		 */
		public get bottomRight(): Point
		{
			return new Point(this.right, this.bottom);
		}

		public set bottomRight(value: Point)
		{
			this.right = value.x;
			this.bottom = value.y;
		}

		/**
		 * 面积
		 * The volume of the Rectangle derived from width * height.
		 * @name Phaser.Rectangle#volume
		 * @property {number} volume - The volume of the Rectangle derived from width * height.
		 * @readonly
		 */
		public get volume(): number
		{
			return this.width * this.height;
		}

		/**
		 * 周长
		 * The perimeter size of the Rectangle. This is the sum of all 4 sides.
		 * @name Phaser.Rectangle#perimeter
		 * @property {number} perimeter - The perimeter size of the Rectangle. This is the sum of all 4 sides.
		 * @readonly
		 */
		public get perimeter(): number
		{
			return (this.width * 2) + (this.height * 2);
		}

		/**
		 * @name Phaser.Rectangle#halfWidth
		 * @property {number} halfWidth - Half of the width of the Rectangle.
		 * @readonly
		 */
		public get halfWidth(): number
		{
			return Math.round(this.width / 2);
		}

		/**
		 * @name Phaser.Rectangle#halfHeight
		 * @property {number} halfHeight - Half of the height of the Rectangle.
		 * @readonly
		 */
		public get halfHeight(): number
		{
			return Math.round(this.height / 2);
		}

		/**
		 * A random value between the left and right values (inclusive) of the Rectangle.
		 *
		 * @name Phaser.Rectangle#randomX
		 * @property {number} randomX - A random value between the left and right values (inclusive) of the Rectangle.
		 */
		public get randomX(): number {
			return this.x + (Math.random() * this.width);
		}

		/**
		 * A random value between the top and bottom values (inclusive) of the Rectangle.
		 *
		 * @name Phaser.Rectangle#randomY
		 * @property {number} randomY - A random value between the top and bottom values (inclusive) of the Rectangle.
		 */
		public get randomY(): number
		{
			return this.y + (Math.random() * this.height);
		}

		/**
		 * The x coordinate of the center of the Rectangle.
		 * @name Phaser.Rectangle#centerX
		 * @property {number} centerX - The x coordinate of the center of the Rectangle.
		 */
		public get centerX(): number
		{
			return this.x + this.halfWidth;
		}

		public set centerX(value: number)
		{
			this.x = value - this.halfWidth;
		}

		/**
		 * The y coordinate of the center of the Rectangle.
		 * @name Phaser.Rectangle#centerY
		 * @property {number} centerY - The y coordinate of the center of the Rectangle.
		 */
		public get centerY(): number
		{
			return this.y + this.halfHeight;
		}

		public set centerY(value: number)
		{
			this.y = value - this.halfHeight;
		}

		public get centerPoint(): Point
		{
			return new Point(this.centerX, this.centerY);
		}

		public set centerPoint(value: Point)
		{
			this.centerX = value.x;
			this.centerY = value.y;
		}

		/**
		 * Determines whether or not this Rectangle object is empty. A Rectangle object is empty if its width or height is less than or equal to 0.
		 * If set to true then all of the Rectangle properties are set to 0.
		 * @name Phaser.Rectangle#empty
		 * @property {boolean} empty - Gets or sets the Rectangles empty state.
		 */
		public get empty() : boolean
		{
			return (!this.width || !this.height);
		}

		public set empty(value: boolean)
		{
			if (value) {
				this.setTo(0, 0, 0, 0);
			}
		}

		/**
		 * 四角
		 */
		public get edges(): Point[] {
			return [
				this.topLeft,
				this.topRight,
				this.bottomRight,
				this.bottomLeft
			];
		}

		/**
		 * 四边
		 * Creates or positions four {@link Phaser.Line} lines representing the Rectangle's sides.
		 *
		 * @method Phaser.Rectangle#sides
		 * @return {Phaser.Line[]} - An array containing four lines (if no arguments were given).
		 */
		public get sides(): Line[] {
			return [
				new Line(this.topLeft, this.topRight), // Top
				new Line(this.topRight, this.bottomRight), // Right
				new Line(this.bottomRight, this.bottomLeft), // Bottom
				new Line(this.bottomLeft, this.topLeft), // Left
			];
		}

		/**
		 * clone一个新的
		 * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
		 *
		 * @method Phaser.Rectangle#clone
		 * @return {Phaser.Rectangle}
		 */
		public clone(): Rectangle
		{
			return new Rectangle(this.x, this.y, this.width, this.height);
		}

		public static create(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
		{
			return new Rectangle(x, y, width, height);
		}

		/**
		* Returns a new Rectangle object with the same values for the left, top, width, and height properties as the original object.
		* @method Phaser.Rectangle.createFromBounds
		* @param {any} a - An object with `left`, `top`, `width`, and `height` properties.
		* @return {Phaser.Rectangle}
		*/
		public static createFromBounds(a: any)
		{
			return new Rectangle(a.x, a.y, a.width, a.height);
		};

		/**
		 * 设置值到目标
		 * Copies the x, y, width and height properties from this Rectangle to any given object.
		 *
		 * @method Phaser.Rectangle#copyTo
		 * @param {Rectangle} dest The object to copy to.
		 * @return {object} This object.
		 */
		public copyTo(dest: Rectangle): Rectangle
		{
			dest.x = this.x;
			dest.y = this.y;
			dest.width = this.width;
			dest.height = this.height;

			return dest;
		}

		/**
		 * Sets the members of Rectangle to the specified values.
		 * @method Phaser.Rectangle#setTo
		 * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
		 * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
		 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
		 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
		 * @return {Phaser.Rectangle} This Rectangle object
		 */
		public setTo(x: number, y: number, width: number, height: number): Rectangle
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		}

		public isEmpty(): boolean
		{
			return this.empty;
		}

		/**
		 * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
		 * @method Phaser.Rectangle#offset
		 * @param {number} dx - Moves the x value of the Rectangle object by this amount.
		 * @param {number} dy - Moves the y value of the Rectangle object by this amount.
		 * @return {Phaser.Rectangle} This Rectangle object.
		 */
		public offset(dx: number, dy: number): Rectangle
		{
			this.x += dx;
			this.y += dy;

			return this;
		}

		/**
		 * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
		 * @method Phaser.Rectangle#offsetPoint
		 * @param {Phaser.Point} point - A Point object to use to offset this Rectangle object.
		 * @return {Phaser.Rectangle} This Rectangle object.
		 */
		public offsetPoint(point: Point): Rectangle
		{
			return this.offset(point.x, point.y);
		}

		/**
		 * Scales the width and height of this Rectangle by the given amounts.
		 *
		 * @method Phaser.Rectangle#scale
		 * @param {number} x - The amount to scale the width of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the width, etc.
		 * @param {number} [y] - The amount to scale the height of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the height, etc.
		 * @return {Phaser.Rectangle} This Rectangle object
		 */
		public scale(x: number, y?: number): Rectangle
		{
			if (y == null) { y = x; }

			this.width *= x;
			this.height *= y;

			return this;
		}

		/**
		 * Centers this Rectangle so that the center coordinates match the given x and y values.
		 *
		 * @method Phaser.Rectangle#centerOn
		 * @param {number} x - The x coordinate to place the center of the Rectangle at.
		 * @param {number} y - The y coordinate to place the center of the Rectangle at.
		 * @return {Phaser.Rectangle} This Rectangle object
		 */
		public centerOn(x: number, y: number): Rectangle
		{
			this.centerX = x;
			this.centerY = y;

			return this;
		}

		/**
		 * Runs Math.floor() on both the x and y values of this Rectangle.
		 * @method Phaser.Rectangle#floor
		 */
		public floor(): Rectangle
		{
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;
		}

		/**
		 * Runs Math.floor() on the x, y, width and height values of this Rectangle.
		 * @method Phaser.Rectangle#floorAll
		 */
		public floorAll(): Rectangle
		{
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.width = Math.floor(this.width);
			this.height = Math.floor(this.height);

			return this;
		}

		/**
		 * Runs Math.ceil() on both the x and y values of this Rectangle.
		 * @method Phaser.Rectangle#ceil
		 */
		public ceil(): Rectangle
		{
			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;
		}

		/**
		 * Runs Math.ceil() on the x, y, width and height values of this Rectangle.
		 * @method Phaser.Rectangle#ceilAll
		 */
		public ceilAll(): Rectangle
		{
			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.width = Math.ceil(this.width);
			this.height = Math.ceil(this.height);

			return this;
		}

		/**
		 * Copies the x, y, width and height properties from any given object to this Rectangle.
		 * @method Phaser.Rectangle#copyFrom
		 * @param {any} source - The object to copy from.
		 * @return {Phaser.Rectangle} This Rectangle object.
		 */
		public copyFrom(source: any): Rectangle
		{
			return this.setTo(source.x, source.y, source.width, source.height);
		}

		/**
		 * Copies the left, top, width and height properties from any given object to this Rectangle.
		 * @method Phaser.Rectangle#copyFromBounds
		 * @param {any} source - The object to copy from.
		 * @return {Phaser.Rectangle} This Rectangle object.
		 */
		public copyFromBounds(source: any): Rectangle
		{
			return this.setTo(source.left, source.top, source.width, source.height);
		}

		/**
		 * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
		 * @method Phaser.Rectangle#inflate
		 * @param {number} dxOrPoint - The amount to be added to the left side of the Rectangle.
		 * @param {Phaser.Point} dxOrPoint - The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
		 * @param {number} dy - The amount to be added to the bottom side of the Rectangle.
		 * @return {Phaser.Rectangle} This Rectangle object.
		 */
		public inflate(dxOrPoint: number|Point, dy?: number): Rectangle
		{
			let dx: number;
			if (dxOrPoint instanceof Point)
			{
				dx = dxOrPoint.x;
				dy = dxOrPoint.y;
			} else
				dx = dxOrPoint;

			this.x -= dx;
			this.width += 2 * dx;
			this.y -= dy;
			this.height += 2 * dy;

			return this;
		}

		/**
		 * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
		 * @method Phaser.Rectangle#size
		 * @return {Phaser.Point} The size of the Rectangle object.
		 */
		public size(): Point
		{
			return new Point(this.width, this.height);
		}

		/**
		 * Resize the Rectangle by providing a new width and height.
		 * The x and y positions remain unchanged.
		 *
		 * @method Phaser.Rectangle#resize
		 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
		 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
		 * @return {Phaser.Rectangle} This Rectangle object
		 */
		public resize(width: number, height: number): Rectangle
		{
			this.width = width;
			this.height = height;

			return this;
		}

		/**
		 * 点是否包含此矩形中
		 * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
		 * @method Phaser.Rectangle#contains
		 * @param {number} xOrPoint - The x coordinate of the point to test.
		 * @param {Point} xOrPoint - The point object being checked. Can be Point or any object with .x and .y values.
		 * @param {number} y - The y coordinate of the point to test.
		 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
		 */
		public contains(xOrPoint: Point|number, y?: number): boolean
		{
			let x: number;
			if (xOrPoint instanceof Point)
			{
				x = xOrPoint.x;
				y = xOrPoint.y;
			} else
				x = xOrPoint;

			if (this.width <= 0 || this.height <= 0) {
				return false;
			}

			return (x >= this.x && x < this.right && y >= this.y && y < this.bottom);
		}

		/**
		 * 此矩形是否包含rect中
		 * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
		 * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
		 * @method Phaser.Rectangle#containsRect
		 * @param {Phaser.Rectangle} rect - The second Rectangle object.
		 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
		 */
		public containsRect(rect: Rectangle): boolean
		{
			//  If the given rect has a larger volume than this one then it can never contain it
			if (this.volume > rect.volume) {
				return false;
			}

			return (this.x >= rect.x && this.y >= rect.y && this.right < rect.right && this.bottom < rect.bottom);
		}

		/**
		 * Determines whether the two Rectangles are equal.
		 * This method compares the x, y, width and height properties of each Rectangle.
		 * @method Phaser.Rectangle#equals
		 * @param {Phaser.Rectangle} rect - The second Rectangle object.
		 * @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
		 */
		public equals(rect: Rectangle): boolean
		{
			return (this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height);
		}

		/**
		 * Determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
		 * @method Phaser.Rectangle.sameDimensions
		 * @param {Rectangle-like} rect - The second Rectangle object.
		 * @return {boolean} True if the object have equivalent values for the width and height properties.
		 */
		public sameDimensions(rect: Rectangle): boolean
		{
			return (this.width === rect.width && this.height === rect.height);
		}

		/**
		 * 相交的矩形
		 * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
		 * @method Phaser.Rectangle#intersection
		 * @param {Phaser.Rectangle} rect - The second Rectangle object.
		 * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
		 */
		public intersection(rect): Rectangle
		{
			let output = new Rectangle();
			if (this.intersects(rect))
			{
				output.x = Math.max(this.x, rect.x);
				output.y = Math.max(this.y, rect.y);
				output.width = Math.min(this.right, rect.right) - output.x;
				output.height = Math.min(this.bottom, rect.bottom) - output.y;
			}

			return output;
		}

		/**
		 * Determines whether this Rectangle and another given Rectangle intersect with each other.
		 * This method checks the x, y, width, and height properties of the two Rectangles.
		 *
		 * @method Phaser.Rectangle#intersects
		 * @param {Phaser.Rectangle} rect - The second Rectangle object.
		 * @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
		 */
		public intersects(rect: Rectangle): boolean
		{
			if (this.width <= 0 || this.height <= 0 || rect.width <= 0 || rect.height <= 0) {
				return false;
			}

			return !(this.right < rect.x || this.bottom < rect.y || this.x > rect.right || this.y > rect.bottom);
		}

		/**
		 * Determines whether the coordinates given intersects (overlaps) with this Rectangle.
		 *
		 * @method Phaser.Rectangle#intersectsRaw
		 * @param {number} left - The x coordinate of the left of the area.
		 * @param {number} right - The right coordinate of the area.
		 * @param {number} top - The y coordinate of the area.
		 * @param {number} bottom - The bottom coordinate of the area.
		 * @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
		 * @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
		 */
		public intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number = 0)
		{
			return !(left > this.right + tolerance || right < this.left - tolerance || top > this.bottom + tolerance || bottom < this.top - tolerance);
		}

		/**
		 * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
		 * @method Phaser.Rectangle#union
		 * @param {Phaser.Rectangle} rect - The second Rectangle object.
		 * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
		 */
		public union(rect: Rectangle): Rectangle
		{
			let output = new Rectangle();

			return output.setTo(Math.min(this.x, rect.x), Math.min(this.y, rect.y), Math.max(this.right, rect.right) - Math.min(this.left, rect.left), Math.max(this.bottom, rect.bottom) - Math.min(this.top, rect.top));
		}

		/**
		 * Returns a uniformly distributed random point from anywhere within this Rectangle.
		 *
		 * @method Phaser.Rectangle#random
		 * @return {Phaser.Point} An object containing the random point in its `x` and `y` properties.
		 */
		public random(): Point
		{
			return new Point(this.randomX, this.randomY);
		}

		/**
		 * Returns a point based on the given position constant, which can be one of:
		 *
		 * `Phaser.TOP_LEFT`, `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`,
		 * `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER`
		 * and `Phaser.BOTTOM_RIGHT`.
		 *
		 * This method returns the same values as calling Rectangle.bottomLeft, etc, but those
		 * calls always create a new Point object, where-as this one allows you to use your own.
		 *
		 * @method Phaser.Rectangle#getPoint
		 * @param {integer} [position] - One of the Phaser position constants, such as `Phaser.TOP_RIGHT`.
		 * @return {Phaser.Point} An object containing the point in its `x` and `y` properties.
		 */
		public getPoint(position: POSITION): Point
		{
			let out = new Point()

			switch (position) {
				default:
				case POSITION.TOP_LEFT:
				return out.setTo(this.x, this.y);

				case POSITION.TOP_CENTER:
				return out.setTo(this.centerX, this.y);

				case POSITION.TOP_RIGHT:
				return out.setTo(this.right, this.y);

				case POSITION.LEFT_CENTER:
				return out.setTo(this.x, this.centerY);

				case POSITION.CENTER:
				return out.setTo(this.centerX, this.centerY);

				case POSITION.RIGHT_CENTER:
				return out.setTo(this.right, this.centerY);

				case POSITION.BOTTOM_LEFT:
				return out.setTo(this.x, this.bottom);

				case POSITION.BOTTOM_CENTER:
				return out.setTo(this.centerX, this.bottom);

				case POSITION.BOTTOM_RIGHT:
				return out.setTo(this.right, this.bottom);
			}
		}

		/**
		 * Returns a string representation of this object.
		 * @method Phaser.Rectangle#toString
		 * @return {string} A string representation of the instance.
		 */
		public toString() {

			return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";

		}

		/**
		 * Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
		 *
		 * @method Phaser.Rectangle#aabb
		 * @param {Phaser.Point[]} points - The array of one or more points.
		 * @param {Phaser.Rectangle} [out] - Optional Rectangle to store the value in, if not supplied a new Rectangle object will be created.
		 * @return {Phaser.Rectangle} The new Rectangle object.
		 * @static
		 */
		public static aabb(points: Point[]): Rectangle
		{
			let out = new Rectangle();

			let xMax = Number.NEGATIVE_INFINITY,
				xMin = Number.POSITIVE_INFINITY,
				yMax = Number.NEGATIVE_INFINITY,
				yMin = Number.POSITIVE_INFINITY;

			points.forEach(point => {
				if (point.x > xMax) {
					xMax = point.x;
				}
				if (point.x < xMin) {
					xMin = point.x;
				}

				if (point.y > yMax) {
					yMax = point.y;
				}
				if (point.y < yMin) {
					yMin = point.y;
				}
			});

			out.setTo(xMin, yMin, xMax - xMin, yMax - yMin);

			return out;
		}
	}
}