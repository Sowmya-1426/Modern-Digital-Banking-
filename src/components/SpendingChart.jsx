import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#ef4444", "#a855f7"];

export default function SpendingChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No spending data</p>;
  }

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={100}
      >
        {data.map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
