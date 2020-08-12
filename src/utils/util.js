// 将obj2的value赋值给obj1的key
export function publicObj(obj1, obj2) {
  const result = {};
  const objArr = Object.keys(obj1);
  objArr.forEach(key => {
    if (obj2[key] !== undefined) {
      result[key] = obj2[key];
    } else {
      result[key] = obj1[key];
    }
  });
  return result;
}

// 去除对象空属性
export function delEmptyAttr(obj) {
  const result = {};
  const objArr = Object.keys(obj);
  if (!objArr[0]) {
    return obj;
  }
  objArr.forEach(key => {
    if (![undefined, null, ""].includes(obj[key])) {
      if (typeof (obj[key]) === 'object' && !obj[key].length) {
        obj[key] = this.delEmptyAttr(obj[key]);
      }
      result[key] = obj[key];
    }
  });
  return result;
}
