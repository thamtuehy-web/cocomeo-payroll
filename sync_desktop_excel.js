const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function updateDesktopExcel() {
    const desktopPath = "C:/Users/Admin/Desktop/Calcul Salaire.xlsx";
    const dbPath = path.join(__dirname, "database.json");

    if (!fs.existsSync(dbPath)) {
        console.error("database.json không tồn tại!");
        return;
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const monthKey = db.currentMonth || "2026-09";
    const payroll = db.payrolls[monthKey] || [];
    const timesheet = db.timesheets[monthKey] || [];

    console.log(`Đang đồng bộ ${payroll.length} nhân viên vào file Excel Desktop...`);

    // Tạo workbook mới hoặc ghi đè sheet T9
    let wb;
    if (fs.existsSync(desktopPath)) {
        wb = xlsx.readFile(desktopPath);
    } else {
        wb = xlsx.utils.book_new();
    }

    // Xây dựng dữ liệu sheet T9 hoàn chỉnh
    const sheetData = [
        ["DATA CHAM CONG & BANG LUONG COCOMEO", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [`Kỳ tính lương: Tháng ${monthKey.split('-')[1]}/${monthKey.split('-')[0]} (Đã cập nhật tự động & giờ làm thêm)`, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
            "STT",
            "Cơ sở",
            "Mã chấm công",
            "Họ và Tên",
            "Giờ máy chấm (h)",
            "Giờ làm thêm / Chấm giấy (h)",
            "Ghi chú giờ thêm",
            "Tổng giờ làm thực tế (h)",
            "Giờ làm (HH:MM)",
            "Lương / giờ (VND)",
            "Lương cơ bản (Initial)",
            "Đã ứng",
            "Phạt kỷ luật",
            "Lương sau ứng & phạt",
            "Cọc áo / BHXH",
            "Tổng thưởng & phụ phí",
            "TỔNG CUỐI (Thực nhận)",
            "Ngân hàng",
            "Số tài khoản",
            "Tên tài khoản",
            "Trạng thái CK"
        ]
    ];

    let sumMachine = 0, sumExtra = 0, sumTotalHours = 0, sumBase = 0, sumAdvance = 0, sumPenalty = 0, sumBalance = 0, sumDeposit = 0, sumBonus = 0, sumTotal = 0;

    payroll.forEach((p, idx) => {
        const ts = timesheet.find(t => (t.staffCode || '').toLowerCase().trim() === p.code.toLowerCase().trim());
        const machineHours = ts ? (ts.machineHours !== undefined ? ts.machineHours : p.hours) : p.hours;
        const extraHours = ts ? (ts.extraHours || 0) : 0;
        const extraNote = ts ? (ts.extraNote || "") : "";
        const totalHours = p.hours;

        sumMachine += machineHours;
        sumExtra += extraHours;
        sumTotalHours += totalHours;
        sumBase += p.baseSalary;
        sumAdvance += p.advance;
        sumPenalty += p.penalty;
        sumBalance += p.balance;
        sumDeposit += p.deposit;
        sumBonus += p.bonus;
        sumTotal += p.total;

        // Định dạng HH:MM
        const totalMinutes = Math.round(totalHours * 60);
        const hh = Math.floor(totalMinutes / 60);
        const mm = totalMinutes % 60;
        const timeStr = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;

        sheetData.push([
            idx + 1,
            p.branch,
            p.code,
            p.name,
            machineHours,
            extraHours,
            extraNote,
            totalHours,
            timeStr,
            p.wage,
            p.baseSalary,
            p.advance,
            p.penalty,
            p.balance,
            p.deposit,
            p.bonus,
            p.total,
            p.bankName,
            p.bankAccount,
            p.accountHolder,
            p.isTransferred ? "Đã chuyển khoản (+)" : "Chưa chuyển khoản (-)"
        ]);
    });

    // Dòng tổng cộng
    sheetData.push([
        "TỔNG CỘNG",
        "",
        "",
        `${payroll.length} Nhân viên`,
        sumMachine,
        sumExtra,
        "",
        sumTotalHours,
        "",
        "",
        sumBase,
        sumAdvance,
        sumPenalty,
        sumBalance,
        sumDeposit,
        sumBonus,
        sumTotal,
        "",
        "",
        "",
        ""
    ]);

    const newWs = xlsx.utils.aoa_to_sheet(sheetData);

    // Set độ rộng cột
    newWs['!cols'] = [
        { wch: 6 },  // STT
        { wch: 8 },  // Cơ sở
        { wch: 15 }, // Mã
        { wch: 24 }, // Tên
        { wch: 16 }, // Giờ máy
        { wch: 22 }, // Giờ thêm
        { wch: 22 }, // Ghi chú thêm
        { wch: 18 }, // Tổng giờ
        { wch: 12 }, // HH:MM
        { wch: 14 }, // Lương/h
        { wch: 18 }, // Lương cơ bản
        { wch: 14 }, // Ứng
        { wch: 14 }, // Phạt
        { wch: 18 }, // Còn lại
        { wch: 16 }, // Cọc áo
        { wch: 18 }, // Thưởng
        { wch: 20 }, // Tổng cuối
        { wch: 16 }, // Bank
        { wch: 18 }, // STK
        { wch: 25 }, // Tên TK
        { wch: 18 }  // CK
    ];

    wb.Sheets['T9'] = newWs;
    if (!wb.SheetNames.includes('T9')) wb.SheetNames.push('T9');

    try {
        xlsx.writeFile(wb, desktopPath);
        console.log(`✅ ĐÃ CẬP NHẬT TRỰC TIẾP VÀO: ${desktopPath}`);
    } catch (e) {
        console.warn(`[Lưu ý] Không thể ghi file Desktop (Môi trường Cloud/Server):`, e.message);
    }
    return { success: true, count: payroll.length, total: sumTotal };
}

if (require.main === module) {
    updateDesktopExcel();
}

module.exports = { updateDesktopExcel };
