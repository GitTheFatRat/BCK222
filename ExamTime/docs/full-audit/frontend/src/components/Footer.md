# frontend/src/components/Footer.jsx

## Muc dich (1-2 cau)
File này đóng vai trò là một file trung gian (Barrel/Proxy Export) để tái xuất (re-export) component `Footer` từ thư mục `Layout/`. 

## Import / phu thuoc
- Import default từ `./Layout/Footer.jsx`.

## Noi dung chi tiet
- `export { default } from './Layout/Footer.jsx';`: Nhận nội dung export default của file gốc và lập tức export nó ra ngoài.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Thay vì phải import đường dẫn dài `import Footer from './components/Layout/Footer'`, App.jsx chỉ cần gọi đường dẫn ngắn gọn `import Footer from './components/Footer'`.

## Diem dang chu y (neu co)
- Trong quá trình phát triển (được nhắc đến ở checkpoint trước), tác giả đã quyết định đập đi xây lại giao diện và di chuyển các component liên quan đến bố cục (như Navbar, Sidebar, Footer) vào trong thư mục con `Layout/` cho gọn gàng. File này được giữ lại như một "cầu nối" để không làm hỏng (break) các code cũ (như `App.jsx`) đang import theo đường dẫn cũ. Dù vậy, theo Best Practice, nên cập nhật lại đường dẫn import ở `App.jsx` và xóa luôn file trung gian này đi để tránh nhầm lẫn.
