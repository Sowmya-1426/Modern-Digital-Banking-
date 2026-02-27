import { useState, useEffect } from "react";
import BillList from "../components/bills/BillList";
import BillForm from "../components/bills/BillForm";

import {
  fetchBills,
  addBillApi,
  updateBillApi,
  deleteBillApi,
} from "../services/billsService";

import { formatINR } from "../utils/format";

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);

  /* ================= LOAD BILLS ================= */
  useEffect(() => {
    fetchBills().then(setBills).catch(console.error);
  }, []);

  /* ================= ADD BILL ================= */
  const addBill = async (bill) => {
    const saved = await addBillApi(bill);
    setBills((prev) => [...prev, saved]);
    setOpenForm(false);
    alert("✅ Bill added successfully");
  };

  /* ================= UPDATE BILL ================= */
  const updateBill = async (id, data) => {
    const updated = await updateBillApi(id, data);
    setBills((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
  };

  /* ================= DELETE BILL ================= */
  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    await deleteBillApi(id);
    setBills((prev) => prev.filter((b) => b.id !== id));
    alert("🗑️ Bill deleted successfully");
  };

  /* ================= FILTERS ================= */
  const filteredBills =
    filter === "all"
      ? bills
      : bills.filter((b) => b.status === filter);

  const totalDue = bills
    .filter((b) => b.status !== "paid")
    .reduce((sum, b) => sum + Number(b.amount_due), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bills</h1>
        <p className="text-gray-500">
          Manage and track your recurring bills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Due" value={formatINR(totalDue)} dark />
        <SummaryCard title="Upcoming" value={bills.filter(b => b.status === "upcoming").length} />
        <SummaryCard title="Overdue" value={bills.filter(b => b.status === "overdue").length} />
        <SummaryCard title="Paid" value={bills.filter(b => b.status === "paid").length} />
      </div>

      <div className="flex gap-3 bg-gray-100 p-2 rounded-lg w-fit">
        {["all", "upcoming", "overdue", "paid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm ${
              filter === f ? "bg-white shadow font-medium" : "text-gray-500"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setOpenForm(true)}
          className="bg-slate-900 text-white px-5 py-2 rounded-lg"
        >
          + Add Bill
        </button>
      </div>

      <BillList
        bills={filteredBills}
        onTogglePaid={(id, status) =>
          updateBill(id, { status: status === "paid" ? "upcoming" : "paid" })
        }
        onToggleAutoPay={(id, auto) =>
          updateBill(id, { auto_pay: !auto })
        }
        onDelete={deleteBill}
      />

      {openForm && (
        <BillForm
          onClose={() => setOpenForm(false)}
          onAdd={addBill}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, dark }) {
  return (
    <div
      className={`rounded-xl p-5 ${
        dark
          ? "bg-gradient-to-br from-slate-900 to-slate-700 text-white"
          : "bg-white shadow"
      }`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
