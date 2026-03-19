# Bài Thực Hành 3: Xây dựng Web App bằng Express + EJS

## Thông tin sinh viên
- **Họ và tên:** Song Hiệp
- **Chủ đề ứng dụng:** Website Du Lịch Việt Nam

## Cấu trúc thư mục dự án
- `app.js`: File khởi chạy server và định nghĩa các route cơ bản.
- `views/`: Chứa các template giao diện sử dụng EJS (index, list, detail, contact) và thư mục `layouts/` chứa thành phần dùng chung (header, navbar, footer).
- `public/`: Thư mục chứa tài nguyên tĩnh như CSS (`css/style.css`).
- `package.json`: Chứa thông tin cấu hình dự án và các thư viện (Express, EJS).

## Cách cài đặt và chạy ứng dụng
1. Mở terminal tại thư mục dự án.
2. Chạy lệnh `npm install` để cài đặt thư viện.
3. Chạy lệnh `node app.js` để khởi động máy chủ.
4. Truy cập trang web qua trình duyệt tại: `http://localhost:3000`