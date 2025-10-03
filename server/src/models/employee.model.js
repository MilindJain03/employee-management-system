const db = require('../db/connection');

class Employee {
  static getAll({ name, page = 1, limit = 100 }) {
    let query = 'SELECT * FROM employees';
    const params = [];

    if (name) {
      query += ' WHERE name LIKE ?';
      params.push(`%${name}%`);
    }

    // Get total count
    const countQuery = name ? 'SELECT COUNT(*) as total FROM employees WHERE name LIKE ?' : 'SELECT COUNT(*) as total FROM employees';
    const countResult = db.prepare(countQuery).get(name ? [`%${name}%`] : []);
    const total = countResult.total;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const employees = db.prepare(query).all(...params);

    return {
      data: employees,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    };
  }

  static getById(id) {
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
    return employee;
  }

  static create({ name, email, position }) {
    const now = new Date().toISOString();
    
    try {
      const result = db.prepare(
        'INSERT INTO employees (name, email, position, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
      ).run(name, email, position, now, now);

      return this.getById(result.lastInsertRowid);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('EMAIL_EXISTS');
      }
      throw error;
    }
  }

  static update(id, { name, email, position }) {
    const employee = this.getById(id);
    if (!employee) {
      return null;
    }

    const now = new Date().toISOString();
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (position !== undefined) {
      updates.push('position = ?');
      params.push(position);
    }

    updates.push('updatedAt = ?');
    params.push(now);
    params.push(id);

    try {
      db.prepare(`UPDATE employees SET ${updates.join(', ')} WHERE id = ?`).run(...params);
      return this.getById(id);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('EMAIL_EXISTS');
      }
      throw error;
    }
  }

  static delete(id) {
    const result = db.prepare('DELETE FROM employees WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

module.exports = Employee;
