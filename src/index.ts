import "./loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import { app } from "./server/index.js";
import connectToDataBase from "./database/connectToDataBase.js";

const debug = createDebug("social-network-api:root");

const port = process.env.PORT ?? 4000;
const mongoDbConnection = process.env.MONGODB_CONNECTION;

if (!mongoDbConnection) {
  debug(chalk.red("Missing environment variables"));
  process.exit(1);
}

app.listen(port, () => {
  debug(chalk.green(`Server up in http://localhost:${port}`));
});

try {
  await connectToDataBase(mongoDbConnection);
  debug(chalk.green("Connected to database"));
} catch (error: unknown) {
  debug(chalk.red(`Error connecting to database: ${(error as Error).message}`));
}
