export const number = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const item = <T>(arr: Array<T>, filterFn?: (value: T) => boolean): T | undefined => {
	const filtered = filterFn == null ? arr : [...arr].filter(filterFn);

	return filtered[number(0, filtered.length - 1)];
};

export const list = <T>(arr: Array<T>, length: number): Array<T> => {
	const selected: Array<T> = [];

	Array.from({ length: length }, () => {
		const s = item(arr, (v) => !selected.some((a) => a == v));

		if (s == null) {
			return;
		}

		selected.push(s);
	});

	return selected;
};
