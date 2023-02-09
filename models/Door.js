import mongoose from "mongoose";

const Door = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    makeDate: { type: Date },
    addDate: { type: Date, default: Date.now },
    image: { type: String, required: true },
    category: { type: String, default: 'Прочее' },
    article: { type: String, required: true, unique: true }, 
    country: { type: String },
    color: { type: String },
    description: { type: String },
    sizes: { type: Array },
    material: { type: String },
    construction: { type: String },
    surface: { type: String },
    specs: { type: Array, },
});

export default mongoose.model('Door', Door);
