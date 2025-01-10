import { useProductContext } from "../../../Provider/productContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Form, InputNumber, Row, Select, message } from "antd";
import AddedProductTable from "./addedProductTable";
const { Option } = Select; // Select-ийн Option компонентыг задлах

const Index = () => {
  const [form] = Form.useForm();
  const { addedProducts, setAddedProducts, refreshData } = useProductContext(
    []
  ); // Контекстоос нэмэгдсэн бүтээгдэхүүн болон функцийг авах

  // Формын төлөвт сонгосон утгуудыг хадгалах
  const [formValues, setFormValues] = useState({
    normType: "",
    category: "",
    subCategory: "",
    smallCategory: "",
    repairType: "",
    group: "",
    addition: "",
    unit: "",
    quantity: "",
    scope: [],
    rule: "",
  });

  // Dropdown-уудын өгөгдлийг хадгалах төлөв
  const [normTypes, setNormTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [smallCategories, setSmallCategories] = useState([]);
  const [fetchedRepairTypes, setFetchedRepairTypes] = useState([]);
  const [fetchedGroups, setFetchedGroups] = useState([]);
  const [fetchedAdditions, setFetchedAdditions] = useState([]);
  const [fetchedUnits, setFetchedUnits] = useState([]);
  const [fetchedScopes, setFetchedScopes] = useState([]);
  const [fetchedRules, setFetchedRules] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Бүх dropdown өгөгдлийг API-с авах
        const [
          normTypesRes,
          categoriesRes,
          subCategoriesRes,
          smallCategoriesRes,
          repairTypesRes,
          groupsRes,
          additionsRes,
          unitsRes,
          scopesRes,
          rulesRes,
        ] = await Promise.all([
          axios.get("http://172.30.30.14:3001/normTypes"),
          axios.get("http://172.30.30.14:3001/categories"),
          axios.get("http://172.30.30.14:3001/subCategories"),
          axios.get("http://172.30.30.14:3001/smallCategories"),
          axios.get("http://172.30.30.14:3001/repairTypes"),
          axios.get("http://172.30.30.14:3001/groups"),
          axios.get("http://172.30.30.14:3001/additions"),
          axios.get("http://172.30.30.14:3001/units"),
          axios.get("http://172.30.30.14:3001/scopes"),
          axios.get("http://172.30.30.14:3001/rules"),
        ]);

        // Татсан өгөгдлийг төлөвт хадгалах
        setNormTypes(normTypesRes.data);
        setCategories(categoriesRes.data);
        setSubCategories(subCategoriesRes.data);
        setSmallCategories(smallCategoriesRes.data);
        setFetchedRepairTypes(repairTypesRes.data);
        setFetchedGroups(groupsRes.data);
        setFetchedAdditions(additionsRes.data);
        setFetchedUnits(unitsRes.data);
        setFetchedScopes(scopesRes.data);
        setFetchedRules(rulesRes.data);
      } catch (error) {
        message.error("Өгөгдөл татахад алдаа гарлаа!"); // Алдааны мессеж
        console.error("Dropdown өгөгдлийг татахад алдаа гарлаа:", error); // Алдааг консолд хэвлэх
      }
    };

    fetchData(); // Өгөгдөл татах функцийг дуудах
  }, []);

  // Формыг илгээх функц
  const onFinish = async (values) => {
    // Хэрэв нэмэгдсэн бүтээгдэхүүн байхгүй бол анхааруулга харуулах
    if (addedProducts.length === 0) {
      message.warning(
        "Нормыг хадгалахаас өмнө дор хаяж нэг бараа материал нэмнэ үү!."
      );
      return;
    }

    // Нэмэгдсэн бүтээгдэхүүний хэмжих нэгж, тоо хэмжээ, үнийг шалгах
    const incompleteProducts = addedProducts.filter(
      (product) =>
        !product.newPrice ||
        product.newPrice <= 0 ||
        !product.formUnit ||
        !product.quantity ||
        product.quantity <= 0
    );

    if (incompleteProducts.length > 0) {
      message.warning(
        "Нэмэгдсэн барааны хэмжих нэгж, тоо хэмжээ, үнийг оруулна уу!"
      );
      return;
    }
    const currentDate = new Date().toISOString(); // Одоогийн огноог ISO форматаар авах

    //Нормын нийт үнийг тооцоолох
    const totalNetPrice = addedProducts.reduce(
      (sum, product) => sum + product.newNetPrice,
      0
    );

    const selectedNormType =
      normTypes.find((item) => item.Id === values.normType)?.normType || "";
    const selectedCategory =
      categories.find((item) => item.Id === values.category)?.category || "";
    const selectedSubCategory =
      subCategories.find((item) => item.Id === values.subCategory)
        ?.subCategory || "";
    const selectedSmallCategory =
      smallCategories.find((item) => item.Id === values.smallCategory)
        ?.smallCategory || "";
    const selectedRepairType =
      fetchedRepairTypes.find((item) => item.Id === values.repairType)
        ?.repairType || "";
    const selectedGroup =
      fetchedGroups.find((item) => item.Id === values.group)?.group || "";
    const selectedAddition =
      fetchedAdditions.find((item) => item.Id === values.addition)?.addition ||
      "";
    const selectedUnit =
      fetchedUnits.find((item) => item.Id === values.unit)?.unit || "";
    const selectedRule =
      fetchedRules.find((item) => item.Id === values.rule)?.rule || "";
    const selectedScopes = values.scope.map((item) => item.label);

    // Сонгосон утгуудыг API-д илгээхэд тохируулж бэлтгэх
    const payload = {
      ...values,
      normType: selectedNormType,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      smallCategory: selectedSmallCategory,
      repairType: selectedRepairType,
      group: selectedGroup,
      addition: selectedAddition,
      unit: selectedUnit,
      scope: selectedScopes,
      rule: selectedRule,
      statusDate: currentDate, // Save the current date
      netPrice: totalNetPrice, // Save the total net price
      status: "Хадгалагдсан", // Add the status
      addedProducts, // Include added products
      visibility: 1, // Set visibility to 1
    };

    try {
      const response = await axios.post(
        "http://172.30.30.14:3001/addNorms",
        payload
      );

      if (response.status === 200) {
        message.success("Амжилттай хадгалагдлаа!");
        form.resetFields(); // Формыг хоослох
        setAddedProducts([]); // Нэмэгдсэн бүтээгдэхүүнийг цэвэрлэх
        await refreshData(); // Өгөгдлийг дахин ачаалах
      }
    } catch (error) {
      message.error(
        `Хадгалах үед алдаа гарлаа: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  // Формын талбаруудын утга өөрчлөгдөхөд ажиллах функц
  const handleChange = (value, field) => {
    setFormValues((prevValues) => {
      // Өмнөх утгуудыг хадгалж, шинэ утгыг өөрчлөх
      const updatedValues = { ...prevValues, [field]: value };

      // Хэрэв сонгосон талбар "normType" бол доорх талбаруудыг хоослох
      if (field === "normType") {
        updatedValues.category = ""; // Ангиллыг цэвэрлэх
        updatedValues.subCategory = ""; // Дэд ангиллыг цэвэрлэх
        updatedValues.smallCategory = ""; // Бага бүлгийг цэвэрлэх
      }
      // Хэрэв сонгосон талбар "category" бол доорх талбаруудыг хоослох
      else if (field === "category") {
        updatedValues.subCategory = ""; // Дэд ангиллыг цэвэрлэх
        updatedValues.smallCategory = ""; // Бага бүлгийг цэвэрлэх
      }
      // Хэрэв сонгосон талбар "subCategory" бол бага бүлгийг хоослох
      else if (field === "subCategory") {
        updatedValues.smallCategory = ""; // Бага бүлгийг цэвэрлэх
      }

      // Шинэчилсэн утгыг буцаах
      return updatedValues;
    });
  };

  // Select компонентын сонголтуудыг шүүх функц
  const filterOption = (inputValue, option) =>
    // Хэрэглэгчийн оруулсан текст (`inputValue`) болон сонголтын утгыг (`option.children`) жижиг үсгээр харьцуулах
    option.children.toLowerCase().includes(inputValue.toLowerCase());

  return (
    <div style={{ color: "rgb(25,25,132)" }}>
      <h1>Норм шинээр бүртгэх</h1>
      <h2 style={{ marginBottom: "20px" }}>Ерөнхий мэдээлэл:</h2>

      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
      >
        <Row>
          <Col span={8}>
            <Form.Item
              label="Нормын төрөл"
              name="normType"
              rules={[{ required: true, message: "Нормын төрөл сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Нормын төрөл сонгох"
                onChange={(value) => handleChange(value, "normType")}
                filterOption={filterOption}
              >
                {normTypes.map((item) => (
                  <Option key={item.Id} value={item.Id}>
                    {item.normType}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Ангилал"
              name="category"
              rules={[{ required: true, message: "Ангилал сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Ангилал сонгох"
                onChange={(value) => handleChange(value, "category")}
                value={formValues.category}
                filterOption={filterOption}
              >
                {categories
                  .filter((cat) => cat.normTypeId === formValues.normType)
                  .map((item) => (
                    <Option key={item.Id} value={item.Id}>
                      {item.category}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Дэд ангилал"
              name="subCategory"
              rules={[{ required: true, message: "Дэд ангилал сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Дэд ангилал сонгох"
                onChange={(value) => handleChange(value, "subCategory")}
                value={formValues.subCategory}
                filterOption={filterOption}
              >
                {subCategories
                  .filter((subCat) => subCat.categoryId === formValues.category)
                  .map((item) => (
                    <Option key={item.Id} value={item.Id}>
                      {item.subCategory}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Бага бүлэг" name="smallCategory">
              <Select
                allowClear
                showSearch
                placeholder="Бага бүлэг сонгох"
                onChange={(value) => handleChange(value, "smallCategory")}
                value={formValues.smallCategory}
                filterOption={filterOption}
              >
                {smallCategories
                  .filter(
                    (smallCat) =>
                      smallCat.subCategoryId === formValues.subCategory
                  )
                  .map((item) => (
                    <Option key={item.Id} value={item.Id}>
                      {item.smallCategory}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Засварын төрөл"
              name="repairType"
              rules={[
                { required: true, message: "Засварын төрөл сонгоно уу?" },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Засварын төрөл сонгох"
                onChange={(value) => handleChange(value, "repairType")}
                value={formValues.repairType}
                filterOption={filterOption}
              >
                {fetchedRepairTypes.map((item) => (
                  <Option key={item.Id} value={item.Id}>
                    {item.repairType}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Групп"
              name="group"
              rules={[{ required: true, message: "Групп сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Групп сонгох"
                onChange={(value) => handleChange(value, "group")}
                value={formValues.group}
                filterOption={filterOption}
              >
                {fetchedGroups.map((item) => (
                  <Option key={item.Id} value={item.Id}>
                    {item.group}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Нэмэлт"
              name="addition"
              rules={[{ required: true, message: "Нэмэлт сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Нэмэлт сонгох"
                onChange={(value) => handleChange(value, "addition")}
                value={formValues.addition}
                filterOption={filterOption}
              >
                {fetchedAdditions.map((item) => (
                  <Option key={item.Id} value={item.Id}>
                    {item.addition}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Хэмжих нэгж"
              name="unit"
              rules={[{ required: true, message: "Хэмжих нэгж сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Хэмжих нэгж сонгох"
                onChange={(value) => handleChange(value, "unit")}
                value={formValues.unit}
                filterOption={filterOption}
              >
                {fetchedUnits.map((item) => (
                  <Option key={item.Id} value={item.Id}>
                    {item.unit}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Тоо хэмжээ"
              name="quantity"
              rules={[{ required: true, message: "Тоо хэмжээг оруулна уу?" }]}
            >
              <InputNumber
                min={0}
                onChange={(value) => handleChange(value, "quantity")}
                value={formValues.quantity}
                placeholder="Тоо хэмжээг оруулах"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Хамрах хүрээ"
              name="scope"
              rules={[{ required: true, message: "Хамрах хүрээ сонгоно уу?" }]}
            >
              <Select
                mode="multiple"
                labelInValue
                allowClear
                showSearch
                placeholder="Хамрах хүрээ сонгох"
                onChange={(value) => handleChange(value, "scope")}
                value={formValues.scope}
                filterOption={filterOption}
              >
                {fetchedScopes.map((item) => (
                  <Option key={item.Id} value={item.Id} label={item.branch}>
                    {item.branch}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Зарчим"
              name="rule"
              rules={[{ required: true, message: "Зарчим сонгоно уу?" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Зарчим сонгох"
                onChange={(value) => handleChange(value, "rule")}
                value={formValues.rule}
                filterOption={filterOption}
              >
                {fetchedRules.map((item) => (
                  <Option key={item.Id} value={item.Id}>
                    {item.rule}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <h2 style={{ display: "flex", justifyContent: "space-between" }}>
          Бараа материалын нормын жагсаалт:
        </h2>
        <AddedProductTable />
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" size="large">
            Хадгалах
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
