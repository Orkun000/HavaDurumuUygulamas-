import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  return (
    <div
      style={{
        marginBottom: 20,
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <Select
        defaultValue={i18n.language}
        style={{ width: 120 }}
        onChange={(lng) => i18n.changeLanguage(lng)}
      >
        <Option value="tr">{t("turkish")}</Option>
        <Option value="en">{t("english")}</Option>
      </Select>
    </div>
  );
};

export default LanguageSelector;
