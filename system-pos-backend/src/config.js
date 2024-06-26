export const PORT = process.env.PORT || 4000;
export const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
export const TOKEN_SECRET =
	process.env.TOKEN_SECRET || 'a806P3dD1F4HIdik8FsuCr4wtIfFMko4eVYAp9tCDwWF4v6ijy5GfHrs6ci35aQx';
export const DEFAULT_CONFIG = {
	host: 'localhost',
	user: 'industrias-londoño',
	port: 3306,
	password: '12345',
	database: 'system_pos_db',
};
