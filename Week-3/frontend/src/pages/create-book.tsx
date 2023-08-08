import React, { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import axios from 'axios';

interface IBook {
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date: string;
    publisher: string;
}

const CreateBook = () => {
    const router = useRouter();
    const [book, setBook] = useState<IBook>({
        title: '',
        isbn: '',
        author: '',
        description: '',
        published_date: '',
        publisher: '',
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        axios
            .post('http://localhost:8082/api/books', book)
            .then(() => {
                setBook({
                    title: '',
                    isbn: '',
                    author: '',
                    description: '',
                    published_date: '',
                    publisher: '',
                });

                router.push('/');
            })
            .catch(() => {
                console.log('Error in CreateBook!');
            });
    };

    return (
        <div className='CreateBook'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-8 m-auto'>
                        <br />
                        <Link href='/' className='btn btn-outline-warning float-left'>
                            Show BooK List
                        </Link>
                    </div>
                    <div className='col-md-8 m-auto'>
                        <h1 className='display-4 text-center'>Add Book</h1>
                        <p className='lead text-center'>Create new book</p>

                        <form noValidate onSubmit={onSubmit}>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Title of the Book'
                                    name='title'
                                    className='form-control'
                                    value={book.title}
                                    onChange={onChange}
                                />
                            </div>
                            <br />

                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='ISBN'
                                    name='isbn'
                                    className='form-control'
                                    value={book.isbn}
                                    onChange={onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Author'
                                    name='author'
                                    className='form-control'
                                    value={book.author}
                                    onChange={onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Describe this book'
                                    name='description'
                                    className='form-control'
                                    value={book.description}
                                    onChange={onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <input
                                    type='date'
                                    placeholder='published_date'
                                    name='published_date'
                                    className='form-control'
                                    value={book.published_date}
                                    onChange={onChange}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Publisher of this Book'
                                    name='publisher'
                                    className='form-control'
                                    value={book.publisher}
                                    onChange={onChange}
                                />
                            </div>

                            <input
                                type='submit'
                                className='btn btn-outline-warning btn-block mt-4'
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBook;