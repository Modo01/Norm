import { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";
import { createColumns } from "./columns";
import Filter from "./filters";
import dayjs from "dayjs";

const NormTable = () => {
  // Нормын өгөгдлийг хадгалах төлөв
  const [normData, setNormData] = useState([]);

  // Баганын хайлтын төлөв
  const [searchTexts, setSearchTexts] = useState({});

  // Нэмэлт шүүлтүүрүүдийн төлөв (огноо, үүсгэгч, баталгаажуулагч, төлөв)
  const [dateFromFilter, setDateFromFilter] = useState(null);
  const [dateToFilter, setDateToFilter] = useState(null);
  const [creatorFilter, setCreatorFilter] = useState("");
  const [validatorFilter, setValidatorFilter] = useState("");
  const [validatedFilter, setValidatedFilter] = useState("");

  // Компонент ачаалагдах үед нормын өгөгдлийг серверээс татаж авах
  useEffect(() => {
    axios
      .get("http://172.30.30.14:3001/norms") // Нормын API дуудлага
      .then((response) => setNormData(response.data.data)) // Авсан өгөгдлийг төлөвт тохируулах
      .catch((error) =>
        console.error("Нормын өгөгдлийг татахад алдаа гарлаа:", error)
      );
  }, []);

  // Баганын хайлтын утгуудыг тохируулах функц
  const onSearch = (value, dataIndex) => {
    setSearchTexts((prev) => ({ ...prev, [dataIndex]: value }));
  };

  // Шүүлтүүрт нийцсэн өгөгдлүүдийг шүүж авах
  const filteredData = normData.filter((record) => {
    // Баганын шүүлтүүрийн шалгалт
    const columnFiltersPass = Object.keys(searchTexts).every((dataIndex) => {
      const searchText = searchTexts[dataIndex];
      if (!searchText) return true; // Хэрэв шүүлтүүр байхгүй бол шалгалт шууд батлагдана
      const recordValue = record[dataIndex];
      return (
        recordValue &&
        recordValue.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    });

    // Огнооны шүүлтүүр
    const recordDate = record.statusDate ? dayjs(record.statusDate) : null;
    const fromDate = dateFromFilter ? dayjs(dateFromFilter) : null;
    const toDate = dateToFilter ? dayjs(dateToFilter) : null;

    const datePass =
      (!fromDate || (recordDate && !recordDate.isBefore(fromDate))) &&
      (!toDate || (recordDate && !recordDate.isAfter(toDate)));

    // Үүсгэгчийн шүүлтүүр
    const creatorPass = creatorFilter
      ? record.creator?.toLowerCase().includes(creatorFilter.toLowerCase())
      : true;

    // Баталгаажуулагчийн шүүлтүүр
    const validatorPass = validatorFilter
      ? record.validator?.toLowerCase().includes(validatorFilter.toLowerCase())
      : true;

    // Төлөвийн шүүлтүүр
    const validatedPass = validatedFilter
      ? record.status === validatedFilter
      : true;

    // Бүх шүүлтүүрийг нийлүүлж шалгах
    return (
      columnFiltersPass &&
      datePass &&
      creatorPass &&
      validatorPass &&
      validatedPass
    );
  });

  // Нормыг жагсаалтаас нуух функц
  const onHideNorm = (normId) =>
    setNormData((prev) => prev.filter((norm) => norm.Id !== normId));

  // Нормыг баталгаажуулах функц
  const onValidateNorm = (normId) => {
    setNormData((prev) =>
      prev.map((norm) =>
        norm.Id === normId
          ? {
              ...norm,
              status: "Баталгаажсан",
              statusDate: new Date().toISOString(), // Одоогийн огноог тохируулах
            }
          : norm
      )
    );
  };

  // Нормын баталгаажуулалтыг цуцлах функц
  const onCancelNorm = (normId) => {
    setNormData((prev) =>
      prev.map((norm) =>
        norm.Id === normId
          ? {
              ...norm,
              status: "Цуцлагдсан",
              statusDate: new Date().toISOString(), // Одоогийн огноог тохируулах
            }
          : norm
      )
    );
  };

  // Нормын өгөгдлийг засварлах функц
  const handleEditNorm = (normId, updatedData) => {
    setNormData((prev) =>
      prev.map((norm) =>
        norm.Id === normId
          ? {
              ...norm,
              ...updatedData, // Шинэ өгөгдлийг тохируулах
              status: "Засварлагдсан",
              statusDate: new Date().toISOString(), // Одоогийн огноог тохируулах
            }
          : norm
      )
    );
  };

  return (
    <div>
      {/* Шүүлтүүрийн хэсэг */}
      <Filter
        setDateFromFilter={setDateFromFilter} // Эхлэх огноог тохируулах
        setDateToFilter={setDateToFilter} // Дуусах огноог тохируулах
        setCreatorFilter={setCreatorFilter} // Үүсгэгчийн шүүлтүүрийг тохируулах
        setValidatorFilter={setValidatorFilter} // Баталгаажуулагчийн шүүлтүүрийг тохируулах
        setValidatedFilter={setValidatedFilter} // Төлөвийн шүүлтүүрийг тохируулах
        validatedFilter={validatedFilter} // Төлөвийн шүүлтүүрийн одоогийн утга
      />

      {/* Нормын хүснэгт */}
      <Table
        columns={createColumns(
          onSearch, // Баганын хайлтын функц
          onHideNorm, // Нормыг жагсаалтаас нуух функц
          onValidateNorm, // Нормыг баталгаажуулах функц
          onCancelNorm, // Нормыг цуцлах функц
          handleEditNorm // Нормыг засварлах функц
        )}
        dataSource={filteredData} // Шүүлтүүрт тохирсон өгөгдөл
        rowKey="id" // Жагсаалтын мөрийн давтагдашгүй түлхүүр
        scroll={{ x: "max-content" }} // Хүснэгтийн хөндлөн гүйлгэлтийг идэвхжүүлэх
        pagination={{ pageSize: 10 }} // Хуудас бүрт 10 мөр харуулах тохиргоо
      />
    </div>
  );
};

export default NormTable;
