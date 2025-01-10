import { useState } from "react";
import { Input, message } from "antd";
import PropTypes from "prop-types";

const EditableCell = ({ value, onSave, style, isNumeric = false }) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    // Утга өөрчлөгдсөн эсэхийг шалгаж, зөв утга хадгалах
    if (inputValue.trim() !== "" && inputValue !== value) {
      if (isNumeric && isNaN(inputValue)) {
        message.warning("Тоо эсвэл мөнгөн дүн оруулна уу."); // Анхааруулга харуулах
        setInputValue(value); // Эх утгыг буцаах
        return;
      }
      onSave(isNumeric ? parseFloat(inputValue) : inputValue);
    } else {
      setInputValue(value); // Эх утгыг буцаах
    }
  };

  const handleFocus = () => {
    if (!isFocused) {
      setInputValue(""); // Утгыг хоослох
      setIsFocused(true);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (isNumeric && val !== "" && !/^\d*\.?\d*$/.test(val)) {
      // Зөвхөн тоон утгыг оруулахыг зөвшөөрөх
      message.warning("Зөвхөн тоон утга оруулна уу.");
      return;
    }
    setInputValue(val);
  };

  return (
    <Input
      variant="borderless"
      style={style}
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

// PropTypes тодорхойлолт
EditableCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // 'value' нь текст эсвэл тоо байж болно
  onSave: PropTypes.func.isRequired, // 'onSave' нь заавал байх функц
  style: PropTypes.object, // 'style' нь нэмэлт загварын объект
  isNumeric: PropTypes.bool, // 'isNumeric' нэмэлт бөгөөд анхдагч утга нь false
};

export default EditableCell;
