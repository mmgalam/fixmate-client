export function JobStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    requested: "bg-blue-100 text-blue-700 border-blue-200",
    accepted: "bg-indigo-100 text-indigo-700 border-indigo-200",
    "in-progress": "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-slate-200 text-slate-700 border-slate-300",
  };

  const labels: Record<string, string> = {
    requested: "Requested",
    accepted: "Accepted",
    "in-progress": "In Progress",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        isPaid
          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      {isPaid ? "Paid" : "Unpaid"}
    </span>
  );
}

export function ApprovalStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
