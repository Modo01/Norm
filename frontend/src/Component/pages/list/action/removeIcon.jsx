/**
 * RemoveIcon компонент нь нормыг жагсаалтаас хасахад ашиглагдана.
 * Баталгаажсан нормыг жагсаалтаас хасах боломжгүй бөгөөд анхааруулга харуулна.
 */

import { useState } from "react";
import { Button, Modal, Space, Tooltip, message } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";

function RemoveIcon({ normId, status, onHideNorm }) {
  const [visible, setVisible] = useState(false);

  // Модалыг харуулах функц
  const showModal = () => {
    if (status === "Баталгаажсан") {
      message.error("Баталгаажсан нормыг устгах боломжгүй!");
      return;
    }
    setVisible(true);
  };

  // OK товчны үйлдэл
  const handleOk = async () => {
    try {
      // Сервер дээрх visibility-г 0 болгож шинэчлэх
      await axios.put(`http://172.30.30.14:3001/norms/${normId}`);
      message.success("Нормыг амжилттай устгалаа.");
      setVisible(false);

      // Frontend талд жагсаалтаас нормыг устгах
      onHideNorm(normId);
    } catch (error) {
      console.error("Норм устгах явцад алдаа гарлаа:", error);
      message.error("Нормыг жагсаалтаас устгахад алдаа гарлаа.");
    }
  };

  // Cancel товчны үйлдэл
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Space>
        <Tooltip title="Норм жагсаалтаас устгах">
          <DeleteFilled
            onClick={showModal}
            style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
          />
        </Tooltip>
      </Space>
      <Modal
        title="Нормын жагсаалтаас хасах гэж байна!"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="delete" type="primary" onClick={handleOk}>
            Тийм, устгах
          </Button>,
          <Button key="cancel" type="primary" danger onClick={handleCancel}>
            Үгүй
          </Button>,
        ]}
      >
        Та нормыг жагсаалтаас устгах гэж байна!
      </Modal>
    </>
  );
}

// PropTypes тодорхойлолт
RemoveIcon.propTypes = {
  normId: PropTypes.number.isRequired, // Устгах нормын ID
  status: PropTypes.string.isRequired, // Нормын төлөв
  onHideNorm: PropTypes.func.isRequired, // Норм жагсаалтаас устгагдсаны дараах callback
};

export default RemoveIcon;
