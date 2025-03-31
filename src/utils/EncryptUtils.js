const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * 生成随机数
 * @param {Number} min 最小值，默认0
 * @param {Number} max 最大值，必填
 * @returns 包含min和max的随机数
 * @example randomNum(1, 10) // 1到10的随机数
 */
function randomNum(min = 0, max) {
  return min + Math.round(Math.random() * (max - min));
}

/**
 * 生成不重复的随机数数组
 * @param {Number} min 最小值，默认0
 * @param {Number} max 最大值，必填
 * @param {Number} length 随机数组长度，默认1
 * @returns 不重复的随机数数组
 * @example randomArray(1, 10, 5) // 1到10的随机数数组，长度为5
 */
function randomArray(min = 0, max, length = 1) {
  const result = [];
  while (result.length < length) {
    const num = randomNum(min, max);
    if (!result.includes(num)) {
      result.push(num);
    }
  }
  return result;
}

/**
 * 生成32位随机字符串
 * @returns 请求体参数中的Code1
 * @example generateCode1() // 32位随机字符串
 */
function generateCode1() {
  let result = "";
  const charsLength = CHARSET.length;
  const randoms = randomArray(0, charsLength - 1, 32);

  for (let i = 0; i < 32; i++) {
    result += CHARSET.charAt(randoms[i]);
  }
  return result.split("");
}

/**
 * 生成12位Code1对应的字符串
 * @param {Array} pwdRandom 密码的位置数组
 * @returns 请求体参数中的Code2
 */
function generateCode2(pwdRandom) {
  const code2 = [];

  for (let i = 0; i < pwdRandom.length; i++) {
    const index = pwdRandom[i];
    if (index >= 0 && index < 10) {
      code2.push(`A${index}`);
    } else if (index >= 10 && index < 20) {
      code2.push(`E${index - 10}`);
    } else if (index >= 20 && index < 30) {
      code2.push(`J${index - 20}`);
    } else if (index >= 30 && index <= 32) {
      code2.push(`S${index - 30}`);
    }
  }

  const diff = 12 - pwdRandom.length;
  let result = code2.join("");
  if (diff % 2 === 0) {
    result += `Z${diff}`;
  } else {
    result = `X${diff}` + result;
  }

  return result;
}

export function decode(code1, code2) {
  const head = /^X\d/;
  const tail = /Z\d$/;
  let newCode2 = "";
  if (!head.test(code2) && !tail.test(code2)) {
    throw new Error("Code2解析失败");
  }
  if (head.test(code2)) {
    newCode2 = code2.substring(2);
  }
  if (tail.test(code2)) {
    newCode2 = code2.substring(0, code2.length - 2);
  }
  const position = {
    A: 0,
    E: 10,
    J: 20,
    S: 30,
  };

  const indices = [];
  for (let i = 0; i < newCode2.length; i += 2) {
    const letter = newCode2[i];
    const number = parseInt(newCode2[i + 1], 10);
    if (position[letter] !== undefined) {
      indices.push(position[letter] + number - 1);
    }
  }

  const result = [];

  indices.forEach((index) => {
    result.push(code1.split("")[index]);
  });

  return result.join("");
}

export function encode(pwd) {
  const code1Array = generateCode1();
  const pwdRandom = randomArray(0, 31, pwd.length);

  for (let i = 0; i < pwd.length; i++) {
    if (pwdRandom[i] < code1Array.length) {
      code1Array[pwdRandom[i] - 1] = pwd[i];
    }
  }
  return { code1: code1Array.join(""), code2: generateCode2(pwdRandom) };
}
