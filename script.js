// GANTI dengan URL Web App dari Google Apps Script Anda
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzv3V0lTd3Ie1TsqmCETng5n0iQC0Qk0knxYPedgfp9gXgdqQJ6jNojLyt_95Q7zG_jVw/exec";

async function loadServiceData() {
    const container = document.getElementById('app-container');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();

        // Sembunyikan loader
        loader.classList.add('hidden');

        if (data.length === 0) {
            container.innerHTML = `<p class="text-center col-span-full py-10 text-gray-400">Belum ada data servis.</p>`;
            return;
        }

        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = "service-card border border-slate-200 rounded-xl p-5 shadow-sm card-animate";
            card.style.animationDelay = `${index * 0.1}s`;

            // Format Rupiah
            const biayaFormatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(item.Biaya || 0);

            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg text-slate-800">${item['Nama Pelanggan']}</h3>
                        <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                            ${item['Jenis Motor']}
                        </span>
                    </div>
                    <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        ${item.Tanggal || ''}
                    </span>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex gap-2">
                        <i data-lucide="alert-circle" class="w-4 h-4 text-orange-500 mt-1"></i>
                        <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Keluhan:</span> ${item.Keluhan}</p>
                    </div>
                    <div class="flex gap-2">
                        <i data-lucide="check-circle" class="w-4 h-4 text-green-500 mt-1"></i>
                        <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Tindakan:</span> ${item.Tindakan}</p>
                    </div>
                </div>

                <div class="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center">
                    <span class="text-sm text-slate-500 text-xs font-medium">Total Biaya</span>
                    <span class="font-bold text-blue-600 text-lg">${biayaFormatted}</span>
                </div>
            `;
            container.appendChild(card);
        });

        // Inisialisasi ulang icon Lucide setelah konten ditambahkan
        lucide.createIcons();

    } catch (error) {
        console.error('Error fetching data:', error);
        loader.innerHTML = `
            <div class="text-red-500 text-center">
                <i data-lucide="wifi-off" class="mx-auto w-10 h-10 mb-2"></i>
                <p>Gagal terhubung ke database. Pastikan URL API benar.</p>
            </div>
        `;
        lucide.createIcons();
    }
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadServiceData();
    lucide.createIcons();
});
