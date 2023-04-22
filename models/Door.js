import mongoose from 'mongoose';

import { defaultCategory } from '../constants.js';

const Door = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    makeDate: { type: Date },
    addDate: { type: Date, default: Date.now },
    image: { type: String, required: true },
    category: { type: String, default: defaultCategory },
    article: { type: String, required: true, unique: true }, 
    country: { type: String },
    color: { type: String },
    description: { type: String },
    sizes: { type: Array },
    withLeftRight: { type: Boolean },
    material: { type: String },
    construction: { type: String },
    surface: { type: String },
    specs: { type: Array, },
});

export default mongoose.model('Door', Door);
