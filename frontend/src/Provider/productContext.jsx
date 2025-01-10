import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { message } from "antd";

// Бүтээгдэхүүний контекст үүсгэх
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Нэмэгдсэн бараа материалыг жагсаалтыг хадгалах төлөв
  const [addedProducts, setAddedProducts] = useState([]);
  // API-с авсан бүх бараа материалын өгөгдлийг хадгалах төлөв
  const [data, setData] = useState([]);
  // API-с өгөгдөл авч байгаа төлөвийг илэрхийлэх (ачаалж байна эсэх)
  const [loading, setLoading] = useState(true);
  // Алдааны төлөвийг хадгалах (API-с өгөгдөл авах үед гарсан алдаа)
  const [error, setError] = useState(null);

  // API-с бараа материалуудыг авах
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ачаалж байгааг илэрхийлэх
      try {
        const response = await axios.get("http://172.30.30.14:3001/products");
        setData(response.data); // Амжилттай өгөгдөл авч, төлөвт хадгалах
      } catch (error) {
        setError(error); // Алдаа гарвал алдааны төлөвт хадгалах
        console.error("Бараа материал татаж авахад алдаа гарлаа:", error);
      } finally {
        setLoading(false); // Ачаалалт дууссан гэдгийг илэрхийлэх
      }
    };
    fetchData();
  }, []);

  // Бараа материалуудын өгөгдлийг дахин шинэчлэх
  const refreshData = async () => {
    try {
      const response = await axios.get("http://172.30.30.14:3001/products");
      setData(response.data); // Амжилттай өгөгдөл авч, шинэчлэх
    } catch (error) {
      console.error("Бараа материалын өгөгдөл шинэчлэхэд алдаа гарлаа:", error);
    }
  };

  // Шинэ бараа материал жагсаалтад нэмэх функц
  const handleAddProduct = (newProduct) => {
    setAddedProducts((prev) => [...prev, newProduct]); // Шинэ бүтээгдэхүүнийг нэмэх
    setData((prev) => prev.filter((product) => product.id !== newProduct.id)); // Жагсаалтаас бүтээгдэхүүнийг хасах
  };

  // Нэмэгдсэн бараа материалыг жагсаалтаас хасах функц
  const handleRemoveProduct = (productId) => {
    const removedProduct = addedProducts.find(
      (product) => product.id === productId
    );
    if (removedProduct) {
      setAddedProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      ); // Бүтээгдэхүүнийг хасах
      setData((prev) => [...prev, removedProduct]); // Бүтээгдэхүүнийг анхны жагсаалтад буцаах
      message.success("Бараа материал амжилттай хасагдлаа."); // Амжилтын мэдэгдэл
    }
  };

  // Нэмэгдсэн бараа материалыг шинэчлэх функц
  const handleUpdateProduct = (updatedProduct) => {
    setAddedProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    ); // Бараа материалын шинэчилж хадгалах
    message.success("Бараа материал амжилттай шинэчлэгдлээ."); // Амжилтын мэдэгдэл
  };

  return (
    <ProductContext.Provider
      value={{
        refreshData, // Өгөгдөл шинэчлэх функц
        addedProducts, // Нэмэгдсэн бараа материалын жагсаалт
        setAddedProducts, // Нэмэгдсэн бараа материалын төлөвийг өөрчлөх
        data, // Бүх бараа материалын өгөгдөл
        loading, // Ачааллын төлөв
        error, // Алдааны төлөв
        handleAddProduct, // Бараа материал нэмэх функц
        handleRemoveProduct, // Бараа материал хасах функц
        handleUpdateProduct, // Бараа материал шинэчлэх функц
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useProductContext = () => useContext(ProductContext);
