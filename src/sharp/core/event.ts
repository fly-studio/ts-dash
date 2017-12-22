namespace sharp.events {
	/**
	 * Subscribes a callback function to the given object's `eventName`.
	 * @method on
	 * @param {EventDispatcher} obj
	 * @param {string} eventNames
	 * @param {function} callback
	 */
	export function on(obj: EventDispatcher, eventNames: string, callback: Function): Function {
		let names = eventNames.split(' '),
			name: string;

		for (let i = 0; i < names.length; i++) {
			name = names[i];
			obj.events = obj.events || {};
			obj.events[name] = obj.events[name] || [];
			obj.events[name].push(callback);
		}

		return callback;
	}

	/**
	 * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all
	 * @method off
	 * @param {EventDispatcher} obj
	 * @param {string} eventNames
	 * @param {function} callback
	 */
	export function off(obj: EventDispatcher, eventNames: string, callback: Function) {
		if (!eventNames) {
			obj.events = {};
			return;
		}

		// handle off(obj, callback)
		if (typeof eventNames === 'function') {
			callback = eventNames;
			eventNames = object.keys(obj.events).join(' ');
		}

		let names = eventNames.split(' ');

		for (let i = 0; i < names.length; i++) {
			let callbacks = obj.events[names[i]],
				newCallbacks = [];

			if (callback && callbacks) {
				for (let j = 0; j < callbacks.length; j++) {
					if (callbacks[j] !== callback)
						newCallbacks.push(callbacks[j]);
				}
			}

			obj.events[names[i]] = newCallbacks;
		}
	}

	/**
	 * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
	 * @method trigger
	 * @param {EventDispatcher} obj
	 * @param {string} eventNames
	 * @param {} event
	 */
	export function trigger(obj: EventDispatcher, eventNames: string, event: any) {
		let names: string[],
			name: string,
			callbacks: Function,
			eventClone: any;

		if (obj.events) {
			if (!event)
				event = {};

			names = eventNames.split(' ');

			for (let i = 0; i < names.length; i++) {
				name = names[i];
				callbacks = obj.events[name];

				if (callbacks) {
					eventClone = object.clone(event, false);
					eventClone.name = name;
					eventClone.source = obj;

					for (let j = 0; j < callbacks.length; j++) {
						callbacks[j].apply(obj, [eventClone]);
					}
				}
			}
		}
	}
}