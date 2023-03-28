
export const GameNotFound: ApiError = {
	error: 'Game not found'
}

export const UserNotFound: ApiError = {
	error: 'User not found'
}

export const InvalidGame: ApiError = {
	error: 'Invalid game'
}

export const InvalidOauth: ApiError = {
	error: 'Invalid Oauth information'
}

export const InvalidOsuUser: ApiError = {
	error: 'Invalid osu! user'
}

export type ApiError = {
	error: string
}