// Système d'authentification simple
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthSystem {
  constructor() {
    this.users = new Map();
    this.SECRET_KEY = process.env.JWT_SECRET || 'alm-secret-key';
  }

  async register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    this.users.set(username, {
      password: hashedPassword,
      createdAt: new Date()
    });
    
    const token = jwt.sign({ username }, this.SECRET_KEY, {
      expiresIn: '24h'
    });
    
    return { success: true, token };
  }

  async login(username, password) {
    const user = this.users.get(username);
    if (!user) return { success: false, error: 'User not found' };
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return { success: false, error: 'Invalid password' };
    
    const token = jwt.sign({ username }, this.SECRET_KEY, {
      expiresIn: '24h'
    });
    
    return { success: true, token };
  }
}

module.exports = AuthSystem