"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function ReviewButtons({id}:{id:number}){const router=useRouter();const[busy,setBusy]=useState(false);async function review(status:"verified"|"rejected"){const reason=window.prompt(`Reason for ${status} decision:`)?.trim();if(!reason)return;setBusy(true);const r=await fetch("/api/admin/reports",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,status,reason})});if(r.ok)router.refresh();else setBusy(false)}return <div><button disabled={busy} onClick={()=>review("verified")}>{busy?"Updating…":"Verify"}</button><button disabled={busy} className="reject" onClick={()=>review("rejected")}>Reject</button></div>}
