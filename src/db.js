"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const config_1 = require("./config");
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// import serviceAccount from "../environment-variables.json";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { type, projectId, privateKeyId, privateKey, clientEmail, clientId, authUri, tokenUri, auth_provider_x509_cert_url, client_x509_cert_url } = process.env;
const serviceAccount = {
    type,
    projectId,
    privateKeyId,
    privateKey,
    clientEmail,
    clientId,
    authUri,
    tokenUri,
    auth_provider_x509_cert_url,
    client_x509_cert_url
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const app = (0, app_1.initializeApp)(config_1.config.firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
