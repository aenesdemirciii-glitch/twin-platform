export interface StaticPageData {
  title: string
  seoTitle: string
  metaDescription: string
  menuLocation?: string
  content: string
  isSpecial?: "toptan" | "hakkimizda" | "default"
  breadcrumbs?: { title: string; href: string }[]
}

export const STATIC_PAGES: Record<string, StaticPageData> = {
  "hakkimizda": {
    title: "Hakkımızda",
    seoTitle: "Hakkımızda | İkizler Baharatçılık - 1989'dan Beri Güvenle",
    metaDescription: "İkizler Baharatçılık, 1989'dan bu yana baharat, kuruyemiş, kuru meyve ve yöresel lezzetleri güven ve şeffaflıkla sofralarınıza taşıyor.",
    menuLocation: "Kurumsal",
    isSpecial: "hakkimizda",
    content: `İkizler Baharatçılık, 1989'dan bu yana baharat, kuruyemiş, kuru meyve ve yöresel ürünleri müşterileriyle buluşturuyor. İstanbul Kadıköy'deki adresimiz ve online mağazamız üzerinden bireysel müşterilere ve işletmelere hizmet veriyoruz.

Ürün yelpazemizde baharatlar, kuruyemişler, kuru meyveler, bal ve arı ürünleri, pekmezler, sirkeler, kahveler, fonksiyonel çaylar, yağ ve aromalar, lokum ve şekerlemeler ile bitkisel kozmetik ve sabun çeşitleri yer alır. Her ürünün içeriği, gramajı, kullanım veya saklama bilgisi ve varsa alerjen uyarısı ürün sayfasında ya da ambalajında açıkça gösterilir.

Bizim için iyi alışveriş; doğru ürün bilgisinin verilmesi, ürünün uygun koşullarda saklanması, özenle paketlenmesi ve müşterinin ihtiyaç duyduğunda ulaşabileceği bir muhatap bulmasıdır. Sorulara açık, satış sonrasında erişilebilir ve ürün bilgisi konusunda şeffaf bir hizmet sunmayı amaçlıyoruz.

### Misyonumuz

Günlük mutfak ihtiyaçlarından özel tariflere kadar geniş bir ürün seçkisini, anlaşılır ürün bilgileri ve güvenilir hizmetle müşterilerimize ulaştırmak.

### Vizyonumuz

Baharat ve doğal ürün alışverişinde ürün bilgisinin, izlenebilirliğin ve müşteri iletişiminin güçlü olduğu güvenilir bir marka olmak.

### Değerlerimiz

* **Şeffaflık:** Ürün adı, içerik, gramaj, fiyat, alerjen, saklama ve teslimat bilgilerini açık biçimde sunarız.
* **Özen:** Ürünlerin depolanması, hazırlanması ve sevkiyatında ürün niteliğine uygun süreçler izleriz.
* **Erişilebilirlik:** Sipariş öncesi ve sonrasında müşterilerimizin bize ulaşabilmesini önemseriz.
* **Sorumlu İletişim:** Gıda, bitkisel ürün ve kozmetik ürünlerde doğrulanmamış sağlık veya tedavi iddiaları kullanmayız.

### İletişim

Sorularınız, siparişleriniz ve toptan alım talepleriniz için **0534 720 19 00**, **info@ikizlerbaharatcilik.com** veya mağaza iletişim sayfamız üzerinden bize ulaşabilirsiniz.`
  },

  "toptan": {
    title: "Toptan Baharat ve Kuruyemiş",
    seoTitle: "Toptan Baharat ve Kuruyemiş | İkizler Baharatçılık",
    metaDescription: "Kafe, restoran, otel, pastane, perakendeci ve kurumsal alımlar için toptan baharat ve kuruyemiş teklifinizi oluşturun.",
    menuLocation: "Kurumsal",
    isSpecial: "toptan",
    content: `Kafe, restoran, otel, pastane, market, aktar, üretici ve kurumsal hediye alımları için ürün ve miktara göre toptan teklif hazırlıyoruz. Teklif; ürün niteliği, ambalaj seçeneği, sipariş miktarı, teslimat adresi ve dönemsel tedarik durumuna göre oluşturulur.

### Ürün Grupları

Baharat, kuruyemiş, kuru meyve, kahve, lokum ve şekerleme, bal ve arı ürünleri, pekmez, sirke, bitkisel çay, yağ ve aroma ile sabun ve bitkisel kozmetik gruplarında toptan talep iletebilirsiniz. Güncel ürün listesi ve uygun ambalaj seçenekleri talebinize göre paylaşılır.

### Kurumsal Teklif ve Hızlı Sipariş

Toplu siparişlerinizde işletmenize özel gramaj, ambalajlama ve periyodik sevkiyat çözümleri sunuyoruz. Hemen bizimle iletişime geçerek firmanıza özel fiyat teklifinizi alabilirsiniz.`
  },

  "toptan-satis": {
    title: "Toptan Baharat ve Kuruyemiş",
    seoTitle: "Toptan Baharat ve Kuruyemiş | İkizler Baharatçılık",
    metaDescription: "Kafe, restoran, otel, pastane, perakendeci ve kurumsal alımlar için toptan baharat ve kuruyemiş teklifinizi oluşturun.",
    menuLocation: "Kurumsal",
    isSpecial: "toptan",
    content: `Kafe, restoran, otel, pastane, market, aktar, üretici ve kurumsal hediye alımları için ürün ve miktara göre toptan teklif hazırlıyoruz. Teklif; ürün niteliği, ambalaj seçeneği, sipariş miktarı, teslimat adresi ve dönemsel tedarik durumuna göre oluşturulur.

### Ürün Grupları

Baharat, kuruyemiş, kuru meyve, kahve, lokum ve şekerleme, bal ve arı ürünleri, pekmez, sirke, bitkisel çay, yağ ve aroma ile sabun ve bitkisel kozmetik gruplarında toptan talep iletebilirsiniz. Güncel ürün listesi ve uygun ambalaj seçenekleri talebinize göre paylaşılır.

### Kurumsal Teklif ve Hızlı Sipariş

Toplu siparişlerinizde işletmenize özel gramaj, ambalajlama ve periyodik sevkiyat çözümleri sunuyoruz. Hemen bizimle iletişime geçerek firmanıza özel fiyat teklifinizi alabilirsiniz.`
  },

  "mesafeli-satis-sozlesmesi": {
    title: "Mesafeli Satış Sözleşmesi",
    seoTitle: "Mesafeli Satış Sözleşmesi | İkizler Baharatçılık",
    metaDescription: "İkizler Baharatçılık online siparişlerine ilişkin ödeme, teslimat, cayma, iade ve uyuşmazlık koşullarını inceleyin.",
    menuLocation: "Yasal ve ödeme adımı",
    content: `### Madde 1 Taraflar

**Satıcı**

* **Ticaret Unvanı:** İkizler Baharatçılık
* **Vergi Dairesi / No:** Kadıköy V.D.
* **Adres:** Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul
* **Telefon:** 0534 720 19 00
* **E-posta:** info@ikizlerbaharatcilik.com
* **KEP Adresi:** info@ikizlerbaharatcilik.com

**Alıcı**

* **Ad Soyad veya Unvan:** [Sipariş Ekranında Girilen Müşteri Bilgisi]
* **Telefon:** [Müşteri Telefon Numarası]
* **E-posta:** [Müşteri E-Posta Adresi]
* **Teslimat Adresi:** [Müşteri Teslimat Adresi]
* **Fatura Adresi:** [Müşteri Fatura Adresi]

Satıcı ve Alıcı bundan sonra ayrı ayrı “Taraf”, birlikte “Taraflar” olarak anılır.

### Madde 2 Sözleşmenin Konusu ve Dayanağı

Bu sözleşme, Alıcının www.ikizlerbaharatcilik.com üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimiyle ilgili Tarafların hak ve yükümlülüklerini düzenler. Sözleşme; 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat çerçevesinde uygulanır.

### Madde 3 Sözleşme Bilgileri

* **Sipariş Numarası:** [Sipariş Sırasında Üretilen Benzersiz Sipariş No]
* **Sipariş Tarihi ve Saati:** [Sipariş Tarih ve Zaman Damgası]
* **Ürünler, Seçenekler, Miktarlar ve Temel Nitelikler:** [Siparişe Konu Ürün Listesi]
* **Ürün Toplamı:** [Sepet Ürün Tutarı]
* **İndirim Tutarı:** [Uygulanan Kupon veya Kampanya İndirimi]
* **Kargo veya Kurye Bedeli:** [Hesaplanan Teslimat Bedeli]
* **Vergiler Dâhil Genel Toplam:** [Toplam Tahsil Edilen Tutar]
* **Ödeme Yöntemi:** [Kredi Kartı / Banka Kartı / Havale]
* **Teslimat Yöntemi ve Süresi:** [Kargo / Aynı Gün Kurye]

### Madde 4 Sözleşmenin Kurulması ve Saklanması

Alıcı, siparişi tamamlamadan önce ürün ve fiyat bilgisini, Ön Bilgilendirme Formunu ve bu sözleşmeyi inceleyebilir; veri giriş hatalarını düzeltebilir. Ödeme yükümlülüğü doğuran sipariş düğmesine basılması ve ödemenin onaylanmasıyla sözleşme elektronik ortamda kurulur. Sözleşme ve ön bilgilendirme kaydı, ilgili mevzuatta öngörülen süre boyunca saklanır ve Alıcıya kalıcı veri saklayıcısıyla iletilir.

### Madde 5 Ödeme

Alıcı, toplam bedeli ödeme adımında seçtiği yöntemle öder. Banka veya ödeme hizmeti sağlayıcısının kart, taksit, provizyon ve güvenlik kuralları uygulanabilir. Satıcı, Alıcının açıkça onaylamadığı ilave bir bedeli tahsil etmez.

### Madde 6 Teslimat

Ürün, siparişte belirtilen adrese ve kişiye teslim edilir. Teslim süresi ürün veya ödeme ekranında gösterilir; açık bir süre taahhüt edilmemişse teslimat yasal azami süreyi aşmaz. Alıcının talebine göre özel hazırlanan ürünlerde daha uzun süre ayrıca kararlaştırılabilir.

Teslimata kadar oluşan kayıp ve hasardan Satıcı sorumludur. Alıcının, Satıcının belirlediği taşıyıcı dışında başka bir taşıyıcı seçmesi hâlinde sorumluluk, ürünün bu taşıyıcıya teslimiyle Alıcıya geçer.

Teslimatın Alıcının verdiği eksik veya yanlış bilgi, adreste bulunmama ya da teslimi kabul etmeme nedeniyle yapılamaması hâlinde oluşacak yeni teslimat koşulları Alıcıya bildirilir. Bu hüküm tüketicinin emredici haklarını ortadan kaldırmaz.

### Madde 7 İfanın İmkânsızlaşması

Sipariş konusu ürünün tesliminin imkânsızlaşması hâlinde Satıcı durumu öğrendiği tarihten itibaren üç gün içinde Alıcıya bildirir ve teslimat masrafları dâhil tahsil edilen ödemeleri bildirimden itibaren en geç 14 gün içinde iade eder. Ürünün stokta bulunmaması tek başına imkânsızlaşma sayılmaz.

### Madde 8 Cayma Hakkı

Tüketici sıfatını taşıyan Alıcı, yasal istisnalar dışında, ürünü kendisinin veya belirlediği üçüncü kişinin teslim aldığı günden itibaren 14 gün içinde gerekçe göstermeden ve cezai şart ödemeden cayabilir. Alıcı, sözleşmenin kurulmasından ürünün teslimine kadar olan sürede de cayma hakkını kullanabilir.

Cayma bildiriminin süre içinde info@ikizlerbaharatcilik.com, 0534 720 19 00 veya Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul adresi üzerinden Satıcıya yöneltilmesi yeterlidir.

### Madde 9 İade Süreci

Alıcı, cayma bildiriminden itibaren 14 gün içinde ürünü anlaşmalı kargo aracılığıyla Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul adresine gönderir. Ürün, varsa standart aksesuarları ve makul olarak korunabilen ambalajıyla birlikte gönderilmelidir. Ambalajın bulunmaması tek başına yasal cayma hakkını ortadan kaldırmaz; ancak Alıcı ürünü işleyişine, teknik özelliklerine ve kullanım talimatlarına uygun biçimde kullandığı ölçüde meydana gelen değişiklik ve bozulmalardan sorumlu tutulmaz.

Ön bilgilendirmede belirtilen iade taşıyıcısının kullanılması veya taşıyıcı belirtilmemiş olması hâlinde tüketiciye iade masrafı yüklenmez. Alternatif taşıyıcı tercihi ve buna bağlı masraflar, mevzuata uygun biçimde önceden açıklanır.

### Madde 10 Geri Ödeme

Satıcı, cayma hâlinde iadesi gereken tüm ödemeleri mevzuattaki başlangıç anından itibaren 14 gün içinde, Alıcının satın alırken kullandığı ödeme aracına uygun ve Alıcıya masraf yüklemeyecek biçimde tek seferde iade eder. Banka veya ödeme kuruluşunun tutarı hesaba yansıtma süresi Satıcının kontrolü dışında olabilir.

### Madde 11 Cayma Hakkının İstisnaları

Kanuni koşulları oluştuğunda aşağıdaki sözleşmelerde cayma hakkı kullanılamaz:

* Alıcının istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan ürünler.
* Çabuk bozulabilen veya son kullanma tarihi çabuk geçebilecek ürünler.
* Teslimden sonra koruyucu ambalajı, bandı, mührü veya paketi açılan ve sağlık veya hijyen açısından iadesi uygun olmayan ürünler.
* Teslimden sonra başka ürünlerle karışan ve niteliği gereği ayrıştırılması mümkün olmayan ürünler.
* Mevzuatta sayılan diğer istisnalar.

### Madde 12 Ayıplı Yanlış veya Hasarlı Ürünler

Cayma hakkı istisnaları, ayıplı, yanlış, eksik veya taşıma sırasında hasar görmüş ürüne ilişkin yasal hakları kaldırmaz. Alıcı; sipariş numarası, sorunun açıklaması ve mümkünse fotoğraflarla Satıcıya başvurabilir. Satıcı talebi 6502 sayılı Kanun kapsamındaki seçimlik haklar doğrultusunda değerlendirir.

### Madde 13 Kişisel Veriler ve Ticari İletiler

Kişisel veriler KVKK Aydınlatma Metni uyarınca işlenir. Sipariş ve hizmet mesajları sözleşmenin yürütülmesi amacıyla gönderilebilir. Kampanya ve tanıtım amaçlı ticari elektronik iletiler için gerekli hâllerde ayrı onay alınır; bu onay sözleşmenin kurulma şartı değildir.

### Madde 14 Deliller ve Kayıtlar

Tarafların elektronik kayıtları, sipariş onayı, ödeme kaydı, kargo ve teslim kayıtları ile e-posta ve destek yazışmaları hukuka uygun biçimde delil olarak kullanılabilir. Bu hüküm, tüketicinin kanuni ispat haklarını sınırlamaz.

### Madde 15 Uyuşmazlıkların Çözümü

Alıcı, taleplerini öncelikle Satıcıya iletebilir. Uyuşmazlıklarda, yürürlükteki parasal sınırlar dâhilinde Alıcının yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyeti ya da görevli Tüketici Mahkemesi yetkilidir.

### Madde 16 Yürürlük

Alıcı, Ön Bilgilendirme Formunu ve bu sözleşmeyi siparişten önce okuduğunu, siparişin ödeme yükümlülüğü doğurduğunu anladığını ve elektronik ortamda onayladığını beyan eder.`
  },

  "mesafeli-satis": {
    title: "Mesafeli Satış Sözleşmesi",
    seoTitle: "Mesafeli Satış Sözleşmesi | İkizler Baharatçılık",
    metaDescription: "İkizler Baharatçılık online siparişlerine ilişkin ödeme, teslimat, cayma, iade ve uyuşmazlık koşullarını inceleyin.",
    menuLocation: "Yasal ve ödeme adımı",
    content: `Lütfen güncel sözleşme metnini incelemek için /sayfa/mesafeli-satis-sozlesmesi sayfasını ziyaret ediniz.`
  },

  "teslimat-ve-kargo": {
    title: "Teslimat ve Kargo Koşulları",
    seoTitle: "Teslimat ve Kargo Koşulları | İkizler Baharatçılık",
    metaDescription: "Sipariş hazırlama, kargo, İstanbul içi kurye, teslimat, hasar ve gecikme süreçleri hakkında bilgi alın.",
    menuLocation: "Bilgilendirme",
    content: `### Sipariş Hazırlama

Siparişler ödeme onayı ve stok kontrolünden sonra hazırlanır. Ürün sayfasında veya ödeme adımında farklı bir süre belirtilmedikçe hazırlık süresi **1-3 iş günüdür**. Resmî tatiller, kampanya dönemleri ve olağanüstü yoğunluklarda tahmini süre ödeme öncesinde güncellenir.

### Kargo Seçeneği

Gönderiler **anlaşmalı kargo firmalarımız (Yurtiçi Kargo / MNG Kargo)** ile yapılır. Kargo ücreti, ücretsiz kargo eşiği ve varsa bölgesel ek koşullar sepet ve ödeme ekranında sipariş tamamlanmadan önce gösterilir. Güncel ücretsiz kargo eşiği: **3.000 TL ve üzeri siparişlerde kargo ücretsizdir.**

### İstanbul İçi Aynı Gün Kurye

Aynı gün kurye seçeneğimiz; **Kadıköy, Ataşehir, Üsküdar, Maltepe ve çevre ilçelerde**, hafta içi her gün saat **14:00'e kadar** verilen siparişlerde sunulur. Kurye ücreti ve tahmini teslimat aralığı ödeme öncesinde gösterilir. Stok veya operasyon onayı alınmadan “aynı gün teslimat” garantisi verilmez.

### Teslimat Süresi

Tahmini teslimat süresi kargoya verildikten sonra **1-3 iş günüdür**. Bu süre tahminidir; sipariş için verilen açık teslim taahhüdü ve yasal azami süre saklıdır. Gönderi takip bilgisi **SMS ve E-posta** üzerinden paylaşılır.

### Adres ve Teslim Alan Kişi

Müşteri, teslimat bilgilerini sipariş tamamlanmadan önce kontrol etmelidir. Sipariş, müşterinin belirttiği kişiye teslim edilebilir. Eksik veya yanlış adres nedeniyle teslim edilemeyen gönderilerde müşteriyle iletişim kurularak yeni teslimat planı ve varsa ek masraf açıklanır.

### Hasar ve Kayıp

Satıcı, ürün müşteriye teslim edilene kadar oluşan kayıp ve hasardan sorumludur. Teslim sırasında dış ambalajda belirgin hasar varsa mümkünse taşıyıcı görevlisiyle tutanak tutulması ve fotoğraf çekilmesi incelemeyi kolaylaştırır. Tutanak tutulmamış olması tüketicinin kanuni haklarını kendiliğinden ortadan kaldırmaz.

### Gecikme veya Teslim İmkânsızlığı

Öngörülen teslim süresinde önemli bir gecikme yaşanırsa müşteri bilgilendirilir. Teslimin imkânsızlaşması hâlinde yasal bildirim ve iade süreleri uygulanır. Stokta bulunmama tek başına imkânsızlaşma kabul edilmez.

### İletişim

Teslimat soruları için sipariş numaranızla birlikte **info@ikizlerbaharatcilik.com** veya **0534 720 19 00** üzerinden bize ulaşabilirsiniz.`
  },

  "iade-ve-iptal-kosullari": {
    title: "İade İptal ve Cayma Hakkı",
    seoTitle: "İade İptal ve Cayma Hakkı | İkizler Baharatçılık",
    metaDescription: "Sipariş iptali, 14 günlük cayma hakkı, iade kargosu, geri ödeme, istisnalar ve hasarlı ürün sürecini inceleyin.",
    menuLocation: "Yasal",
    content: `### Sipariş İptali

Siparişiniz kargoya veya kuryeye teslim edilmeden önce **info@ikizlerbaharatcilik.com** ya da **0534 720 19 00** üzerinden iptal talebi iletebilirsiniz. Hazırlanmış veya taşıyıcıya teslim edilmiş siparişlerde cayma ve iade süreci uygulanır.

### Cayma Hakkı

Tüketici, yasal istisnalar dışında, ürünü kendisinin veya belirlediği üçüncü kişinin teslim aldığı tarihten itibaren **14 gün içinde** gerekçe göstermeden ve cezai şart ödemeden cayma hakkını kullanabilir. Cayma bildiriminin bu süre içinde yazılı olarak veya kalıcı veri saklayıcısıyla satıcıya yöneltilmesi yeterlidir.

### Cayma Bildirimi İçin Gerekli Bilgiler

* Ad soyad
* Sipariş numarası ve sipariş tarihi
* İade edilmek istenen ürün ve miktar
* Bildirim tarihi
* Tercih edilen iletişim kanalı
* Varsa hasar veya ayıp açıklaması ve fotoğraflar

### Ürünün Geri Gönderilmesi

Ürün, cayma bildiriminden itibaren 14 gün içinde anlaşmalı kargo şirketimiz ile **Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul** adresine gönderilmelidir. Ön bilgilendirmede belirtilen taşıyıcı kullanıldığında veya taşıyıcı belirtilmediğinde iade masrafı tüketiciye yüklenmez.

Ürün, niteliğini ve işleyişini anlamak için gerekli inceleme sınırları içinde ele alınmalıdır. Varsa standart aksesuar ve parçalarıyla birlikte gönderilmelidir. Ambalajın bulunmaması tek başına cayma hakkını kaldırmaz; ancak ürünün değerinde tüketicinin kusurundan doğan azalma ayrıca değerlendirilebilir.

### Geri Ödeme

İadesi gereken tutar, mevzuatta belirlenen başlangıç anından itibaren **14 gün içinde**, satın alma sırasında kullanılan ödeme aracına uygun biçimde ve tüketiciye masraf yüklemeden iade edilir. Banka veya ödeme kuruluşunun tutarı hesaba yansıtma süresi değişebilir.

### Cayma Hakkının Kullanılamayabileceği Ürünler

Yasal şartları oluştuğunda aşağıdaki ürünlerde cayma hakkı kullanılamaz:

* Müşterinin isteğine veya kişisel ihtiyacına göre özel hazırlanan ürünler.
* Çabuk bozulabilen veya son kullanma tarihi çabuk geçebilecek ürünler.
* Koruyucu ambalajı açıldıktan sonra sağlık ve hijyen açısından iadesi uygun olmayan ürünler (özellikle koruma bandı açılmış gıda, baharat, arı ürünleri ve bitkisel kozmetik ürünleri).
* Teslimden sonra başka ürünlerle karışan ve ayrıştırılması mümkün olmayan ürünler.
* Mevzuatta açıkça sayılan diğer istisnalar.

*Bir ürünün gıda veya kozmetik olması tek başına otomatik iade yasağı oluşturmaz. İstisna, ürün ve ambalaj durumu esas alınarak değerlendirilir.*

### Yanlış Hasarlı veya Ayıplı Ürün

Yanlış, eksik, hasarlı ya da ayıplı ürünlerde cayma hakkından bağımsız yasal haklarınız vardır. Sipariş numarası ve mümkünse fotoğraflarla bize ulaşın. Talebiniz; bedel iadesi, ayıpsız misliyle değişim, ücretsiz onarımın uygulanabildiği durumlar veya ayıp oranında bedel indirimi seçenekleri kapsamında değerlendirilir.

### Başvuru Kanalları

* **E-posta:** info@ikizlerbaharatcilik.com
* **Telefon:** 0534 720 19 00
* **Posta Adresi:** Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul`
  },

  "iade": {
    title: "İade İptal ve Cayma Hakkı",
    seoTitle: "İade İptal ve Cayma Hakkı | İkizler Baharatçılık",
    metaDescription: "Sipariş iptali, 14 günlük cayma hakkı, iade kargosu, geri ödeme, istisnalar ve hasarlı ürün sürecini inceleyin.",
    menuLocation: "Yasal",
    content: `Lütfen güncel iade ve iptal koşulları metnimizi incelemek için /sayfa/iade-ve-iptal-kosullari adresini ziyaret ediniz.`
  },

  "kvkk-aydinlatma-metni": {
    title: "KVKK Aydınlatma Metni",
    seoTitle: "KVKK Aydınlatma Metni | İkizler Baharatçılık",
    metaDescription: "Kişisel verilerin hangi amaçlarla, hangi hukuki sebeplerle işlendiği, kimlere aktarıldığı ve KVKK haklarınız hakkında bilgi alın.",
    menuLocation: "Yasal",
    content: `### 1. Veri Sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu **İkizler Baharatçılık** olup iletişim bilgileri şöyledir:

* **Adres:** Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul
* **Vergi Dairesi:** Kadıköy V.D.
* **E-posta:** info@ikizlerbaharatcilik.com
* **Telefon:** 0534 720 19 00

Bu metin; internet sitesi ziyaretçileri, üyeler, müşteriler, potansiyel müşteriler, iletişim veya teklif formu gönderenler ile müşteri hizmetlerine başvuran kişiler için geçerlidir.

### 2. İşlenen Kişisel Veri Kategorileri

Hizmetin kullanımına göre aşağıdaki veriler işlenebilir:

* **Kimlik:** Ad, soyad, fatura için gerekli kimlik veya vergi bilgileri.
* **İletişim:** Telefon, e-posta, teslimat ve fatura adresi.
* **Müşteri İşlemleri:** Üyelik, sepet, sipariş, ürün, teslimat, iade, fatura, talep ve şikâyet kayıtları.
* **Finans:** Ödeme türü, işlem, tahsilat ve iade bilgileri. *(Doğrulanmış Bilgi: Kredi kartı bilgileri sistemlerimizde tutulmamakta olup, BDDK lisanslı ödeme altyapısı Iyzico üzerinden 256-bit SSL şifreleme ile doğrudan işlenmektedir).*
* **İşlem Güvenliği:** IP adresi, tarih ve saat, oturum, cihaz ve sistem logları, güvenlik kayıtları.
* **Pazarlama:** Yalnız gerekli hukuki şart oluştuğunda iletişim tercihi, kampanya etkileşimi ve ticari ileti onay veya ret kaydı.
* **Hukuki İşlem:** Uyuşmazlık, başvuru, yetkili makam yazışması ve ispat kayıtları.
* **Çerez Verileri:** Çerez Aydınlatma Metninde açıklanan tanımlayıcılar ve tercihler.

*Özel nitelikli kişisel veri talep edilmez. Kullanıcıların iletişim alanlarına sağlık bilgisi veya başka özel nitelikli veri yazmaması gerekir.*

### 3. İşleme Amaçları ve Hukuki Sebepler

Kişisel veriler aşağıdaki amaç ve şartlarla işlenir:

* **Üyelik oluşturma, sipariş alma, ödeme ve teslimatı yürütme, iade ve müşteri desteği sağlama:** Sözleşmenin kurulması veya ifası için gerekli olma.
* **Fatura düzenleme, ticari ve mali kayıtları tutma, yetkili kurum taleplerini karşılama:** Kanunlarda açıkça öngörülme ve hukuki yükümlülüğün yerine getirilmesi.
* **Şikâyetleri çözme, hakları tesis etme veya savunma, uyuşmazlık kayıtlarını tutma:** Bir hakkın tesisi, kullanılması veya korunması için zorunlu olma.
* **Site ve işlem güvenliğini sağlama, dolandırıcılığı önleme, hizmet kalitesini ölçme:** Meşru menfaat ve gerektiğinde hukuki yükümlülük.
* **Zorunlu olmayan analitik veya reklam çerezleri ve kampanya iletileri:** Gerekli olduğu ölçüde açık rıza veya ticari elektronik ileti onayı.

### 4. Kişisel Verilerin Aktarılması

Veriler, yalnız amaçla sınırlı ve gerekli ölçüde aşağıdaki alıcı gruplarına aktarılabilir:

* Ödeme kuruluşları ve bankalar (Iyzico vb.).
* Kargo, kurye ve lojistik hizmeti sağlayıcıları.
* E-ticaret altyapısı, barındırma, yazılım, siber güvenlik, e-posta ve destek hizmeti sağlayıcıları.
* Muhasebe, mali müşavirlik, denetim, hukuk ve danışmanlık hizmeti sağlayıcıları.
* Kanunen yetkili kamu kurumları, adli veya idari merciler.

### 5. Yurt Dışına Aktarım

Kullanılan barındırma, e-posta, analitik veya destek servislerinde yurt dışına aktarım söz konusu olduğunda aktarım, 6698 sayılı Kanun'un 9. maddesindeki kanuni mekanizmalara uygun olarak yürütülür. Veriler öncelikli olarak Türkiye sınırları içindeki güvenli sunucularda barındırılmaktadır.

### 6. Toplama Yöntemleri

Veriler; internet sitesi formları, sipariş ve ödeme adımları, çerezler ve sunucu logları, e-posta, telefon, WhatsApp ve mağaza görüşmeleri aracılığıyla otomatik veya kısmen otomatik yöntemlerle toplanır.

### 7. Saklama Süreleri

Veriler, işleme amacının gerektirdiği süre ve ticaret, vergi, tüketici, elektronik ticaret, zamanaşımı ve diğer ilgili mevzuatta öngörülen saklama süreleri boyunca saklanır. Süre sonunda mevzuata uygun olarak silinir, yok edilir veya anonim hâle getirilir.

### 8. İlgili Kişinin Hakları

KVKK'nın 11. maddesi kapsamında veri sorumlusuna başvurarak:

* Kişisel verilerinizin işlenip işlenmediğini öğrenme,
* İşlenmişse bilgi talep etme,
* İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
* Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
* Eksik veya yanlış işlenmişse düzeltilmesini isteme,
* Şartları oluştuğunda silinmesini veya yok edilmesini isteme,
* Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme,
* Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme haklarına sahipsiniz.

### 9. Başvuru Yöntemi

Başvurularınızı Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul adresine yazılı olarak veya sistemimizde kayıtlı e-posta adresinizden **info@ikizlerbaharatcilik.com** adresine iletebilirsiniz. Talepler en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.

### 10. Güncellemeler

Yürürlük ve son güncelleme: 12 Ekim 2026`
  },

  "kvkk": {
    title: "KVKK Aydınlatma Metni",
    seoTitle: "KVKK Aydınlatma Metni | İkizler Baharatçılık",
    metaDescription: "Kişisel verilerin hangi amaçlarla işlendiği ve KVKK haklarınız hakkında bilgi alın.",
    menuLocation: "Yasal",
    content: `Lütfen güncel KVKK metnini incelemek için /sayfa/kvkk-aydinlatma-metni adresini ziyaret ediniz.`
  },

  "gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    seoTitle: "Gizlilik Politikası | İkizler Baharatçılık",
    metaDescription: "İkizler Baharatçılık sitesinde hangi bilgilerin toplandığını, nasıl kullanıldığını, paylaşıldığını ve korunduğunu öğrenin.",
    menuLocation: "Yasal",
    content: `Bu Gizlilik Politikası, www.ikizlerbaharatcilik.com sitesini ziyaret ettiğinizde, üyelik oluşturduğunuzda, sipariş verdiğinizde veya bizimle iletişim kurduğunuzda bilgilerinizin nasıl kullanıldığını açıklar. KVKK kapsamındaki ayrıntılı hukuki bilgi için KVKK Aydınlatma Metnini inceleyebilirsiniz.

### Topladığımız Bilgiler

Sipariş ve hizmet için ad, soyad, iletişim, teslimat, fatura, sipariş, ödeme işlemi, iade ve destek bilgileri alınabilir. Site güvenliği ve çalışması için IP, oturum ve cihaz kayıtları ile çerez tercihleri işlenebilir. İsteğe bağlı pazarlama tercihleri ayrı kaydedilir.

### Bilgileri Neden Kullanıyoruz

Bilgiler; hesabı ve siparişi yönetmek, ödemeyi sonuçlandırmak, ürünü teslim etmek, fatura düzenlemek, iade ve destek taleplerini karşılamak, dolandırıcılığı önlemek, yasal yükümlülükleri yerine getirmek ve izin verilen durumlarda kampanya iletmek için kullanılır.

### Bilgileri Kimlerle Paylaşıyoruz

Hizmetin yürütülmesi için gerekli veriler; ödeme kuruluşu, banka, kargo veya kurye, e-ticaret ve barındırma altyapısı, muhasebe ve profesyonel danışmanlar ile yetkili kamu kurumlarına amaçla sınırlı olarak aktarılabilir. Satış amacıyla üçüncü kişilere kişisel veri paylaşımı veya satışı kesinlikle yapılmaz.

### Ödeme Güvenliği

Ödeme altyapısı lisanslı ödeme kuruluşu **Iyzico Ödeme Hizmetleri A.Ş.** tarafından sağlanmaktadır. Kredi kartı verileriniz sunucularımızda asla depolanmaz. Sitedeki tüm veri aktarımı 256-bit SSL güvenlik protokolüyle şifrelenir.

### Çerezler

Zorunlu çerezler sitenin çalışması ve güvenliği için kullanılır. Analitik, işlevsel veya reklam çerezleri kullanılıyorsa gerekli onay alınmadan etkinleştirilmez. Ayrıntılar ve tercih yönetimi Çerez Aydınlatma Metninde yer alır.

### Hesap ve İletişim Güvenliği

Hesap şifrenizi gizli tutun, ortak cihazlarda oturumu kapatın ve şüpheli bir işlem görürseniz bizimle iletişime geçin. Bizden geldiğini iddia eden mesajlarda kart şifresi, tek kullanımlık doğrulama kodu veya hesap parolası talep edilirse lütfen paylaşmayın.

### Çocukların Gizliliği

Site, yasal işlem ehliyeti olmayan kişilerin tek başına alışveriş yapmasına yönelik değildir. Böyle bir kişinin sipariş veya iletişim sürecinde veri verdiği fark edilirse yasal temsilci doğrulaması ve mevzuata uygun silme veya düzeltme süreci uygulanır.

### Güncelleme ve İletişim

Sorularınız için: **info@ikizlerbaharatcilik.com** veya **0534 720 19 00**.  
Son güncelleme: 12 Ekim 2026`
  },

  "gizlilik": {
    title: "Gizlilik Politikası",
    seoTitle: "Gizlilik Politikası | İkizler Baharatçılık",
    metaDescription: "İkizler Baharatçılık gizlilik ve güvenlik politikası.",
    menuLocation: "Yasal",
    content: `Lütfen güncel Gizlilik Politikası metnimizi incelemek için /sayfa/gizlilik-politikasi adresini ziyaret ediniz.`
  },

  "cerez-politikasi": {
    title: "Çerez Aydınlatma Metni ve Çerez Politikası",
    seoTitle: "Çerez Politikası | İkizler Baharatçılık",
    metaDescription: "İkizler Baharatçılık sitesinde kullanılan zorunlu, işlevsel, analitik ve reklam çerezleri ile tercih yönetimini inceleyin.",
    menuLocation: "Yasal ve çerez paneli",
    content: `Bu metin, www.ikizlerbaharatcilik.com sitesinde çerezler ve benzeri teknolojiler aracılığıyla elde edilen kişisel veriler hakkında bilgi vermek amacıyla **İkizler Baharatçılık** tarafından hazırlanmıştır.

### Çerez Nedir?

Çerezler, ziyaret ettiğiniz internet sitesi tarafından tarayıcınız aracılığıyla cihazınıza kaydedilen küçük veri dosyalarıdır. Oturumun sürdürülmesi, sepetin hatırlanması, güvenlik, tercihlerin korunması, kullanımın ölçülmesi veya izin verilen pazarlama faaliyetleri için kullanılır.

### Çerez Kategorileri

* **Kesinlikle Gerekli Çerezler:** Siteyi, alışveriş sepetini, ödeme akışını, güvenliği ve çerez tercihlerini çalıştırır. Hizmetin sunulması için zorunlu olduklarından kapatılamaz.
* **İşlevsel Çerezler:** Dil, bölge veya kullanıcı tercihi gibi ek işlevleri hatırlar. Gerekli olmadıkça kullanıcı onayıyla çalışır.
* **Analitik Çerezler:** Ziyaret ve sayfa kullanım istatistiklerini ölçerek deneyimi geliştirmemize yardımcı olur. Kullanıcı onayı alınmadan yerleştirilmez.
* **Pazarlama Çerezleri:** İlgi alanlarına göre kampanya veya teklif optimizasyonu için kullanılır. Kullanıcı onayı olmadan etkinleştirilmez.

### Çerez Envanteri

* **Zorunlu Oturum & Sepet Çerezleri:** İkizler Baharatçılık (Birinci Taraf) - Sepet ve oturum sürekliliğini sağlamak için - Oturum süresince.
* **Güvenlik Çerezleri:** Güvenlik ve dolandırıcılık önleme - 1 yıl.
* **Analitik Çerezler:** Kullanım ve sayfa performansı analitiği (Onaya bağlı) - 13 ay.

### Tercih Yönetimi

Siteye ilk girişinizde sizlere eşit görünürlükte **"Tümünü Kabul Et"**, **"Zorunlu Olmayanları Reddet"** ve **"Tercihleri Yönet"** seçenekleri sunulur. Zorunlu olmayan kategoriler varsayılan olarak kapalıdır. Onay verilmeden bu kategorilere ait çerezler aktif edilmez. Tercihlerinizi istediğiniz zaman sayfa altındaki bağlantıdan güncelleyebilirsiniz.

### Tarayıcı Ayarları

Çerezleri tarayıcınızın (Chrome, Safari, Firefox vb.) ayarlarından da silebilir veya engelleyebilirsiniz. Ancak zorunlu çerezlerin engellenmesi durumunda sepet ve ödeme işlevleri çalışmayabilir.

### Haklar ve İletişim

Çerezler yoluyla işlenen verilere ilişkin KVKK kapsamındaki haklarınız için KVKK Aydınlatma Metnini inceleyebilir ya da **info@ikizlerbaharatcilik.com** üzerinden bize başvurabilirsiniz.

Son güncelleme: 12 Ekim 2026`
  },

  "kalite-belgelerimiz": {
    title: "Kalite Belgelerimiz",
    seoTitle: "Kalite Belgelerimiz | İkizler Baharatçılık",
    metaDescription: "İkizler Baharatçılık kalite, hijyen ve gıda güvenliği sertifikaları.",
    menuLocation: "Kurumsal",
    content: `İkizler Baharatçılık olarak 1989 yılından bu yana sunduğumuz tüm baharat, kuruyemiş ve doğal ürünlerde en yüksek kalite, hijyen ve gıda güvenliği standartlarını titizlikle uyguluyoruz.

### Gıda Güvenliği Standartlarımız

Tüm ürünlerimiz Türk Gıda Kodeksi'ne uygun olarak, hijyenik ortamlarda el değmeden veya titizlikle kontrol edilerek paketlenmektedir. Depolama alanlarımız iklimlendirme ve havalandırma standartlarına göre düzenli olarak denetlenir.

### İletişim ve Detaylı Bilgi

Kalite sertifikasyonlarımız ve analiz raporlarımız hakkında daha fazla bilgi almak için **info@ikizlerbaharatcilik.com** adresinden bizimle iletişime geçebilirsiniz.`
  },

  "iletisim": {
    title: "Mağazalarımız & İletişim",
    seoTitle: "İletişim | İkizler Baharatçılık Kadıköy",
    metaDescription: "İkizler Baharatçılık Kadıköy mağaza adresi, telefon numarası ve iletişim bilgileri.",
    menuLocation: "Kurumsal",
    content: `### Kadıköy Mağazamız

* **Adres:** Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul
* **Telefon:** 0534 720 19 00
* **E-posta:** info@ikizlerbaharatcilik.com
* **Çalışma Saatleri:** Pazartesi - Cumartesi: 09:00 - 20:00

### Online Sipariş ve Toptan Destek

Toptan alımlarınız ve online sipariş durumunuz hakkında bilgi almak için telefon veya WhatsApp üzerinden haftanın her günü bize ulaşabilirsiniz.`
  }
}
