# backend/middlewares/adminMiddleware.js

## Muc dich (1-2 cau)
File này chứa một middleware để kiểm tra quyền quản trị viên (Admin) của người dùng trước khi cho phép họ truy cập vào các API nhạy cảm. Nó hoạt động như một "người gác cổng" thứ hai, thường đứng ngay sau middleware kiểm tra đăng nhập.

## Import / phu thuoc
(File này không có import nào vì nó chỉ sử dụng các tham số có sẵn từ Express framework là `req`, `res`, `next`).

## Noi dung chi tiet
- **`adminMiddleware(req, res, next)`**: Hàm middleware tiêu chuẩn của Express.
  - `if (req.user && req.user.role === 'admin')`: Kiểm tra xem object `req.user` đã tồn tại chưa (điều này ngầm định rằng `authMiddleware` phải được chạy **trước** middleware này để gán thông tin user vào `req`), và kiểm tra thuộc tính `role` có phải là `admin` không.
  - `next();`: Nếu đúng là admin, gọi hàm `next()` để chuyển luồng xử lý sang middleware hoặc controller tiếp theo.
  - `return res.status(403).json(...)`: Nếu không phải admin (ví dụ user bình thường hoặc chưa đăng nhập), lập tức chặn request, trả về mã lỗi HTTP 403 (Forbidden) cùng với thông báo từ chối truy cập.

## Duoc su dung boi (dependents)
- `backend/routes/resultRoutes.js`: Sử dụng để bảo vệ các route dành riêng cho admin như lấy danh sách bài chờ chấm điểm (`/admin/pending`), chấm điểm (`/admin/:id/grade`), và xem log gian lận (`/admin/cheating-logs`).

## Diem dang chu y (neu co)
- **Thứ tự thực thi bắt buộc**: Middleware này **phải** được đặt sau `authMiddleware`. Nếu đặt trước, `req.user` sẽ luôn là `undefined`, dẫn đến việc ngay cả Admin hợp lệ cũng bị từ chối truy cập 403. Code ở `resultRoutes.js` tuân thủ đúng điều này: `authMiddleware, adminMiddleware, ...`.
