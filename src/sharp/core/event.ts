namespace sharp.events {
	/**
	 * Subscribes a callback function to the given object's `eventName`.
	 * @method on
	 * @param {} obj
	 * @param {string} eventNames
	 * @param {function} callback
	 */
	export function on(obj: body.Base, eventNames: string, callback: Function): Function {
		var names = eventNames.split(' '),
			name;

		for (var i = 0; i < names.length; i++) {
			name = names[i];
			obj.events = obj.events || {};
			obj.events[name] = obj.events[name] || [];
			obj.events[name].push(callback);
		}

		return callback;
	};

	/**
	 * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all
	 * @method off
	 * @param {} obj
	 * @param {string} eventNames
	 * @param {function} callback
	 */
	export function off(obj: body.Base, eventNames: string, callback: Function) {
		if (!eventNames) {
			obj.events = {};
			return;
		}

		// handle off(obj, callback)
		if (typeof eventNames === 'function') {
			callback = eventNames;
			eventNames = object.keys(obj.events).join(' ');
		}

		var names = eventNames.split(' ');

		for (var i = 0; i < names.length; i++) {
			var callbacks = obj.events[names[i]],
				newCallbacks = [];

			if (callback && callbacks) {
				for (var j = 0; j < callbacks.length; j++) {
					if (callbacks[j] !== callback)
						newCallbacks.push(callbacks[j]);
				}
			}

			obj.events[names[i]] = newCallbacks;
		}
	};

	/**
	 * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
	 * @method trigger
	 * @param {} obj
	 * @param {string} eventNames
	 * @param {} event
	 */
	export function trigger(obj: body.Base, eventNames: string, event: any) {
		var names,
			name,
			callbacks,
			eventClone;

		if (obj.events) {
			if (!event)
				event = {};

			names = eventNames.split(' ');

			for (var i = 0; i < names.length; i++) {
				name = names[i];
				callbacks = obj.events[name];

				if (callbacks) {
					eventClone = object.clone(event, false);
					eventClone.name = name;
					eventClone.source = obj;

					for (var j = 0; j < callbacks.length; j++) {
						callbacks[j].apply(obj, [eventClone]);
					}
				}
			}
		}
	};
}