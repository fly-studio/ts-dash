namespace sharp.body {

	export interface Options {
		/**
		 * ID 唯一值，自增，只读
		 */
		id?: number;
		/**
		 * 刚体类型 ['body']
		 * 比如：Rectange/Circle/Ellipse
		 */
		type: string;
		/**
		 * 刚体标签，自定义用
		 */
		label?: string;
		/**
		 * 父级刚体，如果不是复合体，则parent等于自己
		 */
		parent?: any;
		/**
		 * 插件
		 */
		plugin?: Object;
	}

	export abstract class Base {
		protected options: body.Options;
		public events: Object;
		/**
		 * ID 唯一值，自增，只读
		 */

		public get id(): number {
			return this.options.id!;
		}

		/* public set id(value: number) {
			this.options.id = value;
		} */

		/**
		 * 刚体类型 ['body']
		 * 比如：Rectange/Circle/Ellipse
		 */
		public get type(): string {
			return this.options.type;
		}

		/* public set type(value: string) {
			this.options.type = value;
		} */

		/**
		 * 刚体标签，自定义用
		 */
		public get label(): string {
			return this.options.label!;
		}

		public set label(value: string) {
			this.options.label = value;
		}

		public abstract get parent(): any;
		public abstract set parent(value: any);

		//public abstract get parts(): any;
		//public abstract set parts(value: any);
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

		/**
		 * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
		 * @method trigger
		 * @param {} obj
		 * @param {string} eventNames
		 * @param {} event
		 */
		public trigger(eventNames: string, event: any)
		{
			return events.trigger(this, eventNames, event);
		}

		/**
		 * Subscribes a callback function to the given object's `eventName`.
		 * @method on
		 * @param {} obj
		 * @param {string} eventNames
		 * @param {function} callback
		 */
		public on(eventNames: string, callback: Function)
		{
			return events.on(this, eventNames, callback);
		}

		/**
		 * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all
		 * @method off
		 * @param {} obj
		 * @param {string} eventNames
		 * @param {function} callback
		 */
		public off(eventNames: string, callback: Function)
		{
			return events.off(this, eventNames, callback);
		}
	}
}