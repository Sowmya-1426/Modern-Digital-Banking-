import React from "react";

const BudgetCard = ({
  id,
  category,
  spent_amount,
  limit_amount,
  warning,
  onDelete,
  onEdit,
}) => {
  // 🔥 FIX: extract numbers safely
  const spent = Number(
    spent_amount.replace(/[₹,]/g, "")
  );
  const limit = Number(
    limit_amount.replace(/[₹,]/g, "")
  );

  // 🔥 FIX: real percentage calculation
  const percentage = Math.min((spent / limit) * 100, 100);

  // 🔥 FIX: correct status
  const isExceeded = spent > limit;

  return (
    <div className="bg-white p-5 rounded-xl shadow border space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{category}</h3>
        <div className="space-x-2">
          <button
            onClick={() => onEdit()}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {/* VALUES */}
      <p className="text-gray-600 text-sm">
        Spent: {spent_amount} / {limit_amount}
      </p>

      {/* 🔥 FIXED PROGRESS BAR */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isExceeded ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* 🔥 FIXED WARNING TEXT */}
      {isExceeded ? (
        <p className="text-red-600 text-sm flex items-center gap-1">
          ⚠️ Budget limit exceeded
        </p>
      ) : (
        <p className="text-green-600 text-sm">
          ✅ Within limit
        </p>
      )}
    </div>
  );
};

export default BudgetCard;
