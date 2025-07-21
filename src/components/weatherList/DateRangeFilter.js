import React from "react";
import { DatePicker, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";
import disabledDate from "../../utils/DisabledDate";

const DateRangeFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  minDate,
  maxDate,
  handleDateFilter,
  handleDateReset,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <DatePicker.RangePicker
        showTime={{ format: "HH" }}
        value={
          selectedKeys[0] && selectedKeys[0].length === 2
            ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
            : null
        }
        onChange={(dates) => {
          setSelectedKeys([dates.map((d) => d.toISOString())]);
        }}
        onOk={(dates) => {
          handleDateFilter(dates, confirm);
          close();
        }}
        style={{ marginBottom: 8, display: "block" }}
        disabledDate={disabledDate(minDate, maxDate)}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            const currentDates = [
              moment(selectedKeys[0][0]),
              moment(selectedKeys[0][1]),
            ];
            handleDateFilter(currentDates, confirm);
            close();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          {t("filter")}
        </Button>
        <Button
          onClick={() => {
            handleDateReset(clearFilters, confirm, setSelectedKeys);
            close();
          }}
          size="small"
          style={{ width: 90 }}
        >
          {t("reset")}
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          {t("close")}
        </Button>
      </Space>
    </div>
  );
};

export default DateRangeFilter;
