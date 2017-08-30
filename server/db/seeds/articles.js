exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("articles")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("articles").insert([
        {
          title:
            "An Introduction to Building Test Driven RESTful APIs with Koa",
          body:
            "An Introduction to Building Test Driven RESTful APIs with Koa ... body",
          tags: "koa, tdd, nodejs"
        },
        {
          title: "Going real time with Socket.IO, Node.Js and React",
          body: "Going real time with Socket.IO, Node.Js and React ... body",
          tags: "socket.io, nodejs, react"
        }
      ]);
    });
};
