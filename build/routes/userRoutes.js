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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const helper_1 = require("../lib/helper");
const pool = require('../database');
const jwt = require('jsonwebtoken');
exports.userRouter = express_1.default.Router();
exports.userRouter.get('/', (_req, res) => {
    res.send('THE LOGIN');
});
exports.userRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = request;
    const { username, password, fullname } = body;
    console.log(body);
    const rows = yield pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (user) {
        response.send(401).json({
            error: 'Username already in use'
        });
    }
    console.log("ANTES1");
    let newUser = {
        fullname,
        username,
        password
    };
    newUser.password = yield (0, helper_1.encryptPassword)(password);
    const result = yield pool.query('INSERT INTO users SET ? ', newUser);
    console.log("ANTES");
    newUser.id = result.insertId;
    const userForToken = {
        id: newUser.id,
        username: newUser.username
    };
    console.log(userForToken);
    const token = jwt.sign(userForToken, process.env.SECRET_q, {
        expiresIn: 60 * 60 * 24 * 7
    });
    console.log(token);
    response.send({
        fullname: newUser.fullname,
        username: newUser.username,
        token
    });
}));
