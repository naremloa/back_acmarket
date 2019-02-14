import { keys } from 'lodash';
import {
  locationFind,
} from '../models/location';
import { outputSuccess, outputError } from '../utils/outputFormat';

// 固定狀態，1: 名宿。2: 船。3：飛機。
const _status = { 1: 'hostel', 2: 'boat', 3: 'airplane' };

export const getLocation = async (req, res) => {
  const locations = await locationFind({ status: { $in: keys(_status) } });
  const result = locations
    .reduce((acc, cur) => ({
      ...acc,
      [_status[cur.status]]: { address: cur.address, distance: cur.distance },
    }), {});
  res.send(outputSuccess(result));
};

export const fake = () => ({});
