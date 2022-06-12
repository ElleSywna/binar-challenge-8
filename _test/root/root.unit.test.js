const { ApplicationController } = require("../../app/controllers");

describe("Cars unit test", () => {

    const applicationController = new ApplicationController();

    describe('Successful Operation', () => {

        describe('handleGetRoot', () => {
            it('should returning status OK and message BCR API is up and running', async () => {
                const mockRequest = {}
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mockNext = jest.fn()
                await applicationController.handleGetRoot(mockRequest, mockResponse, mockNext)

                expect(mockResponse.status).toBeCalledWith(200)
            });
        });

        describe('handleNotFound', () => {
            it('should return error with name: Error, message: "Not Found!", details: { method: {{ method }}, url: {{ url }}', async () => {
                const mockRequest = { method: 'GET', url: '/Hello' }
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mockNext = jest.fn()
                await applicationController.handleNotFound(mockRequest, mockResponse, mockNext)

                expect(mockResponse.status).toBeCalledWith(404)
            });
        });

        describe('handleError', () => {
            it('should returning status OK and message BCR API is up and running', async () => {
                const mockHandleErrror = new Error
                const mockRequest = {}
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mockNext = jest.fn()
                await applicationController.handleError(mockHandleErrror, mockRequest, mockResponse, mockNext)

                expect(mockResponse.status).toBeCalledWith(500)
            });
        });

    });

    describe('Error Operation', () => {

        describe('getOffsetFromRequest', () => {
            it('no query should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'query')")
                const func = () => {
                    try {
                        applicationController.getOffsetFromRequest()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            });
        });

        describe('buildPaginationObject', () => {
            it('no query should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'query')")
                const func = () => {
                    try {
                        applicationController.buildPaginationObject()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            });
        });
    });
    
});