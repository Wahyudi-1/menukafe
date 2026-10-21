/* =========================================
   1. DATA MENU KAFE (PENGGANTI DATABASE)
   ========================================= */
// Kita menggunakan Array of Objects untuk menyimpan data menu.
// Jika ada menu baru atau perubahan harga, siswa cukup mengubah bagian ini.
const dataMenu = [
    {
        id: 1,
        nama: "Kopi Susu Gula Aren",
        harga: 18000,
        kategori: "kopi",
        gambar: "https://images.unsplash.com/photo-1593443320739-77f74939d0da?w=300&q=80" // Bisa diganti dengan nama file lokal, misal: "assets/kopi-aren.jpg"
    },
    {
        id: 2,
        nama: "Americano Dingin",
        harga: 15000,
        kategori: "kopi",
        gambar: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&q=80"
    },
    {
        id: 3,
        nama: "Matcha Latte",
        harga: 22000,
        kategori: "non-kopi",
        gambar: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=300&q=80"
    },
    {
        id: 4,
        nama: "Es Cokelat Klasik",
        harga: 20000,
        kategori: "non-kopi",
        gambar: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&q=80"
    },
    {
        id: 5,
        nama: "Croissant Mentega",
        harga: 18000,
        kategori: "makanan",
        gambar: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80"
    },
    {
        id: 6,
        nama: "Kentang Goreng",
        harga: 15000,
        kategori: "makanan",
        gambar: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80"
    }
];

/* =========================================
   2. VARIABEL & MENGAMBIL ELEMEN HTML
   ========================================= */
// Mengambil keranjang dari LocalStorage (memori browser). Jika kosong, buat array kosong [].
let keranjang = JSON.parse(localStorage.getItem("keranjangKafe")) || [];

const tempatMenu = document.getElementById("daftar-menu");
const tempatKeranjang = document.getElementById("item-keranjang");
const teksTotal = document.getElementById("teks-total");
const badgeJumlah = document.getElementById("badge-jumlah");
const tombolFilter = document.querySelectorAll(".btn-filter");
const tombolPesan = document.getElementById("tombol-pesan");

// Fungsi bantuan untuk mengubah angka menjadi format uang Rupiah (contoh: 15000 -> Rp 15.000)
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);
}

/* =========================================
   3. MENAMPILKAN DATA MENU KE LAYAR
   ========================================= */
function tampilkanMenu(data) {
    // Kosongkan tempat menu terlebih dahulu
    tempatMenu.innerHTML = "";

    // Lakukan perulangan untuk setiap menu yang ada di dalam data
    data.forEach((menu) => {
        // Membuat elemen div pembungkus kartu menu
        const kartu = document.createElement("div");
        kartu.classList.add("kartu-menu");

        // Mengisi kartu menu dengan HTML. Kita gunakan "Template Literal" (tanda backtick ` `)
        kartu.innerHTML = `
            <img src="${menu.gambar}" alt="${menu.nama}">
            <div class="info-menu">
                <h3>${menu.nama}</h3>
                <p class="harga-menu">${formatRupiah(menu.harga)}</p>
                <button class="btn-tambah" onclick="tambahKeKeranjang(${menu.id})">Tambah</button>
            </div>
        `;

        // Masukkan kartu yang sudah dibuat ke dalam HTML utama
        tempatMenu.appendChild(kartu);
    });
}

/* =========================================
   4. FITUR FILTER KATEGORI
   ========================================= */
tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (e) => {
        // Hapus class "aktif" dari semua tombol
        tombolFilter.forEach(btn => btn.classList.remove("aktif"));
        // Tambahkan class "aktif" ke tombol yang sedang diklik
        e.target.classList.add("aktif");

        // Ambil nilai kategori dari atribut data-kategori HTML
        const kategoriDipilih = e.target.getAttribute("data-kategori");

        if (kategoriDipilih === "semua") {
            tampilkanMenu(dataMenu); // Tampilkan semua jika "semua" dipilih
        } else {
            // Saring (filter) array dataMenu sesuai kategori yang dipilih
            const menuDisaring = dataMenu.filter((menu) => menu.kategori === kategoriDipilih);
            tampilkanMenu(menuDisaring);
        }
    });
});

/* =========================================
   5. FITUR KERANJANG PESANAN
   ========================================= */
function tambahKeKeranjang(idMenu) {
    // Cari data menu berdasarkan ID yang diklik
    const menuDipilih = dataMenu.find((menu) => menu.id === idMenu);
    
    // Cek apakah menu tersebut sudah ada di dalam keranjang
    const itemAda = keranjang.find((item) => item.id === idMenu);

    if (itemAda) {
        // Jika sudah ada, cukup tambahkan jumlah porsinya (qty)
        itemAda.qty += 1;
    } else {
        // Jika belum ada, masukkan sebagai menu baru di keranjang dengan jumlah porsi = 1
        keranjang.push({
            id: menuDipilih.id,
            nama: menuDipilih.nama,
            harga: menuDipilih.harga,
            qty: 1
        });
    }

    // Perbarui keranjang di layar dan simpan ke LocalStorage
    perbaruiKeranjang();
}

function hapusDariKeranjang(idMenu) {
    // Saring isi keranjang, sisakan item yang ID-nya TIDAK SAMA dengan yang dihapus
    keranjang = keranjang.filter((item) => item.id !== idMenu);
    perbaruiKeranjang();
}

function perbaruiKeranjang() {
    tempatKeranjang.innerHTML = "";
    let totalHarga = 0;
    let totalItem = 0;

    if (keranjang.length === 0) {
        tempatKeranjang.innerHTML = `<p class="teks-kosong">Belum ada pesanan.</p>`;
    } else {
        keranjang.forEach((item) => {
            totalHarga += (item.harga * item.qty); // Hitung total harga
            totalItem += item.qty; // Hitung total porsi

            const elemenItem = document.createElement("div");
            elemenItem.classList.add("item-pesanan");
            elemenItem.innerHTML = `
                <div>
                    <strong>${item.nama}</strong> <br>
                    <small>${item.qty} x ${formatRupiah(item.harga)}</small>
                </div>
                <div>
                    <strong>${formatRupiah(item.harga * item.qty)}</strong>
                    <button style="color:red; background:none; border:none; margin-left:10px; cursor:pointer;" onclick="hapusDariKeranjang(${item.id})">❌</button>
                </div>
            `;
            tempatKeranjang.appendChild(elemenItem);
        });
    }

    // Tampilkan ke HTML
    teksTotal.innerText = formatRupiah(totalHarga);
    badgeJumlah.innerText = totalItem;

    // Simpan data keranjang ke LocalStorage (diubah jadi teks JSON)
    localStorage.setItem("keranjangKafe", JSON.stringify(keranjang));
}

/* =========================================
   6. PROSES PESANAN KE WHATSAPP (CHECKOUT)
   ========================================= */
tombolPesan.addEventListener("click", () => {
    const nomorMeja = document.getElementById("nomor-meja").value;

    // Validasi: Pastikan keranjang tidak kosong dan nomor meja sudah diisi
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong! Silakan pilih menu dulu.");
        return;
    }
    if (!nomorMeja) {
        alert("Mohon isi nomor meja Anda!");
        return;
    }

    // Nomor WhatsApp Kasir Kafe (Ganti dengan nomor tujuan sesungguhnya. Awali dengan 62 tanpa +)
    const nomorWhatsApp = "6281234567890";
    
    // Menyusun isi pesan teks
    let pesanTeks = `Halo Kasir! Saya ingin memesan dari *Meja ${nomorMeja}*.\n\n*Rincian Pesanan:*\n`;
    
    let totalHarga = 0;
    keranjang.forEach((item) => {
        pesanTeks += `- ${item.qty}x ${item.nama} (${formatRupiah(item.harga * item.qty)})\n`;
        totalHarga += (item.harga * item.qty);
    });

    pesanTeks += `\n*Total Harga: ${formatRupiah(totalHarga)}*\n\nTerima kasih!`;

    // Ubah teks agar aman digunakan di URL (menghindari error karena spasi/karakter khusus)
    const pesanEncoded = encodeURIComponent(pesanTeks);

    // Buka tab baru menuju link WhatsApp
    window.open(`https://wa.me/${nomorWhatsApp}?text=${pesanEncoded}`, "_blank");

    // (Opsional) Kosongkan keranjang setelah pesan dikirim
    keranjang = [];
    document.getElementById("nomor-meja").value = "";
    perbaruiKeranjang();
});

/* =========================================
   7. EKSEKUSI PERTAMA KALI HALAMAN DIBUKA
   ========================================= */
// Panggil fungsi ini agar menu dan keranjang langsung muncul saat web di-refresh
tampilkanMenu(dataMenu);
perbaruiKeranjang();
