import { IUserInput } from '../interfaces/user.interfaces';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import UserModel from './../models/user.model';
import Jwt from './jwt.service';
import PasswordService from './passwrod.service';

class UserService {
	async signup(input: IUserInput) {
		const { password, email } = input;
		try {
			const emailExist = await UserModel.findOne({ where: { email } });
			if (emailExist)
				throw ApiError.badRequest(`User with email:${email} has already taken`);

			const encryptPassword = await PasswordService.encrypt(password);

			const user = await UserModel.create({ email, password: encryptPassword });
			const id = user.getDataValue('id');

			const jwtUserPayload = {
				id,
				email
			};

			const { refreshToken, accessToken } = await Jwt.createTokens(
				jwtUserPayload
			);

			/**
			 * @info
			 * update refresh token for user
			 */
			await UserModel.update({ token: refreshToken }, { where: { id } });

			const userData = {
				...jwtUserPayload,
				refreshToken,
				accessToken
			};

			return userData;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async signin(input: IUserInput) {
		const { password, email } = input;

		try {
			const user = await UserModel.findOne({ where: { email } });
			if (!user) throw ApiError.badRequest("User with this email was't found");

			const userPassword = user.getDataValue('password');
			const isCorrectPassword = await PasswordService.compare(
				password,
				userPassword
			);
			if (!isCorrectPassword)
				throw ApiError.badRequest("Password isn't correct");

			const id = user.getDataValue('id');
			const jwtUserPayload = {
				id,
				email
			};

			const { refreshToken, accessToken } = await Jwt.createTokens(
				jwtUserPayload
			);

			/**
			 * @info
			 * update refresh token for user
			 */
			await UserModel.update({ token: refreshToken }, { where: { id } });

			const userData = {
				...jwtUserPayload,
				refreshToken,
				accessToken
			};

			return userData;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async logout(token: string) {
		try {
			return await UserModel.update({ token: null }, { where: { token } });
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}

export default new UserService();
