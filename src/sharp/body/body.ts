namespace sharp {
	import Vector = Point;

	export interface BodyExtraOptions {

		/**
		 * 刚性复合体的零件刚体合集
		 * 第0个刚体指向复合体实例
		 * parts中所有的零件刚体组成了复合体，零件允许重叠、空隙、或孔，甚至形成凹面体
		 * 对于复合体内的零件，不能将入World，而是在World中只加入复合体（也就是零件们的父刚体）
		 * 使用Body.setParts设置，不要单独设置
		 */
		parts?: Body[];
		/**
		 * 旋转角度，单位：弧度 [0]
		 * 如果在渲染过程中改变这个值，会造成刚体旋转，如果不希望旋转，使用Body.setAngle赋值
		 */
		angle?: number;
		/**
		 * 顶点合集
		 * 不支持凹面多边形
		 * 这个会自动计算inertia/bounds
		 * 使用Body.setVertices设置
		 */
		vertices: Vertices;
		/**
		 * 质点坐标
		 */
		position: Point;
		/**
		 * 瞬时速度 [x: 0, y: 0]
		 */
		velocity?: Vector;
		/**
		 * 半径
		 * 如果是圆，传递这个参数
		 */
		circleRadius?: number | null;
		/**
		 * 施加的扭矩(旋转力) [0]
		 * Body.update之后清零
		 */
		torque?: number;
		/**
		 * 惯性矩(即面积的二次矩)
		 * 可以自动根据vertices和density计算得到
		 * 如果修改此值，则必须修改 inverseInertia = 1 / inertia
		 */
		inertia?: number;
		/**
		 * 质量
		 * 最好使用density来自动计算质量
		 * 如果修改此值，则必须修改 inverseMass = 1 / mass
		 */
		mass?: number;
		/**
		 * 是否传感器刚体 [false]
		 * 当传感器发生碰撞时，不发生反应
		 */
		isSensor?: boolean;
		/**
		 * 静态刚体 [false]
		 * 静态的刚体永远不会改变位置或角度，并且是完全固定的
		 * 使用Body.setStatic切换状态
		 */
		isStatic?: boolean;
		/**
		 * 是否可以睡眠 [false]
		 * 修改这个属性并不能立即进入睡眠，如果需要，请使用Sleeping.set立即进入睡眠状态
		 * 只读
		 */
		isSleeping?: boolean;
		/**
		 * 睡眠阈值，[60]次
		 * 刚体接近0速度时，引擎更新了多少次之后，超过阈值则进入睡眠
		 */
		sleepThreshold?: number;
		/**
		 * 密度 [0.001]
		 * 如果设置，则mass会根据面积自动计算，这比单纯设置质量会更好
		 */
		density?: number;
		/**
		 * 弹性系数 (0, 1) [0]
		 * 0 表示碰撞时，完全无弹性，0.8意味着反弹80%的功能
		 * 相撞时取最大值 max(a.restitution, b.restitution)
		 */
		restitution?: number;
		/**
		 * 摩擦系数 (0, 1) [0.1]
		 * 0 表示可以无限滑动，1 表示可能在施加力之后立即停止滑动
		 * 这个值的影响不是线性的，值越高，得到的结果会不稳定。
		 * 还取决于空气摩擦、库伦摩擦（Coulomb friction model）
		 * 相撞时取最小值 min(a.restitution, b.restitution)
		 */
		friction?: number;
		/**
		 * 静态摩擦系数 (0, ∞) [0.5]
		 * 基于库仑摩擦模型（Coulomb friction model），0 表示当它接近静止时，没有摩擦力（包括friction都不考虑）；只有运行的时候，才使用friction这个值
		 * 值越高，在接近静止时，所需要的力越大。起步时 摩擦力 = frictionStatic * friction （运动时计算frictionAir和friction）
		 */
		frictionStatic?: number;
		/**
		 * 空气摩擦系数 (0, ∞) [0.01]
		 * 空气阻力，0 表示在空中移动速度不会降低（真空一样）
		 * 该值的影响是非线性的
		 */
		frictionAir?: number;
		/**
		 * 碰撞参数
		 *
		 */
		collisionFilter?: options.CollisionFilterOptions;
		/**
		 * 允许两个刚体堆砌重合多少距离，或者是碰撞旋转时允许重合距离 [0.05]
		 * 除非你足够了解slop引擎的目的，不然使用默认值比较好
		 * 对于大刚体（复合体），可能需要更大的值来位置堆叠
		 */
		slop?: number;
		/**
		 * 时间缩放率，比如慢动作常用，[1]
		 * 单独设置的时候，这个刚体的时间缩放是独立的
		 */
		timeScale?: number;
		/**
		 * 渲染参数
		 */
		render?: options.RenderOptions;
	}

	export interface BodyOptions extends options.Options, BodyExtraOptions {

	}
	/**
	 * 刚体类
	 */
	export class Body extends Container {
		protected options: BodyOptions;
		/**
		 * 初始角度，默认等于angle
		 */
		protected _anglePrev: number = 0;
		/**
		 * 面积
		 */
		protected _area: number = 0;
		/**
		 * AABB区域
		 */
		protected _bounds: Bounds = new Bounds();
		/**
		 * 用于碰撞检测的唯一轴坐标集合（边缘法线）
		 */
		protected _axes: Axes = new Axes();
		/**
		 * 初始质点坐标，默认等于position
		 */
		protected _positionPrev: Point = new Point;
		/**
		 * 施加的力向量，[x: 0, y: 0]
		 */
		protected _force: Vector = new Vector;
		/**
		 * 反惯性矩，即 1 / inertia
		 */
		protected _inverseInertia: number = 0;
		/**
		 * 反质量，即 1 / mass
		 */
		protected _inverseMass: number = 0;
		/**
		 * [x: 0, y: 0]
		 */
		protected _positionImpulse: Vector = new Vector;
		/**
		 * 约束脉冲 [x: 0, y: 0, angle: 0]
		 */
		protected _constraintImpulse: Ray = new Ray();
		protected _totalContacts: number = 0;
		/**
		 * 瞬时速度 [0]
		 */
		protected _speed: number = 0;
		/**
		 * 瞬时角速度 [0]
		 */
		protected _angularSpeed: number = 0;
		/**
		 * 瞬时角速度 [0]
		 */
		protected _angularVelocity: number = 0;
		/**
		 * 移动量的组合(speed和angularSpeed) [0]
		 */
		protected _motion: number;

		public _original: any;
		public sleepCounter: number = 0;


		protected static _nextCollidingGroupId: number = 1;
		protected static _nextNonCollidingGroupId: number = -1;
		protected static _nextCategory: number = 0x0001;
		protected static _inertiaScale: number = 4;

		constructor(options: BodyOptions)
		{
			super();
			this.options = object.extend(this.defaultOptions(), options);

			this._initProperties(options);
		}

		/**
		 * 父级刚体，如果不是复合体，则parent等于自己
		 */
		public get parent(): Body {
			return this.options.parent!;
		}

		public set parent(value: Body) {
			this.options.parent = value;
		}

		/**
		 * 刚性复合体的刚体合集
		 *
		 * 如果是普通刚体，只有一个值，指向自己。如果是刚性复合体，第0个刚体指向自己，之后的是其它刚体
		 * parts中所有的零件刚体组成了整个刚性复合体，零件允许重叠、空隙、或孔，甚至形成凹面体
		 * 对于刚性复合体内的零件刚体，不能单独加入World
		 * 使用Body.setParts设置
		 */
		public get parts(): Body[] {
			return this.options.parts!;
		}

		public set parts(value: Body[]) {
			this.options.parts = value.length > 0 ? value : [this];
		}

		/**
		 * 旋转角度，单位：弧度 [0]
		 * 如果在渲染过程中改变这个值，会造成刚体旋转，如果不希望旋转，使用Body.setAngle
		 */
		public get angle(): number {
			return this.options.angle!;
		}

		public set angle(value: number) {
			this.options.angle = value;
		}

		/**
		 * 初始角度，默认等于angle
		 * 如果不等于angle，受力之后，会导致刚体旋转
		 */
		public get anglePrev(): number {
			return this._anglePrev!;
		}

		public set anglePrev(value: number) {
			this._anglePrev = value;
		}

		/**
		 * 面积
		 * 自动根据vertices计算
		 * 只读
		 */
		public get area(): number {
			return this._area!;
		}

		public set area(value: number) {
			this._area = value;
		}

		/**
		 * AABB区域
		 * 自动根据vertices计算
		 * Body.update中不断更新
		 * 只读
		 */
		public get bounds(): Bounds {
			return this._bounds!;
		}

		public set bounds(value: Bounds) {
			this._bounds = value;
		}

		/**
		 * 用于碰撞检测的唯一轴坐标集合（边缘法线）
		 * 自动根据vertices计算
		 */
		public get axes(): Axes {
			return this._axes!;
		}

		public set axes(value: Axes) {
			this._axes = value;
		}

		/**
		 * 顶点合集
		 * 不支持凹面多边形
		 * 这个会自动计算inertia/bounds
		 * 使用Body.setVertices设置
		 */
		public get vertices(): Vertices {
			return this.options.vertices;
		}

		public set vertices(value: Vertices) {
			this.options.vertices = value;
		}

		/**
		 * 质点坐标
		 */
		public get position(): Point {
			return this.options.position;
		}

		public set position(value: Point) {
			this.options.position = value;
		}

		/**
		 * 初始质点坐标，默认等于position
		 * 如果在渲染时改变position，会导致惯性、摩擦力等特征触发，如果不希望触发，使用Body.setPostion
		 */
		public get positionPrev(): Point {
			return this._positionPrev!;
		}

		public set positionPrev(value: Point) {
			this._positionPrev = value;
		}

		/**
		 * 半径
		 * 如果是圆，传递这个参数
		 */
		public get circleRadius(): number | null {
			return this.options.circleRadius!;
		}

		public set circleRadius(value: number | null) {
			this.options.circleRadius = value;
		}

		/**
		 * 施加的力向量，[x: 0, y: 0]
		 * 使用Body.applyForce设置
		 * 在Body.update之后清零
		 */
		public get force(): Vector {
			return this._force!;
		}

		public set force(value: Vector) {
			this._force = value;
		}

		/**
		 * 施加的扭矩(旋转力) [0]
		 * Body.update之后清零
		 */
		public get torque(): number {
			return this.options.torque!;
		}

		public set torque(value: number) {
			this.options.torque = value;
		}

		/**
		 * 惯性矩(即面积的二次矩)
		 * 可以自动根据vertices和density计算得到
		 * 初始赋值此值，则必须赋值 inverseInertia = 1 / inertia
		 */
		public get inertia(): number {
			return this.options.inertia!;
		}

		public set inertia(value: number) {
			this.options.inertia = value;
		}

		/**
		 * 反惯性矩，即 1 / inertia
		 * 初始赋值此值，也需要赋值inertia
		 * 使用setInertia设置
		 */
		public get inverseInertia(): number {
			return this._inverseInertia!;
		}

		public set inverseInertia(value: number) {
			this._inverseInertia = value;
		}

		/**
		 * 质量
		 * 最好使用density来自动计算质量
		 * 如果修改此值，则必须修改 inverseMass = 1 / mass
		 * 使用Body.setMass设置
		 */
		public get mass(): number {
			return this.options.mass!;
		}

		public set mass(value: number) {
			this.options.mass = value;
		}

		/**
		 * 反质量，即 1 / mass
		 * 修改此值，则必须修改mass
		 */
		public get inverseMass(): number {
			return this._inverseMass!;
		}

		public set inverseMass(value: number) {
			this._inverseMass = value;
		}

		/**
		 * [x: 0, y: 0]
		 */
		public get positionImpulse(): Vector {
			return this._positionImpulse!;
		}

		public set positionImpulse(value: Vector) {
			this._positionImpulse = value;
		}

		/**
		 * 约束脉冲 [x: 0, y: 0, angle: 0]
		 */
		public get constraintImpulse(): Ray {
			return this._constraintImpulse!;
		}

		public set constraintImpulse(value: Ray) {
			this._constraintImpulse = value;
		}

		/**
		 * [0]
		 */
		public get totalContacts(): number {
			return this._totalContacts!;
		}

		public set totalContacts(value: number) {
			this._totalContacts = value;
		}

		/**
		 * 瞬时速度 [0]
		 * 与velocity的区别在于，这个是velocity向量的斜边长度
		 * 最后一次执行 Body.update 之后值
		 * 只读
		 */
		public get speed(): number {
			return this._speed!;
		}

		public set speed(value: number) {
			this._speed = value;
		}

		/**
		 * 瞬时角速度 [0]
		 * 最后一次执行 Body.update 之后值
		 * 与angularVelocity的区别是，这个永远为正
		 * 只读
		 */
		public get angularSpeed(): number {
			return this._angularSpeed!;
		}

		public set angularSpeed(value: number) {
			this._angularSpeed = value;
		}

		/**
		 * 瞬时速度，速度向量 [x: 0, y: 0]
		 * 最后一次执行 Body.update 之后值
		 * 如果你需要修改速度，应该是applyForce，或改变postion
		 * 只读
		 * 使用Body.setVelocity赋值
		 */
		public get velocity(): Vector {
			return this.options.velocity!;
		}

		public set velocity(value: Vector) {
			this.options.velocity = value;
		}

		/**
		 * 瞬时角速度 [0]
		 * 最后一次执行 Body.update 之后值
		 * 如果你需要改变刚体角速度，需要设置torque或angle
		 * 只读
		 * 使用Body.setAngularVelocity赋值
		 */
		public get angularVelocity(): number {
			return this._angularVelocity!;
		}

		public set angularVelocity(value: number) {
			this._angularVelocity = value;
		}

		/**
		 * 是否传感器刚体 [false]
		 * 当传感器发生碰撞时，不发生反应
		 */
		public get isSensor(): boolean {
			return this.options.isSensor!;
		}

		public set isSensor(value: boolean) {
			this.options.isSensor = value;
		}

		/**
		 * 静态刚体 [false]
		 * 静态的刚体永远不会改变位置或角度，并且是完全固定的
		 * 使用Body.setStatic切换状态
		 */
		public get isStatic(): boolean {
			return this.options.isStatic!;
		}

		public set isStatic(value: boolean) {
			this.options.isStatic = value;
		}

		/**
		 * 是否可以睡眠 [false]
		 * 修改这个属性并不能立即进入睡眠，
		 * 如果需要，使用Body.setSleeping立即进入睡眠状态
		 * 只读
		 */
		public get isSleeping(): boolean {
			return this.options.isSleeping!;
		}

		public set isSleeping(value: boolean) {
			this.options.isSleeping = value;
		}

		/**
		 * 移动量的组合(speed和angularSpeed) [0]
		 * 与Sleeping属性配合，在场景中计算刚体是否已经休眠
		 * 只读
		 */
		public get motion(): number {
			return this._motion!;
		}

		public set motion(value: number) {
			this._motion = value;
		}

		/**
		 * 睡眠阈值，[60]次
		 * 刚体接近静止时，引擎更新了多少次(阈值)之后仍然静止，则进入睡眠
		 */
		public get sleepThreshold(): number {
			return this.options.sleepThreshold!;
		}

		public set sleepThreshold(value: number) {
			this.options.sleepThreshold = value;
		}

		/**
		 * 密度 [0.001]
		 * 如果设置，则mass会根据面积自动计算，这比单纯设置质量会更好
		 * 使用Body.setDensity赋值
		 */
		public get density(): number {
			return this.options.density!;
		}

		public set density(value: number) {
			this.options.density = value;
		}

		/**
		 * 弹性系数 (0, 1) [0]
		 * 0 表示碰撞时，完全无弹性，0.8意味着反弹80%的功能
		 * 相撞时取最大值 max(a.restitution, b.restitution)
		 */
		public get restitution(): number {
			return this.options.restitution!;
		}

		public set restitution(value: number) {
			this.options.restitution = value;
		}

		/**
		 * 摩擦系数 (0, 1) [0.1]
		 * 0 表示可以无限滑动，1 表示可能在施加力之后立即停止滑动
		 * 这个值的影响不是线性的，值越高，得到的结果会不稳定。
		 * 还取决于空气摩擦、库伦摩擦（Coulomb friction model）
		 * 相撞时取最小值 min(a.restitution, b.restitution)
		 */
		public get friction(): number {
			return this.options.friction!;
		}

		public set friction(value: number) {
			this.options.friction = value;
		}

		/**
		 * 静态摩擦系数 (0, ∞) [0.5]
		 * 基于库仑摩擦模型（Coulomb friction model），0 表示当它接近静止时，没有摩擦力（包括friction都不考虑）；只有运行的时候，才使用friction这个值
		 * 值越高，在接近静止时，所需要的力越大。起步时 摩擦力 = frictionStatic * friction （运动时计算frictionAir和friction）
		 */
		public get frictionStatic(): number {
			return this.options.frictionStatic!;
		}

		public set frictionStatic(value: number) {
			this.options.frictionStatic = value;
		}

		/**
		 * 空气摩擦系数 (0, ∞) [0.01]
		 * 空气阻力，0 表示在空中移动速度不会降低（真空一样）
		 * 该值的影响是非线性的
		 */
		public get frictionAir(): number {
			return this.options.frictionAir!;
		}

		public set frictionAir(value: number) {
			this.options.frictionAir = value;
		}

		/**
		 * 碰撞参数
		 *
		 */
		public get collisionFilter(): options.CollisionFilterOptions {
			return this.options.collisionFilter!;
		}

		public set collisionFilter(value: options.CollisionFilterOptions) {
			this.options.collisionFilter = value;
		}

		/**
		 * 允许两个刚体堆砌重合多少距离，或者是碰撞旋转时允许重合距离 [0.05]
		 * 除非你足够了解slop引擎的目的，不然使用默认值比较好
		 * 对于大刚体（复合体），可能需要更大的值来位置堆叠
		 */
		public get slop(): number {
			return this.options.slop!;
		}

		public set slop(value: number) {
			this.options.slop = value;
		}

		/**
		 * 时间缩放率，比如慢动作常用，[1]
		 * 单独设置的时候，这个刚体的时间缩放是独立的
		 */
		public get timeScale(): number {
			return this.options.timeScale!;
		}

		public set timeScale(value: number) {
			this.options.timeScale = value;
		}

		/**
		 * 渲染参数
		 */
		public get render(): options.RenderOptions {
			return this.options.render!;
		}

		public set render(value: options.RenderOptions) {
			this.options.render = value;
		}

		protected defaultOptions(): BodyOptions {
			return {
				id: common.nextId(),
				type: 'body',
				label: 'Body',
				parts: [],
				plugin: {},
				angle: 0,
				parent: this,
				vertices: Vertices.create('L 0 0 L 40 0 L 40 40 L 0 40').setBody(this),
				position: new Point(),
				velocity: new Vector(),
				torque: 0,
				isSensor: false,
				isStatic: false,
				isSleeping: false,
				sleepThreshold: 60,
				density: 0.001,
				restitution: 0,
				friction: 0.1,
				frictionStatic: 0.5,
				frictionAir: 0.01,
				collisionFilter: {
					category: 0x0001,
					mask: 0xFFFFFFFF,
					group: 0
				},
				slop: 0.05,
				timeScale: 1,
				render: {
					visible: true,
					opacity: 1,
					sprite: {
						xScale: 1,
						yScale: 1,
						xOffset: 0,
						yOffset: 0
					},
					strokeStyle: 0x0,
					lineWidth: 0
				}
			};
		}

		/**
		 * Given a property and a value (or map of), sets the property(s) on the body, using the appropriate setter functions if they exist.
		 * Prefer to use the actual setter functions in performance critical situations.
		 * @method set
		 * @param {} settings A property name (or map of properties and values) to set on the body.
		 * @param {} value The value to set if `settings` is a single property name.
		 */
		public set(settings: any, value?: any)
		{
			let property;

			if (typeof settings === 'string') {
				property = settings;
				settings = {}
				settings[property] = value;
			}

			for (property in settings) {
				value = settings[property];

				if (!settings.hasOwnProperty(property))
					continue;

				switch (property) {

					case 'isStatic':
						this.setStatic(value);
						break;
					case 'isSleeping':
						this.setSleeping(value);
						break;
					case 'mass':
						this.setMass(value);
						break;
					case 'density':
						this.setDensity(value);
						break;
					case 'inertia':
						this.setInertia(value);
						break;
					case 'vertices':
						this.setVertices(value);
						break;
					case 'position':
						this.setPosition(value);
						break;
					case 'angle':
						this.setAngle(value);
						break;
					case 'velocity':
						this.setVelocity(value);
						break;
					case 'angularVelocity':
						this.setAngularVelocity(value);
						break;
					case 'parts':
						this.setParts(value);
						break;
					default:
						this[property] = value;
				}
			}

		}

		/**
		 * Initialises body properties.
		 * @method _initProperties
		 * @private
		 */
		protected _initProperties(options: BodyOptions)
		{
			//边界
			this.bounds = this.options.vertices.getBounds();
			//初始质点
			this.positionPrev = this.options.position.clone();
			//初始角度
			this.anglePrev = this.options.angle!;
			//顶点合集
			this.setVertices(this.options.vertices);
			//零件
			this.setParts(this.options.parts || [this]);
			//设置静态属性
			this.setStatic(this.options.isStatic!);
			//设置睡眠属性
			this.setSleeping(this.options.isSleeping!);
			//设置父刚体
			this.parent = this.options.parent! || this;
			//旋转所有顶点
			this.vertices.rotate(this.options.angle!, this.options.position);
			//旋转轴
			this.axes.rotate(this.options.angle!);
			//根据速度 计算边界
			this.bounds.setTo(this.options.vertices, this.options.velocity);
			//质量
			this.setMass(options.mass || this.options.mass!);
			//惯性
			this.setInertia(options.inertia || this.options.inertia!);

			// render properties
			let defaultFillStyle = (this.options.isStatic ? 0x2e2b44 : _.sample([0x006BA6, 0x0496FF, 0xFFBC42, 0xD81159, 0x8F2D56])),
				defaultStrokeStyle = 0x0;
			this.render.fillStyle = this.options.render!.fillStyle || defaultFillStyle;
			this.render.strokeStyle = this.options.render!.strokeStyle || defaultStrokeStyle;
			this.render.sprite!.xOffset! += -(this.bounds.min.x - this.position.x) / (this.bounds!.max.x - this.bounds.min.x);
			this.render.sprite!.yOffset! += -(this.bounds.min.y - this.position.y) / (this.bounds!.max.y - this.bounds.min.y);
		}

		 /**
		 * Returns the next unique group index for which bodies will collide.
		 * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
		 * See `body.collisionFilter` for more information.
		 * @method nextGroup
		 * @param {bool} [isNonColliding=false]
		 * @return {Number} Unique group index
		 */
		public static nextGroup(isNonColliding: boolean = false) {
			if (isNonColliding)
				return Body._nextNonCollidingGroupId--;

			return Body._nextCollidingGroupId++;
		}

		/**
		 * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
		 * There are 32 available. See `body.collisionFilter` for more information.
		 * @method nextCategory
		 * @return {Number} Unique category bitfield
		 */
		public static nextCategory() {
			Body._nextCategory = Body._nextCategory << 1;
			return Body._nextCategory;
		}

		/**
		 * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
		 * @method setStatic
		 * @param {bool} isStatic
		 */
		public setStatic(isStatic: boolean): Body
		{
			for (let i = 0; i < this.parts.length; i++) {
				let part = this.parts[i];
				part.isStatic = isStatic;

				if (isStatic) {
					part._original = {
						restitution: part.restitution,
						friction: part.friction,
						mass: part.mass,
						inertia: part.inertia,
						density: part.density,
						inverseMass: part.inverseMass,
						inverseInertia: part.inverseInertia
					};

					part.restitution = 0;
					part.friction = 1;
					part.mass = part.inertia = part.density = Infinity;
					part.inverseMass = part.inverseInertia = 0;

					part.positionPrev.x = part.position.x;
					part.positionPrev.y = part.position.y;
					part.anglePrev = part.angle;
					part.angularVelocity = 0;
					part.speed = 0;
					part.angularSpeed = 0;
					part.motion = 0;
				} else if (part._original) {
					part.restitution = part._original.restitution!;
					part.friction = part._original.friction!;
					part.mass = part._original.mass!;
					part.inertia = part._original.inertia!;
					part.density = part._original.density!;
					part.inverseMass = part._original.inverseMass!;
					part.inverseInertia = part._original.inverseInertia!;

					delete part._original;
				}
			}
			return this;
		}

		/**
		 * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
		 * @method setMass
		 * @param {number} mass
		 */
		public setMass(mass: number): Body
		{
			let moment = this.inertia / (this.mass / 6);
			this.inertia = moment * (mass / 6);
			this.inverseInertia = 1 / this.inertia;

			this.mass = mass;
			this.inverseMass = 1 / this.mass;
			this.density = this.mass / this.area;
			return this;
		}

		/**
		 * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
		 * @method setDensity
		 * @param {number} density
		 */
		public setDensity(density: number): Body
		{
			this.setMass(density * this.area);
			this.density = density;
			return this;
		}

		/**
		 * Sets the moment of inertia (i.e. second moment of area) of the body of the body.
		 * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
		 * @method setInertia
		 * @param {number} inertia
		 */
		public setInertia(inertia: number): Body
		{
			this.inertia = inertia;
			this.inverseInertia = 1 / this.inertia;
			return this;
		}

		/**
		 * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
		 * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
		 * They are then automatically translated to world space based on `body.position`.
		 *
		 * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
		 * Vertices must form a convex hull, concave hulls are not supported.
		 *
		 * @method setVertices
		 * @param {vector[]} vertices
		 */
		public setVertices(vertices: Vertices): Body
		{
			// change vertices
			if (vertices.body === this) {
				this.vertices = vertices;
			} else {
				this.vertices = vertices.clone().setBody(this);
			}

			// update properties
			this.axes = this.vertices.getAxes();
			this.area = this.vertices.area();
			this.setMass(this.density * this.area)

			// orient vertices around the centre of mass at origin (0, 0)
			// 将顶点按照质点偏移
			let centre = this.vertices.centre();
			this.vertices.translate(centre, -1);

			// update inertia while vertices are at origin (0, 0)
			this.setInertia(Body._inertiaScale * this.vertices.inertia(this.mass));

			// update geometry
			this.vertices.translate(this.position);
			this.bounds.setTo(this.vertices, this.velocity);
			return this;
		}

		/**
		 * Sets the parts of the `body` and updates mass, inertia and centroid.
		 * Each part will have its parent set to `body`.
		 * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
		 * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
		 * @method setParts
		 * @param [body] parts
		 * @param {bool} [autoHull=true]
		 */
		public setParts(parts: Body[], autoHull: boolean = true): Body
		{
			let i: number;

			// add all the parts, ensuring that the first part is always the parent body
			parts = parts.slice(0);
			this.parts.length = 0;
			this.parts.push(this);
			this.parent = this;

			for (i = 0; i < parts.length; i++) {
				let part = parts[i];
				if (part !== this) {
					part.parent = this;
					this.parts.push(part);
				}
			}

			if (this.parts.length === 1)
				return this;

			autoHull = typeof autoHull !== 'undefined' ? autoHull : true;

			// find the convex hull of all parts to set on the parent body
			if (autoHull) {
				let vertices: Vertices = new Vertices().setBody(this);
				for (i = 0; i < parts.length; i++) {
					vertices.add(...parts[i].vertices.items);
				}

				vertices.clockwiseSort();

				let hull = vertices.hull(),
					hullCentre = hull.centre();

				this.setVertices(hull);
				this.vertices.translate(hullCentre);
			}

			// sum the properties of all compound parts of the parent body
			let total = this._totalProperties();

			this.area = total.area!;
			this.parent = this;
			this.position.x = total.centre.x;
			this.position.y = total.centre.y;
			this.positionPrev.x = total.centre.x;
			this.positionPrev.y = total.centre.y;

			this.setMass(total.mass!);
			this.setInertia(total.inertia);
			this.setPosition(total.centre);
			return this;
		}

		/**
		 * Sets the position of the body instantly. Velocity, angle, force etc. are unchanged.
		 * @method setPosition
		 * @param {vector} position
		 */
		public setPosition(position: Point): Body
		{
			let delta = position.clone().subtract(this.position.x, this.position.y);
			this.positionPrev.x += delta.x;
			this.positionPrev.y += delta.y;

			for (let i = 0; i < this.parts.length; i++) {
				let part = this.parts[i];
				part.position.x += delta.x;
				part.position.y += delta.y;
				part.vertices.translate(delta);
				part.bounds.setTo(part.vertices, this.velocity);
			}
			return this;
		}

		/**
		 * Sets the angle of the body instantly. Angular velocity, position, force etc. are unchanged.
		 * @method setAngle
		 * @param {number} angle
		 */
		public setAngle(angle: number): Body
		{
			let delta = angle - this.angle;
			this.anglePrev += delta;

			for (let i = 0; i < this.parts.length; i++) {
				let part = this.parts[i];
				part.angle += delta;
				part.vertices.rotate(delta, this.position);
				part.axes.rotate(delta);
				part.bounds.setTo(part.vertices, this.velocity);
				if (i > 0) {
					part.position.rotateAbout(delta, this.position);
				}
			}
			return this;
		}

		/**
		 * Set this body as sleeping or awake.
		 * @method set
		 * @param {boolean} isSleeping
		 */
		public setSleeping(isSleeping: boolean): Body
		{
			sleeping.set(this, isSleeping);
			return this;
		}

		/**
		 * Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
		 * @method setVelocity
		 * @param {vector} velocity
		 */
		public setVelocity(velocity: Vector): Body
		{
			this.positionPrev.x = this.position.x - velocity.x;
			this.positionPrev.y = this.position.y - velocity.y;
			this.velocity.x = velocity.x;
			this.velocity.y = velocity.y;
			this.speed = this.velocity.getMagnitude();
			return this;
		}

		/**
		 * Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
		 * @method setAngularVelocity
		 * @param {number} velocity
		 */
		public setAngularVelocity(velocity: number): Body
		{
			this.anglePrev = this.angle - velocity;
			this.angularVelocity = velocity;
			this.angularSpeed = Math.abs(this.angularVelocity);
			return this;
		}

		/**
		 * Moves a body by a given vector relative to its current position, without imparting any velocity.
		 * @method translate
		 * @param {vector} translation
		 */
		public translate(translation: Vector): Body
		{
			this.setPosition(this.position.clone().add(translation.x, translation.y));
			return this;
		}

		/**
		 * Rotates a body by a given angle relative to its current angle, without imparting any angular velocity.
		 * @method rotate
		 * @param {number} rotation
		 * @param {vector} [point]
		 */
		public rotate(rotation: number, point?: Point): Body
		{
			if (point == undefined) {
				this.setAngle(this.angle + rotation);
			} else {
				let cos = Math.cos(rotation),
					sin = Math.sin(rotation),
					dx = this.position.x - point.x,
					dy = this.position.y - point.y;

				this.setPosition(new Point(
					point.x + (dx * cos - dy * sin),
					point.y + (dx * sin + dy * cos)
				));

				this.setAngle(this.angle + rotation);
			}
			return this;
		}

		/**
		 * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
		 * @method scale
		 * @param {number} scaleX
		 * @param {number} scaleY
		 * @param {vector} [point]
		 */
		public scale(scaleX: number, scaleY: number, point?: Point): Body
		{
			let totalArea = 0,
				totalInertia = 0;

			if (point == undefined)
				point = this.position;

			for (let i = 0; i < this.parts.length; i++) {
				let part = this.parts[i];

				// scale vertices
				part.vertices.scale(scaleX, scaleY, point);

				// update properties
				part.axes = part.vertices.getAxes();
				part.area = part.vertices.area();
				part.setMass(this.density * part.area);

				// update inertia (requires vertices to be at origin)
				part.vertices.translate(new Point(-part.position.x, -part.position.y ));
				part.setInertia(Body._inertiaScale * part.vertices.inertia(part.mass));
				part.vertices.translate(new Point(part.position.x, part.position.y));

				if (i > 0) {
					totalArea += part.area;
					totalInertia += part.inertia;
				}

				// scale position
				part.position.x = point.x + (part.position.x - point.x) * scaleX;
				part.position.y = point.y + (part.position.y - point.y) * scaleY;

				// update bounds
				part.bounds.setTo(part.vertices, this.velocity);
			}

			// handle parent this
			if (this.parts.length > 1) {
				this.area = totalArea;

				if (!this.isStatic) {
					this.setMass(this.density * totalArea);
					this.setInertia(totalInertia);
				}
			}

			// handle circles
			if (this.circleRadius) {
				if (scaleX === scaleY) {
					this.circleRadius *= scaleX;
				} else {
					// this is no longer a circle
					this.circleRadius = null;
				}
			}
			return this;
		}

		/**
		 * Performs a simulation step for the given `body`, including updating position and angle using Verlet integration.
		 * 根据 deltaTime 计算此时间之后的刚体物理状态
		 * @method update
		 * @param {number} deltaTime
		 * @param {number} timeScale
		 * @param {number} correction
		 */
		public update(deltaTime: number, timeScale: number, correction: number): Body
		{
			let deltaTimeSquared = Math.pow(deltaTime * timeScale * this.timeScale, 2);

			// from the previous step
			let frictionAir = 1 - this.frictionAir * timeScale * this.timeScale,
				velocityPrevX = this.position.x - this.positionPrev.x,
				velocityPrevY = this.position.y - this.positionPrev.y;

			// update velocity with Verlet integration
			this.velocity.x = (velocityPrevX * frictionAir * correction) + (this.force.x / this.mass) * deltaTimeSquared;
			this.velocity.y = (velocityPrevY * frictionAir * correction) + (this.force.y / this.mass) * deltaTimeSquared;

			this.positionPrev.x = this.position.x;
			this.positionPrev.y = this.position.y;
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;

			// update angular velocity with Verlet integration
			this.angularVelocity = ((this.angle - this.anglePrev) * frictionAir * correction) + (this.torque / this.inertia) * deltaTimeSquared;
			this.anglePrev = this.angle;
			this.angle += this.angularVelocity;

			// track speed and acceleration
			this.speed = this.velocity.getMagnitude();
			this.angularSpeed = Math.abs(this.angularVelocity);

			// transform the this geometry
			for (let i = 0; i < this.parts.length; i++) {
				let part = this.parts[i];

				part.vertices.translate(this.velocity);

				if (i > 0) {
					part.position.x += this.velocity.x;
					part.position.y += this.velocity.y;
				}

				if (this.angularVelocity !== 0) {
					part.vertices.rotate(this.angularVelocity, this.position);
					part.axes.rotate(this.angularVelocity);
					if (i > 0) {
						part.position.rotateAbout(this.angularVelocity, this.position);
					}
				}

				part.bounds.setTo(part.vertices, this.velocity);
			}
			return this;
		}

		/**
		 * Applies a force to a body from a given world-space position, including resulting torque.
		 * 施加一个力
		 * @method applyForce
		 * @param {vector} position
		 * @param {vector} force
		 */
		public applyForce(position: Point, force: Vector): Body
		{
			this.force.x += force.x;
			this.force.y += force.y;
			let offset = { x: position.x - this.position.x, y: position.y - this.position.y };
			this.torque += offset.x * force.y - offset.y * force.x;
			return this;
		}

		/**
		 * Returns the sums of the properties of all compound parts of the parent body.
		 * @method _totalProperties
		 * @private
		 * @return {}
		 */
		protected _totalProperties(): any
		{
			// from equations at:
			// https://ecourses.ou.edu/cgi-bin/ebook.cgi?doc=&topic=st&chap_sec=07.2&page=theory
			// http://output.to/sideway/default.asp?qno=121100087

			let properties: any = {
				mass: 0,
				area: 0,
				inertia: 0,
				centre: new Point()
			};

			// sum the properties of all compound parts of the parent body
			for (let i = this.parts.length === 1 ? 0 : 1; i < this.parts.length; i++) {
				let part = this.parts[i],
					mass = part.mass !== Infinity ? part.mass : 1;

				properties.mass += mass;
				properties.area += part.area;
				properties.inertia += part.inertia;
				properties.centre = part.position.clone().multiply(mass).add(properties.centre.x, properties.centre.y);
			}
			properties.centre.divide(properties.mass!);

			return properties;
		}

		/**
		 * Creates a body using the supplied vertices (or an array containing multiple sets of vertices).
		 * If the vertices are convex, they will pass through as supplied.
		 * Otherwise if the vertices are concave, they will be decomposed if [poly-decomp.js](https://github.com/schteppe/poly-decomp.js) is available.
		 * Note that this process is not guaranteed to support complex sets of vertices (e.g. those with holes may fail).
		 * By default the decomposition will discard collinear edges (to improve performance).
		 * It can also optionally discard any parts that have an area less than `minimumArea`.
		 * If the vertices can not be decomposed, the result will fall back to using the convex hull.
		 * The options parameter is an object that specifies any `Matter.Body` properties you wish to override the defaults.
		 * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
		 * @method createFromVertices
		 * @param {number} x 质心x
		 * @param {number} y 质心y
		 * @param {Vertices[]} vertexSets
		 * @param {bool} [flagInternal=false]
		 * @param {number} [removeCollinear=0.01]
		 * @param {number} [minimumArea=10]
		 * @return {body}
		 */
		public static createFromVertices(x: number, y: number, vertexSets: Vertices[], options?: BodyOptions, flagInternal: boolean = false, removeCollinear: number|boolean = 0.01, minimumArea: number = 10): Body
		{
			let body: Body,
				parts: BodyOptions[] = [],
				bodies: Body[] = [],
				isConvex: boolean,
				vertices: Vertices,
				i: number,
				j: number,
				k: number,
				v: number,
				z: number;

			if (window['decomp'] == undefined)
				console.warn('Body.createFromVertices: poly-decomp.js required. Could not decompose vertices. Fallback to convex hull.')

			for (v = 0; v < vertexSets.length; v += 1) {
				vertices = vertexSets[v];
				isConvex = !!vertices.isConvex();

				if (isConvex || !window['decomp']) {
					if (isConvex) {
						vertices.clockwiseSort();
					} else {
						// fallback to convex hull when decomposition is not possible
						vertices.hull();
					}

					parts.push({
						position: new Point(x, y),
						vertices: vertices
					});
				} else {
					let decomp = window['decomp'];
					// initialise a decomposition
					let concave = vertices.items.map(function (vertex) {
						return [vertex.x, vertex.y];
					});

					// vertices are concave and simple, we can decompose into parts
					decomp.makeCCW(concave);
					if (removeCollinear !== false)
						decomp.removeCollinearPoints(concave, removeCollinear);

					// use the quick decomposition algorithm (Bayazit)
					let decomposed = decomp.quickDecomp(concave);

					// for each decomposed chunk
					for (i = 0; i < decomposed.length; i++) {
						let chunk = decomposed[i];

						// convert vertices into the correct structure
						let chunkVertices: Vertices = new Vertices(chunk.map(function (vertex: number[]) {
							return new Point(
								vertex[0],
								vertex[1]
							);
						}) as Point[]);


						// skip small chunks
						if (minimumArea > 0 && chunkVertices.area() < minimumArea)
							continue;

						// create a compound part
						parts.push({
							position: chunkVertices.centre(),
							vertices: chunkVertices
						});
					}
				}
			}

			// create body parts
			for (i = 0; i < parts.length; i++) {
				bodies.push(new Body(object.extend(parts[i], options)))
			}

			// flag internal edges (coincident part edges)
			if (flagInternal) {
				let coincident_max_dist: number = 5;

				for (i = 0; i < bodies.length; i++) {
					let bodyA = bodies[i];

					for (j = i + 1; j < bodies.length; j++) {
						let bodyB = bodies[j];

						if (bodyA.bounds.overlaps(bodyB.bounds)) {
							let pav = bodyA.vertices,
								pbv = bodyB.vertices;

							// iterate vertices of both parts
							for (k = 0; k < bodyA.vertices.length; k++) {
								for (z = 0; z < bodyB.vertices.length; z++) {
									// find distances between the vertices

									let pk = pav.at(k),
										pk1 = pav.at((k + 1) % pav.length),
										pz = pbv.at(z),
										pz1 = pbv.at((z + 1) % pbv.length),
										da = pk1.clone().subtract(pz.x, pz.y).getMagnitudeSquared(),
										db = pk.clone().subtract(pz1.x, pz1.y).getMagnitudeSquared();

									// if both vertices are very close, consider the edge concident (internal)
									if (da < coincident_max_dist && db < coincident_max_dist) {
										pk.isInternal = true;
										pz.isInternal = true;
									}
								}
							}
						}
					}
				}
			}

			if (bodies.length > 1) {
				// create the parent body to be returned, that contains generated compound parts
				body = bodies[0];
				body.set(options);
				body.setPosition(new Point(x, y));

				return body;
			} else {
				return bodies[0];
			}
		}
	}
}
