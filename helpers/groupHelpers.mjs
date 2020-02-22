export function getGroupQuery(group) {
  const query = {
    text: 'INSERT INTO groups(id, name, permissions) VALUES($1, $2, $3)',
    values: [group.id, group.name, group.permissions]
  };

  return query;
}
