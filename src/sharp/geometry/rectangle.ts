namespace sharp {
	export class Rectangle {
		public x: number;
		public y: number;
		public width: number;
		public height: number;

		/**
		 * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters.
		 * If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
		 *
		 * @class Phaser.Rectangle
		 * @constructor
		 * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
		 * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
		 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
		 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
		 */
		public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
		{
			this.setTo(x, y, width, height);
		}

		/**
		 * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
		 * @name sharp.Rectangle#left
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
		 * @name sharp.Rectangle#right
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
		 * @name sharp.Rectangle#top
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
		 * @name sharp.Rectangle#bottom
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
		 * @name sharp.Rectangle#topLeft
		 * @property {sharp.Point} topLeft - The location of the Rectangles top left corner as a Point object.
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
		 * @name sharp.Rectangle#topRight
		 * @property {sharp.Point} topRight - The location of the Rectangles top left corner as a Point object.
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
		 * @name sharp.Rectangle#bottomLeft
		 * @property {sharp.Point} bottomLeft - Gets or sets the location of the Rectangles bottom left corner as a Point object.
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
		 * @name sharp.Rectangle#bottomRight
		 * @property {sharp.Point} bottomRight - Gets or sets the location of the Rectangles bottom right corner as a Point object.
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
		 * @name sharp.Rectangle#volume
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
		 * @name sharp.Rectangle#perimeter
		 * @property {number} perimeter - The perimeter size of the Rectangle. This is the sum of all 4 sides.
		 * @readonly
		 */
		public get perimeter(): number
		{
			return (this.width * 2) + (this.height * 2);
		}

		/**
		 * @name sharp.Rectangle#halfWidth
		 * @property {number} halfWidth - Half of the width of the Rectangle.
		 * @readonly
		 */
		public get halfWidth(): number
		{
			return Math.round(this.width / 2);
		}

		/**
		 * @name sharp.Rectangle#halfHeight
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
		 * @name sharp.Rectangle#randomX
		 * @property {number} randomX - A random value between the left and right values (inclusive) of the Rectangle.
		 */
		public get randomX(): number {
			return this.x + (Math.random() * this.width);
		}

		/**
		 * A random value between the top and bottom values (inclusive) of the Rectangle.
		 *
		 * @name sharp.Rectangle#randomY
		 * @property {number} randomY - A random value between the top and bottom values (inclusive) of the Rectangle.
		 */
		public get randomY(): number
		{
			return this.y + (Math.random() * this.height);
		}

		/**
		 * The x coordinate of the center of the Rectangle.
		 * @name sharp.Rectangle#centerX
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
		 * @name sharp.Rectangle#centerY
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
		 * @name sharp.Rectangle#empty
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
		 * Creates or positions four {@link sharp.Line} lines representing the Rectangle's sides.
		 *
		 * @method sharp.Rectangle#sides
		 * @return {sharp.Line[]} - An array containing four lines (if no arguments were given).
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
		 * @method sharp.Rectangle#clone
		 * @return {sharp.Rectangle}
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
		* @method sharp.Rectangle.createFromBounds
		* @param {any} a - An object with `left`, `top`, `width`, and `height` properties.
		* @return {sharp.Rectangle}
		*/
		public static createFromBounds(a: any)
		{
			return new Rectangle(a.x, a.y, a.width, a.height);
		};

		/**
		 * 设置值到目标
		 * Copies the x, y, width and height properties from this Rectangle to any given object.
		 *
		 * @method sharp.Rectangle#copyTo
		 * @param {Rectangle} dest The object to copy to.
		 * @return {object} This object.
		 */
		public copyTo(dest: Rectangle)
		{
			dest.x = this.x;
			dest.y = this.y;
			dest.width = this.width;
			dest.height = this.height;

			return dest;
		}

		/**
		 * Sets the members of Rectangle to the specified values.
		 * @method sharp.Rectangle#setTo
		 * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
		 * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
		 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
		 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
		 * @return {sharp.Rectangle} This Rectangle object
		 */
		public setTo(x: number, y: number, width: number, height: number): Rectangle
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		}

		/**
		 * 确定此 Rectangle 对象是否为空。
		 * Determines whether or not this Rectangle object is empty.
		 * @returns A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false. 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
		 */
		public isEmpty(): boolean
		{
			return this.empty;
		}

		public vertices(): Vertices
		{
			return new Vertices('L 0 0 L ' + this.width + ' 0 L ' + this.width + ' ' + this.height + ' L 0 ' + this.height);
		}

		/**
		 * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
		 * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
		 * @method sharp.Rectangle#offset
		 * @param {number} dx - Moves the x value of the Rectangle object by this amount. 将 Rectangle 对象的 x 值移动此数量。
		 * @param {number} dy - Moves the y value of the Rectangle object by this amount. 将 Rectangle 对象的 t 值移动此数量。
		 * @return {sharp.Rectangle} This Rectangle object.
		 */
		public offset(dx: number, dy: number): Rectangle
		{
			this.x += dx;
			this.y += dy;

			return this;
		}

		/**
		 * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
		 * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
		 * @method sharp.Rectangle#offsetPoint
		 * @param {sharp.Point} point - A Point object to use to offset this Rectangle object. 要用于偏移此 Rectangle 对象的 Point 对象。
		 * @return {sharp.Rectangle} This Rectangle object.
		 */
		public offsetPoint(point: Point): Rectangle
		{
			return this.offset(point.x, point.y);
		}

		/**
		 * Scales the width and height of this Rectangle by the given amounts.
		 *
		 * @method sharp.Rectangle#scale
		 * @param {number} x - The amount to scale the width of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the width, etc.
		 * @param {number} [y] - The amount to scale the height of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the height, etc.
		 * @return {sharp.Rectangle} This Rectangle object
		 */
		public scale(x: number, y?: number): Rectangle
		{
			if (y == undefined) { y = x; }

			this.width *= x;
			this.height *= y;

			return this;
		}

		/**
		 * Centers this Rectangle so that the center coordinates match the given x and y values.
		 *
		 * @method sharp.Rectangle#centerOn
		 * @param {number} x - The x coordinate to place the center of the Rectangle at.
		 * @param {number} y - The y coordinate to place the center of the Rectangle at.
		 * @return {sharp.Rectangle} This Rectangle object
		 */
		public centerOn(x: number, y: number): Rectangle
		{
			this.centerX = x;
			this.centerY = y;

			return this;
		}

		/**
		 * Runs Math.floor() on both the x and y values of this Rectangle.
		 * @method sharp.Rectangle#floor
		 */
		public floor(): Rectangle
		{
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;
		}

		/**
		 * Runs Math.floor() on the x, y, width and height values of this Rectangle.
		 * @method sharp.Rectangle#floorAll
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
		 * @method sharp.Rectangle#ceil
		 */
		public ceil(): Rectangle
		{
			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;
		}

		/**
		 * Runs Math.ceil() on the x, y, width and height values of this Rectangle.
		 * @method sharp.Rectangle#ceilAll
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
		 * @method sharp.Rectangle#copyFrom
		 * @param {any} source - The object to copy from.
		 * @return {sharp.Rectangle} This Rectangle object.
		 */
		public copyFrom(source: any): Rectangle
		{
			return this.setTo(source.x, source.y, source.width, source.height);
		}

		/**
		 * Copies the left, top, width and height properties from any given object to this Rectangle.
		 * @method sharp.Rectangle#copyFromBounds
		 * @param {any} source - The object to copy from.
		 * @return {sharp.Rectangle} This Rectangle object.
		 */
		public copyFromBounds(source: any): Rectangle
		{
			return this.setTo(source.left, source.top, source.width, source.height);
		}

		/**
		 * 按指定量增加 Rectangle 对象的大小（以像素为单位）
		 * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
		 * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
		 * @method sharp.Rectangle#inflate
		 * @param {number} dx - The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object. 对象横向增加的值
		 * @param {number} dy - The amount to be added to the bottom side of the Rectangle. 对象纵向增加的值
		 * @return {sharp.Rectangle} This Rectangle object.
		 */
		public inflate(dx: number, dy: number): Rectangle;
		/**
		 * 按指定量增加 Rectangle 对象的大小（以像素为单位）
		 * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
		 * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
		 * @method sharp.Rectangle#inflate
		 * @param {sharp.Point} p  - The amount to be added to the left side of the Rectangle. 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
		 * @return {sharp.Rectangle} This Rectangle object.
		 */
		public inflate(p: Point): Rectangle;
		public inflate(dxOrPoint: number|Point, dy?: number): Rectangle
		{
			let dx: number;
			if (dxOrPoint instanceof Point)
			{
				dx = dxOrPoint.x;
				dy = dxOrPoint.y;
			} else {
				dx = dxOrPoint;
				if (dy == undefined)
					throw new Error('parameter#1 "dy" must be a number');
			}

			this.x -= dx;
			this.width += 2 * dx;
			this.y -= dy;
			this.height += 2 * dy;

			return this;
		}

		/**
		 * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
		 * @method sharp.Rectangle#size
		 * @return {sharp.Point} The size of the Rectangle object.
		 */
		public size(): Point
		{
			return new Point(this.width, this.height);
		}

		/**
		 * Resize the Rectangle by providing a new width and height.
		 * The x and y positions remain unchanged.
		 *
		 * @method sharp.Rectangle#resize
		 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
		 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
		 * @return {sharp.Rectangle} This Rectangle object
		 */
		public resize(width: number, height: number): Rectangle
		{
			this.width = width;
			this.height = height;

			return this;
		}
		/**
		 * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
		 * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
		 * @method sharp.Rectangle#contains
		 * @param {number} x - The x coordinate of the point to test.
		 * @param {number} y - The y coordinate of the point to test.
		 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false. 如果检测点位于矩形内，返回true，否则，返回false
		 */
		public contains(x: number, y: number): boolean;
		/**
		 * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
		 * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
		 * @method sharp.Rectangle#containsPoint
		 * @param {Point} p - The point object being checked. Can be Point or any object with .x and .y values.
		 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false. 如果检测点位于矩形内，返回true，否则，返回false
		 */
		public contains(p: Point): boolean;
		public contains(xOrPoint: Point|number, y?: number): boolean
		{
			let x: number;
			if (xOrPoint instanceof Point)
			{
				x = xOrPoint.x;
				y = xOrPoint.y;
			} else
			{
				x = xOrPoint;
				if (y == undefined)
					throw new Error('parameter#1 "y" must be a number');
			}

			if (this.width <= 0 || this.height <= 0) {
				return false;
			}

			return (x >= this.x && x < this.right && y >= this.y && y < this.bottom);
		}

		/**
		 * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
		 * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
		 * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
		 * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
		 * @method sharp.Rectangle#containsRect
		 * @param {sharp.Rectangle} rect - The second Rectangle object. 所检查的 Rectangle 对象
		 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false. 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
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
		 * 确定在 rect 参数中指定的对象是否等于此 Rectangle 对象。
		 * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
		 * Determines whether the two Rectangles are equal.
		 * This method compares the x, y, width and height properties of each Rectangle.
		 * @method sharp.Rectangle#equals
		 * @param {sharp.Rectangle} rect - The second Rectangle object. 要与此 Rectangle 对象进行比较的矩形。
		 * @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false. 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
		 */
		public equals(rect: Rectangle): boolean
		{
			return (this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height);
		}

		/**
		 * Determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
		 * @method sharp.Rectangle.sameDimensions
		 * @param {Rectangle-like} rect - The second Rectangle object.
		 * @return {boolean} True if the object have equivalent values for the width and height properties.
		 */
		public sameDimensions(rect: Rectangle): boolean
		{
			return (this.width === rect.width && this.height === rect.height);
		}

		/**
		 * 如果在 rect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，
		 * 则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
		 * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
		 * @method sharp.Rectangle#intersection
		 * @param {sharp.Rectangle} rect - The second Rectangle object. 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
		 * @return {sharp.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0. 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和 height 属性均设置为 0 的矩形。
		 */
		public intersection(rect: Rectangle): Rectangle
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
		 * 确定在 rect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle
		 * 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
		 * Determines whether this Rectangle and another given Rectangle intersect with each other.
		 * This method checks the x, y, width, and height properties of the two Rectangles.
		 *
		 * @method sharp.Rectangle#intersects
		 * @param {sharp.Rectangle} rect - The second Rectangle object. 要与此 Rectangle 对象比较的 Rectangle 对象。
		 * @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false. 如果两个矩形相交，返回true，否则返回false
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
		 * @method sharp.Rectangle#intersectsRaw
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
		 * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
		 * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
		 * @method sharp.Rectangle#union
		 * @param {sharp.Rectangle} rect - The second Rectangle object. 要添加到此 Rectangle 对象的 Rectangle 对象。
		 * @return {sharp.Rectangle} A Rectangle object that is the union of the two Rectangles. 充当两个矩形的联合的新 Rectangle 对象。
		 */
		public union(rect: Rectangle): Rectangle
		{
			let output = new Rectangle();

			return output.setTo(Math.min(this.x, rect.x), Math.min(this.y, rect.y), Math.max(this.right, rect.right) - Math.min(this.left, rect.left), Math.max(this.bottom, rect.bottom) - Math.min(this.top, rect.top));
		}

		/**
		 * Returns a uniformly distributed random point from anywhere within this Rectangle.
		 *
		 * @method sharp.Rectangle#random
		 * @return {sharp.Point} An object containing the random point in its `x` and `y` properties.
		 */
		public random(): Point
		{
			return new Point(this.randomX, this.randomY);
		}

		/**
		 * Returns a point based on the given position constant, which can be one of:
		 *
		 * `sharp.TOP_LEFT`, `sharp.TOP_CENTER`, `sharp.TOP_RIGHT`, `sharp.LEFT_CENTER`,
		 * `sharp.CENTER`, `sharp.RIGHT_CENTER`, `sharp.BOTTOM_LEFT`, `sharp.BOTTOM_CENTER`
		 * and `sharp.BOTTOM_RIGHT`.
		 *
		 * This method returns the same values as calling Rectangle.bottomLeft, etc, but those
		 * calls always create a new Point object, where-as this one allows you to use your own.
		 *
		 * @method sharp.Rectangle#getPoint
		 * @param {integer} [position] - One of the Phaser position constants, such as `sharp.TOP_RIGHT`.
		 * @return {sharp.Point} An object containing the point in its `x` and `y` properties.
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
		 * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
		 * Returns a string representation of this object.
		 * @method sharp.Rectangle#toString
		 * @return {string} A string representation of the instance. 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
		 */
		public toString() {

			return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";

		}

		/**
		 * Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
		 *
		 * @method sharp.Rectangle#aabb
		 * @param {sharp.Point[]} points - The array of one or more points.
		 * @param {sharp.Rectangle} [out] - Optional Rectangle to store the value in, if not supplied a new Rectangle object will be created.
		 * @return {sharp.Rectangle} The new Rectangle object.
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