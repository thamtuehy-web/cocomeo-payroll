/**
 * DATA NGUYÊN BẢN HỆ THỐNG QUẢN LÝ LƯƠNG & NHÂN VIÊN COCOMEO
 * Dữ liệu chuẩn từ 2 file: Bảng Chấm Công 09/2026 & File Thông Tin Nhân Viên (Staff Info)
 */

const DEFAULT_ATTENDANCE_LADDER = [
    { minHours: 230, bonus: 140000, label: ">= 230 giờ" },
    { minHours: 220, bonus: 130000, label: ">= 220 giờ" },
    { minHours: 210, bonus: 120000, label: ">= 210 giờ" },
    { minHours: 200, bonus: 110000, label: ">= 200 giờ" },
    { minHours: 190, bonus: 100000, label: ">= 190 giờ" },
    { minHours: 180, bonus: 90000, label: ">= 180 giờ" },
    { minHours: 170, bonus: 80000, label: ">= 170 giờ" },
    { minHours: 160, bonus: 70000, label: ">= 160 giờ" },
    { minHours: 150, bonus: 60000, label: ">= 150 giờ" },
    { minHours: 140, bonus: 50000, label: ">= 140 giờ" },
    { minHours: 130, bonus: 40000, label: ">= 130 giờ" },
    { minHours: 120, bonus: 30000, label: ">= 120 giờ" },
    { minHours: 110, bonus: 20000, label: ">= 110 giờ" },
    { minHours: 100, bonus: 10000, label: ">= 100 giờ" }
];

// Dữ liệu tổng hợp công chuẩn Tháng 09/2026 cho 42 nhân sự
const DEFAULT_TIMESHEETS_SEP2026 = [
    // CS1
    { staffCode: "Anhhong", staffName: "Ánh Hồng", branch: "CS1", totalHours: 106.416667, workDays: 18, warnings: 0 },
    { staffCode: "Bachduy", staffName: "Bách Duy", branch: "CS1", totalHours: 85.133333, workDays: 15, warnings: 0 },
    { staffCode: "Baongan2", staffName: "Cao Bảo Ngân", branch: "CS1", totalHours: 44.716667, workDays: 10, warnings: 0 },
    { staffCode: "Haiau", staffName: "Hải Âu", branch: "CS1", totalHours: 73.5, workDays: 14, warnings: 0 },
    { staffCode: "Hoangmy", staffName: "Hoàng Mỹ", branch: "CS1", totalHours: 61.916667, workDays: 12, warnings: 0 },
    { staffCode: "KimTuyen", staffName: "Kim Tuyên", branch: "CS1", totalHours: 123.916667, workDays: 20, warnings: 0 },
    { staffCode: "Minhthien", staffName: "Minh Thiện", branch: "CS1", totalHours: 40.066667, workDays: 9, warnings: 0 },
    { staffCode: "MyTam", staffName: "Mỹ Tâm", branch: "CS1", totalHours: 80.283333, workDays: 15, warnings: 0 },
    { staffCode: "Ngochuyen", staffName: "Ngọc Huyền", branch: "CS1", totalHours: 78.0, workDays: 16, warnings: 0 },
    { staffCode: "NgocQuyen", staffName: "Ngọc Quyên", branch: "CS1", totalHours: 27.583333, workDays: 3, warnings: 0 },
    { staffCode: "Ngoctai", staffName: "Ngọc Tài", branch: "CS1", totalHours: 74.683333, workDays: 15, warnings: 0 },
    { staffCode: "Ngoctruong", staffName: "Ngọc Trường", branch: "CS1", totalHours: 46.25, workDays: 9, warnings: 0 },
    { staffCode: "Noa", staffName: "Noa", branch: "CS1", totalHours: 196.233333, workDays: 26, warnings: 0 },
    { staffCode: "PhanLe", staffName: "Phan Lê", branch: "CS1", totalHours: 23.783333, workDays: 5, warnings: 0 },
    { staffCode: "Phuongthao", staffName: "Phương Thảo", branch: "CS1", totalHours: 45.633333, workDays: 10, warnings: 0 },
    { staffCode: "Thanhphuong", staffName: "Thành Phương", branch: "CS1", totalHours: 95.616667, workDays: 16, warnings: 0 },
    { staffCode: "Thuytrangpc", staffName: "Thuỳ Trang", branch: "CS1", totalHours: 219.75, workDays: 28, warnings: 0 },
    { staffCode: "Lesang", staffName: "Lê Sang", branch: "CS1", totalHours: 0, workDays: 0, warnings: 0 },
    
    // CS2
    { staffCode: "HuynhLien", staffName: "Huỳnh Liên", branch: "CS2", totalHours: 105.55, workDays: 18, warnings: 0 },
    { staffCode: "Loanchaupc", staffName: "Loan Châu", branch: "CS2", totalHours: 9.316667, workDays: 2, warnings: 0 },
    { staffCode: "Mymy", staffName: "Mỹ Mỹ", branch: "CS2", totalHours: 69.333333, workDays: 12, warnings: 0 },
    { staffCode: "MyThanh", staffName: "Mỹ Thanh", branch: "CS2", totalHours: 79.433333, workDays: 16, warnings: 0 },
    { staffCode: "Quynhhuong", staffName: "Quỳnh Hương", branch: "CS2", totalHours: 29.4, workDays: 7, warnings: 0 },
    { staffCode: "QuynhNga", staffName: "Quỳnh Nga", branch: "CS2", totalHours: 107.116667, workDays: 20, warnings: 0 },
    { staffCode: "Thuy", staffName: "Thanh Thuỷ", branch: "CS2", totalHours: 88.333333, workDays: 16, warnings: 0 },
    { staffCode: "Thuylinh", staffName: "Thùy Linh", branch: "CS2", totalHours: 58.35, workDays: 12, warnings: 0 },
    { staffCode: "Tran", staffName: "Quế Trân", branch: "CS2", totalHours: 68.316667, workDays: 14, warnings: 0 },
    { staffCode: "Ylinh", staffName: "Ý Linh", branch: "CS2", totalHours: 192.866667, workDays: 25, warnings: 0 },
    { staffCode: "Thanhxuan", staffName: "Thanh Xuân", branch: "CS2", totalHours: 41.583333, workDays: 9, warnings: 0 },
    { staffCode: "Thienthanh", staffName: "Thiện Thành", branch: "CS2", totalHours: 25.583333, workDays: 5, warnings: 0 },
    { staffCode: "Minhthu", staffName: "Minh Thư", branch: "CS2", totalHours: 0, workDays: 0, warnings: 0 },

    // CS3
    { staffCode: "Diemphuc", staffName: "Diễm Phúc", branch: "CS3", totalHours: 135.616667, workDays: 22, warnings: 0 },
    { staffCode: "DiemQuynh", staffName: "Diễm Quỳnh", branch: "CS3", totalHours: 122.616667, workDays: 20, warnings: 0 },
    { staffCode: "Diemthuy", staffName: "Diễm Thuý", branch: "CS3", totalHours: 21.7, workDays: 6, warnings: 0 },
    { staffCode: "Phuongtrinh", staffName: "Phương Trinh", branch: "CS3", totalHours: 62.433333, workDays: 14, warnings: 0 },
    { staffCode: "Quockhanh", staffName: "Quốc Khánh", branch: "CS3", totalHours: 104.6, workDays: 22, warnings: 0 },
    { staffCode: "Tandung", staffName: "Tấn Dũng", branch: "CS3", totalHours: 53.55, workDays: 12, warnings: 0 },
    { staffCode: "ThaoNguyen", staffName: "Thảo Nguyên", branch: "CS3", totalHours: 160.883333, workDays: 25, warnings: 0 },
    { staffCode: "ToUyen", staffName: "Tố Uyên", branch: "CS3", totalHours: 95.0, workDays: 17, warnings: 0 },
    { staffCode: "Trongnghia", staffName: "Trọng Nghĩa", branch: "CS3", totalHours: 13.2, workDays: 2, warnings: 0 },
    { staffCode: "Tuankhang", staffName: "Tuấn Khang", branch: "CS3", totalHours: 59.483333, workDays: 14, warnings: 0 },
    { staffCode: "Nhattien", staffName: "Nhật Tiên", branch: "CS3", totalHours: 55.666667, workDays: 13, warnings: 0 },
    { staffCode: "Phuocghi", staffName: "Phước Ghi", branch: "CS3", totalHours: 0, workDays: 0, warnings: 0 }
];

// Danh sách 35 nhân viên chính thức hoạt động
const DEFAULT_ACTIVE_EMPLOYEES = [
    // CS1 (19 NV)
    {
        id: "NV-001", machineCode: "00001", code: "Noa", name: "Noa", branch: "CS1", hourlyWage: 27000,
        startDate: "2023-07-01", tenureMonths: 39.9, birthDate: "1995-02-09",
        phone: "0772 414 192", zalo: "0772 414 192",
        bankName: "TIEN PHONG", bankAccount: "0366 1749 301", accountHolder: "Phan Ngân Hồng Yến",
        idCard: "048 1 95 005 157", address: "Đà Nẵng", uniformCount: 3, uniformDepositMonth: "05/2024",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2024-02-01", "2024-07-01", "2025-03-01"]
    },
    {
        id: "NV-002", machineCode: "00002", code: "Thanhphuong", name: "Thành Phương", branch: "CS1", hourlyWage: 22000,
        startDate: "2024-09-19", tenureMonths: 25.1, birthDate: "2006-02-17",
        phone: "0367 379 524", zalo: "0367 379 524",
        bankName: "TP BANK", bankAccount: "1000 502 99 11", accountHolder: "Nguyễn Thị Thành Phương",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "10/2024",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-02-01", "2025-12-01", "2026-08-01"]
    },
    {
        id: "NV-003", machineCode: "00003", code: "MyTam", name: "Mỹ Tâm", branch: "CS1", hourlyWage: 22000,
        startDate: "2024-12-01", tenureMonths: 22.6, birthDate: "2004-09-10",
        phone: "0372 522 921", zalo: "0372 522 921",
        bankName: "MB", bankAccount: "0372 522 921", accountHolder: "Trần Mỹ Tâm",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "12/2024",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-05-05", "2026-03-01", "2026-06-01"]
    },
    {
        id: "NV-004", machineCode: "00004", code: "KimTuyen", name: "Kim Tuyên", branch: "CS1", hourlyWage: 21000,
        startDate: "2026-01-01", tenureMonths: 9.4, birthDate: "2005-04-19",
        phone: "0842 667 577", zalo: "0842 667 577",
        bankName: "VIETIN BANK", bankAccount: "101 881 455 293", accountHolder: "Hồ Thanh Kim Tuyên",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "01/2026",
        status: "active", note: "", cooptedBy: "Huỳnh Liên", salaryHistory: ["2026-05-01", "2026-09-01"]
    },
    {
        id: "NV-005", machineCode: "00005", code: "Ngoctruong", name: "Ngọc Trường", branch: "CS1", hourlyWage: 23000,
        startDate: "2024-02-22", tenureMonths: 22.8, birthDate: "2005-03-30",
        phone: "0339 647 790", zalo: "0332 179 970",
        bankName: "VIETINBANK", bankAccount: "0339 647 790", accountHolder: "Trần Ngọc Trường",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "05/2024",
        status: "active", note: "Đổi 1 áo đp", cooptedBy: "Phi Đông", salaryHistory: ["2024-05-02", "2025-02-01", "2025-06-01", "2026-10-01"]
    },
    {
        id: "NV-006", machineCode: "00006", code: "Haiau", name: "Hải Âu", branch: "CS1", hourlyWage: 20000,
        startDate: "2026-06-07", tenureMonths: 4.2, birthDate: "2006-08-01",
        phone: "0396 061 370", zalo: "0396 061 370",
        bankName: "MB", bankAccount: "0396 061 370", accountHolder: "Nguyễn Thị Hải Âu",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "07/2026",
        status: "active", note: "", cooptedBy: "Kim Tuyên", salaryHistory: []
    },
    {
        id: "NV-007", machineCode: "00007", code: "Ngochuyen", name: "Ngọc Huyền", branch: "CS1", hourlyWage: 19000,
        startDate: "2026-08-09", tenureMonths: 2.1, birthDate: "2008-05-11",
        phone: "0857 110 508", zalo: "0857 110 508",
        bankName: "VP BANK", bankAccount: "0857 110 508", accountHolder: "Nguyễn Ngọc Huyền",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "09/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-008", machineCode: "00008", code: "Phuongthao", name: "Phương Thảo", branch: "CS1", hourlyWage: 19000,
        startDate: "2026-09-11", tenureMonths: 1.0, birthDate: "2008-09-10",
        phone: "0823 066 483", zalo: "0823 066 483",
        bankName: "MB", bankAccount: "0357 579 326", accountHolder: "Nguyễn Phương Thảo",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "09/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-009", machineCode: "00009", code: "Minhthien", name: "Minh Thiện", branch: "CS1", hourlyWage: 19000,
        startDate: "2026-09-10", tenureMonths: 1.0, birthDate: "2007-04-27",
        phone: "0378 894 110", zalo: "0378 894 110",
        bankName: "MB", bankAccount: "0378 894 110", accountHolder: "Huỳnh Minh Thiện",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "10/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-010", machineCode: "00010", code: "Thuytrangpc", name: "Thuỳ Trang", branch: "CS1", hourlyWage: 23000,
        startDate: "2025-12-27", tenureMonths: 9.6, birthDate: "2006-06-29",
        phone: "0528 378 583", zalo: "0528 378 583",
        bankName: "ACB", bankAccount: "173 832 71", accountHolder: "Định Thị Thuỳ Trang",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "12/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-03-01"]
    },
    {
        id: "NV-011", machineCode: "00011", code: "Hoangmy", name: "Hoàng Mỹ", branch: "CS1", hourlyWage: 22000,
        startDate: "2026-07-13", tenureMonths: 3.0, birthDate: "2007-07-20",
        phone: "0768 575 207", zalo: "0768 575 207",
        bankName: "MB", bankAccount: "0768 575207", accountHolder: "Lê Hoàng Mỹ",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "09/2026",
        status: "active", note: "", cooptedBy: "Quỳnh Nga", salaryHistory: ["2026-09-01", "2026-10-01"]
    },
    {
        id: "NV-012", machineCode: "00012", code: "Anhhong", name: "Ánh Hồng", branch: "CS1", hourlyWage: 22000,
        startDate: "2026-07-20", tenureMonths: 2.8, birthDate: "2007-04-07",
        phone: "0705 112 152", zalo: "0705 112 152",
        bankName: "TP BANK", bankAccount: "1000 167 6335", accountHolder: "Đặng Thị Ánh Hồng",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "09/2026",
        status: "active", note: "", cooptedBy: "Quỳnh Nga", salaryHistory: ["2026-09-01", "2026-10-01"]
    },
    {
        id: "NV-013", machineCode: "00013", code: "Bachduy", name: "Bách Duy", branch: "CS1", hourlyWage: 20000,
        startDate: "2026-04-21", tenureMonths: 5.8, birthDate: "2007-09-28",
        phone: "0898 487 807", zalo: "0898 487 807",
        bankName: "MB", bankAccount: "0002 809 07", accountHolder: "Nguyễn Hoàng Bách Duy",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "08/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-10-01"]
    },
    {
        id: "NV-014", machineCode: "00014", code: "Ngoctai", name: "Ngọc Tài", branch: "CS1", hourlyWage: 19000,
        startDate: "2026-08-21", tenureMonths: 1.7, birthDate: "2007-08-14",
        phone: "0335575 521", zalo: "0363 840 213",
        bankName: "VCB DIGIBANK", bankAccount: "9363 840 213", accountHolder: "Cái Ngọc Tài",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "08/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-015", machineCode: "00015", code: "PhanLe", name: "Phan Lê", branch: "CS1", hourlyWage: 21000,
        startDate: "2025-02-23", tenureMonths: 11.5, birthDate: "2004-02-21",
        phone: "0326 230 730", zalo: "0326 230 730",
        bankName: "MB", bankAccount: "0326 230 730", accountHolder: "Phan Thị Lê",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "03/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-08-01", "2026-09-01"]
    },
    {
        id: "NV-016", machineCode: "00016", code: "Baongan2", name: "Cao Bảo Ngân", branch: "CS1", hourlyWage: 19000,
        startDate: "2026-08-30", tenureMonths: 1.1, birthDate: "2007-04-07",
        phone: "0971 354 028", zalo: "0971 354 028",
        bankName: "MB", bankAccount: "0971 354 028", accountHolder: "Cao Bảo Ngân",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-017", machineCode: "00017", code: "NgocQuyen", name: "Ngọc Quyên", branch: "CS1", hourlyWage: 20000,
        startDate: "2026-04-05", tenureMonths: 5.1, birthDate: "1899-12-31",
        phone: "0799 494 403", zalo: "0799 494 403",
        bankName: "BIDV", bankAccount: "5610 482 874", accountHolder: "Phạm Thị Thu Nguyệt",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "06/2026",
        status: "active", note: "Đã hoàn cọc cuối tháng 9", cooptedBy: "", salaryHistory: ["2026-05-01"]
    },
    {
        id: "NV-018", machineCode: "00036", code: "Lesang", name: "Lê Sang", branch: "CS1", hourlyWage: 20000,
        startDate: "2025-12-27", tenureMonths: 8.3, birthDate: "2004-06-20",
        phone: "0373 748 214", zalo: "0373 748 214",
        bankName: "VIETCOMBANK", bankAccount: "1030 148 042", accountHolder: "Lê Thị Sang",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "12/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-05-01"]
    },

    // CS2 (13 NV)
    {
        id: "NV-019", machineCode: "00017", code: "Mymy", name: "Mỹ Mỹ", branch: "CS2", hourlyWage: 24000,
        startDate: "2024-01-28", tenureMonths: 32.9, birthDate: "2004-01-15",
        phone: "0339 369 621", zalo: "0339 369 621",
        bankName: "MB", bankAccount: "0339 369 621", accountHolder: "Trần Thị Mỹ",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "05/2024",
        status: "active", note: "", cooptedBy: "Trâm CS1", salaryHistory: ["2024-11-01", "2025-03-01", "2025-06-01", "2025-09-03"]
    },
    {
        id: "NV-020", machineCode: "00042", code: "Ylinh", name: "Ý Linh", branch: "CS2", hourlyWage: 23000,
        startDate: "2024-02-16", tenureMonths: 24.8, birthDate: "2008-04-22",
        phone: "0707 763 348", zalo: "0707 763 348",
        bankName: "MB", bankAccount: "0707 763 348", accountHolder: "Nguyễn Thị Ý Linh",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "06/2026",
        status: "active", note: "Ôn thi đại học", cooptedBy: "", salaryHistory: ["2025-06-01", "2026-06-01", "2026-09-01"]
    },
    {
        id: "NV-021", machineCode: "00021", code: "HuynhLien", name: "Huỳnh Liên", branch: "CS2", hourlyWage: 22000,
        startDate: "2025-05-17", tenureMonths: 17.1, birthDate: "2005-04-27",
        phone: "0795 773 800", zalo: "0795 773 800",
        bankName: "TIEN PHONG", bankAccount: "0795 773 800", accountHolder: "Huỳnh Ngô Thị Liên",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "05/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-11-01", "2026-03-01", "2026-05-01", "2026-10-01"]
    },
    {
        id: "NV-022", machineCode: "00032", code: "MyThanh", name: "Mỹ Thanh", branch: "CS2", hourlyWage: 23000,
        startDate: "2024-08-24", tenureMonths: 25.9, birthDate: "2005-04-18",
        phone: "0702 590 957", zalo: "0702 590 957",
        bankName: "MB", bankAccount: "0702 590 957", accountHolder: "Đoàn Nguyễn Mỹ Thanh",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "08/2024",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2024-12-01", "2025-07-01", "2026-05-01", "2026-10-01"]
    },
    {
        id: "NV-023", machineCode: "00023", code: "QuynhNga", name: "Quỳnh Nga", branch: "CS2", hourlyWage: 21000,
        startDate: "2026-05-04", tenureMonths: 5.3, birthDate: "2007-02-24",
        phone: "0763 538 726", zalo: "0763 538 726",
        bankName: "MB", bankAccount: "0763 538 726", accountHolder: "Nguyễn Thị Quỳnh Nga",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "05/2026",
        status: "active", note: "", cooptedBy: "Bách Duy", salaryHistory: ["2026-10-01"]
    },
    {
        id: "NV-024", machineCode: "00034", code: "Thuylinh", name: "Thùy Linh", branch: "CS2", hourlyWage: 22000,
        startDate: "2024-10-02", tenureMonths: 24.6, birthDate: "2005-02-10",
        phone: "0905 759 931", zalo: "0905 759 931",
        bankName: "BIDV", bankAccount: "8830 4148 03", accountHolder: "Đỗ Đoàn Thùy Linh",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "10/2024",
        status: "active", note: "Áo đp TL lấy có 1 ít vết bẩn", cooptedBy: "", salaryHistory: ["2025-04-01", "2026-03-01", "2026-05-01"]
    },
    {
        id: "NV-025", machineCode: "00103", code: "Tran", name: "Quế Trân", branch: "CS2", hourlyWage: 20000,
        startDate: "2025-09-22", tenureMonths: 12.8, birthDate: "2004-01-20",
        phone: "0932 256 497", zalo: "0932 256 497",
        bankName: "VIETCOMBANK", bankAccount: "1029 961 185", accountHolder: "Phan Nguyễn Quế Trân",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "11/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-02-01", "2026-03-01"]
    },
    {
        id: "NV-026", machineCode: "00200", code: "Thuy", name: "Thanh Thuỷ", branch: "CS2", hourlyWage: 21000,
        startDate: "2025-09-18", tenureMonths: 12.9, birthDate: "2005-09-18",
        phone: "0362 418 602", zalo: "0362 418 602",
        bankName: "MB", bankAccount: "1809 200 5007", accountHolder: "Nguyễn Thị Thanh Thuỷ",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "11/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-02-01", "2026-03-01", "2026-05-01"]
    },
    {
        id: "NV-027", machineCode: "00037", code: "Loanchaupc", name: "Loan Châu", branch: "CS2", hourlyWage: 20000,
        startDate: "2026-07-25", tenureMonths: 2.6, birthDate: "2008-04-06",
        phone: "0708 123 406", zalo: "0708 123 406",
        bankName: "MB", bankAccount: "0708 123 406", accountHolder: "Nguyễn Huỳnh Loan Châu",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "08/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-028", machineCode: "00041", code: "Quynhhuong", name: "Quỳnh Hương", branch: "CS2", hourlyWage: 19000,
        startDate: "2026-07-29", tenureMonths: 2.5, birthDate: "2008-12-12",
        phone: "0865 932 467", zalo: "0794 508 717",
        bankName: "TECHCOMBANK", bankAccount: "1905 024 830 1013", accountHolder: "Phùng Thị Quỳnh Chi",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "08/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-029", machineCode: "00029", code: "Thanhxuan", name: "Thanh Xuân", branch: "CS2", hourlyWage: 19000,
        startDate: "2026-09-08", tenureMonths: 1.1, birthDate: "2007-07-14",
        phone: "0346 867 815", zalo: "0346 867 815",
        bankName: "MB", bankAccount: "0346 867 815", accountHolder: "Phạm Thanh Xuân",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "10/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-030", machineCode: "00030", code: "Thienthanh", name: "Thiện Thành", branch: "CS2", hourlyWage: 19000,
        startDate: "2026-09-10", tenureMonths: 0.8, birthDate: "2007-12-26",
        phone: "0934 939 465", zalo: "0934 939 465",
        bankName: "VIETCOMBANK", bankAccount: "9934 939 465", accountHolder: "Lưu Thiện Thành",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-031", machineCode: "00023", code: "Minhthu", name: "Minh Thư", branch: "CS2", hourlyWage: 19000,
        startDate: "2026-06-21", tenureMonths: 2.4, birthDate: "2007-10-11",
        phone: "0935 210 949", zalo: "0787 523 954",
        bankName: "MB", bankAccount: "0935 210 949", accountHolder: "Trần Thị Minh Thư",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "07/2026",
        status: "active", note: "Đã hoàn cọc cuối tháng 9", cooptedBy: "", salaryHistory: []
    },

    // CS3 (11 NV)
    {
        id: "NV-032", machineCode: "00010", code: "Diemphuc", name: "Diễm Phúc", branch: "CS3", hourlyWage: 26000,
        startDate: "2024-02-17", tenureMonths: 32.2, birthDate: "2002-04-26",
        phone: "0904 513 289", zalo: "0904 513 289",
        bankName: "VIETCOMBANK", bankAccount: "1071 701 195", accountHolder: "Nguyễn Thị Diễm Phúc",
        idCard: "048 3 02 004 309", address: "Thôn Phú Sơn Nam, Hòa Khương, Hòa Vang, Đà Nẵng",
        uniformCount: 2, uniformDepositMonth: "05/2024",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-03-01", "2025-08-01", "2026-01-01", "2026-05-01"]
    },
    {
        id: "NV-033", machineCode: "00033", code: "DiemQuynh", name: "Diễm Quỳnh", branch: "CS3", hourlyWage: 23000,
        startDate: "2024-09-01", tenureMonths: 25.7, birthDate: "2006-10-14",
        phone: "0395 128 794", zalo: "0395 128 794",
        bankName: "MB", bankAccount: "0382 731 524", accountHolder: "Nguyễn Thị Diễm Quỳnh",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "09/2024",
        status: "active", note: "Trừ 1 tháng quân sự + off tết", cooptedBy: "", salaryHistory: ["2025-03-01", "2025-05-05", "2025-09-03", "2026-05-01"]
    },
    {
        id: "NV-034", machineCode: "00034", code: "ThaoNguyen", name: "Thảo Nguyên", branch: "CS3", hourlyWage: 23000,
        startDate: "2025-03-04", tenureMonths: 19.5, birthDate: "2006-02-09",
        phone: "0777 506 021", zalo: "0777 506 021",
        bankName: "MB", bankAccount: "0777 506 021", accountHolder: "Huỳnh Thị Thảo Nguyên",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "03/2025",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-09-03", "2026-01-01", "2026-05-01"]
    },
    {
        id: "NV-035", machineCode: "00035", code: "Quockhanh", name: "Quốc Khánh", branch: "CS3", hourlyWage: 20000,
        startDate: "2026-03-09", tenureMonths: 7.2, birthDate: "2000-03-06",
        phone: "0773 286 815", zalo: "0773 286 815",
        bankName: "SACOMBANK", bankAccount: "04 0773 286 815", accountHolder: "Võ Quốc Khánh",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "04/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-05-01"]
    },
    {
        id: "NV-036", machineCode: "00036", code: "Trongnghia", name: "Trọng Nghĩa", branch: "CS3", hourlyWage: 20000,
        startDate: "2026-05-04", tenureMonths: 5.3, birthDate: "2011-06-01",
        phone: "0706 683 202", zalo: "0935 019 383",
        bankName: "TECHCOMBANK", bankAccount: "1902 760 039 1026", accountHolder: "Đoàn Thị Yến Vi",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "07/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2026-10-01"]
    },
    {
        id: "NV-037", machineCode: "00037", code: "ToUyen", name: "Tố Uyên", branch: "CS3", hourlyWage: 22000,
        startDate: "2024-07-22", tenureMonths: 22.6, birthDate: "2006-08-22",
        phone: "0919 365 400", zalo: "0919 365 400",
        bankName: "VIETCOMBANK", bankAccount: "1919 365 400", accountHolder: "Phạm Tố Uyên",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "07/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: ["2025-02-03", "2025-05-05", "2025-10-01"]
    },
    {
        id: "NV-038", machineCode: "00038", code: "Tuankhang", name: "Tuấn Khang", branch: "CS3", hourlyWage: 19000,
        startDate: "2026-06-26", tenureMonths: 3.6, birthDate: "2011-11-10",
        phone: "0333 442 267", zalo: "0333 442 267",
        bankName: "VIETCOMBANK", bankAccount: "13 777 00 368", accountHolder: "Trương Thị Thương",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "07/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-039", machineCode: "00039", code: "Tandung", name: "Tấn Dũng", branch: "CS3", hourlyWage: 19000,
        startDate: "2026-07-14", tenureMonths: 3.0, birthDate: "2011-05-04",
        phone: "0704 058 761", zalo: "0704 587 761",
        bankName: "VCB DIGIBANK", bankAccount: "990 510 2654", accountHolder: "Lê Thị Nữ Lưu",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "07/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-040", machineCode: "00040", code: "Nhattien", name: "Nhật Tiên", branch: "CS3", hourlyWage: 19000,
        startDate: "2026-07-18", tenureMonths: 2.8, birthDate: "2008-01-02",
        phone: "0975 746 516", zalo: "0975 746 516",
        bankName: "MB", bankAccount: "0975 746 516", accountHolder: "Nguyễn Lưu Nhật Tiên",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "08/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-041", machineCode: "00041", code: "Phuongtrinh", name: "Phương Trinh", branch: "CS3", hourlyWage: 19000,
        startDate: "2026-08-30", tenureMonths: 1.4, birthDate: "2008-08-05",
        phone: "0799 336 133", zalo: "0799 336 133",
        bankName: "MB", bankAccount: "0799 336 133", accountHolder: "Đoàn Phương Trinh",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "09/2026",
        status: "active", note: "", cooptedBy: "", salaryHistory: []
    },
    {
        id: "NV-042", machineCode: "00042", code: "Diemthuy", name: "Diễm Thuý", branch: "CS3", hourlyWage: 20000,
        startDate: "2025-12-22", tenureMonths: 9.5, birthDate: "2006-12-31",
        phone: "0397 102 269", zalo: "0812 529 983",
        bankName: "MOMO", bankAccount: "0812 529 983", accountHolder: "Trương Nguyễn Diễm Thuý",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "12/2025",
        status: "active", note: "", cooptedBy: "Tố Uyên", salaryHistory: ["2026-05-01"]
    },
    {
        id: "NV-043", machineCode: "00043", code: "Phuocghi", name: "Phước Ghi", branch: "CS3", hourlyWage: 19000,
        startDate: "2026-05-27", tenureMonths: 3.3, birthDate: "2011-03-30",
        phone: "0794 824 461", zalo: "",
        bankName: "VIETCOMBANK", bankAccount: "1015 890 391", accountHolder: "Huỳnh Thị Bông",
        idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "06/2025",
        status: "active", note: "Đã hoàn cọc cuối tháng 9", cooptedBy: "", salaryHistory: []
    }
];

// Danh sách một số nhân viên tiêu biểu đã nghỉ việc (từ 121 nhân viên đã nghỉ trong file)
const DEFAULT_RETIRED_EMPLOYEES = [
    { code: "TraAn", name: "Trà Ân", branch: "CS1", hourlyWage: 18000, startDate: "2023-11-11", endDate: "2023-12-09", tenureMonths: 0.9, reason: "Virée - 3 fautes : đi muộn, chơi đt, làm không đúng trách nhiệm", bankName: "NAM A BANK", bankAccount: "4101 3611 8000 001", accountHolder: "Trần Thị Thủy", phone: "0358 143 759" },
    { code: "Quochung", name: "Hoàng Quốc Hùng", branch: "CS1", hourlyWage: 19000, startDate: "2023-07-10", endDate: "2023-12-24", tenureMonths: 5.6, reason: "Xin nghỉ đi học quân sự", bankName: "VIETCOMBANK", bankAccount: "1042 281 901", accountHolder: "Hoàng Quốc Hùng", phone: "0382 350 311" },
    { code: "Hoaiphuong", name: "Hoài Phương", branch: "CS1", hourlyWage: 18000, startDate: "2023-11-22", endDate: "2023-12-16", tenureMonths: 0.8, reason: "Xin nghỉ luôn sau khi học quân sự", bankName: "MB", bankAccount: "0704 721 370", accountHolder: "Hồ Nguyễn Hoài Phương", phone: "0704 721 370" },
    { code: "ThanhThuycs1out", name: "Huỳnh Thanh Thúy", branch: "CS1", hourlyWage: 21000, startDate: "2023-09-16", endDate: "2024-10-20", tenureMonths: 13.8, reason: "Tự xin nghỉ vì đi học", bankName: "MB", bankAccount: "0932 421 320", accountHolder: "Huỳnh Thanh Thúy", phone: "0932 421 320" },
    { code: "Phidong", name: "Phi Đông", branch: "CS1", hourlyWage: 20000, startDate: "2023-12-09", endDate: "2025-11-30", tenureMonths: 23.8, reason: "Nghỉ việc", bankName: "MB", bankAccount: "0917 238 987", accountHolder: "Nguyễn Phi Đông", phone: "0917 238 987" },
    { code: "VanThien", name: "Văn Thiện", branch: "CS1", hourlyWage: 19000, startDate: "2023-12-23", endDate: "2025-01-18", tenureMonths: 13.1, reason: "Nghỉ việc", bankName: "TECHCOMBANK", bankAccount: "1907 348 098 0016", accountHolder: "Võ Văn Thiện", phone: "0966 283 046" },
    { code: "MyDuyenTran", name: "Mỹ Duyên Trần", branch: "CS2", hourlyWage: 22000, startDate: "2025-01-10", endDate: "2026-08-02", tenureMonths: 19.0, reason: "Không hoàn cọc vì gian lận", bankName: "MB", bankAccount: "0905 302 555", accountHolder: "Trần Thị Mỹ Duyên", phone: "0905 302 555" },
    { code: "ThuTuyen", name: "Thu Tuyền", branch: "CS2", hourlyWage: 21000, startDate: "2025-07-10", endDate: "2026-08-02", tenureMonths: 12.9, reason: "Không hoàn cọc vì gian lận", bankName: "TECHCOMBANK", bankAccount: "1042 3135 9790 11", accountHolder: "Nguyễn Thị Huyền Trang", phone: "0787 608 434" },
    { code: "HongNgoc", name: "Hồng Ngọc", branch: "CS2", hourlyWage: 21000, startDate: "2025-12-05", endDate: "2026-08-02", tenureMonths: 8.0, reason: "Không hoàn cọc vì gian lận", bankName: "MB", bankAccount: "0373 676 414", accountHolder: "Nguyễn Hồng Ngọc", phone: "0373 676 414" },
    { code: "Phuonglinh", name: "Phương Linh", branch: "CS2", hourlyWage: 22000, startDate: "2024-05-18", endDate: "2026-07-31", tenureMonths: 26.9, reason: "Nghỉ việc", bankName: "MB", bankAccount: "1908 2005 36 36", accountHolder: "Lê Thị Linh", phone: "0912 897 130" },
    { code: "Phuocghi_old", name: "Phước Ghi", branch: "CS3", hourlyWage: 19000, startDate: "2026-05-27", endDate: "2026-09-02", tenureMonths: 3.3, reason: "Đã hoàn cọc 300k và 1 ngày công", bankName: "VIETCOMBANK", bankAccount: "1015 890 391", accountHolder: "Huỳnh Thị Bông", phone: "0794 824 461" },
    { code: "Minhthu_old", name: "Minh Thư", branch: "CS2", hourlyWage: 19000, startDate: "2026-06-21", endDate: "2026-09-02", tenureMonths: 2.4, reason: "Đã hoàn cọc 300k và 1 ngày công", bankName: "MB", bankAccount: "0935 210 949", accountHolder: "Trần Thị Minh Thư", phone: "0935 210 949" }
];

// Dữ liệu ứng lương Tháng 09/2026
const DEFAULT_ADVANCES_SEP2026 = [
    { id: "ADV-01", branch: "CS3", staffCode: "DiemQuynh", staffName: "Diễm Quỳnh", amount: 500000, date: "2026-09-17", note: "Ứng lương đợt 1" },
    { id: "ADV-02", branch: "CS2", staffCode: "Tran", staffName: "Quế Trân", amount: 700000, date: "2026-09-22", note: "Ứng chi phí cá nhân" },
    { id: "ADV-03", branch: "CS1", staffCode: "Thanhphuong", staffName: "Thành Phương", amount: 500000, date: "2026-09-24", note: "Ứng lương giữa tháng" },
    { id: "ADV-04", branch: "CS1", staffCode: "MyTam", staffName: "Mỹ Tâm", amount: 500000, date: "2026-09-24", note: "Ứng lương giữa tháng" },
    { id: "ADV-05", branch: "CS3", staffCode: "DiemQuynh", staffName: "Diễm Quỳnh", amount: 500000, date: "2026-09-28", note: "Ứng lương đợt 2" }
];

// Dữ liệu kỷ luật & phạt vi phạm Tháng 09/2026
const DEFAULT_PENALTIES_SEP2026 = [
    { id: "PEN-01", branch: "CS2", staffCode: "Thuy", staffName: "Thanh Thuỷ", amount: 30000, date: "2026-09-10", reason: "Chơi đt nhiều lần trong giờ làm việc" },
    { id: "PEN-02", branch: "CS2", staffCode: "Thienthanh", staffName: "Thiện Thành", amount: 100000, date: "2026-09-15", reason: "Bỏ ca 2 lần" },
    { id: "PEN-03", branch: "CS3", staffCode: "Nhattien", staffName: "Nhật Tiên", amount: 50000, date: "2026-09-18", reason: "Bỏ ca" },
    { id: "PEN-04", branch: "CS3", staffCode: "Tuankhang", staffName: "Tuấn Khang", amount: 100000, date: "2026-09-22", reason: "Bỏ ca cuối tuần" }
];

// Dữ liệu cọc áo đồng phục & BHXH Tháng 09/2026
const DEFAULT_DEPOSITS_SEP2026 = [
    { id: "DEP-01", branch: "CS1", staffCode: "NgocQuyen", staffName: "Ngọc Quyên", amount: 300000, type: "refund", date: "2026-10-01", note: "Hoàn cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-02", branch: "CS3", staffCode: "Phuocghi", staffName: "Phước Ghi", amount: 300000, type: "refund", date: "2026-10-01", note: "Hoàn cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-03", branch: "CS2", staffCode: "Minhthu", staffName: "Minh Thư", amount: 300000, type: "refund", date: "2026-10-01", note: "Hoàn cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-04", branch: "CS1", staffCode: "Hoangmy", staffName: "Hoàng Mỹ", amount: -300000, type: "deposit", date: "2026-10-01", note: "Cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-05", branch: "CS1", staffCode: "Anhhong", staffName: "Ánh Hồng", amount: -300000, type: "deposit", date: "2026-10-01", note: "Cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-06", branch: "CS3", staffCode: "Phuongtrinh", staffName: "Phương Trinh", amount: -300000, type: "deposit", date: "2026-10-01", note: "Cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-07", branch: "CS1", staffCode: "Phuongthao", staffName: "Phương Thảo", amount: -300000, type: "deposit", date: "2026-10-01", note: "Cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-08", branch: "CS1", staffCode: "Ngochuyen", staffName: "Ngọc Huyền", amount: -300000, type: "deposit", date: "2026-10-01", note: "Cọc 2 áo đồng phục và 1 ngày công" },
    { id: "DEP-09", branch: "CS3", staffCode: "Diemphuc", staffName: "Diễm Phúc", amount: -525000, type: "bhxh", date: "2026-09-03", note: "Nộp tiền bảo hiểm xã hội" }
];

// Dữ liệu Thưởng và Phụ phí chi tiết Tháng 09/2026 (trích từ bảng Thưởng và Phụ Phí CocoMeo)
const DEFAULT_BONUSES_SEP2026 = [
    // Phụ phí xăng xe
    { id: "BON-01", branch: "CS1", staffCode: "Noa", staffName: "Noa", category: "gasoline", amount: 150000, note: "Phụ phí xăng di chuyển" },
    { id: "BON-02", branch: "CS3", staffCode: "Diemphuc", staffName: "Diễm Phúc", category: "gasoline", amount: 150000, note: "Phụ phí xăng di chuyển" },

    // Phục vụ khách đoàn / tiệc sinh nhật
    { id: "BON-03", branch: "CS1", staffCode: "Noa", staffName: "Noa", category: "tourist_group", amount: 30000, note: "Thưởng khách đoàn ngày 23/09" },
    { id: "BON-04", branch: "CS2", staffCode: "Ylinh", staffName: "Ý Linh", category: "tourist_group", amount: 30000, note: "Thưởng khách đoàn ngày 23/09" },
    { id: "BON-05", branch: "CS1", staffCode: "KimTuyen", staffName: "Kim Tuyên", category: "tourist_group", amount: 30000, note: "Thưởng khách đoàn ngày 23/09" },
    { id: "BON-06", branch: "CS1", staffCode: "MyTam", staffName: "Mỹ Tâm", category: "tourist_group", amount: 30000, note: "Thưởng khách đoàn ngày 23/09" },
    { id: "BON-07", branch: "CS2", staffCode: "HuynhLien", staffName: "Huỳnh Liên", category: "tourist_group", amount: 25000, note: "Thưởng khách đoàn ngày 25/09" },
    { id: "BON-08", branch: "CS2", staffCode: "Ylinh", staffName: "Ý Linh", category: "tourist_group", amount: 25000, note: "Thưởng khách đoàn ngày 25/09" },
    { id: "BON-09", branch: "CS2", staffCode: "MyThanh", staffName: "Mỹ Thanh", category: "tourist_group", amount: 25000, note: "Thưởng khách đoàn ngày 25/09" },

    // Thưởng sinh nhật nội bộ (tham gia tiệc / hỗ trợ)
    { id: "BON-10", branch: "CS3", staffCode: "ThaoNguyen", staffName: "Thảo Nguyên", category: "other", amount: 30000, note: "Thưởng SN ngày 06/09" },
    { id: "BON-11", branch: "CS3", staffCode: "Diemphuc", staffName: "Diễm Phúc", category: "other", amount: 25000, note: "Thưởng SN ngày 06/09" },
    { id: "BON-12", branch: "CS3", staffCode: "DiemQuynh", staffName: "Diễm Quỳnh", category: "other", amount: 25000, note: "Thưởng SN ngày 06/09" },
    { id: "BON-13", branch: "CS2", staffCode: "Ylinh", staffName: "Ý Linh", category: "other", amount: 25000, note: "Thưởng SN ngày 06/09" },
    { id: "BON-14", branch: "CS2", staffCode: "Thuy", staffName: "Thanh Thuỷ", category: "other", amount: 25000, note: "Thưởng SN ngày 06/09" },
    { id: "BON-15", branch: "CS1", staffCode: "Ngochuyen", staffName: "Ngọc Huyền", category: "other", amount: 15000, note: "Thưởng SN ngày 06/09" },
    { id: "BON-16", branch: "CS1", staffCode: "Thuytrangpc", staffName: "Thuỳ Trang", category: "other", amount: 30000, note: "Thưởng SN ngày 07/09" },
    { id: "BON-17", branch: "CS3", staffCode: "DiemQuynh", staffName: "Diễm Quỳnh", category: "other", amount: 30000, note: "Thưởng SN ngày 07/09" },
    { id: "BON-18", branch: "CS1", staffCode: "Haiau", staffName: "Hải Âu", category: "other", amount: 30000, note: "Thưởng SN ngày 07/09" },
    { id: "BON-19", branch: "CS1", staffCode: "Baongan2", staffName: "Cao Bảo Ngân", category: "other", amount: 20000, note: "Thưởng SN ngày 07/09" },
    { id: "BON-20", branch: "CS3", staffCode: "Diemphuc", staffName: "Diễm Phúc", category: "other", amount: 25000, note: "Thưởng SN ngày 11/09" },
    { id: "BON-21", branch: "CS3", staffCode: "ToUyen", staffName: "Tố Uyên", category: "other", amount: 25000, note: "Thưởng SN ngày 11/09" },
    { id: "BON-22", branch: "CS3", staffCode: "ThaoNguyen", staffName: "Thảo Nguyên", category: "other", amount: 25000, note: "Thưởng SN ngày 11/09" },
    { id: "BON-23", branch: "CS2", staffCode: "Ylinh", staffName: "Ý Linh", category: "other", amount: 25000, note: "Thưởng SN ngày 11/09" },
    { id: "BON-24", branch: "CS1", staffCode: "Thanhphuong", staffName: "Thành Phương", category: "other", amount: 25000, note: "Thưởng SN ngày 11/09" },
    { id: "BON-25", branch: "CS1", staffCode: "Thuytrangpc", staffName: "Thuỳ Trang", category: "other", amount: 25000, note: "Thưởng SN ngày 11/09" },
    { id: "BON-26", branch: "CS1", staffCode: "Ngochuyen", staffName: "Ngọc Huyền", category: "other", amount: 15000, note: "Hỗ trợ ngày 23/09" },
    { id: "BON-27", branch: "CS1", staffCode: "Phuongthao", staffName: "Phương Thảo", category: "other", amount: 15000, note: "Hỗ trợ ngày 23/09" },
    { id: "BON-28", branch: "CS2", staffCode: "Ylinh", staffName: "Ý Linh", category: "other", amount: 20000, note: "Hỗ trợ ngày 07/09" },
    { id: "BON-29", branch: "CS1", staffCode: "MyTam", staffName: "Mỹ Tâm", category: "other", amount: 20000, note: "Hỗ trợ ngày 07/09" },

    // Dọn vệ sinh CS2
    { id: "BON-30", branch: "CS2", staffCode: "Mymy", staffName: "Mỹ Mỹ", category: "other", amount: 50000, note: "Dọn vệ sinh CS2" },
    { id: "BON-31", branch: "CS2", staffCode: "Tran", staffName: "Quế Trân", category: "other", amount: 30000, note: "Dọn vệ sinh CS2" },
    { id: "BON-32", branch: "CS2", staffCode: "Thuylinh", staffName: "Thùy Linh", category: "other", amount: 30000, note: "Dọn vệ sinh CS2" },
    { id: "BON-33", branch: "CS2", staffCode: "Thuy", staffName: "Thanh Thuỷ", category: "other", amount: 30000, note: "Dọn vệ sinh CS2" },
    { id: "BON-34", branch: "CS2", staffCode: "MyThanh", staffName: "Mỹ Thanh", category: "other", amount: 30000, note: "Dọn vệ sinh CS2" },

    // Thưởng giới thiệu nhân viên mới (Cooptation: 100,000 đ/người)
    { id: "BON-35", branch: "CS1", staffCode: "Bachduy", staffName: "Bách Duy", category: "cooptation", amount: 100000, note: "Giới thiệu nhân viên Quỳnh Nga" },
    { id: "BON-36", branch: "CS2", staffCode: "HuynhLien", staffName: "Huỳnh Liên", category: "cooptation", amount: 100000, note: "Giới thiệu nhân viên Kim Tuyên" },
    { id: "BON-37", branch: "CS1", staffCode: "KimTuyen", staffName: "Kim Tuyên", category: "cooptation", amount: 100000, note: "Giới thiệu nhân viên Hải Âu" },
    { id: "BON-38", branch: "CS2", staffCode: "QuynhNga", staffName: "Quỳnh Nga", category: "cooptation", amount: 100000, note: "Giới thiệu nhân viên Hoàng Mỹ" },
    { id: "BON-39", branch: "CS2", staffCode: "QuynhNga", staffName: "Quỳnh Nga", category: "cooptation", amount: 100000, note: "Giới thiệu nhân viên Ánh Hồng" },
    { id: "BON-40", branch: "CS3", staffCode: "ToUyen", staffName: "Tố Uyên", category: "cooptation", amount: 100000, note: "Giới thiệu nhân viên Diễm Thuý" },

    // Tặng quà sinh nhật cho NV làm > 6 tháng (100,000 đ)
    { id: "BON-41", branch: "CS1", staffCode: "MyTam", staffName: "Mỹ Tâm", category: "birthday_loyalty", amount: 100000, note: "Tặng sinh nhật cho NV làm > 6T (Sinh 10/09, thâm niên 22.3T)" },
    { id: "BON-42", branch: "CS2", staffCode: "Thuy", staffName: "Thanh Thuỷ", category: "birthday_loyalty", amount: 100000, note: "Tặng sinh nhật cho NV làm > 6T (Sinh 18/09, thâm niên 12.6T)" }
];

// Bảng Lương Chuẩn Đã Chốt Tháng 09/2026 từ File 1 để kiểm tra đối soát
const DEFAULT_PAYROLL_MASTER_SEP2026 = [
    // CS1
    { branch: "CS1", name: "Ánh Hồng", code: "Anhhong", hours: 106.416667, wage: 22000, baseSalary: 2341167, advance: 0, penalty: 0, balance: 2341167, deposit: -300000, bonus: 20000, total: 2062000, bankName: "TP BANK", bankAccount: "1000 167 6335", accountHolder: "Đặng Thị Ánh Hồng", isTransferred: true },
    { branch: "CS1", name: "Bách Duy", code: "Bachduy", hours: 85.133333, wage: 20000, baseSalary: 1702667, advance: 0, penalty: 0, balance: 1702667, deposit: 0, bonus: 100000, total: 1803000, bankName: "MB", bankAccount: "0002 809 07", accountHolder: "Nguyễn Hoàng Bách Duy", isTransferred: true },
    { branch: "CS1", name: "Hải Âu", code: "Haiau", hours: 73.5, wage: 20000, baseSalary: 1470000, advance: 0, penalty: 0, balance: 1470000, deposit: 0, bonus: 30000, total: 1500000, bankName: "MB", bankAccount: "0396 061 370", accountHolder: "Nguyễn Thị Hải Âu", isTransferred: true },
    { branch: "CS1", name: "Hoàng Mỹ", code: "Hoangmy", hours: 61.916667, wage: 22000, baseSalary: 1362167, advance: 0, penalty: 0, balance: 1362167, deposit: -300000, bonus: 0, total: 1063000, bankName: "MB", bankAccount: "0768 575207", accountHolder: "Lê Hoàng Mỹ", isTransferred: true },
    { branch: "CS1", name: "Kim Tuyên", code: "KimTuyen", hours: 123.916667, wage: 21000, baseSalary: 2602250, advance: 0, penalty: 0, balance: 2602250, deposit: 0, bonus: 160000, total: 2763000, bankName: "VIETIN BANK", bankAccount: "101 881 455 293", accountHolder: "Hồ Thanh Kim Tuyên", isTransferred: true },
    { branch: "CS1", name: "Mỹ Tâm", code: "MyTam", hours: 80.283333, wage: 22000, baseSalary: 1766233, advance: 500000, penalty: 0, balance: 1266233, deposit: 0, bonus: 150000, total: 1417000, bankName: "MB", bankAccount: "0372 522 921", accountHolder: "Trần Mỹ Tâm", isTransferred: true },
    { branch: "CS1", name: "Ngọc Huyền", code: "Ngochuyen", hours: 78.0, wage: 19000, baseSalary: 1482000, advance: 0, penalty: 0, balance: 1482000, deposit: -300000, bonus: 30000, total: 1212000, bankName: "VP BANK", bankAccount: "0857 110 508", accountHolder: "Nguyễn Ngọc Huyền", isTransferred: true },
    { branch: "CS1", name: "Ngọc Quyên", code: "NgocQuyen", hours: 27.583333, wage: 20000, baseSalary: 551667, advance: 0, penalty: 0, balance: 551667, deposit: 300000, bonus: 0, total: 852000, bankName: "BIDV", bankAccount: "5610 482 874", accountHolder: "Phạm Thị Thu Nguyệt", isTransferred: true },
    { branch: "CS1", name: "Ngọc Tài", code: "Ngoctai", hours: 74.683333, wage: 19000, baseSalary: 1418983, advance: 0, penalty: 0, balance: 1418983, deposit: 0, bonus: 0, total: 1419000, bankName: "VCB DIGIBANK", bankAccount: "9363 840 213", accountHolder: "Cái Ngọc Tài", isTransferred: true },
    { branch: "CS1", name: "Ngọc Trường", code: "Ngoctruong", hours: 46.25, wage: 23000, baseSalary: 1063750, advance: 0, penalty: 0, balance: 1063750, deposit: 0, bonus: 0, total: 1064000, bankName: "VIETINBANK", bankAccount: "0339 647 790", accountHolder: "Trần Ngọc Trường", isTransferred: true },
    { branch: "CS1", name: "Noa", code: "Noa", hours: 196.233333, wage: 27000, baseSalary: 5298300, advance: 0, penalty: 0, balance: 5298300, deposit: 0, bonus: 290000, total: 5589000, bankName: "TIEN PHONG", bankAccount: "0366 1749 301", accountHolder: "Phan Ngân Hồng Yến", isTransferred: true },
    { branch: "CS1", name: "Phan Lê", code: "PhanLe", hours: 23.783333, wage: 21000, baseSalary: 499450, advance: 0, penalty: 0, balance: 499450, deposit: 0, bonus: 0, total: 500000, bankName: "MB", bankAccount: "0326 230 730", accountHolder: "Phan Thị Lê", isTransferred: true },
    { branch: "CS1", name: "Phương Thảo", code: "Phuongthao", hours: 45.633333, wage: 19000, baseSalary: 867033, advance: 0, penalty: 0, balance: 867033, deposit: -300000, bonus: 15000, total: 583000, bankName: "MB", bankAccount: "0357 579 326", accountHolder: "Nguyễn Phương Thảo", isTransferred: true },
    { branch: "CS1", name: "Thành Phương", code: "Thanhphuong", hours: 95.616667, wage: 22000, baseSalary: 2103567, advance: 500000, penalty: 0, balance: 1603567, deposit: 0, bonus: 25000, total: 1629000, bankName: "TP BANK", bankAccount: "1000 502 99 11", accountHolder: "Nguyễn Thị Thành Phương", isTransferred: true },
    { branch: "CS1", name: "Thuỳ Trang", code: "Thuytrangpc", hours: 219.75, wage: 23000, baseSalary: 5054250, advance: 0, penalty: 0, balance: 5054250, deposit: 0, bonus: 185000, total: 5240000, bankName: "ACB", bankAccount: "173 832 71", accountHolder: "Định Thị Thuỳ Trang", isTransferred: true },
    { branch: "CS1", name: "Cao Bảo Ngân", code: "Baongan2", hours: 44.716667, wage: 19000, baseSalary: 849617, advance: 0, penalty: 0, balance: 849617, deposit: 0, bonus: 20000, total: 870000, bankName: "MB", bankAccount: "0971 354 028", accountHolder: "Cao Bảo Ngân", isTransferred: true },
    { branch: "CS1", name: "Minh Thiện", code: "Minhthien", hours: 40.066667, wage: 19000, baseSalary: 761267, advance: 0, penalty: 0, balance: 761267, deposit: 0, bonus: 0, total: 762000, bankName: "MB", bankAccount: "0378 894 110", accountHolder: "Huỳnh Minh Thiện", isTransferred: true },

    // CS2
    { branch: "CS2", name: "Huỳnh Liên", code: "HuynhLien", hours: 105.55, wage: 22000, baseSalary: 2322100, advance: 0, penalty: 0, balance: 2322100, deposit: 0, bonus: 145000, total: 2468000, bankName: "TIEN PHONG", bankAccount: "0795 773 800", accountHolder: "Huỳnh Ngô Thị Liên", isTransferred: true },
    { branch: "CS2", name: "Loan Châu", code: "Loanchaupc", hours: 9.316667, wage: 20000, baseSalary: 186333, advance: 0, penalty: 0, balance: 186333, deposit: 0, bonus: 0, total: 187000, bankName: "MB", bankAccount: "0708 123 406", accountHolder: "Nguyễn Huỳnh Loan Châu", isTransferred: true },
    { branch: "CS2", name: "Mỹ Mỹ", code: "Mymy", hours: 69.333333, wage: 24000, baseSalary: 1664000, advance: 0, penalty: 0, balance: 1664000, deposit: 0, bonus: 50000, total: 1714000, bankName: "MB", bankAccount: "0339 369 621", accountHolder: "Trần Thị Mỹ", isTransferred: true },
    { branch: "CS2", name: "Mỹ Thanh", code: "MyThanh", hours: 79.433333, wage: 23000, baseSalary: 1826967, advance: 0, penalty: 0, balance: 1826967, deposit: 0, bonus: 55000, total: 1882000, bankName: "MB", bankAccount: "0702 590 957", accountHolder: "Đoàn Nguyễn Mỹ Thanh", isTransferred: true },
    { branch: "CS2", name: "Quỳnh Hương", code: "Quynhhuong", hours: 29.4, wage: 19000, baseSalary: 558600, advance: 0, penalty: 0, balance: 558600, deposit: 0, bonus: 0, total: 559000, bankName: "TECHCOMBANK", bankAccount: "1905 024 830 1013", accountHolder: "Phùng Thị Quỳnh Chi", isTransferred: true },
    { branch: "CS2", name: "Quỳnh Nga", code: "QuynhNga", hours: 107.116667, wage: 21000, baseSalary: 2249450, advance: 0, penalty: 0, balance: 2249450, deposit: 0, bonus: 220000, total: 2470000, bankName: "MB", bankAccount: "0763 538 726", accountHolder: "Nguyễn Thị Quỳnh Nga", isTransferred: true },
    { branch: "CS2", name: "Thanh Thuỷ", code: "Thuy", hours: 88.333333, wage: 21000, baseSalary: 1855000, advance: 0, penalty: 30000, balance: 1825000, deposit: 0, bonus: 155000, total: 1980000, bankName: "MB", bankAccount: "1809 200 5007", accountHolder: "Nguyễn Thị Thanh Thuỷ", isTransferred: true },
    { branch: "CS2", name: "Thùy Linh", code: "Thuylinh", hours: 58.35, wage: 22000, baseSalary: 1283700, advance: 0, penalty: 0, balance: 1283700, deposit: 0, bonus: 30000, total: 1314000, bankName: "BIDV", bankAccount: "8830 4148 03", accountHolder: "Đỗ Đoàn Thùy Linh", isTransferred: true },
    { branch: "CS2", name: "Quế Trân", code: "Tran", hours: 68.316667, wage: 20000, baseSalary: 1366333, advance: 700000, penalty: 0, balance: 666333, deposit: 0, bonus: 30000, total: 697000, bankName: "VIETCOMBANK", bankAccount: "1029 961 185", accountHolder: "Phan Nguyễn Quế Trân", isTransferred: true },
    { branch: "CS2", name: "Ý Linh", code: "Ylinh", hours: 192.866667, wage: 23000, baseSalary: 4435933, advance: 0, penalty: 0, balance: 4435933, deposit: 0, bonus: 235000, total: 4671000, bankName: "MB", bankAccount: "0707 763 348", accountHolder: "Nguyễn Thị Ý Linh", isTransferred: true },
    { branch: "CS2", name: "Thanh Xuân", code: "Thanhxuan", hours: 41.583333, wage: 19000, baseSalary: 790083, advance: 0, penalty: 0, balance: 790083, deposit: 0, bonus: 0, total: 791000, bankName: "MB", bankAccount: "0346 867 815", accountHolder: "Phạm Thanh Xuân", isTransferred: true },
    { branch: "CS2", name: "Thiện Thành", code: "Thienthanh", hours: 25.583333, wage: 19000, baseSalary: 486083, advance: 0, penalty: 100000, balance: 386083, deposit: 0, bonus: 0, total: 387000, bankName: "VIETCOMBANK", bankAccount: "9934 939 465", accountHolder: "Lưu Thiện Thành", isTransferred: true },
    { branch: "CS2", name: "Minh Thư", code: "Minhthu", hours: 0, wage: 19000, baseSalary: 0, advance: 0, penalty: 0, balance: 0, deposit: 300000, bonus: 0, total: 300000, bankName: "MB", bankAccount: "0935 210 949", accountHolder: "Trần Thị Minh Thư", isTransferred: true },

    // CS3
    { branch: "CS3", name: "Diễm Phúc", code: "Diemphuc", hours: 135.616667, wage: 26000, baseSalary: 3526033, advance: 0, penalty: 0, balance: 3526033, deposit: -525000, bonus: 200000, total: 3202000, bankName: "VIETCOMBANK", bankAccount: "1071 701 195", accountHolder: "Nguyễn Thị Diễm Phúc", isTransferred: true },
    { branch: "CS3", name: "Diễm Quỳnh", code: "DiemQuynh", hours: 122.616667, wage: 23000, baseSalary: 2820183, advance: 1000000, penalty: 0, balance: 1820183, deposit: 0, bonus: 55000, total: 1876000, bankName: "MB", bankAccount: "0382 731 524", accountHolder: "Nguyễn Thị Diễm Quỳnh", isTransferred: true },
    { branch: "CS3", name: "Diễm Thuý", code: "Diemthuy", hours: 21.7, wage: 20000, baseSalary: 434000, advance: 0, penalty: 0, balance: 434000, deposit: 0, bonus: 0, total: 434000, bankName: "MOMO", bankAccount: "0812 529 983", accountHolder: "Trương Nguyễn Diễm Thuý", isTransferred: true },
    { branch: "CS3", name: "Phương Trinh", code: "Phuongtrinh", hours: 62.433333, wage: 19000, baseSalary: 1186233, advance: 0, penalty: 0, balance: 1186233, deposit: -300000, bonus: 0, total: 887000, bankName: "MB", bankAccount: "0799 336 133", accountHolder: "Đoàn Phương Trinh", isTransferred: true },
    { branch: "CS3", name: "Quốc Khánh", code: "Quockhanh", hours: 104.6, wage: 20000, baseSalary: 2092000, advance: 0, penalty: 0, balance: 2092000, deposit: 0, bonus: 0, total: 2092000, bankName: "SACOMBANK", bankAccount: "04 0773 286 815", accountHolder: "Võ Quốc Khánh", isTransferred: true },
    { branch: "CS3", name: "Tấn Dũng", code: "Tandung", hours: 53.55, wage: 19000, baseSalary: 1017450, advance: 0, penalty: 0, balance: 1017450, deposit: 0, bonus: 0, total: 1018000, bankName: "VCB DIGIBANK", bankAccount: "990 510 2654", accountHolder: "Lê Thị Nữ Lưu", isTransferred: true },
    { branch: "CS3", name: "Thảo Nguyên", code: "ThaoNguyen", hours: 160.883333, wage: 23000, baseSalary: 3700317, advance: 0, penalty: 0, balance: 3700317, deposit: 0, bonus: 55000, total: 3756000, bankName: "MB", bankAccount: "0777 506 021", accountHolder: "Huỳnh Thị Thảo Nguyên", isTransferred: true },
    { branch: "CS3", name: "Tố Uyên", code: "ToUyen", hours: 95.0, wage: 22000, baseSalary: 2090000, advance: 0, penalty: 0, balance: 2090000, deposit: 0, bonus: 125000, total: 2215000, bankName: "VIETCOMBANK", bankAccount: "1919 365 400", accountHolder: "Phạm Tố Uyên", isTransferred: true },
    { branch: "CS3", name: "Trọng Nghĩa", code: "Trongnghia", hours: 13.2, wage: 20000, baseSalary: 264000, advance: 0, penalty: 0, balance: 264000, deposit: 0, bonus: 0, total: 264000, bankName: "TECHCOMBANK", bankAccount: "1902 760 039 1026", accountHolder: "Đoàn Thị Yến Vi", isTransferred: true },
    { branch: "CS3", name: "Tuấn Khang", code: "Tuankhang", hours: 59.483333, wage: 19000, baseSalary: 1130183, advance: 0, penalty: 100000, balance: 1030183, deposit: 0, bonus: 0, total: 1031000, bankName: "VIETCOMBANK", bankAccount: "13 777 00 368", accountHolder: "Trương Thị Thương", isTransferred: true },
    { branch: "CS3", name: "Nhật Tiên", code: "Nhattien", hours: 55.666667, wage: 19000, baseSalary: 1057667, advance: 0, penalty: 50000, balance: 1007667, deposit: 0, bonus: 0, total: 1008000, bankName: "MB", bankAccount: "0975 746 516", accountHolder: "Nguyễn Lưu Nhật Tiên", isTransferred: true },
    { branch: "CS3", name: "Phước Ghi", code: "Phuocghi", hours: 0, wage: 19000, baseSalary: 0, advance: 0, penalty: 0, balance: 0, deposit: 300000, bonus: 0, total: 300000, bankName: "VIETCOMBANK", bankAccount: "1015 890 391", accountHolder: "Huỳnh Thị Bông", isTransferred: true }
];

// File xuất chấm công mẫu (máy chấm công) để người dùng có thể nạp thử nghiệm tính năng tự động tính lương
const SAMPLE_MACHINE_PUNCH_LOG = `Mã,Tên nhân viên,Tên bộ phận,Ngày,Thứ,1,2,3,4,5,6,7,8,9,10
00010,Diemphuc,CS3,8/3/2026,Hai,,,,,,,,,,
00010,Diemphuc,CS3,8/14/2026,Sáu,14:57,21:47,,,,,,,,
00010,Diemphuc,CS3,8/26/2026,Tư,17:49,21:15,,,,,,,,
00017,Mymy,CS2,8/4/2026,Ba,08:07,12:44,,,,,,,,
00017,Mymy,CS2,8/8/2026,Bảy,07:36,13:26,,,,,,,,
00017,Mymy,CS2,8/15/2026,Bảy,07:32,14:58,,,,,,,,
00017,Mymy,CS2,8/16/2026,CN,07:33,15:01,,,,,,,,
00017,Mymy,CS2,8/18/2026,Ba,14:59,21:50,,,,,,,,
00017,Mymy,CS2,8/19/2026,Tư,15:05,21:55,,,,,,,,
00017,Mymy,CS2,8/20/2026,Năm,17:01,21:52,,,,,,,,
00017,Mymy,CS2,8/21/2026,Sáu,14:58,21:56,,,,,,,,
00017,Mymy,CS2,8/22/2026,Bảy,07:30,12:44,,,,,,,,
00017,Mymy,CS2,8/23/2026,CN,07:35,13:30,,,,,,,,
00017,Mymy,CS2,8/25/2026,Ba,08:01,12:34,15:10,21:37,,,,,,
00017,Mymy,CS2,8/27/2026,Năm,15:06,21:38,,,,,,,,
00017,Mymy,CS2,8/29/2026,Bảy,07:32,13:03,,,,,,,,
00017,Mymy,CS2,8/30/2026,CN,08:26,11:55,,,,,,,,
00017,Mymy,CS2,9/1/2026,Ba,07:44,22:07,,,,,,,,
00017,Mymy,CS2,9/2/2026,Tư,16:13,22:06,,,,,,,,
00021,TramAnh,CS2,8/8/2026,Bảy,16:56,22:34,,,,,,,,
00021,TramAnh,CS2,8/22/2026,Bảy,16:23,22:08,,,,,,,,
00021,TramAnh,CS2,8/23/2026,CN,16:57,22:11,,,,,,,,
00023,Minhthu,CS2,8/4/2026,Ba,08:07,12:44,,,,,,,,
00023,Minhthu,CS2,8/5/2026,Tư,17:03,21:49,,,,,,,,
00023,Minhthu,CS2,8/6/2026,Năm,08:07,12:45,,,,,,,,
00023,Minhthu,CS2,8/12/2026,Tư,08:06,12:55,,,,,,,,
00023,Minhthu,CS2,8/23/2026,CN,08:03,12:48,,,,,,,,
00023,Minhthu,CS2,8/26/2026,Tư,08:06,11:55,,,,,,,,
00032,MyThanh,CS2,8/5/2026,Tư,08:12,11:54,,,,,,,,
00032,MyThanh,CS2,8/6/2026,Năm,08:10,12:43,,,,,,,,
00032,MyThanh,CS2,8/7/2026,Sáu,16:04,21:56,,,,,,,,
00032,MyThanh,CS2,8/8/2026,Bảy,07:42,14:50,,,,,,,,
00032,MyThanh,CS2,8/9/2026,CN,07:42,15:16,,,,,,,,
00032,MyThanh,CS2,8/10/2026,Hai,08:14,11:44,,,,,,,,
00032,MyThanh,CS2,8/12/2026,Tư,15:07,21:48,,,,,,,,
00032,MyThanh,CS2,8/13/2026,Năm,08:08,11:34,,,,,,,,
00032,MyThanh,CS2,8/14/2026,Sáu,15:36,21:47,,,,,,,,
00032,MyThanh,CS2,8/15/2026,Bảy,08:08,22:08,,,,,,,,
00032,MyThanh,CS2,8/16/2026,CN,08:08,12:40,,,,,,,,
00032,MyThanh,CS2,8/19/2026,Tư,08:13,12:38,,,,,,,,
00032,MyThanh,CS2,8/20/2026,Năm,08:12,12:43,,,,,,,,
00032,MyThanh,CS2,8/21/2026,Sáu,16:56,21:56,,,,,,,,
00032,MyThanh,CS2,8/23/2026,CN,08:16,15:05,,,,,,,,
00032,MyThanh,CS2,8/29/2026,Bảy,08:09,13:35,,,,,,,,
00032,MyThanh,CS2,8/30/2026,CN,07:56,13:33,,,,,,,,
00032,MyThanh,CS2,8/31/2026,Hai,07:40,15:11,,,,,,,,
00032,MyThanh,CS2,9/2/2026,Tư,07:44,15:12,,,,,,,,
00034,Thuylinh,CS2,8/7/2026,Sáu,08:14,12:37,,,,,,,,
00034,Thuylinh,CS2,8/8/2026,Bảy,08:08,12:39,,,,,,,,
00034,Thuylinh,CS2,8/9/2026,CN,07:32,15:11,,,,,,,,
00034,Thuylinh,CS2,8/15/2026,Bảy,07:41,12:35,,,,,,,,
00034,Thuylinh,CS2,8/16/2026,CN,07:37,15:10,,,,,,,,
00034,Thuylinh,CS2,8/20/2026,Năm,17:11,21:57,,,,,,,,
00034,Thuylinh,CS2,8/22/2026,Bảy,08:11,12:46,,,,,,,,
00034,Thuylinh,CS2,8/24/2026,Hai,17:14,21:54,,,,,,,,
00034,Thuylinh,CS2,8/25/2026,Ba,17:37,21:37,,,,,,,,
00034,Thuylinh,CS2,8/29/2026,Bảy,08:11,12:34,,,,,,,,
00036,Lesang,CS1,8/3/2026,Hai,09:12,14:56,17:00,21:51,,,,,,
00036,Lesang,CS1,8/4/2026,Ba,15:01,21:58,,,,,,,,
00036,Lesang,CS1,8/6/2026,Năm,17:00,21:50,,,,,,,,
00036,Lesang,CS1,8/7/2026,Sáu,15:00,21:56,,,,,,,,
00036,Lesang,CS1,8/8/2026,Bảy,13:31,22:36,,,,,,,,
00036,Lesang,CS1,8/9/2026,CN,08:07,12:43,15:58,22:14,,,,,,
00036,Lesang,CS1,8/10/2026,Hai,08:00,11:29,15:02,21:52,,,,,,
00036,Lesang,CS1,8/11/2026,Ba,08:01,12:24,15:00,21:52,,,,,,
00036,Lesang,CS1,8/12/2026,Tư,08:06,12:55,,,,,,,,
00036,Lesang,CS1,8/13/2026,Năm,08:06,21:47,,,,,,,,
00036,Lesang,CS1,8/14/2026,Sáu,16:01,21:47,,,,,,,,
00036,Lesang,CS1,8/15/2026,Bảy,14:58,22:10,,,,,,,,
00036,Lesang,CS1,8/16/2026,CN,08:06,12:44,15:01,22:10,,,,,,
00036,Lesang,CS1,8/17/2026,Hai,08:03,11:32,17:04,21:35,,,,,,
00036,Lesang,CS1,8/18/2026,Ba,08:01,12:30,16:56,21:51,,,,,,
00036,Lesang,CS1,8/20/2026,Năm,15:07,21:49,,,,,,,,
00036,Lesang,CS1,8/21/2026,Sáu,08:05,12:41,17:02,21:56,,,,,,
00036,Lesang,CS1,8/22/2026,Bảy,12:47,22:13,,,,,,,,
00036,Lesang,CS1,8/23/2026,CN,07:36,12:49,14:52,22:14,,,,,,
00036,Lesang,CS1,8/24/2026,Hai,08:01,12:03,15:03,21:56,,,,,,
00036,Lesang,CS1,8/26/2026,Tư,08:06,12:04,15:02,21:58,,,,,,
00036,Lesang,CS1,8/27/2026,Năm,08:10,11:43,,,,,,,,
00036,Lesang,CS1,8/28/2026,Sáu,15:01,22:03,,,,,,,,
00036,Lesang,CS1,8/29/2026,Bảy,13:08,15:05,16:57,22:16,,,,,,
00036,Lesang,CS1,8/30/2026,CN,08:03,12:36,14:42,23:16,,,,,,
00036,Lesang,CS1,8/31/2026,Hai,07:35,13:02,15:07,22:28,,,,,,
00036,Lesang,CS1,9/1/2026,Ba,07:35,12:26,17:05,22:10,,,,,,
00036,Lesang,CS1,9/2/2026,Tư,08:04,12:25,17:01,21:58,,,,,,
00037,Loanchaupc,CS2,8/10/2026,Hai,16:06,21:47,,,,,,,,
00037,Loanchaupc,CS2,8/11/2026,Ba,15:42,21:51,,,,,,,,
00037,Loanchaupc,CS2,8/12/2026,Tư,15:42,21:42,,,,,,,,
00037,Loanchaupc,CS2,8/22/2026,Bảy,17:04,22:00,,,,,,,,
00037,Loanchaupc,CS2,8/23/2026,CN,08:16,14:59,,,,,,,,
00037,Loanchaupc,CS2,8/29/2026,Bảy,17:21,22:04,,,,,,,,
00037,Loanchaupc,CS2,9/1/2026,Ba,08:27,12:48,,,,,,,,
00037,Loanchaupc,CS2,9/2/2026,Tư,07:34,13:00,,,,,,,,
00041,Quynhhuong,CS2,8/29/2026,Bảy,17:21,22:04,,,,,,,,
00041,Quynhhuong,CS2,9/1/2026,Ba,17:03,22:07,,,,,,,,
00041,Quynhhuong,CS2,9/2/2026,Tư,07:49,12:46,,,,,,,,
00042,Ylinh,CS2,8/29/2026,Bảy,15:05,22:04,,,,,,,,
00042,Ylinh,CS2,8/30/2026,CN,16:15,23:13,,,,,,,,
00042,Ylinh,CS2,9/1/2026,Ba,07:17,22:08,,,,,,,,
00042,Ylinh,CS2,9/2/2026,Tư,12:17,22:09,,,,,,,,
00103,Tran,CS2,8/4/2026,Ba,17:02,21:58,,,,,,,,
00103,Tran,CS2,8/6/2026,Năm,17:35,21:51,,,,,,,,
00103,Tran,CS2,8/8/2026,Bảy,08:00,12:34,,,,,,,,
00103,Tran,CS2,8/9/2026,CN,08:07,12:37,15:58,22:13,,,,,,
00103,Tran,CS2,8/11/2026,Ba,17:04,21:51,,,,,,,,
00103,Tran,CS2,8/12/2026,Tư,17:15,21:43,,,,,,,,
00103,Tran,CS2,8/13/2026,Năm,17:11,21:45,,,,,,,,
00103,Tran,CS2,8/14/2026,Sáu,17:08,21:50,,,,,,,,
00103,Tran,CS2,8/15/2026,Bảy,08:06,12:34,,,,,,,,
00103,Tran,CS2,8/16/2026,CN,08:06,12:39,16:54,22:09,,,,,,
00103,Tran,CS2,8/17/2026,Hai,17:03,21:36,,,,,,,,
00103,Tran,CS2,8/18/2026,Ba,17:17,21:50,,,,,,,,
00103,Tran,CS2,8/19/2026,Tư,17:01,21:53,,,,,,,,
00103,Tran,CS2,8/20/2026,Năm,17:25,21:49,,,,,,,,
00103,Tran,CS2,8/21/2026,Sáu,17:01,21:54,,,,,,,,
00103,Tran,CS2,8/22/2026,Bảy,07:58,12:32,,,,,,,,
00103,Tran,CS2,8/24/2026,Hai,16:17,21:52,,,,,,,,
00103,Tran,CS2,8/27/2026,Năm,17:18,21:38,,,,,,,,
00103,Tran,CS2,8/28/2026,Sáu,17:16,21:59,,,,,,,,
00103,Tran,CS2,8/29/2026,Bảy,08:02,12:34,,,,,,,,
00103,Tran,CS2,8/30/2026,CN,07:55,12:39,,,,,,,,
00103,Tran,CS2,8/31/2026,Hai,17:20,22:24,,,,,,,,
00200,Thuy,CS2,8/5/2026,Tư,08:03,11:53,,,,,,,,
00200,Thuy,CS2,8/6/2026,Năm,15:58,21:51,,,,,,,,
00200,Thuy,CS2,8/13/2026,Năm,16:05,21:46,,,,,,,,
00200,Thuy,CS2,8/15/2026,Bảy,15:55,22:08,,,,,,,,
00200,Thuy,CS2,8/16/2026,CN,14:55,22:10,,,,,,,,
00200,Thuy,CS2,8/18/2026,Ba,08:06,12:30,,,,,,,,
00200,Thuy,CS2,8/21/2026,Sáu,08:05,12:41,,,,,,,,
00200,Thuy,CS2,8/22/2026,Bảy,14:15,22:13,,,,,,,,
00200,Thuy,CS2,8/23/2026,CN,15:02,22:16,,,,,,,,
00200,Thuy,CS2,8/25/2026,Ba,08:04,12:34,,,,,,,,
00200,Thuy,CS2,8/27/2026,Năm,07:55,11:44,,,,,,,,
00200,Thuy,CS2,8/29/2026,Bảy,16:00,22:16,,,,,,,,
00200,Thuy,CS2,8/30/2026,CN,16:50,23:13,,,,,,,,
00200,Thuy,CS2,8/31/2026,Hai,07:00,16:17,,,,,,,,
00200,Thuy,CS2,9/1/2026,Ba,07:34,13:30,,,,,,,,
00200,Thuy,CS2,9/2/2026,Tư,07:34,22:06,,,,,,,,`;
