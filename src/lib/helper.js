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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtVerifyHelper = exports.matchPassword = exports.encryptPassword = void 0;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt(10);
    const hash = yield bcrypt.hash(password, salt);
    return hash;
});
exports.encryptPassword = encryptPassword;
const matchPassword = (password, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let bla;
    try {
        bla = yield bcrypt.compare(password, savedPassword);
    }
    catch (e) {
        console.log(e);
    }
    return bla;
});
exports.matchPassword = matchPassword;
const JwtVerifyHelper = (authorization) => __awaiter(void 0, void 0, void 0, function* () {
    let token = '';
    console.log(authorization);
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
    }
    console.log('before');
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_q);
    }
    catch (e) {
        console.log("CATCH", e);
        return { error: e };
    }
    console.log(token, decodedToken, decodedToken.id);
    if (!token || !decodedToken.id) {
        return { error: 'token missing or invalid' };
    }
    return decodedToken;
});
exports.JwtVerifyHelper = JwtVerifyHelper;
