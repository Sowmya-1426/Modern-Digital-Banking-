import { useState } from "react";

export default function BillForm({ onClose, onAdd }) {
  const [biller_name, setName] = useState("");
  const [amount_due, setAmount] = useState("");
  const [due_date, setDueDate] = useState("");
  const [auto_pay, setAutoPay] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onAdd({
      biller_name,
      amount_due: Number(amount_due),
      due_date, // MUST be YYYY-MM-DD
      auto_pay,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Add Bill</h2>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Biller Name"
          value={biller_name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          placeholder="Amount"
          value={amount_due}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={auto_pay}
            onChange={() => setAutoPay(!auto_pay)}
          />
          Enable Auto Pay
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Save Bill
          </button>
        </div>
      </form>
    </div>
  );
}
