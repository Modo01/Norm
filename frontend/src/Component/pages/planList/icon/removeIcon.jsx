import { useState } from "react";
import { Button, Modal, Space, Tooltip } from "antd";
import { DeleteFilled } from "@ant-design/icons";

function RemoveIcon() {
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
        <Tooltip title="Норм устгах">
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
          <Button key="" type="primary" onClick={handleOk}>
            Тийм, устгах
          </Button>,
          <Button key="" type="primary" danger onClick={handleCancel}>
            Үгүй
          </Button>,
        ]}
      >
        K1-K2-K3-K4-K5-K6 кодтой бараа материалын бүртгэлийг устгах гэж байна.
        Хэрэв та итгэлтэй байгаа бол Тийм, устгах товчлуурыг дарна уу!
      </Modal>
    </>
  );
}

export default RemoveIcon;
