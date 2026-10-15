const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { updateDesktopExcel } = require('./sync_desktop_excel');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// Khởi tạo Database nếu chưa có
function getInitialData() {
    // Load from data.js
    const dataJsContent = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
    // We can evaluate or load DEFAULT data
    let sandbox = {};
    const fn = new Function('sandbox', dataJsContent + '; sandbox.DEFAULT_ACTIVE_EMPLOYEES = DEFAULT_ACTIVE_EMPLOYEES; sandbox.DEFAULT_RETIRED_EMPLOYEES = DEFAULT_RETIRED_EMPLOYEES; sandbox.DEFAULT_ATTENDANCE_LADDER = DEFAULT_ATTENDANCE_LADDER; sandbox.DEFAULT_PAYROLL_MASTER_SEP2026 = DEFAULT_PAYROLL_MASTER_SEP2026; sandbox.DEFAULT_ADVANCES_SEP2026 = DEFAULT_ADVANCES_SEP2026; sandbox.DEFAULT_PENALTIES_SEP2026 = DEFAULT_PENALTIES_SEP2026; sandbox.DEFAULT_BONUSES_SEP2026 = DEFAULT_BONUSES_SEP2026; sandbox.DEFAULT_DEPOSITS_SEP2026 = DEFAULT_DEPOSITS_SEP2026;');
    fn(sandbox);

    // Xây dựng danh sách timesheets mặc định cho Tháng 09/2026 từ bảng payroll chuẩn
    const timesheetSep2026 = sandbox.DEFAULT_PAYROLL_MASTER_SEP2026.map(p => ({
        staffCode: p.code,
        machineCode: "",
        branch: p.branch,
        totalHours: p.hours,
        workDays: Math.ceil(p.hours / 6),
        warnings: 0
    }));

    return {
        currentMonth: "2026-09",
        employees: [
            ...sandbox.DEFAULT_ACTIVE_EMPLOYEES,
            ...sandbox.DEFAULT_RETIRED_EMPLOYEES.map(emp => ({
                id: "RET-" + Math.random().toString(36).substr(2, 6),
                machineCode: "",
                code: emp.code,
                name: emp.name,
                branch: emp.branch,
                hourlyWage: emp.hourlyWage,
                startDate: emp.startDate,
                endDate: emp.endDate,
                tenureMonths: emp.tenureMonths,
                birthDate: "",
                phone: emp.phone || "",
                zalo: "",
                bankName: emp.bankName,
                bankAccount: emp.bankAccount,
                accountHolder: emp.accountHolder,
                idCard: "",
                address: "",
                uniformCount: 0,
                uniformDepositMonth: "",
                status: "retired",
                retireReason: emp.reason,
                note: "",
                cooptedBy: "",
                salaryHistory: []
            }))
        ],
        attendanceLadder: sandbox.DEFAULT_ATTENDANCE_LADDER,
        payrolls: {
            "2026-09": sandbox.DEFAULT_PAYROLL_MASTER_SEP2026
        },
        timesheets: {
            "2026-09": timesheetSep2026
        },
        advances: {
            "2026-09": sandbox.DEFAULT_ADVANCES_SEP2026
        },
        penalties: {
            "2026-09": sandbox.DEFAULT_PENALTIES_SEP2026
        },
        bonuses: {
            "2026-09": sandbox.DEFAULT_BONUSES_SEP2026
        },
        deposits: {
            "2026-09": sandbox.DEFAULT_DEPOSITS_SEP2026
        },
        availableMonths: ["2026-09", "2026-10", "2026-11"]
    };
}

function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initData = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initData, null, 2), 'utf8');
        return initData;
    }
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        // Đảm bảo timesheets tháng 9 luôn có dữ liệu nếu bị rỗng
        if (!data.timesheets || !data.timesheets["2026-09"] || data.timesheets["2026-09"].length === 0) {
            const initData = getInitialData();
            data.timesheets = data.timesheets || {};
            data.timesheets["2026-09"] = initData.timesheets["2026-09"];
            saveDB(data);
        }
        return data;
    } catch (e) {
        console.error("Lỗi đọc database.json, tạo lại:", e);
        const initData = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initData, null, 2), 'utf8');
        return initData;
    }
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ==========================================
// API ROUTES
// ==========================================

// Đăng nhập hệ thống CocoMeo
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if ((username || '').trim().toLowerCase() === 'cocomeo' && (password || '').trim() === '12121990') {
        const token = 'cocomeo_token_' + Buffer.from('cocomeo:' + Date.now()).toString('base64');
        return res.json({ success: true, token, user: 'cocomeo' });
    }
    return res.status(401).json({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
});

// Kiểm tra phiên đăng nhập
app.get('/api/auth-check', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.includes('cocomeo_token_')) {
        return res.json({ authenticated: true, user: 'cocomeo' });
    }
    return res.status(401).json({ authenticated: false });
});

// Lấy toàn bộ dữ liệu
app.get('/api/data', (req, res) => {
    const db = loadDB();
    res.json(db);
});

// Chuyển tháng
app.post('/api/month', (req, res) => {
    const { month } = req.body;
    const db = loadDB();
    if (month) {
        db.currentMonth = month;
        if (!db.availableMonths.includes(month)) {
            db.availableMonths.push(month);
            db.availableMonths.sort();
        }
        saveDB(db);
    }
    res.json({ success: true, currentMonth: db.currentMonth });
});

// Đổi trạng thái chuyển khoản
app.post('/api/payroll/toggle-transfer', (req, res) => {
    const { month, staffCode } = req.body;
    const db = loadDB();
    const curMonth = month || db.currentMonth;
    const payroll = db.payrolls[curMonth] || [];
    const item = payroll.find(p => p.code.toLowerCase().trim() === (staffCode || '').toLowerCase().trim());
    if (item) {
        item.isTransferred = !item.isTransferred;
        saveDB(db);
        return res.json({ success: true, item });
    }
    res.status(404).json({ error: "Không tìm thấy nhân viên" });
});

// Thêm / Cập nhật nhân viên
app.post('/api/employees', (req, res) => {
    const empData = req.body;
    const db = loadDB();
    if (empData.id) {
        const idx = db.employees.findIndex(e => e.id === empData.id);
        if (idx !== -1) {
            db.employees[idx] = { ...db.employees[idx], ...empData };
        } else {
            db.employees.unshift(empData);
        }
    } else {
        empData.id = "NV-" + Date.now().toString(36);
        db.employees.unshift(empData);
    }
    saveDB(db);
    res.json({ success: true, employee: empData });
});

// Đánh dấu nghỉ việc / kích hoạt lại
app.post('/api/employees/toggle-status', (req, res) => {
    const { id, reason } = req.body;
    const db = loadDB();
    const emp = db.employees.find(e => e.id === id);
    if (!emp) return res.status(404).json({ error: "Không tìm thấy" });

    if (emp.status === "active") {
        emp.status = "retired";
        emp.retireReason = reason || "Nghỉ việc";
        emp.endDate = new Date().toISOString().split("T")[0];
    } else {
        emp.status = "active";
        delete emp.retireReason;
        delete emp.endDate;
    }
    saveDB(db);
    res.json({ success: true, employee: emp });
});

// Phân tích file/text máy chấm công
app.post('/api/timesheets/parse', (req, res) => {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ error: "Thiếu dữ liệu" });

    const lines = rawText.trim().split(/\r?\n/);
    const summaryByStaff = {};
    const dailyRecords = [];

    const isPunchFormat = lines[0].toLowerCase().includes("thứ") || lines[0].toLowerCase().includes("1,2,3");

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length < 4) continue;

        const machineCode = cols[0] || "";
        const staffCode = cols[1] || "";
        const branch = cols[2] || "CS1";
        const dateStr = cols[3] || "";

        if (!staffCode || staffCode.toLowerCase().includes("tên nhân viên") || staffCode === "(blank)") continue;

        let dailyMinutes = 0;
        let punchDetails = [];
        let hasWarning = false;

        if (isPunchFormat) {
            const rawPunches = [];
            for (let c = 5; c < cols.length; c++) {
                const val = cols[c];
                if (val && /^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) {
                    rawPunches.push(val);
                }
            }

            // Parse & Debounce 10 min
            const parseMin = (s) => {
                const p = s.split(':');
                return parseInt(p[0]) * 60 + parseInt(p[1]);
            };
            const sorted = rawPunches.sort((a, b) => parseMin(a) - parseMin(b));
            const debounced = [];
            for (let s of sorted) {
                const m = parseMin(s);
                if (debounced.length === 0 || m - debounced[debounced.length - 1].min > 10) {
                    debounced.push({ str: s, min: m });
                }
            }

            if (debounced.length % 2 !== 0) hasWarning = true;

            for (let pIdx = 0; pIdx < debounced.length; pIdx += 2) {
                if (pIdx + 1 < debounced.length) {
                    let diff = debounced[pIdx + 1].min - debounced[pIdx].min;
                    if (diff < 0) diff += 1440;
                    dailyMinutes += diff;
                    punchDetails.push(`${debounced[pIdx].str}-${debounced[pIdx + 1].str}`);
                }
            }
        } else {
            const directTotal = cols[12] || "";
            if (directTotal && /^\d{1,2}:\d{2}(:\d{2})?$/.test(directTotal)) {
                const p = directTotal.split(':');
                dailyMinutes = parseInt(p[0]) * 60 + parseInt(p[1]);
            }
        }

        const k = staffCode.toLowerCase();
        if (!summaryByStaff[k]) {
            summaryByStaff[k] = {
                staffCode: staffCode,
                machineCode: machineCode,
                branch: branch.replace(/-/g, '').trim() || "CS1",
                totalMinutes: 0,
                workDays: 0,
                warnings: 0
            };
        }
        if (dailyMinutes > 0) {
            summaryByStaff[k].totalMinutes += dailyMinutes;
            summaryByStaff[k].workDays += 1;
        }
        if (hasWarning) summaryByStaff[k].warnings += 1;
    }

    const summaryList = Object.values(summaryByStaff).map(s => ({
        ...s,
        totalHours: Math.round((s.totalMinutes / 60) * 100) / 100
    }));

    res.json({ summaryList });
});

// Áp dụng Timesheet và Tính Lương
app.post('/api/timesheets/apply', (req, res) => {
    const { month, summaryList } = req.body;
    const db = loadDB();
    const curMonth = month || db.currentMonth;

    if (summaryList && summaryList.length > 0) {
        db.timesheets[curMonth] = summaryList;
    }

    // Tự động tính toán lương
    calculatePayrollForMonth(db, curMonth);
    saveDB(db);
    updateDesktopExcel();

    res.json({ success: true, payroll: db.payrolls[curMonth] });
});

// Tính toán bảng lương
app.post('/api/payroll/calculate', (req, res) => {
    const { month } = req.body;
    const db = loadDB();
    const curMonth = month || db.currentMonth;
    calculatePayrollForMonth(db, curMonth);
    saveDB(db);
    updateDesktopExcel();
    res.json({ success: true, payroll: db.payrolls[curMonth] });
});

// Cập nhật giờ làm thêm / chấm giấy bên ngoài trực tiếp
app.post('/api/timesheets/update-extra-hours', (req, res) => {
    const { month, staffCode, extraHours, extraNote, totalHours } = req.body;
    const db = loadDB();
    const curMonth = month || db.currentMonth;
    const list = db.timesheets[curMonth] || [];
    const item = list.find(t => (t.staffCode || '').toLowerCase().trim() === (staffCode || '').toLowerCase().trim());
    if (item) {
        if (extraHours !== undefined) item.extraHours = parseFloat(extraHours) || 0;
        if (extraNote !== undefined) item.extraNote = extraNote;
        if (totalHours !== undefined && totalHours !== null && !isNaN(totalHours)) {
            item.totalHours = parseFloat(totalHours) || 0;
        } else {
            const baseMachine = item.machineHours !== undefined ? item.machineHours : item.totalHours;
            item.machineHours = baseMachine;
            item.totalHours = Math.round((baseMachine + (item.extraHours || 0)) * 100) / 100;
        }
        calculatePayrollForMonth(db, curMonth);
        saveDB(db);
        updateDesktopExcel();
        return res.json({ success: true, item, payroll: db.payrolls[curMonth] });
    }
    res.status(404).json({ error: "Không tìm thấy nhân viên trong bảng công" });
});

// Đồng bộ thủ công ra file Excel Desktop
app.post('/api/desktop/sync-excel', (req, res) => {
    try {
        const result = updateDesktopExcel();
        res.json({ success: true, result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

function calculatePayrollForMonth(db, monthKey) {
    const timesheet = db.timesheets[monthKey] || [];
    const staffHoursMap = {};
    timesheet.forEach(item => {
        const k = (item.staffCode || '').toLowerCase().trim();
        staffHoursMap[k] = (staffHoursMap[k] || 0) + (parseFloat(item.totalHours) || 0);
    });

    const monthBonuses = db.bonuses[monthKey] || [];
    const monthPenalties = db.penalties[monthKey] || [];
    const monthAdvances = db.advances[monthKey] || [];
    const monthDeposits = db.deposits[monthKey] || [];

    const monthNum = parseInt(monthKey.split('-')[1], 10);
    const newPayroll = [];

    db.employees.forEach(emp => {
        const k = (emp.code || emp.name).toLowerCase().trim();
        const hasHours = staffHoursMap.hasOwnProperty(k);
        let hoursWorked = staffHoursMap[k];

        // Nếu trong timesheets chưa có thì kiểm tra payroll cũ tháng 9 có sẵn không
        if (hoursWorked === undefined) {
            const oldP = (db.payrolls[monthKey] || []).find(p => p.code.toLowerCase().trim() === k);
            hoursWorked = oldP ? oldP.hours : 0;
        }

        const staffDeposits = monthDeposits.filter(d => (d.staffCode || '').toLowerCase().trim() === k || (d.staffName || '').toLowerCase().trim() === k);
        const totalDeposit = staffDeposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

        if (emp.status === "retired" && hoursWorked === 0 && staffDeposits.length === 0) return;

        const hourlyWage = parseFloat(emp.hourlyWage) || 0;
        const baseSalary = Math.round(hoursWorked * hourlyWage);

        // Chuyên cần
        let attendanceBonus = 0;
        if (hoursWorked > 0 && db.attendanceLadder) {
            const sorted = [...db.attendanceLadder].sort((a, b) => b.minHours - a.minHours);
            for (let t of sorted) {
                if (hoursWorked >= t.minHours) {
                    attendanceBonus = t.bonus;
                    break;
                }
            }
        }

        // Sinh nhật > 6 tháng
        let birthdayBonus = 0;
        if (emp.birthDate && emp.tenureMonths >= 6) {
            const bp = emp.birthDate.split('-');
            if (bp.length >= 2 && parseInt(bp[1], 10) === monthNum) {
                birthdayBonus = 100000;
            }
        }

        // Thưởng khác
        const staffBonuses = monthBonuses.filter(b => (b.staffCode || '').toLowerCase().trim() === k || (b.staffName || '').toLowerCase().trim() === k);
        let otherBonus = 0;
        staffBonuses.forEach(b => {
            if (b.category === "attendance") attendanceBonus = b.amount;
            else if (b.category === "birthday_loyalty") birthdayBonus = b.amount;
            else otherBonus += (parseFloat(b.amount) || 0);
        });

        const totalBonus = attendanceBonus + birthdayBonus + otherBonus;

        // Phạt
        const staffPenalties = monthPenalties.filter(p => (p.staffCode || '').toLowerCase().trim() === k || (p.staffName || '').toLowerCase().trim() === k);
        const totalPenalty = staffPenalties.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        // Ứng
        const staffAdvances = monthAdvances.filter(a => (a.staffCode || '').toLowerCase().trim() === k || (a.staffName || '').toLowerCase().trim() === k);
        const totalAdvance = staffAdvances.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);

        const balance = baseSalary - totalAdvance - totalPenalty;
        const net = balance + totalDeposit + totalBonus;
        const roundedTotal = Math.round(net / 1000) * 1000;

        const oldEntry = (db.payrolls[monthKey] || []).find(p => p.code.toLowerCase().trim() === k);
        const isTransferred = oldEntry ? !!oldEntry.isTransferred : false;

        newPayroll.push({
            branch: emp.branch || "CS1",
            code: emp.code,
            name: emp.name,
            hours: hoursWorked,
            wage: hourlyWage,
            baseSalary,
            advance: totalAdvance,
            penalty: totalPenalty,
            balance,
            deposit: totalDeposit,
            bonus: totalBonus,
            total: roundedTotal,
            bankName: emp.bankName || "",
            bankAccount: emp.bankAccount || "",
            accountHolder: emp.accountHolder || emp.name,
            isTransferred
        });
    });

    newPayroll.sort((a, b) => {
        if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
        return a.name.localeCompare(b.name, 'vi');
    });

    db.payrolls[monthKey] = newPayroll;
}

// Reset Database
app.post('/api/reset', (req, res) => {
    const initData = getInitialData();
    saveDB(initData);
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🐾 COCOMEO PAYROLL SERVER ĐANG CHẠY TẠI:`);
    console.log(`👉 Local:   http://localhost:${PORT}`);
    console.log(`👉 Network: http://0.0.0.0:${PORT}`);
    console.log(`=======================================================`);
});
