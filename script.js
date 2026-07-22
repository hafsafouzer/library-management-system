/**
 * Smart Library Enterprise System Core Script Engine
 * Optimized JavaScript Architecture with State Persistence Framework
 */

// Global State Hydration Engine via Localized Cache Registers
let books = JSON.parse(localStorage.getItem('books')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let issued = JSON.parse(localStorage.getItem('issued')) || [];

// Operational Parameters Logic Boundary Configurations
const COMPLIANCE_FINE_RATE = 5; // Standard Daily Fine Unit in INR (Rs.)
const LEASE_DURATION_DAYS = 7; // Operational Checkout Limit Period Matrix

// =========================================================================
// SYSTEM NOTIFICATION MANAGEMENT (TOAST SUBSYSTEM)
// =========================================================================
function notify(message, styleType = "success") {
    const activeOverlay = document.querySelector('.toast-msg');
    if (activeOverlay) activeOverlay.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.style.borderLeft = `5px solid ${styleType === 'error' ? 'var(--danger)' : 'var(--success)'}`;
    toast.innerText = message;
    
    document.body.appendChild(toast);
    setTimeout(() => { if (toast) toast.remove(); }, 4000);
}

// =========================================================================
// STATE PERSISTENCE UTILITY LOGIC DIRECTIVES
// =========================================================================
function synchronizeSecureStorage() {
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('issued', JSON.stringify(issued));
    syncDashboardMetrics();
}

function calculateOverdueMetrics(expectedDueString) {
    const dueDate = new Date(expectedDueString);
    const today = new Date();
    
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const operationalDeltaMs = today - dueDate;
    const computedDaysLate = Math.floor(operationalDeltaMs / (1000 * 60 * 60 * 24));
    
    return {
        daysLate: computedDaysLate > 0 ? computedDaysLate : 0,
        accruedFine: computedDaysLate > 0 ? computedDaysLate * COMPLIANCE_FINE_RATE : 0
    };
}

// =========================================================================
// ASSET REGISTER COMPONENT ENGINE (MANAGE BOOKS FUNCTIONALITY)
// =========================================================================
function addBook() {
    const idField = document.getElementById('bookId');
    const titleField = document.getElementById('bookName');
    const authorField = document.getElementById('author');
    const categoryField = document.getElementById('category');

    const id = idField?.value.trim();
    const name = titleField?.value.trim();
    const author = authorField?.value.trim();
    const category = categoryField?.value;

    if (!id || !name) return notify("Validation Error: Book ID and Title are required tokens.", "error");
    if (books.some(b => b.id === id)) return notify("Collision Warning: This Book ID already populates registry keys.", "error");

    books.push({ id, name, author, category, status: "Available" });
    synchronizeSecureStorage();
    showBooks();
    
    idField.value = ''; titleField.value = ''; authorField.value = '';
    notify(`Asset Entity "${name}" successfully compiled and appended to data tables.`);
}

function showBooks() {
    const tbody = document.querySelector('#bookTable tbody');
    if (!tbody) return; 
    
    const searchFilter = document.getElementById('searchBook')?.value.toLowerCase() || '';
    tbody.innerHTML = '';

    books.forEach(b => {
        if (b.name.toLowerCase().includes(searchFilter) || b.id.toLowerCase().includes(searchFilter)) {
            const currentBadge = b.status === 'Available' ? 
                `<span class="badge badge-available">Available</span>` : 
                `<span class="badge badge-issued">Leased</span>`;
            
            tbody.innerHTML += `<tr>
                <td><strong>#${b.id}</strong></td>
                <td>${b.name}</td>
                <td>${b.author || 'Anonymous/Unknown'}</td>
                <td>${b.category}</td>
                <td>${currentBadge}</td>
                <td>
                    <button class="btn btn-warning" onclick="openBookUpdateModal('${b.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBook('${b.id}')">Delete</button>
                </td>
            </tr>`;
        }
    });
}

function deleteBook(id) {
    if (issued.some(i => i.bookId === id)) return notify("Process Block: Active transaction lease locking this asset configuration.", "error");
    
    books = books.filter(b => b.id !== id);
    synchronizeSecureStorage();
    showBooks();
    notify("Target book completely purged from physical memory registry storage arrays.");
}

function openBookUpdateModal(bookId) {
    const targetedBook = books.find(b => b.id === bookId);
    if (!targetedBook) return notify("Tracking context error mapping missing metadata pointers.", "error");
    
    document.getElementById('editOldBookId').value = targetedBook.id;
    document.getElementById('editBookName').value = targetedBook.name;
    document.getElementById('editAuthor').value = targetedBook.author;
    document.getElementById('editCategory').value = targetedBook.category;
    
    document.getElementById('updateModal').classList.add('show');
}

function closeUpdateModal() {
    document.getElementById('updateModal').classList.remove('show');
}

function commitBookUpdate() {
    const targetId = document.getElementById('editOldBookId').value;
    const cleanTitle = document.getElementById('editBookName').value.trim();
    const cleanAuthor = document.getElementById('editAuthor').value.trim();
    const chosenCategory = document.getElementById('editCategory').value;

    if (!cleanTitle) return notify("Process Abort: Entry Title context node parameters invalid.", "error");

    let matchIdx = books.findIndex(b => b.id === targetId);
    if (matchIdx !== -1) {
        books[matchIdx].name = cleanTitle;
        books[matchIdx].author = cleanAuthor;
        books[matchIdx].category = chosenCategory;
        
        synchronizeSecureStorage();
        showBooks();
        closeUpdateModal();
        notify("Asset node registry properties overwritten safely across parameters matrices.");
    }
}

// =========================================================================
// MEMBERSHIP DIRECTORY SUBSYSTEM (MANAGE STUDENTS FUNCTIONALITY)
// =========================================================================
function addStudent() {
    const idEl = document.getElementById('stuId');
    const nameEl = document.getElementById('stuName');
    const classEl = document.getElementById('stuClass');

    const id = idEl?.value.trim();
    const name = nameEl?.value.trim();
    const streamClass = classEl?.value.trim();

    if (!id || !name) return notify("Input Violation: Student Identification key mapping incomplete.", "error");
    if (students.some(s => s.id === id)) return notify("Data Integrity Conflict: Duplicate Student Key found.", "error");

    students.push({ id, name, class: streamClass });
    synchronizeSecureStorage();
    showStudents();

    idEl.value = ''; nameEl.value = ''; classEl.value = '';
    notify(`Member profile sequence configured successfully for: ${name}`);
}

function showStudents() {
    const tbody = document.querySelector('#stuTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    students.forEach(s => {
        tbody.innerHTML += `<tr>
            <td><strong>${s.id}</strong></td>
            <td>${s.name}</td>
            <td>${s.class || 'Unassigned Track/General'}</td>
            <td>
                <button class="btn btn-warning" onclick="openStuUpdateModal('${s.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent('${s.id}')">Delete</button>
            </td>
        </tr>`;
    });
}

function deleteStudent(id) {
    if (issued.some(i => i.stuId === id)) return notify("Risk Fault: Student holding un-returned assets liability data profiles.", "error");
    
    students = students.filter(s => s.id !== id);
    synchronizeSecureStorage();
    showStudents();
    notify("Student account parameters fully unlinked and neutralized.");
}

// STUDENT PROFILE UPDATE LOGIC (MODAL INTERFACE)
function openStuUpdateModal(stuId) {
    const targetedStudent = students.find(s => s.id === stuId);
    if (!targetedStudent) return notify("Target context tracing exception.", "error");

    document.getElementById('editOldStuId').value = targetedStudent.id;
    document.getElementById('editStuName').value = targetedStudent.name;
    document.getElementById('editStuClass').value = targetedStudent.class;

    document.getElementById('stuUpdateModal').classList.add('show');
}

// Target function for cancel trigger mapping
function closeStuUpdateModal() {
    document.getElementById('stuUpdateModal').classList.remove('show');
}

function commitStudentUpdate() {
    const targetId = document.getElementById('editOldStuId').value;
    const cleanName = document.getElementById('editStuName').value.trim();
    const cleanClass = document.getElementById('editStuClass').value.trim();

    if (!cleanName) return notify("Input mismatch validation failure: Name field target cannot be empty.", "error");

    let matchIdx = students.findIndex(s => s.id === targetId);
    if (matchIdx !== -1) {
        students[matchIdx].name = cleanName;
        students[matchIdx].class = cleanClass;
        
        synchronizeSecureStorage();
        showStudents();
        closeStuUpdateModal();
        notify("Student profile credentials overwritten successfully.");
    }
}

// =========================================================================
// TRANSACTION SYSTEM (CIRCULATION COUTNER ENGINE: ISSUE / RETURN LOGIC)
// =========================================================================
function issueBook() {
    const studentInput = document.getElementById('issueStuId');
    const bookInput = document.getElementById('issueBookId');

    const inputStuId = studentInput?.value.trim();
    const inputBookId = bookInput?.value.trim();

    const verifiedBookIndex = books.findIndex(b => b.id === inputBookId);
    const verifiedStudent = students.find(s => s.id === inputStuId);

    if (verifiedBookIndex === -1) return notify("Transaction Abort: Unrecognized Asset identifier matching code.", "error");
    if (!verifiedStudent) return notify("Transaction Abort: Membership verification credentials trace failed.", "error");
    if (books[verifiedBookIndex].status === "Issued") return notify("Allocation Block: Selected asset currently locked under active lease.", "error");

    const operationalDate = new Date();
    const targetDueDate = new Date();
    targetDueDate.setDate(operationalDate.getDate() + LEASE_DURATION_DAYS);

    issued.push({
        stuId: verifiedStudent.id,
        bookId: books[verifiedBookIndex].id,
        issueDate: operationalDate.toISOString().split('T')[0], 
        dueDate: targetDueDate.toISOString().split('T')[0]
    });

    books[verifiedBookIndex].status = "Issued";
    synchronizeSecureStorage();
    showIssued();

    studentInput.value = ''; bookInput.value = '';
    notify(`System Token Authorization Ledger Locked. Return Period Context set: ${LEASE_DURATION_DAYS} Days.`);
}

function returnBook(bookId) {
    const assetLogIdx = issued.findIndex(i => i.bookId === bookId);
    if (assetLogIdx === -1) return notify("Internal Registry Tracking Exception: Entry reference context fault.", "error");

    const calculatedArrears = calculateOverdueMetrics(issued[assetLogIdx].dueDate);
    
    if (calculatedArrears.accruedFine > 0) {
        notify(`Financial Policy Enforcement: Rs. ${calculatedArrears.accruedFine} charged for ${calculatedArrears.daysLate} Overdue Days.`, "error");
    } else {
        notify("Asset cleared inventory tracking controls with flawless metrics.");
    }

    issued.splice(assetLogIdx, 1);
    
    let dynamicBookAsset = books.find(b => b.id === bookId);
    if (dynamicBookAsset) dynamicBookAsset.status = "Available";

    synchronizeSecureStorage();
    showIssued();
}

function showIssued() {
    const tbody = document.querySelector('#issueTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    issued.forEach(i => {
        const structuralMetrics = calculateOverdueMetrics(i.dueDate);
        tbody.innerHTML += `<tr>
            <td>${i.stuId}</td>
            <td>${i.bookId}</td>
            <td>${i.issueDate}</td>
            <td>${i.dueDate}</td>
            <td style="font-weight:700; color:${structuralMetrics.accruedFine > 0 ? 'var(--danger)':'var(--success)'}">Rs. ${structuralMetrics.accruedFine}</td>
            <td><button class="btn" style="background:#e2e8f0; color:var(--text-main);" onclick="returnBook('${i.bookId}')">Process Check-In</button></td>
        </tr>`;
    });
}

// =========================================================================
// PERFORMANCE METRICS REPORT & LIVE AUDITS DATA LOGGERS
// =========================================================================
function executeAuditReports() {
    const tbody = document.querySelector('#reportTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    issued.forEach(i => {
        const metrics = calculateOverdueMetrics(i.dueDate);
        if (metrics.daysLate > 0) {
            tbody.innerHTML += `<tr>
                <td><strong>${i.stuId}</strong></td>
                <td>${i.bookId}</td>
                <td>${i.dueDate}</td>
                <td><span style="color:var(--danger); font-weight:600;">${metrics.daysLate} Days Late</span></td>
                <td style="color:var(--danger); font-weight:700;">Rs. ${metrics.accruedFine}</td>
            </tr>`;
        }
    });
}

function syncDashboardMetrics() {
    if (!document.getElementById('totalBooks')) return; 
    document.getElementById('totalBooks').innerText = books.length;
    document.getElementById('totalStudents').innerText = students.length;
    document.getElementById('totalIssued').innerText = issued.length;
}

// =========================================================================
// RUNTIME LIFECYCLE DOM ENGINE BOOTSTRAP INITIALIZER
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    showBooks();
    showStudents();
    showIssued();
    executeAuditReports();
    syncDashboardMetrics();
});