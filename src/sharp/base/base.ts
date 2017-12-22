namespace sharp.base {

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

	export interface CollisionFilterOptions {
		/**
		 * 范围 (1, 2, 4, 8, 16, ... 2^31) [1]
		 * 共32个不同的bitamask子掩码
		 */
		category?: number;
		/**
		 * 范围 1 - 2^32 [0xFFFFFFFF]
		 * 这是bitmask的掩码
		 */
		mask?: number;
		/**
		 * a.group, b.group 如果相等，且均为正数表示两者相撞；均为负数永远不相撞。
		 * 如果不相同（或任意一个为0），当(a.mask & b.category) && (a.category && b.mask)，则表示两者相撞
		 */
		group?: number;
	}

	export interface Options {
		/**
		 * ID 唯一值，自增，只读
		 */
		id?: number;
		/**
		 * 类型
		 * 比如：'body', 'composite'
		 */
		type?: string;
		/**
		 * 标签，自定义用
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
}
namespace sharp {

	export abstract class Base extends EventDispatcher {
		protected options: base.Options;

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
		 * 类型
		 * 比如：Rectange/Circle/Ellipse
		 */
		public get type(): string {
			return this.options.type!;
		}

		/* public set type(value: string) {
			this.options.type = value;
		} */

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