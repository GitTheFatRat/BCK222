# backend/exam-source-bank/_failed/CAMBRIDGE-19-TEST01/error.txt

## Muc dich (1-2 cau)
File văn bản này ghi lại các lỗi phát sinh (log) trong quá trình dùng công cụ tự động chuyển đổi định dạng (Ingest/Parse) đề thi này.

## Import / phu thuoc
- Không có. Đây chỉ là file dữ liệu tĩnh.

## Noi dung chi tiet
- Định dạng: Text.
- Dữ liệu này được đọc bởi kịch bản generate-tests.js hoặc API /api/ingest để đẩy lên Database MongoDB.

## Duoc su dung boi (dependents)
- ackend/controllers/ingestController.js (hoặc script seeder).

## Diem dang chu y (neu co)
- Đây là dữ liệu giả lập (Mock Data) hoặc dữ liệu đề thi thô được lưu trữ dạng file cục bộ thay vì nhét hết lên Database từ đầu, giúp dễ dàng chỉnh sửa tay khi có lỗi chính tả.
