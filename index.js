import * as dotenv from 'dotenv';
import cors        from 'cors';
import express     from 'express';
import mongoose    from 'mongoose';

import authRouter  from './routes/authRouter.js';
import rolesRouter from './routes/rolesRouter.js';
import usersRouter from './routes/usersRouter.js';

dotenv.config();

const PORT = process.env.PORT || 5000; 
const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/api', rolesRouter);
app.use('/api', usersRouter);

mongoose.set("strictQuery", true);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

        app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

startServer();
