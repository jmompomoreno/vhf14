"use client";

import { FormEvent, useState } from "react";

type TimeBasis = "actual" | "estimated" | "planned";

type Report = {
  id: number;
  vesselName: string;
  imo: string;
  portCode: string;
  eventType: string;
  eventTimeUtc: string;
  timeBasis: TimeBasis;
  sourceRole: string;
  reportingCapacity: "personal" | "organisation";
  organisation: string;
  terminal: string;
  berth: string;
  pilotBoardingPlace: string;
  notes: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
};

const events = [
  "Anchor Dropped", "Anchor Aweigh", "Pilot on Board", "Tugs Connected",
  "First Line", "All Fast", "Gangway Down", "Cargo Operations Started",
  "Cargo Operations Completed", "Vessel Ready to Sail", "Shifting Started",
  "Shifting Completed", "Last Line", "Pilot Off", "Port Clear",
];

const roles = [
  "VTS operator", "Port professional", "Pilot", "Master / Bridge",
  "Terminal operator", "Tug crew", "Mooring crew", "Ship agent",
];

export function MyReportsClient({ initial }: { initial: Report[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  async function save(e: FormEvent<HTMLFormElement>, report: Report) {
    e.preventDefault();
    setMsg("Saving correction…");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const action = report.status === "pending" ? "edit" : "request_correction";
    const data = {
      ...values,
      imo: String(values.imo),
      organisation: String(values.organisation ?? ""),
      terminal: String(values.terminal ?? ""),
      berth: String(values.berth ?? ""),
      pilotBoardingPlace: String(values.pilotBoardingPlace ?? ""),
      notes: String(values.notes ?? ""),
    };
    const body = {
      action,
      id: report.id,
      data,
      ...(action === "request_correction" ? { reason: String(values.reason) } : {}),
    };
    const response = await fetch("/api/my-reports", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setMsg(result.error ?? "Unable to save");
      return;
    }
    if (action === "edit") {
      setItems(current => current.map(item => item.id === report.id ? { ...item, ...data } as Report : item));
    }
    setEditing(null);
    setMsg(action === "edit"
      ? "Report corrected. It remains pending verification."
      : "Correction sent for review. The verified data remains unchanged meanwhile.");
  }

  async function withdraw(id: number) {
    if (!window.confirm("Withdraw this pending report? It will disappear from the public timeline, while an internal audit record is retained.")) return;
    setMsg("Withdrawing…");
    const response = await fetch("/api/my-reports", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "withdraw", id }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setMsg(result.error ?? "Unable to withdraw");
      return;
    }
    setItems(current => current.map(item => item.id === id ? { ...item, status: "rejected" } : item));
    setMsg("Report withdrawn from the public timeline.");
  }

  return <section className="accountBlock" id="my-reports">
    <div>
      <p className="kicker">MY REPORTS</p>
      <h2>Correct an operational report</h2>
      <p>Pending reports can be corrected or withdrawn immediately. Verified reports use a correction request so the audit history remains intact.</p>
    </div>
    <p className="formMessage" role="status">{msg}</p>
    <div className="myReports">
      {items.map(report => <article key={report.id} className={report.status === "rejected" ? "withdrawn" : ""}>
        <div className="reportSummary">
          <div>
            <span className={`status ${report.status}`}>{report.status === "rejected" ? "withdrawn" : report.status}</span>
            <h3>{report.vesselName} <small>IMO {report.imo}</small></h3>
            <p>{report.portCode} · {report.eventType} · {report.eventTimeUtc.replace("T", " ")} UTC · {report.timeBasis}</p>
          </div>
          {report.status !== "rejected" && <div className="reportActions">
            <button type="button" onClick={() => setEditing(editing === report.id ? null : report.id)}>{report.status === "pending" ? "Edit" : "Request correction"}</button>
            {report.status === "pending" && <button type="button" className="subtleDanger" onClick={() => withdraw(report.id)}>Withdraw</button>}
          </div>}
        </div>
        {editing === report.id && <form className="editReportForm" onSubmit={e => save(e, report)}>
          <div className="two">
            <label>VESSEL NAME<input name="vesselName" required minLength={2} maxLength={100} defaultValue={report.vesselName}/></label>
            <label>IMO NUMBER<input name="imo" required pattern="\d{7}" defaultValue={report.imo}/></label>
          </div>
          <div className="two">
            <label>PORT UN/LOCODE<input name="portCode" required pattern="[A-Za-z]{2}[A-Za-z0-9]{3}" maxLength={5} defaultValue={report.portCode}/></label>
            <label>TIME (UTC)<input name="eventTimeUtc" type="datetime-local" required defaultValue={report.eventTimeUtc}/></label>
          </div>
          <div className="two">
            <label>EVENT<select name="eventType" defaultValue={report.eventType}>{events.map(event => <option key={event}>{event}</option>)}</select></label>
            <label>TIME TYPE<select name="timeBasis" defaultValue={report.timeBasis}>
              <option value="actual">Actual · observed</option>
              <option value="estimated">Estimated · expected</option>
              <option value="planned">Planned · scheduled</option>
            </select></label>
          </div>
          <div className="two">
            <label>PROFESSIONAL ROLE<select name="sourceRole" defaultValue={report.sourceRole}>{roles.map(role => <option key={role}>{role}</option>)}</select></label>
            <label>REPORTING CAPACITY<select name="reportingCapacity" defaultValue={report.reportingCapacity}>
              <option value="personal">Personal professional capacity</option>
              <option value="organisation">On behalf of my organisation</option>
            </select></label>
          </div>
          <fieldset className="optionalContext">
            <legend>LOCATION CONTEXT (OPTIONAL)</legend>
            <div className="three">
              <label>TERMINAL<input name="terminal" maxLength={100} defaultValue={report.terminal}/></label>
              <label>BERTH<input name="berth" maxLength={100} defaultValue={report.berth}/></label>
              <label>PILOT BOARDING PLACE<input name="pilotBoardingPlace" maxLength={150} defaultValue={report.pilotBoardingPlace}/></label>
            </div>
          </fieldset>
          <label>ORGANISATION (OPTIONAL)<input name="organisation" maxLength={150} defaultValue={report.organisation}/></label>
          <label>NOTES<textarea name="notes" maxLength={1000} defaultValue={report.notes}/></label>
          {report.status === "verified" && <label>CORRECTION REASON<textarea name="reason" required minLength={5} maxLength={500} placeholder="Briefly explain what needs correcting and why."/></label>}
          <div className="editActions">
            <button className="saveEdit">{report.status === "pending" ? "Save correction" : "Send correction request"}</button>
            <button type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>}
      </article>)}
      {!items.length && <p>You have not submitted any reports yet.</p>}
    </div>
  </section>;
}
