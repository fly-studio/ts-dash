namespace sharp {
	export abstract class EventDispatcher {

		public events: Object;

		/**
		 * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
		 * @method trigger
		 * @param {} obj
		 * @param {string} eventNames
		 * @param {} event
		 */
		public trigger(eventNames: string, event?: any) {
			return events.trigger(this, eventNames, event);
		}

		/**
		 * Subscribes a callback function to the given object's `eventName`.
		 * @method on
		 * @param {} obj
		 * @param {string} eventNames
		 * @param {function} callback
		 */
		public on(eventNames: string, callback: Function) {
			return events.on(this, eventNames, callback);
		}

		/**
		 * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all
		 * @method off
		 * @param {} obj
		 * @param {string} eventNames
		 * @param {function} callback
		 */
		public off(eventNames: string, callback: Function) {
			return events.off(this, eventNames, callback);
		}
	}
}