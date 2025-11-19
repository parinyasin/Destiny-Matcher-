import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ZODIAC_SIGNS, ALL_MATRICES, CATEGORIES, SCORE_RANGES } from './constants';
import { PredictionResult, CategoryScore } from './types';

const BRAND_ICON_URL = "https://scontent.fcnx2-1.fna.fbcdn.net/v/t39.30808-6/293528064_604378537725373_836798200753896058_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFy21KDPO0mrWUymCbFs2R2MPPDRprA8-cw88NGmsDz5w5rdzR_C-x1B1SSKLye-yc&_nc_ohc=OOyaZZqsdKcQ7kNvwHEDmvr&_nc_oc=AdnMLYorNlz6R7r_4JMPBWj8r4nGRn0TV2XlzJeqdZKt5mrqZ_-uVC9-48hQ6y-H79k&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&_nc_gid=oyqaODc7wCEsA_XMXws4og&oh=00_AfjonmCXJNR5pI_EtbXJDXm59dBgQXONb-q1pzMmjnwA4Q&oe=6923902B";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    className={`w-6 h-6 md:w-8 md:h-8 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={filled ? 0 : 1.5} 
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
    />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
  </svg>
);

// Component for High Score Celebration
const SparkleEffect = () => {
  const sparkles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    size: Math.random() * 10 + 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute text-yellow-300 animate-sparkle opacity-0"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.animationDelay,
            width: s.size,
            height: s.size,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]">
             <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Component for Low Score Warning
const WarningEffect = () => {
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col items-center animate-pulse z-10">
      <div className="bg-red-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.8)] border-2 border-red-400">
        <span className="text-2xl md:text-3xl font-bold">!</span>
      </div>
      <span className="text-red-400 text-xs font-bold mt-1 uppercase tracking-wider bg-black/50 px-2 py-1 rounded">ระวัง</span>
    </div>
  );
};

function App() {
  const [mySignId, setMySignId] = useState<number | string>("");
  const [partnerSignId, setPartnerSignId] = useState<number | string>("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const calculateCompatibility = () => {
    if (mySignId === "" || partnerSignId === "") return;

    setLoading(true);
    setResult(null);

    // Simulate "calculation" delay for UX
    setTimeout(() => {
      const mId = Number(mySignId);
      const pId = Number(partnerSignId);

      let total = 0;
      const categoryScores: CategoryScore[] = [];

      ALL_MATRICES.forEach((matrix, index) => {
        // Guard against out of bounds
        if(matrix[mId] && matrix[mId][pId] !== undefined) {
          const score = matrix[mId][pId];
          total += score;
          categoryScores.push({
            category: CATEGORIES[index],
            score: score,
            max: 5
          });
        }
      });

      // Determine Range
      const range = SCORE_RANGES.find(r => total >= r.min && total <= r.max) || SCORE_RANGES[0];
      
      // Randomize prediction
      const randomPrediction = range.predictions[Math.floor(Math.random() * range.predictions.length)];

      // Calculate percentage equivalent
      const maxPossible = 35;
      const percentage = Math.round((total / maxPossible) * 100);

      setResult({
        totalScore: total,
        maxScore: maxPossible,
        percentage,
        stars: range.stars,
        scoreLabel: range.label,
        predictionText: randomPrediction,
        categoryScores
      });
      setLoading(false);
    }, 800);
  };

  const handleShare = async () => {
    if (!result) return;

    const mySignName = ZODIAC_SIGNS.find(z => z.id === Number(mySignId))?.name;
    const partnerSignName = ZODIAC_SIGNS.find(z => z.id === Number(partnerSignId))?.name;

    const shareText = `🔮 เช็กดวงคู่สมพงศ์ กับ การะเกต์พยากรณ์\n\n` +
      `${mySignName} ❤️ ${partnerSignName}\n` +
      `ความเข้ากันได้: ${result.stars} ดาว (${result.totalScore}/${result.maxScore} คะแนน)\n\n` +
      `"${result.predictionText}"\n\n` +
      `#DestinyMatcher #ดูดวง #คู่สมพงศ์`;

    const shareData = {
      title: 'Destiny Matcher เช็กดวงคู่สมพงศ์',
      text: shareText,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Helper to determine styling based on score
  const isHighScore = result ? result.stars >= 4 : false;
  const isLowScore = result ? result.stars <= 2 : false;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white font-sans selection:bg-pink-500 selection:text-white pb-20 relative">
      
      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .animate-sparkle {
          animation: sparkle 2s infinite;
        }
      `}</style>

      {/* Toast Notification */}
      <div 
        className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${showCopiedToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}
      >
        <div className="bg-white text-indigo-900 px-6 py-3 rounded-full shadow-xl font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          คัดลอกผลทำนายเรียบร้อยแล้ว!
        </div>
      </div>

      {/* Header */}
      <header className="pt-10 pb-6 text-center px-4">
        <div className="flex justify-center mb-5">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            <img 
              src={BRAND_ICON_URL} 
              alt="การะเกต์พยากรณ์" 
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white/10 shadow-2xl object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-4 shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/10 max-w-5xl">
          <span className="text-2xl md:text-3xl mr-2 md:mr-4 shrink-0">✨</span>
          <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 leading-relaxed">
            Destiny Matcher เช็กดวงคู่สมพงศ์<br className="hidden md:block" /> กับ การะเกต์พยากรณ์
          </h1>
          <span className="text-2xl md:text-3xl ml-2 md:ml-4 shrink-0">✨</span>
        </div>
        <p className="text-indigo-200 mt-2 text-sm md:text-base font-light">
          ค้นหาคู่แท้และวิเคราะห์ความสมพงศ์ด้วยศาสตร์แห่งดวงดาว
        </p>
      </header>

      <main className="container mx-auto px-4 max-w-4xl">
        
        {/* Input Section */}
        <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* My Sign */}
            <div className="space-y-3">
              <label className="block text-pink-300 text-sm font-semibold tracking-wider uppercase mb-1 ml-1">
                ราศีหรือลัคนาของคุณ
              </label>
              <div className="relative">
                <select
                  value={mySignId}
                  onChange={(e) => setMySignId(e.target.value)}
                  className="w-full bg-indigo-950/50 border border-indigo-500/30 text-white rounded-xl py-4 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer text-lg"
                >
                  <option value="" disabled>เลือกราศีของคุณ...</option>
                  {ZODIAC_SIGNS.map((sign) => (
                    <option key={sign.id} value={sign.id}>
                      {sign.icon} {sign.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-indigo-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Partner Sign */}
            <div className="space-y-3">
              <label className="block text-indigo-300 text-sm font-semibold tracking-wider uppercase mb-1 ml-1">
                ราศีหรือลัคนาของคู่คุณ
              </label>
              <div className="relative">
                <select
                  value={partnerSignId}
                  onChange={(e) => setPartnerSignId(e.target.value)}
                  className="w-full bg-indigo-950/50 border border-indigo-500/30 text-white rounded-xl py-4 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer text-lg"
                >
                  <option value="" disabled>เลือกราศีคู่ของคุณ...</option>
                  {ZODIAC_SIGNS.map((sign) => (
                    <option key={sign.id} value={sign.id}>
                      {sign.icon} {sign.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-indigo-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={calculateCompatibility}
              disabled={mySignId === "" || partnerSignId === "" || loading}
              className={`
                relative overflow-hidden group px-8 py-4 rounded-full text-lg font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all duration-300
                ${(mySignId === "" || partnerSignId === "") 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]'}
              `}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังทำนายดวง...
                </span>
              ) : (
                "ทำนายดวงสมพงศ์"
              )}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {result && !loading && (
          <div className="animate-fade-in-up space-y-6">
            
            {/* Score Card */}
            <section 
              className={`
                relative overflow-hidden backdrop-blur-xl rounded-3xl shadow-2xl transition-all duration-500
                ${isHighScore ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.2)]' : ''}
                ${isLowScore ? 'bg-gradient-to-br from-red-950/60 to-gray-900/60 border border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : ''}
                ${!isHighScore && !isLowScore ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20' : ''}
              `}
            >
              {/* Special Effects Overlays */}
              {isHighScore && <SparkleEffect />}
              {isLowScore && <WarningEffect />}

              {/* Top Bar Color */}
              <div className={`
                absolute top-0 left-0 w-full h-2
                ${isHighScore ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500' : ''}
                ${isLowScore ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-600' : ''}
                ${!isHighScore && !isLowScore ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' : ''}
              `}></div>
              
              <div className="p-8 md:p-10 text-center relative z-1">
                <h2 className="text-gray-300 text-lg mb-2 uppercase tracking-widest font-medium">คะแนนรวมของคุณ</h2>
                <div className="flex items-end justify-center mb-6">
                  <span 
                    className={`text-7xl md:text-8xl font-bold leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]
                      ${isHighScore ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500' : 'text-white'}
                      ${isLowScore ? 'text-red-100' : ''}
                    `}
                  >
                    {result.totalScore}
                  </span>
                  <span className="text-2xl text-indigo-300 mb-2 ml-2 font-light">/ {result.maxScore}</span>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= result.stars} />
                  ))}
                </div>

                <div className={`
                  rounded-2xl p-6 md:p-8 border relative overflow-hidden
                  ${isHighScore ? 'bg-yellow-500/10 border-yellow-500/20' : ''}
                  ${isLowScore ? 'bg-red-500/10 border-red-500/20' : ''}
                  ${!isHighScore && !isLowScore ? 'bg-white/5 border-white/5' : ''}
                `}>
                   <div className="absolute top-0 left-0 p-4 opacity-10">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H7.19921C6.09464 16 5.19921 16.8954 5.19921 18V21H14.017ZM16.017 21H19.017C20.1216 21 21.017 20.1046 21.017 19V11.475C21.017 10.7186 20.6263 10.0139 19.9869 9.61833L13.9869 5.90722C12.7727 5.1562 11.2618 5.1562 10.0476 5.90722L4.04762 9.61833C3.4082 10.0139 3.01746 10.7186 3.01746 11.475V19C3.01746 20.1046 3.91289 21 5.01746 21H6.01746C7.12203 21 8.01746 20.1046 8.01746 19V18C8.01746 17.4477 8.46517 17 9.01746 17H12.0175C12.5697 17 13.0175 17.4477 13.0175 18V19C13.0175 20.1046 13.9129 21 15.0175 21H16.017V21ZM9.01746 12C9.01746 13.1046 9.91289 14 11.0175 14H13.0175C14.122 14 15.0175 13.1046 15.0175 12V9.5C15.0175 9.22386 14.7936 9 14.5175 9H9.51746C9.24132 9 9.01746 9.22386 9.01746 9.5V12Z" /></svg>
                   </div>
                   <p className="text-lg md:text-xl leading-relaxed text-indigo-100 italic">
                     "{result.predictionText}"
                   </p>
                </div>
              </div>
            </section>

            {/* Chart & Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Radar Chart */}
              <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-xl font-semibold text-pink-200 mb-4 text-center">กราฟวิเคราะห์ความสัมพันธ์ 7 ด้าน</h3>
                <div className="w-full h-[350px] text-xs md:text-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.categoryScores}>
                      <PolarGrid stroke="#4f46e5" strokeOpacity={0.3} />
                      <PolarAngleAxis 
                        dataKey="category" 
                        tick={{ fill: '#e0e7ff', fontSize: 12 }} 
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#ec4899"
                        strokeWidth={3}
                        fill="#ec4899"
                        fillOpacity={0.4}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '8px', border: '1px solid #4338ca', color: '#fff' }}
                        itemStyle={{ color: '#f472b6' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* List Breakdown */}
              <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-semibold text-indigo-200 mb-6 text-center">คะแนนความเข้ากันได้แต่ละด้าน</h3>
                <div className="space-y-4">
                  {result.categoryScores.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-200">{cat.category}</span>
                          <span className="text-pink-300 font-bold">{cat.score}/5</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              isHighScore 
                                ? 'bg-gradient-to-r from-yellow-500 to-pink-500' 
                                : 'bg-gradient-to-r from-indigo-500 to-pink-500'
                            }`}
                            style={{ width: `${(cat.score / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-center">
                  <p className="text-sm text-gray-400">
                    ข้อมูลคำนวณตามหลักโหราศาสตร์และสถิติดวงสมพงศ์
                  </p>
                </div>
              </section>

            </div>

            {/* Amulet CTA - Enhanced Design */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 border-2 border-yellow-400/50 rounded-3xl p-8 text-center shadow-[0_0_20px_rgba(234,179,8,0.3)] transform hover:scale-[1.02] transition-all duration-300">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-70"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full"></div>

              <div className="relative z-10">
                <div className="inline-block bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-1 mb-4">
                   <span className="text-yellow-300 font-semibold text-sm tracking-wide">🔮 เคล็ดลับเสริมดวง</span>
                </div>
                
                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6">
                  "ส่วนถ้าอยากจะส่งเสริมความสัมพันธ์ <span className="text-yellow-300 font-bold">แก้ไขผ่อนหนักเป็นเบา</span> <br className="hidden md:block"/> 
                  ใช้<span className="text-pink-300 font-bold">เครื่องรางสนับสนุนความสัมพันธ์</span> แจ้งเราได้ค่ะ"
                </p>
                
                <a 
                  href="https://www.facebook.com/garagayhoro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/40 ring-2 ring-white/20 hover:ring-white/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33398 13.5635 10.1262V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"></path>
                  </svg>
                  <span>ติดต่อการะเกต์พยากรณ์</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Share and Reset Actions */}
            <div className="flex flex-col items-center gap-4 pb-10">
              <button 
                onClick={handleShare}
                className="flex items-center px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                <ShareIcon />
                แชร์ผลคำทำนาย
              </button>

               <button 
                 onClick={() => {
                   setMySignId("");
                   setPartnerSignId("");
                   setResult(null);
                 }}
                 className="text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white transition-all"
               >
                 เริ่มทำนายใหม่
               </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default App;