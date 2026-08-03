# frontend/src/components/AudioPlayer.jsx

## Muc dich (1-2 cau)
File này định nghĩa một Component phát âm thanh (Audio Player) tùy chỉnh, chuyên dùng cho phần thi Listening. Nó có khả năng chuyển đổi giữa 2 chế độ: Chế độ luyện tập (nghe thoải mái) và Chế độ thi thật (chỉ được nghe đúng 1 lần, không được tua, không được tải về).

## Import / phu thuoc
- `useRef`, `useState`, `useEffect` từ `react`: Các hook cơ bản để quản lý tham chiếu tới thẻ `<audio>` HTML và trạng thái phát nhạc.

## Noi dung chi tiet
- Component nhận 2 props: `src` (đường dẫn file âm thanh) và `examMode` (chế độ thi, boolean).
- Quản lý 2 trạng thái chính: `isPlaying` (đang phát) và `hasPlayedOnce` (đã từng phát qua chưa).
- Sử dụng `useEffect` để gắn (add) và gỡ (remove) các event listener (`play`, `pause`, `ended`) lên thẻ `<audio>` gốc của trình duyệt.
- Hàm `handleTogglePlay()`: Xử lý khi người dùng ấn nút Play/Pause (chỉ hiện ra khi ở chế độ `examMode`). 
  - Điểm chốt chặn: `if (examMode && hasPlayedOnce && audio.paused) return;`. Nghĩa là nếu đang thi thật (`examMode`), đã từng bật file lên rồi (`hasPlayedOnce`), và hiện tại đang tạm dừng (`audio.paused`), thì sẽ bị khóa luôn, không cho bấm Play lại (Giả lập quy tắc thi IELTS Listening thực tế).
- **Phần Render (UI)**:
  - `<audio>` gốc: Nếu không phải `examMode` (chế độ luyện tập), nó hiện thanh control gốc của trình duyệt (`controls={true}`). Nếu đang thi thật, nó ẩn luôn thanh controls gốc, thêm thuộc tính `controlsList='nodownload noplaybackrate'`, khóa luôn chuột phải (`onContextMenu`) và chặn hành động tua (`onSeeking`).
  - Nút Play Custom: Chỉ hiện khi `examMode={true}`. Nếu đã phát một lần và đang dừng, nút này bị `disabled`.

## Duoc su dung boi (dependents)
- `frontend/src/pages/ExamRoom.jsx`: Import vào để người dùng nghe các bài Listening (truyền `examMode={true}`).

## Diem dang chu y (neu co)
- **Hạn chế kỹ thuật**: Việc chặn tua (`onSeeking={(e) => e.preventDefault()}`) trên thẻ `<audio>` native thực tế là **chưa đủ**. Sự kiện `seeking` không thể bị hủy hoàn toàn bằng `preventDefault` trên hầu hết trình duyệt hiện đại. Để khóa tua tuyệt đối, cần phải lưu lại `currentTime` ở lần chạy trước và ép nó quay lại mốc đó nếu phát hiện `currentTime` bị thay đổi đột ngột. Tuy nhiên với mục đích chống gian lận cơ bản, vì UI đã ẩn đi thanh Progress Bar nên người dùng bình thường khó có thể tua được.
