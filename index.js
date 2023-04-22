import * as dotenv from 'dotenv';
import bodyParser  from 'body-parser';
import cors        from 'cors';
import express     from 'express';
import mongoose    from 'mongoose';

import { corsError }       from './texts.js';
import * as constants      from './constants.js';
import authRouter          from './routes/authRouter.js';
import doorRouter          from './routes/doorRouter.js'
import mailRouter          from './routes/mailRouter.js';
import rolesRouter         from './routes/rolesRouter.js';
import usersRouter         from './routes/usersRouter.js';

dotenv.config();

const PORT = process.env.PORT || 5000; 
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (constants.accessWhiteList.indexOf(origin) === -1) {
            return callback(new Error(corsError), false);
        }

        return callback(null, true);
    },
}));

app.use(constants.apiPath, authRouter);
app.use(constants.apiPath, rolesRouter);
app.use(constants.apiPath, usersRouter);
app.use(constants.apiPath, doorRouter);
app.use(constants.apiPath, mailRouter);

mongoose.set('strictQuery', true);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

startServer();
