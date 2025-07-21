const disabledDate = (current, minDate, maxDate) => {
  if (!minDate || !maxDate) {
    return false;
  }
  return (
    current &&
    (current < minDate.startOf("day") || current > maxDate.endOf("day"))
  );
};

export default disabledDate;
