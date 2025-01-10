import "./Register.css";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  List,
  Checkbox,
} from "antd";
import axios from "axios";

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [scopes, setScopes] = useState([]);
  const [services, setServices] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(1);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const scope = await axios.get("http://172.30.30.14:3001/scopes");
        const service = await axios.get("http://172.30.30.14:3001/services");
        const access = await axios.get("http://172.30.30.14:3001/accesses");

        setServices(service.data);
        setScopes(scope.data);
        setPermissions(access.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Өгөгдөл татахад алдаа гарлаа.");
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await axios.post("/api/register", values);
      message.success("Хэрэглэгчийг амжилттай бүртгэлээ!");
      form.resetFields();
    } catch (error) {
      console.error("Error registering user:", error);
      message.error("Бүртгэлд алдаа гарлаа.");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Хэрэглэгч бүртгэх</h1>

      <div className="register-sections">
        <List
          bordered
          style={{ width: "20%", marginRight: "20px" }}
          dataSource={[
            "Хэрэглэгчийн мэдээлэл",
            "Хандах алба",
            "Хандах байгууллага",
            "Хандах эрх",
          ]}
          renderItem={(item, index) => (
            <List.Item
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() => setSelectedSection(index + 1)}
            >
              {item}
            </List.Item>
          )}
        />

        <div style={{ position: "center", width: "50%" }}>
          {selectedSection === 1 && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="register-form"
            >
              <Form.Item
                name="firstName"
                label="Нэр"
                rules={[{ required: true, message: "Нэр оруулна уу!" }]}
              >
                <Input placeholder="Нэр оруулах" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Овог"
                rules={[{ required: true, message: "Овог оруулна уу!" }]}
              >
                <Input placeholder="Овог оруулах" />
              </Form.Item>
              <Form.Item
                name="birthDate"
                label="Төрсөн огноо"
                rules={[
                  { required: true, message: "Төрсөн огноо сонгоно уу!" },
                ]}
              >
                <DatePicker
                  placeholder="Төрсөн огноо сонгох"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Хүйс"
                rules={[{ required: true, message: "Хүйс сонгоно уу!" }]}
              >
                <Select placeholder="Хүйс сонгох">
                  <Option value="male">Эрэгтэй</Option>
                  <Option value="female">Эмэгтэй</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="organization"
                label="Байгууллага"
                rules={[{ required: true, message: "Байгууллага сонгоно уу!" }]}
              >
                <Select
                  showSearch
                  placeholder="Байгууллага сонгох"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={scopes.map((org) => ({
                    value: org.shortName,
                    label: org.shortName,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="position"
                label="Албан тушаал"
                rules={[
                  { required: true, message: "Албан тушаал оруулна уу!" },
                ]}
              >
                <Input placeholder="Албан тушаал оруулах" />
              </Form.Item>
            </Form>
          )}

          {selectedSection === 2 && (
            <Checkbox.Group
              style={{ width: "100%" }}
              options={services.map((service) => ({
                label: service.service,
                value: service.service,
              }))}
            />
          )}

          {selectedSection === 3 && (
            <Checkbox.Group
              style={{ width: "100%" }}
              options={scopes.map((scope) => ({
                label: scope.shortName,
                value: scope.shortName,
              }))}
            />
          )}

          {selectedSection === 4 && (
            <Checkbox.Group
              style={{ width: "100%" }}
              options={permissions.map((perm) => ({
                label: perm.access,
                value: perm.access,
              }))}
            />
          )}
        </div>
      </div>

      {selectedSection === 1 && (
        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-button">
            Бүртгэх
          </Button>
        </Form.Item>
      )}
    </div>
  );
};

export default Register;
