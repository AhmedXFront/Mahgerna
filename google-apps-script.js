/**
 * ==============================================================================
 * محاجرنا - كود ربط شيت جوجل بالموقع (Google Apps Script)
 * ==============================================================================
 * 
 * طريقة الاستخدام:
 * 1. افتح شيت جوجل الخاص بك (Google Sheets).
 * 2. من القائمة العلوية اضغط على: ملحقات (Extensions) > Apps Script.
 * 3. امسح أي كود موجود في ملف (Code.gs) والصق هذا الكود بالكامل بدلاً منه.
 * 4. اضغط على زر "حفظ" (Save / أيقونة القرص).
 * 5. اضغط على الزر الأزرق: نشر (Deploy) > نشر جديد (New deployment).
 * 6. اضغط على الترس بجانب نوع النشر واختر: تطبيق ويب (Web app).
 * 7. املأ الإعدادات كالتالي:
 *    - الوصف (Description): Mahgerna Orders
 *    - تنفيذ باسم (Execute as): حسابي (Me)
 *    - من يملك إمكانية الوصول (Who has access): "أي شخص" (Anyone)  <--- (خطوة هامة جداً لمنع خطأ 403)
 * 8. اضغط نشر (Deploy) ثم امنح الأذونات (Authorize access).
 * 9. انسخ رابط تطبيق الويب (Web App URL) الذي ينتهي بـ /exec
 * 10. ضعه في ملف script.js في السطر رقم 11 مكان GOOGLE_SHEET_URL.
 * ==============================================================================
 */

function doPost(e) {
  // قفل لمنع التضارب عند إرسال طلبات متعددة في نفس الثانية
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // إذا كان الشيت فارغاً، يتم إنشاء عناوين الأعمدة تلقائياً وتنسيقها
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "كود الطلب",
        "تاريخ الطلب",
        "اسم العميل",
        "رقم الهاتف",
        "نوع الطوب المطلوب",
        "الكمية المطلوبة",
        "عنوان التوصيل",
        "ملاحظات إضافية"
      ]);

      // تنسيق شريط العناوين بالألوان وهوية محاجرنا
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#f39c12");
      headerRange.setFontColor("#020617");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // قراءة البيانات المرسلة سواء بصيغة JSON أو بيانات عادية
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var orderCode = data.orderCode || ("#MQ-" + Math.floor(1000 + Math.random() * 9000));
    var date = data.date || new Date().toLocaleString("ar-EG");
    var fullName = data.fullName || data.name || "بدون اسم";
    var phone = data.phone || "";
    var type = data.type || "";
    var quantity = data.quantity || "";
    var address = data.address || "";
    var notes = data.notes || "لا يوجد";

    // وضع علامة ' قبل رقم الهاتف ليظهر الصفر الأول ولا يحذفه إكسل/جوجل شيتس
    var formattedPhone = phone ? ("+20" + phone) : "";

    // إضافة صف الطلب في الشيت
    sheet.appendRow([
      orderCode,
      date,
      fullName,
      formattedPhone,
      type,
      quantity,
      address,
      notes
    ]);

    // توسيط البيانات المدخلة لتكون منظمة وأنيقة
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 8).setHorizontalAlignment("center");

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", orderCode: orderCode }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// دالة تجريبية لتجربة الكود مباشرة من Apps Script والتأكد من إضافته للبيانات
function testOrder() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        orderCode: "#MQ-TEST",
        date: new Date().toLocaleString("ar-EG"),
        fullName: "تجربة ربط الشيت",
        phone: "01031223882",
        type: "طوب أبيض خفيف (60x20x20)",
        quantity: "50 متر مكعب",
        address: "موقع المشروع التجريبي",
        notes: "تم الإرسال بنجاح للتأكد من صحة الربط"
      })
    }
  };
  var res = doPost(testEvent);
  Logger.log(res.getContent());
}
