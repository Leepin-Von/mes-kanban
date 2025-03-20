export function unique(arr) {
  let newArr = [];
  let obj = {};
  arr.forEach((item) => {
    if (typeof item !== "object") {
      if (newArr.indexOf(item) === -1) {
        newArr.push(item);
      }
    } else {
      let str = JSON.stringify(item);
      if (!obj[str]) {
        newArr.push(item);
        obj[str] = 1;
      }
    }
  });
  return newArr;
}
