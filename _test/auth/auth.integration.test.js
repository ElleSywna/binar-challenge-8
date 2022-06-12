const app = require('../../app');
const request = require("supertest");
const models = require("../../app/models");


describe("Auth intergration test", () => {

    describe('Successful Operation', () => {

        describe('GET /v1/auth/whoami', () => {
            let token
            const credentials = {
                email: "john@example.com",
                password: "123456",
            };
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done();
                    });
            });
            it('should returning status code 200 and return the current user', (done) => {
                request(app)
                    .get("/v1/auth/whoami")
                    .set("Authorization", `Bearer ${token}`)
                    .expect("content-type", /json/)
                    .expect(200, done);
            });
        });

        describe('POST /v1/auth/login', () => {
            it('should be returning status code 201 and return the acess token ', (done) => {
                const credentials = {
                    email: "john@example.com",
                    password: "123456",
                }

                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .expect(201, done);
            });
        });

        describe('POST /v1/auth/register', () => {
            it('should be returning status code 201 and return the new created user', (done) => {
                const register = {
                    name: "johnny",
                    email: "john@example.com",
                    password: "123456",
                };

                request(app)
                    .post("/v1/auth/register")
                    .send(register)
                    .expect(201)
                    .end(() => {
                        models.User.destroy({
                            where: {
                                name: "johnny",
                                email: "john@example.com"
                            },
                        });
                        done();
                    })
            });
        });
    });

    describe('Error Operation', () => {

        describe('POST /v1/auth/login', () => {
            it('should be returning status code 404 and error email not registered ', (done) => {
                const credentials = {
                    email: "john@example.com",
                    password: "123456",
                };

                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .expect(404, done);
            });
        });

        describe('POST /v1/auth/login', () => {
            it('should be returning status code 401 and error wrong password ', (done) => {
                const credentials = {
                    email: "john@example.com",
                    password: "123456",
                }

                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .expect(401, done);
            });
        });

        describe('POST /v1/auth/login', () => {
            it('should be returning status code 500 and internal server error ', (done) => {
                const credentials = {};

                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .expect(500, done);
            });
        });

        describe('POST /v1/auth/register', () => {
            it('should be returning status code 422 and email already taken', (done) => {
                const register = {
                    name: "johnny",
                    email: "john@example.com",
                    password: "123456",
                }

                request(app)
                    .post("/v1/auth/register")
                    .send(register)
                    .expect(422, done);
            });
        });

        describe('POST /v1/auth/register', () => {
            it('should be returning status code 500 and internal server error', (done) => {
                const register = {};

                request(app)
                    .post("/v1/auth/register")
                    .send(register)
                    .expect(500, done);
            });
        });

        describe('GET /v1/auth/whoami', () => {
            let token
            const credentials = {
                email: "john@example.com",
                password: "123456",
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken;
                        done();
                    });
            });
            it('should returning status code 401 and insufficient access error', (done) => {
                request(app)
                    .get("/v1/auth/whoami")
                    .set("Authorization", `Bearer ${token}`)
                    .expect("content-type", /json/)
                    .expect(401, done);
            });
        });
    });
    
});