import React from 'react';

const LOGOS = [
  { name: 'YouTube', icon: 'youtube', color: '#FF0000' },
  { name: 'Vimeo', icon: 'vimeo', color: '#1AB7EA' },
  { name: 'Dailymotion', icon: 'video', color: '#0066DC' },
  { name: 'MP4', icon: 'file-video', color: '#10B981' },
  { name: 'Llama 3', icon: 'cpu', color: '#3B82F6' },
  { name: 'Mixtral', icon: 'sparkles', color: '#F59E0B' },
  { name: 'Groq', icon: 'zap', color: '#EC4899' },
  { name: 'OpenAI', icon: 'box', color: '#10A37F' },
];

export default function Marquee() {
  return (
    <div className="w-full mt-24 mb-16 overflow-hidden bg-slate-900 dark:bg-slate-950 py-8 border-y border-slate-800 relative shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-slate-900/0 to-transparent pointer-events-none" />
      
      <p className="text-center text-sm font-medium text-slate-400 mb-8 z-10 relative">
        Works seamlessly with the platforms and AI tools you already use
      </p>

      <div className="flex relative overflow-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-12 whitespace-nowrap min-w-full justify-around items-center px-6">
          {LOGOS.map((logo, i) => (
            <div key={`logo-1-${i}`} className="flex items-center gap-3 text-slate-300 font-semibold opacity-70 hover:opacity-100 transition-opacity">
              {getIcon(logo.icon, logo.color)}
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-12 whitespace-nowrap min-w-full justify-around items-center px-6 absolute top-0 left-full">
          {LOGOS.map((logo, i) => (
            <div key={`logo-2-${i}`} className="flex items-center gap-3 text-slate-300 font-semibold opacity-70 hover:opacity-100 transition-opacity">
              {getIcon(logo.icon, logo.color)}
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getIcon(name: string, color: string) {
  // Simple lucide-like SVG icons for the marquee
  switch (name) {
    case 'youtube':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon fill="#fff" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;
    case 'vimeo':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M22.396 7.164c-.093 2.026-1.507 4.8-4.245 8.32C15.323 19.16 12.93 21 10.97 21c-1.214 0-2.24-1.12-3.08-3.36-.56-2.052-1.119-4.1-1.68-6.15-.653-2.333-1.306-3.499-1.959-3.499-.187 0-.933.466-2.24 1.399L.61 7.89c1.586-1.306 3.173-2.612 4.665-3.825 2.146-1.773 3.639-2.706 4.479-2.799 1.773-.186 2.986 1.026 3.546 3.638.466 2.426.84 4.105 1.12 4.945.746 2.612 1.492 3.919 2.24 3.919.56 0 1.493-.933 2.799-2.8 1.12-1.492 1.68-2.612 1.68-3.359 0-1.212-.653-1.819-1.959-1.819-.56 0-1.12.093-1.68.28 1.213-3.825 3.639-5.69 7.278-5.69 2.706 0 4.106 1.586 4.106 4.758z"/></svg>;
    case 'video':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
    case 'file-video':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 10.5l5 3-5 3v-6z"></path></svg>;
    case 'cpu':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>;
    case 'sparkles':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path></svg>;
    case 'zap':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    case 'box':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
    default:
      return null;
  }
}
