import express from 'express';
import {limitOrder} from "../orders/limitOrder";

const route = express.Router();

route.post('/limit-order', limitOrder);

export {route};
