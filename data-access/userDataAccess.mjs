import pg from 'pg';
import { usersInitialList } from '../config';
import { getUserQuery } from '../helpers/userHelpers';

const { Pool } = pg;

export const userTableInit = () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DB',
    password: 'P0stgress_user',
    port: '5432'
  });

  pool.connect((err, client, done) => {
    const shouldAbort = err => {
      if (err) {
        console.error('Error in transaction', err.stack);
        client.query('ROLLBACK', err => {
          if (err) {
            console.error('Error rolling back client', err.stack);
          }
          done();
        });
      }
      return !!err;
    };

    client.query('BEGIN', err => {
      if (shouldAbort(err)) return;
      const queryText = 'CREATE TABLE IF NOT EXISTS Users(id UUID PRIMARY KEY, login TEXT NOT NULL, password TEXT NOT NULL, age INTEGER NOT NULL, is_deleted BOOLEAN NOT NULL)';

      client.query(queryText, (err) => {
        if (shouldAbort(err)) {
          return;
        }
        console.log('New table Users was created');
        usersInitialList.forEach((user, index) => {
          client.query(getUserQuery(user), (err) => {
            if (shouldAbort(err)) {
              return;
            }
            console.log(`New row was inserted into the table Users: ${index}`);
          });
        });

        client.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction', err.stack);
          }
          done();
        });
      });
    });
  });
};
