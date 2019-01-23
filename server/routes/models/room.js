import { Models } from '../../db';

const { Room } = Models;

const roomFind = async (query) => {
  const res = await Room.find(query);
  return res;
};

const roomInsert = async (roomObj) => {
  const res = await Room.create(roomObj);
  return res;
};

export {
  roomFind,
  roomInsert,
};
