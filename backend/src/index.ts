import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { route } from './routes/routes';
import {
    errorLogger,
    errorResponder,
    invalidPathHandler,
    requestLogger
} from "./middleware/handlers";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT = process.env.PORT;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger)
app.use('/', route);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
