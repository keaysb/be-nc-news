const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const supertest = require("supertest");
const app = require("../app");
const jsonFile = require('../endpoints.json')

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('/api', () => {
    it('200: responds with all available endpoints', () => {
        return supertest(app).get('/api').expect(200).then((res) => {
            const {endpoints_available} = res.body
            expect(jsonFile).toEqual(endpoints_available)
        })
    })
    describe('GET /topics', () => {
        it('200: GET all topics', () => {
            return supertest(app).get('/api/topics').expect(200).then((res) => {
                const {topics} = res.body
                expect(topics.length).toBe(3)
                topics.forEach((topic, index) => {
                    expect(topic).toHaveProperty("description", expect.any(String));
                    expect(topic).toHaveProperty("slug", expect.any(String));
                    for (const key in topic){
                        expect(topic[key]).toEqual(data.topicData[index][key])
                    }
                })
            })
        })
    })
    describe('GET /article', () => {
        describe('/:article_id', () => {
            it('200: GET article at specific id', () => {
                return supertest(app).get('/api/article/1').expect(200).then(res => {
                    const {article} = res.body
                    expect(article).toEqual({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      })
                })
            })
        })
    })
})