import React, { useState } from "react";
import { Button, Modal, Space, Tooltip } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

function validateIcon() {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    //устгах логик
    console.log("Item deleted");
  };

  const handleCancel = () => {
    setVisible(false);
    console.log("Deletion canceled");
  };

  return (
    <>
      <Space>
        <Tooltip title="Норм баталгаажуулах">
          <CheckCircleFilled
            onClick={showModal}
            style={{ fontSize: "20px", color: "#38b000" }}
          />
        </Tooltip>
      </Space>
      <Modal
        title="Нормын жагсаалтаас хасах гэж байна!"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" onClick={handleOk}>
            Тийм, устгах
          </Button>,
          <Button type="primary" danger onClick={handleCancel}>
            Үгүй
          </Button>,
        ]}
      >
        K1-K2-K3-K4-K5-K6 кодтой бараа материалын бүртгэлийг устгах гэж байна.
        Хэрэв та итгэлтэй байгаа бол 'Тийм, устгах' товчлуурыг дарна уу!
      </Modal>
    </>
  );
}

export default validateIcon;
