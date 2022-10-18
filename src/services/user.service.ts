import UserModel from './../models/user.model';
import logger from "../utils/logger";
import { IUserInput } from "../interfaces/user.interfaces";

class UserService {
	async signup(input: IUserInput) {
		const { password, email } = input;
    try {
      const user = await UserModel.create({ email, password });
      return user;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

  async signin(input: IUserInput) {
		const { password, email } = input;
    try {
      console.log(11);
      return { password, email }
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

  async logout(refreshToken: string) {
		try {
      console.log('logout')
			// return await RefreshTokensModel.findOneAndDelete({ refreshToken });
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	} 
}

export default new UserService();
