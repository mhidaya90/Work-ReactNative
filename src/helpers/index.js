import { logEvent } from './logHelper';

const transposeArray = array => {
  return Object.keys(array[0]).map(function (c) {
    return array.map(function (r) {
      return r[c];
    });
  });
};

const renderIf = condition => {
  if (condition) {
    return jsx => jsx;
  }
  return () => null;
};

const seperateDataByKey = (data, key, value) => {
  return data.filter(q => q[key] === value);
};

export const setOrSpliceFromArray = (arr, val) => {
  try {
    let index = arr.indexOf(val);
    if (index != -1) {
      arr.splice(index, 1);
    } else {
      arr.push(val);
    }

    return arr;
  } catch (e) {
    logEvent('helpers -> index -> setOrSpliceFromArray fail', e);
    console.log('setOrSpliceFromArray fail', e);
  }
};

export const globalHelper = {
  transposeArray,
  renderIf,
  seperateDataByKey,
};
