const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Set test database path before requiring app
process.env.DB_PATH = path.join(__dirname, 'test.sqlite');

const app = require('../src/app');
const db = require('../src/db/connection');

describe('Employee API', () => {
  beforeEach(() => {
    // Clear the employees table before each test
    db.prepare('DELETE FROM employees').run();
  });

  afterAll(() => {
    // Close database connection and delete test database
    db.close();
    if (fs.existsSync(process.env.DB_PATH)) {
      fs.unlinkSync(process.env.DB_PATH);
    }
  });

  describe('POST /api/employees', () => {
    it('should create a new employee successfully', async () => {
      const newEmployee = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        position: 'Manager'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newEmployee.name);
      expect(response.body.data.email).toBe(newEmployee.email);
      expect(response.body.data.position).toBe(newEmployee.position);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          email: 'test@example.com',
          position: 'Developer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String)
          })
        ])
      );
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          name: 'John Doe',
          position: 'Developer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email'
          })
        ])
      );
    });

    it('should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          position: 'Developer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('valid')
          })
        ])
      );
    });

    it('should return 409 when email already exists', async () => {
      const employee = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        position: 'Engineer'
      };

      // Create first employee
      await request(app)
        .post('/api/employees')
        .send(employee)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/employees')
        .send(employee)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already exists');
    });

    it('should return 400 when name exceeds 100 characters', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          name: 'a'.repeat(101),
          email: 'test@example.com',
          position: 'Developer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 when position exceeds 50 characters', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          position: 'a'.repeat(51)
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/employees', () => {
    beforeEach(async () => {
      // Create test employees
      await request(app).post('/api/employees').send({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        position: 'Engineer'
      });
      await request(app).post('/api/employees').send({
        name: 'Bob Smith',
        email: 'bob@example.com',
        position: 'Manager'
      });
      await request(app).post('/api/employees').send({
        name: 'Alina Chen',
        email: 'alina@example.com',
        position: 'Designer'
      });
    });

    it('should return all employees', async () => {
      const response = await request(app)
        .get('/api/employees')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('total');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.total).toBe(3);
    });

    it('should filter employees by name (case-insensitive)', async () => {
      const response = await request(app)
        .get('/api/employees?name=ali')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.map(e => e.name)).toEqual(
        expect.arrayContaining(['Alina Chen', 'Alice Johnson'])
      );
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/employees?page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(2);
      expect(response.body.total).toBe(3);
    });
  });

  describe('GET /api/employees/:id', () => {
    let employeeId;

    beforeEach(async () => {
      const response = await request(app).post('/api/employees').send({
        name: 'Test Employee',
        email: 'test@example.com',
        position: 'Tester'
      });
      employeeId = response.body.data.id;
    });

    it('should return employee by id', async () => {
      const response = await request(app)
        .get(`/api/employees/${employeeId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', employeeId);
      expect(response.body.data.name).toBe('Test Employee');
    });

    it('should return 404 when employee not found', async () => {
      const response = await request(app)
        .get('/api/employees/9999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('PUT /api/employees/:id', () => {
    let employeeId;

    beforeEach(async () => {
      const response = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        position: 'Original Position'
      });
      employeeId = response.body.data.id;
    });

    it('should update employee successfully', async () => {
      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send({
          position: 'Senior Manager'
        })
        .expect(200);

      expect(response.body.data.position).toBe('Senior Manager');
      expect(response.body.data.name).toBe('Original Name');
      expect(response.body.data.email).toBe('original@example.com');
    });

    it('should update multiple fields', async () => {
      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send({
          name: 'Updated Name',
          position: 'Updated Position'
        })
        .expect(200);

      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.position).toBe('Updated Position');
      expect(response.body.data.email).toBe('original@example.com');
    });

    it('should return 404 when employee not found', async () => {
      const response = await request(app)
        .put('/api/employees/9999')
        .send({
          position: 'New Position'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Employee not found');
    });

    it('should return 409 when updating to existing email', async () => {
      // Create another employee
      await request(app).post('/api/employees').send({
        name: 'Another Employee',
        email: 'another@example.com',
        position: 'Developer'
      });

      // Try to update first employee with second employee's email
      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send({
          email: 'another@example.com'
        })
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    let employeeId;

    beforeEach(async () => {
      const response = await request(app).post('/api/employees').send({
        name: 'To Be Deleted',
        email: 'delete@example.com',
        position: 'Temporary'
      });
      employeeId = response.body.data.id;
    });

    it('should delete employee successfully', async () => {
      await request(app)
        .delete(`/api/employees/${employeeId}`)
        .expect(204);

      // Verify employee is deleted
      await request(app)
        .get(`/api/employees/${employeeId}`)
        .expect(404);
    });

    it('should return 404 when employee not found', async () => {
      const response = await request(app)
        .delete('/api/employees/9999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Employee not found');
    });
  });
});
