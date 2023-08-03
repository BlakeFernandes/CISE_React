import express, { Request, Response } from 'express';
import Book from '../../models/books';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.json({limit: '50mb'}));

router.get('/test', (req: Request, res: Response) => res.send('book route testing!'));

router.get('/', (req: Request, res: Response) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json({ nobooksfound: 'No Books found' }));
});

router.get('/:id', (req: Request, res: Response) => {
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json({ nobookfound: 'No Book found' }));
});

router.post('/', (req: Request, res: Response) => {
  Book.create(req.body)
    .then((book) => res.json({ msg: 'Book added successfully' }))
    .catch((err) => res.status(400).json({ error: 'Unable to add this book' }));
});

router.put('/:id', (req: Request, res: Response) => {
  Book.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ msg: 'Updated successfully' }))
    .catch((err) => res.status(400).json({ error: 'Unable to update the Database' }));
});

router.delete('/:id', (req: Request, res: Response) => {
  Book.findByIdAndRemove(req.params.id, req.body)
    .then((book) => res.json({ mgs: 'Book entry deleted successfully' }))
    .catch((err) => res.status(404).json({ error: 'No such a book' }));
});

export default router;
