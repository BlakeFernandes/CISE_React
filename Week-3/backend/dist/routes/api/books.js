"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("../../models/books"));
const body_parser_1 = __importDefault(require("body-parser"));
const router = express_1.default.Router();
router.use(body_parser_1.default.json({ limit: '50mb' }));
router.get('/test', (req, res) => res.send('book route testing!'));
router.get('/', (req, res) => {
    books_1.default.find()
        .then((books) => res.json(books))
        .catch((err) => res.status(404).json({ nobooksfound: 'No Books found' }));
});
router.get('/:id', (req, res) => {
    books_1.default.findById(req.params.id)
        .then((book) => res.json(book))
        .catch((err) => res.status(404).json({ nobookfound: 'No Book found' }));
});
router.post('/', (req, res) => {
    books_1.default.create(req.body)
        .then((book) => res.json({ msg: 'Book added successfully' }))
        .catch((err) => res.status(400).json({ error: 'Unable to add this book' }));
});
router.put('/:id', (req, res) => {
    books_1.default.findByIdAndUpdate(req.params.id, req.body)
        .then((book) => res.json({ msg: 'Updated successfully' }))
        .catch((err) => res.status(400).json({ error: 'Unable to update the Database' }));
});
router.delete('/:id', (req, res) => {
    books_1.default.findByIdAndRemove(req.params.id, req.body)
        .then((book) => res.json({ mgs: 'Book entry deleted successfully' }))
        .catch((err) => res.status(404).json({ error: 'No such a book' }));
});
exports.default = router;
