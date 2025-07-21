import moment from "moment";
const OnFilter = () => (value, record) => {
  if (!value || value.length !== 2) {
    return true;
  }
  const [startDateStr, endDateStr] = value;
  const recordTime = moment(record.time);
  const startDate = moment(startDateStr);
  const endDate = moment(endDateStr);
  return recordTime.isBetween(startDate, endDate, null, "[]");
};
export default OnFilter;
