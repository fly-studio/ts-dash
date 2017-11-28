namespace http {

	export function objectToForm(data: Object): FormData {
		let formData: FormData;
		if (data instanceof FormData)
			formData = data;
		else {
			formData = new FormData();
			for (let k in data)
				formData.append(k, data[k]);
		}
		return formData;
	}

	export function get(url: string, data?: any): Promise<any> {
		let q: Query = new Query();
		return q.request('get', url, data);
	}

	export function post(url: string, data: any): Promise<any> {
		let q: Query = new Query();
		return q.request('post', url, data);
	}

	export function form(url: string, data: Object): Promise<any> {
		let q: Query = new Query();
		return q.request('post', url, objectToForm(data));
	}

	export function head(url: string, data?: any): Promise<any> {
		let q: Query = new Query();
		return q.request('head', url, data);
	}

	export function options(url: string, data?: any): Promise<any> {
		let q: Query = new Query();
		return q.request('options', url, data);
	}

	export function patch(url: string, data?: any): Promise<any> {
		let q: Query = new Query();
		return q.request('patch', url, data);
	}

	export function put(url: string, data: any): Promise<any> {
		let q: Query = new Query();
		return q.request('put', url, data);
	}

	export function DELETE(url: string, data?: any): Promise<any> {
		let q: Query = new Query();
		return q.request('delete', url, data);
	}

	http['delete'] = DELETE;
}