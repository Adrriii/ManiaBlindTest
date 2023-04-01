export interface OsuEndpoint {
	call(...args: object[] | number[]): object | number
}