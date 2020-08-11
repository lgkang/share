/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
};
/**
 * 设置浏览器头部标题
 */
export const setTitle = function (title) {
  title = title ? `${title}` : '起飞后台';
  window.document.title = '起飞后台-' + title;
};

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
