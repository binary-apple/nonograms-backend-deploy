"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const nonograms_controller_1 = require("./controllers/nonograms-controller");
exports.router = express_1.default.Router();
exports.router.get('/nonograms', nonograms_controller_1.getAllNonograms);
exports.router.get('/nonograms/random', nonograms_controller_1.getRandomNonogram);
exports.router.get('/nonograms/:id', nonograms_controller_1.getNonogram);
exports.router.post('/nonograms', nonograms_controller_1.addNonogram);
