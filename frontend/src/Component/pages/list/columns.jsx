/**
 * Багана үүсгэх функц.
 * Хайлтын талбар болон үйлдлийн хэсгийг агуулна.
 */

import { Input, Tag } from "antd";
import EditIcon from "./action/edit/editIcon";
import RemoveIcon from "./action/removeIcon";
import ValidateIcon from "./action/validateIcon";
import PrintIcon from "./action/printIcon";
import CancelIcon from "./action/cancelIcon";
import dayjs from "dayjs";

/**
 * Хайлтын талбарыг баганы гарчиг дээр нэмэх.
 * @param {string} placeholder - Хайлтын талбарын placeholder текст.
 * @param {string} dataIndex - Баганы өгөгдлийн түлхүүр.
 * @param {function} onSearch - Хайлтын функц.
 * @returns JSX элемент.
 */
export const headerInput = (placeholder, dataIndex, onSearch) => (
  <Input
    placeholder={placeholder}
    onChange={(e) => onSearch(e.target.value, dataIndex)}
    style={{ padding: 0 }}
    variant="borderless"
  />
);

/**
 * Төлвийн өнгө сонгох функц.
 * @param {string} status - Тухайн мөрийн төлөв.
 * @returns {string} - Төлөвт тохирох өнгө.
 */
const getStatusTagColor = (status) => {
  switch (status) {
    case "Баталгаажсан":
      return "green";
    case "Хадгалагдсан":
      return "blue";
    case "Засварлагдсан":
      return "yellow";
    case "Цуцлагдсан":
      return "red";
    default:
      return "gray";
  }
};

/**
 * Багануудыг үүсгэх функц.
 * @param {function} onSearch - Хайлтын функц.
 * @param {function} onHideNorm - Нормыг устгах функц.
 * @param {function} onValidateNorm - Нормыг баталгаажуулах функц.
 * @param {function} onCancelNorm - Нормыг цуцлах функц.
 * @param {function} onEditNorm - Нормыг засварлах функц.
 * @returns {Array} - Баганы тохиргооны массив.
 */
export const createColumns = (
  onSearch,
  onHideNorm,
  onValidateNorm,
  onCancelNorm,
  onEditNorm
) => [
  {
    title: "Д.Д",
    key: "number",
    fixed: "left",
    render: (_, __, index) => index + 1,
    width: "1%",
  },
  {
    title: headerInput("САЛБАР НЭГЖ", "branch", onSearch),
    dataIndex: "branch",
    key: "branch",
    width: "5%",
  },
  {
    title: headerInput("ДЭД АНГИЛАЛ", "subCategory", onSearch),
    dataIndex: "subCategory",
    key: "subCategory",
    width: "5%",
  },
  {
    title: headerInput("БАГА АНГИЛАЛ", "smallCategory", onSearch),
    dataIndex: "smallCategory",
    key: "smallCategory",
    width: "5%",
  },
  {
    title: headerInput("ЗАСВАРЫН ТӨРӨЛ", "repairType", onSearch),
    dataIndex: "repairType",
    key: "repairType",
    width: "6%",
  },
  {
    title: headerInput("ГРУПП", "group", onSearch),
    dataIndex: "group",
    key: "group",
    width: "5%",
  },
  {
    title: headerInput("НЭМЭЛТ", "addition", onSearch),
    dataIndex: "addition",
    key: "addition",
    width: "5%",
  },
  {
    title: headerInput("ХЭМЖИХ НЭГЖ", "unit", onSearch),
    dataIndex: "unit",
    key: "unit",
    width: "5%",
  },
  {
    title: headerInput("НИЙТ ҮНЭ", "netPrice", onSearch),
    dataIndex: "netPrice",
    key: "netPrice",
    width: "5%",
  },
  {
    title: "ТӨЛӨВ",
    dataIndex: "status",
    key: "status",
    width: "5%",
    render: (status) => <Tag color={getStatusTagColor(status)}>{status}</Tag>,
  },
  {
    title: "ТӨЛВИЙН ОГНОО",
    dataIndex: "statusDate",
    key: "statusDate",
    width: "5%",
    render: (statusDate) => {
      if (!statusDate) return "-";
      return dayjs(statusDate).format("YYYY он MM сар DD өдөр");
    },
  },
  {
    title: "ҮЙЛДЭЛ",
    key: "action",
    fixed: "right",
    width: "1%",
    render: (_, record) => {
      const { status, Id } = record;

      const actions = [];
      if (status === "Баталгаажсан") {
        actions.push(
          <CancelIcon
            key="cancel"
            normId={Id}
            status={status}
            norm={record}
            onCancel={onCancelNorm}
          />,
          <PrintIcon key="print" normId={Id} />
        );
      } else {
        actions.push(
          <EditIcon
            key="edit"
            normId={Id}
            status={status}
            onEditNorm={onEditNorm}
          />,
          <RemoveIcon
            key="remove"
            normId={Id}
            status={status}
            onHideNorm={onHideNorm}
          />,
          <ValidateIcon
            key="validate"
            normId={Id}
            status={status}
            norm={record}
            onValidate={onValidateNorm}
          />,
          <PrintIcon key="print" normId={Id} />
        );
      }

      return <div style={{ display: "flex", gap: "4px" }}>{actions}</div>;
    },
  },
];
