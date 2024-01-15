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
})