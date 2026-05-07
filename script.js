// GANTI DENGAN URL WEB APP HASIL DEPLOY ULANG ANDA
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzv3V0lTd3Ie1TsqmCETng5n0iQC0Qk0knxYPedgfp9gXgdqQJ6jNojLyt_95Q7zG_jVw/exec";

// Inisialisasi Icon Lucide
const initIcons = () => lucide.createIcons();

// Fungsi Mengambil Data dari Spreadsheet
async function loadData() {
    const container = document.getElementById('app-container');
    const loader = document.getElementById('loader');
    
    loader.classList.remove('hidden');
    
    try {
        const response = await fetch(`${SHEET_URL}?t=${new Date().getTime()}`);
        const data = await response.json();
        
        loader.classList.add('hidden');
        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = "<p class='col-span-full text-center py-10 text-slate-400'>Belum ada riwayat servis.</p>";
            return;
        }

        // Urutkan dari yang terbaru
        data.reverse().forEach((item, index) => {
            const biayaFormat = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(item.Biaya || 0);

            const card = document.createElement('div');
            card.className = "service-card p-5 rounded-2xl border border-slate-200 shadow-sm card-animate";
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-slate-800">${item['Nama Pelanggan'] || 'Umum'}</h3>
                    <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">${item.Tanggal || ''}</span>
                </div>
                <p class="text-xs font-bold text-blue-600 mb-3 bg-blue-50 inline-block px-2 py-0.5 rounded">${item['Jenis Motor'] || '-'}</p>
                <div class="space-y-1.5 mb-4">
                    <p class="text-sm text-slate-600 flex gap-2"><i data-lucide="alert-circle" class="w-4 h-4 text-orange-400"></i> ${item.Keluhan || '-'}</p>
                    <p class="text-sm text-slate-600 flex gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-400"></i> ${item.Tindakan || '-'}</p>
                </div>
                <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Biaya</span>
                    <span class="font-black text-blue-700 text-lg">${biayaFormat}</span>
                </div>
            `;
            container.appendChild(card);
        });
        initIcons();
    } catch (error) {
        console.error("Fetch Error:", error);
        loader.innerHTML = "<p class='text-red-500 text-sm'>Gagal memuat data. Periksa koneksi atau URL Apps Script.</p>";
    }
}

// Fungsi Mengirim Data ke Spreadsheet
document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-simpan');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = "Menyimpan...";

    const payload = {
        nama: document.getElementById('nama').value,
        motor: document.getElementById('motor').value,
        keluhan: document.getElementById('keluhan').value,
        tindakan: document.getElementById('tindakan').value,
        biaya: document.getElementById('biaya').value,
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    try {
        // Menggunakan fetch POST
        await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', // Penting untuk Google Apps Script
            body: JSON.stringify(payload)
        });

        alert("Data Berhasil Disimpan!");
        document.getElementById('service-form').reset();
        
        // Reload data setelah jeda singkat agar Spreadsheet sempat memproses
        setTimeout(loadData, 1500);
    } catch (error) {
        console.error("Save Error:", error);
        alert("Gagal menyimpan data ke server.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        initIcons();
    }
});

// Event Listener tombol refresh
document.getElementById('refresh-btn').addEventListener('click', loadData);

// Jalankan saat halaman pertama kali dibuka
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    initIcons();
});
