namespace sharp.body {

	export interface RenderOptions {
		/**
		 * 是否显示 [true]
		 */
		visible?: boolean;
		/**
		 * 不透明度 [1]
		 */
		opacity?: number;
		/**
		 * Sprite 属性
		 */
		sprite?: {
			// Sprite渲染纹理
			texture?: any;
			/**
			 * Sprite的x缩放
			 */
			xScale?: number;
			/**
			 * Sprite的y缩放
			 */
			yScale?: number;
			/**
			 * Sprite的x偏移，因为body的position是质点的坐标，所以设置这个，让Sprite的坐标渲染正确。下同
			 */
			xOffset?: number;
			/**
			 * Sprite的y偏移
			 */
			yOffset?: number
		}
		/**
		 * 如果没Sprite，显示框的颜色 [0x0]
		 */
		strokeStyle?: number;
		/**
		 * 如果没Sprite，显示框填充颜色，默认会自动会在颜色列表中依次选择一个
		 */
		fillStyle?: number
		/**
		 * 如果没Sprite，显示框的线宽 [0]
		 */
		lineWidth?: number;
		/**
		 *
		 */
		type?: string;
		/**
		 *
		 */
		anchors?: boolean;
	}

	export interface Options {
		/**
		 * ID 唯一值，自增，只读
		 */
		id?: number;
		/**
		 * 刚体类型 ['body']
		 * 比如：'body', 'composite'
		 */
		type?: string;
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
		protected options: Options;
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
			return this.options.type!;
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