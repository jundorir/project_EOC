import { BigNumber } from "ethers";
/**
 * @param {*} num
 * @param {*} digit
 * @returns
 */
export const digitWei = (num, digit) => {
  num = num || 0;
  digit = digit || 0;
  let strNum = num.toString();
  let length = strNum.length;
  if (length <= digit) {
    strNum = "0." + digitNum(digit - length) + "" + strNum;
  } else {
    strNum =
      strNum.substr(0, strNum.length - digit) +
      "." +
      strNum.substr(strNum.length - digit);
  }
  return strNum;
};

const digitNum = (digit) => {
  let a = "";
  for (let i = 0; i < digit; i++) {
    a += "0";
  }
  return a;
};

const countDecimals = (value) => {
  if (value.includes && value.includes("."))
    return value.split(".")[1].length || 0;
  return 0;
};

const DecimalToBig = (value, precision = 18) => {
  const decimalPlaces = countDecimals(value.toString());
  const difference = precision - decimalPlaces;
  const zeros = BigNumber.from(10).pow(difference);
  value = value.toString();
  const abs = BigNumber.from(`${value.replace(".", "")}`);
  return abs.mul(zeros);
};

/**
 * @param {*} f
 * @returns
 */
export const promisify = (f) => {
  return function () {
    let args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      args.push(function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
      f.apply(null, args);
    });
  };
};

export const quiteAddress = (address, { left = 6, right = 4 } = {}) => {
  if (!address) return "";
  return address.slice(0, left) + "..." + address.slice(-right);
};

export const computeSymbolToWei = (symbolAmount) => {
  let wei = "0";
  if (window.Web3) {
    wei = window.Web3.utils.toWei(symbolAmount.toString());
  } else {
    wei = DecimalToBig(symbolAmount);
  }
  return wei;
};

export const computeWeiToSymbol = (weiAmount, fixed = 6, precision = 18) => {
  if (weiAmount === "0" || !weiAmount) return "0";
  if (fixed < 0) throw new Error("fixed can not less than 0");
  let symbolAmount = "0";
  if (window.Web3) {
    symbolAmount = window.Web3.utils.fromWei(weiAmount.toString());
  } else {
    symbolAmount = digitWei(weiAmount, precision);
  }
  const index = symbolAmount.indexOf(".");
  if (index !== -1) {
    const isHasDot = fixed !== 0;
    return symbolAmount
      .substring(0, index + fixed + isHasDot)
      .padEnd(index + fixed + isHasDot, "0");
  }

  return symbolAmount;
};

export const formateAddress = (address) => {
  if (address.length < 40) return address;
  let tempAddress = "";
  if (address.length >= 40) tempAddress = "0x" + address.slice(-40);
  if (window.Web3) {
    return window.Web3.utils.toChecksumAddress(tempAddress);
  }
  return tempAddress;
};

export const checkFloatNumber = (floatNumber, ext = 4) => {
  let regStr = `^\\d+(\\.?\\d{0,${ext}})$`;
  let reg = new RegExp(regStr);
  return reg.test(floatNumber);
};

export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return "";
}

//截取小区点后面几位
export const interception = (data, number = 4) => {
  return (parseInt(data * 10 ** number) / 10 ** number).toFixed(number);
};

//时间戳转换为时分秒格式
export const sec_to_time = (s) => {
  let t;
  if (s > -1) {
    let hour = Math.floor(s / 1000 / 3600);
    let min = Math.floor(s / 1000 / 60) % 60;
    let sec = Math.floor(s / 1000) % 60;
    if (hour < 10) {
      t = "0" + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec;
  }
  return t;
};

export function isAddress(address) {
  return window.Web3?.utils.isAddress(address) ?? false;
}
