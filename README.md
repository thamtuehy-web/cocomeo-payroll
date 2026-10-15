# 🐾 CocoMeo - Phần Mềm Quản Lý Lương & Thông Tin Nhân Viên Tự Động

Ứng dụng chuyên biệt cho chuỗi cà phê mèo **CocoMeo** (hoạt động trên 3 cơ sở **CS1, CS2, CS3**), tự động hóa toàn bộ quy trình:
1. **Đọc dữ liệu máy chấm công xuất hàng tháng** (theo tên nhân viên và các cột giờ quẹt vân tay).
2. **Tự động tính tổng số giờ làm việc thực tế**, khử các lần quẹt thẻ trùng lặp hoặc cảnh báo quẹt lẻ.
3. **Tra cứu đơn giá lương theo giờ** từ bảng hồ sơ nhân sự (Staff Info).
4. **Nhân số giờ làm với mức lương** để ra Lương cơ bản (*Total Initial*).
5. **Cộng các khoản thưởng & phụ phí**:
   - *Thưởng chuyên cần:* Tự động xét theo thang bậc giờ làm trong tháng (từ 110h đến ≥ 230h tương ứng từ 20k đến 140k).
   - *Thưởng sinh nhật:* Tự động kiểm tra nhân viên có sinh nhật trong tháng và thâm niên ≥ 6 tháng → thưởng 100k.
   - *Phụ phí xăng xe:* Hỗ trợ di chuyển giữa các cơ sở (150k).
   - *Phục vụ khách đoàn & Tiệc sinh nhật:* 25k - 30k / ca.
   - *Thưởng giới thiệu (Cooptation):* 100k / người giới thiệu.
   - *Thưởng khác / Dọn vệ sinh:* 30k - 50k.
6. **Khấu trừ các khoản phạt & tạm ứng**:
   - *Phạt kỉ luật:* Bỏ ca (50k - 100k), chơi điện thoại trong giờ làm việc (30k), đi trễ...
   - *Tạm ứng lương:* Các khoản ứng giữa tháng.
   - *Cọc áo đồng phục & BHXH:* Thu cọc 300k, hoàn cọc 300k khi nghỉ việc, nộp tiền BHXH.
7. **Tự động làm tròn số tiền** đến hàng nghìn đồng để ra **TỔNG LƯƠNG CUỐI CÙNG**.
8. **Tiện ích chuyển khoản VietQR Napas 24/7** 1-click quét mã chuyển tiền qua tất cả ngân hàng Việt Nam.
9. **In phiếu lương cá nhân (Payslip)** chi tiết, chuyên nghiệp gửi cho nhân viên.
10. **Xuất Bảng Lương ra Excel (.xlsx)** chuẩn mẫu ban đầu.

---

## 🚀 Hướng Dẫn Khởi Chạy

- **Cách 1 (Khuyên dùng):** Nhấp đúp chuột vào file `Chay-Phan-Mem.bat`. Ứng dụng sẽ tự động mở ở chế độ App Desktop bằng Chrome / Edge hoặc trình duyệt mặc định.
- **Cách 2:** Nhấp đúp trực tiếp vào file `index.html` trong thư mục này.

---

## 💡 Quy Trình Tính Lương Cuối Tháng Khi Xuất Công

### Bước 1: Xuất dữ liệu từ máy chấm công
Máy chấm công của quán xuất file Excel hoặc CSV có định dạng:
`Mã, Tên nhân viên, Tên bộ phận, Ngày, Thứ, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10`

### Bước 2: Nhập công vào phần mềm
1. Vào tab **"⏱️ Nhập Công & Tính Tự Động"**.
2. **Kéo thả file chấm công** vào ô tải lên, hoặc **Copy toàn bộ dữ liệu Excel rồi dán (Ctrl+V)** vào ô nhập liệu.
3. Bấm nút **"⚙️ Phân Tích Dữ Liệu"**.
   - Phần mềm sẽ tự động đọc các giờ quẹt thẻ (ví dụ `08:07`, `12:44`, `15:10`, `21:37`...).
   - Khử trùng lặp quẹt thẻ nhiều lần khi vào ca.
   - Tính tổng số giờ làm việc trong tháng cho từng người.
   - Báo cáo số ngày công và cảnh báo nếu có ngày nhân viên quên quẹt thẻ ra.

### Bước 3: Tự động tính bảng lương
1. Bấm nút **"🚀 Áp Dụng & Tự Động Tính Bảng Lương Ngay"** (hoặc nút **"⚡ Tự Động Tính Lương"** trên thanh header).
2. Hệ thống tự động:
   - Tra cứu mức lương giờ của từng nhân viên theo hồ sơ.
   - Tính lương cơ bản: `Tổng giờ làm × Lương/giờ`.
   - Tra bậc thang Chuyên cần và cộng tiền thưởng tương ứng.
   - Kiểm tra sinh nhật trong tháng (nếu thâm niên > 6 tháng cộng 100k).
   - Cộng dồn các khoản thưởng khách đoàn, tiệc SN, xăng xe, giới thiệu...
   - Khấu trừ các khoản tạm ứng giữa tháng và phạt kỉ luật.
   - Tính hoàn cọc áo hoặc thu cọc áo.
   - Làm tròn tiền đến hàng nghìn đồng.

### Bước 4: Thanh toán & In phiếu lương
- Tại tab **"📊 Bảng Lương Tổng Hợp"**:
  - Bấm nút **"📱 QR"** ở từng dòng nhân viên để hiện mã VietQR với số tiền và nội dung chuyển khoản đã điền sẵn, quét bằng app ngân hàng là chuyển xong trong 3 giây.
  - Bấm nút **"📄 Phiếu"** để xem và in phiếu lương gửi Zalo cho nhân viên.
  - Bấm **"📥 Xuất Excel"** để lưu trữ bảng lương file .xlsx.

---

## 🏢 Cơ Cấu Quản Lý 3 Cơ Sở CocoMeo

- **CS1 (Cơ sở 1):** 19 nhân sự (Noa, Thành Phương, Mỹ Tâm, Kim Tuyên, Ngọc Trường, Hải Âu, Ngọc Huyền, Phương Thảo, Minh Thiện, Thuỳ Trang, Hoàng Mỹ, Ánh Hồng, Bách Duy, Ngọc Tài, Phan Lê, Cao Bảo Ngân, Ngọc Quyên, Lê Sang...).
- **CS2 (Cơ sở 2):** 13 nhân sự (Mỹ Mỹ, Ý Linh, Huỳnh Liên, Mỹ Thanh, Quỳnh Nga, Thùy Linh, Quế Trân, Thanh Thuỷ, Loan Châu, Quỳnh Hương, Thanh Xuân, Thiện Thành, Minh Thư...).
- **CS3 (Cơ sở 3):** 11 nhân sự (Diễm Phúc, Diễm Quỳnh, Thảo Nguyên, Quốc Khánh, Trọng Nghĩa, Tố Uyên, Tuấn Khang, Tấn Dũng, Nhật Tiên, Phương Trinh, Diễm Thuý, Phước Ghi...).
- **Kho lưu trữ nhân sự đã nghỉ việc:** 121 nhân viên với lý do nghỉ việc, thời gian công tác và lịch sử hoàn cọc.
