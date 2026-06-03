require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const Opening = require('./models/Opening');

const openings = [
  {
    slug: 'ruy-lopez',
    name: 'Ruy López',
    aka: 'Spanish Opening',
    eco: 'C60–C99',
    category: 'Open',
    difficulty: 'intermediate',
    moves: [{ w: 'e4', b: 'e5' }, { w: 'Nf3', b: 'Nc6' }, { w: 'Bb5', b: '' }],
    why: 'Tượng b5 gây sức ép lên Mã c6 — người bảo vệ tốt e5. Nếu Mã bị mất, tốt e5 mất điểm tựa. Opening được chơi nhiều nhất ở cấp cao, cân bằng giữa phát triển và tấn công.',
    ideas: 'Trắng muốn chiếm trung tâm d4, tạo áp lực cánh Vua, nhập thành nhanh. Áp lực lên e5 và Mã c6 luôn hiện diện. Chiến lược "slow squeeze" — siết dần từng bước.',
    pros: ['Áp lực chiến lược liên tục', 'Được kiểm chứng ở cấp cao nhất', 'Nhiều variation phong phú'],
    cons: ['Phức tạp, cần học nhiều biến thể', 'Đen có nhiều phương án phản công tốt'],
    variations: [
      { name: 'Berlin Defense', moves: '3...Nf6', desc: 'Rất vững chắc, Magnus Carlsen ưa dùng.' },
      { name: 'Morphy Defense', moves: '3...a6 4.Ba4', desc: 'Phổ biến nhất, linh hoạt.' },
      { name: 'Exchange Variation', moves: '4.Bxc6 dxc6', desc: 'Trắng phá cấu trúc tốt Đen.' },
    ],
    tip: '"Torture your opponent slowly" — Ruy López tạo áp lực kéo dài suốt ván.',
  },
  {
    slug: 'sicilian',
    name: 'Sicilian Defense',
    aka: 'Phòng thủ Sicily',
    eco: 'B20–B99',
    category: 'Semi-Open',
    difficulty: 'advanced',
    moves: [{ w: 'e4', b: 'c5' }],
    why: 'Tốt c5 kiểm soát ô d4, ngăn Trắng xây trung tâm lý tưởng. Đen chấp nhận bất đối xứng để đổi lấy counterplay mạnh hơn.',
    ideas: 'Đen tạo phản công cánh Hậu (c4, b5) trong khi Trắng tấn công cánh Vua. Ai nhanh hơn thắng. Cột c mở sau cxd4 là đường tấn công chính của Đen.',
    pros: ['Phản công mạnh nhất cho Đen vs 1.e4', 'Bất đối xứng tạo cơ hội thắng cho cả hai', 'Thống kê: Đen thắng nhiều nhất vs 1.e4'],
    cons: ['Cực kỳ phức tạp, cần nhiều lý thuyết', 'Trắng có nhiều gambit sắc bén', 'Sai lầm nhỏ dễ thua nhanh'],
    variations: [
      { name: 'Najdorf (5...a6)', moves: '5...a6', desc: 'Phổ biến nhất thế giới. Kasparov, Fischer dùng.' },
      { name: 'Dragon (5...g6)', moves: '5...g6', desc: 'Tượng g7 trên đường chéo dài, cực kỳ sắc bén.' },
      { name: 'Scheveningen (5...e6)', moves: '5...e6', desc: 'Kiên cố hơn Dragon, cấu trúc vững chắc.' },
    ],
    tip: 'Nếu mới học Sicilian, bắt đầu từ Kan (5...e6, 6...a6) — ít lý thuyết hơn Najdorf nhưng giữ được tinh thần Sicilian.',
  },
  {
    slug: 'italian',
    name: 'Italian Game',
    aka: 'Giuoco Piano',
    eco: 'C50–C59',
    category: 'Open',
    difficulty: 'beginner',
    moves: [{ w: 'e4', b: 'e5' }, { w: 'Nf3', b: 'Nc6' }, { w: 'Bc4', b: '' }],
    why: 'Tượng c4 nhắm thẳng vào điểm yếu f7 — chỉ được Vua bảo vệ. Opening kinh điển nhất, dễ hiểu, tuân thủ đúng mọi nguyên tắc khai cuộc.',
    ideas: 'Mọi quân hướng về phía Vua Đen: Bc4 + Ng5 + Qf3 tạo mối đe dọa Nxf7. Phù hợp người mới vì mọi nước đi đều có lý do rõ ràng.',
    pros: ['Dễ hiểu, tuân thủ đúng nguyên tắc', 'Tấn công tự nhiên vào điểm yếu f7', 'Ít lý thuyết, phù hợp mọi trình độ'],
    cons: ['Đen có nhiều cách phòng thủ vững chắc', 'Ít áp lực chiến lược hơn Ruy López'],
    variations: [
      { name: 'Giuoco Piano', moves: '3...Bc5 4.c3', desc: 'Đen phát triển Tượng đối xứng, trận chiến trung tâm.' },
      { name: 'Two Knights', moves: '3...Nf6 4.Ng5', desc: 'Phản công ngay với Mã, nhiều chiến thuật sắc bén.' },
      { name: 'Evans Gambit', moves: '3...Bc5 4.b4!?', desc: 'Hi sinh tốt b4, phát triển cực nhanh, Kasparov ưa dùng.' },
    ],
    tip: 'Italian Game là "trường học" hoàn hảo: mọi nước đi đều có lý do rõ ràng. Hiểu Italian là hiểu 80% nguyên tắc khai cuộc.',
  },
  {
    slug: 'queens-gambit',
    name: "Queen's Gambit",
    aka: 'Gambit Hậu',
    eco: 'D06–D69',
    category: 'Closed',
    difficulty: 'intermediate',
    moves: [{ w: 'd4', b: 'd5' }, { w: 'c4', b: '' }],
    why: 'Tốt c4 tấn công tốt d5, đặt Đen vào tình huống phải chọn. Không phải gambit thật — Trắng luôn lấy lại được. Nếu Đen ăn, Trắng chiếm toàn bộ trung tâm bằng e4.',
    ideas: 'Người kiểm soát e4+d4 kiểm soát ván cờ. QGA: Trắng chiếm trung tâm; QGD: Đen giữ trung tâm nhưng gánh Bad Bishop; Slav: cân bằng nhất.',
    pros: ['Rất vững chắc và có lý về chiến lược', 'Được dùng ở mọi giải đấu lớn', 'Trắng luôn có initiative'],
    cons: ['Chậm hơn open games', 'Cần hiểu sâu về cấu trúc tốt và bad bishop'],
    variations: [
      { name: 'QGA (Accepted)', moves: '2...dxc4', desc: 'Đen ăn tốt, Trắng chiếm trung tâm.' },
      { name: 'QGD (Declined)', moves: '2...e6', desc: 'Kiên cố nhất, nhưng gánh Bad Bishop c8.' },
      { name: 'Slav Defense', moves: '2...c6', desc: 'Cân bằng nhất, giữ Tượng c8 tự do.' },
    ],
    tip: "Queen's Gambit dạy bạn tại sao trung tâm quan trọng — người kiểm soát e4+d4 thường kiểm soát ván cờ.",
  },
  {
    slug: 'kings-indian',
    name: "King's Indian Defense",
    eco: 'E60–E99',
    category: 'Indian',
    difficulty: 'advanced',
    moves: [{ w: 'd4', b: 'Nf6' }, { w: 'c4', b: 'g6' }, { w: 'Nc3', b: 'Bg7' }, { w: 'e4', b: 'd6' }],
    why: 'Hypermodern — Đen nhường trung tâm cho Trắng xây dựng rồi phá vỡ sau. Tượng g7 trên đường chéo dài h8-a1 là vũ khí chính sau khi trung tâm mở.',
    ideas: 'Đen phản công bằng ...e5 để phá trung tâm d4. Nếu Trắng đẩy d5, Đen tấn công cánh Vua bằng f5-f4. Trắng tấn công cánh Hậu bằng c5-b4.',
    pros: ['Phản công cực kỳ mạnh', 'Tạo game mất cân bằng', 'Kasparov vô địch thế giới nhiều lần với KID'],
    cons: ['Nguy hiểm nếu không phản công kịp', 'Cần hiểu sâu variation', 'Trắng có lợi thế không gian đáng kể'],
    variations: [
      { name: 'Classical (5.Nf3)', moves: '5.Nf3 0-0 6.Be2 e5', desc: 'Trắng phát triển ổn định, cuộc chiến 2 cánh.' },
      { name: 'Samisch (5.f3)', moves: '5.f3 0-0 6.Be3', desc: 'Trắng hung hãn, chuẩn bị tấn công cánh Vua ngay.' },
      { name: 'Four Pawns Attack', moves: '5.f4 0-0 6.Nf3', desc: 'Tường tốt khổng lồ, rất mạo hiểm.' },
    ],
    tip: 'KID dạy bài học quan trọng: không gian không phải tất cả — initiative và counterplay đúng lúc còn mạnh hơn.',
  },
  {
    slug: 'french',
    name: 'French Defense',
    aka: 'Phòng thủ Pháp',
    eco: 'C00–C19',
    category: 'Semi-Open',
    difficulty: 'intermediate',
    moves: [{ w: 'e4', b: 'e6' }, { w: 'd4', b: 'd5' }],
    why: 'Đen xây pháo đài với e6+d5, chịu đựng áp lực ban đầu để phản công sau bằng ...c5 phá vỡ trung tâm Trắng. Đánh đổi không gian lấy sự vững chắc.',
    ideas: 'Đen đẩy ...c5 để tấn công d4. Nếu Trắng đổi dxc5, Tượng c8 được giải phóng. Kế hoạch của Đen rõ ràng nhưng phải xử lý Bad Bishop c8 suốt ván.',
    pros: ['Cấu trúc tốt d5+e6 rất vững chắc', 'Phản công rõ ràng với ...c5', 'Khó bị tấn công trực tiếp'],
    cons: ['Bad Bishop c8 là gánh nặng suốt ván', 'Bị thu hẹp không gian ban đầu'],
    variations: [
      { name: 'Winawer (3...Bb4)', moves: '3.Nc3 Bb4', desc: 'Sắc bén nhất, Đen ghim Mã c3 ngay.' },
      { name: 'Classical (3...Nf6)', moves: '3.Nc3 Nf6', desc: 'Phát triển tự nhiên, thách thức e4.' },
      { name: 'Advance (3.e5)', moves: '3.e5 c5', desc: 'Trắng đẩy tốt khóa trung tâm ngay.' },
    ],
    tip: 'Trong French, hãy luôn tìm cách giải phóng Bad Bishop — đó là chìa khóa chuyển từ phòng thủ sang tấn công.',
  },
  {
    slug: 'caro-kann',
    name: 'Caro-Kann Defense',
    eco: 'B10–B19',
    category: 'Semi-Open',
    difficulty: 'intermediate',
    moves: [{ w: 'e4', b: 'c6' }, { w: 'd4', b: 'd5' }],
    why: 'Giống French nhưng không có Bad Bishop. Tốt c6 hỗ trợ d5, sau ...dxe4 + ...Bf5, Đen có cấu trúc hoàn hảo với Tượng hoạt động tự do.',
    ideas: 'Đen thách thức trung tâm ngay ở nước 2. Sau khi trao đổi trung tâm, Đen đưa Tượng c8 ra f5 — điểm khác biệt hoàn toàn với French. Solid và ít lý thuyết hơn Sicilian.',
    pros: ['Cấu trúc tốt hoàn hảo, không có Bad Bishop', 'Tượng c8 tự do phát triển', 'Ít lý thuyết hơn Sicilian'],
    cons: ['Chậm hơn Sicilian, ít phản công sắc bén', 'Đen thường chơi thụ động'],
    variations: [
      { name: 'Classical (4.Nxe4 Bf5)', moves: '3.Nc3 dxe4 4.Nxe4 Bf5', desc: 'Chuẩn nhất — Tượng ra f5 ngay.' },
      { name: 'Advance (3.e5)', moves: '3.e5 Bf5', desc: 'Trắng khóa trung tâm, Đen giải phóng Tượng sớm.' },
      { name: 'Exchange (3.exd5)', moves: '3.exd5 cxd5', desc: 'Đối xứng với IQP cho Đen.' },
    ],
    tip: 'Caro-Kann là lựa chọn hoàn hảo nếu muốn chơi solid mà không cần học lý thuyết Sicilian dày đặc.',
  },
  {
    slug: 'london',
    name: 'London System',
    eco: 'D02–D05',
    category: 'Closed',
    difficulty: 'beginner',
    moves: [{ w: 'd4', b: 'd5' }, { w: 'Nf3', b: 'Nf6' }, { w: 'Bf4', b: '' }],
    why: '"Set it and forget it" — Trắng chơi d4, Nf3, Bf4 bất kể Đen làm gì. Tượng f4 kiểm soát e5, khó bị đuổi. Không cần phản ứng với mỗi nước đi của Đen.',
    ideas: 'Sau khi hoàn thành phát triển (d4+Nf3+Bf4+e3+Bd3+c3+0-0), Trắng tấn công theo kế hoạch cố định. Phù hợp mọi trình độ: người mới dùng để học nguyên tắc, người cao để tâm lý chiến.',
    pros: ['Gần như không cần học lý thuyết', 'Solid, khó tấn công nhanh', 'Linh hoạt chuyển sang nhiều cấu trúc'],
    cons: ['Ít initiative vs đối thủ mạnh', 'Đen dễ tạo counterplay nếu biết cách'],
    variations: [
      { name: 'Standard London', moves: '4.e3 e6 5.Bd3 c5', desc: 'Cấu trúc chuẩn, Trắng phát triển Bd3+0-0.' },
      { name: 'London vs KID', moves: '3...g6 4.e3 Bg7 5.Be2', desc: 'Khi Đen chơi fianchetto, Trắng điều chỉnh với Be2.' },
    ],
    tip: 'London dạy bạn rằng có kế hoạch rõ ràng và kiên nhẫn thực hiện đôi khi còn mạnh hơn lý thuyết sâu.',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess_openings', {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB connected');

    // Xoá dữ liệu cũ
    await Opening.deleteMany({});
    console.log('🗑️  Old openings cleared');

    // Insert mới
    const result = await Opening.insertMany(openings);
    console.log(`✅ Seeded ${result.length} openings:`);
    result.forEach(o => console.log(`   - ${o.slug}: ${o.name}`));

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();
