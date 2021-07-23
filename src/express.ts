import express from "express";
import cors from 'cors'
import { launch, translation } from "./service/translation-service";
import bodyParser from 'body-parser';

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cors());


server.listen(8080, async ()=> {
  await launch(15);
  console.log(`Completed Puppeteer launching`);
});

server.post(
  "/translation",
  async (request, res) => {
    const { body } = request;

    const queries = typeof body.q === "string" ? [body.q] : body.q as string[];

    const result = await Promise.all(queries.map((q) => translation(q)));

    res
      .status(200)
      .header("Content-Type", "application/json; charset=UTF-8")
      .send(result);
  }
);
