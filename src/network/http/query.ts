namespace http {
	export class Query {
		private instance: AxiosInstance;
		public autoTip: boolean = false;

		constructor(baseURL?: string, timeout: number = 20000)
		{
			this.instance = axios.create({
				baseURL: baseURL == null ? '' : baseURL,
				timeout: timeout,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				responseType: 'json',
				xsrfHeaderName: 'X-CSRF-TOKEN',
				xsrfCookieName: 'XSRF-TOKEN', // read from cookie
				transformRequest: [(data, headers) => {
					// Do whatever you want to transform the data
					return data;
				}],
			});
		}

		public request(method: string, url: string, data: any = {}): AxiosPromise<any>
		{
			let param = method.toLowerCase() == 'get' ? data : {};
			if (method.toLowerCase() == 'get')
				data = null;

			return this.instance.request({
				method: method.toLowerCase(),
				url: url,
				params: param,
				data: data
			});
		}
	}
}