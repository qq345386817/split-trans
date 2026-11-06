// Shared native-app facts for visible copy, help and structured answers.
// Keep these separate from the stateless Google-powered web workspace.
export const nativeCopy = {
  en: {
    title: "Sentence study. Vocabulary in context. Spaced review.",
    summary: "On iPhone, iPad and Mac, understand a sentence you want to read, save useful words with the original context, and return when they are due. Search your local library, add notes, and export CSV for your own study workflow.",
    homeTitle: "PhraseCut | Learn Vocabulary in Context & Spaced Review",
    homeDescription: "Learn vocabulary from sentences you like. Save context, notes and language pairs, review due items in the app, or try online translation and CSV export.",
    helpTitle: "PhraseCut Help | Sentence Study, Spaced Review & CSV",
    helpDescription: "Use PhraseCut on iPhone, iPad and Mac: save context, review due vocabulary and export CSV. Check offline language packs and optional Apple Intelligence requirements.",
    helpHeading: "Learn from a sentence you want to understand",
    sections: [
      ["Understand before memorizing", "How does sentence-based vocabulary learning work?", "Paste text, choose a source and target language, and read the whole-sentence translation before exploring individual words. Listen to pronunciation and save a word, phrase or the whole sentence. Individual machine-translated words may have other meanings; compare them with the original sentence rather than treating them as a contextual explanation."],
      ["Keep the original context", "What does the app save in the study library?", "Study items retain the source sentence, translation and language pair. Search your local library, filter by words, phrases or sentences, and add personal notes. The app is for English and other supported languages, not only difficult English sentences. Interface languages do not guarantee support for every translation direction."],
      ["Return when items are due", "How do spaced review and reminders work?", "The app uses a lightweight spaced-review plan. Reveal the answer, then give feedback such as Again, Hard, Good or Easy to adjust the next review time. Optional local reminders require notification permission; delivery also depends on system settings. The website has no saved review library or reminders."],
      ["Export a file, not an account", "Can I export to Anki or sync my library?", "Export a standard CSV or an Anki-compatible CSV from the app's Library. Saved context and notes remain in the file. Import it manually into your chosen workflow; this is not automatic account sync or an APKG deck. Native Anki CSV uses Front and Back, unlike the website's Word and Meaning columns."],
      ["Prepare offline language resources", "Can PhraseCut translate offline?", "The native app uses Apple Translation. Offline translation requires a supported source/target pair and installed language packs on the device. Downloading resources and fetching new recommended sentences need internet access. The website uses online Google machine translation instead; its language list does not describe Apple's translation availability."],
      ["Optional sentence explanations", "Does every device support AI sentence explanations?", "Optional explanations use Apple's system model on iOS 26 or macOS 26 and later, with eligible Apple Intelligence hardware, the feature enabled, and a ready model. Availability varies by device and system language support. This is separate from sentence and word translation and is not offered by the website. Check translations and generated explanations against the original."]
    ]
  },
  "zh-Hans": {
    title: "从句子理解，到语境积累与间隔复习。",
    summary: "在 iPhone、iPad 和 Mac 上读懂真正想理解的句子，保存带原句语境的词汇，到期后回来复习。搜索本地学习库、添加笔记，再导出 CSV，延续自己的学习流程。",
    homeTitle: "PhraseCut｜语境学词、间隔复习与句子学习库",
    homeDescription: "从喜欢的句子学英语和其他外语词汇。在 App 中保留原句、翻译、语言对与笔记，到期后间隔复习；也可免费在线整句、逐词翻译并导出 CSV。",
    helpTitle: "PhraseCut 使用帮助｜语境学词、间隔复习与 CSV 导出",
    helpDescription: "了解 iPhone、iPad 和 Mac 版 PhraseCut：保存带语境的词汇、到期复习、导出 CSV，以及离线语言包和可选 Apple Intelligence 句子解释的使用条件。",
    helpHeading: "从一句真正想读懂的话开始",
    sections: [
      ["先理解，再记忆", "如何通过句子学习词汇？", "粘贴文本，选择源语言和目标语言，先看整句意思，再探索单词拆解。聆听发音，保存单词、短语或整句。单词会分别机翻，多义词仍需对照原句理解，不能把逐词结果当成准确的语境讲解。"],
      ["保留词语出现的语境", "App 学习库会保存什么？", "学习条目保留原句、翻译和语言对。你可以搜索本地学习库，按词、短语和句子筛选，并添加自己的笔记。它适用于英语和其他受支持的外语，不只用于英文难句；界面语言不代表所有翻译方向都受支持。"],
      ["到期后回来复习", "间隔复习和提醒如何工作？", "App 使用轻量间隔复习计划。显示答案后，通过“再来”“困难”“记住了”或“简单”等反馈调整下一次复习时间。可选本地提醒需要通知权限，实际送达也受系统设置影响。网页版没有保存的复习库或提醒功能。"],
      ["导出文件，不是账号同步", "可以导出到 Anki 或同步学习库吗？", "在 App 学习库导出普通 CSV 或兼容 Anki 的 CSV，文件保留已保存的语境和笔记，再手动导入自己的学习流程。这不是账号自动同步，也不是 APKG 牌组。App 的 Anki CSV 使用 Front、Back 列，和网页版的 Word、Meaning 列不同。"],
      ["准备离线语言资源", "PhraseCut 能离线翻译吗？", "App 使用 Apple Translation；离线翻译需要设备支持对应的源语言、目标语言，且已安装所需语言包。下载资源和获取新的推荐句子仍需联网。网页版使用 Google 在线机翻，网页语言列表不代表 Apple 的翻译可用范围。"],
      ["可选的句子解释", "所有设备都支持 AI 句子解释吗？", "可选解释使用 Apple 系统模型，需要 iOS 26 或 macOS 26 及更新版本、支持 Apple Intelligence 的硬件、已启用功能和就绪模型；实际可用性也受系统语言支持影响。它与整句、逐词翻译是独立功能，网页版不提供此解释。请对照原句核对翻译和生成解释。"]
    ]
  },
  "zh-Hant": {
    title: "從理解句子，到情境累積與間隔複習。",
    summary: "在 iPhone、iPad 和 Mac 上讀懂真正想理解的句子，儲存保留原句情境的單字，到期後回來複習。搜尋本機學習庫、加入筆記，再匯出 CSV，延續自己的學習流程。",
    homeTitle: "PhraseCut｜情境學單字、間隔複習與句子學習庫",
    homeDescription: "從喜歡的句子學英語與其他外語單字。在 App 保留原句、翻譯、語言組合與筆記，到期後間隔複習；也能免費線上整句、逐字翻譯並匯出 CSV。",
    helpTitle: "PhraseCut 使用說明｜情境學單字、間隔複習與 CSV 匯出",
    helpDescription: "了解 iPhone、iPad 和 Mac 版 PhraseCut：儲存有情境的單字、到期複習、匯出 CSV，以及離線語言套件和選用 Apple Intelligence 句子解說的使用條件。",
    helpHeading: "從一句真正想讀懂的話開始",
    sections: [
      ["先理解，再記憶", "如何透過句子學單字？", "貼上文字，選擇來源與目標語言，先看整句意思，再探索單字拆解。聆聽發音，儲存單字、片語或整句。單字會分別機器翻譯，多義字仍需對照原句理解，不能把逐字結果當成精確的情境解說。"],
      ["保留單字出現的情境", "App 學習庫會儲存什麼？", "學習項目保留原句、翻譯與語言組合。你可以搜尋本機學習庫，依單字、片語或句子篩選，並加入自己的筆記。它適用於英語及其他支援的外語，不只用於英文難句；介面語言不代表所有翻譯方向都受支援。"],
      ["到期後回來複習", "間隔複習與提醒如何運作？", "App 採用輕量間隔複習計畫。顯示答案後，透過「再來」「困難」「記住了」或「簡單」等回饋調整下次複習時間。選用的本機提醒需要通知權限，實際送達也受系統設定影響。網頁版沒有儲存的複習庫或提醒功能。"],
      ["匯出檔案，而非帳號同步", "可以匯出到 Anki 或同步學習庫嗎？", "從 App 學習庫匯出一般 CSV 或相容 Anki 的 CSV，檔案保留已儲存的情境與筆記，再手動匯入自己的學習流程。這不是帳號自動同步，也不是 APKG 牌組。App 的 Anki CSV 使用 Front、Back 欄，與網頁版的 Word、Meaning 欄不同。"],
      ["準備離線語言資源", "PhraseCut 能離線翻譯嗎？", "App 使用 Apple Translation；離線翻譯需要裝置支援對應的來源與目標語言，並已安裝所需語言套件。下載資源與取得新的推薦句子仍需連網。網頁版使用 Google 線上機器翻譯，網頁語言清單不代表 Apple 的翻譯支援範圍。"],
      ["選用的句子解說", "所有裝置都支援 AI 句子解說嗎？", "選用解說使用 Apple 系統模型，需要 iOS 26 或 macOS 26 以上版本、支援 Apple Intelligence 的硬體、已啟用功能與就緒模型；實際可用性也受系統語言支援影響。它與整句、逐字翻譯是獨立功能，網頁版不提供此解說。請對照原句核對翻譯與生成解說。"]
    ]
  },
  hi: {
    title: "वाक्य समझें। संदर्भ में शब्द सीखें। अंतराल पर दोहराएँ।",
    summary: "iPhone, iPad और Mac पर पसंदीदा वाक्य समझें, उपयोगी शब्द मूल संदर्भ सहित सहेजें और समय आने पर दोहराएँ। स्थानीय लाइब्रेरी में खोजें, नोट्स जोड़ें और अपने अध्ययन के लिए CSV निर्यात करें।",
    homeTitle: "PhraseCut | संदर्भ में शब्द सीखें और अंतराल पर दोहराएँ",
    homeDescription: "पसंदीदा वाक्यों से शब्द सीखें। ऐप में संदर्भ और नोट्स सहेजें, समय पर दोहराएँ। ऑनलाइन वाक्य व शब्द अनुवाद और CSV निर्यात भी आज़माएँ।",
    helpTitle: "PhraseCut सहायता | वाक्य, पुनरावृत्ति और CSV निर्यात",
    helpDescription: "iPhone, iPad और Mac पर संदर्भ सहेजना, समय पर दोहराना और CSV निर्यात सीखें। ऑफ़लाइन भाषा पैक और वैकल्पिक Apple Intelligence की शर्तें जानें।",
    helpHeading: "जिस वाक्य को समझना चाहते हैं, वहीं से शुरू करें",
    sections: [
      ["पहले समझें, फिर याद करें", "वाक्यों से शब्द कैसे सीखें?", "पाठ चिपकाएँ, स्रोत और लक्ष्य भाषा चुनें और अलग-अलग शब्दों से पहले पूरे वाक्य का अर्थ पढ़ें। उच्चारण सुनें और शब्द, वाक्यांश या पूरा वाक्य सहेजें। शब्दों का अलग मशीन अनुवाद होता है; कई अर्थ वाले शब्द को मूल वाक्य से समझें, इसे संदर्भ की सटीक व्याख्या न मानें।"],
      ["मूल संदर्भ बनाए रखें", "ऐप की अध्ययन लाइब्रेरी क्या सहेजती है?", "आइटम के साथ मूल वाक्य, अनुवाद और भाषा की जोड़ी रहती है। स्थानीय लाइब्रेरी में खोजें, शब्द, वाक्यांश या वाक्य के अनुसार छाँटें और अपने नोट्स जोड़ें। अंग्रेज़ी के अलावा दूसरी समर्थित भाषाएँ भी सीख सकते हैं। इंटरफ़ेस की भाषा से हर अनुवाद दिशा का समर्थन सिद्ध नहीं होता।"],
      ["समय आने पर दोहराएँ", "अंतराल पर दोहराना और रिमाइंडर कैसे काम करते हैं?", "ऐप में हल्की अंतराल-आधारित योजना है। उत्तर देखने के बाद फिर से, कठिन, याद रहा या आसान जैसी प्रतिक्रिया अगली पुनरावृत्ति का समय बदलती है। वैकल्पिक स्थानीय रिमाइंडर के लिए सूचना की अनुमति चाहिए; मिलने का समय सिस्टम सेटिंग पर भी निर्भर है। वेबसाइट में सहेजी हुई पुनरावृत्ति लाइब्रेरी या रिमाइंडर नहीं हैं।"],
      ["फ़ाइल निर्यात, खाते का सिंक नहीं", "क्या Anki में निर्यात या लाइब्रेरी सिंक कर सकते हैं?", "ऐप की लाइब्रेरी से सामान्य CSV या Anki के अनुकूल CSV निर्यात करें। संदर्भ और नोट्स फ़ाइल में रहते हैं; अपनी प्रक्रिया में उसे मैन्युअल रूप से आयात करें। यह खाते का अपने आप सिंक या APKG डेक नहीं है। ऐप की Anki CSV में Front और Back कॉलम हैं; वेबसाइट में Word और Meaning हैं।"],
      ["ऑफ़लाइन भाषा संसाधन तैयार करें", "क्या PhraseCut ऑफ़लाइन अनुवाद करता है?", "ऐप Apple Translation इस्तेमाल करता है। ऑफ़लाइन उपयोग के लिए डिवाइस पर समर्थित स्रोत-लक्ष्य भाषा की जोड़ी और इंस्टॉल किए भाषा पैक चाहिए। संसाधन डाउनलोड या नए सुझाए वाक्य लेने के लिए इंटरनेट चाहिए। वेबसाइट Google का ऑनलाइन मशीन अनुवाद इस्तेमाल करती है; उसकी भाषा सूची Apple के समर्थन की सूची नहीं है।"],
      ["वैकल्पिक वाक्य व्याख्या", "क्या हर डिवाइस पर AI वाक्य व्याख्या मिलती है?", "यह वैकल्पिक सुविधा Apple का सिस्टम मॉडल इस्तेमाल करती है। iOS 26 या macOS 26 या नया संस्करण, समर्थित Apple Intelligence हार्डवेयर, चालू सुविधा और तैयार मॉडल चाहिए। सिस्टम की भाषा का समर्थन भी मायने रखता है। यह अनुवाद से अलग सुविधा है और वेबसाइट पर नहीं है। अनुवाद और व्याख्या को मूल पाठ से जाँचें।"]
    ]
  },
  id: {
    title: "Pahami kalimat. Simpan konteks. Ulangi dengan jeda.",
    summary: "Di iPhone, iPad, dan Mac, pahami kalimat pilihan Anda, simpan kata berguna beserta konteksnya, lalu ulangi saat waktunya tiba. Cari di pustaka lokal, tambahkan catatan, dan ekspor CSV untuk alur belajar Anda.",
    homeTitle: "PhraseCut | Kosakata dalam Konteks & Pengulangan Berjarak",
    homeDescription: "Belajar kata dari kalimat favorit. Simpan konteks dan catatan, ulangi sesuai jadwal di app, atau coba terjemahan online dan ekspor CSV.",
    helpTitle: "Bantuan PhraseCut | Konteks, Pengulangan & Ekspor CSV",
    helpDescription: "Pelajari pustaka lokal, jadwal ulasan dan ekspor CSV di iPhone, iPad, dan Mac, termasuk syarat paket bahasa offline dan penjelasan Apple Intelligence opsional.",
    helpHeading: "Mulai dari kalimat yang ingin Anda pahami",
    sections: [
      ["Pahami sebelum menghafal", "Bagaimana cara belajar kosakata dari kalimat?", "Tempel teks, pilih bahasa sumber dan tujuan, lalu baca terjemahan kalimat sebelum memeriksa tiap kata. Dengarkan pelafalan dan simpan kata, frasa, atau kalimat. Kata diterjemahkan secara terpisah; periksa kata bermakna ganda dengan kalimat aslinya, bukan sebagai penjelasan konteks yang pasti."],
      ["Pertahankan konteks asli", "Apa yang disimpan dalam pustaka aplikasi?", "Item belajar menyimpan kalimat asli, terjemahan, dan pasangan bahasa. Cari di pustaka lokal, saring kata, frasa, atau kalimat, lalu tambahkan catatan. Aplikasi mendukung pembelajaran bahasa Inggris dan bahasa lain yang tersedia, bukan hanya kalimat Inggris yang sulit. Bahasa antarmuka tidak menjamin semua arah terjemahan didukung."],
      ["Ulangi saat waktunya tiba", "Bagaimana pengulangan berjarak dan pengingat bekerja?", "Aplikasi menggunakan rencana pengulangan berjarak yang ringan. Setelah melihat jawaban, berikan umpan balik seperti ulangi, sulit, ingat, atau mudah untuk mengatur waktu berikutnya. Pengingat lokal opsional membutuhkan izin notifikasi; pengiriman juga bergantung pada pengaturan sistem. Situs tidak memiliki pustaka ulasan tersimpan atau pengingat."],
      ["Ekspor file, bukan sinkronisasi akun", "Bisakah mengekspor ke Anki atau menyinkronkan pustaka?", "Ekspor CSV biasa atau CSV kompatibel Anki dari Pustaka aplikasi. Konteks dan catatan tetap dalam file; impor secara manual ke alur belajar Anda. Ini bukan sinkronisasi akun otomatis atau dek APKG. CSV Anki aplikasi memakai kolom Front dan Back, berbeda dari Word dan Meaning di situs."],
      ["Siapkan sumber daya bahasa offline", "Bisakah PhraseCut menerjemahkan offline?", "Aplikasi memakai Apple Translation. Terjemahan offline memerlukan pasangan bahasa sumber/tujuan yang didukung dan paket bahasa terpasang di perangkat. Mengunduh sumber daya dan mengambil saran kalimat baru membutuhkan internet. Situs memakai terjemahan mesin Google online; daftar bahasanya bukan daftar dukungan Apple."],
      ["Penjelasan kalimat opsional", "Apakah semua perangkat mendukung penjelasan AI?", "Penjelasan opsional memakai model sistem Apple pada iOS 26 atau macOS 26 ke atas, dengan perangkat yang mendukung Apple Intelligence, fitur aktif, dan model siap. Dukungan bahasa sistem juga memengaruhi ketersediaannya. Ini terpisah dari terjemahan dan tidak tersedia di situs. Periksa terjemahan dan penjelasan dengan teks asli."]
    ]
  },
  vi: {
    title: "Hiểu câu. Giữ ngữ cảnh. Ôn tập cách quãng.",
    summary: "Trên iPhone, iPad và Mac, hiểu câu bạn muốn đọc, lưu từ hữu ích cùng ngữ cảnh gốc rồi ôn lại khi đến hạn. Tìm trong thư viện cục bộ, thêm ghi chú và xuất CSV cho cách học của bạn.",
    homeTitle: "PhraseCut | Học Từ Trong Ngữ Cảnh & Ôn Tập Cách Quãng",
    homeDescription: "Học từ qua câu bạn thích. Lưu ngữ cảnh và ghi chú, ôn khi đến hạn trong ứng dụng, hoặc dùng bản dịch trực tuyến và xuất CSV.",
    helpTitle: "Trợ Giúp PhraseCut | Ngữ Cảnh, Ôn Tập & Xuất CSV",
    helpDescription: "Tìm hiểu cách lưu ngữ cảnh, ôn tập và xuất CSV trên iPhone, iPad và Mac, cùng điều kiện gói ngôn ngữ ngoại tuyến và Apple Intelligence tùy chọn.",
    helpHeading: "Bắt đầu từ câu bạn thực sự muốn hiểu",
    sections: [
      ["Hiểu trước khi ghi nhớ", "Học từ vựng qua câu như thế nào?", "Dán văn bản, chọn ngôn ngữ nguồn và đích, đọc bản dịch cả câu trước khi xem từng từ. Nghe phát âm rồi lưu từ, cụm từ hoặc cả câu. Từng từ được dịch máy riêng; hãy đối chiếu từ đa nghĩa với câu gốc, không coi kết quả đó là giải thích ngữ cảnh chính xác."],
      ["Giữ ngữ cảnh gốc", "Thư viện ứng dụng lưu những gì?", "Mục học giữ câu gốc, bản dịch và cặp ngôn ngữ. Tìm trong thư viện cục bộ, lọc theo từ, cụm từ hoặc câu, rồi thêm ghi chú. Bạn có thể học tiếng Anh và những ngôn ngữ được hỗ trợ khác, không chỉ câu tiếng Anh khó. Ngôn ngữ giao diện không đảm bảo mọi chiều dịch đều được hỗ trợ."],
      ["Ôn lại khi đến hạn", "Ôn tập cách quãng và lời nhắc hoạt động ra sao?", "Ứng dụng dùng kế hoạch ôn tập cách quãng gọn nhẹ. Sau khi xem đáp án, phản hồi như học lại, khó, đã nhớ hoặc dễ sẽ điều chỉnh lần ôn tiếp theo. Lời nhắc cục bộ tùy chọn cần quyền thông báo; việc gửi còn phụ thuộc cài đặt hệ thống. Trang web không có thư viện ôn tập đã lưu hay lời nhắc."],
      ["Xuất tệp, không đồng bộ tài khoản", "Có thể xuất sang Anki hoặc đồng bộ thư viện không?", "Xuất CSV thông thường hoặc CSV tương thích Anki từ Thư viện trong ứng dụng. Tệp giữ ngữ cảnh và ghi chú để bạn nhập thủ công vào cách học riêng. Đây không phải đồng bộ tài khoản tự động hay bộ thẻ APKG. CSV Anki của ứng dụng dùng cột Front và Back, khác với Word và Meaning của trang web."],
      ["Chuẩn bị tài nguyên ngoại tuyến", "PhraseCut có dịch ngoại tuyến không?", "Ứng dụng dùng Apple Translation. Dịch ngoại tuyến cần cặp ngôn ngữ nguồn/đích được hỗ trợ và các gói ngôn ngữ đã cài trên thiết bị. Tải tài nguyên và lấy câu gợi ý mới cần internet. Trang web dùng Google dịch máy trực tuyến; danh sách ngôn ngữ web không thể hiện phạm vi hỗ trợ của Apple."],
      ["Giải thích câu tùy chọn", "Thiết bị nào cũng có giải thích câu bằng AI không?", "Giải thích tùy chọn dùng mô hình hệ thống Apple trên iOS 26 hoặc macOS 26 trở lên, với phần cứng hỗ trợ Apple Intelligence, tính năng đã bật và mô hình sẵn sàng. Ngôn ngữ hệ thống cũng ảnh hưởng khả năng sử dụng. Đây là tính năng riêng với dịch và không có trên web. Hãy đối chiếu bản dịch và giải thích với câu gốc."]
    ]
  },
  "pt-BR": {
    title: "Entenda frases. Guarde o contexto. Revise com intervalos.",
    summary: "No iPhone, iPad e Mac, entenda uma frase que você quer ler, salve palavras úteis com o contexto original e revise quando chegar a hora. Pesquise na biblioteca local, adicione notas e exporte CSV para seu jeito de estudar.",
    homeTitle: "PhraseCut | Vocabulário em Contexto e Repetição Espaçada",
    homeDescription: "Aprenda palavras com frases que você gosta. Salve contexto e notas, revise no app ou experimente tradução online e exportação CSV.",
    helpTitle: "Ajuda PhraseCut | Contexto, Revisão Espaçada e CSV",
    helpDescription: "Saiba como salvar contexto, revisar e exportar CSV no iPhone, iPad e Mac, com os requisitos de idiomas offline e explicações opcionais por Apple Intelligence.",
    helpHeading: "Comece por uma frase que você quer entender",
    sections: [
      ["Entenda antes de memorizar", "Como aprender vocabulário com frases?", "Cole o texto, escolha os idiomas de origem e destino e leia a tradução completa antes de explorar cada palavra. Ouça a pronúncia e salve palavras, expressões ou a frase inteira. As palavras são traduzidas separadamente; confira sentidos diferentes com a frase original, sem tratar o resultado como uma explicação contextual exata."],
      ["Preserve o contexto original", "O que a biblioteca do app salva?", "Os itens guardam a frase original, a tradução e o par de idiomas. Pesquise na biblioteca local, filtre palavras, expressões ou frases e acrescente notas. O app serve para inglês e outros idiomas compatíveis, não apenas frases difíceis em inglês. O idioma da interface não garante todos os sentidos de tradução."],
      ["Revise quando chegar a hora", "Como funcionam a repetição espaçada e os lembretes?", "O app usa um plano leve de repetição espaçada. Veja a resposta e indique algo como repetir, difícil, lembrei ou fácil para ajustar a próxima revisão. Lembretes locais opcionais precisam de permissão de notificações; a entrega também depende das configurações do sistema. O site não tem biblioteca de revisão salva nem lembretes."],
      ["Exporte um arquivo, não uma conta", "Posso exportar para o Anki ou sincronizar a biblioteca?", "Exporte CSV padrão ou CSV compatível com Anki pela Biblioteca do app. O arquivo mantém contexto e notas para importação manual no seu fluxo de estudo. Não é sincronização automática de conta nem um baralho APKG. O CSV Anki do app usa Front e Back, diferente de Word e Meaning no site."],
      ["Prepare os recursos offline", "O PhraseCut traduz offline?", "O app usa Apple Translation. A tradução offline exige um par de idiomas compatível e os pacotes necessários instalados no aparelho. Baixar recursos e buscar novas frases recomendadas exige internet. O site usa tradução automática online do Google; sua lista de idiomas não descreve a disponibilidade da Apple."],
      ["Explicações opcionais de frases", "Todos os aparelhos têm explicações por IA?", "As explicações opcionais usam o modelo do sistema Apple no iOS 26 ou macOS 26 ou posterior, com hardware compatível com Apple Intelligence, recurso ativado e modelo pronto. O suporte ao idioma do sistema também afeta a disponibilidade. É um recurso separado da tradução e não existe no site. Confira traduções e explicações com o original."]
    ]
  }
};
