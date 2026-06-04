// const { createServer } = require("http");
// const { parse } = require("url");
// const next = require("next");

// const app = next({ dev: process.env.NODE_ENV !== "production" });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   });

//   global.__NEXT_APP_HTTP_SERVER = { server };

//   server.listen(3000, () => {
//     console.log("> Ready on http://localhost:3000");
//   });
// });
