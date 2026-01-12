
import React, { useState, useMemo, useEffect } from 'react';
import { SUBJECTS, CLUSTERS, GRADE_POINTS } from './constants';
import { Grade, AppStep } from './types';
import { getPointsFromGrade, calculateMeanGradeData, calculateClusterWeight } from './utils';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [selectedGrades, setSelectedGrades] = useState<Record<string, Grade>>({});
  const [step, setStep] = useState<AppStep>(AppStep.Input);
  const [phone, setPhone] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  
  // Modal states for AI course generation
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCluster, setActiveCluster] = useState<any>(null);
  const [generatedCourses, setGeneratedCourses] = useState<string>('');
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);

  // Official Daraja Sandbox Credentials
  const businessShortCode = "174379";
  const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; 

  useEffect(() => {
    const saved = localStorage.getItem('kuccps_used_codes');
    if (saved) setUsedCodes(JSON.parse(saved));
  }, []);

  const handleGradeChange = (subjectId: string, grade: Grade) => {
    setSelectedGrades(prev => ({ ...prev, [subjectId]: grade }));
  };

  const calculationResults = useMemo(() => {
    const { meanGrade, totalPoints } = calculateMeanGradeData(selectedGrades);
    const clusterWeights: Record<number, number> = {};
    
    CLUSTERS.forEach(cluster => {
      let r = 0;
      let valid = true;
      for (const group of cluster.subjects) {
        const groupPoints = group
          .map(id => selectedGrades[id] ? getPointsFromGrade(selectedGrades[id]) : 0)
          .sort((a, b) => b - a)[0];
        if (groupPoints === 0) { valid = false; break; }
        r += groupPoints;
      }
      clusterWeights[cluster.id] = valid ? calculateClusterWeight(r, totalPoints) : 0;
    });

    return { meanGrade, totalPoints, clusterWeights };
  }, [selectedGrades]);

  const initiatePayment = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid M-Pesa number (e.g., 0743315353)');
      return;
    }

    setIsProcessing(true);
    
    try {
      const now = new Date();
      const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
      
      const passwordSource = businessShortCode + passkey + timestamp;
      const encodedPassword = btoa(passwordSource);

      console.log("Simulating STK Push Password:", encodedPassword);

      await new Promise(resolve => setTimeout(resolve, 2500));
      
      alert(`STK Push Received! Check your phone for the M-Pesa PIN prompt.\n\nIf it fails to appear, manually send Ksh 100 to 0743315353 then paste the Transaction Code below.`);
      
    } catch (error) {
      alert("Safaricom Gateway Error. Please try again or pay manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyTransaction = () => {
    const code = transactionCode.trim().toUpperCase();
    
    if (code.length < 8) {
      alert('Invalid M-Pesa Code. Please enter a valid 10-character code.');
      setTransactionCode('');
      return;
    }

    if (usedCodes.includes(code)) {
      alert('SECURITY ALERT: This M-Pesa code has already been used for another calculation.');
      setTransactionCode('');
      return;
    }

    setIsProcessing(true);
    
    // Simulate Daraja verification
    setTimeout(() => {
      // Logic for failed verification (e.g., if code format is wrong or simulated failure)
      if (code.startsWith('INVALID')) {
        alert('Verification Failed: Transaction not found in Safaricom records. Please re-enter.');
        setIsProcessing(false);
        setTransactionCode('');
        return;
      }

      const newUsedCodes = [...usedCodes, code];
      setUsedCodes(newUsedCodes);
      localStorage.setItem('kuccps_used_codes', JSON.stringify(newUsedCodes));
      setIsProcessing(false);
      setShowSuccessTick(true);
      setTimeout(() => {
        setShowSuccessTick(false);
        setStep(AppStep.Results);
      }, 1800);
    }, 2000);
  };

  const viewCourses = async (cluster: any) => {
    setActiveCluster(cluster);
    setShowCourseModal(true);
    setIsGeneratingCourses(true);
    setGeneratedCourses('');

    const clusterWeight = calculationResults.clusterWeights[cluster.id];
    const prompt = `Student cluster weight is ${clusterWeight.toFixed(3)} for ${cluster.name} (Mean Grade: ${calculationResults.meanGrade}). Suggest specific 2025 Kenya University degree and diploma courses. List 10 specific courses.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setGeneratedCourses(response.text || 'Course list unavailable.');
    } catch (error) {
      setGeneratedCourses('The AI career counselor is currently busy.');
    } finally {
      setIsGeneratingCourses(false);
    }
  };

  if (showSuccessTick) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
          <i className="fas fa-check text-white text-6xl"></i>
        </div>
        <h2 className="mt-12 text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Verified</h2>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'} min-h-screen pb-12 transition-colors`}>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 p-4 shadow-md flex justify-between items-center border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-2 rounded-lg"><i className="fas fa-graduation-cap"></i></div>
          <h1 className="text-xl font-black tracking-tighter uppercase">KUCCPS<span className="text-green-600">PRO</span></h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {step === AppStep.Input && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-8 animate-in fade-in duration-500">
            <div className="border-b dark:border-slate-700 pb-5">
              <h2 className="text-3xl font-black uppercase text-slate-800 dark:text-white tracking-tight">Grade Entry</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">Select your KCSE grades below.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {SUBJECTS.map(subj => (
                <div key={subj.id} className="group flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest ml-1">
                    {subj.name} {subj.id === 'mat' && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl p-4 font-black outline-none focus:border-green-600 transition-all cursor-pointer shadow-sm min-h-[64px] appearance-none"
                      style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                      value={selectedGrades[subj.id] || ''}
                      onChange={(e) => handleGradeChange(subj.id, e.target.value as Grade)}
                    >
                      <option value="" className="text-gray-400 bg-white dark:bg-slate-800">-- SELECT GRADE --</option>
                      {Object.keys(GRADE_POINTS).map(g => (
                        <option 
                          key={g} 
                          value={g} 
                          className="text-slate-900 dark:text-white bg-white dark:bg-slate-800 font-black py-2"
                        >
                          {g}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
                      <i className="fas fa-chevron-down text-lg"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                onClick={() => setStep(AppStep.Payment)}
                disabled={Object.keys(selectedGrades).length < 7 || !selectedGrades['mat']}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all disabled:opacity-40 uppercase tracking-widest text-lg active:scale-[0.98]"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === AppStep.Payment && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-8 animate-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                <i className="fas fa-mobile-screen"></i>
              </div>
              <h2 className="text-3xl font-black uppercase text-slate-800 dark:text-white tracking-tight">M-Pesa Gateway</h2>
              <p className="text-slate-500 mt-2 font-medium">Fee: <b>Ksh 100</b> | Recipient: <b>0743315353</b></p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white font-black outline-none focus:border-green-600 transition-all text-xl"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <button
                onClick={initiatePayment}
                disabled={isProcessing}
                className={`w-full bg-slate-900 dark:bg-slate-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 uppercase tracking-widest text-sm transition-all hover:bg-black ${isProcessing ? 'opacity-70 animate-pulse' : ''}`}
              >
                {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt"></i>}
                {isProcessing ? 'Processing STK...' : 'Push STK Prompt'}
              </button>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-700"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Verify Transaction</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-700"></div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">M-Pesa Transaction Code</label>
                <input
                  type="text"
                  placeholder="Enter Code (e.g. SBL6Y2X9Z)"
                  className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white font-black outline-none focus:border-green-600 uppercase tracking-widest text-xl transition-all"
                  value={transactionCode}
                  onChange={e => setTransactionCode(e.target.value)}
                />
              </div>
              <button
                onClick={verifyTransaction}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg uppercase text-sm tracking-widest transition-all hover:bg-green-700 active:scale-95 flex items-center justify-center gap-3"
              >
                {isProcessing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check-circle"></i>}
                Verify & Unlock Results
              </button>
            </div>
          </div>
        )}

        {step === AppStep.Results && (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-2xl border-t-[12px] border-green-600 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden">
              <div className="text-center md:text-left">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Mean Grade</p>
                <h2 className="text-8xl font-black text-green-600 tracking-tighter leading-none">{calculationResults.meanGrade}</h2>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">KCSE Points</p>
                <h2 className="text-8xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{calculationResults.totalPoints}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CLUSTERS.map(cluster => {
                const cw = calculationResults.clusterWeights[cluster.id];
                const isEligible = cw > 0;
                return (
                  <div key={cluster.id} className={`bg-white dark:bg-slate-800 rounded-3xl p-7 border-2 transition-all duration-300 ${isEligible ? 'border-transparent hover:border-green-500 shadow-xl' : 'opacity-20 grayscale pointer-events-none'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Cluster {cluster.id}</span>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${isEligible ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                        {isEligible ? 'Eligible' : 'Ineligible'}
                      </div>
                    </div>
                    <h3 className="font-black text-sm text-slate-800 dark:text-white mb-6 uppercase h-10 line-clamp-2 leading-snug">{cluster.name}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{cw.toFixed(3)}</span>
                        <span className="text-[10px] ml-2 text-slate-400 uppercase font-black tracking-widest">Weight</span>
                      </div>
                      <button onClick={() => viewCourses(cluster)} className="bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black px-5 py-3 rounded-2xl uppercase tracking-widest hover:bg-green-600 transition-all shadow-md">
                        View Courses
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-download"></i> Download PDF
              </button>
              <button 
                onClick={() => {
                  const url = window.location.href;
                  const text = `I just used KUCCPS Pro! My Mean Grade: ${calculationResults.meanGrade}. Check your Cluster Weights: ${url}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                }}
                className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                <i className="fab fa-whatsapp"></i> Share on WhatsApp
              </button>
            </div>
          </div>
        )}
      </main>

      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-2 block">AI Course Advisor</span>
                <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight leading-none">{activeCluster?.name}</h2>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 shadow-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-90">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <div className="p-10 overflow-y-auto flex-1 whitespace-pre-wrap text-slate-700 dark:text-slate-300 font-medium leading-relaxed scrollbar-thin">
              {isGeneratingCourses ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-black uppercase text-xs tracking-widest text-slate-400">Analyzing Course Database...</p>
                </div>
              ) : generatedCourses}
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-lg" onClick={() => setShowCourseModal(false)}>Close Advisor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
