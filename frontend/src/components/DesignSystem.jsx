import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DesignSystem() {
  const navigate = useNavigate();

  // State for interactive components
  const [accordionOpen, setAccordionOpen] = useState({ 1: false, 2: true });
  const [checkboxState, setCheckboxState] = useState({ checked: true, unchecked: false, mixed: true });
  const [radioState, setRadioState] = useState('checked');
  const [sliderVal, setSliderVal] = useState(65);
  const [activeSegmentedTab, setActiveSegmentedTab] = useState('Label 1');
  const [activeLayout, setActiveLayout] = useState('grid');
  const [activeLayoutSubtle, setActiveLayoutSubtle] = useState('list');
  const [activeTag, setActiveTag] = useState('ALL');
  const [removedTags, setRemovedTags] = useState([]);

  // SVGs for Logos, Flags, and Icons
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  );

  const FilterIcon = () => (
    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  );

  const CheckIcon = ({ className = "w-4 h-4 text-white" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
    </svg>
  );

  const PromoLogoIcon = () => (
    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
      <svg className="w-6 h-6 text-[#E87A5D]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.25l5 4.5v6.5H7v-6.5l5-4.5z"></path>
      </svg>
    </div>
  );

  // SVG Flags
  const FlagIcon = ({ country }) => {
    const flags = {
      au: <rect width="30" height="20" rx="2" fill="#00008B" />, // Australia
      us: <rect width="30" height="20" rx="2" fill="#B22234" />, // US
      gb: <rect width="30" height="20" rx="2" fill="#00247D" />, // UK
      ca: <rect width="30" height="20" rx="2" fill="#FF0000" />, // Canada
      jp: <rect width="30" height="20" rx="2" fill="#FFFFFF" />, // Japan
      it: <rect width="30" height="20" rx="2" fill="#009246" />, // Italy
      br: <rect width="30" height="20" rx="2" fill="#009739" />, // Brazil
      ie: <rect width="30" height="20" rx="2" fill="#169B62" />, // Ireland
      fr: <rect width="30" height="20" rx="2" fill="#0055A5" />, // France
      de: <rect width="30" height="20" rx="2" fill="#000000" />, // Germany
      eu: <rect width="30" height="20" rx="2" fill="#003399" />  // EU
    };

    const overlays = {
      au: <polygon points="0,0 30,20" stroke="#FFF" strokeWidth="2" />,
      us: <rect width="12" height="10" fill="#3C3B6E" />,
      gb: <polygon points="0,0 30,20" stroke="#FFF" strokeWidth="2" />,
      ca: <rect x="10" y="0" width="10" height="20" fill="#FFF" />,
      jp: <circle cx="15" cy="10" r="5" fill="#BC002D" />,
      it: <g><rect x="10" y="0" width="10" height="20" fill="#FFF" /><rect x="20" y="0" width="10" height="20" fill="#CE2B37" /></g>,
      br: <polygon points="15,2 28,10 15,18 2,10" fill="#FFD700" />,
      ie: <g><rect x="10" y="0" width="10" height="20" fill="#FFF" /><rect x="20" y="0" width="10" height="20" fill="#FF883E" /></g>,
      fr: <g><rect x="10" y="0" width="10" height="20" fill="#FFF" /><rect x="20" y="0" width="10" height="20" fill="#EF4135" /></g>,
      de: <g><rect y="6.6" width="30" height="6.6" fill="#FF0000" /><rect y="13.2" width="30" height="6.8" fill="#FFCC00" /></g>,
      eu: <circle cx="15" cy="10" r="4" fill="none" stroke="#FFCC00" strokeWidth="1" strokeDasharray="2,1" />
    };

    return (
      <svg width="30" height="20" className="inline-block border border-gray-200 rounded-sm shadow-xs transition-transform hover:scale-115 cursor-help" title={country.toUpperCase()}>
        {flags[country]}
        {overlays[country]}
      </svg>
    );
  };

  // Profile Designer Vector SVG
  const DesignerAvatar = () => (
    <svg className="w-full h-full text-gray-700 bg-[#EFEBE4]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background shape */}
      <circle cx="50" cy="50" r="50" fill="#EFEBE4" />
      {/* Hair back */}
      <path d="M25 45C25 25 75 25 75 45V60H25V45Z" fill="#374151" />
      {/* Face */}
      <circle cx="50" cy="48" r="22" fill="#FBCFE8" />
      {/* Hair front/bangs */}
      <path d="M28 40C32 30 50 25 50 32C50 25 68 30 72 40C70 30 60 28 50 32C40 28 30 30 28 40Z" fill="#1F2937" />
      {/* Glasses */}
      <rect x="37" y="44" width="11" height="8" rx="2" stroke="#111827" strokeWidth="2" fill="none" />
      <rect x="52" y="44" width="11" height="8" rx="2" stroke="#111827" strokeWidth="2" fill="none" />
      <line x1="48" y1="48" x2="52" y2="48" stroke="#111827" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="425" cy="48" r="1.5" fill="#111827" />
      <circle cx="575" cy="48" r="1.5" fill="#111827" />
      {/* Smile */}
      <path d="M46 56C48 58 52 58 54 56" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
      {/* Shirt */}
      <path d="M30 80C30 68 40 65 50 65C60 65 70 68 70 80V100H30V80Z" fill="#111827" />
      {/* Necklace */}
      <circle cx="50" cy="69" r="3" fill="#E87A5D" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F6F5F2] py-12 px-6 sm:px-12 transition-all">
      {/* Back button */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="bg-white border border-[#E5E0D8] text-gray-900 px-6 py-2.5 rounded-full font-medium shadow-xs hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          ← Back to App
        </button>
        <div className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          ALPHV Design System Spec
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Serif Header */}
        <h1 className="text-5xl md:text-6xl font-serif text-gray-900 text-center mb-16 font-normal tracking-tight">
          Design System
        </h1>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Card 1: Buttons */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Buttons</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <button className="bg-gray-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-black transition-all cursor-pointer">
                  Button
                </button>
                <button className="bg-white border border-[#E5E0D8] text-gray-900 rounded-full px-6 py-2.5 text-sm font-medium hover:bg-slate-50 transition-all cursor-pointer">
                  Button
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-[#EFEBE4] rounded-full text-gray-900 hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  <ChevronDownIcon />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-[#EFEBE4] rounded-full text-gray-900 hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  <FilterIcon />
                </button>
              </div>
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <button className="bg-[#EFEBE4] text-gray-900 rounded-full px-6 py-2.5 text-sm font-medium hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  Button
                </button>
                <button className="bg-[#EFEBE4] text-gray-900 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  Button
                </button>
                <button className="bg-gray-900 text-white rounded-full px-4 py-1.5 text-xs font-medium hover:bg-black transition-all cursor-pointer">
                  Button
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-[#EFEBE4] rounded-full text-gray-900 hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  <span className="font-bold">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Tags & Badges */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Tags & Badges</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={() => setActiveTag('ALL')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full tracking-wider transition-all cursor-pointer ${activeTag === 'ALL' ? 'bg-[#E87A5D] text-white' : 'bg-[#EFEBE4] text-gray-700'}`}
                >
                  ALL
                </button>
                <button 
                  onClick={() => setActiveTag('MOODBOARD')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full tracking-wider transition-all cursor-pointer ${activeTag === 'MOODBOARD' ? 'bg-[#E87A5D] text-white' : 'bg-[#EFEBE4] text-gray-700'}`}
                >
                  MOODBOARD
                </button>
                <button className="bg-[#EFEBE4] text-gray-700 px-4 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  Ratings <ChevronDownIcon />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#E5E0D8]">
                <span className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-red-500 mr-2" onClick={() => setRemovedTags([])}>Clear All ✕</span>
                {!removedTags.includes('ART DECO') && (
                  <span className="bg-white border border-[#E5E0D8] text-gray-800 text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1 flex items-center gap-1">
                    ART DECO <button className="hover:text-red-500 cursor-pointer font-bold ml-0.5" onClick={() => setRemovedTags([...removedTags, 'ART DECO'])}>✕</button>
                  </span>
                )}
                {!removedTags.includes('SILVER') && (
                  <span className="bg-white border border-[#E5E0D8] text-gray-800 text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1 flex items-center gap-1">
                    SILVER <button className="hover:text-red-500 cursor-pointer font-bold ml-0.5" onClick={() => setRemovedTags([...removedTags, 'SILVER'])}>✕</button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Breadcrumbs & Bullets */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Breadcrumbs</h2>
              <div className="text-xs font-semibold text-gray-600 space-x-1">
                <span className="hover:text-gray-900 cursor-pointer">Home Page</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400 cursor-default">Case Study Details</span>
              </div>
            </div>
            <div className="mt-8 border-t border-[#E5E0D8] pt-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 font-sans">Bullets</h2>
              <div className="inline-flex items-center bg-[#EFEBE4] px-4 py-2.5 rounded-full text-xs font-semibold text-gray-800 shadow-xs">
                <span className="w-4 h-4 bg-gray-900 text-white rounded-full flex items-center justify-center mr-2 text-[9px] font-bold">✓</span>
                Highly professional
              </div>
            </div>
          </div>

          {/* Card 4: Accordion */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px] col-span-1 md:col-span-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Accordion</h2>
            <div className="space-y-4">
              
              {/* Accordion Item 1 */}
              <div className="bg-[#EFEBE4] rounded-2xl p-5 transition-all">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setAccordionOpen({ ...accordionOpen, 1: !accordionOpen[1] })}
                >
                  <h3 className="font-semibold text-gray-900 text-sm">What is Milray Park?</h3>
                  <button className="w-7 h-7 bg-white text-gray-800 rounded-full flex items-center justify-center font-bold text-sm shadow-xs cursor-pointer">
                    {accordionOpen[1] ? '−' : '+'}
                  </button>
                </div>
                {accordionOpen[1] && (
                  <div className="mt-3 text-xs leading-relaxed text-gray-600 border-t border-[#E5E0D8] pt-3">
                    Milray Park is an online platform that makes interior design affordable and easy.
                  </div>
                )}
              </div>

              {/* Accordion Item 2 */}
              <div className="bg-[#EFEBE4] rounded-2xl p-5 transition-all">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setAccordionOpen({ ...accordionOpen, 2: !accordionOpen[2] })}
                >
                  <h3 className="font-semibold text-gray-900 text-sm">What makes Milray Park unique?</h3>
                  <button className="w-7 h-7 bg-white text-gray-800 rounded-full flex items-center justify-center font-bold text-sm shadow-xs cursor-pointer">
                    {accordionOpen[2] ? '−' : '+'}
                  </button>
                </div>
                {accordionOpen[2] && (
                  <div className="mt-3 text-xs leading-relaxed text-gray-600 border-t border-[#E5E0D8] pt-3">
                    On <span className="text-[#E87A5D] font-bold">Milray Park</span>, you collaborate with your interior designer 100% online on our easy <span className="text-[#E87A5D] font-bold">to use eDecorating platform.</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Card 5: Spinners */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Spinners</h2>
            <div className="flex flex-col items-center justify-center gap-8 flex-1">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              <div className="w-10 h-10 border-4 border-[#EFEBE4] border-t-[#E87A5D] border-b-[#E87A5D] rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Card 6: Checkboxes */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 font-sans">Checkboxes</h2>
            <div className="space-y-3 flex-1 flex flex-col justify-center text-xs font-semibold text-gray-700">
              
              {/* Mini row */}
              <div className="flex items-center gap-3 mb-2">
                <button 
                  onClick={() => setCheckboxState({ ...checkboxState, checked: !checkboxState.checked })}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${checkboxState.checked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}
                >
                  {checkboxState.checked && <CheckIcon />}
                </button>
                <div className="w-5 h-5 rounded-md bg-gray-900 border border-gray-900 flex items-center justify-center cursor-default">
                  <span className="w-2.5 h-0.5 bg-white rounded-xs"></span>
                </div>
                <div className="w-5 h-5 rounded-md bg-white border border-gray-300"></div>
              </div>

              {/* Standard Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={checkboxState.checked} 
                  onChange={(e) => setCheckboxState({ ...checkboxState, checked: e.target.checked })}
                  className="sr-only" 
                />
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${checkboxState.checked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
                  {checkboxState.checked && <CheckIcon />}
                </div>
                Checked
              </label>

              {/* Standard Unchecked */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={checkboxState.unchecked} 
                  onChange={(e) => setCheckboxState({ ...checkboxState, unchecked: e.target.checked })}
                  className="sr-only" 
                />
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${checkboxState.unchecked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
                  {checkboxState.unchecked && <CheckIcon />}
                </div>
                Unchecked
              </label>

              {/* Disabled Checked */}
              <div className="flex items-center gap-3 text-gray-400 cursor-not-allowed select-none">
                <div className="w-5 h-5 rounded-md bg-gray-300 border border-gray-300 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-gray-100" />
                </div>
                Disabled Checked
              </div>

              {/* Disabled Unchecked */}
              <div className="flex items-center gap-3 text-gray-400 cursor-not-allowed select-none">
                <div className="w-5 h-5 rounded-md bg-gray-100 border border-gray-200"></div>
                Disabled Unchecked
              </div>

            </div>
          </div>

          {/* Card 7: Radios */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 font-sans">Radios</h2>
            <div className="space-y-3 flex-1 flex flex-col justify-center text-xs font-semibold text-gray-700">
              
              {/* Mini row */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 rounded-full border border-gray-900 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300"></div>
              </div>

              {/* Checked radio */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="radio" 
                  name="radioGroup"
                  checked={radioState === 'checked'} 
                  onChange={() => setRadioState('checked')}
                  className="sr-only" 
                />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${radioState === 'checked' ? 'border-gray-900' : 'border-gray-300'}`}>
                  {radioState === 'checked' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>}
                </div>
                Checked
              </label>

              {/* Unchecked radio */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="radio" 
                  name="radioGroup"
                  checked={radioState === 'unchecked'} 
                  onChange={() => setRadioState('unchecked')}
                  className="sr-only" 
                />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${radioState === 'unchecked' ? 'border-gray-900' : 'border-gray-300'}`}>
                  {radioState === 'unchecked' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>}
                </div>
                Unchecked
              </label>

              {/* Disabled Checked */}
              <div className="flex items-center gap-3 text-gray-400 cursor-not-allowed select-none">
                <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
                  <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                </div>
                Disabled Checked
              </div>

              {/* Disabled Unchecked */}
              <div className="flex items-center gap-3 text-gray-400 cursor-not-allowed select-none">
                <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-50"></div>
                Disabled Unchecked
              </div>

            </div>
          </div>

          {/* Card 8: Text Inputs */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px] col-span-1 md:col-span-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Text Inputs</h2>
            <div className="space-y-4">
              
              {/* Input 1: Search for Desktops + Budget Dropdown */}
              <div className="relative flex items-center bg-white border border-[#E5E0D8] rounded-full px-4 py-1.5 focus-within:border-gray-900 transition-colors shadow-xs">
                <SearchIcon />
                <input 
                  type="text" 
                  placeholder="Search for Desktops" 
                  className="w-full bg-transparent border-0 outline-none text-xs font-medium text-gray-800 placeholder-gray-400 py-1.5"
                />
                <button className="bg-[#EFEBE4] text-[10px] font-bold tracking-wider text-gray-700 rounded-full px-3 py-1.5 flex items-center gap-1 hover:bg-[#E5DFD5] transition-colors cursor-pointer select-none ml-2 whitespace-nowrap">
                  Budget <ChevronDownIcon />
                </button>
              </div>

              {/* Input 2: Search for Mobiles + Filter */}
              <div className="relative flex items-center bg-white border border-[#E5E0D8] rounded-full px-4 py-1.5 focus-within:border-gray-900 transition-colors shadow-xs">
                <SearchIcon />
                <input 
                  type="text" 
                  placeholder="Search for Mobiles" 
                  className="w-full bg-transparent border-0 outline-none text-xs font-medium text-gray-800 placeholder-gray-400 py-1.5"
                />
                <button className="bg-[#EFEBE4] text-[10px] font-bold text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#E5DFD5] transition-all cursor-pointer ml-2">
                  <FilterIcon />
                </button>
              </div>

              {/* Row: Dropdown & Name input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative flex items-center bg-[#EFEBE4] rounded-full px-4 py-3 cursor-pointer hover:bg-[#E5DFD5] transition-all">
                  <span className="text-xs font-medium text-gray-700 flex-1">What is your inquiry about?</span>
                  <ChevronDownIcon />
                </div>
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full bg-[#EFEBE4] border-0 rounded-full px-4 py-3 outline-none text-xs font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:border focus:border-[#E5E0D8] transition-all"
                />
              </div>

            </div>
          </div>

          {/* Card 9: Info Blocks */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Info blocks</h2>
            <div className="bg-[#EFEBE4] rounded-2xl p-5 flex flex-col gap-3 flex-1 justify-center">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">✓</div>
                <p className="text-xs leading-relaxed text-gray-700">
                  <span className="font-bold">Like a particular brand?</span> Just let your designer know. Otherwise, you can leave it up to your designer who will be sourcing the best pieces at the best prices for your overall look.
                </p>
              </div>
            </div>
          </div>

          {/* Card 10: Sliders */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Sliders</h2>
            <div className="flex flex-col justify-center flex-1 space-y-6">
              <div className="relative w-full pt-6">
                
                {/* Tooltip */}
                <div 
                  className="absolute bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md mb-2 shadow-sm transition-all"
                  style={{ 
                    left: `calc(${sliderVal}% - 16px)`, 
                    top: '-12px' 
                  }}
                >
                  {sliderVal}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-4 border-t-gray-900 border-x-4 border-x-transparent"></div>
                </div>

                {/* Range Input */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderVal} 
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  style={{
                    background: `linear-gradient(to right, #111827 ${sliderVal}%, #e5e7eb ${sliderVal}%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 11: Payments */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Payments</h2>
            <div className="flex flex-wrap items-center justify-center gap-3 flex-1">
              <div className="bg-white px-3 py-1.5 border border-[#E5E0D8] rounded-md shadow-xs text-[9px] font-bold text-blue-900 tracking-wider">VISA</div>
              <div className="bg-white px-3 py-1.5 border border-[#E5E0D8] rounded-md shadow-xs text-[9px] font-bold text-red-500 tracking-wider">mastercard</div>
              <div className="bg-white px-3 py-1.5 border border-[#E5E0D8] rounded-md shadow-xs text-[9px] font-extrabold text-indigo-500 tracking-wider">stripe</div>
              <div className="bg-white px-3 py-1.5 border border-[#E5E0D8] rounded-md shadow-xs text-[9px] font-bold text-blue-600 italic tracking-wider">PayPal</div>
              <div className="bg-white px-3 py-1.5 border border-[#E5E0D8] rounded-md shadow-xs text-[9px] font-bold text-gray-900 flex items-center gap-0.5"> Pay</div>
              <div className="bg-white px-3 py-1.5 border border-[#E5E0D8] rounded-md shadow-xs text-[9px] font-extrabold text-[#E87A5D]">Shopify</div>
            </div>
          </div>

          {/* Card 12: Flags */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Flags</h2>
            <div className="flex flex-wrap gap-2.5 items-center justify-center flex-1">
              <FlagIcon country="au" />
              <FlagIcon country="us" />
              <FlagIcon country="gb" />
              <FlagIcon country="ca" />
              <FlagIcon country="jp" />
              <FlagIcon country="it" />
              <FlagIcon country="br" />
              <FlagIcon country="ie" />
              <FlagIcon country="fr" />
              <FlagIcon country="de" />
              <FlagIcon country="eu" />
            </div>
          </div>

          {/* Card 13: Cells */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px] col-span-1 md:col-span-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Cells</h2>
            <div className="space-y-4">
              
              {/* Promo Cell */}
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3.5">
                  <PromoLogoIcon />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">T&C's Bday Promotion</h4>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">November 2018</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#EFEBE4] flex items-center justify-center hover:bg-[#E5DFD5] transition-all cursor-pointer">
                  <ArrowRightIcon />
                </button>
              </div>

              {/* User Profile Cell */}
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E5E0D8]">
                    <DesignerAvatar />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">Jane Cooper</h4>
                      <span className="bg-[#E87A5D] text-[8px] font-bold text-white uppercase tracking-widest px-1.5 py-0.5 rounded-full">GOLD</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-gray-400">Sydney</span>
                      <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Available now
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 bg-[#EFEBE4] px-4 py-2 rounded-full shadow-2xs">
                  $599
                </div>
              </div>

            </div>
          </div>

          {/* Card 14: Segmented Controls */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px] col-span-1 md:col-span-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Segmented Controls</h2>
            <div className="space-y-6">
              
              {/* Row with icons controls */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Control 1: Rounded black active */}
                <div className="inline-flex bg-[#EFEBE4] rounded-full p-1 border border-[#E5E0D8] shadow-xs">
                  <button 
                    onClick={() => setActiveLayout('grid')}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer ${activeLayout === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
                  </button>
                  <button 
                    onClick={() => setActiveLayout('list')}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer ${activeLayout === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
                  </button>
                </div>

                {/* Control 2: Subtle border active */}
                <div className="inline-flex bg-white rounded-full p-1 border border-[#E5E0D8] shadow-2xs">
                  <button 
                    onClick={() => setActiveLayoutSubtle('grid')}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer ${activeLayoutSubtle === 'grid' ? 'bg-[#EFEBE4] text-gray-900' : 'text-gray-400'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
                  </button>
                  <button 
                    onClick={() => setActiveLayoutSubtle('list')}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer ${activeLayoutSubtle === 'list' ? 'bg-[#EFEBE4] text-gray-900' : 'text-gray-400'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
                  </button>
                </div>
              </div>

              {/* Text segmented control */}
              <div className="inline-flex bg-white border border-[#E5E0D8] rounded-full p-1 w-full shadow-2xs">
                {['Label 1', 'Label 2', 'Label 3'].map((lbl) => (
                  <button
                    key={lbl}
                    onClick={() => setActiveSegmentedTab(lbl)}
                    className={`flex-1 text-center py-2.5 text-xs font-semibold rounded-full tracking-wider transition-all cursor-pointer ${activeSegmentedTab === lbl ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {lbl.replace(' 1', '').replace(' 2', '').replace(' 3', '')}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Card 15: Profile Image & Golden Badge */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] flex flex-col justify-between min-h-[300px]">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 font-sans">Profile image</h2>
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border border-[#E5E0D8]">
                <DesignerAvatar />
              </div>
              <div className="mt-4">
                <span className="bg-[#E87A5D] text-[10px] font-bold text-white uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                  GOLD
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info button */}
        <div className="mt-16 text-center">
          <button className="bg-[#EFEBE4] text-gray-700 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider hover:bg-[#E5DFD5] transition-all cursor-default select-none shadow-2xs">
            And more..
          </button>
        </div>

      </div>
    </div>
  );
}
