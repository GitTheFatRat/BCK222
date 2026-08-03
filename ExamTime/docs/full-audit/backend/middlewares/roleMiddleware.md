# backend/middlewares/roleMiddleware.js

## Muc dich (1-2 cau)
File này cung cấp một hàm sinh middleware (middleware factory) để kiểm tra quyền truy cập dựa trên danh sách các vai trò (roles) được cho phép. Nó linh hoạt hơn `adminMiddleware` vì có thể cấu hình động cho nhiều role khác nhau trên cùng một route.

## Import / phu thuoc
(Không có import bên ngoài).

## Noi dung chi tiet
- **`roleMiddleware(...allowedRoles)`**: Hàm này nhận vào một mảng các string đại diện cho các role được phép (sử dụng rest parameter `...`). Ví dụ: `roleMiddleware('admin', 'teacher')`. Thay vì trực tiếp xử lý request, hàm này *trả về* (return) một hàm middleware của Express `(req, res, next)`. Kỹ thuật này gọi là Currying hoặc Closure.
  - **Bên trong hàm được trả về**:
    - `if (!req.user)`: Kiểm tra an toàn xem người dùng đã đăng nhập chưa (cần `authMiddleware` chạy trước). Nếu chưa, trả về `401 Unauthorized`.
    - `if (!allowedRoles.includes(req.user.role))`: Lấy `req.user.role` (ví dụ: "student") và đối chiếu xem nó có nằm trong mảng `allowedRoles` (ví dụ: `['admin']`) hay không. Nếu không, chặn truy cập và trả về `403 Forbidden`.
    - `next()`: Nếu role hợp lệ, cho phép request đi tiếp.

## Duoc su dung boi (dependents)
- `backend/routes/adminRoutes.js`: Sử dụng hàm này để bảo vệ route `/admin/ingest` (ví dụ: `roleMiddleware('admin')`), nhằm đảm bảo chỉ có admin mới được quyền upload đề thi JSON vào hệ thống.

## Diem dang chu y (neu co)
- **Sự dư thừa (Redundancy)**: Dự án hiện tại đang có 2 middleware có chung một mục đích kiểm tra quyền admin: `adminMiddleware.js` (kiểm tra cứng ngắc chữ "admin") và `roleMiddleware.js` (kiểm tra động). Đây là một mã lặp (code smell) nhỏ. Trong tương lai, lý tưởng nhất là nên gỡ bỏ `adminMiddleware` và dùng thống nhất `roleMiddleware('admin')` cho toàn bộ hệ thống để code dễ bảo trì hơn.
- Giống như `adminMiddleware`, nó hoàn toàn phụ thuộc vào việc `authMiddleware` đã decode token và gán vào `req.user`.
