/**
 * ValidateIcon компонент нь нормыг баталгаажуулах үйлдлийг гүйцэтгэдэг.
 * Хэрэв норм баталгаажсан байвал дахин баталгаажуулах боломжгүйг анхааруулна.
 */

import { Tooltip, Modal, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";

const ValidateIcon = ({ normId, status, onValidate, norm }) => {
  const handleValidate = async () => {
    // Норм аль хэдийн баталгаажсан эсэхийг шалгах
    if (status === "Баталгаажсан") {
      message.warning(
        "Энэ норм баталгаажсан байна. Нормыг баталгаажуулах боломжгүй."
      );
      return;
    }

    // Баталгаажуулахаас өмнө баталгаажуулах эсэхийг асуух
    Modal.confirm({
      title: `Та (салбар нэгж)-н (үүсгэсэн ажилтны овог нэр)-н үүсгэсэн 
        "${norm?.subCategory}", "${norm?.smallCategory}", "${norm?.repairType}", "${norm?.group}", "${norm?.addition}" 
        нормын баталгаажуулах гэж байна. Хэрэв та итгэлтэй байгаа бол баталгаажуулах товчийг дарна уу.`,
      okText: "Баталгаажуулах", // OK товчийн текст
      cancelText: "Гарах", // Cancel товчийн текст
      okButtonProps: { style: { order: 1 } }, // OK товчийг баруун талд байрлуулах
      cancelButtonProps: { style: { order: 2 } }, // Cancel товчийг зүүн талд байрлуулах

      onOk: async () => {
        try {
          // Баталгаажуулах хүсэлтийг илгээх
          await axios.put(`http://172.30.30.14:3001/norms/${normId}/validate`);
          message.success("Нормыг амжилттай баталгаажууллаа.");
          // UI-г шинэчлэх callback-ыг дуудах
          if (onValidate) {
            onValidate(normId);
          }
        } catch (error) {
          console.error("Норм баталгаажуулалтын алдаа:", error);
          message.error("Нормыг баталгаажуулахад алдаа гарлаа.");
        }
      },
    });
  };

  return (
    <Tooltip title="Нормыг баталгаажуулах">
      <CheckCircleOutlined
        onClick={handleValidate}
        style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
      />
    </Tooltip>
  );
};

// PropTypes тодорхойлолт
ValidateIcon.propTypes = {
  normId: PropTypes.number.isRequired, // Баталгаажуулах нормын ID
  status: PropTypes.string.isRequired, // Нормын төлөв
  onValidate: PropTypes.func, // Баталгаажсаны дараах callback
  norm: PropTypes.object.isRequired, // Нормын дэлгэрэнгүй мэдээлэл
};

export default ValidateIcon;
