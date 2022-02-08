import fastify from "fastify";
import fetch from "node-fetch";

const server = fastify();

server.register(require("fastify-formbody"));

server.register(require("fastify-cors"), {
  origin: true,
});

server.listen(8080);

server.post<{
  Body: { text: string | string[]; auth_key: string; target_lang: string };
  Response: string[];
}>("/translation", async (request, reply) => {
  const { body } = request;

  const queries = new URLSearchParams();
  const text = typeof body.text === "string" ? [body.text] : body.text;
  for (const value of text) {
    queries.append("text", value);
  }
  queries.append("auth_key", body.auth_key);
  queries.append("target_lang", body.target_lang);
  queries.append("tag_handling", "xml");
  queries.append("ignore_tags", "code,pre");
  queries.append("split_sentences", "nonewlines");
  queries.append("non_splitting_tags", "code,a");
  // const res = await fetch("https://api-free.deepl.com/v2/translate", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   body: queries,
  // });
  const res = await fetch("https://api.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: queries,
  });

  const result = await res.json();

  reply
    .code(200)
    .header("Content-Type", "application/json; charset=UTF-8")
    .send(result);
});
