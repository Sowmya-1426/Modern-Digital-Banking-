import API from "../utils/api";

/**
 * Export Transactions as CSV
 */
export const exportCSV = async () => {
  try {
    const response = await API.get(
      "/exports/transactions/csv",
      {
        responseType: "blob", // IMPORTANT
      }
    );

    const blob = new Blob([response.data], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV export failed:", error);
    alert("CSV export failed ❌");
  }
};

/**
 * Export Transactions as PDF
 */
export const exportPDF = async () => {
  try {
    const response = await API.get(
      "/exports/transactions/pdf",
      {
        responseType: "blob", // IMPORTANT
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("PDF export failed ❌");
  }
};
