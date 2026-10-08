let count = 0;

// قاعدة بيانات داخلية للأذكار اليومية
const azkarData = {
    morning: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n- أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...\n- اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.\n- سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته (3 مرات).`,
    evening: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n- أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...\n- اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.\n- أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ ما خَلَقَ (3 مرات).`,
    sleep: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n- بِاسْمِكَ رَبِّ وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِه عِبَادَكَ الصَّالِحِينَ.\n- اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ (ثلاث مرات).`
};

// إدارة التنقل بين الأقسام
function openSection(sectionName) {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('main-header').style.display = 'none';

    document.getElementById('counter-section').style.display = 'none';
    document.getElementById('duaa-section').style.display = 'none';
    document.getElementById('quran-section').style.display = 'none';
    document.getElementById('azkar-section').style.display = 'none';

    if (sectionName === 'counter') {
        document.getElementById('counter-section').style.display = 'flex';
    } else if (sectionName === 'duaa') {
        document.getElementById('duaa-section').style.display = 'flex';
    } else if (sectionName === 'quran') {
        document.getElementById('quran-section').style.display = 'flex';
        fetchSurahs();
    } else if (sectionName === 'azkar') {
        document.getElementById('azkar-section').style.display = 'flex';
    }
}

function goHome() {
    document.getElementById('counter-section').style.display = 'none';
    document.getElementById('duaa-section').style.display = 'none';
    document.getElementById('quran-section').style.display = 'none';
    document.getElementById('azkar-section').style.display = 'none';
    
    document.getElementById('home-screen').style.display = 'grid';
    document.getElementById('main-header').style.display = 'block';
}

// المسبحة الإلكترونية
function incrementCounter() {
    count++;
    document.getElementById('counter-number').innerText = count;
}

function resetCounter() {
    count = 0;
    document.getElementById('counter-number').innerText = count;
}

// الأدعية والزيارات (عبر الملفات النصية)
async function loadDuaaContent(title, fileName) {
    document.getElementById('duaa-list').style.display = 'none';
    document.getElementById('duaa-detail').style.display = 'flex';
    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-text').innerText = "جاري تحميل النص...";

    try {
        let response = await fetch(`duaas/${fileName}.txt`);
        if (!response.ok) throw new Error("فشل التحميل");
        let text = await response.text();
        document.getElementById('detail-text').innerText = text;
    } catch (error) {
        document.getElementById('detail-text').innerText = "تنبيه: تأكد من تشغيل المشروع عبر Live Server في VS Code.";
    }
}

function backToDuaaList() {
    document.getElementById('duaa-detail').style.display = 'none';
    document.getElementById('duaa-list').style.display = 'flex';
}

// القرآن الكريم (عبر الـ API الخارجي)
let surahsLoaded = false;
async function fetchSurahs() {
    const container = document.getElementById('surahs-container');
    if (surahsLoaded) return;

    try {
        let response = await fetch('https://api.alquran.cloud/v1/surah');
        let data = await response.json();
        
        if (data.code === 200) {
            container.innerHTML = "";
            data.data.forEach(surah => {
                container.innerHTML += `
                    <div class="list-item" onclick="loadSurahAyahs(${surah.number}, '${surah.name}')">
                        <i class="fa-solid fa-book-quran"></i>
                        <div class="item-info">
                            <h4>${surah.name} (${surah.englishName})</h4>
                            <p>${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - عدد الآيات: ${surah.numberOfAyahs}</p>
                        </div>
                    </div>
                `;
            });
            surahsLoaded = true;
        }
    } catch (error) {
        container.innerHTML = `<div class="list-item"><div class="item-info"><h4>تعذر الاتصال بالإنترنت لجلب السور</h4></div></div>`;
    }
}

async function loadSurahAyahs(surahNumber, surahName) {
    document.getElementById('quran-list').style.display = 'none';
    document.getElementById('quran-detail').style.display = 'flex';
    document.getElementById('quran-detail-title').innerText = surahName;
    document.getElementById('quran-detail-text').innerText = "جاري تحميل الآيات المباركة...";

    try {
        let response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        let data = await response.json();

        if (data.code === 200) {
            let ayahsText = "";
            data.data.ayahs.forEach(ayah => {
                ayahsText += `[${ayah.numberInSurah}] ${ayah.text} `;
            });
            document.getElementById('quran-detail-text').innerText = ayahsText;
        }
    } catch (error) {
        document.getElementById('quran-detail-text').innerText = "حدث خطأ أثناء جلب الآيات. تأكد من اتصالك بالإنترنت.";
    }
}

function backToQuranList() {
    document.getElementById('quran-detail').style.display = 'none';
    document.getElementById('quran-list').style.display = 'flex';
}

// الأذكار اليومية
function loadAzkarContent(title, key) {
    document.getElementById('azkar-list').style.display = 'none';
    document.getElementById('azkar-detail').style.display = 'flex';
    document.getElementById('azkar-detail-title').innerText = title;
    
    if (azkarData[key]) {
        document.getElementById('azkar-detail-text').innerText = azkarData[key];
    } else {
        document.getElementById('azkar-detail-text').innerText = "عذراً، الأذكار غير متوفرة حالياً.";
    }
}

function backToAzkarList() {
    document.getElementById('azkar-detail').style.display = 'none';
    document.getElementById('azkar-list').style.display = 'flex';
}
// المسبحة
let count = 0;
function incrementCounter() {
    count++;
    document.getElementById('counter-number').innerText = count;
}

function resetCounter() {
    count = 0;
    document.getElementById('counter-number').innerText = count;
}

// التنقل بين الأقسام الرئيسية
function openSection(sectionName) {
    document.getElementById('home-screen').style.display = 'none';
    document.querySelector('header').style.display = 'none';

    document.getElementById('counter-section').style.display = 'none';
    document.getElementById('duaa-section').style.display = 'none';
    document.getElementById('azkar-section').style.display = 'none';
    document.getElementById('quran-section').style.display = 'none';

    if (sectionName === 'counter') {
        document.getElementById('counter-section').style.display = 'block';
    } else if (sectionName === 'duaa') {
        document.getElementById('duaa-section').style.display = 'block';
    } else if (sectionName === 'azkar') {
        document.getElementById('azkar-section').style.display = 'block';
    } else if (sectionName === 'quran') {
        document.getElementById('quran-section').style.display = 'block';
    }
}

function goHome() {
    document.getElementById('counter-section').style.display = 'none';
    document.getElementById('duaa-section').style.display = 'none';
    document.getElementById('azkar-section').style.display = 'none';
    document.getElementById('quran-section').style.display = 'none';
    
    document.getElementById('home-screen').style.display = 'grid';
    document.querySelector('header').style.display = 'block';
}

// قاعدة بيانات النصوص مباشرة داخل الكود (تشتغل على أي رابط بدون مشاكل ملفات الـ txt)
const contentsDB = {
    'kumayl': `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nاللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، وَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ...\n\n(هنا يظهر كامل نص دعاء كميل بن زياد بشكل مريح ومرتب)`,
    'tawasul': `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nاللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ...\n\n(هنا يظهر كامل نص دعاء التوسل)`,
    'ziarat_ashura': `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nالسَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا ابْنَ رَسُولِ اللَّهِ...\n\n(هنا يظهر كامل نص زيارة عاشوراء المباركة)`
};

// دالة عرض النص مباشرة عند النقر
function loadTextContent(title, contentKey, listId, detailId, textId) {
    document.getElementById(listId).style.display = 'none';
    document.getElementById(detailId).style.display = 'flex';
    document.getElementById(detailId.replace('-detail', '-detail-title')).innerText = title;
    
    let text = contentsDB[contentKey] || "عذراً، النص غير متوفر حالياً.";
    document.getElementById(textId).innerText = text;
}

// العودة للقائمة
function backToList(listId, detailId) {
    document.getElementById(detailId).style.display = 'none';
    document.getElementById(listId).style.display = 'flex';
}