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
            it('400: Bad Request when attempting to GET article', () => {
                return supertest(app).get('/api/article/abc').expect(400).then((res) => {
                    const {msg} = res.body
                    expect(msg).toBe('Bad Request')
                })
            })
            it('404: Not Found when attempting to GET article', () => {
                return supertest(app).get('/api/article/10000').expect(404).then((res) => {
                    const {msg} = res.body
                    expect(msg).toBe('Not Found')
                })
            })
            describe('/comments', () => {
                it('200: GET all comments from specific article id', () => {
                    return supertest(app).get('/api/articles/6/comments').expect(200).then(res => {
                        const {comments} = res.body
                        expect(comments.length).toBe(1)
                        expect(comments[0]).toEqual({
                            comment_id: 16,
                            body: "This is a bad article name",
                            votes: 1,
                            author: "butter_bridge",
                            article_id: 6,
                            created_at: '2020-10-11T15:23:00.000Z'
                          })
                    })
                })
                it('200: SORT all comments by date (DESC)', () => {
                    return supertest(app).get('/api/articles/1/comments').expect(200).then(res => {
                        const {comments} = res.body
                        expect(comments).toBeSortedBy('created_at', {descending : true})
                    })
                })
                it('400: Bad request when attempting to GET comments by article_id', () => {
                    return supertest(app).get('/api/articles/abc/comments').expect(400).then(res => {
                        const {msg} = res.body
                        expect(msg).toBe('Bad Request')
                    })
                })
                it('404: Not found when attempting to GET comments by article_id', () => {
                    return supertest(app).get('/api/articles/100000/comments').expect(404).then(res => {
                        const {msg} = res.body
                        expect(msg).toBe('Not Found')
                    })
                })
            })
        })
        it('200: GET all articles', () => {
            return supertest(app).get('/api/articles').expect(200).then(res => {
                const {articles} = res.body
                expect(articles.length).toBe(13)
                articles.forEach(article => {
                    expect(article).toHaveProperty("article_id", expect.any(Number))
                    expect(article).toHaveProperty("title", expect.any(String))
                    expect(article).toHaveProperty("topic", expect.any(String))
                    expect(article).toHaveProperty("author", expect.any(String))
                    expect(article).toHaveProperty("created_at", expect.any(String))
                    expect(article).toHaveProperty("article_img_url", expect.any(String))
                    expect(article).toHaveProperty("votes", expect.any(Number))
                    expect(article).toHaveProperty("comment_count", expect.any(String))
                    expect(article).not.toHaveProperty('body')
                })
            })
        })
        it('200: GET all articles should be sorted by date by default (desc)', () => {
            return supertest(app).get('/api/articles').expect(200).then(res => {
                const {articles} = res.body
                expect(articles).toBeSortedBy('created_at', {descending : true})
            })
        })

    })
})