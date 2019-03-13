function getFloatLength(num) {
  let tmp;
  try {
    tmp = num.toString().split('.')[1].length;
  } catch (e) {
    tmp = 0;
  }
  return tmp;
}

/**
 *
 * @param {Number} arg1 - 左運算式
 * @param {Number} arg2 - 右運算式
 * @param {Number(0|1|2)} type - 計算類型
 *
 * type 1 加法
 * type 2 減法
 * type 3 乘法
 * type 4 除法
 */
function accCalculate(propArg1, propArg2, type) {
  let arg1 = propArg1 && !Number.isNaN(propArg1) ? propArg1 : 0;
  let arg2 = propArg2 && !Number.isNaN(propArg2) ? propArg2 : 0;
  const floatLength1 = getFloatLength(arg1);
  const floatLength2 = getFloatLength(arg2);
  const abs = Math.abs(floatLength1 - floatLength2);
  const pow = 10 ** Math.max(floatLength1, floatLength2);
  switch (Math.sign(floatLength1 - floatLength2)) {
    case 0:
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', ''));
      break;
    case 1:
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * (10 ** abs);
      break;
    case -1:
      arg1 = Number(arg1.toString().replace('.', '')) * (10 ** abs);
      arg2 = Number(arg2.toString().replace('.', ''));
      break;
    default:
      return false;
  }
  switch (type) {
    case 1:
      return ((arg1 + arg2) / pow).toFixed(Math.max(floatLength1, floatLength2));
    case 2:
      return ((arg1 - arg2) / pow).toFixed(Math.max(floatLength1, floatLength2));
    case 3:
      return ((arg1 * arg2) / (pow ** 2)).toFixed(Math.max(floatLength1, floatLength2));
    case 4:
      return ((arg1 / arg2) / (pow ** 2)).toFixed(Math.max(floatLength1, floatLength2));
    default:
      return false;
  }
}

const accCalculation = {
  accAdd(arg1, arg2) {
    return accCalculate(arg1, arg2, 1);
  },
  accSub(arg1, arg2) {
    return accCalculate(arg1, arg2, 2);
  },
  accMul(arg1, arg2) {
    return accCalculate(arg1, arg2, 3);
  },
  accDiv(arg1, arg2) {
    return accCalculate(arg1, arg2, 4);
  },
};

export default accCalculation;
