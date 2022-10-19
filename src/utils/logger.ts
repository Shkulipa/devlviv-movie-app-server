import dayjs from 'dayjs';
import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
	colorize: true,
	ignore: 'pid,hostname',
	customPrettifiers: {
		time: () => `🕰 ${dayjs().format('DD.MM.YY | HH:mm:ss')}`
	}
});
const logger = pino(stream);

export default logger;
