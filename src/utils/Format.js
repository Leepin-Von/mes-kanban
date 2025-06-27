import moment from "moment";

export function formatSpecialDate(dateStr) {
  return moment(new Date(dateStr.substring(0, dateStr.length - 1))).format("MM/DD/YYYY HH:mm:ss");
}

export function formatNumberToFloatFixed2(numStr) {
  return parseFloat(numStr).toFixed(2);
}
