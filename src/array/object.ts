namespace object {

	export function values(obj: Object): Array<any>
	{
		let values = [];

		if (Object.keys) {
			let keys = Object.keys(obj);
			for (let i = 0; i < keys.length; i++) {
				values.push(obj[keys[i]]);
			}
			return values;
		}

		// avoid hasOwnProperty for performance
		for (let key in obj)
			values.push(obj[key]);

		return values;
	}

}