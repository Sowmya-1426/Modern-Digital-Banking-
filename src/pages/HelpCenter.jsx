import { useState } from "react";
import {
  Mail,
  Phone,
  Ticket,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle
} from "lucide-react";
import API from "../utils/api";

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [successPopup, setSuccessPopup] = useState(false);

  /* ---------------- FAQ DATA ---------------- */
  const faqs = [
    {
      question: "How to add a bank account?",
      answer:
        "Go to Accounts page → Click Add Account → Enter bank details → Save.",
    },
    {
      question: "How to set a monthly budget?",
      answer:
        "Go to Budgets → Add Budget → Select category and limit amount.",
    },
    {
      question: "How do alerts work?",
      answer:
        "Alerts notify you about unusual transactions and low balance.",
    },
    {
      question: "How are reward points calculated?",
      answer:
        "You earn reward points on eligible transactions. 10 points = ₹1.",
    },
    {
      question: "How does export work?",
      answer:
        "Go to Transactions → Export → Select date range → Download file.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- SUBMIT TICKET ---------------- */
  const submitTicket = async () => {
    if (!subject || !description || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/tickets/", {
        subject,
        description,
        category,
      });

      setShowModal(false);
      setSubject("");
      setDescription("");
      setCategory("");
      setSuccessPopup(true);
    } catch (err) {
      alert("Failed to submit ticket");
    }
  };

  return (
    <div className="space-y-8 relative">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-gray-500">Find answers and get support</p>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search help topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          ❓ Frequently Asked Questions
        </h2>

        {filteredFaqs.length === 0 && (
          <p className="text-gray-400 text-sm">No results found.</p>
        )}

        {filteredFaqs.map((faq, index) => (
          <div key={index} className="border rounded-xl p-4">
            <div
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="font-medium">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {openIndex === index && (
              <p className="mt-3 text-gray-600 text-sm">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CONTACT SUPPORT */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Contact Support</h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div
            onClick={() =>
              window.open("mailto:support@digitalbank.com")
            }
            className="cursor-pointer p-6 rounded-xl bg-gray-50 hover:shadow-lg transition"
          >
            <Mail className="text-blue-600 mb-3" size={28} />
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-gray-500 text-sm">
              support@digitalbank.com
            </p>
          </div>

          <div
            onClick={() =>
              window.open("tel:18001234567")
            }
            className="cursor-pointer p-6 rounded-xl bg-gray-50 hover:shadow-lg transition"
          >
            <Phone className="text-green-600 mb-3" size={28} />
            <h3 className="font-semibold">Phone Support</h3>
            <p className="text-gray-500 text-sm">
              1800-123-4567
            </p>
          </div>

          <div
            onClick={() => setShowModal(true)}
            className="cursor-pointer p-6 rounded-xl bg-gray-50 hover:shadow-lg transition"
          >
            <Ticket className="text-purple-600 mb-3" size={28} />
            <h3 className="font-semibold">Raise a Ticket</h3>
            <p className="text-gray-500 text-sm">
              Get help within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[400px] p-6 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              Raise Support Ticket
            </h2>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <textarea
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3 h-24 resize-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Select Category</option>
              <option>Accounts</option>
              <option>Transactions</option>
              <option>Budgets</option>
              <option>Rewards</option>
              <option>Alerts</option>
              <option>Other</option>
            </select>

            <button
              onClick={submitTicket}
              disabled={!subject || !description || !category}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center w-[350px] shadow-xl relative">

            <button
              onClick={() => setSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <CheckCircle
              className="text-green-500 mx-auto mb-4"
              size={50}
            />

            <h3 className="text-lg font-semibold mb-2">
              Ticket Submitted Successfully!
            </h3>

            <p className="text-gray-500 mb-6">
              Our team will contact you within 24 hours.
            </p>

            <button
              onClick={() => setSuccessPopup(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}