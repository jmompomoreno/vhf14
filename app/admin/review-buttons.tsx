"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const verifyReasons=["Corroborated operational report","Verified professional source","Authoritative supporting information","Other"];
const rejectReasons=["Duplicate report","Incorrect vessel, port or event","Time conflicts with available evidence","Insufficient evidence","Unauthorised or unsuitable content","Other"];

export function ReviewButtons({id,ids,label}:{id?:number;ids?:number[];label?:string}){
 const router=useRouter();const[decision,setDecision]=useState<"verified"|"rejected"|null>(null);const[busy,setBusy]=useState(false);const[message,setMessage]=useState("");const selected=ids??(id?[id]:[]);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!decision)return;const data=new FormData(event.currentTarget);const reasonType=String(data.get("reasonType")??"");const detail=String(data.get("detail")??"").trim();const reason=reasonType==="Other"?detail:[reasonType,detail].filter(Boolean).join(" · ");if(reason.length<3){setMessage("Enter a review reason.");return}setBusy(true);setMessage("");const r=await fetch("/api/reports",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({ids:selected,status:decision,reason})});const body=await r.json() as {error?:string};if(r.ok){setDecision(null);router.refresh()}else{setMessage(body.error??"Unable to review the selected reports");setBusy(false)}}
 if(decision)return <form className="reviewDecision" onSubmit={submit}><b>{decision==="verified"?"Verify":"Reject"} {label??(selected.length>1?`${selected.length} reports`:"report")}</b><select name="reasonType" defaultValue={decision==="verified"?verifyReasons[0]:rejectReasons[0]}>{(decision==="verified"?verifyReasons:rejectReasons).map(reason=><option key={reason}>{reason}</option>)}</select><textarea name="detail" maxLength={400} placeholder="Optional note; required when Other is selected"/><div><button disabled={busy} className={decision==="rejected"?"reject":""}>{busy?"Saving…":"Confirm"}</button><button type="button" className="secondary" disabled={busy} onClick={()=>{setDecision(null);setMessage("")}}>Cancel</button></div>{message&&<output>{message}</output>}</form>;
 return <div className="reviewButtons"><button onClick={()=>setDecision("verified")}>{selected.length>1?"Verify pending":"Verify"}</button><button className="reject" onClick={()=>setDecision("rejected")}>{selected.length>1?"Reject pending":"Reject"}</button></div>
}
