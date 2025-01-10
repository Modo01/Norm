/**
 * CancelIcon компонент нь нормын баталгаажуулалтыг цуцлахад ашиглагдана.
 * Баталгаажсан нормыг л цуцлах боломжтой бөгөөд хэрэглэгчээс баталгаажуулалт шаардана.
 */

import { Tooltip, Modal, message } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";

const CancelIcon = ({ normId, onCancel, norm }) => {
  const handleCancel = async () => {
    // Цуцлах баталгаажуулалтын модал
    Modal.confirm({
      title: `Та (салбар нэгж)-н (үүсгэсэн ажилтны овог нэр)-н үүсгэсэн "${norm?.subCategory}","${norm?.smallCategory}",
      "${norm?.repairType}","${norm?.group}","${norm?.addition}" нормын баталгаажуулалтыг цуцлах гэж байна. Хэрэв та итгэлтэй байгаа бол "Цуцлах" товчийг дарна уу.`,
      okText: "Цуцлах", // Цуцлах товчны текст
      cancelText: "Гарах", // Гарах товчны текст
      onOk: async () => {
        try {
          // Цуцлах хүсэлт илгээх
          await axios.put(`http://172.30.30.14:3001/norms/${normId}/cancel`);
          message.success("Нормын баталгаажуулалтыг амжилттай цуцаллаа.");

          // Эцэг компонентоос ирсэн onCancel функцыг дуудах

          onCancel(normId);
        } catch (error) {
          console.error("Норм цуцлалтын алдаа:", error);
          message.error("Нормын баталгаажуулалтыг цуцлахад алдаа гарлаа.");
        }
      },
    });
  };

  return (
    <Tooltip title="Нормын баталгаажуулалтыг цуцлах">
      <CloseCircleFilled
        onClick={handleCancel}
        style={{ fontSize: "20px", color: "brown", cursor: "pointer" }}
      />
    </Tooltip>
  );
};

// PropTypes тодорхойлолт
CancelIcon.propTypes = {
  normId: PropTypes.number.isRequired, // Цуцлах нормын ID
  status: PropTypes.string.isRequired, // Нормын одоогийн төлөв
  onCancel: PropTypes.func, // Цуцлагдсаны дараах UI-г шинэчлэх callback
  norm: PropTypes.object.isRequired, // Нормын дэлгэрэнгүй өгөгдөл
};

export default CancelIcon;
