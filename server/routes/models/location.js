import { Models } from '../../db';

const { Location } = Models;

const locationFind = async (query) => {
  const res = await Location.find(query);
  return res;
};

export {
  locationFind,
};
