namespace sharp {
	import Vector = Point;

	export class Mouse extends EventDispatcher {

		public element: HTMLCanvasElement;
		public absolute: Point = new Point;
		public position: Point = new Point;
		public mousedownPosition: Point = new Point;
		public mouseupPosition: Point = new Point;
		public offset: Point = new Vector;
		public scale: Point = new Vector(1, 1);
		public wheelDelta: number;
		public button: number = -1;
		public pixelRatio: number;
		public sourceEvents: any;

		constructor(element?: HTMLCanvasElement)
		{
			super();

			this.element = element || window.document.body as HTMLCanvasElement;
			this.pixelRatio = this.element.getAttribute('data-pixel-ratio') ? parseFloat(this.element.getAttribute('data-pixel-ratio')!) : 1;
			this.sourceEvents = {
				mousemove: null,
				mousedown: null,
				mouseup: null,
				mousewheel: null
			}
			this.setElement(this.element);
		}

		protected onMouseMove(event: any) {
			var position = this._getRelativeMousePosition(event, this.element, this.pixelRatio),
				touches = event.changedTouches;

			if (touches) {
				this.button = 0;
				event.preventDefault();
			}

			this.absolute.x = position.x;
			this.absolute.y = position.y;
			this.position.x = this.absolute.x * this.scale.x + this.offset.x;
			this.position.y = this.absolute.y * this.scale.y + this.offset.y;
			this.sourceEvents.mousemove = event;
		}

		protected onMouseDown(event: any) {
			var position = this._getRelativeMousePosition(event, this.element, this.pixelRatio),
				touches = event.changedTouches;

			if (touches) {
				this.button = 0;
				event.preventDefault();
			} else {
				this.button = event.button;
			}

			this.absolute.x = position.x;
			this.absolute.y = position.y;
			this.position.x = this.absolute.x * this.scale.x + this.offset.x;
			this.position.y = this.absolute.y * this.scale.y + this.offset.y;
			this.mousedownPosition.x = this.position.x;
			this.mousedownPosition.y = this.position.y;
			this.sourceEvents.mousedown = event;
		}

		protected onMouseUp(event: any) {
			var position = this._getRelativeMousePosition(event, this.element, this.pixelRatio),
				touches = event.changedTouches;

			if (touches) {
				event.preventDefault();
			}

			this.button = -1;
			this.absolute.x = position.x;
			this.absolute.y = position.y;
			this.position.x = this.absolute.x * this.scale.x + this.offset.x;
			this.position.y = this.absolute.y * this.scale.y + this.offset.y;
			this.mouseupPosition.x = this.position.x;
			this.mouseupPosition.y = this.position.y;
			this.sourceEvents.mouseup = event;
		}

		protected onMouseWheel(event: WheelEvent) {
			this.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
			event.preventDefault();
		}

		/**
		 * Sets the element the mouse is bound to (and relative to).
		 * @method setElement
		 * @param {HTMLCanvasElement} element
		 */
		public setElement(element: HTMLCanvasElement) {
			this.element = element;

			element.addEventListener('mousemove', this.onMouseMove);
			element.addEventListener('mousedown', this.onMouseDown);
			element.addEventListener('mouseup', this.onMouseUp);

			element.addEventListener('mousewheel', this.onMouseWheel);
			element.addEventListener('DOMMouseScroll', this.onMouseWheel);

			element.addEventListener('touchmove', this.onMouseMove);
			element.addEventListener('touchstart', this.onMouseDown);
			element.addEventListener('touchend', this.onMouseUp);
		}

		/**
		 * Clears all captured source events.
		 * @method clearSourceEvents
		 */
		public clearSourceEvents() {
			this.sourceEvents.mousemove = null;
			this.sourceEvents.mousedown = null;
			this.sourceEvents.mouseup = null;
			this.sourceEvents.mousewheel = null;
			this.wheelDelta = 0;
		}

		/**
		 * Sets the mouse position offset.
		 * @method setOffset
		 * @param {vector} offset
		 */
		public setOffset(offset: Vector): Mouse
		{
			this.offset.x = offset.x;
			this.offset.y = offset.y;
			this.position.x = this.absolute.x * this.scale.x + this.offset.x;
			this.position.y = this.absolute.y * this.scale.y + this.offset.y;
			return this;
		}

		/**
		 * Sets the mouse position scale.
		 * @method setScale
		 * @param {vector} scale
		 */
		public setScale(scale: Vector): Mouse
		{
			this.scale.x = scale.x;
			this.scale.y = scale.y;
			this.position.x = this.absolute.x * this.scale.x + this.offset.x;
			this.position.y = this.absolute.y * this.scale.y + this.offset.y;
			return this;
		}

		/**
		 * Gets the mouse position relative to an element given a screen pixel ratio.
		 * @method _getRelativeMousePosition
		 * @private
		 * @param {} event
		 * @param {} element
		 * @param {number} pixelRatio
		 * @return {}
		 */
		protected _getRelativeMousePosition(event: any, element: HTMLCanvasElement, pixelRatio: number)
		{
			var elementBounds = element.getBoundingClientRect(),
				rootNode = (document.documentElement || document.body.parentNode || document.body),
				scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft,
				scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop,
				touches = event.changedTouches,
				x, y;

			if (touches) {
				x = touches[0].pageX - elementBounds.left - scrollX;
				y = touches[0].pageY - elementBounds.top - scrollY;
			} else {
				x = event.pageX - elementBounds.left - scrollX;
				y = event.pageY - elementBounds.top - scrollY;
			}

			return {
				x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
				y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
			}
		}
	}
}