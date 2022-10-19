export interface IJtwData {
	id: number;
	email: string;
}

export interface IJwtTokens {
	accessToken: string;
	refreshToken: string;
}

export interface IDecoded {
	id: string;
	email: string;
}

export interface ITokensDecode {
	decoded: IDecoded;
	err: string;
	expired: boolean;
}
