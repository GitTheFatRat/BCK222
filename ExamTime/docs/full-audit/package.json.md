# /package.json

## Muc dich (1-2 cau)
File này đóng vai trò là trình quản lý thư viện phụ thuộc (Dependency Manager) ở thư mục gốc (Root) của toàn dự án (workspace).

## Import / phu thuoc
- Không có.

## Noi dung chi tiet
- Nội dung file cực kỳ đơn giản, chỉ khai báo một phụ thuộc duy nhất: `"multer": "^2.2.0"`.
- Thực tế, cấu trúc dự án này được chia thành hai phần rõ rệt là `backend` và `frontend`, mỗi bên đều có file `package.json` riêng biệt, quản lý thư viện riêng biệt. Việc tồn tại một file `package.json` thứ ba ở ngoài thư mục Root chứa thư viện `multer` có vẻ như là một **sai sót kỹ thuật** (developer lỡ tay gõ `npm install multer` khi đang đứng ở thư mục gốc thay vì thư mục `backend`).

## Duoc su dung boi (dependents)
- Tiến trình `npm`.

## Diem dang chu y (neu co)
- **Dead Code/Misplaced File:** Nên xóa hẳn file này (và file `package-lock.json` đi kèm ở Root) để tránh gây nhầm lẫn về cấu trúc dự án. Thư viện `multer` vốn dĩ đã được cài đặt và quản lý chuẩn xác bên trong file `backend/package.json` rồi.
