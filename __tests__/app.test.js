const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const supertest = require("supertest");
const app = require("../app");
const jsonFile = require("../endpoints.json");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    it("200: responds with all available endpoints", () => {
      return supertest(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const { endpoints_available } = res.body;
          expect(jsonFile).toEqual(endpoints_available);
        });
    });
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("200: GET all topics", () => {
        return supertest(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            const { topics } = res.body;
            expect(topics.length).toBe(3);
            topics.forEach((topic, index) => {
              expect(topic).toHaveProperty("description", expect.any(String));
              expect(topic).toHaveProperty("slug", expect.any(String));
              for (const key in topic) {
                expect(topic[key]).toEqual(data.topicData[index][key]);
              }
            });
          });
      });
    });
    describe("POST", () => {
      it("201: return status code 201, POST new topic to database", () => {
        const topicObj = {
          slug: "food",
          description: "anything foody",
        };
        return supertest(app)
          .post("/api/topics")
          .send(topicObj)
          .expect(201)
          .then((res) => {
            const { topic } = res.body;
            expect(topic).toMatchObject({
              slug: "food",
              description: "anything foody",
            });
          });
      });
      it("201: return status code 201, POST new topic (description excluded)", () => {
        const topicObj = {
          slug: "Mandatory",
        };
        return supertest(app)
          .post("/api/topics")
          .send(topicObj)
          .expect(201)
          .then((res) => {
            const { topic } = res.body;
            expect(topic).toMatchObject({
              slug: "Mandatory",
            });
          });
      });
      it("400: return status code 400, Missing Non Null Property (slug)", () => {
        const topicObj = {
          description: "anything foody",
        };
        return supertest(app)
          .post("/api/topics")
          .send(topicObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Missing value on NON NULL property");
          });
      });
      it("400: return status code 400, Missing Non Null Property (Empty Object)", () => {
        const topicObj = {};
        return supertest(app)
          .post("/api/topics")
          .send(topicObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Missing value on NON NULL property");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("200: GET all articles", () => {
        return supertest(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(13);
            articles.forEach((article) => {
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
              expect(article).not.toHaveProperty("body");
            });
          });
      });
      it("200: GET all articles should be sorted by date by default (desc)", () => {
        return supertest(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("200: return status code 200, FILTER article data by specified topic", () => {
        return supertest(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(1);
            expect(articles[0].topic).toBe("cats");
          });
      });
      it("200: return status code 200, valid topic but no articles associated with it", () => {
        return supertest(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(0);
            expect(articles).toEqual([]);
          });
      });
      it("404: return status code 404, Invalid topic query", () => {
        return supertest(app)
          .get("/api/articles?topic=abc")
          .expect(404)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Not Found");
          });
      });
      it("404: return status code 404, Empty topic query", () => {
        return supertest(app)
          .get("/api/articles?topic=")
          .expect(404)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Not Found");
          });
      });
      it("200: return status code 200, SORT data by the requested query", () => {
        return supertest(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("article_id", { descending: true });
          });
      });
      it("400: return status code 400, SORT query Bad Request (invalid query)", () => {
        return supertest(app)
          .get("/api/articles?sort_by=abcabc")
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Bad Request");
          });
      });
      it("200: return status code 200, ORDER data by the requested query", () => {
        return supertest(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("created_at", { descending: false });
          });
      });
      it("200: return status code 200, ORDER data by the requested query", () => {
        return supertest(app)
          .get("/api/articles?order=desc")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("400: return status code 400, ORDER query Bad Request (invalid query)", () => {
        return supertest(app)
          .get("/api/articles?order=abcabc")
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Bad Request");
          });
      });
      it("200: return status code 200, combining both SORT and ORDER queries", () => {
        return supertest(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("article_id", { descending: false });
          });
      });
    });
    describe("POST", () => {
      it("201: return status code 201, POST new article into database and return newly created article", () => {
        const articleObj = {
          title: "The Cat and Mouse",
          topic: "cats",
          author: "rogersop",
          body: "My Favourite Show",
          article_img_url:
            "https://wallpapers.com/images/hd/tom-and-jerry-cat-and-mouse-mefpo05w7m11ubkh.jpg",
        };
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(201)
          .then((res) => {
            const { article } = res.body;
            expect(article).toMatchObject({
              article_id: 14,
              title: "The Cat and Mouse",
              topic: "cats",
              author: "rogersop",
              body: "My Favourite Show",
              votes: 0,
              comment_count: 0,
              article_img_url:
                "https://wallpapers.com/images/hd/tom-and-jerry-cat-and-mouse-mefpo05w7m11ubkh.jpg",
            });
            expect(article).toHaveProperty("created_at", expect.any(String));
          });
      });
      it("201: return status code 201, POST new article into database and return newly created article (no URL)", () => {
        const articleObj = {
          title: "The Sponge",
          topic: "mitch",
          author: "rogersop",
          body: "My 2nd Favourite Show",
        };
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(201)
          .then((res) => {
            const { article } = res.body;
            expect(article).toMatchObject({
              article_id: 15,
              title: "The Sponge",
              topic: "mitch",
              author: "rogersop",
              body: "My 2nd Favourite Show",
              votes: 0,
              comment_count: 0,
              article_img_url:
                "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
            });
            expect(article).toHaveProperty("created_at", expect.any(String));
          });
      });
      it("400: return status code 400, Missing Non Null Property (title)", () => {
        const articleObj = {
          topic: "cats",
          author: "rogersop",
          body: "My 2nd Favourite Show",
        };
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Missing value on NON NULL property");
          });
      });
      it("400: return status code 400, Missing Non Null Property (body)", () => {
        const articleObj = {
          title: "The Sponge",
          topic: "cats",
          author: "rogersop",
        };
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Missing value on NON NULL property");
          });
      });
      it("400: return status code 400, Invalid foreign key reference (topic)", () => {
        const articleObj = {
          title: "The Sponge",
          topic: "pineapple",
          author: "rogersop",
          body: "My 2nd Favourite Show",
        };
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe(
              "FOREIGN KEY VIOLATION, referenced row does not exist in the referenced table"
            );
          });
      });
      it("400: return status code 400, Invalid foreign key reference (author)", () => {
        const articleObj = {
          title: "The Sponge",
          topic: "cats",
          author: "krabs",
          body: "My 2nd Favourite Show",
        };
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe(
              "FOREIGN KEY VIOLATION, referenced row does not exist in the referenced table"
            );
          });
      });
      it("400: return status code 400, Empty Object", () => {
        const articleObj = {};
        return supertest(app)
          .post("/api/articles")
          .send(articleObj)
          .expect(400)
          .then((res) => {
            const { msg } = res.body;
            expect(msg).toBe("Missing value on NON NULL property");
          });
      });
    });
    describe("/:article_id", () => {
      describe("GET", () => {
        it("200: GET article at specific id", () => {
          return supertest(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
              const { article } = res.body;
              expect(article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        it("400: Bad Request when attempting to GET article", () => {
          return supertest(app)
            .get("/api/articles/abc")
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Bad Request");
            });
        });
        it("404: Not Found when attempting to GET article", () => {
          return supertest(app)
            .get("/api/articles/10000")
            .expect(404)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Not Found");
            });
        });
        it("200: GET article at specific id with a new property 'comment_count", () => {
          return supertest(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
              const { article } = res.body;
              expect(article).toMatchObject({
                comment_count: 1,
              });
            });
        });
      });
      describe("PATCH", () => {
        it("200: returns a 200 status code, PATCH votes property by requested amount (increase) and returns the updated article at the specified id", () => {
          const votesObj = { inc_votes: 1 };
          return supertest(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(200)
            .then((res) => {
              const { article } = res.body;
              expect(article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        it("200: returns a 200 status code, PATCH votes property by requested amount (decrease) and returns the updated article at the specified id", () => {
          const votesObj = { inc_votes: -11 };
          return supertest(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(200)
            .then((res) => {
              const { article } = res.body;
              expect(article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 90,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        it("400: returns a 400 status code, no object property or property data is sent to the PATCH request", () => {
          const votesObj = {};
          return supertest(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Missing value on NON NULL property");
            });
        });
        it("400: returns a 400 status code, bad property name is sent to the PATCH request", () => {
          const votesObj = { votes: 1 };
          return supertest(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Missing value on NON NULL property");
            });
        });
        it("400: returns a 400 status code, bad property data is sent to the PATCH request", () => {
          const votesObj = { inc_votes: "abc" };
          return supertest(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Bad Request");
            });
        });
        it("404: returns a 404 status code, no id is found when attempting to PATCH request", () => {
          const votesObj = { inc_votes: 2 };
          return supertest(app)
            .patch("/api/articles/1000000")
            .send(votesObj)
            .expect(404)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Not Found");
            });
        });
        it("400: returns a 400 status code, bad id is used when attempting to PATCH request", () => {
          const votesObj = { inc_votes: 2 };
          return supertest(app)
            .patch("/api/articles/abc")
            .send(votesObj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Bad Request");
            });
        });
      });
      describe("/comments", () => {
        describe("GET", () => {
          it("200: GET all comments from specific article id", () => {
            return supertest(app)
              .get("/api/articles/6/comments")
              .expect(200)
              .then((res) => {
                const { comments } = res.body;
                expect(comments.length).toBe(1);
                expect(comments[0]).toMatchObject({
                  comment_id: 16,
                  body: "This is a bad article name",
                  votes: 1,
                  author: "butter_bridge",
                  article_id: 6,
                  created_at: "2020-10-11T15:23:00.000Z",
                });
              });
          });
          it("200: GET all comments from specific article id when no related comments", () => {
            return supertest(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then((res) => {
                const { comments } = res.body;
                expect(comments).toEqual([]);
              });
          });
          it("200: SORT all comments by date (DESC)", () => {
            return supertest(app)
              .get("/api/articles/7/comments")
              .expect(200)
              .then((res) => {
                const { comments } = res.body;
                expect(comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });

          });
          it("400: Bad request when attempting to GET comments by article_id", () => {
            return supertest(app)
              .get("/api/articles/abc/comments")
              .expect(400)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Bad Request");
              });
          });
          it("404: Not found when attempting to GET comments by article_id", () => {
            return supertest(app)
              .get("/api/articles/100000/comments")
              .expect(404)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Not Found");
              });
          });
        });
        describe("POST", () => {
          it("200: returns status code 200, POST new comment into database and returns the inserted comment", () => {
            const commentIns = {
              username: "icellusedkars",
              body: "It is good until chapter 10",
            };
            return supertest(app)
              .post("/api/articles/12/comments")
              .send(commentIns)
              .expect(201)
              .then((res) => {
                const { comment } = res.body;
                expect(comment.comment_id).toEqual(19);
                expect(comment.body).toEqual("It is good until chapter 10");
                expect(comment.article_id).toEqual(12);
                expect(comment.author).toEqual("icellusedkars");
                expect(comment.votes).toEqual(0);
                expect(comment).toHaveProperty(
                  "created_at",
                  expect.any(String)
                );
              });
          });
          it("400: returns status code 400, returns error for missing username when attempting to POST", () => {
            const commentIns = { body: "It is good until chapter 10" };
            return supertest(app)
              .post("/api/articles/12/comments")
              .send(commentIns)
              .expect(400)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Missing value on NON NULL property");
              });
          });
          it("400: returns status code 400, returns error for missing body when attempting to POST", () => {
            const commentIns = { username: "icellusedkars" };
            return supertest(app)
              .post("/api/articles/12/comments")
              .send(commentIns)
              .expect(400)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Missing value on NON NULL property");
              });
          });
          it("400: returns status code 400, returns error for missing username and body when attempting to POST", () => {
            const commentIns = {};
            return supertest(app)
              .post("/api/articles/12/comments")
              .send(commentIns)
              .expect(400)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Missing value on NON NULL property");
              });
          });
          it("400: returns status code 400, returns error for bad username input (does not exist in users table) when attempting to POST", () => {
            const commentIns = {
              username: "abcabc",
              body: "It is good until chapter 10",
            };
            return supertest(app)
              .post("/api/articles/12/comments")
              .send(commentIns)
              .expect(400)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe(
                  "FOREIGN KEY VIOLATION, referenced row does not exist in the referenced table"
                );
              });
          });
          it("400: returns status code 404, returns error for an id that does not exist when attempting to POST", () => {
            const commentIns = {
              username: "icellusedkars",
              body: "It is good until chapter 10",
            };
            return supertest(app)
              .post("/api/articles/12000/comments")
              .send(commentIns)
              .expect(404)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Not Found");
              });
          });
          it("400: returns status code 400, returns error for bad id request when attempting to POST", () => {
            const commentIns = {
              username: "icellusedkars",
              body: "It is good until chapter 10",
            };
            return supertest(app)
              .post("/api/articles/abc/comments")
              .send(commentIns)
              .expect(400)
              .then((res) => {
                const { msg } = res.body;
                expect(msg).toBe("Bad Request");
              });
          });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("DELETE", () => {
        it("204: return status code 204, DELETE comment at specified comment id", () => {
          return supertest(app)
            .delete("/api/comments/2")
            .expect(204)
            .then((res) => {
              expect(res.body).toEqual({});
            });
        });
        it("404: return status code 404, Error when attempting to DELETE comment at same comment_id which has been deleted", () => {
          return supertest(app)
            .delete("/api/comments/2")
            .expect(404)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Not Found");
            });
        });
        it("400: return status code 400, Bad id request when attempting to DELETE comment", () => {
          return supertest(app)
            .delete("/api/comments/abc")
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Bad Request");
            });
        });
        it("404: return status code 404, Id Not Found when attempting to DELETE comment", () => {
          return supertest(app)
            .delete("/api/comments/10000")
            .expect(404)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toEqual("Not Found");
            });
        });
      });
      describe("PATCH", () => {
        it("200: returns a 200 status code, PATCH votes property by requested amount (increase) and returns the updated comment at the specified id", () => {
          const votesobj = { inc_votes: 10 };
          return supertest(app)
            .patch("/api/comments/1")
            .send(votesobj)
            .expect(200)
            .then((res) => {
              const { comment } = res.body;
              expect(comment).toMatchObject({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 26,
                author: "butter_bridge",
                article_id: 9,
                created_at: "2020-04-06T12:17:00.000Z",
              });
            });
        });
        it("200: returns a 200 status code, PATCH votes property by requested amount (decrease) and returns the updated comment at the specified id", () => {
          const votesobj = { inc_votes: -10 };
          return supertest(app)
            .patch("/api/comments/4")
            .send(votesobj)
            .expect(200)
            .then((res) => {
              const { comment } = res.body;
              expect(comment).toMatchObject({
                comment_id: 4,
                body: " I carry a log — yes. Is it funny to you? It is not to me.",
                votes: -110,
                author: "icellusedkars",
                article_id: 1,
                created_at: "2020-02-23T12:01:00.000Z",
              });
            });
        });
        it("400: returns a 400 status code, no object property or property data is sent to the PATCH request", () => {
          const votesobj = {};
          return supertest(app)
            .patch("/api/comments/1")
            .send(votesobj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Missing value on NON NULL property");
            });
        });
        it("400: returns a 400 status code, bad property name is sent to the PATCH request", () => {
          const votesobj = { votes: 1 };
          return supertest(app)
            .patch("/api/comments/1")
            .send(votesobj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Missing value on NON NULL property");
            });
        });
        it("400: returns a 400 status code, bad property data is sent to the PATCH request", () => {
          const votesobj = { inc_votes: "abc" };
          return supertest(app)
            .patch("/api/comments/1")
            .send(votesobj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Bad Request");
            });
        });
        it("404: returns a 404 status code, no id is found when attempting to PATCH request", () => {
          const votesobj = { inc_votes: 1 };
          return supertest(app)
            .patch("/api/comments/100000")
            .send(votesobj)
            .expect(404)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Not Found");
            });
        });
        it("400: returns a 400 status code, bad id is used when attempting to PATCH request", () => {
          const votesobj = { inc_votes: 1 };
          return supertest(app)
            .patch("/api/comments/abcabc")
            .send(votesobj)
            .expect(400)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Bad Request");
            });
        });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("200: return status code 200, GET all users (return all users within the table 'users')", () => {
        return supertest(app)
          .get("/api/users")
          .expect(200)
          .then((res) => {
            const { users } = res.body;
            expect(users.length).toBe(4);
            users.forEach((user, index) => {
              expect(user).toHaveProperty("username", expect.any(String));
              expect(user).toHaveProperty("name", expect.any(String));
              expect(user).toHaveProperty("avatar_url", expect.any(String));
              for (const key in user) {
                expect(user[key]).toEqual(data.userData[index][key]);
              }
            });
          });
      });
    });
    describe("/:username", () => {
      describe("GET", () => {
        it("200: return status code 200, GET all users at specific username", () => {
          return supertest(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then((res) => {
              const { user } = res.body;
              expect(user).toMatchObject({
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              });
            });
        });
        it("404: return status code 404, username Not Found", () => {
          return supertest(app)
            .get("/api/users/abcabc")
            .expect(404)
            .then((res) => {
              const { msg } = res.body;
              expect(msg).toBe("Not Found");
            });
        });
      });
    });
  });
});
