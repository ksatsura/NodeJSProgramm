import { getNewId } from './helpers/userHelpers';

export const usersInitialList = [
  { id: getNewId(), login: 'user1', password: 'password1', age: 18, is_deleted: false },
  { id: getNewId(), login: 'user2', password: 'password2', age: 19, is_deleted: false },
  { id: getNewId(), login: 'user3', password: 'password3', age: 20, is_deleted: false },
  { id: getNewId(), login: 'user4', password: 'password4', age: 21, is_deleted: false },
  { id: getNewId(), login: 'user5', password: 'password5', age: 22, is_deleted: false },
  { id: getNewId(), login: 'user6', password: 'password6', age: 23, is_deleted: false },
  { id: getNewId(), login: 'user7', password: 'password7', age: 24, is_deleted: false }
];

export const permissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

export const groupsInitialList = [
  { id: getNewId(), name: 'group1', permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'] },
  { id: getNewId(), name: 'group2', permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'] },
  { id: getNewId(), name: 'group3', permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'] },
  { id: getNewId(), name: 'group4', permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'] }
];

