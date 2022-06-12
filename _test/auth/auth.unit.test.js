const models = require("../../app/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { EmailNotRegisteredError, EmailAlreadyTakenError, InsufficientAccessError, RecordNotFoundError, WrongPasswordError } = require("../../app/errors");
const { AuthenticationController } = require("../../app/controllers");
const { User, Role, Car, UserCar } = require("../../app/models");


describe("Auth unit test", () => {

    const roleModel = Role;
    const userModel = User;
    const authenticationController = new AuthenticationController({ bcrypt, jwt, roleModel, userModel, });


    describe('Successful Operation', () => {

        describe('handleLogin', () => {
            it('should be returning status code 201 and return the acess token', async () => {
                const mockRequest = { body: { email: "john@example.com", password: "123456" } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleLogin(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(201);
            });
        });

        describe('handleRegister', () => {
            it('should be returning status code 201 and return the new created user', async () => {
                const mockRequest = { body: { name: "john", email: "john@example.com", password: "123456" } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleRegister(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(201);
                models.User.destroy({ where: { name: "john", email: "john@example.com" } });
            });
        });

        describe('handleGetUser', () => {
            it('should returning status code 200 and return the current user', async () => {
                const mockRequest = { user: { id: 1 } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleGetUser(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(200);
            });
        });
    });

    describe('Error Operation', () => {

        describe('handleLogin', () => {
            it('should be returning status code 404 and error email not registered', async () => {
                const mockRequest = { body: { email: 'john@example.com', password: '123456' } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleLogin(mockRequest, mockResponse, mockNext);

                const expectedError = new EmailNotRegisteredError(mockRequest.body.email);
                expect(mockResponse.status).toBeCalledWith(404);
                expect(mockResponse.json).toBeCalledWith(expectedError);
            });
        });

        describe('handleLogin', () => {
            it('should be returning status code 401 and error wrong password', async () => {
                const mockRequest = { body: { email: 'john@example.com', password: '123456' } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleLogin(mockRequest, mockResponse, mockNext);

                const expectedError = new WrongPasswordError();
                expect(mockResponse.status).toBeCalledWith(401);
                expect(mockResponse.json).toBeCalledWith(expectedError);
            });
        });

        describe('handleLogin', () => {
            it('should be returning status code 500 and internal server error ', async () => {
                const mockRequest = { body: {} };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleLogin(mockRequest, mockResponse, mockNext);

                expect(mockNext).toHaveBeenCalled();
            });
        });

        describe('handleRegister', () => {
            it('should be returning status code 422 and email already taken', async () => {
                const mockRequest = { body: { email: 'john@example.com', password: '123456' } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();

                await authenticationController.handleRegister(mockRequest, mockResponse, mockNext);

                const expectedError = new EmailAlreadyTakenError(mockRequest.body.email);

                expect(mockResponse.status).toBeCalledWith(422);
                expect(mockResponse.json).toBeCalledWith(expectedError);
            });
        });

        describe('handleRegister', () => {
            it('should be returning status code 500 and internal server error ', async () => {
                const mockRequest = { body: {} };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleRegister(mockRequest, mockResponse, mockNext);

                expect(mockNext).toHaveBeenCalled();
            });
        });

        describe('handleGetUser', () => {
            it('should be returning status code 404 and error record not found', async () => {
                const mockRequest = { user: { id: "0" } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await authenticationController.handleGetUser(mockRequest, mockResponse, mockNext);

                const expectedError = new RecordNotFoundError();
                expect(mockResponse.status).toBeCalledWith(404);
                expect(mockResponse.json).toBeCalledWith(expectedError);
            });
        });

        describe('createTokenFromUser', () => {
            it('no user should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'id')");
                const func = () => {
                    try {
                        authenticationController.createTokenFromUser();
                    } catch (err) {
                        throw err;
                    };
                };
                expect(func).toThrow(expectedError);
            });
        });

        describe('decodeToken', () => {
            it('no token should return error JsonWebTokenError', async () => {
                const expectedError = new jwt.JsonWebTokenError('jwt must be provided');
                const func = () => {
                    try {
                        authenticationController.decodeToken();
                    } catch (err) {
                        throw err;
                    };
                }
                expect(func).toThrow(expectedError);
            });
        });

        describe('encryptPassword', () => {
            it('no password should return error illegal arguments', async () => {
                const expectedError = new Error("Illegal arguments: undefined, string");
                const func = () => {
                    try {
                        authenticationController.encryptPassword();
                    } catch (err) {
                        throw err;
                    };
                };
                expect(func).toThrow(expectedError);
            });
        });

        describe('verifyPassword', () => {
            it('no password and no encrypted password should return error illegal arguments', async () => {
                const expectedError = new Error("Illegal arguments: undefined, undefined");
                const func = () => {
                    try {
                        authenticationController.verifyPassword();
                    } catch (err) {
                        throw err;
                    };
                };
                expect(func).toThrow(expectedError);
            });
        });
    });
});