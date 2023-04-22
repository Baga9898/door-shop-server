import mongoose from 'mongoose';

import { defaultRole } from '../constants.js';

const Role = new mongoose.Schema({
    name: { type: String, unique: true, default: defaultRole },
    description: { type: String }
});

export default mongoose.model('Role', Role);
