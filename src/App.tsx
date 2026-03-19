import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Mail,
  User,
  Shield,
  BellRing,
  CreditCard
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from './lib/utils';
import { 
  MOCK_STATS, 
  MOCK_CHART_DATA, 
  MOCK_TRANSACTIONS, 
  MOCK_CUSTOMERS,
  MOCK_PIE_DATA,
  type Transaction 
} from './data/mock';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'dashboard' | 'customers' | 'analytics' | 'settings';

// --- Components ---

const Sidebar = ({ 
  isOpen, 
  toggle, 
  activeView, 
  setView 
}: { 
  isOpen: boolean; 
  toggle: () => void;
  activeView: View;
  setView: (view: View) => void;
}) => {
  const navItems: { icon: any; label: string; view: View }[] = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: Users, label: 'Customers', view: 'customers' },
    { icon: BarChart3, label: 'Analytics', view: 'analytics' },
    { icon: Settings, label: 'Settings', view: 'settings' },
  ];

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">ProDash</span>
            </div>
            <button onClick={toggle} className="lg:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  if (window.innerWidth < 1024) toggle();
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
                  activeView === item.view 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={toggle}
        />
      )}
    </>
  );
};

const StatCard = ({ label, value, change, trend }: typeof MOCK_STATS[0]) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
        trend === 'up' 
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
          : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
      )}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(change)}%
      </div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="mt-2 text-xs text-slate-400">vs last month</div>
  </motion.div>
);

const TransactionTable = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-lg">Recent Transactions</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            <AnimatePresence mode='popLayout'>
              {filtered.map((t) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={t.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{t.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{t.date}</td>
                  <td className="px-6 py-4 font-mono font-medium">${t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      t.status === 'completed' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                      t.status === 'pending' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
                      t.status === 'failed' && "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
                    )}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{t.category}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- View Components ---

const DashboardView = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {MOCK_STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-6 lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg">Revenue Growth</h3>
            <p className="text-sm text-slate-500">Monthly revenue overview</p>
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
            <Download size={18} />
          </button>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderColor: isDarkMode ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="font-bold text-lg mb-6">User Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} dy={10} />
              <Tooltip cursor={{ fill: isDarkMode ? '#1e293b' : '#f1f5f9' }} contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderColor: isDarkMode ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }} />
              <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                {MOCK_CHART_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    <TransactionTable />
  </div>
);

const CustomersView = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Add Customer
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {filtered.map((customer) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={customer.id} 
              className="card p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-4">
                {customer.avatar}
              </div>
              <h3 className="font-bold text-lg">{customer.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{customer.email}</p>
              <div className="grid grid-cols-2 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 uppercase">Total Spend</p>
                  <p className="font-bold">${customer.spend.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Last Active</p>
                  <p className="font-medium text-sm">{customer.lastActive}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};


const AnalyticsView = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Advanced Analytics</h2>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Last 30 Days
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Download size={16} /> Export Report
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="font-bold text-lg mb-6">Revenue by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {MOCK_PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderColor: isDarkMode ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {MOCK_PIE_DATA.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <h3 className="font-bold text-lg mb-6">Growth Projections</h3>
        <div className="space-y-6">
          {[
            { label: 'Market Share', value: 75, color: 'bg-indigo-600' },
            { label: 'Customer Retention', value: 92, color: 'bg-emerald-500' },
            { label: 'Brand Awareness', value: 45, color: 'bg-amber-500' },
            { label: 'Product Innovation', value: 68, color: 'bg-violet-500' },
            { label: 'Operational Efficiency', value: 81, color: 'bg-sky-500' },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-slate-500">{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  className={cn("h-full", item.color)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card p-6">
      <h3 className="font-bold text-lg mb-6">Regional Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { region: 'North America', sales: '$1.2M', growth: '+12.5%', color: 'text-emerald-500' },
          { region: 'Europe', sales: '$850K', growth: '+8.2%', color: 'text-emerald-500' },
          { region: 'Asia Pacific', sales: '$420K', growth: '-2.1%', color: 'text-rose-500' },
        ].map((item) => (
          <div key={item.region} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-1">{item.region}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold">{item.sales}</p>
              <p className={cn("text-sm font-bold", item.color)}>{item.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="max-w-4xl space-y-8">
    <h2 className="text-2xl font-bold">Account Settings</h2>
    
    <div className="space-y-6">
      <section className="card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
            JD
          </div>
          <div>
            <h3 className="font-bold text-lg">Profile Information</h3>
            <p className="text-sm text-slate-500">Update your account details and photo.</p>
            <button className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Change Avatar</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input type="email" defaultValue="john@example.com" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <input type="text" defaultValue="Senior Product Designer" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input type="text" defaultValue="San Francisco, CA" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="font-bold text-lg">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-500 border border-slate-200 dark:border-slate-800">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-medium">Password</p>
                <p className="text-xs text-slate-500">Last changed 3 months ago</p>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Update</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-500 border border-slate-200 dark:border-slate-800">
                <BellRing size={20} />
              </div>
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Secure your account with 2FA</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6 border-rose-200 dark:border-rose-900/50">
        <h3 className="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
          Delete Account
        </button>
      </section>
    </div>
  </div>
);


// --- Main App ---

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView isDarkMode={isDarkMode} />;
      case 'customers': return <CustomersView />;
      case 'analytics': return <AnalyticsView isDarkMode={isDarkMode} />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        activeView={activeView}
        setView={setActiveView}
      />

      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold capitalize">{activeView}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950" />
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
            <button className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                JD
              </div>
              <span className="text-sm font-medium hidden sm:block">John Doe</span>
              <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
