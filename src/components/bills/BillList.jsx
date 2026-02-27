import { formatINR } from "../../utils/format";

export default function BillList({
  bills,
  onTogglePaid,
  onToggleAutoPay,
  onDelete,
}) {
  if (!bills.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
        No bills found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow divide-y">
      {bills.map((bill) => (
        <div
          key={bill.id}
          className="p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{bill.biller_name}</p>
            <p className="text-sm text-gray-500">
              Due: {bill.due_date} • {bill.status}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">
              ₹ {formatINR(bill.amount_due)}
            </span>

            <button
              onClick={() => onTogglePaid(bill.id, bill.status)}
              className="text-sm text-blue-600"
            >
              {bill.status === "paid" ? "Unpay" : "Mark Paid"}
            </button>

            <button
              onClick={() => onToggleAutoPay(bill.id, bill.auto_pay)}
              className="text-sm text-purple-600"
            >
              {bill.auto_pay ? "Disable Auto" : "Enable Auto"}
            </button>

            <button
              onClick={() => onDelete(bill.id)}
              className="text-sm text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
