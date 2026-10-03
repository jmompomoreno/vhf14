"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function CorrectionReviewButtons({id}:{id:number}){const router=useRouter();const[busy,setBusy]=useState(false);async function decide(decision:"approve"|"reject"){setBusy(true);const r=await fetch("/api/corrections",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,decision})});if(r.ok)router.refresh();else setBusy(false)}return <div><button disabled={busy} onClick={()=>decide("approve")}>{busy?"Updating…":"Apply correction"}</button><button disabled={busy} className="reject" onClick={()=>decide("reject")}>Reject request</button></div>}
