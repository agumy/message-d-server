import fastify from "fastify";
import { launch, translation } from "./service/translation-service";

const server = fastify();

launch();

server.register(require("fastify-formbody"));

server.register(require("fastify-cors"), {
  origin: true,
});

server.listen(8080, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

server.post<{ Body: { q: string | string[] }; Response: string[] }>(
  "/translation",
  async (request, reply) => {
    const { body } = request;

    const queries = typeof body.q === "string" ? [body.q] : body.q;

    const result = await Promise.all(queries.map((q) => translation(q)));

    reply
      .code(200)
      .header("Content-Type", "application/json; charset=UTF-8")
      .send(result);
  }
);
