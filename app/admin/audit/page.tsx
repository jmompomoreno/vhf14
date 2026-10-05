import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { adminAuditLog } from "../../../db/schema";
import { requireVHF14Admin } from "../../chatgpt-auth";
import { NativeLink as Link } from "../../native-link";

export const dynamic="force-dynamic";
export default async function AuditLog({searchParams}:{searchParams:Promise<{q?:string}>}){
 await requireVHF14Admin("/admin/audit");const params=await searchParams;const q=(params.q??"").trim().toLowerCase();const entries=await getDb().select().from(adminAuditLog).orderBy(desc(adminAuditLog.createdAt)).limit(300);const shown=entries.filter(entry=>!q||`${entry.actorUserId} ${entry.subjectType} ${entry.subjectId} ${entry.action} ${entry.reason}`.toLowerCase().includes(q));
 return <main className="admin"><header><Link href="/admin">← Operational verification</Link><div><p className="kicker">ADMIN · TRACEABILITY</p><h1>Audit log</h1><p>Who changed what, when and why. Entries are read-only and ordered from newest to oldest.</p></div></header><form className="adminFilters auditFilters"><input name="q" defaultValue={params.q} placeholder="Actor, subject, action, report or reason"/><button>Search</button><Link href="/admin/audit">Clear</Link></form><div className="auditTable"><div className="auditHeader"><span>Time</span><span>Action</span><span>Subject</span><span>Reason</span><span>Administrator</span></div>{shown.map(entry=><article key={entry.id}><time>{entry.createdAt}</time><b className={`status ${entry.action}`}>{entry.action}</b><span>{entry.subjectType} · {entry.subjectId}<small>{entry.previousValue||"—"} → {entry.newValue||"—"}</small></span><p>{entry.reason}</p><small>{entry.actorUserId}</small></article>)}{!shown.length&&<p className="empty">No audit entries match this search.</p>}</div></main>
}
