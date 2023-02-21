"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pool = require('../database');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.loginRouter = express_1.default.Router();
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
exports.loginRouter.get('/', (_req, res) => {
    res.send('THE LOGIN');
});
exports.loginRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = request;
    const { username, password } = body;
    const rows = yield pool.query('SELECT * FROM users WHERE username = ?', [username]);
    let user;
    user = rows[0];
    if (user) {
        const passwordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordCorrect) {
            response.status(401).json({
                error: 'invalid user or password'
            });
        }
        else {
            console.log(user);
            const userForToken = {
                id: user.id,
                username: user.username
            };
            console.log(userForToken, "----------2---");
            const sec = process.env.SECRET_q;
            const token = jsonwebtoken_1.default.sign(userForToken, sec, {
                expiresIn: 60 * 60 * 24 * 7
            });
            console.log(userForToken);
            response.send({
                name: user.name,
                username: user.username,
                token
            });
        }
    }
    else {
        response.status(401).json({
            error: 'invalid user or password'
        });
    }
}));
