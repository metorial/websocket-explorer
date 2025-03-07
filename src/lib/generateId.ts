import { customAlphabet } from 'nanoid';

let nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  20
);

export enum IdPrefix {
  bin = 'bin_',
  connection = 'con_',
  message = 'msg_'
}

export let generateId = (prefix: IdPrefix) => {
  return prefix + nanoid();
};
