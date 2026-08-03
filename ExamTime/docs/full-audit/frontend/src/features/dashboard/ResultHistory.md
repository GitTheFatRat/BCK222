# frontend/src/features/dashboard/ResultHistory.jsx

## Muc dich (1-2 cau)
File này định nghĩa một bảng (Table) thống kê lại toàn bộ lịch sử các bài thi mà người dùng đã làm. Bảng này hiển thị điểm chi tiết từng kỹ năng (Listening, Reading, Writing, Speaking), điểm Overall (Trung bình chung), và trạng thái (ví dụ: đã chấm xong hay đang chờ giáo viên chấm).

## Import / phu thuoc
- Không có import bên ngoài, chỉ là một UI Component thuần túy của React nhận dữ liệu qua `props`.

## Noi dung chi tiet
- Component nhận prop `results` (là một mảng các đối tượng lịch sử thi).
- Nếu mảng rỗng: Trả về một thẻ `<p>` thông báo chưa có dữ liệu.
- **Render Bảng (`table.result-history`)**:
  - Dùng vòng lặp `.map` để duyệt qua từng đối tượng `session` trong `results`.
  - Kiểm tra xem session này có chứa bài làm Writing/Speaking không (vì đôi khi user chỉ thi mỗi Reading/Listening rồi nộp).
  - Khai thác (`extract`) điểm số từ `session.skills...scores`.
  - Kiểm tra `isPending`: Bằng cách duyệt qua tất cả các skills, nếu có bất kỳ kỹ năng nào đang ở trạng thái `GRADING` hoặc `SUBMITTED` (chưa có điểm), thì coi như cả bài thi đó đang chờ chấm (Pending).
  - Trả về thẻ `<tr>` chứa các cột `<td>`:
    - Tên bài thi.
    - Ngày thi (được định dạng lại qua hàm helper `formatDate` thành chuẩn ngày/tháng/năm của Việt Nam).
    - Điểm từng kỹ năng (Nếu chưa có sẽ hiện chữ "Pending" hoặc dấu `--`).
    - Cột Status: Hiển thị số lượng kỹ năng đã nộp (ví dụ `2/5 skills`). Nếu `isPending` là true, hiển thị thêm một huy hiệu (badge) "Pending" màu vàng.
- **Hàm phụ (Helpers)**:
  - `formatDate(isoString)`: Chuyển chuỗi thời gian ISO thành định dạng `vi-VN`.
  - `StatusBadge({ status })`: Hàm này được khai báo nhưng đang là **Dead Code** (chưa được gọi ở đâu trong phần render chính của bảng).

## Duoc su dung boi (dependents)
- `frontend/src/pages/HomeDashboard.jsx`: Dùng để hiển thị mục "Recent Results" ở nửa dưới của trang chủ.

## Diem dang chu y (neu co)
- **Dead code `StatusBadge`**: Dòng 58-65 chứa component `StatusBadge` nhưng không được sử dụng. Có thể tác giả định dùng nó cho cột Status ở cuối nhưng sau đó lại tự code thủ công bằng thẻ `<span>` thẳng trong vòng lặp `.map`. Nên dọn dẹp hàm này.
- Logic kiểm tra `typeof writingT1Band === 'number'` rất chặt chẽ, đề phòng trường hợp điểm số là `0` vẫn được hiển thị đúng chứ không bị dính lỗi falsy chuyển thành chữ "Pending".
