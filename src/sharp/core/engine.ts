namespace sharp {
	export class Engine extends EventDispatcher {
		public mouse: Mouse;
		public world: World;
		public metrics: any;
		public pairs: Pairs[];
		public render:any;
	}
}