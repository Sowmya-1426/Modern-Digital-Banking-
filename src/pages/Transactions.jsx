import { useEffect, useState } from "react";
import API from "../utils/api";
import { formatINR } from "../utils/format";
import { exportCSV, exportPDF } from "../services/exportService";

/* ------------------ CURRENCIES ------------------ */
const CURRENCIES = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0095 },
  JPY: { symbol: "¥", rate: 1.8 },
};

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState("INR");

  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [txnDate, setTxnDate] = useState("");
  const [merchant, setMerchant] = useState("");

  /* ------------------ FETCH ACCOUNTS ------------------ */
  useEffect(() => {
    API.get("/accounts/")
      .then((res) => {
        setAccounts(res.data);
        if (res.data.length) setSelectedAccount(res.data[0].id);
      })
      .catch(() => alert("Failed to load accounts"));
  }, []);

  /* ------------------ FETCH TRANSACTIONS ------------------ */
  useEffect(() => {
    if (!selectedAccount) return;

    API.get(`/transactions/${selectedAccount}`)
      .then((res) => setTransactions(res.data))
      .catch(() => alert("Failed to load transactions"));
  }, [selectedAccount]);

  /* ------------------ FETCH CATEGORIES ------------------ */
  useEffect(() => {
    API.get("/transactions/categories")
      .then((res) => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  /* ------------------ CSV IMPORT ------------------ */
  const handleCSV = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  // 🔥 IMPORTANT: send selected account_id
  formData.append("account_id", selectedAccount);

  API.post("/transactions/upload-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => API.get(`/transactions/${selectedAccount}`))
    .then((res) => {
      setTransactions(res.data);
      alert("CSV uploaded successfully ✅");
    })
    .catch((err) => {
      console.error(err);
      alert("CSV upload failed ❌ (check CSV format)");
    });
};

  /* ------------------ ADD TRANSACTION ------------------ */
  const handleAddTransaction = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      await API.post("/transactions/", {
        account_id: Number(selectedAccount),
        description: desc || null,
        merchant: merchant || null,
        amount: Number(amount),
        txn_type: type.toLowerCase(),
        currency,
        txn_date: txnDate || null,
      });

      alert("Transaction added successfully ✅");

      setDesc("");
      setAmount("");
      setType("credit");
      setMerchant("");
      setTxnDate("");
      setShowForm(false);

      const res = await API.get(`/transactions/${selectedAccount}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction ❌");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-500">
            View and manage your transaction history
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.bank_name} ({acc.account_type})
              </option>
            ))}
          </select>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button onClick={exportCSV} className="bg-blue-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>

          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
            Export PDF
          </button>

          <label className="bg-indigo-700 text-white px-4 py-2 rounded cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" hidden onChange={handleCSV} />
          </label>

          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <input className="border p-2 w-full" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input className="border p-2 w-full" placeholder="Merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
          <input className="border p-2 w-full" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select className="border p-2 w-full" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <input className="border p-2 w-full" type="date" value={txnDate} onChange={(e) => setTxnDate(e.target.value)} />

          <div className="flex gap-3">
            <button onClick={handleAddTransaction} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
  
      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="w-16 px-4 py-3 text-left">ID</th>
              <th className="w-[240px] px-4 py-3 text-left">Description</th>
              <th className="w-[200px] px-4 py-3 text-left">Merchant</th>
              <th className="w-[150px] px-4 py-3 text-center">Category</th>
              <th className="w-[140px] px-4 py-3 text-right">Amount</th>
              <th className="w-[110px] px-4 py-3 text-center">Type</th>
              <th className="w-[140px] px-4 py-3 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{tx.id}</td>
                <td className="px-4 py-3 truncate">{tx.description}</td>
                <td className="px-4 py-3 truncate">{tx.merchant || "-"}</td>
                <td className="px-4 py-3 text-center">
  <select
    value={tx.category}
    onChange={(e) => {
      const newCategory = e.target.value;

      // update UI instantly
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === tx.id ? { ...t, category: newCategory } : t
        )
      );

      // update backend
      API.put(`/transactions/${tx.id}/category`, null, {
        params: { category: newCategory },
      }).catch(() => alert("Failed to update category ❌"));
    }}
    className="w-32 border rounded px-2 py-1"
  >
    {categories.map((cat) => (
      <option key={cat.id} value={cat.name}>
        {cat.name}
      </option>
    ))}
  </select>
</td>


                <td className={`px-4 py-3 text-right font-medium ${tx.txn_type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {tx.txn_type === "credit" ? "+" : "-"}₹{formatINR(tx.amount)}
                </td>
                <td className="px-4 py-3 text-center capitalize">{tx.txn_type}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {tx.txn_date?.slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
