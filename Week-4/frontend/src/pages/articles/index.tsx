import { GetStaticProps, NextPage } from "next";
import React, { useState, useEffect } from 'react';
import SortableTable from "../../components/table/SortableTable";
import data from "../../utils/dummydata.json";
import { IArticle } from "@/models/articleModel";
import axios from "axios";

interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: string;
    doi: string;
    claim: string;
    evidence: string;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "authors", label: "Authors" },
        { key: "source", label: "Source" },
        { key: "pubyear", label: "Publication Year" },
        { key: "doi", label: "DOI" },
        { key: "claim", label: "Claim" },
        { key: "evidence", label: "Evidence" },
    ];

    const [books, setBooks] = useState<IArticle[]>([]);

    useEffect(() => {
        axios.get(`api/articles`)
            .then((res) => {
                setBooks(res.data);
            })
            .catch(() => {
                console.log('Error from ShowBookList');
            });
    }, []);

    return (
        <div className="container">
            <h1>Articles Index Page</h1>
            <p>Page containing a table of articles:</p>
            <SortableTable headers={headers} data={books} />
        </div>
    );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
    // Map the data to ensure all articles have consistent property names
    const articles = data.articles.map((article) => ({
        id: article.id ?? article._id,
        title: article.title,
        authors: article.authors,
        source: article.source,
        pubyear: article.pubyear,
        doi: article.doi,
        claim: article.claim,
        evidence: article.evidence,
    }));

    return {
        props: {
            articles,
        },
    };
};

export default Articles;