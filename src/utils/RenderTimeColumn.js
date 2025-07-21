const renderTimeColumn = (t) => (formattedTime) => {
  const parts = formattedTime.split("T");
  const datePart = parts[0];
  const timePart = parts[1];
  return (
    <p
      style={{
        whiteSpace: "pre-line",
      }}
    >
      {t("dateTime", { datePart: datePart, timePart: timePart })}
    </p>
  );
};
export default renderTimeColumn;
