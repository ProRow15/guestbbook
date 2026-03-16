'use strict';

const request = require('supertest');
const path = require('path');
const { createDb } = require('../src/db');
const { createApp } = require('../src/app');

function makeApp() {
  const db = createDb(':memory:');
  return createApp(db);
}

describe('GET /entries', () => {
  test('returns empty array when no entries exist', async () => {
    const app = makeApp();
    const res = await request(app).get('/entries');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns entries ordered newest first', async () => {
    const app = makeApp();
    await request(app).post('/entries').send({ name: 'Alice', message: 'Hello!' });
    await request(app).post('/entries').send({ name: 'Bob', message: 'World!' });

    const res = await request(app).get('/entries');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Bob');
    expect(res.body[1].name).toBe('Alice');
  });
});

describe('POST /entries', () => {
  test('creates a new entry and returns 201 with id', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/entries')
      .send({ name: 'Jane', message: 'Great stay!' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('entry is persisted and retrievable', async () => {
    const app = makeApp();
    await request(app).post('/entries').send({ name: 'Test User', message: 'My message' });
    const res = await request(app).get('/entries');
    expect(res.body[0].name).toBe('Test User');
    expect(res.body[0].message).toBe('My message');
  });

  test('returns 400 when name is missing', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/entries')
      .send({ message: 'No name here' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when message is missing', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/entries')
      .send({ name: 'Someone' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when name is blank whitespace', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/entries')
      .send({ name: '   ', message: 'Hello' });
    expect(res.status).toBe(400);
  });

  test('trims whitespace from name and message', async () => {
    const app = makeApp();
    await request(app)
      .post('/entries')
      .send({ name: '  Alice  ', message: '  Hi there!  ' });
    const res = await request(app).get('/entries');
    expect(res.body[0].name).toBe('Alice');
    expect(res.body[0].message).toBe('Hi there!');
  });
});
