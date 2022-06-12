const dayjs = require("dayjs");
const { CarAlreadyRentedError } = require("../../app/errors");
const { CarController } = require("../../app/controllers");
const { Car, UserCar } = require("../../app/models");


describe("Cars unit test", () => {

    const carModel = Car;
    const userCarModel = UserCar;
    const carController = new CarController({ carModel, userCarModel, dayjs });

    describe('Successful Operation', () => {

        describe('handleListCars', () => {
            it('should returning status code 200 and with all cars and meta pagging', async () => {
                const mockRequest = { query: { pageSize: 10 } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleListCars(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(200);
            });
        });

        describe('handleGetCar', () => {
            it('should returning status OK code 200 and return one car', async () => {
                const mockRequest = { params: { id: 1 } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleGetCar(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toBeCalledWith(200);
            });
        });

        describe('handleCreateCar', () => {
            it('should be returning status code 201 and return the new created car', async () => {
                const mockRequest = { body: { name: "avanza veloz", price: 350000, size: "MEDIUM", image: "https://toyotabatangas.com.ph/wp-content/uploads/2019/09/avanza-silver.png" } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleCreateCar(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(201);
            });
        });

        describe('handleRentCar', () => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            it('should be returning status code 201 and return the rented car', async () => {
                const mockRequest = { params: { id: 2 }, user: { id: 2 }, body: { rentStartedAt: today, rentEndedAt: tomorrow, } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleRentCar(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(201);
            });
        });

        describe('handleUpdateCar', () => {
            it('should be returning status code 200 and return the new updated car', async () => {
                const mockRequest = { params: { id: 2 }, body: { name: "avanza veloz", price: 350000, size: "MEDIUM", image: "https://toyotabatangas.com.ph/wp-content/uploads/2019/09/avanza-silver.png" } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleUpdateCar(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(200);
            });
        });

        describe('handleDeleteCar', () => {
            it('should be returning status code 204 and return the deleted car', async () => {
                const newCar = await carModel.create({
                    name: "avanza veloz",
                    price: 350000,
                    size: "MEDIUM",
                    image: "https://toyotabatangas.com.ph/wp-content/uploads/2019/09/avanza-silver.png"
                });
                const mockRequest = { params: { id: newCar.id } };
                const mockResponse = { status: jest.fn().mockReturnThis(), end: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleDeleteCar(mockRequest, mockResponse, mockNext);

                expect(mockResponse.status).toBeCalledWith(204);
            });
        });
    });

    describe('Error Operation', () => {

        describe('handleRentCar', () => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            it('should be returning status code 422 and error car already rented', async () => {
                const mockRequest = { params: { id: 2 }, user: { id: 2 }, body: { rentStartedAt: today, rentEndedAt: tomorrow, } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleRentCar(mockRequest, mockResponse, mockNext);

                const mockRequest2 = { params: { id: 2 }, user: { id: 2 }, body: { rentStartedAt: today, rentEndedAt: tomorrow, } };
                const mockResponse2 = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext2 = jest.fn();
                await carController.handleRentCar(mockRequest2, mockResponse2, mockNext2);

                const car = await carModel.findByPk(mockRequest2.params.id);
                const expectedError = new CarAlreadyRentedError(car);
                expect(mockResponse2.status).toBeCalledWith(422);
                expect(mockResponse2.json).toBeCalledWith(expectedError);
            });
        });

        describe('handleUpdateCar', () => {
            it('should be returning status code 200 and return the new updated car', async () => {
                const mockRequest = { params: { id: 0 }, body: { name: "avanza veloz", price: 350000, size: "MEDIUM", image: "https://toyotabatangas.com.ph/wp-content/uploads/2019/09/avanza-silver.png" } };
                const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
                const mockNext = jest.fn();
                await carController.handleUpdateCar(mockRequest, mockResponse, mockNext);

                const expectedError = { error: { name: "TypeError", message: "Cannot read properties of null (reading 'update')", } };
                expect(mockResponse.status).toBeCalledWith(422);
                expect(mockResponse.json).toBeCalledWith(expectedError);
            });
        });

        describe('getCarFromRequest', () => {
            it('no id should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'params')")
                const func = () => {
                    try {
                        carController.getCarFromRequest();
                    } catch (err) {
                        throw err;
                    };
                };
                expect(func).toThrow(expectedError);
            });
        });

        describe('getListQueryFromRequest', () => {
            it('no query should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'query')")
                const func = () => {
                    try {
                        carController.getListQueryFromRequest();
                    } catch (err) {
                        throw err;
                    };
                };
                expect(func).toThrow(expectedError);
            });
        });
    });
});