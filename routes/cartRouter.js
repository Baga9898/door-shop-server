import { Router } from 'express';

import * as constants     from '../constants.js';
import * as texts         from '../texts.js';
import Cart               from '../models/Cart.js';

const router = new Router();
const basePath = constants.cartPath;

router.post(basePath, async(req, res) => {
    try {
        const { uniqueUserId } = req.body;
        const cart = new Cart({ 
            userUniqueId: uniqueUserId,
            cartDoors: [], 
        });
        await cart.save();
        return res.json(cart);
    } catch (error) {
        return res.json(error);
    }
});

router.get(basePath, async(req, res) => {
    try {
        const allCarts = await Cart.find();
        return res.json(allCarts);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${basePath}/:id`, async(req, res) => {
    try {
        const uniqueId = req.params.id;
        !uniqueId && res.status(400).json({ message: texts.idDoesNotExist });
        const cart = await Cart.find({"userUniqueId": uniqueId});
        return res.json(cart);
    } catch (error) {
        return res.json(error);
    }
});


router.put(`${basePath}/:id`, async(req, res) => {
    try {
        const uniqueId = req.params.id;
        const { cartDoors, doorForCart } = req.body;
        const cart = ({ 
            uniqueUserId: uniqueId,
            cartDoors: [...cartDoors, doorForCart],  
        });
        !uniqueId && res.status(400).json({message: texts.idDoesNotExist});
        await Cart.findOneAndUpdate({"userUniqueId": uniqueId}, cart, {new: true});
        return res.json({doorForCart});
    } catch (error) {
        return res.json(error);
    }
});

router.put(`${basePath}/edit/:id`, async(req, res) => {
    try {
        const uniqueId = req.params.id;
        const { currentDoorId, chosenSize, direction, fullPrice, count } = req.body;
        const currentCart = await Cart.find({"userUniqueId": uniqueId});
        const cartDoors = currentCart[0].cartDoors;
        const currentDoor = cartDoors.filter(door => door._id === currentDoorId
            && door.chosenSize === chosenSize 
            && (door.direction && door.direction === direction)
        )[0];

        const newDoor = {...currentDoor, fullPrice: fullPrice, count: count};
        const currentDoorIndex = cartDoors.findIndex(door => door._id === newDoor._id
            && door.chosenSize === newDoor.chosenSize 
            && (door.direction && door.direction === newDoor.direction)
        );
        
        cartDoors[currentDoorIndex] = newDoor;
        const newCart = {
            uniqueUserId: uniqueId,
            cartDoors: cartDoors, 
        };

        await Cart.findOneAndUpdate({"userUniqueId": uniqueId}, newCart, {new: true});
        return res.json(newCart);
    } catch (error) {
        return res.json(error);
    }
});

router.put(`${basePath}/delete/:id`, async(req, res) => {
    try {
        const uniqueId = req.params.id;
        const { cartDoors } = [];
        const cart = ({ 
            uniqueUserId: uniqueId,
            cartDoors: cartDoors,  
        });
        !uniqueId && res.status(400).json({message: texts.idDoesNotExist});
        await Cart.findOneAndUpdate({"userUniqueId": uniqueId}, cart, {new: true});
        return res.json({
            uniqueUserId: uniqueId,
            cartDoors: cartDoors, 
        });
    } catch (error) {
        return res.json(error);
    }
});

export default router;
