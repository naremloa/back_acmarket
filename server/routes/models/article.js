// import mongoose from 'mongoose';
import { Models } from '../../db';

const { Article } = Models;

// const { ObjectId } = mongoose.Types;

export const articleFind = async (query) => {
  const res = await Article.find(query);
  return res;
};

export const articleInsert = async (cashObj) => {
  const res = await Article.create(cashObj);
  return res;
};
