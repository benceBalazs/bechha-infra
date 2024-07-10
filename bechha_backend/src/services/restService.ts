import { LOGGER } from "@/app";
import express from "express";
import cors from "express";
import mainRouter from "@routes/index";
import morgan from "morgan";
import config from "@config/index";

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

app.listen(config.port, () => {
	LOGGER.info(`REST service started on port ${config.port}`);
});

export default app;
