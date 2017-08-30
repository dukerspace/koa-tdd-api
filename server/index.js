const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const articlesRoutes = require("./routes/articles.routes");

const app = new Koa();
const PORT = process.env.PORT || 8081;

app.use(bodyParser());
app.use(articlesRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
