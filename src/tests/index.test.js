const request = require('supertest');
const fs = require('fs');
const app = require('../../server');

describe('PhoneNumberGenerator', () => {
    it('should return welcome message', done => {
        request(app)
            .get('/api')
            .end((error, response) => {
                expect(response.status).toBe(200);
                expect(response.body.message).toBe(
                    'Welcome to phone number generator'
                );
                done();
            });
    });

    describe('Generate Random Phone Numbers - POST', () => {
        it('should return 500 phone numbers if no amount is specified', done => {
            request(app)
                .post('/api/numbers')
                .send({})
                .end((error, response) => {
                    const { numbers } = response.body.data;
                    expect(response.status).toBe(201);
                    expect(response.body.message).toBe(
                        'Phone numbers generated'
                    );
                    expect(numbers.length).toBe(500);
                    done();
                });
        });

        it('should return the phone numbers based on the anounts specified', done => {
            request(app)
                .post('/api/numbers?amount=1000')
                .send({})
                .end((error, response) => {
                    const { numbers } = response.body.data;
                    expect(response.status).toBe(201);
                    expect(response.body.message).toBe(
                        'Phone numbers generated'
                    );
                    expect(numbers.length).toBe(1000);
                    done();
                });
        });
    });

    describe('Get Random Phone Numbers from file - GET', () => {
        it('should return a list of phone numbers', done => {
            request(app)
                .get('/api/numbers')
                .send({})
                .end((error, response) => {
                    const { numbers, amount, min, max } = response.body.data;

                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe(
                        'Numbers retrieved successfully'
                    );
                    expect(min).toBe(Math.min(...numbers));
                    expect(max).toBe(Math.max(...numbers));
                    done();
                });
        });

        it('should return a list of phone numbers in descending order', done => {
            request(app)
                .get('/api/numbers?order=desc')
                .send({})
                .end((error, response) => {
                    const { numbers } = response.body.data;
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe(
                        'Numbers retrieved successfully'
                    );
                    expect(numbers[0] > numbers[numbers.length - 1]).toBe(true);
                    done();
                });
        });
    });
});
