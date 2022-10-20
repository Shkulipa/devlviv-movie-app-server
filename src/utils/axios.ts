import axios from 'axios';

export const $omdApi = axios.create({
	baseURL: process.env.OMD_API,
	params: {
		apiKey: process.env.PARAM_OMDAPI_API_KEY
	}
});
