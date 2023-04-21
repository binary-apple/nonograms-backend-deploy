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
exports.addNonogram = exports.getAllNonograms = exports.getRandomNonogram = exports.getNonogram = void 0;
const firestore_1 = require("firebase/firestore");
const db_1 = require("../db");
const types_1 = require("../types");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const getNonogram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const docRef = (0, firestore_1.doc)(db_1.db, "nonograms", id);
        const docSnap = yield (0, firestore_1.getDoc)(docRef);
        if (docSnap.exists()) {
            res.send({
                id: id,
                nonogram: (0, types_1.parseNonogram)(docSnap.data()),
            });
        }
        else {
            throw new Error("NOT FOUND");
        }
    }
    catch (err) {
        if (err instanceof Error)
            res.status(404).send(err.message);
    }
});
exports.getNonogram = getNonogram;
const getRandomNonogram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startedOrFinishedGamesId = [];
        if (('token' in req.headers) && req.headers.token) {
            const token = req.headers.token;
            const { uid } = (yield firebase_admin_1.default.auth().verifyIdToken(token));
            const usersGamesCol = (0, firestore_1.collection)(db_1.db, 'users-games');
            const qStarted = (0, firestore_1.query)(usersGamesCol, (0, firestore_1.where)('userId', '==', `${uid}`), (0, firestore_1.where)('bestTime', '==', null), (0, firestore_1.where)('state', '==', 'started'));
            const qFinished = (0, firestore_1.query)(usersGamesCol, (0, firestore_1.where)('userId', '==', `${uid}`), (0, firestore_1.where)('bestTime', '!=', null));
            const [snapStart, snapFinish] = yield Promise.all([
                (0, firestore_1.getDocs)(qStarted),
                (0, firestore_1.getDocs)(qFinished)
            ]);
            snapStart.forEach((document) => { startedOrFinishedGamesId.push(document.data().nonogramId); });
            snapFinish.forEach((document) => { startedOrFinishedGamesId.push(document.data().nonogramId); });
        }
        const q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, 'nonograms'));
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const response = [];
        querySnapshot.forEach((document) => {
            if (!startedOrFinishedGamesId.includes(document.id))
                response.push({ id: document.id, nonogram: (0, types_1.parseNonogram)(document.data()) });
        });
        const docId = Math.floor(Math.random() * response.length);
        res.send({ id: response[docId].id, nonogram: response[docId].nonogram });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(404).send(err.message);
    }
});
exports.getRandomNonogram = getRandomNonogram;
const getAllNonograms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let q;
        if (!req.query.limit) {
            q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, "nonograms"));
        }
        else if (!req.query.lastId) {
            q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, "nonograms"), (0, firestore_1.orderBy)("title.en"), (0, firestore_1.limit)(Number(req.query.limit)));
        }
        else {
            q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, "nonograms"), (0, firestore_1.orderBy)("title.en"), (0, firestore_1.startAfter)(yield (0, firestore_1.getDoc)((0, firestore_1.doc)(db_1.db, "nonograms", req.query.lastId))), (0, firestore_1.limit)(Number(req.query.limit)));
        }
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const response = [];
        querySnapshot.forEach((document) => {
            response.push({
                id: document.id,
                nonogram: (0, types_1.parseNonogram)(document.data()),
            });
        });
        res
            .setHeader("lastId", response[response.length - 1].id)
            .setHeader("Access-Control-Expose-Headers", "lastId")
            .send(response);
        return;
    }
    catch (err) {
        if (err instanceof Error)
            res.status(404).send(err.message);
    }
});
exports.getAllNonograms = getAllNonograms;
const addNonogram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nonogram = req.body;
        const nonogramsCol = (0, firestore_1.collection)(db_1.db, "nonograms");
        yield (0, firestore_1.addDoc)(nonogramsCol, (0, types_1.stringifyNonogram)(nonogram));
        res.send("Nonogram saved successfully");
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(400).send(err.message);
        }
    }
});
exports.addNonogram = addNonogram;
