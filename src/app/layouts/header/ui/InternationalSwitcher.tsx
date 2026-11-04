import React, { useState } from 'react';
import { Globe, Clock, ChevronDown } from 'lucide-react';
import { useCRM } from '../../../../shared/services';
import {
  CurrencyCode,
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
} from '../../../../shared/constants';

export const InternationalSwitcher: React.FC = () => {
  const { currentCurrency, setCurrentCurrency, currentTimezone, setCurrentTimezone } = useCRM();
  const [isOpen, setIsOpen] = useState(false);

  const activeCurrency = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.USD;
  const activeTz = SUPPORTED_TIMEZONES.find((t) => t.value === currentTimezone) || SUPPORTED_TIMEZONES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
        title="International currency & timezone settings"
      >
        <span className="text-sm">{activeCurrency.flag}</span>
        <span className="font-semibold text-slate-900">{activeCurrency.code}</span>
        <span className="text-slate-400">|</span>
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline text-slate-600">{activeTz.offset}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 space-y-3 animate-in fade-in zoom-in-95 duration-100">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" /> Global Currency
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Real-time conversion</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
                  const item = SUPPORTED_CURRENCIES[code];
                  const isSelected = item.code === currentCurrency;
                  return (
                    <button
                      key={code}
                      onClick={() => setCurrentCurrency(code)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors border ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                          : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{item.flag}</span>
                      <div className="leading-tight truncate">
                        <div>{item.code} ({item.symbol})</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">{item.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" /> Operational Timezone
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {SUPPORTED_TIMEZONES.map((tz) => {
                  const isSelected = tz.value === currentTimezone;
                  return (
                    <button
                      key={tz.value}
                      onClick={() => setCurrentTimezone(tz.value)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{tz.city}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{tz.offset}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
