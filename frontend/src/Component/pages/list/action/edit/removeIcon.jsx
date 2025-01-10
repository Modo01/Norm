import { useState } from "react";
import { Button, Modal, Space, Tooltip, message } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";

function RemoveIcon({ productId, onDelete }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      // Send delete request to backend
      await axios.delete(`http://172.30.30.14:3001/addedProducts/${productId}`);
      message.success("Бараа материал амжилттай устлаа.");
      setVisible(false);

      // Notify the parent component about the deletion
      onDelete(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product.");
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Space>
        <Tooltip title="Норм жагсаалтаас устгах">
          <DeleteFilled
            onClick={showModal}
            style={{ fontSize: "20px", color: "red" }}
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

RemoveIcon.propTypes = {
  productId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RemoveIcon;
