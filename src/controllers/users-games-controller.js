"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserGame = exports.getAllUserGames = exports.getUserGame = void 0;
const firestore_1 = require("firebase/firestore");
const db_1 = require("../db");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const types_1 = require("../types");
function getUidByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(token);
        return decodedToken.uid;
    });
}
const getUserGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!('token' in req.headers) || !req.headers.token) {
            throw new Error('Token was not sent');
        }
        const token = req.headers.token;
        const uid = yield getUidByToken(token);
        // const uid = '7ZC8MeA7LsbtfA8ogBsyqyJiRSp2';
        const id = req.params.id;
        const q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, 'users-games'), (0, firestore_1.where)('userId', '==', `${uid}`), (0, firestore_1.where)('nonogramId', '==', `${id}`));
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const response = [];
        querySnapshot.forEach((document) => { response.push((0, types_1.parseUsersGame)(document.data())); });
        if (response.length === 0)
            res.status(404).send('User has no such saved game');
        else
            res.send({ data: {
                    bestTime: response[0].bestTime,
                    currentGame: {
                        id: response[0].nonogramId,
                        state: response[0].state,
                        currentUserSolution: response[0].currentUserSolution,
                        currentTime: response[0].currentTime,
                        currentUserRows: response[0].currentUserRows,
                        currentUserColumns: response[0].currentUserColumns
                    }
                } });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(404).send(err.message);
    }
});
exports.getUserGame = getUserGame;
const getAllUserGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!('token' in req.headers) || !req.headers.token) {
            throw new Error('Token was not sent');
        }
        const token = req.headers.token;
        const uid = yield getUidByToken(token);
        // const uid = '7ZC8MeA7LsbtfA8ogBsyqyJiRSp2';
        const q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, 'users-games'), (0, firestore_1.where)('userId', '==', `${uid}`));
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const response = [];
        querySnapshot.forEach((document) => { response.push((0, types_1.parseUsersGame)(document.data())); });
        res.send({ data: response.map((respI) => {
                return {
                    bestTime: respI.bestTime,
                    currentGame: {
                        id: respI.nonogramId,
                        state: respI.state,
                        currentUserSolution: respI.currentUserSolution,
                        currentTime: respI.currentTime,
                        currentUserRows: respI.currentUserRows,
                        currentUserColumns: respI.currentUserColumns
                    }
                };
            }) });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(404).send(err.message);
    }
});
exports.getAllUserGames = getAllUserGames;
const addUserGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!('token' in req.headers) || !req.headers.token) {
            throw new Error('Token was not sent');
        }
        const token = req.headers.token;
        const uid = yield getUidByToken(token);
        // const uid = '7ZC8MeA7LsbtfA8ogBsyqyJiRSp2';
        const id = req.params.id;
        const usersGame = req.body;
        const usersGamesCol = (0, firestore_1.collection)(db_1.db, 'users-games');
        const q = (0, firestore_1.query)(usersGamesCol, (0, firestore_1.where)('userId', '==', `${uid}`), (0, firestore_1.where)('nonogramId', '==', `${id}`));
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const savedGame = [];
        querySnapshot.forEach((document) => { savedGame.push({ usersGame: (0, types_1.parseUsersGame)(document.data()), id: document.id }); });
        if (savedGame.length === 0) {
            yield (0, firestore_1.addDoc)(usersGamesCol, (0, types_1.stringifyUsersGame)({
                userId: uid,
                nonogramId: usersGame.currentGame.id,
                bestTime: usersGame.bestTime,
                state: usersGame.currentGame.state,
                currentUserSolution: usersGame.currentGame.currentUserSolution,
                currentTime: usersGame.currentGame.currentTime,
                currentUserRows: usersGame.currentGame.currentUserRows,
                currentUserColumns: usersGame.currentGame.currentUserColumns,
            }));
            res.send('Nonogram saved successfully');
            return;
        }
        else {
            yield (0, firestore_1.setDoc)((0, firestore_1.doc)(db_1.db, 'users-games', savedGame[0].id), (0, types_1.stringifyUsersGame)({
                userId: uid,
                nonogramId: usersGame.currentGame.id,
                bestTime: usersGame.bestTime,
                state: usersGame.currentGame.state,
                currentUserSolution: usersGame.currentGame.currentUserSolution,
                currentTime: usersGame.currentGame.currentTime,
                currentUserRows: usersGame.currentGame.currentUserRows,
                currentUserColumns: usersGame.currentGame.currentUserColumns,
            }));
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(400).send(err.message);
        }
    }
});
exports.addUserGame = addUserGame;
