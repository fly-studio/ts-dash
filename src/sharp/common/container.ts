namespace sharp {

	export abstract class Container extends EventDispatcher {
		protected options: options.IOptions = {};

		/**
		 * ID 唯一值，自增，只读
		 */
		public get id(): number {
			return this.options.id!;
		}

		public setID(value: number) {
			this.options.id = value;
		}

		/**
		 *
		 * 类型
		 * 比如：Rectange/Circle/Ellipse
		 */
		public get type(): string {
			return this.options.type!;
		}

		public setType(value: string) {
			this.options.type = value;
		}

		/**
		 * 标签，自定义用
		 */
		public get label(): string {
			return this.options.label!;
		}

		public set label(value: string) {
			this.options.label = value;
		}

		public get parent(): any {
			return this.options.parent;
		}

		public set parent(value: any) {
			this.options.parent = value;
		}

		/**
		 * 插件
		 */
		public get plugin(): Object {
			return this.options.plugin!;
		}

		public set plugin(value: Object) {
			this.options.plugin = value;
		}

		protected abstract defaultOptions(): any
	}
}