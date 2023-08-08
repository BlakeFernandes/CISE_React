"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const books_1 = __importDefault(require("./routes/api/books"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/books', books_1.default);
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
