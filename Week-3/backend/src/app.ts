import express, { Request, Response } from "express";
import connectDB from "./db";
import cors from "cors";
import books from "./routes/api/books";

const app = express();

connectDB();

app.use(cors({ origin: true }));

app.get("/", (req: Request, res: Response) => res.send("Hello world!"));
app.use("/api/books", books);

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
