import { object } from "zod";
import SchemaAuthService from "./../schemaServices/schemaAuth.service";

const signin = object({
	body: object({
		email: SchemaAuthService.email(),
		password: SchemaAuthService.password()
	})
});

export default signin;
