import ShortUniqueId from 'short-unique-id';

export const uuidGenerater = () => {
	const uid = new ShortUniqueId({ length: 8 });
	return 'tt' + uid;
};
