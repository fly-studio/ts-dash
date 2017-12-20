namespace math {
	/**
	* Takes a directed graph and returns the partially ordered set of vertices in topological order.
	* Circular dependencies are allowed.
	* @method topologicalSort
	* @param {object} graph
	* @return {array} Partially ordered set of vertices in topological order.
	*/
	export function topologicalSort(graph: Object) {
		// https://github.com/mgechev/javascript-algorithms
		// Copyright (c) Minko Gechev (MIT license)
		// Modifications: tidy formatting and naming
		let result: any[] = [],
			visited: any[] = [],
			temp: any[] = [];

		for (let node in graph) {
			if (!visited[node] && !temp[node]) {
				_topologicalSort(node, visited, temp, graph, result);
			}
		}

		return result;
	};

	function _topologicalSort(node: string, visited: any, temp: any, graph: Object, result: any[]) {
		let neighbors = graph[node] || [];
			temp[node] = true;

		for (let i = 0; i < neighbors.length; i += 1) {
			let neighbor = neighbors[i];

			if (temp[neighbor]) {
				// skip circular dependencies
				continue;
			}

			if (!visited[neighbor]) {
				_topologicalSort(neighbor, visited, temp, graph, result);
			}
		}

		temp[node] = false;
		visited[node] = true;

		result.push(node);
	};
}