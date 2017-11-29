//http://www.jeffreythompson.org/collision-detection/
/*
∠ABC是三个角, abc分别是这三个角的对边
	C ___a__ B
	 |     /
	 |    /
	 b   c
	 |  /
	 | /
	 |/
	 A

直角三角形
勾股  a² + b² = c²
正弦  sin(A) = 对边 / 斜边 = a / c
余弦  cos(A) = 临边 / 斜边 = b / c
正切  tan(A) = 对边 / 临边 = a / b
余切  cot(A) = 临边 / 对边 = b / a

其它三角形
sin(A) / a = sin(B) / b = sin(C) / c = 2R（R是三角形外接圆半径）
cos(A) = (b² + c² - a²) / 2bc
cos(B) = (a² + c² - b²) / 2ac
cos(C) = (a² + b² - c²) / 2ab
*/
namespace sharp {

	export enum DIRECTION {
		N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
		North = 0, Northeast = 1, East = 2, Southeast = 3, South = 4, Southwest = 5, West = 6, Nothwest = 7,
		NORTH = 0, NORTHEAST = 1, EAST = 2, SOUTHEAST = 3, SOUTH = 4, SOUTHWEST = 5, WEST = 6, NOTHWEST = 7
	}

	export enum POSITION {
		TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT = 3,
		Top = 0, Right = 1, Bottom = 2, Left = 3,
		UP = 0, FORWARD = 1, DOWN = 2, BACKWARD = 3,
		Up = 0, Forward = 1, Down = 2, Backward = 3,
		TOP_LEFT,
		TOP_CENTER,
		TOP_RIGHT,
		LEFT_CENTER,
		CENTER,
		RIGHT_CENTER,
		BOTTOM_LEFT,
		BOTTOM_CENTER,
		BOTTOM_RIGHT,
	}

	/**
	 * Twice PI.
	 * @property {number} layer.math#PI2
	 * @default ~6.283
	 */
	export const PI2: number = Math.PI * 2;

	/**
	 * Half PI.
	 * @property {number} layer.math#HALF_PI
	 * @default ~1.570
	 */
	export const HALF_PI: number = Math.PI * 0.5;

	/**
	 * Degrees to Radians factor.
	 * @property {number} layer.math#DEG_TO_RAD
	 */
	export const DEG_TO_RAD: number = Math.PI / 180;

	/**
	 * Degrees to Radians factor.
	 * @property {number} layer.math#RAD_TO_DEG
	 */
	export const RAD_TO_DEG: number = 180 / Math.PI;
	/**
	 * Convert degrees to radians.
	 *
	 * @method layer.math#degToRad
	 * @param {number} degrees - Angle in degrees.
	 * @return {number} Angle in radians.
	 */
	export function degToRad(degrees: number): number
	{
		return degrees * DEG_TO_RAD;
	}

	/**
	 * Convert radians to degrees.
	 *
	 * @method layer.math#radToDeg
	 * @param {number} radians - Angle in radians.
	 * @return {number} Angle in degrees
	 */
	export function radToDeg(radians: number): number
	{
		return radians * RAD_TO_DEG;
	}

	/**
	 * 角度 to 弧度
	 * @param  {number} d 角度(-360~360)
	 * @return {number}   弧度
	 */
	export function d2r(d: number): number
	{
		return (d * Math.PI) / 180;
	}

	/**
	 * 弧度 to 角度
	 * @param  {number} r 弧度
	 * @return {number}   角度(-360~360)
	 */
	export function r2d(r: number): number
	{
		return (180 * r) / Math.PI;
	}

	/**
	 * 计算两点之间的斜率(坐标1的x轴正方向的夹角弧度（顺时针）)
	 * http://keisan.casio.com/exec/system/1223508685
	 * @param  {Point} p1 点1
	 * @param  {Point} p2 点2
	 * @return {number}         斜率（弧度）
	 */
	export function slope(p1: Point, p2: Point): number
	{
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	}

	/**
	 * 计算两点之间的角度
	 * 同上，只是将弧度转换到了0~360°
	 * @param  {Point} p1 点1
	 * @param  {Point} p2 点2
	 * @return {number}         斜率（角度）
	 */
	export function slopeDegree(p1: Point, p2: Point): number
	{
		let angle: number = slope(p1, p2);
		return (angle > 0 ? angle : (2 * Math.PI + angle)) * 360 / (2 * Math.PI);
	}

	/**
	 * 计算计算p2相对p1的方向，东、南、西、北
	 * 如果设置directionsCount为8，则会返回东北、东南、西南、西北
	 * @param p1 点1
	 * @param p2 点2
	 * @param directionsCount 4方向 或 8方向
	 */
	export function direction(p1: Point, p2: Point, directionsCount: number = 4): DIRECTION
	{
		if (directionsCount != 4 && directionsCount != 8)
			throw new Error('directCount must be 4 / 8');

		let degree: number = slopeDegree(p1, p2);
		let theta = 360 / directionsCount;
		let d: number = DIRECTION.E; // 0度是 East方向
		let step = 8 / directionsCount; // 四方向跳2 八方向跳1
		for (let i: number = 0, m: number = 0 ;i < 360; i+= theta / 2, m++) { //按照平分角度的一半递增
			if (m % 2) d = (d + step) % 8; //进入新的区块则加方向
			if (degree >= i && degree < i + theta / 2) {
				return d;
			}
		}
		return d;
	}

	/**
	 * 计算p2相对p1的方位，上 右 下 左
	 * @param p1 点1
	 * @param p2 点2
	 */
	export function position(p1: Point, p2: Point): POSITION
	{
		let d: number = direction(p1, p2, 4);
		return d / 2;
	}

	export function optional2Points(p1OrX1: Point | number, p2OrY1: Point | number, x2?: number, y2?: number) : Point[]
	{
		if (p1OrX1 instanceof Point != p2OrY1 instanceof Point)
			throw new Error('parameter#0 type must same to parameter#1');

		let p1: Point, p2: Point;
		if (p1OrX1 instanceof Point) {
			p1 = p1OrX1;
			p2 = (p2OrY1! as Point);
		} else {
			p1 = new Point(p1OrX1, p2OrY1 as number);
			p2 = new Point(x2, y2);
		}
		return [p1, p2];
	}

	/**
	 * 计算两点之间的距离
	 * Returns the euclidian distance between the two given set of coordinates.

	 * http://keisan.casio.com/exec/system/1223508685
	 * @method sharp#distance
	 * @param {Point} p1 点1
	 * @param {Point} p2 点2
	 * @return {number}         距离 The distance between the two sets of coordinates.
	 */
	export function distance(p1: Point, p2: Point): number;
	/**
	 * 计算两点之间的距离
	 * Returns the euclidian distance between the two given set of coordinates.

	 * http://keisan.casio.com/exec/system/1223508685
	 * @method sharp#distance
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @return {number}         距离 The distance between the two sets of coordinates.
	 */
	export function distance(x1: number, y1: number, x2: number, y2: number): number;
	export function distance(p1OrX1: Point | number, p2OrY1: Point | number, x2?: number, y2?: number): number
	{
		let [p1, p2] = optional2Points(p1OrX1, p2OrY1, x2, y2);
		return Math.pow(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2), 0.5);
	}

	/**
	 * Returns the euclidean distance squared between the two given set of
	 * coordinates (cuts out a square root operation before returning).
	 *
	 * @method math#distanceSq
	 * @param {Point} p1
	 * @param {Point} p2
	 * @return {number} The distance squared between the two sets of coordinates.
	 */
	export function distanceSq(p1: Point, p2: Point): number;
	/**
	 * Returns the euclidean distance squared between the two given set of
	 * coordinates (cuts out a square root operation before returning).
	 *
	 * @method math#distanceSq
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @return {number} The distance squared between the two sets of coordinates.
	 */
	export function distanceSq(x1: number, y1: number, x2: number, y2: number): number;
	export function distanceSq(p1OrX1: Point | number, p2OrY1: Point | number, x2?: number, y2?: number): number
	{
		let [p1, p2] = optional2Points(p1OrX1, p2OrY1, x2, y2);
		let dx = p1.x - p2.x;
		let dy = p1.y - p2.y;

		return dx * dx + dy * dy;
	}

	/**
	 * Returns the distance between the two given set of coordinates at the power given.
	 *
	 * @method math#distancePow
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} [pow=2]
	 * @return {number} The distance between the two sets of coordinates.
	 */
	export function distancePow(x1: number, y1: number, x2: number, y2: number, pow: number = 2): number
	{
		return Math.sqrt(Math.pow(x2 - x1, pow) + Math.pow(y2 - y1, pow));
	}

	/**
	 * 求直角三角形的斜边
	 * Returns the length of the hypotenuse connecting two segments of given lengths.
	 *
	 * @method math#hypot
	 * @param {number} a 直角边1
	 * @param {number} b 直角边2
	 * @return {number} 斜边 The length of the hypotenuse connecting the given lengths.
	 */
	export function hypot(a: number, b: number): number {
		return Math.sqrt(a * a + b * b);
	}

	/**
	 * 3D坐标系的距离
	 * https://www.mathsisfun.com/algebra/distance-2-points.html
	 * @param {egret3d.Vector3D} p1 3D坐标1
	 * @param {egret3d.Vector3D} p2 3D坐标2
	 * @return {}
	 */
	/*export function distance3D(p1: egret3d.Vector3D, p2: egret3d.Vector3D)
	{
		return Math.pow(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2) + Math.pow(Math.abs(p2.z - p1.z), 2), 0.5);
	} */

	/**
	 * 计算点旋转之后的新坐标
	 * http://keisan.casio.com/exec/system/1223522781
	 * @param  {Point} p 点
	 * @param  {number} rotation     旋转的(弧度)
	 * @return {Point}   新坐标
	 */
	export function rotatedPoint(p: Point, rotation: number): Point
	{
		rotation = -rotation; //下面的公式是逆时针为正，电脑的坐标是顺时针为正，所以需要取反
		return new Point(p.x * Math.cos(rotation) + p.y * Math.sin(rotation), -p.x * Math.sin(rotation) + p.y * Math.cos(rotation));
	}

	/**
	 * Rotates currentAngle towards targetAngle, taking the shortest rotation distance.
	 * The lerp argument is the amount to rotate by in this call.
	 *
	 * @method math#rotateToAngle
	 * @param {number} currentAngle - The current angle, in radians.
	 * @param {number} targetAngle - The target angle to rotate to, in radians.
	 * @param {number} [lerp=0.05] - The lerp value to add to the current angle.
	 * @return {number} The adjusted angle.
	 */
	export function rotateToAngle(currentAngle: number, targetAngle: number, lerp: number = 0.05): number
	{
		if (currentAngle === targetAngle) {
			return currentAngle;
		}

		if (Math.abs(targetAngle - currentAngle) <= lerp || Math.abs(targetAngle - currentAngle) >= (PI2 - lerp)) {
			currentAngle = targetAngle;
		}
		else {
			if (Math.abs(targetAngle - currentAngle) > Math.PI) {
				if (targetAngle < currentAngle) {
					targetAngle += PI2;
				}
				else {
					targetAngle -= PI2;
				}
			}

			if (targetAngle > currentAngle) {
				currentAngle += lerp;
			}
			else if (targetAngle < currentAngle) {
				currentAngle -= lerp;
			}
		}

		return currentAngle;
	}

	/**
	 * Find the angle of a segment from (x1, y1) -> (x2, y2).
	 *
	 * @method math#angleBetween
	 * @param {number} x1 - The x coordinate of the first value.
	 * @param {number} y1 - The y coordinate of the first value.
	 * @param {number} x2 - The x coordinate of the second value.
	 * @param {number} y2 - The y coordinate of the second value.
	 * @return {number} The angle, in radians.
	 */
	export function angleBetween(x1: number, y1: number, x2: number, y2: number): number
	{
		return Math.atan2(y2 - y1, x2 - x1);
	}

	/**
	 * Gets the shortest angle between `angle1` and `angle2`.
	 * Both angles must be in the range -180 to 180, which is the same clamped
	 * range that `sprite.angle` uses, so you can pass in two sprite angles to
	 * this method, and get the shortest angle back between the two of them.
	 *
	 * The angle returned will be in the same range. If the returned angle is
	 * greater than 0 then it's a counter-clockwise rotation, if < 0 then it's
	 * a clockwise rotation.
	 *
	 * @method math#getShortestAngle
	 * @param {number} angle1 - The first angle. In the range -180 to 180.
	 * @param {number} angle2 - The second angle. In the range -180 to 180.
	 * @return {number} The shortest angle, in degrees. If greater than zero it's a counter-clockwise rotation.
	 */
	export function getShortestAngle(angle1: number, angle2: number): number
	{
		let difference: number = angle2 - angle1;

		if (difference === 0) {
			return 0;
		}

		let times: number = Math.floor((difference - (-180)) / 360);

		return difference - (times * 360);

	}

	/**
	 * Find the angle of a segment from (x1, y1) -> (x2, y2).
	 *
	 * The difference between this method and Math.angleBetween is that this assumes the y coordinate travels
	 * down the screen.
	 *
	 * @method math#angleBetweenY
	 * @param {number} x1 - The x coordinate of the first value.
	 * @param {number} y1 - The y coordinate of the first value.
	 * @param {number} x2 - The x coordinate of the second value.
	 * @param {number} y2 - The y coordinate of the second value.
	 * @return {number} The angle, in radians.
	 */
	export function angleBetweenY(x1: number, y1: number, x2: number, y2: number): number
	{
		return Math.atan2(x2 - x1, y2 - y1);
	}

	/**
	 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
	 * @method math#angleBetweenPointsY
	 * @param {sharp.Point} point1
	 * @param {sharp.Point} point2
	 * @return {number} The angle, in radians.
	 */
	export function angleBetweenPointsY(point1: sharp.Point, point2: sharp.Point): number
	{

		return Math.atan2(point2.x - point1.x, point2.y - point1.y);

	}

	/**
	 * Reverses an angle.
	 * @method math#reverseAngle
	 * @param {number} angleRad - The angle to reverse, in radians.
	 * @return {number} The reverse angle, in radians.
	 */
	export function reverseAngle(angleRad: number): number
	{

		return normalizeAngle(angleRad + Math.PI);
	}

	/**
	 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
	 *
	 * @method math#angleBetweenPoints
	 * @param {sharp.Point} point1 - The first point.
	 * @param {sharp.Point} point2 - The second point.
	 * @return {number} The angle between the two points, in radians.
	 */
	export function angleBetweenPoints(point1: sharp.Point, point2: sharp.Point): number
	{
		return Math.atan2(point2.y - point1.y, point2.x - point1.x);
	}

	/**
	 * Normalizes an angle to the [0,2pi) range.
	 * @method math#normalizeAngle
	 * @param {number} angleRad - The angle to normalize, in radians.
	 * @return {number} The angle, fit within the [0,2pi] range, in radians.
	 */
	export function normalizeAngle(angleRad: number): number
	{
		angleRad = angleRad % (2 * Math.PI);
		return angleRad >= 0 ? angleRad : angleRad + 2 * Math.PI;
	}

	/**
	 * Keeps an angle value between -180 and +180; or -PI and PI if radians.
	 *
	 * @method math#wrapAngle
	 * @param {number} angle - The angle value to wrap
	 * @param {boolean} [isRadians=false] - Set to `true` if the angle is given in radians, otherwise degrees is expected.
	 * @return {number} The new angle value; will be the same as the input angle if it was within bounds.
	 */
	export function wrapAngle(angle: number, isRadians: boolean = false): number
	{

		return isRadians ? math.wrap(angle, -Math.PI, Math.PI) : math.wrap(angle, -180, 180);

	}

	/**
	 * 计算圆上面的某点
	 * @param {Point} circlePos 圆心
	 * @param {number} radius 半径
	 * @param {number} angle 弧度，从数学 正x坐标开始 顺时针的弧度
	 */
	export function circlePoint(circlePos: Point, radius: number, angle: number): Point
	{
		return new Point(circlePos.x + Math.cos(angle) * radius, circlePos.y + Math.sin(angle) * radius);
	}

	/**
	 * 计算「点」与「点」是否相同
	 * @param  {Point} p1 [description]
	 * @param  {Point} p2 [description]
	 * @return {boolean}
	 */
	export function pointHitPoint(p1: Point, p2: Point): boolean
	{
		return p1.equals(p2);
	}

	/**
	 * 测试「点」是否在「圆」中
	 * http://www.jeffreythompson.org/collision-detection/point-circle.php
	 * @param  {Point} p         待测试的点
	 * @param  {Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @return {boolean}
	 */
	export function pointHitCircle(p: Point, circlePos: Point, radius: number): boolean
	{
		let distX: number = p.x - circlePos.x;
		let distY: number = p.y - circlePos.y;
		let distance: number = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the circle's
		// radius the point is inside!
		return distance <= radius;
	}

	/**
	 * 测试「点」是否在「圆」中
	 * 同上
	 * @param  {Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @param  {Point} p         待测试的点
	 * @return {boolean}
	 */
	export function circleHitPoint(circlePos: Point, radius: number, p: Point): boolean
	{
		return pointHitCircle(p, circlePos, radius);
	}

	/**
	 * 测试「点」是否在「矩形」中
	 * http://www.jeffreythompson.org/collision-detection/point-rect.php
	 * @param  {Point}     p    待测试的点
	 * @param  {Rectangle} rect 待测试的矩形
	 * @return {boolean}
	 */
	export function pointHitRect(p: Point, rect: Rectangle): boolean
	{
		return p.x >= rect.left && // right of the left edge AND
			p.x <= rect.right &&   // left of the right edge AND
			p.y >= rect.top &&     // below the top AND
			p.y <= rect.bottom;    // above the bottom
	}

	/**
	 * 测试「点」是否在「矩形」中
	 * 同上
	 * @param  {Rectangle} rect 待测试的矩形
	 * @param  {Point}     p    待测试的点
	 * @return {boolean}
	 */
	export function rectHitPoint(rect: Rectangle, p: Point): boolean
	{
		return pointHitRect(p, rect);
	}

	/**
	 * 测试两「矩形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/rect-rect.php
	 * @param  {Rectangle} rect1 待测试的矩形1
	 * @param  {Rectangle} rect2 待测试的矩形2
	 * @return {boolean}
	 */
	export function rectHitRect(rect1: Rectangle, rect2: Rectangle): boolean
	{
		return rect1.right >= rect2.left && // r1 right edge past r2 left
			rect1.left <= rect2.right &&    // r1 left edge past r2 right
			rect1.bottom >= rect2.top &&    // r1 bottom edge past r2 top
			rect1.top <= rect2.bottom;      // r1 top edge past r2 bottom
	}

	/**
	 * 测试两「圆」是否相交
	 * http://www.jeffreythompson.org/collision-detection/circle-circle.php
	 * @param  {Point} circlePos1 圆1圆心
	 * @param  {number}      radius1    圆1半径
	 * @param  {Point} circlePos2 圆2圆心
	 * @param  {number}      radius2    圆2半径
	 * @return {boolean}
	 */
	export function circleHitCircle(circlePos1: Point, radius1: number, circlePos2: Point, radius2: number): boolean
	{
		let distX: number = circlePos1.x - circlePos2.x;
		let distY: number = circlePos1.y - circlePos2.y;
		let distance: number = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the sum of the circle's
		// radii, the circles are touching!
		return distance <= radius1 + radius2;
	}

	/**
	 * 测试「圆」与「矩形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/circle-rect.php
	 * @param  {Point}     circlePos 圆心
	 * @param  {number}          radius    半径
	 * @param  {Rectangle} rect      矩形
	 * @return {boolean}
	 */
	export function circleHitRect(circlePos: Point, radius: number, rect: Rectangle): boolean
	{
		// temporary letiables to set edges for testing
		let testX: number = circlePos.x;
		let testY: number = circlePos.y;

		// which edge is closest?
		if (circlePos.x < rect.left)        testX = rect.left;      // test left edge
		else if (circlePos.x > rect.right)  testX = rect.right;   // right edge
		if (circlePos.y < rect.top)         testY = rect.top;      // top edge
		else if (circlePos.y > rect.bottom) testY = rect.bottom;   // bottom edge

		// get distance from closest edges
		let distX: number = circlePos.x - testX;
		let distY: number = circlePos.y - testY;
		let distance: number = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the radius, collision!
		return distance <= radius;
	}

	/**
	 * 测试「圆」与「矩形」是否相交
	 * 同上
	 * @param  {Rectangle} rect      矩形
	 * @param  {Point}     circlePos 圆心
	 * @param  {number}          radius    半径
	 * @return {boolean}
	 */
	export function rectHitCircle(rect: Rectangle, circlePos: Point, radius: number): boolean
	{
		return circleHitRect(circlePos, radius, rect);
	}

	/**
	 * 测试「点」是否在「线」中
	 * http://www.jeffreythompson.org/collision-detection/line-point.php
	 * @param  {Point} p        待测试点
	 * @param  {Point} linePos1 线起始点
	 * @param  {Point} linePos2 线结束点
	 * @return {boolean}
	 */
	export function pointHitLine(p: Point, linePos1: Point, linePos2: Point): boolean
	{
		// get distance from the point to the two ends of the line
		let d1: number = distance(p, linePos1);
		let d2: number = distance(p, linePos2);

		// get the length of the line
		let lineLen: number = distance(linePos1, linePos2);

		// since floats are so minutely accurate, add
		// a little buffer zone that will give collision
		let buffer: number = 0.1;    // higher # = less accurate

		// if the two distances are equal to the line's
		// length, the point is on the line!
		// note we use the buffer here to give a range,
		// rather than one #
		return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
	}

	/**
	 * 测试「点」是否在「线」中
	 * 同上
	 * @param  {Point} linePos1 线起始点
	 * @param  {Point} linePos2 线结束点
	 * @param  {Point} p        待测试点
	 * @return {boolean}
	 */
	export function lineHitPoint(linePos1: Point, linePos2: Point, p: Point): boolean
	{
		return pointHitLine(p, linePos1, linePos2);
	}

	/**
	 * 返回「点」与「线」垂直相交的那个「点」，没有则返回false
	 * @param  {Point} p        待测试点
	 * @param  {Point} linePos1 线起始点
	 * @param  {Point} linePos2 线结束点
	 * @return {Point/boolean}
	 */
	export function pointLineClosest(p: Point, linePos1: Point, linePos2: Point): Point|boolean
	{
		// get length of the line
		let distX: number = linePos1.x - linePos2.x;
		let distY: number = linePos1.y - linePos2.y;
		let len: number = Math.sqrt( (distX * distX) + (distY * distY) );
		// get dot product of the line and point
		let dot: number = ( ((p.x - linePos1.x) * (linePos2.x - linePos1.x)) + ((p.y - linePos1.y) * (linePos2.y - linePos1.y)) ) / Math.pow(len, 2);

		// find the closest point on the line
		let closestX: number = linePos1.x + (dot * (linePos2.x - linePos1.x));
		let closestY: number = linePos1.y + (dot * (linePos2.y - linePos1.y));

		// is this point actually on the line segment?
		// if so keep going, but if not, return false
		let onSegment: boolean = lineHitPoint(linePos1, linePos2, new Point(closestX, closestY));

		return onSegment ? new Point(closestX, closestY) : false;
	}

	/**
	 * 测试「线」与「圆」是否相交
	 * http://www.jeffreythompson.org/collision-detection/line-circle.php
	 * @param  {Point} linePos1  线起始点
	 * @param  {Point} linePos2  线结束点
	 * @param  {Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @return {boolean}
	 */
	export function lineHitCircle(linePos1: Point, linePos2: Point, circlePos: Point, radius: number): boolean
	{
		// is either end INSIDE the circle?
		// if so, return true immediately
		let inside1: boolean = pointHitCircle(linePos1, circlePos, radius);
		let inside2: boolean = pointHitCircle(linePos2, circlePos, radius);
		if (inside1 || inside2) return true;

		let closest: any = pointLineClosest(circlePos, linePos1, linePos2);
		if (closest === false) return false;

		// get distance to closest point
		let distX: number = closest.x - circlePos.x;
		let distY: number = closest.y - circlePos.y;
		let distance = Math.sqrt( (distX * distX) + (distY * distY) );

		return distance <= radius;
	}

	/**
	 * 测试「线」与「圆」是否相交
	 * 同上
	 * @param  {Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @param  {Point} linePos1  线起始点
	 * @param  {Point} linePos2  线结束点
	 * @return {boolean}               [description]
	 */
	export function circleHitLine(circlePos: Point, radius: number, linePos1: Point, linePos2: Point): boolean
	{
		return lineHitCircle(linePos1, linePos2, circlePos, radius);
	}

	/**
	 * 获取两「线」相交的「交点」，无交点返回false
	 * @param  {Point} line1Pos1 线1起始点
	 * @param  {Point} line1Pos2 线1结束点
	 * @param  {Point} line2Pos1 线2起始点
	 * @param  {Point} line2Pos2 线2结束点
	 * @return {Point/boolean}
	 */
	export function lineLineIntersection(line1Pos1: Point, line1Pos2: Point, line2Pos1: Point, line2Pos2: Point, asSegment: boolean = true): Point|boolean
	{
		let a: Point = line1Pos1, b: Point = line1Pos2, e: Point = line2Pos1, f: Point = line2Pos2;

		let a1: number = b.y - a.y;
		let a2: number = f.y - e.y;
		let b1: number = a.x - b.x;
		let b2: number = e.x - f.x;
		let c1: number = (b.x * a.y) - (a.x * b.y);
		let c2: number = (f.x * e.y) - (e.x * f.y);
		let denom: number = (a1 * b2) - (a2 * b1); //分母
		let result = new Point();

		if (denom === 0)
			return false;

		result.x = ((b1 * c2) - (b2 * c1)) / denom;
		result.y = ((a2 * c1) - (a1 * c2)) / denom;

		if (asSegment)
		{
			let uC: number = (f.y - e.y) * (b.x - a.x) - (f.x - e.x) * (b.y - a.y);
			let uA: number = ((f.x - e.x) * (a.y - e.y) - (f.y - e.y) * (a.x - e.x)) / uC;
			let uB: number = ((b.x - a.x) * (a.y - e.y) - (b.y - a.y) * (a.x - e.x)) / uC;

			// collision?
			if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
				return result;
			else
				return false;
		}
		return result;
	}

	/**
	 * 测试两「线」是否相交
	 * http://www.jeffreythompson.org/collision-detection/line-line.php
	 * @param  {Point} line1Pos1 线1起始点
	 * @param  {Point} line1Pos2 线1结束点
	 * @param  {Point} line2Pos1 线2起始点
	 * @param  {Point} line2Pos2 线2结束点
	 * @return {boolean}
	 */
	export function lineHitLine(line1Pos1: Point, line1Pos2: Point, line2Pos1: Point, line2Pos2: Point): boolean
	{
		let r: any = lineLineIntersection(line1Pos1, line1Pos2, line2Pos1, line2Pos2);
		return r !== false;
	}

	/**
	 * 测试「线」与「矩形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/line-rect.php
	 * @param  {Point}     linePos1 线起始点
	 * @param  {Point}     linePos2 线结束点
	 * @param  {Rectangle} rect     矩形
	 * @return {boolean}                  [description]
	 */
	export function lineHitRect(linePos1: Point, linePos2: Point, rect: Rectangle): boolean
	{
		let p1: Point = linePos1, p2: Point = linePos2;
		let left: boolean = lineHitLine(p1, p2, new Point(rect.left, rect.top), new Point(rect.left, rect.bottom));
		let right: boolean = lineHitLine(p1, p2, new Point(rect.right, rect.top), new Point(rect.right, rect.bottom));
		let top: boolean = lineHitLine(p1, p2, new Point(rect.left, rect.top), new Point(rect.right , rect.top));
		let bottom: boolean = lineHitLine(p1, p2, new Point(rect.left, rect.bottom), new Point(rect.right, rect.bottom));

		// collision?
		return left || right || top || bottom;
	}

	/**
	 * 测试「线」与「矩形」是否相交
	 * 同上
	 * @param  {Rectangle} rect     矩形
	 * @param  {Point}     linePos1 线起始点
	 * @param  {Point}     linePos2 线结束点
	 * @return {boolean}                  [description]
	 */
	export function rectHitLine(rect: Rectangle, linePos1: Point, linePos2: Point): boolean
	{
		return lineHitRect(linePos1, linePos2, rect);
	}

	/**
	 * 测试「点」是否在「多边形」中
	 * http://www.jeffreythompson.org/collision-detection/poly-point.php
	 * @param  {Point}        p        待测试点
	 * @param  {Array<Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function pointHitPolygon(p: Point, vertices:Array<Point>): boolean
	{
		let collision: boolean = false;

		// go through each of the vertices, plus
		// the next vertex in the list
		let next: number = 0;
		for (let current: number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc: Point = vertices[current];    // c for "current"
			let vn: Point = vertices[next];       // n for "next"

			// compare position, flip 'collision' letiable
			// back and forth
			if (((vc.y > p.y && vn.y < p.y) || (vc.y < p.y && vn.y > p.y)) &&
				(p.x < (vn.x - vc.x) * (p.y-vc.y) / (vn.y - vc.y) + vc.x)) {
			 		collision = !collision;
			}
		}
		return collision;
	}

	/**
	 * 测试「点」是否在「多边形」中
	 * 同上
	 * @param  {Array<Point>} vertices 多边形各个顶点的数组
	 * @param  {Point}        p        待测试点
	 * @return {boolean}
	 */
	export function polygonHitPoint(vertices:Array<Point>, p: Point): boolean
	{
		return pointHitPolygon(p, vertices);
	}

	/**
	 * 测试「圆」与「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-circle.php
	 * @param  {Point}        circlePos 圆心
	 * @param  {number}             radius    半径
	 * @param  {Array<Point>} vertices  多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function circleHitPolygon(circlePos: Point, radius: number, vertices:Array<Point>): boolean
	{
		// go through each of the vertices, plus
		// the next vertex in the list
		let next: number = 0;
		for (let current: number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc: Point = vertices[current];    // c for "current"
			let vn: Point = vertices[next];       // n for "next"

			// check for collision between the circle and
			// a line formed between the two vertices
			let collision: boolean = lineHitCircle(vc, vn, circlePos, radius);
			if (collision) return true;
		}

		// the above algorithm only checks if the circle
		// is touching the edges of the polygon – in most
		// cases this is enough, but you can un-comment the
		// following code to also test if the center of the
		// circle is inside the polygon

		// boolean centerInside = polygonPoint(vertices, cx,cy);
		// if (centerInside) return true;

		// otherwise, after all that, return false
		return false;
	}

	/**
	 * 测试「圆」与「多边形」是否相交
	 * 同上
	 * @param  {Array<Point>} vertices  多边形各个顶点的数组
	 * @param  {Point}        circlePos 圆心
	 * @param  {number}             radius    半径
	 * @return {boolean}
	 */
	export function polygonHitCircle(vertices:Array<Point>, circlePos: Point, radius: number): boolean
	{
		return circleHitPolygon(circlePos, radius, vertices);
	}

	/**
	 * 测试「矩形」与「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-rect.php
	 * @param  {Rectangle}    rect     矩形
	 * @param  {Array<Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function rectHitPolygon(rect: Rectangle, vertices:Array<Point>): boolean
	{
		// go through each of the vertices, plus the next
		// vertex in the list
		let next: number = 0;
		for (let current: number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc: Point = vertices[current];    // c for "current"
			let vn: Point = vertices[next];       // n for "next"

			// check against all four sides of the rectangle
			let collision: boolean = lineHitRect(vc, vn, rect);
			if (collision) return true;

			// optional: test if the rectangle is INSIDE the polygon
			// note that this iterates all sides of the polygon
			// again, so only use this if you need to
			let inside: boolean = polygonHitPoint(vertices, rect.topLeft);
			if (inside) return true;
		}
		return false;
	}

	/**
	 * 测试「矩形」与「多边形」是否相交
	 * 同上
	 * @param  {Array<Point>} vertices 多边形各个顶点的数组
	 * @param  {Rectangle}    rect     矩形
	 * @return {boolean}
	 */
	export function polygonHitRect(vertices:Array<Point>, rect: Rectangle): boolean
	{
		return rectHitPolygon(rect, vertices);
	}

	/**
	 * 测试「线」与「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-line.php
	 * @param  {Point}        linePos1 线起始点
	 * @param  {Point}        linePos2 线结束点
	 * @param  {Array<Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function lineHitPolygon(linePos1: Point, linePos2: Point, vertices:Array<Point>): boolean
	{
		// go through each of the vertices, plus the next
		// vertex in the list
		let next: number = 0;
		for (let current: number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc: Point = vertices[current];    // c for "current"
			let vn: Point = vertices[next];       // n for "next"

			// do a Line/Line comparison
			// if true, return 'true' immediately and
			// stop testing (faster)
			let hit: boolean = lineHitLine(linePos1, linePos2, vc, vn);
			if (hit) return true;
		}

		// never got a hit
		return false;
	}

	/**
	 * 测试「线」与「多边形」是否相交
	 * @param  {Array<Point>} vertices 多边形各个顶点的数组
	 * @param  {Point}        linePos1 线起始点
	 * @param  {Point}        linePos2 线结束点
	 * @return {boolean}
	 */
	export function polygonHitLine(vertices:Array<Point>, linePos1: Point, linePos2: Point): boolean
	{
		return lineHitPolygon(linePos1, linePos2, vertices);
	}

	/**
	 * 测试两「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-poly.php
	 * @param  {Array<Point>} vertices1 多边形1各个顶点的数组
	 * @param  {Array<Point>} vertices2 多边形2各个顶点的数组
	 * @return {boolean}
	 */
	export function polygonHitPolygon(vertices1:Array<Point>, vertices2:Array<Point>): boolean
	{
		// go through each of the vertices, plus the next
		// vertex in the list
		let next: number = 0;
		for (let current: number = 0; current < vertices1.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices1.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc: Point = vertices1[current];    // c for "current"
			let vn: Point = vertices1[next];       // n for "next"

			// now we can use these two points (a line) to compare
			// to the other polygon's vertices using polyLine()
			let collision: boolean = polygonHitLine(vertices2, vc, vn);
			if (collision) return true;

			// optional: check if the 2nd polygon is INSIDE the first
			collision = polygonHitPoint(vertices1, vertices2[0]);
			if (collision) return true;
		}

		return false;
	}

	/**
	 * 测试「点」是否在「三角形」中
	 * http://www.jeffreythompson.org/collision-detection/tri-point.php
	 * @param  {Point}        p        待测试点
	 * @param  {Array<Point>} vertices 三角形各个顶点的数组
	 * @return {boolean}
	 */
	export function pointHitTriangle(p: Point, vertices:Array<Point>): boolean
	{
		let x1: number = vertices[1].x, x2: number = vertices[2].x, x3: number = vertices[3].x;
		let y1: number = vertices[1].y, y2: number = vertices[2].y, y3: number = vertices[3].y;
		// get the area of the triangle
		let areaOrig: number = Math.abs( (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1) );

		// get the area of 3 triangles made between the point
		// and the corners of the triangle
		let area1: number = Math.abs( (x1 - p.x) * (y2 - p.y) - (x2 - p.x) * (y1 - p.y) );
		let area2: number = Math.abs( (x2 - p.x) * (y3 - p.y) - (x3 - p.x) * (y2 - p.y) );
		let area3: number = Math.abs( (x3 - p.x) * (y1 - p.y) - (x1 - p.x) * (y3 - p.y) );

		// if the sum of the three areas equals the original,
		// we're inside the triangle!
		return area1 + area2 + area3 == areaOrig;
	}

	/**
	 * 测试「点」是否在「三角形」中
	 * 同上
	 * @param  {Array<Point>} vertices 三角形各个顶点的数组
	 * @param  {Point}        p        待测试点
	 * @return {boolean}
	 */
	export function triangleHitPoint(vertices:Array<Point>, p: Point): boolean
	{
		return pointHitTriangle(p, vertices);
	};
}
