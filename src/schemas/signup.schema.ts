import { object } from "zod";
import SchemaService from "./../services/schema.service";

const signup = object({
	body: object({
		email: SchemaService.email(),
		password: SchemaService.password(),
	})
});

export default signup;