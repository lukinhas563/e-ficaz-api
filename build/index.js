"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const port = process.env.PORT;
server_1.default.listen(port || 8081, () => {
    console.log(`Servidor rodando na porta http://localhost:${port || 8081}`);
});