import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Modal, Space } from "antd";
import AllProductTable from "./AllProductTable";

// Бараа материал нэмэх товчлуур
function AddProductButton({ onAddProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const showModal = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Space>
        <Button type="primary" onClick={showModal}>
          Бараа, материал нэмэх
        </Button>
      </Space>

      <Modal
        open={isOpen}
        title="Бараа материал"
        onOk={handleClose}
        onCancel={handleClose}
        width={1200}
        footer={
          <Button type="primary" onClick={handleClose}>
            Болсон
          </Button>
        }
      >
        <AllProductTable onAddProduct={onAddProduct} />
      </Modal>
    </>
  );
}

AddProductButton.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default AddProductButton;
