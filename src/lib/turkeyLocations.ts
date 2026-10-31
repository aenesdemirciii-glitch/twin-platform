// Türkiye İl, İlçe ve Mahalle Veri Seti (İkizler Baharatçılık E-Ticaret Teslimat Sistemi)

export const TURKEY_PROVINCES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Şanlıurfa",
  "Siirt",
  "Sinop",
  "Şırnak",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak"
]

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "İstanbul": [
    "Kadıköy",
    "Üsküdar",
    "Ataşehir",
    "Beşiktaş",
    "Şişli",
    "Beyoğlu",
    "Fatih",
    "Maltepe",
    "Kartal",
    "Pendik",
    "Ümraniye",
    "Bakırköy",
    "Sarıyer",
    "Beykoz",
    "Çekmeköy",
    "Sancaktepe",
    "Tuzla",
    "Sultanbeyli",
    "Zeytinburnu",
    "Güngören",
    "Bahçelievler",
    "Bağcılar",
    "Esenler",
    "Bayrampaşa",
    "Eyüpsultan",
    "Gaziosmanpaşa",
    "Sultangazi",
    "Kağıthane",
    "Başakşehir",
    "Küçükçekmece",
    "Avcılar",
    "Beylikdüzü",
    "Esenyurt",
    "Büyükçekmece",
    "Çatalca",
    "Silivri",
    "Şile",
    "Adalar",
    "Arnavutköy"
  ],
  "Ankara": [
    "Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı", "Çubuk", "Kahramankazan", "Beypazarı", "Elmadağ"
  ],
  "İzmir": [
    "Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli", "Gaziemir", "Bayraklı", "Balçova", "Narlıdere", "Güzelbahçe", "Urla", "Çeşme", "Karabağlar", "Menemen", "Torbalı", "Aliağa", "Seferihisar", "Menderes", "Foça", "Tire", "Ödemiş", "Bergama"
  ],
  "Bursa": [
    "Osmangazi", "Nilüfer", "Yıldırım", "Gemlik", "İnegöl", "Mudanya", "Gürsu", "Kestel", "Mustafakemalpaşa", "Karacabey", "Orhangazi", "İznik"
  ],
  "Antalya": [
    "Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat", "Serik", "Aksu", "Döşemealtı", "Kemer", "Kumluca", "Kaş", "Korkuteli", "Gazipaşa", "Finike"
  ],
  "Kocaeli": [
    "İzmit", "Gebze", "Darıca", "Körfez", "Gölcük", "Derince", "Çayırova", "Kartepe", "Başiskele", "Karamürsel", "Kandıra", "Dilovası"
  ]
}

// İstanbul İlçeleri Detaylı Mahalle Listeleri (Banabikurye ve Yerel Teslimat İçin Tam Kapsam)
export const ISTANBUL_NEIGHBORHOODS: Record<string, string[]> = {
  "Kadıköy": [
    "Caferağa (Moda)",
    "Osmanağa",
    "Rasimpaşa (Yeldeğirmeni)",
    "Fenerbahçe",
    "Feneryolu",
    "Göztepe",
    "Caddebostan",
    "Suadiye",
    "Bostancı",
    "Kozyatağı",
    "Sahrayıcedit",
    "Erenköy",
    "Merdivenköy",
    "Acıbadem",
    "Hasanpaşa",
    "Fikirtepe",
    "Dumlupınar",
    "Koşuyolu",
    "19 Mayıs",
    "Eğitim",
    "Zühtüpaşa"
  ],
  "Üsküdar": [
    "Acıbadem", "Altunizade", "Aziz Mahmut Hüdayi", "Bahçelievler", "Beylerbeyi", "Bulgurlu", "Burhaniye", "Cumhuriyet", "Çengelköy", "Ferah", "Güzeltepe", "İcadiye", "Kandilli", "Kısıklı", "Kirazlıtepe", "Kuleli", "Kuzguncuk", "Küçük Çamlıca", "Küçüksu", "Mimar Sinan", "Murat Reis", "Salacak", "Selami Ali", "Sultantepe", "Ünalan", "Valide-i Atik", "Yavuztürk"
  ],
  "Ataşehir": [
    "Atatürk", "Barbaros", "Esatpaşa", "Ferhatpaşa", "Fetih", "İçerenköy", "İnönü", "Kayışdağı", "Küçükbakkalköy", "Mevlana", "Mimar Sinan", "Mustafa Kemal", "Örnek", "Yeni Çamlıca", "Yeni Sahra", "Yenişehir"
  ],
  "Beşiktaş": [
    "Abbasağa", "Akatlar", "Arnavutköy", "Balmumcu", "Bebek", "Cihannüma", "Dikilitaş", "Etiler", "Gayrettepe", "Konaklar", "Kuruçeşme", "Kültür", "Levazım", "Levent", "Mecidiye", "Muradiye", "Nisbetiye", "Ortaköy", "Sinanpaşa", "Türkali", "Ulus", "Vişnezade", "Yıldız"
  ],
  "Şişli": [
    "19 Mayıs", "Bozkurt", "Cumhuriyet", "Duatepe", "Ergenekon", "Esentepe", "Feriköy", "Fulya", "Gülbahar", "Halaskargazi", "Halide Edip Adıvar", "Halil Rıfat Paşa", "Harbiye", "İnönü", "İzzetpaşa", "Kaptanpaşa", "Kuştepe", "Mahmut Şevket Paşa", "Mecidiyeköy", "Merkez", "Meşrutiyet", "Paşa", "Teşvikiye", "Yayla"
  ],
  "Beyoğlu": [
    "Asmalı Mescit", "Cihangir", "Fetihtepe", "Gümüşsuyu", "Halıcıoğlu", "Hasköy", "Karaköy", "Kasımpaşa", "Kocatepe", "Örnektepe", "Piri Paşa", "Pürtelaş Hasan Efendi", "Sütlüce", "Şahkulu (Tünel)", "Tomtom", "Tophane"
  ],
  "Fatih": [
    "Aksaray", "Balat", "Beyazıt", "Cankurtaran", "Cerrahpaşa", "Çapa", "Dervişali", "Eminönü", "Fener", "Fındıkzade", "Haseki", "Karagümrük", "Kocamustafapaşa", "Kumkapı", "Laleli", "Mevlanakapı", "Sirkeci", "Sultanahmet", "Süleymaniye", "Şehremini", "Topkapı", "Vefa", "Yedikule"
  ],
  "Maltepe": [
    "Altayçeşme", "Altıntepe", "Aydınevler", "Bağlarbaşı", "Başıbüyük", "Büyükbakkalköy", "Cevizli", "Çınar", "Esenkent", "Feyzullah", "Fındıklı", "Girne", "Gülensu", "Gülsuyu", "İdealtepe", "Küçükyalı", "Yalı", "Zümrütevler"
  ],
  "Kartal": [
    "Atalar", "Cevizli", "Cumhuriyet", "Çavuşoğlu", "Esentepe", "Gümüşpınar", "Hürriyet", "Karlıktepe", "Kordonboyu", "Orhantepe", "Orta", "Petrol İş", "Soğanlık", "Topselvi", "Uğur Mumcu", "Yakacık", "Yalı", "Yukarı"
  ],
  "Pendik": [
    "Ahmet Yesevi", "Bahçelievler", "Batı", "Çamçeşme", "Çamlık", "Çınardere", "Doğu", "Dumlupınar", "Ertuğrul Gazi", "Esenler", "Esenyalı", "Fevzi Çakmak", "Güllübağlar", "Güzelyalı", "Harmandere", "Kavakpınar", "Kaynarca", "Kurtköy", "Orhangazi", "Sanayi", "Sapan Bağları", "Sülüntepe", "Şeyhli", "Velibaba", "Yaylar", "Yeni Mahalle", "Yenişehir", "Yeşilbağlar"
  ],
  "Ümraniye": [
    "Adem Yavuz", "Altınşehir", "Armağanevler", "Aşağı Dudullu", "Atakent", "Atatürk", "Çakmak", "Çamlık", "Dumlupınar", "Elmalıkent", "Esenevler", "Esenkent", "Esenşehir", "Fatih Sultan Mehmet", "Hekimbaşı", "Ihlamurkuyu", "İnkılap", "İstiklal", "Kazım Karabekir", "Madenler", "Mehmet Akif", "Namık Kemal", "Necip Fazıl", "Parseller", "Saray", "Site", "Şerifali", "Tantavi", "Tatlısu", "Tepeüstü", "Topağacı", "Yamanevler", "Yukarı Dudullu"
  ],
  "Bakırköy": [
    "Ataköy 1. Kısım", "Ataköy 2-5-6. Kısım", "Ataköy 7-8-9-10. Kısım", "Basınköy", "Cevizlik", "Kartaltepe", "Osmaniye", "Sakızağacı", "Şenlikköy (Florya)", "Yenimahalle", "Yeşilköy", "Yeşilyurt", "Zeytinlik", "Zuhuratbaba"
  ],
  "Sarıyer": [
    "Baltalimanı", "Bahçeköy", "Büyükdere", "Cumhuriyet", "Çamlıtepe (Derbent)", "Çayırbaşı", "Darüşşafaka", "Emirgan", "Fatih Sultan Mehmet", "Ferahevler", "Huzur", "İstinye", "Kireçburnu", "Köybaşı", "Maden", "Maslak", "Pınar", "Poligon", "Reşitpaşa", "Rumeli Hisarı", "Rumeli Kavağı", "Tarabya", "Yeniköy", "Zekeriyaköy"
  ],
  "Beykoz": [
    "Acarlar", "Anadolu Hisarı", "Anadolu Kavağı", "Baklacı", "Beykoz Merkez", "Çamlıbahçe", "Çavuşbaşı", "Çengeldere", "Çiftlik", "Çiğdem", "Çubuklu", "Görele", "Göztepe", "Gümüşsuyu", "İncirköy", "Kanlıca", "Kavacık", "Ortaçeşme", "Paşabahçe", "Polonezköy", "Poyrazköy", "Rüzgarlıbahçe", "Soğuksu", "Tokatköy", "Yalıköy", "Yavuz Selim", "Yenimahalle"
  ],
  "Çekmeköy": [
    "Alemdağ", "Aydınlar", "Çamlık", "Çatalmeşe", "Ekşioğlu", "Güngören", "Hamidiye", "Hüseyinli", "Kirazlıdere", "Mehmet Akif", "Merkez", "Mimar Sinan", "Nişantepe", "Ömerli", "Reşadiye", "Sırapınar", "Soğukpınar", "Sultançiftliği", "Taşdelen"
  ],
  "Sancaktepe": [
    "Abdurrahmangazi", "Akpınar", "Atatürk", "Emek", "Eyüp Sultan", "Fatih", "Hilal", "İnönü", "Kemal Türkler", "Meclis", "Merve", "Mevlana", "Osmangazi", "Paşaköy", "Safa", "Sarıgazi", "Veysel Karani", "Yenidoğan", "Yunus Emre"
  ],
  "Tuzla": [
    "Akfırat", "Anadolu", "Aydınlı", "Aydıntepe", "Cami", "Evliya Çelebi", "Fatih", "İçmeler", "İstasyon", "Mescit", "Mimar Sinan", "Orhanlı", "Orta", "Postane", "Şifa", "Tepeören", "Yayla"
  ],
  "Sultanbeyli": [
    "Abdurrahmangazi", "Adil", "Ahmet Yesevi", "Akşemsettin", "Battalgazi", "Fatih", "Hamidiye", "Hasanpaşa", "Mecidiye", "Mehmet Akif", "Mimar Sinan", "Necip Fazıl", "Orhangazi", "Turgut Reis", "Yavuz Selim"
  ],
  "Zeytinburnu": [
    "Beştelsiz", "Çırpıcı", "Gökalp", "Kazlıçeşme", "Maltepe", "Merkezefendi", "Nuripaşa", "Seyitnizam", "Sümer", "Telsiz", "Veliefendi", "Yenidoğan", "Yeşiltepe"
  ],
  "Güngören": [
    "Abdurrahman Nafiz Gürman", "Akıncılar", "Gençosman", "Güneştepe", "Güven", "Haznedar", "Mareşal Çakmak", "Mehmet Nesih Özmen", "Merkez", "Sanayi", "Tozkoparan"
  ],
  "Bahçelievler": [
    "Bahçelievler", "Cumhuriyet", "Çobançeşme", "Fevzi Çakmak", "Hürriyet", "Kocasinan", "Siyavuşpaşa", "Soğanlı", "Şirinevler", "Yenibosna", "Zafer"
  ],
  "Bağcılar": [
    "15 Temmuz", "Bağlar", "Barbaros", "Çınar", "Demirkapı", "Fatih", "Fevzi Çakmak", "Göztepe", "Güneşli", "Hürriyet", "İnönü", "Kazım Karabekir", "Kemalpaşa", "Kirazlı", "Mahmutbey", "Merkez", "Sancaktepe", "Yavuz Selim", "Yenigün", "Yenimahalle", "Yıldıztepe"
  ],
  "Esenler": [
    "Birlik", "Çifte Havuzlar", "Davutpaşa", "Fatih", "Fevzi Çakmak", "Havaalanı", "Kazım Karabekir", "Kemer", "Menderes", "Mimar Sinan", "Namık Kemal", "Nine Hatun", "Oruçreis", "Turgut Reis", "Yavuz Selim"
  ],
  "Bayrampaşa": [
    "Altıntepsi", "Cevatpaşa", "İsmet Paşa", "Kartaltepe", "Kocatepe", "Muratpaşa", "Orta", "Terazidere", "Vatan", "Yenidogan", "Yıldırım"
  ],
  "Eyüpsultan": [
    "Ağaçlı", "Akpınar", "Alibeyköy", "Çırçır", "Defterdar", "Düğmeciler", "Emniyettepe", "Esentepe", "Göktürk", "Güzeltepe", "İslambey", "Kemerburgaz", "Merkez", "Mithatpaşa", "Nişanca", "Rami Cuma", "Rami Yeni", "Sakarya", "Silahtarağa", "Topçular", "Yeşilpınar"
  ],
  "Gaziosmanpaşa": [
    "Bağlarbaşı", "Barbaros Hayrettin Paşa", "Fevzi Çakmak", "Hürriyet", "Karadeniz", "Karayolları", "Karlıtepe", "Kazım Karabekir", "Merkez", "Mevlana", "Pazariçi", "Sarıgöl", "Şemsipaşa", "Yenidoğan", "Yıldıztabya"
  ],
  "Sultangazi": [
    "50. Yıl", "75. Yıl", "Cebeci", "Cumhuriyet", "Esentepe", "Eski Habipler", "Gazi", "Habipler", "İsmetpaşa", "Malkoçoğlu", "Sultançiftliği", "Uğur Mumcu", "Yayla", "Zübeyde Hanım"
  ],
  "Kağıthane": [
    "Çağlayan", "Çeliktepe", "Emniyet", "Gültepe", "Gürsel", "Hamidiye", "Harmantepe", "Hürriyet", "Mehmet Akif Ersoy", "Merkez", "Nurtepe", "Ortabayır", "Seyrantepe", "Sultan Selim", "Şirintepe", "Talatpaşa", "Telsizler", "Yahya Kemal", "Yeşilce"
  ],
  "Başakşehir": [
    "Altınşehir", "Bahçeşehir 1. Kısım", "Bahçeşehir 2. Kısım", "Başak", "Başakşehir", "Güvercintepe", "İkitelli OSB", "Kayabaşı", "Şahintepe", "Şamlar", "Ziya Gökalp"
  ],
  "Küçükçekmece": [
    "Atakent", "Atatürk", "Beşyol", "Cennet", "Cumhuriyet", "Fatih", "Fevzi Çakmak", "Gültepe", "Halkalı Merkez", "İnönü", "İstasyon", "Kanarya", "Kartaltepe", "Kemalpaşa", "Mehmet Akif", "Söğütlü Çeşme", "Sultan Murat", "Tevfik Bey", "Yarımburgaz", "Yeni Mahalle", "Yeşilova"
  ],
  "Avcılar": [
    "Ambarlı", "Cihangir", "Denizköşkler", "Firuzköy", "Gümüşpala", "Merkez", "Mustafa Kemal Paşa", "Tahtakale", "Üniversite", "Yeşilkent"
  ],
  "Beylikdüzü": [
    "Adnan Kahveci", "Barış", "Büyükşehir", "Cumhuriyet", "Dereağzı", "Gürpınar", "Kavaklı", "Marmara", "Sahil", "Yakuplu"
  ],
  "Esenyurt": [
    "Akçaburgaz", "Akevler", "Akşemseddin", "Ardıçlı", "Aşık Veysel", "Atatürk", "Bağlarçeşme", "Balıkyolu", "Barbaros Hayrettin Paşa", "Battalgazi", "Cumhuriyet", "Çınar", "Fatih", "Gökevler", "Güzelyurt", "Hürriyet", "İncirtepe", "İnönü", "İstiklal", "Koza", "Mehterçeşme", "Mevlana", "Namık Kemal", "Necip Fazıl Kısakürek", "Örnek", "Pınar", "Piri Reis", "Saadetdere", "Selahaddin Eyyubi", "Sultaniye", "Süleymaniye", "Şehitler", "Talatpaşa", "Turgut Özal", "Üçevler", "Yenikent", "Yeşilkent", "Yunus Emre", "Zafer"
  ],
  "Büyükçekmece": [
    "19 Mayıs", "Ahmediye", "Alkent 2000", "Atatürk", "Bahçelievler", "Batıköy (Mimaroba)", "Celaliye", "Cumhuriyet", "Dizdariye", "Ekinoba", "Fatih (Sinanoba)", "Güzelce", "Hürriyet", "Kamiloba", "Karaağaç", "Kumburgaz", "Mimar Sinan", "Murat Çeşme", "Pınartepe", "Türkoba", "Ulus", "Yenimahalle"
  ],
  "Çatalca": [
    "Ferhatpaşa", "Kaleiçi", "Binkılıç", "Çakıl", "Çiftlikköy", "Karacaköy", "Muratbey", "Ovayenice", "Subaşı", "Yalıköy"
  ],
  "Silivri": [
    "Alibey", "Cumhuriyet", "Fatih", "Gümüşyaka", "Marmara (Değirmenköy)", "Mimarsinan", "Ortaköy", "Piri Mehmet Paşa", "Selimpaşa", "Semizkumlar", "Yeni Mahalle"
  ],
  "Şile": [
    "Ağva (Darlık)", "Ahmetli", "Balibey", "Çavuş", "Hacıkasım", "Kandıra", "Karakiraz", "Kumbaba", "Meşrutiyet", "Sahilköy", "Yeniköy"
  ],
  "Adalar": [
    "Büyükada (Maden / Nizam)", "Heybeliada", "Burgazada", "Kınalıada", "Sedefadası"
  ],
  "Arnavutköy": [
    "Anadolu", "Arnavutköy Merkez", "Boğazköy", "Bolluca", "Boyalık", "Durusu", "Hadımköy", "Haraççı", "İmrahor", "İslambey", "Karaburun", "Mareşal Fevzi Çakmak", "Mavigöl", "Mustafa Kemal Paşa", "Nenehatun", "Ömerli", "Taşoluk", "Tayakadın", "Yassıören", "Yavuz Selim", "Yeniköy"
  ]
}

// Yardımcı Fonksiyon: Bir ilin ilçelerini getir
export function getDistrictsForProvince(province: string): string[] {
  if (!province) return []
  return DISTRICTS_BY_PROVINCE[province] || [
    "Merkez",
    "Diğer İlçe"
  ]
}

// Yardımcı Fonksiyon: Bir ilçenin mahallelerini getir (Özellikle İstanbul için tam detay)
export function getNeighborhoodsForDistrict(district: string, province: string = "İstanbul"): string[] {
  if (!district) return []
  if (province === "İstanbul" && ISTANBUL_NEIGHBORHOODS[district]) {
    return ISTANBUL_NEIGHBORHOODS[district]
  }
  return [
    "Merkez Mah.",
    "Cumhuriyet Mah.",
    "Atatürk Mah.",
    "Fatih Mah.",
    "Yeni Mahalle",
    "İnönü Mah."
  ]
}
