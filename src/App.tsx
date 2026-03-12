import React, { useState, useEffect } from 'react';
import { MessageCircle, Globe, StickyNote, Image as ImageIcon, Lock, ChevronLeft, Search, Clock, Battery, Wifi, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chats, searchHistory, notes } from './data';

// PhoneContainer
function PhoneContainer({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-sans">
      <div className="w-[375px] h-[812px] bg-black rounded-[3rem] border-[12px] border-neutral-800 relative overflow-hidden shadow-2xl ring-1 ring-white/10">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-40 h-7 bg-neutral-800 rounded-b-3xl"></div>
        </div>
        {/* Status Bar */}
        <div className="absolute top-0 inset-x-0 h-12 flex justify-between items-center px-6 text-white text-xs font-medium z-40">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>
        
        {/* Screen Content */}
        <div className="w-full h-full relative text-white bg-black">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 h-1 flex justify-center z-50 pointer-events-none">
          <div className="w-1/3 h-full bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// LockScreen
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '0214') {
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  return (
    <div className="w-full h-full bg-cover bg-center flex flex-col items-center pt-32 relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop)' }}>
      <div className="backdrop-blur-md bg-black/30 absolute inset-0"></div>
      <div className="relative z-10 flex flex-col items-center w-full">
        <Lock size={24} className="mb-4 text-white" />
        <h1 className="text-2xl font-medium mb-8 text-white">비밀번호 입력</h1>
        
        <div className="flex gap-4 mb-16">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full border border-white transition-colors ${pin.length > i ? 'bg-white' : ''} ${error ? 'bg-red-500 border-red-500' : ''}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handlePress(num.toString())} className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl text-white active:bg-white/40 transition-colors">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handlePress('0')} className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl text-white active:bg-white/40 transition-colors">
            0
          </button>
          <div />
        </div>
      </div>
    </div>
  );
}

// HomeScreen
function HomeScreen({ onOpenApp }: { onOpenApp: (app: string) => void }) {
  const apps = [
    { id: 'messages', name: '메시지', icon: MessageCircle, color: 'bg-green-500' },
    { id: 'internet', name: '인터넷', icon: Globe, color: 'bg-blue-500' },
    { id: 'notes', name: '메모', icon: StickyNote, color: 'bg-yellow-500' },
    { id: 'gallery', name: '갤러리', icon: ImageIcon, color: 'bg-purple-500' },
  ];

  return (
    <div className="w-full h-full bg-cover bg-center pt-20 px-6 relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop)' }}>
      <div className="grid grid-cols-4 gap-4 relative z-10">
        {apps.map(app => (
          <div key={app.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => onOpenApp(app.id)}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${app.color}`}>
              <app.icon size={28} className="text-white" />
            </div>
            <span className="text-xs font-medium text-white drop-shadow-md">{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// MessagesApp
function MessagesApp({ onBack }: { onBack: () => void }) {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  if (activeChat) {
    const chatData = chats[activeChat as keyof typeof chats];
    return (
      <div className="w-full h-full bg-black flex flex-col text-white">
        <div className="h-24 bg-neutral-900 flex items-end pb-3 px-4 border-b border-neutral-800 relative">
          <button onClick={() => setActiveChat(null)} className="flex items-center text-blue-500 z-10">
            <ChevronLeft size={24} />
            <span>뒤로</span>
          </button>
          <div className="absolute inset-x-0 bottom-3 text-center font-semibold">{activeChat}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-8">
          {chatData.map((day, i) => (
            <div key={i} className="space-y-4">
              <div className="text-center text-xs text-neutral-500">{day.date}</div>
              {day.messages.map((msg, j) => (
                <div key={j} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex flex-col text-white">
      <div className="h-24 bg-neutral-900 flex items-end pb-3 px-4 border-b border-neutral-800">
        <button onClick={onBack} className="flex items-center text-blue-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold ml-2">메시지</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.keys(chats).map(name => {
          const chatData = chats[name as keyof typeof chats];
          const lastDay = chatData[chatData.length - 1];
          const lastMsg = lastDay.messages[lastDay.messages.length - 1];
          return (
            <div key={name} onClick={() => setActiveChat(name)} className="flex items-center px-4 py-3 border-b border-neutral-800 cursor-pointer active:bg-neutral-900">
              <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-xl font-bold mr-3 text-white">
                {name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold">{name}</div>
                <div className="text-sm text-neutral-500 truncate">
                  {lastMsg.text.replace(/\n/g, ' ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// InternetApp
function InternetApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full h-full bg-white text-black flex flex-col">
      <div className="h-24 bg-neutral-100 flex items-end pb-3 px-4 border-b border-neutral-200">
        <button onClick={onBack} className="flex items-center text-blue-500">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 mx-4 bg-neutral-200 rounded-lg h-8 flex items-center px-3 text-neutral-500 text-sm">
          <Search size={16} className="mr-2" />
          검색 또는 웹 주소 입력
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <h2 className="font-bold text-lg mb-4">최근 검색 기록</h2>
        <div className="space-y-4">
          {searchHistory.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center text-neutral-700">
                <Clock size={16} className="mr-3 text-neutral-400" />
                <span className="text-sm">{item.term}</span>
              </div>
              <span className="text-xs text-neutral-400">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// NotesApp
function NotesApp({ onBack }: { onBack: () => void }) {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  if (activeNote) {
    const note = notes.find(n => n.date === activeNote);
    return (
      <div className="w-full h-full bg-[#fdfbf7] text-black flex flex-col">
        <div className="h-24 bg-[#fdfbf7] flex items-end pb-3 px-4 border-b border-neutral-200">
          <button onClick={() => setActiveNote(null)} className="flex items-center text-yellow-600">
            <ChevronLeft size={24} />
            <span>메모</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pb-8">
          <h1 className="text-2xl font-bold mb-4">{note?.date}</h1>
          <p className="whitespace-pre-wrap text-neutral-800 leading-relaxed">{note?.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#fdfbf7] text-black flex flex-col">
      <div className="h-24 bg-[#fdfbf7] flex items-end pb-3 px-4 border-b border-neutral-200">
        <button onClick={onBack} className="flex items-center text-yellow-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold ml-2">메모</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {notes.map((note, i) => (
          <div key={i} onClick={() => setActiveNote(note.date)} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 mb-3 cursor-pointer active:bg-neutral-50">
            <h2 className="font-bold mb-1">{note.date}</h2>
            <p className="text-sm text-neutral-500 truncate">{note.text.split('\n')[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const initialImages: Record<string, string> = {
  secret_1: 'https://i.postimg.cc/cCktsx0v/gomdol-i1.png',
  secret_2: 'https://i.postimg.cc/j5ZLXxWh/gomdol-i-12se.png',
  secret_3: 'https://i.postimg.cc/pV5m8HWY/gomdol-i-7se.png',
  secret_4: 'https://i.postimg.cc/D01fN7m3/gomdol-i-dul-i.png',
  gallery_1: 'https://i.postimg.cc/sgsCVpHM/gong-won-mupyojeong3.png',
  gallery_2: 'https://i.postimg.cc/85hqQcdd/jib-mupyojeong1.png',
  gallery_3: 'https://i.postimg.cc/zvx28gyg/kape-bukkeuleoum2.png',
  gallery_4: 'https://i.postimg.cc/8CLys37K/chokollis-2.png',
  gallery_5: 'https://i.postimg.cc/44WWKp3R/gyeoul-bukkeuleoum2.png',
  gallery_6: 'https://i.postimg.cc/6Qxcs0HX/gyeoul-us-eum2.png',
  gallery_7: 'https://i.postimg.cc/v82v8MPh/from-Pix-AI-1988297593002126216-1.png',
  gallery_8: 'https://i.postimg.cc/tTChymWk/from-Pix-AI-1988297593002126216-2.png',
  gallery_9: 'https://i.postimg.cc/8kYhQ45C/gyobog1.png',
  gallery_10: 'https://i.postimg.cc/3w3GCbSK/gyobog2.png',
  gallery_11: 'https://i.postimg.cc/yx338qd9/gyobog3.png',
  gallery_12: 'https://i.postimg.cc/3Jp9tVBK/gyobog4.png',
};

// GalleryApp
function GalleryApp({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'main' | 'secret_locked' | 'secret_unlocked'>('main');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [images, setImages] = useState<Record<string, string>>(initialImages);
  const [fullScreenImageId, setFullScreenImageId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => ({ ...prev, [id]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePinPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '0104') {
          setTimeout(() => setView('secret_unlocked'), 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  if (fullScreenImageId) {
    return (
      <div className="w-full h-full bg-black text-white flex flex-col relative z-50">
        <div className="absolute top-12 left-4 z-50">
          <button onClick={() => setFullScreenImageId(null)} className="flex items-center text-white drop-shadow-md">
            <ChevronLeft size={32} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src={images[fullScreenImageId]} alt="Full screen" className="w-full h-auto max-h-full object-contain" />
        </div>
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-50">
          <label className="bg-neutral-800/80 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium cursor-pointer active:bg-neutral-700 transition-colors">
            이미지 변경
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, fullScreenImageId)} />
          </label>
        </div>
      </div>
    );
  }

  if (view === 'secret_locked') {
    return (
      <div className="w-full h-full bg-black text-white flex flex-col items-center pt-32 relative">
        <div className="absolute top-12 left-4 z-50">
          <button onClick={() => { setView('main'); setPin(''); }} className="flex items-center text-blue-500">
            <ChevronLeft size={24} />
            <span>뒤로</span>
          </button>
        </div>
        <Lock size={32} className="mb-4 text-neutral-400" />
        <h1 className="text-xl font-medium mb-8">비밀 폴더</h1>
        
        <div className="flex gap-4 mb-16">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full border border-white transition-colors ${pin.length > i ? 'bg-white' : ''} ${error ? 'bg-red-500 border-red-500' : ''}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handlePinPress(num.toString())} className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl active:bg-neutral-700 transition-colors">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handlePinPress('0')} className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl active:bg-neutral-700 transition-colors">
            0
          </button>
          <div />
        </div>
      </div>
    );
  }

  if (view === 'secret_unlocked') {
    return (
      <div className="w-full h-full bg-black text-white flex flex-col">
        <div className="h-24 bg-neutral-900 flex items-end pb-3 px-4 border-b border-neutral-800 relative">
          <button onClick={() => { setView('main'); setPin(''); }} className="flex items-center text-blue-500 z-10">
            <ChevronLeft size={24} />
            <span>앨범</span>
          </button>
          <div className="absolute inset-x-0 bottom-3 text-center font-semibold">비밀 폴더</div>
        </div>
        <div className="flex-1 overflow-y-auto p-1 pb-8">
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4].map(i => {
              const id = `secret_${i}`;
              return (
                <div key={i} onClick={() => setFullScreenImageId(id)} className="aspect-square bg-neutral-800 relative group overflow-hidden cursor-pointer active:opacity-80 transition-opacity">
                  <img src={images[id]} alt={`Secret ${i}`} className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      <div className="h-24 bg-neutral-900 flex items-end pb-3 px-4 border-b border-neutral-800">
        <button onClick={onBack} className="flex items-center text-blue-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold ml-2">앨범</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="mb-6 border-b border-neutral-800 pb-4">
          <div 
            onClick={() => setView('secret_locked')}
            className="flex items-center justify-between px-2 py-3 cursor-pointer active:bg-neutral-900 rounded-lg transition-colors"
          >
            <div className="flex items-center text-neutral-300">
              <Lock size={20} className="mr-3 text-neutral-500" />
              <span className="font-bold text-lg text-white">비밀</span>
            </div>
            <span className="text-neutral-500 text-sm">4</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold mb-3 px-1 text-lg">최근 항목</h2>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => {
              const id = `gallery_${i}`;
              return (
                <div key={i} onClick={() => setFullScreenImageId(id)} className="aspect-square bg-neutral-800 relative group overflow-hidden cursor-pointer active:opacity-80 transition-opacity">
                  <img src={images[id]} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lock'); // 'lock', 'home', 'messages', 'internet', 'notes', 'gallery'

  return (
    <PhoneContainer>
      <AnimatePresence mode="wait">
        {currentScreen === 'lock' && (
          <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full absolute inset-0">
            <LockScreen onUnlock={() => setCurrentScreen('home')} />
          </motion.div>
        )}
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full h-full absolute inset-0">
            <HomeScreen onOpenApp={(app) => setCurrentScreen(app)} />
          </motion.div>
        )}
        {currentScreen === 'messages' && (
          <motion.div key="messages" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="w-full h-full absolute inset-0">
            <MessagesApp onBack={() => setCurrentScreen('home')} />
          </motion.div>
        )}
        {currentScreen === 'internet' && (
          <motion.div key="internet" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="w-full h-full absolute inset-0">
            <InternetApp onBack={() => setCurrentScreen('home')} />
          </motion.div>
        )}
        {currentScreen === 'notes' && (
          <motion.div key="notes" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="w-full h-full absolute inset-0">
            <NotesApp onBack={() => setCurrentScreen('home')} />
          </motion.div>
        )}
        {currentScreen === 'gallery' && (
          <motion.div key="gallery" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="w-full h-full absolute inset-0">
            <GalleryApp onBack={() => setCurrentScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneContainer>
  );
}
