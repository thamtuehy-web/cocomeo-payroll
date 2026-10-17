/**
 * COCOMEO APP QUẢN LÝ LƯƠNG & THÔNG TIN NHÂN VIÊN
 * Xử lý tự động chấm công, tính giờ làm, lương theo giờ, thưởng, phạt, tạm ứng, cọc áo và VietQR
 */

// State toàn cục ứng dụng
const AppState = {
    currentMonth: "2026-09",
    employees: [],
    attendanceLadder: [],
    payrolls: {},
    timesheets: {},
    advances: {},
    penalties: {},
    bonuses: {},
    deposits: {},
    availableMonths: ["2026-09", "2026-10", "2026-11"]
};

// Map tên ngân hàng sang mã VietQR Napas chuẩn
const BANK_CODES = {
    "MB": "MB",
    "MBBANK": "MB",
    "VIETCOMBANK": "VCB",
    "VCB": "VCB",
    "VCB DIGIBANK": "VCB",
    "TECHCOMBANK": "TCB",
    "TCB": "TCB",
    "VIETINBANK": "CTG",
    "VIETIN BANK": "CTG",
    "CTG": "CTG",
    "BIDV": "BIDV",
    "ACB": "ACB",
    "TP BANK": "TPB",
    "TPBANK": "TPB",
    "TIEN PHONG": "TPB",
    "TIENPHONG": "TPB",
    "VP BANK": "VPB",
    "VPBANK": "VPB",
    "SACOMBANK": "STB",
    "STB": "STB",
    "AGRIBANK": "VBA",
    "NAM A BANK": "NAB",
    "SHB": "SHB",
    "PVCOM": "PVCB",
    "VIKKI": "VIKKI",
    "MOMO": "MOMO"
};

// ==========================================================================
// HỆ THỐNG XÁC THỰC & ĐĂNG NHẬP (LOGIN SYSTEM)
// ==========================================================================

function checkAuthStatus() {
    const token = localStorage.getItem("cocomeo_auth_token");
    const loginOverlay = document.getElementById("login-overlay");
    if (!token) {
        if (loginOverlay) loginOverlay.classList.remove("hidden");
        return false;
    }
    if (loginOverlay) loginOverlay.classList.add("hidden");
    return true;
}

async function handleLoginSubmit(event) {
    if (event) event.preventDefault();
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const errorEl = document.getElementById("login-error-msg");
    const submitBtn = document.getElementById("btn-login-submit");

    const username = (usernameInput?.value || "").trim();
    const password = (passwordInput?.value || "").trim();

    if (!username || !password) {
        if (errorEl) {
            errorEl.textContent = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!";
            errorEl.style.display = "block";
        }
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ Đang đăng nhập...";
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem("cocomeo_auth_token", data.token);
            localStorage.setItem("cocomeo_auth_user", data.user || username);

            const loginOverlay = document.getElementById("login-overlay");
            if (loginOverlay) loginOverlay.classList.add("hidden");

            showToast("👋 Đăng nhập thành công! Chào mừng Quản lý Cocomeo Salary Staff.", "success");
            if (errorEl) errorEl.style.display = "none";
        } else {
            if (errorEl) {
                errorEl.textContent = data.error || "Tên đăng nhập hoặc mật khẩu không chính xác!";
                errorEl.style.display = "block";
            }
            showToast("Đăng nhập thất bại!", "error");
        }
    } catch (err) {
        // Fallback kiểm tra offline nếu không kết nối được server
        if (username.toLowerCase() === "cocomeo" && password === "12121990") {
            const token = "cocomeo_token_offline_" + Date.now();
            localStorage.setItem("cocomeo_auth_token", token);
            localStorage.setItem("cocomeo_auth_user", "cocomeo");

            const loginOverlay = document.getElementById("login-overlay");
            if (loginOverlay) loginOverlay.classList.add("hidden");

            showToast("👋 Đăng nhập thành công (Chế độ Offline/PWA)!", "success");
            if (errorEl) errorEl.style.display = "none";
        } else {
            if (errorEl) {
                errorEl.textContent = "Tên đăng nhập hoặc mật khẩu không chính xác!";
                errorEl.style.display = "block";
            }
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "🚀 Đăng Nhập";
        }
    }
}

function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Cocomeo Salary Staff?")) {
        localStorage.removeItem("cocomeo_auth_token");
        localStorage.removeItem("cocomeo_auth_user");
        const loginOverlay = document.getElementById("login-overlay");
        if (loginOverlay) {
            loginOverlay.classList.remove("hidden");
            const passwordInput = document.getElementById("login-password");
            if (passwordInput) passwordInput.value = "";
        }
        showToast("Đã đăng xuất thành công!", "info");
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("login-password");
    if (!passwordInput) return;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// ==========================================================================
// KHỞI TẠO VÀ LƯU TRỮ (LOCALSTORAGE)
// ==========================================================================

function initApp() {
    checkAuthStatus();
    loadStateFromStorage();
    setupEventListeners();
    populateMonthSelector();
    initMobileFeatures();
    renderDashboard();
    renderPayrollTable();
    renderEmployeesTable();
    renderBonusesTable();
    renderPenaltiesTable();
    renderAdvancesTable();
    renderDepositsTable();
    renderAttendanceLadder();
    renderLoadedTimesheetTable();
}

function loadStateFromStorage() {
    try {
        const savedEmployees = localStorage.getItem("cocomeo_employees");
        if (savedEmployees) {
            AppState.employees = JSON.parse(savedEmployees);
        } else {
            AppState.employees = [
                ...DEFAULT_ACTIVE_EMPLOYEES,
                ...DEFAULT_RETIRED_EMPLOYEES.map(emp => ({
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
            ];
            saveStateToStorage("employees");
        }

        const savedLadder = localStorage.getItem("cocomeo_ladder");
        AppState.attendanceLadder = savedLadder ? JSON.parse(savedLadder) : DEFAULT_ATTENDANCE_LADDER;

        const savedPayrolls = localStorage.getItem("cocomeo_payrolls");
        AppState.payrolls = savedPayrolls ? JSON.parse(savedPayrolls) : { "2026-09": DEFAULT_PAYROLL_MASTER_SEP2026 };

        const savedAdvances = localStorage.getItem("cocomeo_advances");
        AppState.advances = savedAdvances ? JSON.parse(savedAdvances) : { "2026-09": DEFAULT_ADVANCES_SEP2026 };

        const savedPenalties = localStorage.getItem("cocomeo_penalties");
        AppState.penalties = savedPenalties ? JSON.parse(savedPenalties) : { "2026-09": DEFAULT_PENALTIES_SEP2026 };

        const savedBonuses = localStorage.getItem("cocomeo_bonuses");
        AppState.bonuses = savedBonuses ? JSON.parse(savedBonuses) : { "2026-09": DEFAULT_BONUSES_SEP2026 };

        const savedDeposits = localStorage.getItem("cocomeo_deposits");
        AppState.deposits = savedDeposits ? JSON.parse(savedDeposits) : { "2026-09": DEFAULT_DEPOSITS_SEP2026 };

        const savedTimesheets = localStorage.getItem("cocomeo_timesheets");
        AppState.timesheets = savedTimesheets ? JSON.parse(savedTimesheets) : { "2026-09": DEFAULT_TIMESHEETS_SEP2026 };
        if (!AppState.timesheets["2026-09"] || AppState.timesheets["2026-09"].length === 0) {
            AppState.timesheets["2026-09"] = DEFAULT_TIMESHEETS_SEP2026;
            saveStateToStorage("timesheets");
        }

        const savedMonth = localStorage.getItem("cocomeo_cur_month");
        if (savedMonth) AppState.currentMonth = savedMonth;

        // Tự động đồng bộ với Backend API nếu máy chủ Node.js đang chạy
        syncWithBackendServer();

    } catch (e) {
        console.error("Lỗi khi tải dữ liệu LocalStorage:", e);
        showToast("Không thể tải toàn bộ bộ nhớ tạm, sử dụng dữ liệu mặc định.", "warning");
    }
}

function saveStateToStorage(key) {
    try {
        if (!key || key === "employees") localStorage.setItem("cocomeo_employees", JSON.stringify(AppState.employees));
        if (!key || key === "ladder") localStorage.setItem("cocomeo_ladder", JSON.stringify(AppState.attendanceLadder));
        if (!key || key === "payrolls") localStorage.setItem("cocomeo_payrolls", JSON.stringify(AppState.payrolls));
        if (!key || key === "advances") localStorage.setItem("cocomeo_advances", JSON.stringify(AppState.advances));
        if (!key || key === "penalties") localStorage.setItem("cocomeo_penalties", JSON.stringify(AppState.penalties));
        if (!key || key === "bonuses") localStorage.setItem("cocomeo_bonuses", JSON.stringify(AppState.bonuses));
        if (!key || key === "deposits") localStorage.setItem("cocomeo_deposits", JSON.stringify(AppState.deposits));
        if (!key || key === "timesheets") localStorage.setItem("cocomeo_timesheets", JSON.stringify(AppState.timesheets));
        if (!key || key === "cur_month") localStorage.setItem("cocomeo_cur_month", AppState.currentMonth);
    } catch (e) {
        console.error("Lỗi khi lưu LocalStorage:", e);
    }
}

function resetToDefaultData() {
    if (!confirm("Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu gốc từ 2 file CocoMeo (Tháng 09/2026)? Toàn bộ thay đổi tự nhập sẽ được nạp lại mặc định.")) return;
    localStorage.clear();
    location.reload();
}

// ==========================================================================
// CÁC HÀM TIỆN ÍCH ĐỊNH DẠNG & TÍNH TOÁN
// ==========================================================================

function formatVND(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return "0 đ";
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + " đ";
}

function formatHours(decimalHours) {
    if (isNaN(decimalHours) || decimalHours === null || decimalHours === undefined) return "00:00:00";
    const totalMinutes = Math.round(decimalHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
}

function parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.trim().split(':');
    if (parts.length < 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
}

function minutesToHoursDecimal(minutes) {
    return Math.round((minutes / 60) * 1000000) / 1000000;
}

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 250);
    }, 3500);
}

// ==========================================================================
// BỘ PHÂN TÍCH CHẤM CÔNG TỪ MÁY CHẤM CÔNG (BIOMETRIC PUNCH LOG PARSER)
// ==========================================================================

/**
 * Phân tích file xuất từ máy chấm công
 * Hỗ trợ 2 định dạng:
 * 1) Máy chấm công theo lần quẹt: Mã,Tên nhân viên,Tên bộ phận,Ngày,Thứ,1,2,3,4,5,6,7,8,9,10
 * 2) Bảng ca tổng hợp: Mã,Tên nhân viên,Tên bộ phận,Ngày,NaN,Vào ca 1,Ra ca 1,Vào ca 2,Ra ca 2,x,Giờ làm ca sáng,Giờ làm ca tối,Tổng
 */
function parseTimesheetData(rawText) {
    if (!rawText || !rawText.trim()) return { dailyRecords: [], summaryList: [], detectedMonth: null };

    const lines = rawText.trim().split(/\r?\n/);
    if (lines.length < 2) return { dailyRecords: [], summaryList: [], detectedMonth: null };

    // Tìm dòng tiêu đề thực tế (bỏ qua dòng tiêu đề phụ nếu có)
    let headerIdx = 0;
    for (let i = 0; i < Math.min(lines.length, 15); i++) {
        const l = lines[i].toLowerCase();
        if ((l.includes("ngày") || l.includes("ngay")) && (l.includes("nhân viên") || l.includes("nhan vien") || l.includes("mã") || l.includes("ma") || l.includes("thứ") || l.includes("thu"))) {
            headerIdx = i;
            break;
        }
    }

    const header = lines[headerIdx].toLowerCase();
    const isPunchLogFormat = header.includes("thứ") || header.includes("thu") || header.includes("1,2,3") || header.includes(",1,") || header.includes(",1") || header.includes(", 1");

    const dailyRecords = [];
    const summaryByStaff = {};
    let detectedMonth = null;

    for (let i = headerIdx + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("#") || line.startsWith("//")) continue;

        const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length < 4) continue;

        let machineCode = cols[0] || "";
        let staffNameCol = cols[1] || "";
        let branch = cols[2] || "";
        let dateStr = cols[3] || "";

        if (!staffNameCol || staffNameCol.toLowerCase().includes("tên nhân viên") || staffNameCol === "(blank)") continue;

        // Tự động nhận diện Tháng từ cột Ngày
        if (!detectedMonth && dateStr) {
            const m1 = dateStr.match(/^(\d{4})[-/](\d{1,2})/);
            if (m1) detectedMonth = `${m1[1]}-${m1[2].padStart(2, '0')}`;
            const m2 = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
            if (m2) detectedMonth = `${m2[3]}-${m2[2].padStart(2, '0')}`;
        }

        const staffCode = staffNameCol.trim();
        let dailyTotalMinutes = 0;
        let punchDetails = [];
        let hasWarning = false;
        let warningNote = "";

        if (isPunchLogFormat) {
            // Định dạng quẹt thẻ: các cột từ vị trí 5 trở đi là các giờ quẹt
            const rawPunches = [];
            for (let c = 5; c < cols.length; c++) {
                const val = String(cols[c] || "").trim();
                const match = val.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
                if (match) {
                    const hh = match[1].padStart(2, '0');
                    const mm = match[2];
                    rawPunches.push(`${hh}:${mm}`);
                }
            }

            // Lọc trùng quẹt trong vòng 10 phút
            const sortedPunches = rawPunches.sort((a, b) => (parseTimeToMinutes(a) || 0) - (parseTimeToMinutes(b) || 0));
            const debounced = [];
            for (let p of sortedPunches) {
                const m = parseTimeToMinutes(p);
                if (m === null) continue;
                if (debounced.length === 0) {
                    debounced.push({ str: p, min: m });
                } else {
                    const prev = debounced[debounced.length - 1];
                    if (m - prev.min > 10) {
                        debounced.push({ str: p, min: m });
                    }
                }
            }

            // Ghép cặp Vào - Ra
            if (debounced.length % 2 !== 0) {
                hasWarning = true;
                warningNote = `Số lần quẹt lẻ (${debounced.length} lần). Có thể quên quẹt vào hoặc quẹt ra.`;
            }

            for (let pIdx = 0; pIdx < debounced.length; pIdx += 2) {
                if (pIdx + 1 < debounced.length) {
                    const inP = debounced[pIdx];
                    const outP = debounced[pIdx + 1];
                    let diff = outP.min - inP.min;
                    if (diff < 0) diff += 24 * 60; // Ca xuyên đêm
                    dailyTotalMinutes += diff;
                    punchDetails.push(`${inP.str} - ${outP.str} (${(diff / 60).toFixed(2)}h)`);
                } else {
                    punchDetails.push(`${debounced[pIdx].str} (Thiếu quẹt ra)`);
                }
            }
        } else {
            // Định dạng ca trực tiếp
            const in1 = cols[5] || "";
            const out1 = cols[6] || "";
            const in2 = cols[7] || "";
            const out2 = cols[8] || "";
            const directTotal = cols[12] || "";

            if (directTotal && /^\d{1,2}:\d{2}(:\d{2})?$/.test(directTotal)) {
                dailyTotalMinutes = parseTimeToMinutes(directTotal) || 0;
            } else {
                if (in1 && out1) {
                    const mIn = parseTimeToMinutes(in1);
                    const mOut = parseTimeToMinutes(out1);
                    if (mIn !== null && mOut !== null) {
                        dailyTotalMinutes += (mOut >= mIn ? mOut - mIn : mOut + 1440 - mIn);
                        punchDetails.push(`Ca 1: ${in1} - ${out1}`);
                    }
                }
                if (in2 && out2) {
                    const mIn = parseTimeToMinutes(in2);
                    const mOut = parseTimeToMinutes(out2);
                    if (mIn !== null && mOut !== null) {
                        dailyTotalMinutes += (mOut >= mIn ? mOut - mIn : mOut + 1440 - mIn);
                        punchDetails.push(`Ca 2: ${in2} - ${out2}`);
                    }
                }
            }
        }

        const dailyHours = minutesToHoursDecimal(dailyTotalMinutes);

        dailyRecords.push({
            machineCode,
            staffCode,
            branch: branch.replace(/-/g, '').trim() || "CS1",
            date: dateStr,
            dailyHours,
            dailyTotalMinutes,
            details: punchDetails.join("; "),
            hasWarning,
            warningNote
        });

        // Gom nhóm theo nhân viên
        const key = staffCode.toLowerCase();
        if (!summaryByStaff[key]) {
            summaryByStaff[key] = {
                staffCode: staffCode,
                machineCode: machineCode,
                branch: branch.replace(/-/g, '').trim() || "CS1",
                totalMinutes: 0,
                workDays: 0,
                warnings: 0
            };
        }
        if (dailyTotalMinutes > 0) {
            summaryByStaff[key].totalMinutes += dailyTotalMinutes;
            summaryByStaff[key].workDays += 1;
        }
        if (hasWarning) {
            summaryByStaff[key].warnings += 1;
        }
    }

    // Đổi tổng phút sang giờ
    const summaryList = Object.values(summaryByStaff).map(s => ({
        ...s,
        totalHours: minutesToHoursDecimal(s.totalMinutes),
        formattedHours: formatHours(minutesToHoursDecimal(s.totalMinutes))
    }));

    return {
        dailyRecords,
        summaryList,
        detectedMonth
    };
}

// ==========================================================================
// TỰ ĐỘNG TÍNH TOÁN LƯƠNG TOÀN DIỆN (AUTO PAYROLL CALCULATION ENGINE)
// ==========================================================================

/**
 * Tự động tính lương cho toàn bộ nhân viên theo:
 * 1) Tổng giờ công xuất từ bảng chấm công
 * 2) Mức lương theo giờ theo file info staff
 * 3) Thưởng chuyên cần theo bậc thang tự động
 * 4) Thưởng sinh nhật cho nhân viên > 6 tháng làm việc
 * 5) Các khoản thưởng khác (khách đoàn, tiệc SN, xăng xe, giới thiệu...)
 * 6) Phạt vi phạm kỉ luật
 * 7) Tạm ứng lương
 * 8) Cọc áo đồng phục & BHXH
 * 9) Làm tròn nghìn đồng
 */
function calculateMonthlyPayroll(monthKey) {
    monthKey = monthKey || AppState.currentMonth;

    // Lấy dữ liệu chấm công của tháng
    const monthTimesheet = AppState.timesheets[monthKey] || [];
    const staffHoursMap = {};

    monthTimesheet.forEach(item => {
        const key = item.staffCode.toLowerCase().trim();
        staffHoursMap[key] = (staffHoursMap[key] || 0) + (parseFloat(item.totalHours) || 0);
    });

    // Lấy danh sách thưởng, phạt, ứng, cọc của tháng
    const monthBonuses = AppState.bonuses[monthKey] || [];
    const monthPenalties = AppState.penalties[monthKey] || [];
    const monthAdvances = AppState.advances[monthKey] || [];
    const monthDeposits = AppState.deposits[monthKey] || [];

    // Tách tháng và năm
    const [yearStr, monthStr] = monthKey.split("-");
    const currentMonthNum = parseInt(monthStr, 10);

    const newPayrollList = [];

    // Duyệt qua tất cả nhân viên đang làm việc (hoặc đã nghỉ nhưng có giờ/cọc trong tháng)
    AppState.employees.forEach(emp => {
        const key = (emp.code || emp.name).toLowerCase().trim();
        let hoursWorked = staffHoursMap[key];
        if (hoursWorked === undefined || hoursWorked === null) {
            const oldP = (AppState.payrolls[monthKey] || []).find(p => (p.code || "").toLowerCase().trim() === key);
            if (oldP && oldP.hours !== undefined && oldP.hours > 0) {
                hoursWorked = oldP.hours;
            } else {
                const defT = DEFAULT_TIMESHEETS_SEP2026.find(t => t.staffCode.toLowerCase().trim() === key);
                hoursWorked = defT ? defT.totalHours : 0;
            }
        }

        // Lấy cọc áo / hoàn cọc / BHXH
        const staffDeposits = monthDeposits.filter(d => (d.staffCode || "").toLowerCase().trim() === key || (d.staffName || "").toLowerCase().trim() === key);
        const totalDeposit = staffDeposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

        // Nếu nhân viên đã nghỉ việc và không có giờ công cũng không có hoàn cọc -> bỏ qua không lên bảng lương
        if (emp.status === "retired" && hoursWorked === 0 && staffDeposits.length === 0) {
            return;
        }

        const hourlyWage = parseFloat(emp.hourlyWage) || 0;
        const baseSalary = Math.round(hoursWorked * hourlyWage);

        // 1. Thưởng Chuyên Cần tự động theo thang
        let attendanceBonus = 0;
        if (hoursWorked > 0 && AppState.attendanceLadder && AppState.attendanceLadder.length > 0) {
            // Sắp xếp thang từ cao xuống thấp
            const sortedLadder = [...AppState.attendanceLadder].sort((a, b) => b.minHours - a.minHours);
            for (let tier of sortedLadder) {
                if (hoursWorked >= tier.minHours) {
                    attendanceBonus = tier.bonus;
                    break;
                }
            }
        }

        // 2. Thưởng Sinh Nhật (> 6 tháng thâm niên) tự động kiểm tra
        let birthdayBonus = 0;
        if (emp.birthDate && emp.tenureMonths >= 6) {
            const bParts = emp.birthDate.split("-");
            if (bParts.length >= 2) {
                const bMonth = parseInt(bParts[1], 10);
                if (bMonth === currentMonthNum) {
                    birthdayBonus = 100000;
                }
            }
        }

        // 3. Các khoản thưởng khác đã ghi nhận
        const staffBonuses = monthBonuses.filter(b => (b.staffCode || "").toLowerCase().trim() === key || (b.staffName || "").toLowerCase().trim() === key);
        // Tránh cộng trùng nếu đã có thưởng chuyên cần/sinh nhật ghi tay
        let otherBonusTotal = 0;
        staffBonuses.forEach(b => {
            if (b.category === "attendance") {
                // Nếu người dùng ghi đè thủ công
                attendanceBonus = b.amount;
            } else if (b.category === "birthday_loyalty") {
                birthdayBonus = b.amount;
            } else {
                otherBonusTotal += (parseFloat(b.amount) || 0);
            }
        });

        const totalBonus = attendanceBonus + birthdayBonus + otherBonusTotal;

        // 4. Phạt kỷ luật
        const staffPenalties = monthPenalties.filter(p => (p.staffCode || "").toLowerCase().trim() === key || (p.staffName || "").toLowerCase().trim() === key);
        const totalPenalty = staffPenalties.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        // 5. Tạm ứng lương
        const staffAdvances = monthAdvances.filter(a => (a.staffCode || "").toLowerCase().trim() === key || (a.staffName || "").toLowerCase().trim() === key);
        const totalAdvance = staffAdvances.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);

        // 6. Tính lương sau ứng & phạt
        const balance = baseSalary - totalAdvance - totalPenalty;

        // 7. Thực nhận = balance + deposit + totalBonus
        const netBeforeRounding = balance + totalDeposit + totalBonus;

        // 8. Làm tròn đến hàng nghìn đồng
        const roundedTotal = Math.round(netBeforeRounding / 1000) * 1000;

        // Giữ trạng thái đã chuyển khoản nếu có trước đó
        const oldPayroll = (AppState.payrolls[monthKey] || []).find(p => (p.code || "").toLowerCase().trim() === key);
        const isTransferred = oldPayroll ? !!oldPayroll.isTransferred : false;

        newPayrollList.push({
            branch: emp.branch || "CS1",
            code: emp.code,
            name: emp.name,
            hours: hoursWorked,
            wage: hourlyWage,
            baseSalary: baseSalary,
            advance: totalAdvance,
            penalty: totalPenalty,
            balance: balance,
            deposit: totalDeposit,
            bonus: totalBonus,
            total: roundedTotal,
            bankName: emp.bankName || "",
            bankAccount: emp.bankAccount || "",
            accountHolder: emp.accountHolder || emp.name,
            isTransferred: isTransferred,
            details: {
                attendanceBonus,
                birthdayBonus,
                otherBonusTotal,
                penaltiesCount: staffPenalties.length,
                advancesCount: staffAdvances.length,
                depositsCount: staffDeposits.length
            }
        });
    });

    // Sắp xếp theo Cơ sở CS1 -> CS2 -> CS3 rồi đến Tên
    newPayrollList.sort((a, b) => {
        if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
        return a.name.localeCompare(b.name, 'vi');
    });

    AppState.payrolls[monthKey] = newPayrollList;
    saveStateToStorage("payrolls");

    renderDashboard();
    renderPayrollTable();
    renderLoadedTimesheetTable();
    showToast(`Đã tính toán xong bảng lương Tháng ${monthStr}/${yearStr} cho ${newPayrollList.length} nhân viên!`, "success");
}

function renderLoadedTimesheetTable() {
    const tbody = document.getElementById("timesheet-loaded-body");
    const countEl = document.getElementById("timesheet-loaded-count");
    if (!tbody) return;

    const monthKey = AppState.currentMonth;
    let list = AppState.timesheets[monthKey] || [];
    if (list.length === 0) {
        list = DEFAULT_TIMESHEETS_SEP2026;
        AppState.timesheets[monthKey] = list;
    }

    if (countEl) countEl.textContent = `${list.length} Nhân viên`;

    tbody.innerHTML = "";
    list.forEach((t, idx) => {
        const emp = AppState.employees.find(e => (e.code || "").toLowerCase().trim() === (t.staffCode || "").toLowerCase().trim());
        const empName = emp ? emp.name : (t.staffName || t.staffCode);
        const wage = emp ? emp.hourlyWage : 20000;
        const branch = emp ? emp.branch : (t.branch || "CS1");
        const branchClass = branch === "CS1" ? "badge-cs1" : (branch === "CS2" ? "badge-cs2" : "badge-cs3");

        const machineHours = t.machineHours !== undefined ? t.machineHours : t.totalHours;
        const extraHours = t.extraHours || 0;
        const extraNote = t.extraNote || "";
        const totalHours = t.totalHours;
        const projectedSalary = Math.round(totalHours * wage);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center font-bold text-muted">${idx + 1}</td>
            <td><span class="badge ${branchClass}">${branch}</span></td>
            <td>
                <div style="font-weight: 700;">${empName}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${t.staffCode}</div>
            </td>
            <td class="text-right">
                <div style="font-weight: 700;">${machineHours.toFixed(2)}h</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${formatHours(machineHours)}</div>
            </td>
            <td class="text-center" style="background: #fffbeb;">
                <input type="number" step="0.5" class="form-control text-center" 
                    style="width: 85px; font-weight: 700; color: #92400e; margin: 0 auto;" 
                    value="${extraHours}" 
                    id="extra-${t.staffCode}"
                    oninput="previewHoursChange('${t.staffCode}', ${wage})"
                    onchange="saveStaffHoursManual('${t.staffCode}')"
                    title="Nhập số giờ làm thêm / chấm giấy bên ngoài (+)">
            </td>
            <td style="background: #fffbeb;">
                <input type="text" class="form-control" 
                    style="font-size: 0.8rem;" 
                    placeholder="Lý do làm thêm / chấm ngoài..." 
                    value="${extraNote}" 
                    id="note-${t.staffCode}"
                    onchange="saveStaffHoursManual('${t.staffCode}')">
            </td>
            <td class="text-right" style="background: #eef2ff;">
                <input type="number" step="0.1" class="form-control text-right" 
                    style="width: 100px; font-weight: 800; color: #3730a3; margin-left: auto;" 
                    value="${totalHours.toFixed(2)}" 
                    id="total-${t.staffCode}"
                    oninput="previewTotalHoursChange('${t.staffCode}', ${wage})"
                    onchange="saveStaffHoursManual('${t.staffCode}')"
                    title="Có thể sửa trực tiếp con số tổng giờ làm việc">
            </td>
            <td class="text-right">${formatVND(wage)}</td>
            <td class="text-right font-bold" id="proj-${t.staffCode}" style="color: var(--primary);">
                ${formatVND(projectedSalary)}
            </td>
            <td class="text-center" style="white-space: nowrap;">
                <button class="btn btn-primary btn-sm" onclick="saveStaffHoursManual('${t.staffCode}')" title="Lưu số giờ và cập nhật bảng lương">
                    💾 Lưu
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function previewHoursChange(staffCode, wage) {
    const monthKey = AppState.currentMonth;
    const list = AppState.timesheets[monthKey] || [];
    const item = list.find(t => (t.staffCode || "").toLowerCase().trim() === staffCode.toLowerCase().trim());
    if (!item) return;

    const extraInput = document.getElementById(`extra-${staffCode}`);
    const totalInput = document.getElementById(`total-${staffCode}`);
    const projEl = document.getElementById(`proj-${staffCode}`);

    const baseMachine = item.machineHours !== undefined ? item.machineHours : item.totalHours;
    const extraVal = parseFloat(extraInput?.value) || 0;
    const newTotal = Math.round((baseMachine + extraVal) * 100) / 100;

    if (totalInput) totalInput.value = newTotal.toFixed(2);
    if (projEl) projEl.textContent = formatVND(Math.round(newTotal * wage));
}

function previewTotalHoursChange(staffCode, wage) {
    const totalInput = document.getElementById(`total-${staffCode}`);
    const projEl = document.getElementById(`proj-${staffCode}`);
    const totalVal = parseFloat(totalInput?.value) || 0;
    if (projEl) projEl.textContent = formatVND(Math.round(totalVal * wage));
}

function saveStaffHoursManual(staffCode) {
    const monthKey = AppState.currentMonth;
    const list = AppState.timesheets[monthKey] || [];
    const item = list.find(t => (t.staffCode || "").toLowerCase().trim() === staffCode.toLowerCase().trim());
    if (!item) return;

    const extraInput = document.getElementById(`extra-${staffCode}`);
    const noteInput = document.getElementById(`note-${staffCode}`);
    const totalInput = document.getElementById(`total-${staffCode}`);

    const extraHours = parseFloat(extraInput?.value) || 0;
    const extraNote = noteInput?.value.trim() || "";
    const totalHours = parseFloat(totalInput?.value) || 0;

    item.extraHours = extraHours;
    item.extraNote = extraNote;
    item.totalHours = totalHours;

    saveStateToStorage("timesheets");
    calculateMonthlyPayroll(monthKey);

    // Đồng bộ lên backend API và ghi file Desktop Excel
    fetch('/api/timesheets/update-extra-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            month: monthKey,
            staffCode: staffCode,
            extraHours: extraHours,
            extraNote: extraNote,
            totalHours: totalHours
        })
    }).then(res => res.json()).then(data => {
        showToast(`Đã lưu giờ làm của ${item.staffName || staffCode} (${totalHours.toFixed(2)}h) & cập nhật trực tiếp vào file Desktop!`, "success");
    }).catch(() => {
        showToast(`Đã lưu giờ làm của ${item.staffName || staffCode} vào bộ nhớ.`, "info");
    });
}

function syncDesktopExcel() {
    showToast("Đang đồng bộ dữ liệu vào file Calcul Salaire.xlsx trên Desktop...", "info");
    fetch('/api/desktop/sync-excel', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast("✅ ĐÃ GHI ĐÈ THÀNH CÔNG VÀO FILE Calcul Salaire.xlsx TRÊN DESKTOP!", "success");
            } else {
                showToast("Lỗi khi ghi file Desktop: " + data.error, "error");
            }
        })
        .catch(err => {
            showToast("Đang chạy chế độ Standalone. Bấm 'Xuất Excel' để tải file về.", "warning");
        });
}

async function syncWithBackendServer() {
    try {
        const res = await fetch('/api/data');
        if (res.ok) {
            const data = await res.json();
            if (data && data.payrolls) {
                AppState.employees = data.employees || AppState.employees;
                AppState.payrolls = data.payrolls || AppState.payrolls;
                AppState.timesheets = data.timesheets || AppState.timesheets;
                AppState.bonuses = data.bonuses || AppState.bonuses;
                AppState.penalties = data.penalties || AppState.penalties;
                AppState.advances = data.advances || AppState.advances;
                AppState.deposits = data.deposits || AppState.deposits;
                AppState.attendanceLadder = data.attendanceLadder || AppState.attendanceLadder;
                renderDashboard();
                renderPayrollTable();
                renderEmployeesTable();
                renderLoadedTimesheetTable();
            }
        }
    } catch (e) {
        // running standalone
    }
}

// ==========================================================================
// RENDER GIAO DIỆN & BẢNG BIỂU
// ==========================================================================

function populateMonthSelector() {
    const selector = document.getElementById("month-selector");
    if (!selector) return;
    selector.innerHTML = "";
    AppState.availableMonths.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = `Tháng ${m.split("-")[1]}/${m.split("-")[0]}`;
        if (m === AppState.currentMonth) opt.selected = true;
        selector.appendChild(opt);
    });
}

function renderDashboard() {
    const monthKey = AppState.currentMonth;
    const payroll = AppState.payrolls[monthKey] || [];

    let totalPayroll = 0;
    let totalHours = 0;
    let totalBonus = 0;
    let totalPenalty = 0;
    let totalAdvance = 0;
    let staffCount = 0;

    let cs1Total = 0, cs1Hours = 0, cs1Count = 0;
    let cs2Total = 0, cs2Hours = 0, cs2Count = 0;
    let cs3Total = 0, cs3Hours = 0, cs3Count = 0;

    payroll.forEach(p => {
        totalPayroll += (p.total || 0);
        totalHours += (p.hours || 0);
        totalBonus += (p.bonus || 0);
        totalPenalty += (p.penalty || 0);
        totalAdvance += (p.advance || 0);
        if (p.hours > 0 || p.total > 0) staffCount++;

        if (p.branch === "CS1") {
            cs1Total += (p.total || 0);
            cs1Hours += (p.hours || 0);
            cs1Count++;
        } else if (p.branch === "CS2") {
            cs2Total += (p.total || 0);
            cs2Hours += (p.hours || 0);
            cs2Count++;
        } else if (p.branch === "CS3") {
            cs3Total += (p.total || 0);
            cs3Hours += (p.hours || 0);
            cs3Count++;
        }
    });

    const elTotalPayroll = document.getElementById("stat-total-payroll");
    const elTotalHours = document.getElementById("stat-total-hours");
    const elTotalBonus = document.getElementById("stat-total-bonus");
    const elTotalAdvance = document.getElementById("stat-total-advance");
    const elTotalPenalty = document.getElementById("stat-total-penalty");
    const elStaffCount = document.getElementById("stat-staff-count");

    if (elTotalPayroll) elTotalPayroll.textContent = formatVND(totalPayroll);
    if (elTotalHours) elTotalHours.textContent = `${totalHours.toFixed(1)}h (${formatHours(totalHours)})`;
    if (elTotalBonus) elTotalBonus.textContent = formatVND(totalBonus);
    if (elTotalAdvance) elTotalAdvance.textContent = formatVND(totalAdvance);
    if (elTotalPenalty) elTotalPenalty.textContent = formatVND(totalPenalty);
    if (elStaffCount) elStaffCount.textContent = staffCount;

    // Cập nhật thẻ Cơ sở CS1, CS2, CS3
    const elCs1Total = document.getElementById("cs1-total");
    const elCs1Hours = document.getElementById("cs1-hours");
    const elCs1Count = document.getElementById("cs1-count");
    if (elCs1Total) elCs1Total.textContent = formatVND(cs1Total);
    if (elCs1Hours) elCs1Hours.textContent = `${cs1Hours.toFixed(1)}h`;
    if (elCs1Count) elCs1Count.textContent = `${cs1Count} NV`;

    const elCs2Total = document.getElementById("cs2-total");
    const elCs2Hours = document.getElementById("cs2-hours");
    const elCs2Count = document.getElementById("cs2-count");
    if (elCs2Total) elCs2Total.textContent = formatVND(cs2Total);
    if (elCs2Hours) elCs2Hours.textContent = `${cs2Hours.toFixed(1)}h`;
    if (elCs2Count) elCs2Count.textContent = `${cs2Count} NV`;

    const elCs3Total = document.getElementById("cs3-total");
    const elCs3Hours = document.getElementById("cs3-hours");
    const elCs3Count = document.getElementById("cs3-count");
    if (elCs3Total) elCs3Total.textContent = formatVND(cs3Total);
    if (elCs3Hours) elCs3Hours.textContent = `${cs3Hours.toFixed(1)}h`;
    if (elCs3Count) elCs3Count.textContent = `${cs3Count} NV`;
}

function renderPayrollTable() {
    const tbody = document.getElementById("payroll-table-body");
    const tfoot = document.getElementById("payroll-table-foot");
    if (!tbody) return;

    const monthKey = AppState.currentMonth;
    let payroll = AppState.payrolls[monthKey] || [];

    // Bộ lọc cơ sở & tìm kiếm
    const searchVal = (document.getElementById("payroll-search")?.value || "").toLowerCase().trim();
    const branchVal = document.getElementById("payroll-branch-filter")?.value || "all";

    if (branchVal !== "all") {
        payroll = payroll.filter(p => p.branch === branchVal);
    }
    if (searchVal) {
        payroll = payroll.filter(p =>
            (p.name && p.name.toLowerCase().includes(searchVal)) ||
            (p.code && p.code.toLowerCase().includes(searchVal)) ||
            (p.bankAccount && p.bankAccount.includes(searchVal))
        );
    }

    tbody.innerHTML = "";

    if (payroll.length === 0) {
        tbody.innerHTML = `<tr><td colspan="15" class="text-center" style="padding: 2.5rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📂</div>
            Chưa có dữ liệu bảng lương tháng này hoặc không khớp với bộ lọc.<br>
            Hãy nhấn <strong>"⚡ Tự Động Tính Lương"</strong> hoặc <strong>"Nhập Công Cuối Tháng"</strong> để tạo bảng lương.
        </td></tr>`;
        if (tfoot) tfoot.innerHTML = "";
        return;
    }

    let sumHours = 0, sumBase = 0, sumAdvance = 0, sumPenalty = 0, sumBalance = 0, sumDeposit = 0, sumBonus = 0, sumTotal = 0;

    payroll.forEach((p, idx) => {
        sumHours += (p.hours || 0);
        sumBase += (p.baseSalary || 0);
        sumAdvance += (p.advance || 0);
        sumPenalty += (p.penalty || 0);
        sumBalance += (p.balance || 0);
        sumDeposit += (p.deposit || 0);
        sumBonus += (p.bonus || 0);
        sumTotal += (p.total || 0);

        const branchClass = p.branch === "CS1" ? "badge-cs1" : (p.branch === "CS2" ? "badge-cs2" : "badge-cs3");
        const statusClass = p.isTransferred ? "transferred" : "pending";
        const statusText = p.isTransferred ? "✓ Đã CK" : "Chưa CK";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center font-bold text-muted">${idx + 1}</td>
            <td><span class="badge ${branchClass}">${p.branch}</span></td>
            <td>
                <div style="font-weight: 700;">${p.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${p.code}</div>
            </td>
            <td class="text-right">
                <div style="font-weight: 700;">${p.hours.toFixed(2)}h</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${formatHours(p.hours)}</div>
            </td>
            <td class="text-right" style="color: var(--text-muted);">${formatVND(p.wage)}</td>
            <td class="text-right" style="font-weight: 600;">${formatVND(p.baseSalary)}</td>
            <td class="text-right" style="color: ${p.advance > 0 ? 'var(--danger)' : 'var(--text-muted)'};">
                ${p.advance > 0 ? '-' + formatVND(p.advance) : '-'}
            </td>
            <td class="text-right" style="color: ${p.penalty > 0 ? 'var(--danger)' : 'var(--text-muted)'};">
                ${p.penalty > 0 ? '-' + formatVND(p.penalty) : '-'}
            </td>
            <td class="text-right" style="font-weight: 600;">${formatVND(p.balance)}</td>
            <td class="text-right" style="color: ${p.deposit > 0 ? 'var(--success)' : (p.deposit < 0 ? 'var(--danger)' : 'var(--text-muted)')}; font-weight: 600;">
                ${p.deposit !== 0 ? (p.deposit > 0 ? '+' : '') + formatVND(p.deposit) : '-'}
            </td>
            <td class="text-right" style="color: var(--success); font-weight: 700;">
                ${p.bonus > 0 ? '+' + formatVND(p.bonus) : '-'}
            </td>
            <td class="text-right" style="font-weight: 800; font-size: 0.98rem; color: #b45309; background: #fffbeb;">
                ${formatVND(p.total)}
            </td>
            <td>
                <div style="font-weight: 600; font-size: 0.8rem;">${p.bankName}</div>
                <div style="font-family: monospace; font-size: 0.75rem; color: var(--primary);">${p.bankAccount}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${p.accountHolder}</div>
            </td>
            <td class="text-center">
                <button class="status-btn ${statusClass}" onclick="toggleTransferStatus('${p.code}')" title="Bấm để đổi trạng thái">
                    ${statusText}
                </button>
            </td>
            <td class="text-center" style="white-space: nowrap;">
                <button class="btn btn-outline btn-sm" onclick="openVietQRModal('${p.code}')" title="Mã VietQR chuyển khoản">
                    📱 QR
                </button>
                <button class="btn btn-outline btn-sm" onclick="openPayslipModal('${p.code}')" title="In phiếu lương">
                    📄 Phiếu
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (tfoot) {
        tfoot.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">TỔNG CỘNG (${payroll.length} NV)</td>
                <td class="text-right">${sumHours.toFixed(2)}h</td>
                <td></td>
                <td class="text-right">${formatVND(sumBase)}</td>
                <td class="text-right" style="color: var(--danger);">${sumAdvance > 0 ? '-' + formatVND(sumAdvance) : '-'}</td>
                <td class="text-right" style="color: var(--danger);">${sumPenalty > 0 ? '-' + formatVND(sumPenalty) : '-'}</td>
                <td class="text-right">${formatVND(sumBalance)}</td>
                <td class="text-right" style="color: var(--info);">${sumDeposit !== 0 ? formatVND(sumDeposit) : '-'}</td>
                <td class="text-right" style="color: var(--success);">${sumBonus > 0 ? '+' + formatVND(sumBonus) : '-'}</td>
                <td class="text-right" style="color: #b45309; font-size: 1.05rem;">${formatVND(sumTotal)}</td>
                <td colspan="3"></td>
            </tr>
        `;
    }

    // Render Mobile Cards Container (Giao diện thẻ tối ưu cho iPhone)
    const cardsContainer = document.getElementById("payroll-cards-container");
    if (cardsContainer) {
        cardsContainer.innerHTML = "";
        payroll.forEach(p => {
            const branchClass = p.branch === "CS1" ? "badge-cs1" : (p.branch === "CS2" ? "badge-cs2" : "badge-cs3");
            const branchColorClass = p.branch.toLowerCase();
            const statusClass = p.isTransferred ? "transferred" : "pending";
            const statusText = p.isTransferred ? "✓ Đã Chuyển Khoản" : "⏳ Chưa Chuyển";

            // Initials cho Avatar
            const nameParts = (p.name || p.code).trim().split(/\s+/);
            const initials = nameParts.length >= 2 ? 
                (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : 
                (p.name || p.code).substring(0, 2).toUpperCase();

            const card = document.createElement("div");
            card.className = "payroll-mobile-card";
            card.innerHTML = `
                <div class="pmc-header">
                    <div class="pmc-avatar-info">
                        <div class="pmc-avatar ${branchColorClass}">${initials}</div>
                        <div>
                            <div class="pmc-name">${p.name}</div>
                            <div class="pmc-sub">
                                <span class="badge ${branchClass}">${p.branch}</span>
                                <span>${p.code}</span>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="pmc-transfer-pill ${statusClass}" onclick="toggleTransferStatus('${p.code}')">
                        ${statusText}
                    </button>
                </div>

                <div class="pmc-stats-grid">
                    <div class="pmc-stat-item">
                        <span>Giờ làm:</span>
                        <strong>${p.hours.toFixed(1)}h (${formatVND(p.wage)}/h)</strong>
                    </div>
                    <div class="pmc-stat-item">
                        <span>Lương giờ cơ bản:</span>
                        <strong>${formatVND(p.baseSalary)}</strong>
                    </div>
                    <div class="pmc-stat-item">
                        <span>Thưởng & phụ cấp:</span>
                        <strong style="color: #16a34a;">+${formatVND(p.bonus)}</strong>
                    </div>
                    <div class="pmc-stat-item">
                        <span>Ứng & phạt:</span>
                        <strong style="color: ${p.advance + p.penalty > 0 ? '#dc2626' : '#64748b'};">
                            ${p.advance + p.penalty > 0 ? '-' + formatVND(p.advance + p.penalty) : '0 đ'}
                        </strong>
                    </div>
                </div>

                <div class="pmc-total-row">
                    <span class="pmc-total-label">THỰC NHẬN (Tổng cuối):</span>
                    <span class="pmc-total-amount">${formatVND(p.total)}</span>
                </div>

                <div class="pmc-actions">
                    <button type="button" class="pmc-btn pmc-btn-qr" onclick="openVietQRModal('${p.code}')">
                        📱 Quét VietQR
                    </button>
                    <button type="button" class="pmc-btn pmc-btn-slip" onclick="openPayslipModal('${p.code}')">
                        📄 Phiếu Lương
                    </button>
                </div>

                <details class="pmc-details-collapse">
                    <summary>Xem chi tiết thưởng, cọc áo & ngân hàng ▾</summary>
                    <div style="margin-top: 0.5rem; line-height: 1.6;">
                        <div>🏦 <strong>Ngân hàng:</strong> ${p.bankName || 'Chưa cập nhật'}</div>
                        <div>💳 <strong>STK:</strong> <code style="font-size:0.85rem; color:#4338ca;">${p.bankAccount || 'Chưa có'}</code></div>
                        <div>👤 <strong>Chủ TK:</strong> ${p.accountHolder || p.name}</div>
                        <div style="margin-top: 0.35rem; padding-top: 0.35rem; border-top: 1px dashed #e2e8f0;">
                            <div>• Chuyên cần: ${formatVND(p.details?.attendanceBonus || 0)}</div>
                            <div>• Sinh nhật / Thâm niên: ${formatVND(p.details?.birthdayBonus || 0)}</div>
                            <div>• Cọc áo / BHXH: ${p.deposit !== 0 ? (p.deposit > 0 ? '+' : '') + formatVND(p.deposit) : '0 đ'}</div>
                        </div>
                    </div>
                </details>
            `;
            cardsContainer.appendChild(card);
        });
    }
}

function setPayrollViewMode(mode) {
    const tableCard = document.getElementById("payroll-table-card");
    const cardsGrid = document.getElementById("payroll-cards-container");
    const btnCards = document.getElementById("btn-view-cards");
    const btnTable = document.getElementById("btn-view-table");

    if (mode === 'cards') {
        if (tableCard) tableCard.classList.add("hide-on-mobile");
        if (cardsGrid) cardsGrid.style.display = "grid";
        if (btnCards) btnCards.classList.add("active");
        if (btnTable) btnTable.classList.remove("active");
    } else {
        if (tableCard) tableCard.classList.remove("hide-on-mobile");
        if (cardsGrid) cardsGrid.style.display = "none";
        if (btnCards) btnCards.classList.remove("active");
        if (btnTable) btnTable.classList.add("active");
    }
    localStorage.setItem("payroll_view_mode", mode);
}

function toggleTransferStatus(staffCode) {
    const monthKey = AppState.currentMonth;
    const payroll = AppState.payrolls[monthKey] || [];
    const item = payroll.find(p => p.code.toLowerCase().trim() === staffCode.toLowerCase().trim());
    if (item) {
        item.isTransferred = !item.isTransferred;
        saveStateToStorage("payrolls");
        renderPayrollTable();
        showToast(`Đã cập nhật trạng thái thanh toán cho ${item.name}`, "info");
    }
}

// ==========================================================================
// QUẢN LÝ HỒ SƠ NHÂN VIÊN
// ==========================================================================

function renderEmployeesTable() {
    const tbody = document.getElementById("employees-table-body");
    if (!tbody) return;

    const badge = document.getElementById("badge-emp-count");
    if (badge) {
        badge.textContent = AppState.employees.filter(e => e.status === "active").length;
    }

    const filterStatus = document.getElementById("emp-status-filter")?.value || "active";
    const filterBranch = document.getElementById("emp-branch-filter")?.value || "all";
    const searchVal = (document.getElementById("emp-search")?.value || "").toLowerCase().trim();

    let list = AppState.employees.filter(e => {
        if (filterStatus !== "all" && e.status !== filterStatus) return false;
        if (filterBranch !== "all" && e.branch !== filterBranch) return false;
        if (searchVal) {
            const matchName = (e.name || "").toLowerCase().includes(searchVal);
            const matchCode = (e.code || "").toLowerCase().includes(searchVal);
            const matchPhone = (e.phone || "").includes(searchVal);
            const matchBank = (e.bankAccount || "").includes(searchVal);
            if (!matchName && !matchCode && !matchPhone && !matchBank) return false;
        }
        return true;
    });

    const sortVal = document.getElementById("emp-sort-select")?.value || "tenure-desc";
    list.sort((a, b) => {
        if (sortVal === "tenure-desc") {
            const tA = parseFloat(a.tenureMonths) || 0;
            const tB = parseFloat(b.tenureMonths) || 0;
            if (tB !== tA) return tB - tA;
            return (a.startDate || "").localeCompare(b.startDate || "");
        } else if (sortVal === "tenure-asc") {
            const tA = parseFloat(a.tenureMonths) || 0;
            const tB = parseFloat(b.tenureMonths) || 0;
            if (tA !== tB) return tA - tB;
            return (a.startDate || "").localeCompare(b.startDate || "");
        } else if (sortVal === "name-asc") {
            return (a.name || "").localeCompare(b.name || "", "vi");
        } else if (sortVal === "wage-desc") {
            return (b.hourlyWage || 0) - (a.hourlyWage || 0);
        } else if (sortVal === "branch-asc") {
            return (a.branch || "").localeCompare(b.branch || "");
        }
        return 0;
    });

    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding: 2rem; color: var(--text-muted);">Không tìm thấy nhân viên phù hợp</td></tr>`;
        return;
    }

    list.forEach((emp, idx) => {
        const branchClass = emp.branch === "CS1" ? "badge-cs1" : (emp.branch === "CS2" ? "badge-cs2" : "badge-cs3");
        const statusBadge = emp.status === "active" ? '<span class="badge badge-success">Đang làm việc</span>' : '<span class="badge badge-secondary">Đã nghỉ việc</span>';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center">${idx + 1}</td>
            <td><span class="badge ${branchClass}">${emp.branch || 'CS1'}</span></td>
            <td>
                <div style="font-weight: 700;">${emp.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${emp.code}</div>
            </td>
            <td class="text-right font-bold" style="color: var(--primary);">${formatVND(emp.hourlyWage)}/h</td>
            <td>
                <div>${emp.startDate || '-'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${emp.tenureMonths ? emp.tenureMonths.toFixed(1) + ' tháng' : '-'}</div>
            </td>
            <td>
                <div>${emp.phone || '-'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">SN: ${emp.birthDate || '-'}</div>
            </td>
            <td>
                <div style="font-weight: 600;">${emp.bankName || '-'}</div>
                <div style="font-family: monospace; font-size: 0.78rem;">${emp.bankAccount || '-'}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${emp.accountHolder || ''}</div>
            </td>
            <td>${statusBadge}</td>
            <td style="font-size: 0.78rem; max-width: 200px; color: var(--text-muted);">
                ${emp.status === 'retired' ? (emp.retireReason || 'Nghỉ việc') : (emp.note || (emp.cooptedBy ? 'GT bởi ' + emp.cooptedBy : '-'))}
            </td>
            <td class="text-center" style="white-space: nowrap;">
                <button class="btn btn-outline btn-sm" onclick="openEditEmployeeModal('${emp.id}')" title="Sửa thông tin">✏️</button>
                <button class="btn btn-outline btn-sm" onclick="toggleEmployeeStatus('${emp.id}')" title="${emp.status === 'active' ? 'Đánh dấu nghỉ việc' : 'Kích hoạt lại'}">
                    ${emp.status === 'active' ? '🚪' : '🔄'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openEditEmployeeModal(empId) {
    const emp = AppState.employees.find(e => e.id === empId);
    if (!emp) return;

    document.getElementById("emp-modal-id").value = emp.id;
    document.getElementById("emp-modal-name").value = emp.name;
    document.getElementById("emp-modal-code").value = emp.code;
    document.getElementById("emp-modal-branch").value = emp.branch;
    document.getElementById("emp-modal-wage").value = emp.hourlyWage;
    document.getElementById("emp-modal-start").value = emp.startDate || "";
    document.getElementById("emp-modal-birth").value = emp.birthDate || "";
    document.getElementById("emp-modal-phone").value = emp.phone || "";
    document.getElementById("emp-modal-bank").value = emp.bankName || "";
    document.getElementById("emp-modal-stk").value = emp.bankAccount || "";
    document.getElementById("emp-modal-holder").value = emp.accountHolder || "";
    document.getElementById("emp-modal-note").value = emp.note || "";
    document.getElementById("emp-modal-status").value = emp.status || "active";

    document.getElementById("employee-modal-title").textContent = `Chỉnh Sửa Nhân Viên: ${emp.name}`;
    openModal("employee-modal");
}

function openAddEmployeeModal() {
    document.getElementById("emp-modal-id").value = "";
    document.getElementById("emp-modal-name").value = "";
    document.getElementById("emp-modal-code").value = "";
    document.getElementById("emp-modal-branch").value = "CS1";
    document.getElementById("emp-modal-wage").value = "20000";
    document.getElementById("emp-modal-start").value = new Date().toISOString().split("T")[0];
    document.getElementById("emp-modal-birth").value = "";
    document.getElementById("emp-modal-phone").value = "";
    document.getElementById("emp-modal-bank").value = "MB";
    document.getElementById("emp-modal-stk").value = "";
    document.getElementById("emp-modal-holder").value = "";
    document.getElementById("emp-modal-note").value = "";
    document.getElementById("emp-modal-status").value = "active";

    document.getElementById("employee-modal-title").textContent = "Thêm Nhân Viên Mới";
    openModal("employee-modal");
}

function saveEmployeeForm(e) {
    if (e) e.preventDefault();
    const id = document.getElementById("emp-modal-id").value;
    const name = document.getElementById("emp-modal-name").value.trim();
    const code = document.getElementById("emp-modal-code").value.trim();
    const branch = document.getElementById("emp-modal-branch").value;
    const hourlyWage = parseFloat(document.getElementById("emp-modal-wage").value) || 0;
    const startDate = document.getElementById("emp-modal-start").value;
    const birthDate = document.getElementById("emp-modal-birth").value;
    const phone = document.getElementById("emp-modal-phone").value.trim();
    const bankName = document.getElementById("emp-modal-bank").value.trim();
    const bankAccount = document.getElementById("emp-modal-stk").value.trim();
    const accountHolder = document.getElementById("emp-modal-holder").value.trim();
    const note = document.getElementById("emp-modal-note").value.trim();
    const status = document.getElementById("emp-modal-status").value;

    if (!name || !code) {
        alert("Vui lòng điền Họ tên và Tên chấm công!");
        return;
    }

    if (id) {
        // Cập nhật
        const idx = AppState.employees.findIndex(e => e.id === id);
        if (idx !== -1) {
            AppState.employees[idx] = {
                ...AppState.employees[idx],
                name, code, branch, hourlyWage, startDate, birthDate, phone, bankName, bankAccount, accountHolder, note, status
            };
            showToast(`Đã cập nhật nhân viên ${name}!`, "success");
        }
    } else {
        // Thêm mới
        const newEmp = {
            id: "NV-" + Date.now().toString(36),
            machineCode: "",
            code, name, branch, hourlyWage, startDate, birthDate, phone,
            zalo: phone, bankName, bankAccount, accountHolder: accountHolder || name,
            idCard: "", address: "", uniformCount: 2, uniformDepositMonth: "",
            status, note, cooptedBy: "", salaryHistory: []
        };
        AppState.employees.unshift(newEmp);
        showToast(`Đã thêm nhân viên mới ${name}!`, "success");
    }

    saveStateToStorage("employees");
    closeModal("employee-modal");
    renderEmployeesTable();
}

function toggleEmployeeStatus(empId) {
    const emp = AppState.employees.find(e => e.id === empId);
    if (!emp) return;

    if (emp.status === "active") {
        const reason = prompt(`Nhập lý do nhân viên "${emp.name}" nghỉ việc:`, "Tự xin nghỉ việc");
        if (reason !== null) {
            emp.status = "retired";
            emp.retireReason = reason;
            emp.endDate = new Date().toISOString().split("T")[0];
            saveStateToStorage("employees");
            renderEmployeesTable();
            showToast(`Đã chuyển nhân viên ${emp.name} sang danh sách nghỉ việc.`, "info");
        }
    } else {
        if (confirm(`Bạn muốn kích hoạt lại nhân viên "${emp.name}" vào làm việc?`)) {
            emp.status = "active";
            delete emp.retireReason;
            delete emp.endDate;
            saveStateToStorage("employees");
            renderEmployeesTable();
            showToast(`Đã kích hoạt lại nhân viên ${emp.name}.`, "success");
        }
    }
}

// ==========================================================================
// QUẢN LÝ THƯỞNG, PHẠT, ỨNG LƯƠNG, CỌC ÁO
// ==========================================================================

function renderBonusesTable() {
    const tbody = document.getElementById("bonuses-table-body");
    if (!tbody) return;
    const monthKey = AppState.currentMonth;
    const list = AppState.bonuses[monthKey] || [];

    tbody.innerHTML = "";
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 1.5rem; color: var(--text-muted);">Chưa có khoản thưởng nào trong tháng này.</td></tr>`;
        return;
    }

    list.forEach((b, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center">${idx + 1}</td>
            <td><span class="badge ${b.branch === 'CS1' ? 'badge-cs1' : (b.branch === 'CS2' ? 'badge-cs2' : 'badge-cs3')}">${b.branch}</span></td>
            <td class="font-bold">${b.staffName}</td>
            <td><span class="badge badge-warning">${getCategoryLabel(b.category)}</span></td>
            <td class="text-right font-bold text-success">+${formatVND(b.amount)}</td>
            <td style="color: var(--text-muted); font-size: 0.82rem;">${b.note || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function getCategoryLabel(cat) {
    const map = {
        "attendance": "Chuyên cần",
        "gasoline": "Xăng xe",
        "tourist_group": "Khách đoàn/Tiệc",
        "cooptation": "Giới thiệu NV",
        "birthday_loyalty": "Sinh nhật > 6T",
        "other": "Khác/Vệ sinh"
    };
    return map[cat] || "Thưởng khác";
}

function renderPenaltiesTable() {
    const tbody = document.getElementById("penalties-table-body");
    if (!tbody) return;
    const monthKey = AppState.currentMonth;
    const list = AppState.penalties[monthKey] || [];

    tbody.innerHTML = "";
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 1.5rem; color: var(--text-muted);">Không có vi phạm kỉ luật trong tháng này.</td></tr>`;
        return;
    }

    list.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center">${idx + 1}</td>
            <td><span class="badge ${p.branch === 'CS1' ? 'badge-cs1' : (p.branch === 'CS2' ? 'badge-cs2' : 'badge-cs3')}">${p.branch}</span></td>
            <td class="font-bold">${p.staffName}</td>
            <td class="text-right font-bold text-danger">-${formatVND(p.amount)}</td>
            <td style="color: var(--text-muted); font-size: 0.82rem;">${p.date || '-'}</td>
            <td style="color: var(--danger); font-weight: 500;">${p.reason}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdvancesTable() {
    const tbody = document.getElementById("advances-table-body");
    if (!tbody) return;
    const monthKey = AppState.currentMonth;
    const list = AppState.advances[monthKey] || [];

    tbody.innerHTML = "";
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 1.5rem; color: var(--text-muted);">Không có tạm ứng lương trong tháng này.</td></tr>`;
        return;
    }

    list.forEach((a, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center">${idx + 1}</td>
            <td><span class="badge ${a.branch === 'CS1' ? 'badge-cs1' : (a.branch === 'CS2' ? 'badge-cs2' : 'badge-cs3')}">${a.branch}</span></td>
            <td class="font-bold">${a.staffName}</td>
            <td class="text-right font-bold text-danger">-${formatVND(a.amount)}</td>
            <td style="color: var(--text-muted); font-size: 0.82rem;">${a.date || '-'}</td>
            <td style="color: var(--text-muted); font-size: 0.82rem;">${a.note || 'Tạm ứng'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDepositsTable() {
    const tbody = document.getElementById("deposits-table-body");
    if (!tbody) return;
    const monthKey = AppState.currentMonth;
    const list = AppState.deposits[monthKey] || [];

    tbody.innerHTML = "";
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 1.5rem; color: var(--text-muted);">Không có ghi nhận cọc áo hoặc BHXH trong tháng này.</td></tr>`;
        return;
    }

    list.forEach((d, idx) => {
        const tr = document.createElement("tr");
        const isPositive = d.amount > 0;
        const typeLabel = d.type === "refund" ? '<span class="badge badge-success">Hoàn cọc</span>' : (d.type === "bhxh" ? '<span class="badge badge-warning">Nộp BHXH</span>' : '<span class="badge badge-danger">Thu cọc</span>');

        tr.innerHTML = `
            <td class="text-center">${idx + 1}</td>
            <td><span class="badge ${d.branch === 'CS1' ? 'badge-cs1' : (d.branch === 'CS2' ? 'badge-cs2' : 'badge-cs3')}">${d.branch}</span></td>
            <td class="font-bold">${d.staffName}</td>
            <td>${typeLabel}</td>
            <td class="text-right font-bold" style="color: ${isPositive ? 'var(--success)' : 'var(--danger)'};">
                ${isPositive ? '+' : ''}${formatVND(d.amount)}
            </td>
            <td style="color: var(--text-muted); font-size: 0.82rem;">${d.date || '-'}</td>
            <td style="color: var(--text-muted); font-size: 0.82rem;">${d.note}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAttendanceLadder() {
    const tbody = document.getElementById("ladder-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    AppState.attendanceLadder.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center font-bold">${idx + 1}</td>
            <td class="font-bold">${item.label || ('>= ' + item.minHours + ' giờ')}</td>
            <td class="text-right font-bold text-success">${formatVND(item.bonus)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// TIỆN ÍCH VIETQR THANH TOÁN CHUYỂN KHOẢN (NAPAS 24/7)
// ==========================================================================

function openVietQRModal(staffCode) {
    const monthKey = AppState.currentMonth;
    const payroll = AppState.payrolls[monthKey] || [];
    const item = payroll.find(p => p.code.toLowerCase().trim() === staffCode.toLowerCase().trim());
    if (!item) {
        showToast("Không tìm thấy thông tin nhân viên", "error");
        return;
    }

    const bankName = item.bankName || "MB";
    const bankCode = BANK_CODES[bankName.toUpperCase().replace(/\s+/g, '')] || "MB";
    const stk = (item.bankAccount || "").replace(/\s+/g, '');
    const amount = Math.max(0, item.total);
    const [year, month] = monthKey.split("-");
    const content = `CocoMeo Luong T${month} ${item.name.replace(/\s+/g, '')}`;
    const accountName = item.accountHolder || item.name;

    // VietQR quick URL
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${stk}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`;

    document.getElementById("vietqr-img").src = qrUrl;
    document.getElementById("vietqr-bank").textContent = bankName;
    document.getElementById("vietqr-stk").textContent = item.bankAccount || "Chưa có STK";
    document.getElementById("vietqr-holder").textContent = accountName;
    document.getElementById("vietqr-amount").textContent = formatVND(amount);
    document.getElementById("vietqr-content").textContent = content;

    const btnConfirm = document.getElementById("btn-vietqr-confirm");
    if (btnConfirm) {
        btnConfirm.onclick = () => {
            item.isTransferred = true;
            saveStateToStorage("payrolls");
            renderPayrollTable();
            closeModal("vietqr-modal");
            showToast(`Đã xác nhận chuyển khoản lương cho ${item.name}!`, "success");
        };
    }

    openModal("vietqr-modal");
}

function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Đã sao chép ${label || 'nội dung'}: ${text}`, "success");
    }).catch(() => {
        showToast(`Không thể sao chép tự động: ${text}`, "warning");
    });
}

// ==========================================================================
// IN PHIẾU LƯƠNG CÁ NHÂN (PAYSLIP)
// ==========================================================================

function openPayslipModal(staffCode) {
    const monthKey = AppState.currentMonth;
    const payroll = AppState.payrolls[monthKey] || [];
    const item = payroll.find(p => p.code.toLowerCase().trim() === staffCode.toLowerCase().trim());
    if (!item) {
        showToast("Không tìm thấy thông tin nhân viên", "error");
        return;
    }

    const [year, month] = monthKey.split("-");
    const container = document.getElementById("payslip-content");
    if (!container) return;

    container.innerHTML = `
        <div class="payslip-header">
            <div class="payslip-brand">🐾 COCOMEO CAT COFFEE</div>
            <div class="payslip-title">PHIẾU LƯƠNG NHÂN VIÊN</div>
            <div class="payslip-subtitle">Kỳ lương: Tháng ${month} năm ${year} (Cơ sở: ${item.branch})</div>
        </div>

        <div class="payslip-info-grid">
            <div><strong>Họ và tên:</strong> ${item.name}</div>
            <div><strong>Mã chấm công:</strong> ${item.code}</div>
            <div><strong>Ngân hàng:</strong> ${item.bankName}</div>
            <div><strong>Số tài khoản:</strong> ${item.bankAccount}</div>
            <div><strong>Chủ tài khoản:</strong> ${item.accountHolder}</div>
            <div><strong>Ngày xuất phiếu:</strong> ${new Date().toLocaleDateString('vi-VN')}</div>
        </div>

        <table class="payslip-table">
            <thead>
                <tr>
                    <th>Khoản mục</th>
                    <th class="text-right">Số lượng / Tỷ lệ</th>
                    <th class="text-right">Thành tiền (VND)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Lương theo giờ</strong></td>
                    <td class="text-right">${item.hours.toFixed(2)}h (${formatHours(item.hours)}) × ${formatVND(item.wage)}/h</td>
                    <td class="text-right font-bold">${formatVND(item.baseSalary)}</td>
                </tr>
                <tr>
                    <td style="color: var(--success);"><strong>Tổng Thưởng & Phụ phí</strong></td>
                    <td class="text-right" style="color: var(--text-muted); font-size: 0.78rem;">Chuyên cần, xăng xe, khách đoàn, SN...</td>
                    <td class="text-right text-success font-bold">+${formatVND(item.bonus)}</td>
                </tr>
                <tr>
                    <td style="color: var(--danger);"><strong>Tạm ứng lương</strong></td>
                    <td class="text-right" style="color: var(--text-muted); font-size: 0.78rem;">Đã ứng trong tháng</td>
                    <td class="text-right text-danger font-bold">-${formatVND(item.advance)}</td>
                </tr>
                <tr>
                    <td style="color: var(--danger);"><strong>Phạt kỉ luật</strong></td>
                    <td class="text-right" style="color: var(--text-muted); font-size: 0.78rem;">Vi phạm ca, chơi điện thoại...</td>
                    <td class="text-right text-danger font-bold">-${formatVND(item.penalty)}</td>
                </tr>
                <tr>
                    <td><strong>Cọc áo đồng phục & BHXH</strong></td>
                    <td class="text-right" style="color: var(--text-muted); font-size: 0.78rem;">Thu / hoàn cọc / BHXH</td>
                    <td class="text-right font-bold" style="color: ${item.deposit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${item.deposit >= 0 ? '+' : ''}${formatVND(item.deposit)}
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="payslip-total-box">
            <span>TỔNG THỰC NHẬN:</span>
            <span>${formatVND(item.total)}</span>
        </div>

        <div class="payslip-footer">
            <p>Mọi thắc mắc về công và lương vui lòng liên hệ quản lý trong vòng 48h kể từ khi nhận phiếu.</p>
            <p style="margin-top: 0.25rem;">Cảm ơn bạn đã luôn đồng hành cùng gia đình mèo CocoMeo! 🐱</p>
        </div>
    `;

    openModal("payslip-modal");
}

function printCurrentPayslip() {
    window.print();
}

// ==========================================================================
// XUẤT FILE EXCEL & CSV (EXPORT)
// ==========================================================================

function exportPayrollToExcel() {
    const monthKey = AppState.currentMonth;
    const payroll = AppState.payrolls[monthKey] || [];
    if (payroll.length === 0) {
        showToast("Chưa có dữ liệu bảng lương để xuất Excel!", "warning");
        return;
    }

    if (typeof XLSX === "undefined") {
        showToast("Đang tải thư viện Excel, vui lòng thử lại sau vài giây...", "warning");
        return;
    }

    const rows = [
        ["BẢNG TỔNG HỢP LƯƠNG NHÂN VIÊN COCOMEO", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [`Kỳ lương: Tháng ${monthKey.split('-')[1]}/${monthKey.split('-')[0]}`, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [""],
        [
            "STT", "Cơ sở", "Tên nhân viên", "Mã chấm công", "Tổng giờ làm", "Giờ HH:MM:SS",
            "Lương/giờ", "Total Initial (Lương giờ)", "Đã ứng", "Phạt vi phạm", "Còn lại",
            "Cọc áo / BHXH", "Thưởng & Phụ phí", "TỔNG CUỐI (Thực nhận)", "Ngân hàng", "Số tài khoản", "Tên tài khoản", "Trạng thái CK"
        ]
    ];

    payroll.forEach((p, idx) => {
        rows.push([
            idx + 1,
            p.branch,
            p.name,
            p.code,
            p.hours,
            formatHours(p.hours),
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
            p.isTransferred ? "Đã chuyển khoản" : "Chưa chuyển khoản"
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BangLuong");
    XLSX.writeFile(wb, `CocoMeo_BangLuong_${monthKey}.xlsx`);
    showToast(`Đã xuất file Excel bảng lương ${monthKey} thành công!`, "success");
}

function exportEmployeesToExcel() {
    if (typeof XLSX === "undefined") return;

    const rows = [
        ["DANH SÁCH NHÂN SỰ COCOMEO", "", "", "", "", "", "", "", "", ""],
        [""],
        ["STT", "Cơ sở", "Tên nhân viên", "Tên chấm công", "Mức lương/giờ", "Ngày vào làm", "Thâm niên (tháng)", "Ngày sinh", "Số điện thoại", "Ngân hàng", "Số tài khoản", "Tên tài khoản", "Trạng thái", "Ghi chú"]
    ];

    AppState.employees.forEach((e, idx) => {
        rows.push([
            idx + 1,
            e.branch,
            e.name,
            e.code,
            e.hourlyWage,
            e.startDate,
            e.tenureMonths,
            e.birthDate,
            e.phone,
            e.bankName,
            e.bankAccount,
            e.accountHolder,
            e.status === "active" ? "Đang làm việc" : "Đã nghỉ việc",
            e.status === "retired" ? (e.retireReason || "") : (e.note || "")
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NhanSu");
    XLSX.writeFile(wb, `CocoMeo_DanhSachNhanSu.xlsx`);
    showToast("Đã xuất danh sách nhân sự thành công!", "success");
}

// ==========================================================================
// BẢNG TỔNG HỢP & XẾP HẠNG THÂM NIÊN NHÂN VIÊN ĐANG LÀM VIỆC
// ==========================================================================

function formatTenureText(months) {
    if (!months && months !== 0) return "-";
    const total = Math.round(months * 10) / 10;
    const y = Math.floor(total / 12);
    const m = Math.round((total % 12) * 10) / 10;
    if (y > 0 && m > 0) return `${y} năm ${m} tháng`;
    if (y > 0 && m === 0) return `${y} năm`;
    return `${m} tháng`;
}

function getTenureTierBadge(months) {
    const m = parseFloat(months) || 0;
    if (m >= 24) {
        return '<span class="badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 700;">🌟 Lão làng (≥ 2 năm)</span>';
    } else if (m >= 12) {
        return '<span class="badge" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700;">💎 Nòng cốt (1–2 năm)</span>';
    } else if (m >= 6) {
        return '<span class="badge" style="background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; font-weight: 600;">🚀 Vững vàng (6T–1N)</span>';
    } else {
        return '<span class="badge" style="background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;">🌱 Thử việc / Mới (< 6T)</span>';
    }
}

function openSeniorityModal() {
    openModal("seniority-modal");
    renderSeniorityModalTable();
}

function renderSeniorityModalTable() {
    const tbody = document.getElementById("seniority-table-body");
    if (!tbody) return;

    // Lấy toàn bộ nhân viên đang làm việc (active)
    const activeEmployees = AppState.employees.filter(e => e.status === "active" || (!e.endDate && e.status !== "retired"));

    const statTotalEl = document.getElementById("seniority-stat-total");
    if (statTotalEl) statTotalEl.textContent = `${activeEmployees.length} nhân sự`;

    // Sắp xếp theo thứ tự lớn xuống thấp
    activeEmployees.sort((a, b) => {
        const tA = parseFloat(a.tenureMonths) || 0;
        const tB = parseFloat(b.tenureMonths) || 0;
        if (tB !== tA) return tB - tA;
        return (a.startDate || "").localeCompare(b.startDate || "");
    });

    const searchVal = (document.getElementById("seniority-search")?.value || "").toLowerCase().trim();
    const branchVal = document.getElementById("seniority-branch-filter")?.value || "all";

    const filtered = activeEmployees.filter((e, idx) => {
        // Lưu thứ hạng tổng thể trước khi lọc
        e._overallRank = idx + 1;
        if (branchVal !== "all" && e.branch !== branchVal) return false;
        if (searchVal) {
            const matchName = (e.name || "").toLowerCase().includes(searchVal);
            const matchCode = (e.code || "").toLowerCase().includes(searchVal);
            if (!matchName && !matchCode) return false;
        }
        return true;
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 2rem; color: var(--text-muted);">Không tìm thấy nhân viên phù hợp</td></tr>`;
        return;
    }

    filtered.forEach((emp) => {
        const rank = emp._overallRank;
        let rankBadge = `<span style="font-weight: 700; color: #64748b;">#${rank}</span>`;
        if (rank === 1) rankBadge = `<span style="font-size: 1.25rem;" title="Hạng 1 - Quán quân">🥇</span> <strong style="color: #b45309;">Top 1</strong>`;
        else if (rank === 2) rankBadge = `<span style="font-size: 1.25rem;" title="Hạng 2 - Á quân">🥈</span> <strong style="color: #475569;">Top 2</strong>`;
        else if (rank === 3) rankBadge = `<span style="font-size: 1.25rem;" title="Hạng 3 - Quý quân">🥉</span> <strong style="color: #92400e;">Top 3</strong>`;
        else if (rank <= 10) rankBadge = `<span class="badge" style="background: #fef3c7; color: #b45309; font-weight: 700;">Top ${rank}</span>`;

        const branchClass = emp.branch === "CS1" ? "badge-cs1" : (emp.branch === "CS2" ? "badge-cs2" : "badge-cs3");
        const tenureMonths = parseFloat(emp.tenureMonths) || 0;
        const tenureText = formatTenureText(tenureMonths);
        const tierBadge = getTenureTierBadge(tenureMonths);

        const tr = document.createElement("tr");
        if (rank <= 3) tr.style.background = "rgba(254, 243, 199, 0.25)";
        tr.innerHTML = `
            <td class="text-center" style="white-space: nowrap;">${rankBadge}</td>
            <td><span class="badge ${branchClass}">${emp.branch || 'CS1'}</span></td>
            <td>
                <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">${emp.name}</div>
                <div style="font-size: 0.75rem; color: #64748b;">ĐT: ${emp.phone || '-'}</div>
            </td>
            <td><code style="font-weight: 600; color: #4f46e5; background: #eef2ff; padding: 2px 6px; border-radius: 4px;">${emp.code}</code></td>
            <td><span style="font-family: monospace; font-size: 0.85rem;">${emp.startDate || '-'}</span></td>
            <td class="text-right" style="font-weight: 800; font-size: 1rem; color: #0284c7;">
                ${tenureMonths.toFixed(1)} tháng
            </td>
            <td style="font-weight: 600; color: #334155;">${tenureText}</td>
            <td class="text-right" style="font-weight: 700; color: var(--primary);">
                ${formatVND(emp.hourlyWage)}/h
            </td>
            <td>${tierBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportSeniorityToExcel() {
    if (typeof XLSX === "undefined") {
        showToast("Lỗi: Thư viện XLSX chưa tải xong!", "error");
        return;
    }

    const activeEmployees = AppState.employees.filter(e => e.status === "active" || (!e.endDate && e.status !== "retired"));
    activeEmployees.sort((a, b) => {
        const tA = parseFloat(a.tenureMonths) || 0;
        const tB = parseFloat(b.tenureMonths) || 0;
        if (tB !== tA) return tB - tA;
        return (a.startDate || "").localeCompare(b.startDate || "");
    });

    const rows = [
        ["BẢNG TỔNG HỢP & XẾP HẠNG THÂM NIÊN NHÂN VIÊN COCOMEO SALARY STAFF", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["(Sắp xếp theo thứ tự thâm niên từ lớn xuống thấp - Nhân viên đang làm việc)", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Ngày xuất dữ liệu: " + new Date().toLocaleDateString("vi-VN"), "", "", "", "", "", "", "", "", "", "", "", ""],
        [""],
        ["Thứ hạng", "Cơ sở", "Họ và tên", "Mã nhân viên", "Ngày vào làm", "Thâm niên (Tháng)", "Quy đổi Thời gian", "Mức lương/giờ", "Số điện thoại", "Ngân hàng", "Số tài khoản", "Tên chủ thẻ", "Phân nhóm thâm niên"]
    ];

    activeEmployees.forEach((e, idx) => {
        const m = parseFloat(e.tenureMonths) || 0;
        let tier = "Thử việc / Mới (< 6 tháng)";
        if (m >= 24) tier = "Lão làng (≥ 2 năm)";
        else if (m >= 12) tier = "Nòng cốt (1–2 năm)";
        else if (m >= 6) tier = "Vững vàng (6T–1N)";

        rows.push([
            idx + 1,
            e.branch || "CS1",
            e.name,
            e.code,
            e.startDate || "",
            m,
            formatTenureText(m),
            e.hourlyWage || 0,
            e.phone || "",
            e.bankName || "",
            e.bankAccount || "",
            e.accountHolder || "",
            tier
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BangThamNien");
    XLSX.writeFile(wb, "Cocomeo_Bang_Tham_Nien_Nhan_Vien.xlsx");
    showToast("🎉 Đã tải file Excel Bảng Thâm Niên thành công!", "success");
}

// ==========================================================================
// XỬ LÝ SỰ KIỆN & GIAO DIỆN CHUNG
// ==========================================================================

function switchAppTab(targetTabId) {
    if (!targetTabId) return;
    document.querySelectorAll(".nav-tab").forEach(t => {
        t.classList.toggle("active", t.getAttribute("data-tab") === targetTabId);
    });
    document.querySelectorAll(".mobile-nav-btn").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-tab") === targetTabId);
    });
    document.querySelectorAll(".tab-pane").forEach(p => {
        p.classList.toggle("active", p.id === targetTabId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initMobileFeatures() {
    // 1. Khởi tạo chế độ xem mặc định cho điện thoại
    const isMobile = window.innerWidth <= 768;
    const savedMode = localStorage.getItem("payroll_view_mode");
    if (savedMode) {
        setPayrollViewMode(savedMode);
    } else if (isMobile) {
        setPayrollViewMode('cards');
    }

    // 2. Kiểm tra hiển thị banner hướng dẫn cài đặt màn hình iPhone (Add to Home Screen)
    checkIosInstallBanner();
}

function checkIosInstallBanner() {
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    const isDismissed = localStorage.getItem("cocomeo_ios_banner_dismissed") === "true";
    const banner = document.getElementById("ios-install-banner");
    if (banner) {
        if (isIos && !isStandalone && !isDismissed) {
            banner.style.display = "block";
        } else {
            banner.style.display = "none";
        }
    }
}

function dismissIosBanner() {
    const banner = document.getElementById("ios-install-banner");
    if (banner) banner.style.display = "none";
    localStorage.setItem("cocomeo_ios_banner_dismissed", "true");
}

function setupEventListeners() {
    // Chuyển Tab trên Desktop
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            switchAppTab(tab.getAttribute("data-tab"));
        });
    });

    // Chuyển Tab trên Mobile (Bottom Navigation)
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            switchAppTab(btn.getAttribute("data-tab"));
        });
    });

    // Chuyển tháng
    const monthSelect = document.getElementById("month-selector");
    if (monthSelect) {
        monthSelect.addEventListener("change", (e) => {
            AppState.currentMonth = e.target.value;
            saveStateToStorage("cur_month");
            renderDashboard();
            renderPayrollTable();
            renderBonusesTable();
            renderPenaltiesTable();
            renderAdvancesTable();
            renderDepositsTable();
            showToast(`Đã chuyển sang xem Tháng ${AppState.currentMonth}`, "info");
        });
    }

    // Bộ lọc Bảng lương
    document.getElementById("payroll-search")?.addEventListener("input", renderPayrollTable);
    document.getElementById("payroll-branch-filter")?.addEventListener("change", renderPayrollTable);

    // Bộ lọc Nhân viên
    document.getElementById("emp-search")?.addEventListener("input", renderEmployeesTable);
    document.getElementById("emp-status-filter")?.addEventListener("change", renderEmployeesTable);
    document.getElementById("emp-branch-filter")?.addEventListener("change", renderEmployeesTable);

    // Form thêm/sửa nhân viên
    document.getElementById("employee-form")?.addEventListener("submit", saveEmployeeForm);

    // Xử lý nạp dữ liệu mẫu máy chấm công vào textarea & tự động tính
    document.getElementById("btn-load-sample-punch")?.addEventListener("click", () => {
        const textarea = document.getElementById("punch-log-input");
        if (textarea) textarea.value = SAMPLE_MACHINE_PUNCH_LOG;
        showToast("Đang nạp và tự động tính bảng lương từ dữ liệu mẫu...", "info");
        processTimesheetAndAutoCalculate(SAMPLE_MACHINE_PUNCH_LOG, "Du_Lieu_Cham_Cong_Mau_T9_2026.xlsx");
    });

    // Nút phân tích chấm công thủ công từ textarea
    document.getElementById("btn-parse-punch")?.addEventListener("click", handleParsePunchLog);

    // Xử lý kéo thả và chọn file chấm công (.xlsx, .xls, .csv, .txt)
    const dropzone = document.getElementById("punch-dropzone");
    const fileInput = document.getElementById("punch-file-input");

    if (dropzone && fileInput) {
        dropzone.addEventListener("click", () => fileInput.click());
        dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropzone.classList.add("dragover");
            dropzone.style.borderColor = "#4338ca";
            dropzone.style.background = "#eef2ff";
        });
        dropzone.addEventListener("dragleave", () => {
            dropzone.classList.remove("dragover");
            dropzone.style.borderColor = "#6366f1";
            dropzone.style.background = "#f5f7ff";
        });
        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
            dropzone.style.borderColor = "#6366f1";
            dropzone.style.background = "#f5f7ff";
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        fileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
                e.target.value = ""; // Reset để có thể chọn lại cùng 1 file nếu cần
            }
        });
    }
}

// ==========================================================================
// XỬ LÝ ĐỌC FILE EXCEL (.XLSX / .XLS) HOẶC CSV TỰ ĐỘNG
// ==========================================================================

function handleFileUpload(file) {
    if (!file) return;

    const fileName = file.name || "";
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || file.type.includes('spreadsheet') || file.type.includes('excel');

    showToast(`⏳ Đang xử lý file: ${fileName}...`, "info");

    if (isExcel) {
        if (typeof XLSX === 'undefined') {
            showToast("Thư viện Excel đang được tải, vui lòng thử lại sau 2 giây!", "warning");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });

                // Lấy sheet đầu tiên hoặc sheet chứa từ khóa chấm công
                let targetSheet = workbook.Sheets[workbook.SheetNames[0]];
                for (let name of workbook.SheetNames) {
                    const lName = name.toLowerCase();
                    if (lName.includes('công') || lName.includes('cong') || lName.includes('punch') || lName.includes('log') || lName.includes('data') || lName.includes('sheet1')) {
                        targetSheet = workbook.Sheets[name];
                        break;
                    }
                }

                // Chuyển sheet sang dạng mảng hàng 2D
                const rows = XLSX.utils.sheet_to_json(targetSheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

                if (!rows || rows.length === 0) {
                    showToast("File Excel rỗng hoặc không có dữ liệu!", "error");
                    return;
                }

                // Tìm dòng tiêu đề (Header row: dòng chứa 'Ngày' hoặc 'Tên nhân viên' hoặc 'Mã' hoặc 'Thứ')
                let headerRowIdx = 0;
                for (let r = 0; r < Math.min(rows.length, 15); r++) {
                    const rowText = (rows[r] || []).join(',').toLowerCase();
                    if ((rowText.includes('ngày') || rowText.includes('ngay')) && 
                        (rowText.includes('mã') || rowText.includes('ma') || rowText.includes('nhân viên') || rowText.includes('nhan vien') || rowText.includes('thứ') || rowText.includes('thu') || rowText.includes('1'))) {
                        headerRowIdx = r;
                        break;
                    }
                }

                const cleanedRows = rows.slice(headerRowIdx).filter(r => r && r.length > 0 && r.some(c => c !== null && c !== undefined && c !== ''));

                // Chuyển sang chuỗi CSV chuẩn
                const csvLines = cleanedRows.map(row => {
                    return row.map(cell => {
                        let val = (cell === null || cell === undefined) ? '' : String(cell).trim();
                        // Nếu là số thập phân giờ (ví dụ 0.3361111) thì đổi sang HH:MM
                        if (/^0\.\d+$/.test(val)) {
                            const num = parseFloat(val);
                            const totalM = Math.round(num * 24 * 60);
                            const h = Math.floor(totalM / 60);
                            const m = totalM % 60;
                            val = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                        }
                        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                            val = `"${val.replace(/"/g, '""')}"`;
                        }
                        return val;
                    }).join(',');
                });

                const csvContent = csvLines.join('\n');
                const textarea = document.getElementById("punch-log-input");
                if (textarea) textarea.value = csvContent;

                processTimesheetAndAutoCalculate(csvContent, fileName);

            } catch (err) {
                console.error("Lỗi đọc file Excel:", err);
                showToast("Lỗi khi đọc file Excel: " + err.message, "error");
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        // File CSV hoặc TXT
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const textarea = document.getElementById("punch-log-input");
            if (textarea) textarea.value = content;
            processTimesheetAndAutoCalculate(content, fileName);
        };
        reader.readAsText(file, 'utf-8');
    }
}

// ==========================================================================
// TỰ ĐỘNG PHÂN TÍCH & TÍNH LƯƠNG TỪ DỮ LIỆU CHẤM CÔNG
// ==========================================================================

function processTimesheetAndAutoCalculate(csvContent, fileName) {
    if (!csvContent || !csvContent.trim()) {
        showToast("Dữ liệu chấm công rỗng!", "warning");
        return;
    }

    const result = parseTimesheetData(csvContent);
    if (!result || !result.summaryList || result.summaryList.length === 0) {
        showToast("Không tìm thấy dòng dữ liệu chấm công hợp lệ trong file!", "error");
        return;
    }

    // 1. Tự động nhận diện Tháng từ dữ liệu trong file
    let targetMonth = AppState.currentMonth;
    if (result.detectedMonth) {
        targetMonth = result.detectedMonth;
        AppState.currentMonth = targetMonth;
        if (!AppState.availableMonths.includes(targetMonth)) {
            AppState.availableMonths.push(targetMonth);
            AppState.availableMonths.sort();
        }
        // Cập nhật tất cả các select box chọn tháng trên giao diện
        document.querySelectorAll("#global-month-select, #payroll-month-select").forEach(sel => {
            if (!Array.from(sel.options).some(o => o.value === targetMonth)) {
                const opt = document.createElement("option");
                opt.value = targetMonth;
                const [y, m] = targetMonth.split("-");
                opt.textContent = `Tháng ${m}/${y}`;
                sel.appendChild(opt);
            }
            sel.value = targetMonth;
        });
    }

    // 2. Lưu danh sách công vào AppState.timesheets của tháng
    AppState.timesheets[targetMonth] = result.summaryList;
    saveStateToStorage("timesheets");

    // 3. Hiển thị bảng đối soát chi tiết bên dưới
    renderPunchPreview(result.summaryList);

    // 4. Kiểm tra tuỳ chọn Tự động tính bảng lương
    const autoCalc = document.getElementById("cb-auto-calc-payroll") ? document.getElementById("cb-auto-calc-payroll").checked : true;
    const autoSyncDesktop = document.getElementById("cb-auto-sync-desktop") ? document.getElementById("cb-auto-sync-desktop").checked : true;

    if (autoCalc) {
        // Tự động tính toàn bộ bảng lương
        calculateMonthlyPayroll(targetMonth);
        renderLoadedTimesheetTable();

        // Đồng bộ lên backend API
        fetch('/api/timesheets/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: targetMonth, summaryList: result.summaryList })
        }).then(res => res.json()).then(data => {
            if (autoSyncDesktop) {
                syncDesktopExcel();
            }
        }).catch(err => {
            console.warn("Lỗi đồng bộ backend:", err);
        });

        // Tính tổng giờ máy và tổng quỹ lương để hiển thị trên Banner
        const totalMachineHours = result.summaryList.reduce((sum, s) => sum + (s.totalHours || 0), 0);
        const payrollList = AppState.payrolls[targetMonth] || [];
        const totalSalary = payrollList.reduce((sum, p) => sum + (p.total || 0), 0);
        const [year, month] = targetMonth.split("-");

        // Hiển thị Banner kết quả thành công
        const banner = document.getElementById("punch-success-banner");
        const detail = document.getElementById("punch-success-detail");
        if (banner && detail) {
            detail.innerHTML = `
                <div>📄 File đã nạp: <strong>${fileName || 'Dữ liệu máy chấm công'}</strong></div>
                <div style="margin-top: 0.25rem;">
                    📅 Kỳ tính lương: <strong>Tháng ${month}/${year}</strong> &nbsp;|&nbsp; 
                    👥 Khớp <strong>${result.summaryList.length} nhân viên</strong> &nbsp;|&nbsp; 
                    ⏱️ Tổng <strong>${totalMachineHours.toFixed(1)} giờ làm</strong> &nbsp;|&nbsp; 
                    💰 Tổng thực nhận: <strong style="color: #15803d; font-size: 1.05rem;">${formatVND(totalSalary)}</strong>
                </div>
                <div style="margin-top: 0.25rem; font-size: 0.85rem; color: #166534;">
                    ✓ Đã nhân đơn giá lương/giờ, tự động cộng bậc thang chuyên cần, sinh nhật, phụ cấp, trừ tạm ứng/phạt kỷ luật và cọc áo!
                </div>
            `;
            banner.style.display = "block";
            banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showToast(`🎉 Đã nạp thành công & tính xong lương Tháng ${month}/${year} cho ${result.summaryList.length} nhân viên!`, "success");
    } else {
        showToast(`Đã phân tích xong dữ liệu của ${result.summaryList.length} nhân viên từ file!`, "info");
    }
}

function handleParsePunchLog() {
    const text = document.getElementById("punch-log-input")?.value || "";
    if (!text.trim()) {
        showToast("Vui lòng dán nội dung xuất từ máy chấm công hoặc tải file lên!", "warning");
        return;
    }
    processTimesheetAndAutoCalculate(text, "Du_Lieu_Dan_Tay.txt");
}

function renderPunchPreview(summaryList) {
    const previewContainer = document.getElementById("punch-preview-container");
    const tbody = document.getElementById("punch-preview-body");
    if (previewContainer) previewContainer.style.display = "block";
    if (!tbody) return;

    tbody.innerHTML = "";
    summaryList.forEach((s, idx) => {
        const sKey = (s.staffCode || "").toLowerCase().trim();
        const mKey = (s.machineCode || "").toLowerCase().trim();
        const matchedEmp = AppState.employees.find(e => {
            const eCode = (e.code || "").toLowerCase().trim();
            const eName = (e.name || "").toLowerCase().trim();
            const eMachine = (e.machineCode || "").toLowerCase().trim();
            return (mKey && eMachine && mKey === eMachine) || 
                   (sKey && eCode && sKey === eCode) || 
                   (sKey && eName && sKey === eName);
        });

        const matchedStatus = matchedEmp ? 
            `<span class="badge badge-success">Khớp: ${matchedEmp.name} (${formatVND(matchedEmp.hourlyWage)}/h)</span>` : 
            `<span class="badge badge-danger">Chưa có trong danh mục</span>`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-center">${idx + 1}</td>
            <td class="font-bold">${s.staffCode}</td>
            <td>${s.branch}</td>
            <td class="text-right font-bold" style="color: var(--primary);">${s.totalHours.toFixed(2)}h (${s.formattedHours})</td>
            <td class="text-center">${s.workDays} ngày</td>
            <td>${matchedStatus}</td>
            <td>${s.warnings > 0 ? `<span class="badge badge-warning">${s.warnings} cảnh báo quẹt lẻ</span>` : '✓ Chuẩn'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function applyTimesheetAndCalculate() {
    const summaryList = AppState.timesheets[AppState.currentMonth];
    if (!summaryList || summaryList.length === 0) {
        showToast("Vui lòng phân tích dữ liệu chấm công trước khi áp dụng!", "warning");
        return;
    }
    calculateMonthlyPayroll(AppState.currentMonth);
    renderLoadedTimesheetTable();

    // Đồng bộ lên backend server nếu có
    fetch('/api/timesheets/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: AppState.currentMonth, summaryList })
    }).catch(() => {});

    // Chuyển sang Tab Bảng Lương
    document.querySelector('.nav-tab[data-tab="tab-payroll"]')?.click();
}

// ==========================================================================
// MODAL CONTROLS
// ==========================================================================

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("open");
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("open");
}

// Tự động khởi chạy khi tải xong trang
document.addEventListener("DOMContentLoaded", initApp);
