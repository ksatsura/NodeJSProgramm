import pg from 'pg';
import { groupsInitialList } from '../config';
import { getGroupQuery } from '../helpers/groupHelpers';

const { Pool } = pg;

export const groupTableInit = () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
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
      const queryTextForGroup = 'CREATE TABLE IF NOT EXISTS Groups(id UUID PRIMARY KEY, name TEXT NOT NULL, permissions TEXT[] NOT NULL)';

      client.query(queryTextForGroup, (err) => {
        if (shouldAbort(err)) {
          return;
        }
        console.log('New table Groups was created');
        groupsInitialList.forEach((group, index) => {
          client.query(getGroupQuery(group), (err) => {
            if (shouldAbort(err)) {
              return;
            }
            console.log(`New row was inserted into the table Groups: ${index}`);
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
