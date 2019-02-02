import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  cashFind,
} from '../models/cash';

export const getCashList = async (req, res) => {
  const { query } = req;
  const dateCheck = ['create'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const cash = await cashFind({ ...localQuery, ...dateQuery });
  res.send(outputSuccess(cash));
};

export const fake = () => ({});
