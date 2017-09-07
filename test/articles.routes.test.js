const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const server = require("../server/index");
const knex = require("knex")(config);
const PATH = "/api/v1/articles";

const request = require("supertest");

const sampleObj = {
  title: "A test article",
  body: "The test article's body",
  tags: "test, nodejs"
};

describe("routes: articles", () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run();
      });
  });

  afterEach(() => {
    return knex.migrate.rollback().then(() => {
      server.close();
    });
  });

  describe(`GET ${PATH}`, () => {
    test("should return all the resources", async () => {
      const res = await request(server).get(`${PATH}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual("application/json");
      expect(res.body.data.length).toEqual(2);
      expect(res.body.data[0]).toHaveProperty("id");
      expect(res.body.data[0]).toHaveProperty("title");
      expect(res.body.data[0]).toHaveProperty("body");
      expect(res.body.data[0]).toHaveProperty("tags");
    });
  });

  describe(`GET ${PATH}/:id`, () => {
    test("should return a single resource", async () => {
      const res = await request(server).get(`${PATH}/1`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual("application/json");
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0]).toHaveProperty("id");
      expect(res.body.data[0]).toHaveProperty("title");
      expect(res.body.data[0]).toHaveProperty("body");
      expect(res.body.data[0]).toHaveProperty("tags");
    });
    test("should return an error when the requested resource does not exists", async () => {
      const res = await request(server).get(`${PATH}/9999`);
      expect(res.status).toEqual(404);
      expect(res.type).toEqual("application/json");
      expect(res.body.error).toEqual("The requested resource does not exists");
    });
  });

  describe(`POST ${PATH}`, () => {
    test("should return the newly added resource identifier alongside a Location header", async () => {
      const res = await request(server)
        .post(`${PATH}`)
        .send(sampleObj);
      expect(res.status).toEqual(201);
      expect(res.header).toHaveProperty("location");
      expect(res.type).toEqual("application/json");
      expect(res.body.data.length).toEqual(1);
      expect(typeof res.body.data[0]).toEqual("number");
    });
    test("should return an error when the resource already exists", async () => {
      const res = await request(server)
        .post(`${PATH}`)
        .send({
          title:
            "An Introduction to Building Test Driven RESTful APIs with Koa",
          body:
            "An Introduction to Building Test Driven RESTful APIs with Koa ... body",
          tags: "koa, tdd, nodejs"
        });
      expect(res.status).toEqual(409);
      expect(res.type).toEqual("application/json");
      expect(res.body.error).toEqual("The resource already exists");
    });
  });
});
