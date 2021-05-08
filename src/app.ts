import fastify from "fastify";

const server = fastify();

server.listen(8080, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

server.get("/translation", async (_request, _replay) => {
  // replay.send("hello");
  return "hello world";
});

// server.post("/translation", async (request, replay) => {
//   return "oig";
// });
