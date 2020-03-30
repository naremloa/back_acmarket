import mongoose from 'mongoose';
import { Models } from '../../db';

const { Furniture } = Models;

const { ObjectId } = mongoose.Types;

const furnitureFind = async () => {
  const res = await Furniture.find();
  return res;
}

const furnitureInsert = async (fObj) => {
  const res = await Furniture.create(fObj);
  return res;
}

const furnitureFindById = async (id) => {
  const res = await Furniture.findById(ObjectId(id)).lean();
  return res;
}

const furnitureFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Furniture.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

export {
  furnitureFind,
  furnitureInsert,
  furnitureFindById,
  furnitureFindByIdAndUpdate,
};