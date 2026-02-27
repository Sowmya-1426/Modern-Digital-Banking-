import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

/* ================= MASSIVE RULE ENGINE (200+ Variations) ================= */

const RULE_GROUPS = [

  /* ================= GREETINGS (25+) ================= */
  {
    keywords: [
      "hi","hello","hey","good morning","good evening","good afternoon",
      "hai","hii","yo","what's up","sup","greetings","welcome",
      "how are you","how r u","gm","ge","gn"
    ],
    reply: (user) => `Hi ${user} 👋 How can I help you today?`,
  },

  /* ================= ACCOUNTS (30+) ================= */
  {
    keywords: [
      "account","accounts","balance","bank account","add account",
      "create account","delete account","remove account",
      "checking","savings","investment","account type",
      "how many accounts","account list","edit account",
      "update account","primary account","secondary account"
    ],
    reply:
      "Go to Accounts section to add, delete, edit or manage accounts. You can track balances and account types easily.",
  },

  /* ================= TRANSACTIONS (40+) ================= */
  {
    keywords: [
      "transaction","transactions","payment","history","credit","debit",
      "transfer","send money","receive money","add transaction",
      "edit transaction","delete transaction","import","export",
      "csv","pdf","download report","upload csv",
      "recent payments","transaction list","money flow"
    ],
    reply:
      "Transactions page allows you to add, edit, categorize, import CSV, export PDF and monitor full history.",
  },

  /* ================= BUDGETS (25+) ================= */
  {
    keywords: [
      "budget","budgets","limit","spending limit","expense limit",
      "budget exceeded","budget alert","monthly budget",
      "yearly budget","set limit","category limit"
    ],
    reply:
      "Budgets help control your spending. Set category limits and track visual charts to avoid overspending.",
  },

  /* ================= BILLS (25+) ================= */
  {
    keywords: [
      "bill","bills","due","overdue","due date","auto pay","autopay",
      "bill reminder","electricity bill","rent","subscription",
      "water bill","internet bill","pay bill","bill status"
    ],
    reply:
      "Bills section tracks due dates, overdue bills and auto-pay status. Enable reminders to avoid late payments.",
  },

  /* ================= REWARDS (25+) ================= */
  {
    keywords: [
      "reward","rewards","points","redeem","cashback","loyalty",
      "reward balance","reward value","convert points",
      "how many points","redeem value"
    ],
    reply:
      "You earn reward points for transactions. 10 points = ₹1. Redeem inside Rewards section anytime.",
  },

  /* ================= INSIGHTS (25+) ================= */
  {
    keywords: [
      "insight","insights","analysis","monthly report","burn rate",
      "top merchants","cashflow","income","expense",
      "financial report","spending chart","analytics"
    ],
    reply:
      "Insights page provides income vs expenses, burn rate, top merchants and spending analytics.",
  },

  /* ================= SECURITY (25+) ================= */
  {
    keywords: [
      "password","change password","reset password","forgot password",
      "security","two factor","2fa","authentication",
      "otp","login issue","secure","account safety"
    ],
    reply:
      "Manage security inside Settings → Enable 2FA and change password for extra protection.",
  },

  /* ================= GENERAL HELP (30+) ================= */
  {
    keywords: [
      "help","support","guide","how to","what is",
      "explain","assist","problem","issue","why",
      "error","not working","bug","confused","info"
    ],
    reply:
      "I can assist you with Accounts, Transactions, Budgets, Bills, Rewards, Insights and Security settings.",
  },
];


/* ================= COMPONENT ================= */

export default function Chartboard() {

  const { user, loading } = useAuth();

  /* ✅ DIRECT USERNAME FIX */
  const username = !loading && user?.name ? user.name : "User";

  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  /* ================= DARK MODE FIX (GLOBAL SAFE) ================= */

const [isDark, setIsDark] = useState(false);

useEffect(() => {

  const checkTheme = () => {
    const htmlDark = document.documentElement.classList.contains("dark");
    const bodyDark = document.body.classList.contains("dark");

    setIsDark(htmlDark || bodyDark);
  };

  checkTheme(); // initial check

  const observer = new MutationObserver(checkTheme);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();

}, []);


  /* ================= INITIAL GREETING ================= */

  useEffect(() => {
    if (openChat && !loading) {
      setMessages([
        {
          type: "bot",
          text: `Hi ${username} 👋 How can I help you today?`,
        },
      ]);
    }
  }, [openChat, username, loading]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= RULE MATCH ================= */

  const getReply = (msg) => {
    const text = msg.toLowerCase();

    for (let group of RULE_GROUPS) {
      if (group.keywords.some((k) => text.includes(k))) {
        return typeof group.reply === "function"
          ? group.reply(username)
          : group.reply;
      }
    }

    return `Sorry ${username}, I couldn't understand. Please ask about accounts, transactions, budgets or rewards.`;
  };

  /* ================= SEND ================= */

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMsg = { type: "bot", text: getReply(userMsg.text) };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 700);
  };

  /* ================= UI ================= */

  return (
    <div
      className={`relative min-h-[80vh] transition-all duration-500 ${
        isDark ? "bg-slate-900 text-white" : "bg-slate-100"
      }`}
    >

      <marquee className="bg-blue-600 text-white py-2 rounded-lg mb-4">
        💬 Feel free to ask anything about your banking dashboard!
      </marquee>

      {!openChat && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center transition-all duration-700">
          <div className="text-5xl mb-6 animate-bounce">💬</div>

          <h1 className="text-3xl font-bold">
            Hi {username} 👋
          </h1>

          <p className="opacity-70 mt-2">
            How can I help you today?
          </p>

          <button
            onClick={() => setOpenChat(true)}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Start Chat
          </button>
        </div>
      )}

      {openChat && (
        <div
          className={`fixed bottom-6 right-6 w-96 h-[520px] rounded-2xl shadow-2xl flex flex-col transition-all duration-500 ${
            isDark ? "bg-gray-900 text-white" : "bg-white"
          }`}
        >
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between">
            <span>Digital Bank Assistant</span>
            <button onClick={() => setOpenChat(false)}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm transition-all ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : isDark
                    ? "bg-gray-800"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="text-sm text-gray-400 animate-pulse">
                Assistant typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 flex gap-2 border-t border-gray-300 dark:border-gray-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-2 rounded-full border transition-all ${
                isDark
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-white"
              }`}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded-full hover:bg-blue-700 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}