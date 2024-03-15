export const modelPermissions = [
  {
    name: "store",
    text: "Cửa hàng",
  },
  {
    name: "branch",
    text: "Chi nhánh",
  },
  {
    name: "user",
    text: "Người dùng",
  },
  {
    name: "batch",
    text: "Lô",
  },
  {
    name: "doctor",
    text: "Bác sĩ",
  },
  {
    name: "prescription",
    text: "Đơn thuốc",
  },
  {
    name: "health_facility",
    text: "Cơ sở khám bệnh",
  },
  {
    name: "specialist",
    text: "Chuyên khoa",
  },
  {
    name: "level",
    text: "Trình độ",
  },
  {
    name: "work_place",
    text: "Nơi công tác",
  },
  {
    name: "group_product",
    text: "Nhóm sản phẩm",
  },
  {
    name: "customer",
    text: "Khách hàng",
  },
  {
    name: "group_customer",
    text: "Nhóm khách hàng",
  },
  {
    name: "group_supplier",
    text: "Nhóm NCC",
  },
  {
    name: "supplier",
    text: "NCC",
  },
  {
    name: "product_folder",
    text: "Loại sản phẩm",
  },
  {
    name: "product",
    text: "Sản phẩm",
  },
  {
    name: "product_utility",
    text: "Nhóm công dụng",
  },
  {
    name: "product_treatment",
    text: "Nhóm điều trị",
  },
  {
    name: "product_manufacture",
    text: "Nhà sản xuất",
  },
  {
    name: "product_unit",
    text: "Đơn vị tính",
  },
  {
    name: "discount",
    text: "Phần trăm chiết khấu",
  },
  {
    name: "tag",
    text: "Thẻ",
  },
  {
    name: "question_answer",
    text: "Câu hỏi thường gặp",
  },
  {
    name: "contact_work",
    text: "Khách hàng liên hệ",
  },
  {
    name: "filter_price",
    text: "Lọc theo giá",
  },
  {
    name: "filter_percent_discount",
    text: "Lọc theo chiết khấu",
  },
  {
    name: "order",
    text: "Đơn hàng",
  },
  {
    name: "banner",
    text: "Banner",
  },
  {
    name: "role",
    text: "Nhóm quyền",
  },
  {
    name: "notification",
    text: "Thông báo",
  },
  {
    name: "position",
    text: "Vị trí",
  },
  {
    name: "dosage",
    text: "Đường thuốc",
  },
  {
    name: "country-produce",
    text: "Nước sản xuất",
  },
];

export const actionPermissions = [
  {
    name: "read",
    text: "Truy cập",
  },
  {
    name: "create",
    text: "Thêm",
  },
  {
    name: "update",
    text: "Sửa",
  },
  {
    name: "delete",
    text: "Xóa",
  },
  {
    name: "download",
    text: "Download/Upload",
  },
  {
    name: "view_all",
    text: "Xem tất cả",
  },
];

export function getPermissionByAction(action) {
  return models
    .filter((m) => m.permissions.includes(action))
    .map((model) => `${action}-${model.name}`);
}
