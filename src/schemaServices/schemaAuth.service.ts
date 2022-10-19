import { string } from 'zod';

class SchemaAuthService {
	private passMin = 6;

	password(nameField = 'Password') {
		return string({
			required_error: `${nameField} is required`
		})
			.min(this.passMin, `${nameField} too short - should be 6 chars minimum`)
			.refine((val: string) => !(val.indexOf(' ') >= 0), {
				message: `${nameField} can't contain white space`
			});
	}

	email() {
		return string({
			required_error: 'Email is required'
		}).email("Email isn't valid");
	}
}

export default new SchemaAuthService();
