export const ROUTERS = {
  LOGIN: "/dang-nhap",
  SIGNUP: "/dang-ky",
  VERIFY_OTP: "/xac-thuc-tai-khoan",
  USER: {
    HOME: "/",
    PRODUCTS: "san-pham",
    DETAILS: "/chi-tiet-san-pham",
    CONTACTS: "/lien-he",
    ABOUT: "/khac",
    CART: "/gio-hang",
    ORDERLOOKUP: "/tra-cuu-don-hang",

    ORDERPAYMENT: "/thanh-toan",
    ORDER: "/tao-don-hang",
    PRODUCT_TYPE: "loai-san-pham",
    ORDERDETAIL: "/chi-tiet-don-hang",
    ORDERLIST: "/danh-sach-don-hang",
    ORDERLOOKUP: "/tra-cuu-don-hang",
    PAYMENT: "/ket-qua-thanh-toan",
    ADD_REVIEW: "/danh-gia-san-pham",
    PRODUCTS_BYCATEGORY: "/san-pham-theo-loai"
  },
  ADMIN: {
    DASHBOARD: "/admin",
    CREATE_PRODUCT: "/admin/them-san-pham",
    CREATE_CATEGORY: "/admin/them-loai-san-pham",
    PRODUCT_LIST: "/admin/san-pham",
    MANAGE_STAFF: "/admin/quan-ly-nguoi-dung",
    MANAGE_PRODUCTS: "/admin/quan-ly-san-pham",
    REVENUE_STATS: "/admin/bao-cao-doanh-thu",
    PURCHASE_HISTORY: "/admin/lich-su-giao-dich",
    UPDATE_PRODUCT: "/admin/chinh-sua-san-pham",
    UPDATE_CATEGORY: "/admin/chinh-sua-loai-san-pham",
    DELETE_PRODUCT: "/admin/xoa-san-pham",
    DETAILS_PRODUCT: "/admin/chi-tiet-san-pham",
    UPDATE_USER: "/admin/chinh-sua-tai-khoan",
    DELETE_USER: "/admin/xoa-tai-khoan",
    MANAGE_PRODUCT_TYPES: "/admin/quan-ly-loai-san-pham",
    MANAGER_ORDER: "/admin/quan-ly-don-hang",
    VOUCHER: "/admin/ma-giam-gia",
    PRODUCTS_DETAIL: "/admin/chitietsanpham"
  },
  USERPROFILE: {
    ACCOUNT_INFO: "/thong-tin-ca-nhan",
    ORDER_MANAGERMENT: "/quan-ly-don-hang",
    VIEW_PRODUCTS: "/lich-su-xem-san-pham",
    ADDRESS_BOOK: "/so-dia-chi"
  }
};
