import mongoose from 'mongoose';
import { Models } from '../../db';

const { Room } = Models;

const { ObjectId } = mongoose.Types;

const roomFind = async (query) => {
  const res = await Room.find(query).lean();
  return res;
};

const roomFindById = async (cid) => {
  const res = await Room.findById(ObjectId(cid)).lean();
  return res;
};

const subRoomCount = async (cid) => {
  const res = await roomFindById(cid);
  if (res) return res.roomList && res.roomList.length;
  return false;
};

const roomFindByIdAndUpdate = async (cid, update) => {
  const res = await Room.findByIdAndUpdate(ObjectId(cid), update);
  return res;
};


export {
  roomFind,
  roomFindById,
  subRoomCount,
  roomFindByIdAndUpdate,
};
