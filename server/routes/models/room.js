import mongoose from 'mongoose';
import { Models } from '../../db';

const { Room } = Models;

const { ObjectId } = mongoose.Types;

const roomFind = async (query) => {
  const res = await Room.find(query);
  return res;
};

const roomInsert = async (roomObj) => {
  const res = await Room.create(roomObj);
  return res;
};

const maintenanceFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Room.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

export {
  roomFind,
  roomInsert,
  maintenanceFindByIdAndUpdate,
};
