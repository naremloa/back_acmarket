import { forOwn, keys } from 'lodash';
// import bcrypt from 'bcrypt';
import * as schema from './schema';

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/phelomi', { useNewUrlParser: true });

const {
  connection: db,
  Schema,
  model: Model,
} = mongoose;
db.once('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));

// 檢查是否有需要轉換成Schema特有的類型, 大多為ObjectId
function initSchema(localSchema) {
  forOwn(localSchema, (value, key) => {
    const { type } = (typeof value === 'object') ? value : { type: value };
    const target = (typeof value === 'object') ? value : {};
    if (typeof type === 'string') localSchema[key] = { ...target, type: Schema.Types[type] };
  });
  return Schema(localSchema, { versionKey: false });
}

const modelKeysList = keys(schema).map(s => s.replace(/^[a-z]/, str => str.toUpperCase()));
const Models = {};
modelKeysList.forEach((item, index) => {
  Models[item] = Model(item, initSchema(schema[index]));
});

// virtual use
// const loginSchema = initSchema(login);
// loginSchema.virtual('passwordHash').set(async function bcryptPassword(password) {
//   const salt = await bcrypt.genSalt(10);
//   const passwordHash = await bcrypt.hash(password, salt);
//   console.log(this);
//   this.password = passwordHash;
// });

export {
  Models,
  db,
  Schema,
};
