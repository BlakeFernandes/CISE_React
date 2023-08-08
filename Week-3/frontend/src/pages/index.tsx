import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import BookCard from '../components/book';
import { API_URL } from '~/utils/constants';

interface IBook {
    _id: string;
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date: string;
    publisher: string;
    updated_date?: Date;
}

const ShowBookList = () => {
    const [books, setBooks] = useState<IBook[]>([]);

    useEffect(() => {
        axios
            .get(`${API_URL}/books`)
            .then((res) => {
                setBooks(res.data);
            })
            .catch(() => {
                console.log('Error from ShowBookList');
            });
    }, []);

    const bookList =
        books.length === 0
            ? 'there is no book record!'
            : books.map((book, k) => <BookCard book={book} key={k} />);

    return (
        <div className='ShowBookList'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <br />
                        <h2 className='display-4 text-center'>Books List</h2>
                    </div>

                    <div className='col-md-11'>
                        <Link
                            href='/create-book'
                            className='btn btn-outline-warning float-right'
                        >
                            + Add New Book
                        </Link>
                        <br />
                        <br />
                        <hr />
                    </div>
                </div>

                <div className='list'>{bookList}</div>
            </div>
        </div>
    );
};

export default ShowBookList;
