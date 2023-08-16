import articleModel from "@/models/articleModel";
import connectDB from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectDB();

    if (req.method == "GET") {
        articleModel.find()
        .then((articles) => res.status(200).json(articles))
        .catch((err) => res.status(404).json({ error: 'No Articles found' }));
        return;
    } else if (req.method == "POST") {
        articleModel.create(req.body)
        .then((articles) => res.status(200).json({ msg: 'Article added successfully' }))
        .catch((err) => res.status(400).json({ error: 'Unable to add this article' }));
        return;
    }

    return res.status(401).json({ error: "Invalid Method" });
}