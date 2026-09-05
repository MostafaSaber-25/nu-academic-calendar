import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, X, ChevronRight, GraduationCap, Coffee, FileText, AlertCircle, Sun, Moon, Upload, Settings, Check, AlertTriangle } from 'lucide-react';

interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  type: 'academic' | 'holiday' | 'exam' | 'deadline' | 'registration';
}

const initialCalendarData: CalendarEvent[] = [
  { id: 1, date: "Sep 08", title: "Advising and Registration for Continuing Students (PG)", type: "registration" },
  { id: 2, date: "Sep 13-16", title: "Advising and Registration for Continuing Students (UG)", type: "registration" },
  { id: 3, date: "Sep 14", title: "Deadline to Apply for Exchange Program (Spring 27)", type: "deadline" },
  { id: 4, date: "Sep 15-16", title: "Orientation for New Undergraduate Students", type: "academic" },
  { id: 5, date: "Sep 15", title: "Orientation for New Postgraduate Students", type: "academic" },
  { id: 6, date: "Sep 15-17", title: "Advising and Registration for New Students", type: "registration" },
  { id: 7, date: "Sep 19", title: "Fall Classes Start (UG and PG)", type: "academic" },
  { id: 8, date: "Sep 21", title: "Deadline for Semester Withdraw", type: "deadline" },
  { id: 9, date: "Sep 27", title: "Deadline to Add/Drop courses", type: "deadline" },
  { id: 10, date: "Oct 06", title: "Armed Forces Day Holiday", type: "holiday" },
  { id: 11, date: "Oct 11", title: "Deadline for Tuition Payment (1st Installment)", type: "deadline" },
  { id: 12, date: "Oct 19", title: "Deadline for submission of Incomplete grades", type: "deadline" },
  { id: 13, date: "Nov 07-19", title: "Mid-term Exams", type: "exam" },
  { id: 14, date: "Nov 25-26", title: "Honors Assembly", type: "academic" },
  { id: 15, date: "Dec 01", title: "Deadline for Tuition Payment (2nd Installment)", type: "deadline" },
  { id: 16, date: "Dec 24", title: "Deadline to Apply for Exchange Program (Fall 27)", type: "deadline" },
  { id: 17, date: "Dec 27", title: "Deadline for Course Withdrawal", type: "deadline" },
  { id: 18, date: "Dec 31", title: "Last Day of Classes (UG and PG)", type: "academic" },
  { id: 19, date: "Jan 02-21", title: "Semester Examinations (UG and PG)", type: "exam" },
  { id: 20, date: "Jan 07", title: "Eastern Christmas Holiday", type: "holiday" },
  { id: 21, date: "Jan 21", title: "Deadline for Incomplete Request", type: "deadline" },
  { id: 22, date: "Jan 23-Feb 05", title: "Mid-Year Recess", type: "holiday" },
  { id: 23, date: "Jan 25", title: "Police Day Holiday", type: "holiday" }
];

const typeIcons = {
  academic: GraduationCap,
  holiday: Coffee,
  exam: AlertCircle,
  deadline: FileText,
  registration: Calendar
};

const typeColors = {
  academic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', darkBg: 'bg-blue-900/20', darkText: 'text-blue-300', darkBorder: 'border-blue-800' },
  holiday: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', darkBg: 'bg-red-900/20', darkText: 'text-red-300', darkBorder: 'border-red-800' },
  exam: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', darkBg: 'bg-amber-900/20', darkText: 'text-amber-300', darkBorder: 'border-amber-800' },
  deadline: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', darkBg: 'bg-purple-900/20', darkText: 'text-purple-300', darkBorder: 'border-purple-800' },
  registration: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'bg-emerald-900/20', darkText: 'text-emerald-300', darkBorder: 'border-emerald-800' }
};

const categoryLabels = {
  academic: 'Academic',
  holiday: 'Holiday',
  exam: 'Exam',
  deadline: 'Deadline',
  registration: 'Registration'
};

function getNextEvent(data: CalendarEvent[]): CalendarEvent | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventsWithDates = data.map(event => {
    const [startMonth, startDay] = event.date.split(' - ')[0].split(' ');
    const monthMap: { [key: string]: number } = {
      'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11, 'Jan': 0, 'Feb': 1
    };
    const eventDate = new Date(2026, monthMap[startMonth] || 0, parseInt(startDay));
    return { ...event, dateObj: eventDate };
  });
  
  const futureEvents = eventsWithDates
    .filter(e => e.dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  
  return futureEvents.length > 0 ? futureEvents[0] : null;
}

function getDaysUntil(eventDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = eventDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ProfileBadge({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`flex flex-col items-center justify-center w-72 rounded-2xl p-6 shadow-xl backdrop-blur-sm text-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/90 border border-slate-700' 
          : 'bg-white border border-slate-200 shadow-sm'
      }`}>
        
        {/* Avatar Circle with Glow */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 blur-md opacity-50" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-lg font-bold text-white shadow-inner">
            MS
          </div>
        </div>

        {/* Name & Title */}
        <h3 className={`text-base font-semibold tracking-wide ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Mostafa Saber
        </h3>
        <p className={`mt-0.5 text-xs font-medium ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          CS Student
        </p>

        {/* Action Links */}
        <div className="mt-5 flex items-center gap-2.5 w-full justify-center">
          <a
            href="https://linkedin.com/in/mostafa-mohamed-saber"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/MostafaSaber-25"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white focus:ring-slate-500'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-400'
            }`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>

      </div>
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>(initialCalendarData);
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
  const [daysUntil, setDaysUntil] = useState<number>(0);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update next event when data changes
  useEffect(() => {
    const next = getNextEvent(calendarData);
    setNextEvent(next);
    if (next) {
      const [startMonth, startDay] = next.date.split(' - ')[0].split(' ');
      const monthMap: { [key: string]: number } = {
        'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11, 'Jan': 0, 'Feb': 1
      };
      const eventDate = new Date(2026, monthMap[startMonth] || 0, parseInt(startDay));
      setDaysUntil(getDaysUntil(eventDate));
    }
  }, [calendarData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      
      // Admin panel shortcut (Cmd+Shift+A / Ctrl+Shift+A)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminPanelOpen(prev => !prev);
        showToast('Admin panel ' + (!adminPanelOpen ? 'opened' : 'closed'));
      }
      
      // Escape key
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAdminPanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminPanelOpen]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  const handleJsonUpload = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const validData = parsedData.map((item, index) => ({
          id: item.id || index + 1,
          date: item.date,
          title: item.title,
          type: item.type
        }));
        setCalendarData(validData);
        setUploadStatus('success');
        showToast('Calendar data updated successfully');
        setJsonInput('');
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        setUploadStatus('error');
        showToast('Invalid JSON format');
      }
    } catch (error) {
      setUploadStatus('error');
      showToast('Invalid JSON syntax');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonInput(content);
      };
      reader.readAsText(file);
    }
  };

  const filteredData = useMemo(() => {
    let filtered = calendarData;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === activeFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.date.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeFilter, searchQuery, calendarData]);

  const filters = ['all', 'academic', 'holiday', 'exam', 'deadline', 'registration'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-800'}`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
            }`}
          >
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`border-b sticky top-0 backdrop-blur-sm z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-900'
              }`}>
                <GraduationCap className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-white'}`} />
              </div>
              <div>
                <h1 className={`text-xl font-semibold font-serif ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  Nile University
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Academic Calendar 2026-2027
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-sm border transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                  isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400'
                }`}>
                  <span>⌘</span>
                  <span>K</span>
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h2 className={`text-4xl font-semibold font-serif mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            Fall Semester
          </h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
            Academic year 2026-2027
          </p>
        </div>

        {/* Countdown Widget */}
        {nextEvent && (
          <div className={`mb-10 p-4 rounded-sm border transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Next event
                </p>
                <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {nextEvent.title}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  {daysUntil}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-900 text-white'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {filter === 'all' ? 'All Events' : categoryLabels[filter as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className={`absolute left-3 top-0 bottom-0 w-px transition-colors ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
          }`} />
          
          {/* Events */}
          <div className="space-y-6 pl-10">
            <AnimatePresence mode="popLayout">
              {filteredData.map((event, index) => {
                const Icon = typeIcons[event.type];
                const colors = typeColors[event.type];
                const isDark = isDarkMode;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Dot */}
                    <div className={`absolute -left-7 top-6 w-3 h-3 rounded-full border-2 transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-600 group-hover:border-blue-400' 
                        : 'bg-white border-slate-300 group-hover:border-blue-900'
                    }`} />
                    
                    {/* Event Card */}
                    <div className={`p-5 rounded-sm border transition-all duration-200 ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 shadow-md hover:border-slate-600' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 flex-shrink-0">
                          <p className={`text-lg font-semibold font-sans ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                            {event.date}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-sm text-xs font-medium border ${
                              isDark 
                                ? `${colors.darkBg} ${colors.darkText} ${colors.darkBorder}`
                                : `${colors.bg} ${colors.text} ${colors.border}`
                            }`}>
                              {categoryLabels[event.type]}
                            </span>
                          </div>
                          <h3 className={`text-base font-medium font-sans ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                            {event.title}
                          </h3>
                        </div>
                        <div className="w-8 flex-shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredData.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
              >
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No events found matching your criteria</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Profile Badge */}
        <div className="mt-12 flex justify-center">
          <ProfileBadge isDarkMode={isDarkMode} />
        </div>
      </main>

      {/* Spotlight Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="w-full max-w-2xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className={`rounded-sm overflow-hidden shadow-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className={`flex items-center gap-3 px-4 py-3 border-b ${
                  isDarkMode ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <Search className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      isDarkMode ? 'text-slate-200 placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                    }`}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                      }`}
                    >
                      <X className={`w-3 h-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                    </button>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {searchQuery.trim() ? (
                    filteredData.length > 0 ? (
                      filteredData.map((event, index) => {
                        const Icon = typeIcons[event.type];
                        const colors = typeColors[event.type];
                        return (
                          <motion.button
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => {
                              setSearchQuery('');
                              setSearchOpen(false);
                              setActiveFilter(event.type);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b last:border-0 transition-colors ${
                              isDarkMode 
                                ? 'hover:bg-slate-700/50 border-slate-700' 
                                : 'hover:bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                              isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                            }`}>
                              <Icon className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                {event.title}
                              </p>
                              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                {event.date}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-sm text-xs font-medium border ${
                              isDark 
                                ? `${colors.darkBg} ${colors.darkText} ${colors.darkBorder}`
                                : `${colors.bg} ${colors.text} ${colors.border}`
                            }`}>
                              {categoryLabels[event.type]}
                            </span>
                          </motion.button>
                        );
                      })
                    ) : (
                      <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No results found</p>
                      </div>
                    )
                  ) : (
                    <div className="px-4 py-3">
                      <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Quick filters
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['exam', 'holiday', 'academic'].map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setSearchQuery(type);
                              setActiveFilter(type);
                            }}
                            className={`px-3 py-1.5 rounded-sm text-sm border transition-colors ${
                              isDarkMode
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            {categoryLabels[type as keyof typeof categoryLabels]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`px-4 py-2 border-t flex items-center justify-between text-xs ${
                  isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center gap-4">
                    <span><kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>↑↓</kbd> Navigate</span>
                    <span><kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>↵</kbd> Select</span>
                  </div>
                  <span><kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>ESC</kbd> Close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {adminPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setAdminPanelOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl mx-4 rounded-sm border shadow-xl overflow-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                isDarkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                  <h3 className={`text-lg font-semibold font-serif ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Admin Panel
                  </h3>
                </div>
                <button
                  onClick={() => setAdminPanelOpen(false)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <X className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Upload JSON File
                  </label>
                  <div className="flex items-center gap-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-sm cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'border-slate-600 hover:border-slate-500 text-slate-400' 
                        : 'border-slate-300 hover:border-slate-400 text-slate-500'
                    }`}>
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Choose file</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Or paste JSON data
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='[{"id": 1, "date": "Sep 19", "title": "Event Name", "type": "academic"}]'
                    className={`w-full h-32 px-4 py-3 rounded-sm border resize-none font-mono text-sm outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-600 text-slate-300 placeholder-slate-500 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>
                
                {uploadStatus === 'error' && (
                  <div className="flex items-center gap-2 mb-4 text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Invalid JSON format. Please check your syntax.</span>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setAdminPanelOpen(false);
                      setJsonInput('');
                      setUploadStatus('idle');
                    }}
                    className={`px-4 py-2 rounded-sm text-sm font-medium border transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJsonUpload}
                    disabled={!jsonInput.trim()}
                    className="px-4 py-2 rounded-sm text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Update Calendar
                  </button>
                </div>
              </div>
              
              <div className={`px-6 py-3 border-t text-xs ${
                isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'
              }`}>
                <span><kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>ESC</kbd> Close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
