import * as React from "react";

export function Roadmap() {
	React.useEffect(() => {
		async function fetchData() {
			const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
			const data = await response.json();
			console.log(data);
		}

		void fetchData();
	}, []);
	return <h1>Roadmap React</h1>;
}
