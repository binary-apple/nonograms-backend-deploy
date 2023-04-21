"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const users_games_controller_1 = require("./controllers/users-games-controller");
exports.router = express_1.default.Router();
exports.router.get('/users-games', users_games_controller_1.getAllUserGames);
exports.router.get('/users-games/:id', users_games_controller_1.getUserGame);
exports.router.post('/users-games/:id', users_games_controller_1.addUserGame);
