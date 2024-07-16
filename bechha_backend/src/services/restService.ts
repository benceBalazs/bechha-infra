import express from "express";
import cors from "express";
import mainRouter from "@Routes";
import morgan from "morgan";
import { LOGGER } from "@Utils";


//using the logger and its configured transports, to save the logs created by Morgan
const REST_API = (port: number) => {
	const morganStream = {
		write: (text: string) => {
			LOGGER.info(text);
		},
	};
	const app = express();
	app.use(morgan("combined", { stream: morganStream }));
	app.use(cors());
	app.use(express.json());
	app.use("/", mainRouter);
	app.listen(port, () => {
		LOGGER.info(`REST service started on port ${port}`);
	});
	return app;
};

export default REST_API;
