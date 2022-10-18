import { object } from "zod";
import SchemaService from "./../services/schema.service";

const signin = object({
	body: object({
		email: SchemaService.email(),
		password: SchemaService.password()
	})
});

export default signin;
