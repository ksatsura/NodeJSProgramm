import uuidv4 from 'uuid/v4';

export function getQuery(user) {
  const query = {
    text: 'INSERT INTO users(id, login, password, age, is_deleted) VALUES($1, $2, $3, $4, $5)',
    values: [user.id, user.login, user.password, user.age, user.is_deleted]
  };

  return query;
}

export function getNewId() {
  return uuidv4();
}
