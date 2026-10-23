/* ===================================================
   محاجرنا - ملف الجافاسكريبت الرئيسي (script.js)
   تفاعلات حاسبة الطوب، الفلترة، النماذج، دعم الوضع الليلي والنهاري
=================================================== */

// ==============================================================================
// رابط Google Sheets (Google Apps Script Web App)
// ضع رابط الـ Web App الخاص بك بين القوسين بالأسفل:
// مثال: const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
// ==============================================================================
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/library/d/1Ve0IIPlZczD61fuIt-b3Z8LO0shjHnmxmKKIPJh_JN_ewwhB-E4EYsF6/3';

// Global functions for inline HTML event handlers
window.closeOrderModal = function () {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.classList.add('hidden');
    }
};

window.applyCalculatedToOrder = function () {
    const cubicVal = document.getElementById('resCubicMeters')?.textContent || '';
    const brickCountVal = document.getElementById('resBricksCount')?.textContent || '';
    const selectObj = document.getElementById('calcBrickType');

    const custQuantity = document.getElementById('custQuantity');
    if (custQuantity) {
        custQuantity.value = `${cubicVal} (تقريباً ${brickCountVal})`;
    }

    // Auto select product type
    const custBrickSelect = document.getElementById('custBrickType');
    if (custBrickSelect && selectObj) {
        if (selectObj.value === "41.67") {
            custBrickSelect.value = "طوب أبيض خفيف (60x20x20)";
        } else if (selectObj.value === "69.44") {
            custBrickSelect.value = "طوب أبيض خفيف (60x20x12)";
        } else {
            custBrickSelect.value = "طوب أبيض خفيف (60x20x15)";
        }
    }

    // Smooth scroll to order section
    const orderSec = document.getElementById('order-section');
    if (orderSec) {
        orderSec.scrollIntoView({ behavior: 'smooth' });
    }
};

window.selectProductForOrder = function (productName) {
    const custBrickType = document.getElementById('custBrickType');
    if (custBrickType) {
        custBrickType.value = productName;
    }
    const orderSec = document.getElementById('order-section');
    if (orderSec) {
        orderSec.scrollIntoView({ behavior: 'smooth' });
    }
};

window.sendOrderViaWhatsApp = function () {
    const name = document.getElementById('custName')?.value.trim() || '';
    const phone = document.getElementById('custPhone')?.value.trim() || '';
    const brickType = document.getElementById('custBrickType')?.value || '';
    const quantity = document.getElementById('custQuantity')?.value.trim() || '';
    const location = document.getElementById('custLocation')?.value.trim() || '';
    const notes = document.getElementById('custNotes')?.value.trim() || '';

    if (!name || !phone || !quantity || !location) {
        alert('برجاء ملء الحقول الرئيسية (الاسم، الهاتف، الكمية، ومكان التوصيل) أولاً.');
        return;
    }

    const waMessage = `طلب جديد من موقع محاجرنا 🏗️%0A----------------------------------%0A👤 *الاسم:* ${encodeURIComponent(name)}%0A📞 *الهاتف:* ${encodeURIComponent(phone)}%0A🧱 *النوع:* ${encodeURIComponent(brickType)}%0A📦 *الكمية:* ${encodeURIComponent(quantity)}%0A📍 *العنوان:* ${encodeURIComponent(location)}%0A📝 *ملاحظات:* ${encodeURIComponent(notes || 'لا يوجد')}`;

    const waUrl = `https://wa.me/201031223882?text=${waMessage}`;
    window.open(waUrl, '_blank');
};

// ==========================================
// إدارة الوضع الليلي والنهاري (Theme Management)
// ==========================================
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeToggleBtnMobile = document.getElementById('themeToggleBtnMobile');
    const themeToggleBtnDrawer = document.getElementById('themeToggleBtnDrawer');

    function updateThemeUI(isDark) {
        // Desktop Icon & Title
        const icon = document.getElementById('themeToggleIcon');
        if (icon) {
            icon.className = isDark
                ? 'fa-solid fa-sun text-amber-400 text-lg transition-transform'
                : 'fa-solid fa-moon text-indigo-500 text-lg transition-transform';
        }
        if (themeToggleBtn) {
            themeToggleBtn.title = isDark ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي';
        }

        // Mobile Icon
        const iconMobile = document.getElementById('themeToggleIconMobile');
        if (iconMobile) {
            iconMobile.className = isDark
                ? 'fa-solid fa-sun text-amber-400 text-sm transition-transform'
                : 'fa-solid fa-moon text-indigo-500 text-sm transition-transform';
        }
        if (themeToggleBtnMobile) {
            themeToggleBtnMobile.title = isDark ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي';
        }

        // Drawer Icon & Text
        const drawerIcon = document.getElementById('drawerThemeIcon');
        const drawerText = document.getElementById('drawerThemeText');
        if (drawerIcon && drawerText) {
            if (isDark) {
                drawerIcon.className = 'fa-solid fa-sun text-amber-400';
                drawerText.textContent = 'التحويل إلى الوضع النهاري';
            } else {
                drawerIcon.className = 'fa-solid fa-moon text-indigo-500';
                drawerText.textContent = 'التحويل إلى الوضع الليلي';
            }
        }
    }

    function toggleTheme() {
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        if (isCurrentlyDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('mahgerna_theme', 'light');
            updateThemeUI(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('mahgerna_theme', 'dark');
            updateThemeUI(true);
        }
    }

    [themeToggleBtn, themeToggleBtnMobile, themeToggleBtnDrawer].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });

    // مزامنة حالة الأيقونات عند أول تحميل
    const isDark = document.documentElement.classList.contains('dark');
    updateThemeUI(isDark);
}

// ==========================================
// تهيئة العناصر عند اكتمال تحميل المستند (DOM)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // تفعيل إدارة الثيم (الوضع الليلي والنهاري)
    initTheme();

    // تحديث سنة حقوق الملكية
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // القائمة المنسدلة للهواتف (Mobile Menu Toggle)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // منطق حاسبة الطوب والكميات التفاعلية
    const calcLength = document.getElementById('calcLength');
    const calcHeight = document.getElementById('calcHeight');
    const calcBrickType = document.getElementById('calcBrickType');

    function calculateBricks() {
        if (!calcLength || !calcHeight || !calcBrickType) return;

        const len = parseFloat(calcLength.value) || 0;
        const hgt = parseFloat(calcHeight.value) || 0;
        const bricksPerCubic = parseFloat(calcBrickType.value) || 41.67;

        const totalArea = len * hgt;
        // Standard wall thickness assuming 0.20m width
        const totalCubicMeters = totalArea * 0.20;
        const totalBricks = Math.round(totalCubicMeters * bricksPerCubic);
        const estimatedTrucks = Math.ceil(totalCubicMeters / 30); // 30 cubic meters approx per truck

        const resArea = document.getElementById('resArea');
        const resBricks = document.getElementById('resBricksCount');
        const resCubic = document.getElementById('resCubicMeters');
        const resTrucks = document.getElementById('resTrucks');

        if (resArea) resArea.textContent = `${totalArea.toFixed(1)} م²`;
        if (resBricks) resBricks.textContent = `${totalBricks.toLocaleString('ar-EG')} طوبة`;
        if (resCubic) resCubic.textContent = `${totalCubicMeters.toFixed(1)} م³`;
        if (resTrucks) resTrucks.textContent = `${estimatedTrucks} شاحنة`;
    }

    if (calcLength && calcHeight && calcBrickType) {
        [calcLength, calcHeight, calcBrickType].forEach(elem => {
            elem.addEventListener('input', calculateBricks);
        });
        calculateBricks(); // الحساب المبدئي عند التحميل
    }

    // فلترة صور المعرض (Gallery Filtering)
    const filterBtns = document.querySelectorAll('.gallery-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-brand-500', 'text-slate-950');
                b.classList.add('bg-brand-card', 'text-slate-300');
            });
            btn.classList.add('active', 'bg-brand-500', 'text-slate-950');
            btn.classList.remove('bg-brand-card', 'text-slate-300');

            const filter = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // الأكورديون للأسئلة الشائعة (FAQ Toggle)
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('i');
            if (!content) return;

            const isOpen = !content.classList.contains('hidden');

            // إغلاق جميع الأكورديونات الأخرى
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-toggle i').forEach(i => i.classList.remove('rotate-180'));

            if (!isOpen) {
                content.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            }
        });
    });

    // معالجة نموذج الطلب وعرض النافذة المنبثقة وإرسال البيانات إلى Google Sheets
    const mainOrderForm = document.getElementById('mainOrderForm');
    const orderModal = document.getElementById('orderModal');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const submitOrderIcon = document.getElementById('submitOrderIcon');
    const submitOrderText = document.getElementById('submitOrderText');

    if (mainOrderForm && orderModal) {
        mainOrderForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('custName')?.value.trim() || '';
            const phone = document.getElementById('custPhone')?.value.trim() || '';
            const brickType = document.getElementById('custBrickType')?.value || '';
            const quantity = document.getElementById('custQuantity')?.value.trim() || '';
            const location = document.getElementById('custLocation')?.value.trim() || '';
            const notes = document.getElementById('custNotes')?.value.trim() || 'لا يوجد';

            if (!name || !phone || !quantity || !location) {
                return;
            }

            // إنشاء كود مرجعي فريد وتاريخ الطلب
            const randomRef = '#MQ-' + Math.floor(1000 + Math.random() * 9000);
            const now = new Date();
            const orderDate = now.toLocaleDateString('ar-EG') + ' ' + now.toLocaleTimeString('ar-EG');

            // تغيير مظهر الزر أثناء الإرسال (Loading state)
            if (submitOrderBtn) {
                submitOrderBtn.disabled = true;
                if (submitOrderIcon) submitOrderIcon.className = 'fa-solid fa-circle-notch fa-spin';
                if (submitOrderText) submitOrderText.textContent = 'جاري تسجيل الطلب...';
            }

            // تجهيز بيانات الطلب متطابقة تماماً مع كود Google Apps Script الخاص بك
            const orderPayload = {
                fullName: name,
                phone: phone,
                type: brickType,
                quantity: quantity,
                address: location,
                notes: notes,
                orderCode: randomRef,
                date: orderDate
            };

            // إرسال البيانات بتنسيق JSON إلى Google Sheets
            if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim() !== '') {
                try {
                    await fetch(GOOGLE_SHEET_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'text/plain;charset=utf-8'
                        },
                        body: JSON.stringify(orderPayload)
                    });
                } catch (error) {
                    console.error('حدث خطأ أثناء الإرسال إلى Google Sheets:', error);
                }
            } else {
                console.info('ملاحظة: يمكنك ربط Google Sheets بوضع رابط الـ Web App في GOOGLE_SHEET_URL داخل script.js.');
            }

            // إعادة تعيين مظهر الزر
            if (submitOrderBtn) {
                submitOrderBtn.disabled = false;
                if (submitOrderIcon) submitOrderIcon.className = 'fa-solid fa-paper-plane';
                if (submitOrderText) submitOrderText.textContent = 'تأكيد الحجز عبر الموقع';
            }

            // ملء بيانات المودال المنبثق
            const modalOrderCode = document.getElementById('modalOrderCode');
            const mName = document.getElementById('mName');
            const mPhone = document.getElementById('mPhone');
            const mType = document.getElementById('mType');
            const mQty = document.getElementById('mQty');
            const mLoc = document.getElementById('mLoc');

            if (modalOrderCode) modalOrderCode.textContent = randomRef;
            if (mName) mName.textContent = name;
            if (mPhone) mPhone.textContent = phone;
            if (mType) mType.textContent = brickType;
            if (mQty) mQty.textContent = quantity;
            if (mLoc) mLoc.textContent = location;

            orderModal.classList.remove('hidden');
            mainOrderForm.reset();
        });
    }
});
