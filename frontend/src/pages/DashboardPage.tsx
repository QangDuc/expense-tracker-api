import './DashboardPage.css';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { HiOutlineWallet, HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown, HiOutlineChartPie } from 'react-icons/hi2';
import { api, unwrap } from '../services/api';
import { money, errorOf } from '../utils/format';
import type { Transaction } from '../types';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ui/ChartCard';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton';

type DashboardData = {
  income: number;
  expense: number;
  balance: number;
  monthlyExpense: { name: string; amount: number }[];
  recentTransactions: Transaction[];
};

const PIE_COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function DashboardPage() {
  const [d, setD] = useState<DashboardData>();
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((r) => unwrap<DashboardData>(r))
      .then(setD)
      .catch((e: unknown) => setError(errorOf(e)));
  }, []);

  if (error) return <p className="error-text" style={{ padding: '2rem' }}>{error}</p>;

  /* Loading skeleton */
  if (!d) {
    return (
      <div className="dashboard">
        <PageHeader title="Dashboard" subtitle="Tổng quan tài chính của bạn" />
        <div className="dashboard__stats">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="dashboard__charts">
          <div className="dashboard__chart-placeholder"><SkeletonRow /><SkeletonRow /><SkeletonRow /></div>
          <div className="dashboard__chart-placeholder"><SkeletonRow /><SkeletonRow /><SkeletonRow /></div>
        </div>
      </div>
    );
  }

  const chartData = (d.monthlyExpense || []).map((x) => ({
    name: x.name,
    expense: x.amount,
  }));

  /* Group recent transactions by type for PieChart */
  const typeMap = new Map<string, number>();
  d.recentTransactions?.forEach((t) => {
    const label = t.type === 0 ? 'Thu nhập' : 'Chi tiêu';
    typeMap.set(label, (typeMap.get(label) || 0) + t.amount);
  });
  const pieData = Array.from(typeMap, ([name, value]) => ({ name, value }));

  const budgetUsed = d.income > 0 ? Math.round((d.expense / d.income) * 100) : 0;

  return (
    <div className="dashboard">
      <PageHeader title="Dashboard" subtitle="Tổng quan tài chính của bạn" />

      {/* Stat Cards */}
      <div className="dashboard__stats">
        <StatCard
          label="Số dư"
          value={money(d.balance)}
          icon={<HiOutlineWallet />}
          color="blue"
        />
        <StatCard
          label="Thu nhập"
          value={money(d.income)}
          icon={<HiOutlineArrowTrendingUp />}
          color="green"
        />
        <StatCard
          label="Chi tiêu"
          value={money(d.expense)}
          icon={<HiOutlineArrowTrendingDown />}
          color="red"
        />
        <StatCard
          label="Tỷ lệ chi tiêu"
          value={`${budgetUsed}%`}
          icon={<HiOutlineChartPie />}
          color="amber"
          trend={budgetUsed >= 80 ? 'Cần tiết kiệm hơn' : 'Đang ổn'}
        />
      </div>

      {/* Charts */}
      <div className="dashboard__charts">
        <ChartCard title="Chi tiêu theo tháng">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [money(value), 'Chi tiêu']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ fill: '#2563EB', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Chưa có dữ liệu" description="Hãy thêm giao dịch để xem biểu đồ" />
          )}
        </ChartCard>

        <ChartCard title="Phân bổ thu chi">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '13px' }}
                />
                <Tooltip
                  formatter={(value: number) => [money(value)]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Chưa có dữ liệu" description="Hãy thêm giao dịch để xem biểu đồ" />
          )}
        </ChartCard>
      </div>

      {/* Recent Transactions */}
      <div className="dashboard__recent">
        <ChartCard title="Giao dịch gần đây">
          {d.recentTransactions && d.recentTransactions.length > 0 ? (
            <div className="dashboard__tx-list">
              {d.recentTransactions.slice(0, 8).map((tx) => (
                <div key={tx.id} className="dashboard__tx-row">
                  <div className="dashboard__tx-info">
                    <span className="dashboard__tx-title">{tx.title}</span>
                    <span className="dashboard__tx-date">
                      {new Date(tx.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="dashboard__tx-right">
                    <span className={`dashboard__tx-amount ${tx.type === 0 ? 'income' : 'expense'}`}>
                      {tx.type === 0 ? '+' : '-'}{money(tx.amount)}
                    </span>
                    <Badge variant={tx.type === 0 ? 'income' : 'expense'}>
                      {tx.type === 0 ? 'Thu nhập' : 'Chi tiêu'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Chưa có giao dịch" description="Bắt đầu bằng cách thêm giao dịch mới" />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
