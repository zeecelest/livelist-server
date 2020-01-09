const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user);
  },
  returnUserWithUsername(db, username) {
    return db('users')
      .where({ username })
      .first();
  },
  returnAllListsByUserId(db, id) {
    return db
      .raw(
        `SELECT lists.id,
      lists.name,
      lists.tags,
      lists.city,
      lists.state,
      lists.is_public
      FROM users_lists RIGHT JOIN lists
      ON users_lists.list_id = lists.id
      WHERE users_lists.users_id = ${id}
      `
      )
      .then(item => item.rows);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      city: user.city,
      state: user.state
    };
  }
};

module.exports = UserService;
