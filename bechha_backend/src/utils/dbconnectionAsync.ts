import mongoose, { Connection } from "mongoose";
/**
 * Promisifies mongoose.createConnection
 * @param uri - The MongoDB connection string
 * @param options - The connection options
 * @returns A promise that resolves to the Mongoose connection
 */
const createConnectionAsync = (uri: string, options = {}): Promise<Connection> => {
	return new Promise((resolve, reject) => {
		const connection = mongoose.createConnection(uri, options);

		connection.on("connected", () => {
			resolve(connection);
		});

		connection.on("error", (err) => {
			reject(err);
		});
	});
};

export default createConnectionAsync;
