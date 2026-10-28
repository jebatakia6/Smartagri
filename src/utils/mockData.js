// Mock Database for agricultural insights, recommendations, and historic logs
const cropsDb = [
  {
    id: "rice",
    nameEn: "Rice (Aman)",
    nameBn: "ধান (আমন)",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=250",
    phRange: "5.5 - 6.5",
    moistureRange: "60% - 80%",
    waterDemandEn: "High (Frequent Flooding)",
    waterDemandBn: "উচ্চ (ঘন ঘন সেচ)",
    yieldEn: "4.5 - 5.5 Tons/Hectare",
    yieldBn: "৪.৫ - ৫.৫ টন/হেক্টর",
    compatibility: 95,
    suitabilityEn: "Highly Suitable",
    suitabilityBn: "অত্যন্ত উপযুক্ত",
    seasonEn: "Kharif (Monsoon)",
    seasonBn: "খরিফ (বর্ষাকালীন)",
    riskEn: "Low Risk",
    riskBn: "কম ঝুঁকি",
    riskColor: "text-emerald-500 bg-emerald-500/10",
    explanationEn: "Current soil conditions offer optimal clay structure and high moisture retention perfect for paddy cultivation. Highly recommended for this monsoon cycle.",
    explanationBn: "বর্তমান মাটির পরিস্থিতি আমন ধানের চাষের জন্য আদর্শ কাদামাটির গঠন এবং চমৎকার আর্দ্রতা ধারণ ক্ষমতা প্রদান করে। বর্ষাকালীন এই মরশুমের জন্য এটি অত্যন্ত প্রস্তাবিত।"
  },
  {
    id: "wheat",
    nameEn: "Wheat (Sonalika)",
    nameBn: "গম (সোনালিকা)",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=250",
    phRange: "6.0 - 7.0",
    moistureRange: "40% - 60%",
    waterDemandEn: "Medium (Periodic Irrigation)",
    waterDemandBn: "মাঝারি (পর্যায়ক্রমিক সেচ)",
    yieldEn: "3.2 - 4.0 Tons/Hectare",
    yieldBn: "৩.২ - ৪.০ টন/হেক্টর",
    compatibility: 82,
    suitabilityEn: "Suitable",
    suitabilityBn: "উপযুক্ত",
    seasonEn: "Rabi (Winter)",
    seasonBn: "রবি (শীতকালীন)",
    riskEn: "Moderate Risk",
    riskBn: "মাঝারি ঝুঁকি",
    riskColor: "text-amber-500 bg-amber-500/10",
    explanationEn: "Excellent ph matches. Requires slight drainage adjustments to ensure roots remain aerated, especially during seed development stages.",
    explanationBn: "মাটির পিএইচ (pH) মান চমৎকার রয়েছে। বীজ অঙ্কুরোদগমের সময় শিকড়ে পর্যাপ্ত বাতাস চলাচলের জন্য অতিরিক্ত আর্দ্রতা নিষ্কাশনের সামান্য ব্যবস্থা প্রয়োজন।"
  },
  {
    id: "maize",
    nameEn: "Maize (Corn)",
    nameBn: "ভুট্টা",
    image: "https://images.unsplash.com/photo-1551754625-70c90487530d?auto=format&fit=crop&q=80&w=250",
    phRange: "5.8 - 7.2",
    moistureRange: "50% - 70%",
    waterDemandEn: "Medium",
    waterDemandBn: "মাঝারি",
    yieldEn: "6.0 - 8.0 Tons/Hectare",
    yieldBn: "৬.০ - ৮.০ টন/হেক্টর",
    compatibility: 89,
    suitabilityEn: "Highly Suitable",
    suitabilityBn: "অত্যন্ত উপযুক্ত",
    seasonEn: "Year-Round",
    seasonBn: "সারা বছর",
    riskEn: "Low Risk",
    riskBn: "কম ঝুঁকি",
    riskColor: "text-emerald-500 bg-emerald-500/10",
    explanationEn: "Rich nitrogen availability detected. Maize will thrive optimally in these nutrient ratios with minimal supplemental irrigation.",
    explanationBn: "মাটিতে উচ্চ নাইট্রোজেনের উপস্থিতি সনাক্ত হয়েছে। ন্যূনতম পরিপূরক সেচ ও এই পুষ্টির অনুপাতে ভুট্টা খুব চমৎকারভাবে বৃদ্ধি পাবে।"
  },
  {
    id: "potato",
    nameEn: "Potato (Diamant)",
    nameBn: "আলু (ডায়মন্ড)",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=250",
    phRange: "5.2 - 6.4",
    moistureRange: "35% - 50%",
    waterDemandEn: "Low to Medium",
    waterDemandBn: "কম থেকে মাঝারি",
    yieldEn: "20 - 25 Tons/Hectare",
    yieldBn: "২০ - ২৫ টন/হেক্টর",
    compatibility: 74,
    suitabilityEn: "Moderately Suitable",
    suitabilityBn: "মোটামুটি উপযুক্ত",
    seasonEn: "Rabi (Winter)",
    seasonBn: "রবি (শীতকালীন)",
    riskEn: "Moderate Risk",
    riskBn: "মাঝারি ঝুঁকি",
    riskColor: "text-amber-500 bg-amber-500/10",
    explanationEn: "Slightly higher soil moisture than optimal. Planting in raised ridges recommended to prevent root rot and enhance tuber development.",
    explanationBn: "মাটির আর্দ্রতা অনুকূল মানের চেয়ে সামান্য বেশি। কন্দ পচা রোগ রোধ এবং আলুর সঠিক বৃদ্ধির জন্য উঁচু বেড তৈরি করে চাষ করার পরামর্শ দেওয়া হচ্ছে।"
  },
  {
    id: "tomato",
    nameEn: "Tomato (Roma)",
    nameBn: "টমেটো (রোমা)",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=250",
    phRange: "6.0 - 6.8",
    moistureRange: "45% - 65%",
    waterDemandEn: "Medium",
    waterDemandBn: "মাঝারি",
    yieldEn: "35 - 45 Tons/Hectare",
    yieldBn: "৩৫ - ৪৫ টন/হেক্টর",
    compatibility: 91,
    suitabilityEn: "Highly Suitable",
    suitabilityBn: "অত্যন্ত উপযুক্ত",
    seasonEn: "Year-Round",
    seasonBn: "সারা বছর",
    riskEn: "Low Risk",
    riskBn: "কম ঝুঁকি",
    riskColor: "text-emerald-500 bg-emerald-500/10",
    explanationEn: "Fantastic soil conditions. pH is in the premium range, and balanced phosphorus levels will lead to early flowering and massive tomato yields.",
    explanationBn: "মাটির চমৎকার পরিস্থিতি। পিএইচ একদম আদর্শ সীমার মধ্যে রয়েছে এবং সুষম ফসফরাসের মাত্রা দ্রুত ফুল আনা ও প্রচুর ফলনে সহায়তা করবে।"
  },
  {
    id: "mustard",
    nameEn: "Mustard",
    nameBn: "সরিষা",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=250",
    phRange: "6.0 - 7.5",
    moistureRange: "30% - 45%",
    waterDemandEn: "Low",
    waterDemandBn: "কম সেচ",
    yieldEn: "1.2 - 1.8 Tons/Hectare",
    yieldBn: "১.২ - ১.৮ টন/হেক্টর",
    compatibility: 65,
    suitabilityEn: "Marginally Suitable",
    suitabilityBn: "সীমাবদ্ধভাবে উপযুক্ত",
    seasonEn: "Rabi (Winter)",
    seasonBn: "রবি (শীতকালীন)",
    riskEn: "High Risk",
    riskBn: "উচ্চ ঝুঁকি",
    riskColor: "text-red-500 bg-red-500/10",
    explanationEn: "Current soil moisture is too high for mustard cultivation. Delayed planting recommended until soil drains to below 40% moisture.",
    explanationBn: "সরিষা চাষের জন্য মাটির আর্দ্রতা বর্তমানে অতিরিক্ত বেশি। মাটির আর্দ্রতা ৪০% এর নিচে না আসা পর্যন্ত সরিষা বীজ বপন পিছিয়ে দেওয়ার পরামর্শ রইল।"
  }
];

const fertilizerRules = {
  nitrogenDeficit: {
    nameEn: "Urea (46% Nitrogen)",
    nameBn: "ইউরিয়া (৪৬% নাইট্রোজেন)",
    qtyEn: "120 - 150 kg per Hectare",
    qtyBn: "১২০ - ১৫০ কেজি প্রতি হেক্টর",
    applicationEn: "Apply in 3 split doses: 1/3rd as basal during land preparation, 1/3rd at active tillering phase, and 1/3rd right before panicle initiation.",
    applicationBn: "৩টি সমান কিস্তিতে প্রয়োগ করুন: জমি তৈরির সময় ১/৩ অংশ, কুশি গজানোর সময় ১/৩ অংশ এবং ফুল আসার ঠিক আগে বাকি ১/৩ অংশ।",
    soilTipsEn: "Incorporate organic compost or bio-fertilizers to increase carbon levels and improve long-term nitrogen retention.",
    soilTipsBn: "মাটির কার্বন বৃদ্ধি করতে এবং দীর্ঘমেয়াদে নাইট্রোজেন ধরে রাখার ক্ষমতা উন্নত করতে খামারজাত জৈব সার বা কেঁচোসার যোগ করুন।"
  },
  phosphorusDeficit: {
    nameEn: "Triple Superphosphate (TSP)",
    nameBn: "টিএসপি সার (TSP)",
    qtyEn: "80 - 100 kg per Hectare",
    qtyBn: "৮০ - ১০০ কেজি প্রতি হেক্টর",
    applicationEn: "Full basal application. Mix deeply into root-zone during final plowing. Soluble phosphorus requires soil contact to lock in.",
    applicationBn: "সম্পূর্ণ বেসাল ডোজ হিসেবে জমি চাষের শেষ ধাপে মাটির গভীরে ভালোমতো মিশিয়ে দিন। দ্রবণীয় ফসফরাস মাটির সংস্পর্শে কার্যকরী হয়।",
    soilTipsEn: "Maintain soil pH near 6.5. Acidity below 5.5 fixes phosphorus, rendering it unavailable to roots.",
    soilTipsBn: "মাটির পিএইচ ৬.৫ এর কাছাকাছি রাখুন। পিএইচ ৫.৫ এর নিচে নামলে ফসফরাস মাটিতে আবদ্ধ হয়ে পড়ে যা গাছের শিকড় গ্রহণ করতে পারে না।"
  },
  potassiumDeficit: {
    nameEn: "Muriate of Potash (MOP)",
    nameBn: "এমওপি সার (MOP - পটাশ)",
    qtyEn: "70 - 90 kg per Hectare",
    qtyBn: "৭০ - ৯০ কেজি প্রতি হেক্টর",
    applicationEn: "Apply 50% at final land preparation, and the remaining 50% during the primary vegetative growth stage.",
    applicationBn: "জমি তৈরির সময় ৫০% সার এবং বাকি ৫০% গাছের প্রাথমিক অঙ্গজ বৃদ্ধির সময়ে প্রয়োগ করুন।",
    soilTipsEn: "Ensure adequate moisture levels during application, as potassium absorption is highly dependent on transpirational water flow.",
    soilTipsBn: "সার প্রয়োগের সময় মাটিতে পর্যাপ্ত আর্দ্রতা নিশ্চিত করুন, কারণ পটাশিয়াম শোষণ মূলত মাটির পানির প্রবাহের ওপর নির্ভরশীল।"
  },
  balancedSoil: {
    nameEn: "NPK Compound Fertilizer (15-15-15)",
    nameBn: "এনপিকে মিশ্র সার (১৫-১৫-১৫)",
    qtyEn: "100 kg per Hectare",
    qtyBn: "১০০ কেজি প্রতি হেক্টর",
    applicationEn: "Maintenance dosage. Broadcast evenly across the field after primary crop weeding.",
    applicationBn: "মাটির রক্ষণাবেক্ষণ ডোজ। জমিতে প্রাথমিক আগাছা পরিষ্কার করার পর সমভাবে ছিটিয়ে দিন।",
    soilTipsEn: "Use mulching techniques to preserve humus structure and prevent organic runoff during heavy rainfall.",
    soilTipsBn: "মাটির হিউমাস গঠন রক্ষা করতে এবং ভারী বৃষ্টির সময় পুষ্টি উপাদান ধুয়ে যাওয়া রোধ করতে মালচিং পদ্ধতি ব্যবহার করুন।"
  }
};

const weatherForecast = [
  { dayEn: "Today", dayBn: "আজ", date: "May 21", tempMax: 33, tempMin: 26, humidity: 76, rainProb: 20, condEn: "Partly Cloudy", condBn: "আংশিক মেঘলা", icon: "cloud-sun", adviceEn: "Perfect day for direct fertilizer application and weeding.", adviceBn: "সার প্রয়োগ এবং আগাছা পরিষ্কার করার জন্য অত্যন্ত উপযুক্ত দিন।" },
  { dayEn: "Fri", dayBn: "শুক্র", date: "May 22", tempMax: 32, tempMin: 25, humidity: 82, rainProb: 65, condEn: "Scattered Showers", condBn: "বিক্ষিপ্ত বৃষ্টি", icon: "cloud-rain", adviceEn: "Hold irrigation. Soil moisture will increase naturally via rainfall.", adviceBn: "সেচ দেওয়া বন্ধ রাখুন। বৃষ্টির মাধ্যমে মাটির আর্দ্রতা প্রাকৃতিকভাবে বৃদ্ধি পাবে।" },
  { dayEn: "Sat", dayBn: "শনি", date: "May 23", tempMax: 30, tempMin: 24, humidity: 88, rainProb: 90, condEn: "Thunderstorm", condBn: "বজ্রঝড়", icon: "cloud-showers-heavy", adviceEn: "Clear drainage channels. Risk of field flooding and waterlogging.", adviceBn: "পানি নিষ্কাশন নালা পরিষ্কার করুন। জমিতে জলাবদ্ধতা সৃষ্টির আশঙ্কা রয়েছে।" },
  { dayEn: "Sun", dayBn: "রবি", date: "May 24", tempMax: 31, tempMin: 24, humidity: 80, rainProb: 40, condEn: "Light Rain", condBn: "হালকা বৃষ্টি", icon: "cloud-sun-rain", adviceEn: "Drain excess water. Do not apply chemical foliar sprays today.", adviceBn: "অতিরিক্ত পানি বের করে দিন। আজকে পাতায় রাসায়নিক স্প্রে করা থেকে বিরত থাকুন।" },
  { dayEn: "Mon", dayBn: "সোম", date: "May 25", tempMax: 34, tempMin: 27, humidity: 70, rainProb: 10, condEn: "Sunny & Warm", condBn: "রৌদ্রোজ্জ্বল", icon: "sun", adviceEn: "Excellent weather for crop health inspections and harvesting.", adviceBn: "ফসল পর্যবেক্ষণ এবং ফসল কাটার জন্য অনুকূল চমৎকার রৌদ্রোজ্জ্বল দিন।" },
  { dayEn: "Tue", dayBn: "মঙ্গল", date: "May 26", tempMax: 35, tempMin: 28, humidity: 68, rainProb: 5, condEn: "Sunny", condBn: "পরিষ্কার রোদ", icon: "sun", adviceEn: "Activate drip irrigation system. Soil evaporation rates are high.", adviceBn: "ড্রিপ সেচ ব্যবস্থা চালু করুন। অতিরিক্ত রোদে মাটি দ্রুত শুষ্ক হয়ে যাবে।" },
  { dayEn: "Wed", dayBn: "বুধ", date: "May 27", tempMax: 33, tempMin: 26, humidity: 74, rainProb: 15, condEn: "Mostly Sunny", condBn: "প্রধানত রৌদ্রোজ্জ্বল", icon: "cloud-sun", adviceEn: "Ideal conditions for routine IoT sensor recalibrations.", adviceBn: "আইওটি সেন্সর রুটিন পরীক্ষা বা পুনঃক্যালিব্রেশনের জন্য চমৎকার দিন।" }
];

// Pre-fill a robust 25 rows of history logs
const generateHistoryLogs = () => {
  const logs = [];
  const cropsEn = ["Rice (Aman)", "Maize (Corn)", "Tomato (Roma)", "Wheat (Sonalika)", "Potato (Diamant)"];
  const cropsBn = ["ধান (আমন)", "ভুট্টা", "টমেটো (রোমা)", "গম (সোনালিকা)", "আলু (ডায়মন্ড)"];
  
  const fertilizersEn = ["Urea (Nitrogen Supplement)", "TSP (Phosphorus)", "MOP (Potassium)", "Balanced NPK Mix", "None (Sufficient)"];
  const fertilizersBn = ["ইউরিয়া (নাইট্রোজেন সম্পূরক)", "টিএসপি সার (ফসফরাস)", "এমওপি সার (পটাশ)", "সুষম এনপিকে মিশ্রণ", "প্রয়োজন নেই (পর্যাপ্ত)"];
  
  const statusesEn = ["Connected", "Connected", "Connected", "Connected", "Calibrating", "Connected"];
  const statusesBn = ["সংযুক্ত", "সংযুক্ত", "সংযুক্ত", "সংযুক্ত", "ক্যালিব্রেট হচ্ছে", "সংযুক্ত"];
  
  // Starting date: May 21st, 2026. Generating retrospective logs going backward.
  for (let i = 0; i < 35; i++) {
    const logDate = new Date(Date.now() - 1000 * 60 * 60 * 4 * i); // Every 4 hours
    
    // Simulate cyclic sensor deviations
    const moisture = +(40 + Math.sin(i / 3) * 15 + Math.random() * 5).toFixed(1);
    const ph = +(6.2 + Math.cos(i / 5) * 0.5 + Math.random() * 0.2).toFixed(2);
    const temp = +(26 + Math.sin(i / 2) * 4 + Math.random() * 2).toFixed(1);
    
    let cropIndex = 0;
    if (moisture > 60) cropIndex = 0; // Rice
    else if (moisture > 50) cropIndex = 1; // Maize
    else if (ph > 6.0 && ph < 6.8) cropIndex = 2; // Tomato
    else if (ph >= 6.0) cropIndex = 3; // Wheat
    else cropIndex = 4; // Potato

    let fertilizerIndex = 4;
    if (ph < 5.6) fertilizerIndex = 1; // TSP
    else if (moisture < 35) fertilizerIndex = 3; // NPK
    else if (i % 7 === 0) fertilizerIndex = 0; // Urea
    else if (i % 11 === 0) fertilizerIndex = 2; // MOP

    logs.push({
      id: `L-${1000 + i}`,
      date: logDate,
      moisture,
      ph,
      temperature: temp,
      recommendedCropEn: cropsEn[cropIndex],
      recommendedCropBn: cropsBn[cropIndex],
      fertilizerAdviceEn: fertilizersEn[fertilizerIndex],
      fertilizerAdviceBn: fertilizersBn[fertilizerIndex],
      statusEn: statusesEn[i % statusesEn.length],
      statusBn: statusesBn[i % statusesEn.length]
    });
  }
  return logs;
};

const historyLogs = generateHistoryLogs();

window.mockData = {
  cropsDb,
  fertilizerRules,
  weatherForecast,
  historyLogs
};
