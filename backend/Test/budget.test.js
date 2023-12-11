const request = require('supertest');
const sinon = require('sinon');
const { Budget } = require('../models/budget');
const { BudgetType } = require('../models/budgetType'); 
const app = require('../index');

describe('POST / route', () => {
  it('should create a new budget', async () => {
    // Mocking the Budget and BudgetType models and their methods
    const saveStub = sinon.stub(Budget.prototype, 'save').resolves({ _id: 'fakeBudgetId' });
    const findByIdStub = sinon.stub(BudgetType, 'findById').resolves({ _id: 'fakeBudgetTypeId' });

    const fakeReq = {
      user: { _id: 'fakeUserId' },
      body: {
        userId: 'fakeUserId',
        budgetTypeId: 'fakeBudgetTypeId',
        budgetAmount: 1000,
      },
    };

    const response = await request(app)
      .post('/')
      .send(fakeReq);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe('fakeBudgetId');
    expect(response.body.message).toBe('success');

    // Restore the original methods to avoid interference with other tests
    saveStub.restore();
    findByIdStub.restore();
  });

  it('should handle incorrect BudgetType', async () => {
    // Mocking the BudgetType model and its method
    const findByIdStub = sinon.stub(BudgetType, 'findById').resolves(null);

    const fakeReq = {
      user: { _id: 'fakeUserId' },
      body: {
        userId: 'fakeUserId',
        budgetTypeId: 'fakeInvalidBudgetTypeId',
        budgetAmount: 1000,
      },
    };

    const response = await request(app)
      .post('/')
      .send(fakeReq);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.text).toBe('Incorrect BudgetType.');

    // Restore the original method
    findByIdStub.restore();
  });

  it('should handle validation error', async () => {
    // Mocking the validateBudget function
    const validateBudgetStub = sinon.stub().returns({ error: { details: [{ message: 'Validation error' }] } });

    // Replace the actual validateBudget function with the stub
    jest.mock('./your-validation-module', () => ({ validateBudget: validateBudgetStub }));

    const fakeReq = {
      user: { _id: 'fakeUserId' },
      body: {
        userId: 'fakeUserId',
        budgetTypeId: 'fakeBudgetTypeId',
        budgetAmount: 'invalidAmount', // Trigger validation error
      },
    };

    const response = await request(app)
      .post('/')
      .send(fakeReq);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.text).toBe('Validation error');

    // Restore the original method
    jest.unmock('./your-validation-module');
  });
});
