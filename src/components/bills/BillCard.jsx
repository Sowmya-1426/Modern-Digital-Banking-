import { formatINR } from "../../utils/format";

export default function BillCard({
  bill,
  onTogglePaid,
  onToggleAutoPay,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{bill.biller_name}</h3>
        <p className="text-sm text-gray-500">
          Due: {bill.due_date}
        </p>
        <p className="font-medium mt-1">
          ₹ {formatINR(bill.amount_due)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            onTogglePaid(
              bill.id,
              bill.status === "paid" ? "upcoming" : "paid"
            )
          }
          className={`px-3 py-1 rounded-full text-xs ${
            bill.status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {bill.status}
        </button>

        <button
          onClick={() =>
            onToggleAutoPay(bill.id, !bill.auto_pay)
          }
          className={`px-3 py-1 rounded-full text-xs ${
            bill.auto_pay
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Auto
        </button>

        <button
          onClick={() => onEdit(bill)}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(bill.id)}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
