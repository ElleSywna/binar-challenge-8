const app = require('../../app')
const request = require("supertest")


describe("Root intergration test", () => {

    describe('Successful Operation', () => {
        describe('GET /', () => {
            it('should returning status OK and message BCR API is up and running!', (done) => {
                request(app)
                    .get("/")
                    .expect(200, {
                        status: "OK",
                        message: "BCR API is up and running!"
                    }, done)
            });
        });
    });

    describe('Error Operation', () => {
        describe('404 Not Found', () => {
            it('should return error with name: Error, message: "Not Found!", details: { method: {{ method }}, url: {{ url }} }', (done) => {
                request(app)
                    .get("/Hello")
                    .expect(404, {
                        error: {
                            name: "Error",
                            message: "Not found!",
                            details: {
                                method: "GET",
                                url: "/Hello"
                            }
                        }
                    }, done)
            });
        });
    });

});