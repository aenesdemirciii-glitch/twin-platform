export interface BlogPostItem {
  id?: string
  slug: string
  title: string
  category: string
  date?: string
  createdAt?: string | Date
  imageUrl?: string
  imagePlaceholder?: string
  excerpt: string
  content: string
  isActive?: boolean
}

export const blogPosts: BlogPostItem[] = [
  {
    slug: "hakiki-balin-faydalari-ve-dogallik-rehberi",
    title: "Hakiki Balın Sağlığa Mucizevi Faydaları ve Doğallık Rehberi",
    category: "Doğal Lezzetler",
    date: "13 Ekim 2026",
    createdAt: new Date("2026-10-13"),
    imageUrl: "/uploads/blog_covers/bal_faydalari.jpg",
    excerpt: "Doğanın en saf şifa kaynağı hakiki bal; bağışıklığı güçlendirmekten enerji vermeye kadar sofralarımızın baş tacı. Peki gerçek bal vücudumuza ne gibi faydalar sağlar ve nasıl tüketilmelidir?",
    content: `Binlerce yıldır insanlığın en kadim şifa kaynaklarından biri olan bal; yalnızca tatlı bir lezzet değil, arıların binbir çiçekten süzdüğü mucizevi bir besin deposudur. İçeriğindeki zengin enzimler, antioksidanlar, vitaminler ve mineraller sayesinde hakiki bal, sağlıklı yaşamın vazgeçilmez bir parçasıdır.

### Güçlü Bir Doğal Bağışıklık Kalkanı
Hakiki yayla ve çam balları, yüksek oranda flavonoid ve fenolik bileşen içerir. Bu güçlü antioksidan yapı, vücudu serbest radikallere karşı koruyarak bağışıklık sistemini destekler. Mevsim geçişlerinde ve kış aylarında düzenli tüketilen bir kaşık ham bal, soğuk algınlığına karşı doğal bir koruma sağlar.

### Gün Boyu Zindelik ve Doğal Enerji Kaynağı
Rafine şekerlerin aksine bal, fruktoz ve glikoz gibi doğal şekerleri bünyesinde barındırır. Bu sayede kan şekerinde ani dalgalanmalara yol açmadan vücuda uzun süreli ve temiz bir enerji sağlar. Spor öncesinde ya da yoğun iş temposunda güne başlarken ılık suya karıştırılan bir tatlı kaşığı bal, gün boyu zinde kalmanıza yardımcı olur.

### Boğazı Yumuşatıcı ve Sindirimi Rahatlatıcı Etki
Balın doğal antibakteriyel ve yatıştırıcı nitelikleri, boğaz tahrişlerinde ve kuru öksürüklerde anında rahatlama sağlar. Aynı zamanda prebiyotik özelliği sayesinde sindirim sistemindeki faydalı bakterilerin beslenmesine katkıda bulunur, mideyi rahatlatır.

### Gerçek Bal Kristalleşir mi?
Tüketiciler arasında yaygın bir yanılgı, kristalleşen (donan) balın sahte olduğudur. Oysa ki işlem görmemiş, ısıl işleme tabi tutulmamış **saf ham balın zamanla kristalleşmesi doğallığının en somut kanıtıdır**. Glikoz şurubu veya katkı maddesi içeren sahte ballar kristalleşmezken, saf çiçek balları soğuk ortamda krem kıvamına geçebilir.

### Bal Tüketirken Dikkat Edilmesi Gereken Püf Noktalar
Balın içerisindeki canlı enzimlerin ve şifalı bileşenlerin zarar görmemesi için **asla kaynar çaya, kaynar süte veya kaynayan suya karıştırılmamalıdır**. İçeceklerin sıcaklığı 40°C'nin altına düştüğünde (içilebilir ılık kıvamdayken) eklenmeli ya da tercihen tahta kaşıkla doğrudan tüketilmelidir.

İkizler Baharatçılık olarak 1989'dan bugüne, katkısız ve analiz edilmiş en saf yayla ve çam ballarını sofralarınıza güvenle ulaştırmaktan gurur duyuyoruz.`,
    isActive: true
  },
  {
    slug: "cevizin-faydalari-nelerdir",
    title: "Cevizin Faydaları: Neden Her Gün Tüketmeliyiz?",
    category: "Sağlıklı Yaşam",
    date: "12 Ekim 2026",
    createdAt: new Date("2026-10-12"),
    imageUrl: "/uploads/blog_covers/ceviz.jpg",
    excerpt: "Beyin dostu ceviz, kalp sağlığından sindirim sistemine kadar birçok fayda sunar. Peki cevizi nasıl ve ne kadar tüketmeliyiz?",
    content: `Ceviz, hem lezzeti hem de sunduğu inanılmaz sağlık faydalarıyla kuruyemiş dünyasının şüphesiz yıldızlarından biridir. İçerdiği yüksek omega-3 yağ asitleri sayesinde beyin fonksiyonlarını desteklediği uzun yıllardır bilinen bir gerçektir.

### Kalp Dostu Bir Seçim
Her gün bir avuç ceviz tüketmek, kötü kolesterol (LDL) seviyelerinin düşmesine yardımcı olur. Aynı zamanda kan damarlarının esnekliğini koruyarak kalp krizi riskini azaltır.

### Günlük Ne Kadar Tüketilmeli?
Uzmanlar, günde ortalama 3-4 tam ceviz (veya bir avuç) tüketmenin günlük ihtiyaç duyulan sağlıklı yağları almak için ideal olduğunu belirtmektedir. Özellikle sabah kahvaltılarında veya ara öğünlerde yoğurt ve yulaf ile birlikte harika bir enerji kaynağı oluşturur.`,
    isActive: true
  },
  {
    slug: "kavrulmus-ve-cig-kuruyemis-farki",
    title: "Kavrulmuş ve Çiğ Kuruyemiş Arasındaki Farklar Nelerdir?",
    category: "Beslenme Rehberi",
    date: "5 Ekim 2026",
    createdAt: new Date("2026-10-05"),
    imageUrl: "/uploads/blog_covers/nuts.jpg",
    excerpt: "Kuruyemiş alırken çiğ mi yoksa kavrulmuş mu tercih etmelisiniz? Besin değerleri nasıl değişiyor?",
    content: `Kuruyemişleri çiğ veya kavrulmuş olarak tüketmek tamamen damak tadınıza bağlı gibi görünse de, işin beslenme boyutunda bazı önemli detaylar bulunur.

### Besin Değeri Kaybı Yaşanır Mı?
Kavurma işlemi genellikle kuruyemişin aromasını ve çıtırlığını artırır. Ancak çok yüksek ısıda kavurma, kuruyemişte bulunan B vitaminleri gibi sıcağa duyarlı bazı vitaminlerin azalmasına neden olabilir. İkizler Baharatçılık olarak ürünlerimizi tam kıvamında ve besin değerlerini minimum düzeyde etkileyecek özel tekniklerle kavuruyoruz.

### Hangi Durumda Çiğ Tercih Edilmeli?
Eğer kuruyemişlerden en yüksek oranda doğal yağ, mineral ve vitamin almak istiyorsanız veya diyetiniz gereği tamamen işlenmemiş ürünler tüketiyorsanız, çiğ (kavrulmamış) ceviz, badem veya fındık tercih edebilirsiniz. Çifte kavrulmuş ürünlerimiz ise sohbetlerin ve akşam çaylarının vazgeçilmezidir!`,
    isActive: true
  },
  {
    slug: "antep-fistigi-hakkinda-ilginc-bilgiler",
    title: "Boz İç Antep Fıstığı Neden Daha Değerli?",
    category: "Ürün İncelemeleri",
    date: "28 Eylül 2026",
    createdAt: new Date("2026-10-01"),
    imageUrl: "/uploads/blog_covers/antep_fistigi.jpg",
    excerpt: "Baklavaların gizli kahramanı boz iç fıstık nedir ve normal Antep fıstığından neden daha kıymetlidir?",
    content: `Gaziantep yöresinin altın değerindeki ürünü Antep fıstığı, hasat zamanına göre farklı isimler alır. Kırmızı kabuklu, tam olgunlaşmış fıstıklar kuruyemiş olarak tüketilirken, baklavacılıkta "Boz İç" fıstık kullanılır.

### Boz İç Nedir?
Fıstık henüz tam olgunlaşmadan, yani içi kırmızıya dönmeden bir ay önce hasat edilirse buna boz fıstık denir. Bu dönemde fıstığın içi zümrüt yeşilidir ve aroma olarak en yoğun olduğu evredir.

### Neden Daha Pahalı?
Henüz tam büyümeden hasat edildiği için ağaçtan alınan toplam ürün ağırlığı düşüktür. Bir kilo boz iç fıstık elde etmek için çok daha fazla fıstık harcanır. Ancak sunduğu o eşsiz tat ve muazzam yeşil renk, tatlılarda onu vazgeçilmez kılar.`,
    isActive: true
  }
]
