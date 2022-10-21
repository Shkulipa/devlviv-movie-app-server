export const objKeysToLoweCase = (obj: object) =>
	Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
