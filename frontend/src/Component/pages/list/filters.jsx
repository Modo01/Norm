import { Space, Input, Select, DatePicker } from "antd";

const { RangePicker } = DatePicker;

/**
 * Filter бүрэлдэхүүн
 * Энэ бүрэлдэхүүн нь хүснэгтийн өгөгдлийг шүүхэд хэрэглэгдэнэ.
 *
 * @param {Object} props - Бүрэлдэхүүнд дамжуулагдах пропууд.
 * @param {Function} setDateFromFilter - Эхлэх огнооны шүүлт тохируулах функц.
 * @param {Function} setDateToFilter - Дуусах огнооны шүүлт тохируулах функц.
 * @param {Function} setCreatorFilter - Норм үүсгэгчийн шүүлт тохируулах функц.
 * @param {Function} setValidatorFilter - Баталгаажуулсан хэрэглэгчийн шүүлт тохируулах функц.
 * @param {Function} setValidatedFilter - Төлөвийн шүүлт тохируулах функц.
 * @param {string} validatedFilter - Одоогийн төлөвийн шүүлтийн утга.
 */
const filters = ({
  setDateFromFilter,
  setDateToFilter,
  setCreatorFilter,
  setValidatorFilter,
  setValidatedFilter,
  validatedFilter,
}) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      {/* Огнооны хүрээг сонгох хэсэг */}
      <RangePicker
        format="YYYY-MM-DD" // Огнооны формат тодорхойлох
        onChange={(dates) => {
          // Огноо сонголт өөрчлөгдөх үед дуудагдах функц
          setDateFromFilter(
            dates && dates[0] ? dates[0].format("YYYY-MM-DD") : null
          ); // Эхлэх огнооны шүүлт тохируулах
          setDateToFilter(
            dates && dates[1] ? dates[1].format("YYYY-MM-DD") : null
          ); // Дуусах огнооны шүүлт тохируулах
        }}
        allowClear // Огноог цэвэрлэхийг зөвшөөрөх
        placeholder={["Эхлэх огноо", "Дуусах огноо"]} // Хоосон үед харагдах текст
      />

      {/* Норм үүсгэгчийн шүүлт хийх оролт талбар */}
      <Input
        placeholder="Норм үүсгэгч" // Хоосон үед харагдах текст
        onChange={(e) => setCreatorFilter(e.target.value)} // Оролтын утгыг өөрчлөх үед
      />

      {/* Баталгаажуулсан хэрэглэгчийн шүүлт хийх оролт талбар */}
      <Input
        placeholder="Баталгаажуулсан хэрэглэгч" // Хоосон үед харагдах текст
        onChange={(e) => setValidatorFilter(e.target.value)} // Оролтын утгыг өөрчлөх үед
        style={{ width: 200 }} // Өргөнийг тогтмол болгож тохируулах
      />

      {/* Төлөвийн сонголт хийх dropdown */}
      <Select
        placeholder="Төлөв" // Хоосон үед харагдах текст
        value={validatedFilter || undefined} // Одоогийн утгыг холбох
        onChange={(value) => setValidatedFilter(value || "")} // Сонголт өөрчлөх үед
        style={{ width: 150 }} // Өргөнийг тогтмол болгож тохируулах
        allowClear // Сонголтыг цэвэрлэх боломжтой болгох
      >
        {/* Төлөвийн сонголтууд */}
        <Select.Option value="Баталгаажсан" />
        <Select.Option value="Хадгалагдсан" />
        <Select.Option value="Засварлагдсан" />
        <Select.Option value="Цуцлагдсан" />
      </Select>
    </Space>
  );
};

export default filters;
