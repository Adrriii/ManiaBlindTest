import mariadb from 'serverless-mysql';

export type RowDataPacket = {
	[key: string]: unknown
};

const dbs = {
	stats: mariadb({
		config: {
			host: process.env.MYSQL_HOST,
			port: parseInt(process.env.MYSQL_PORT as string),
			database: 'stats',
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD
		}
	}),
	blindtest: mariadb({
		config: {
			host: process.env.MYSQL_HOST,
			port: parseInt(process.env.MYSQL_PORT as string),
			database: 'blindtest',
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD
		}
	}),
};

export default async function query(
	query: string,
	values: string[] = [],
	db: 'stats' | 'blindtest' = 'stats'
) : Promise<RowDataPacket[]> {
	const results = await dbs[db].query(query, values);
	await dbs[db].end();
	return results as RowDataPacket[];
}