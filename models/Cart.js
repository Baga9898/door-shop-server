import mongoose from 'mongoose';

const Cart = new mongoose.Schema({
    userUniqueId: { type: String, required: true, unique: true },
    cartDoors: { type: Array, ref: 'Door', default: [] },
});

export default mongoose.model('Cart', Cart);
