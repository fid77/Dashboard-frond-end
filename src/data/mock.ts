export interface Stat {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

export interface ChartData {
  name: string;
  revenue: number;
  users: number;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  category: string;
}

export const MOCK_STATS: Stat[] = [
  { label: 'Total Revenue', value: '$45,231.89', change: 20.1, trend: 'up' },
  { label: 'Active Users', value: '2,350', change: 10.5, trend: 'up' },
  { label: 'New Subscriptions', value: '+12.2%', change: -4.3, trend: 'down' },
  { label: 'Churn Rate', value: '1.2%', change: 0.5, trend: 'up' },
];

export const MOCK_CHART_DATA: ChartData[] = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', customer: 'Alice Johnson', amount: 120.50, status: 'completed', date: '2024-03-15', category: 'Software' },
  { id: '2', customer: 'Bob Smith', amount: 45.00, status: 'pending', date: '2024-03-14', category: 'Hardware' },
  { id: '3', customer: 'Charlie Brown', amount: 300.25, status: 'completed', date: '2024-03-14', category: 'Services' },
  { id: '4', customer: 'Diana Prince', amount: 89.99, status: 'failed', date: '2024-03-13', category: 'Software' },
  { id: '5', customer: 'Ethan Hunt', amount: 1500.00, status: 'completed', date: '2024-03-12', category: 'Enterprise' },
  { id: '6', customer: 'Fiona Apple', amount: 25.00, status: 'completed', date: '2024-03-11', category: 'Software' },
  { id: '7', customer: 'George Miller', amount: 75.50, status: 'pending', date: '2024-03-10', category: 'Hardware' },
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  spend: number;
  lastActive: string;
  avatar: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', spend: 1250.50, lastActive: '2 hours ago', avatar: 'AJ' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', spend: 450.00, lastActive: '5 hours ago', avatar: 'BS' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', spend: 3200.25, lastActive: '1 day ago', avatar: 'CB' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', spend: 890.99, lastActive: '2 days ago', avatar: 'DP' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', spend: 15000.00, lastActive: '3 hours ago', avatar: 'EH' },
];

export const MOCK_PIE_DATA = [
  { name: 'Software', value: 400, color: '#4f46e5' },
  { name: 'Hardware', value: 300, color: '#818cf8' },
  { name: 'Services', value: 300, color: '#c7d2fe' },
  { name: 'Enterprise', value: 200, color: '#312e81' },
];

