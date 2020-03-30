import multer from 'multer';
import {
  getFurniture,
  addFurniture,
  editFurniture,
  signOwner,
  uploadImg,
} from '../furniture';

const upload = multer();

export const get = [
  ['/furniture/get', getFurniture],
];

export const post = [
  ['/furniture/add', addFurniture],
  ['/furniture/edit', editFurniture],
  ['/furniture/sign', signOwner],
  ['/furniture/img/upload', upload.single('file'), uploadImg],
];
