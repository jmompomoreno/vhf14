"use client";
import { useState } from "react";
import { planOrder, plans, type PlanKey } from "../plans";

export function PlanSelector(){
  const [cycle,setCycle]=useState<"monthly"|"annual">("monthly");
  const [message,setMessage]=useState("");
  async function choose(plan:PlanKey){
    if(plan==="free"){window.location.assign("/account");return}
    if(plan==="enterprise"){window.location.assign("mailto:contact@vhf14.com?subject=VHF14%20Enterprise");return}
    const accepted=window.confirm("Continue after confirming you accept the Terms of Service and Privacy Policy? No charge will be made until the payment provider is connected.");
    if(!accepted)return;
    setMessage("Preparing secure checkout…");
    const r=await fetch("/api/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({plan,cycle,acceptedTerms:true})});
    const b=await r.json() as {message?:string;error?:string};
    setMessage(b.message||b.error||"Checkout unavailable");
  }
  return <>
    <div className="billingToggle" aria-label="Billing cycle"><button className={cycle==="monthly"?"active":""} onClick={()=>setCycle("monthly")}>Monthly</button><button className={cycle==="annual"?"active":""} onClick={()=>setCycle("annual")}>Annual · 2 months free</button></div>
    <div className="plans">{planOrder.map(key=>{const p=plans[key];const price=p[cycle];return <article className={key==="operations"?"featured":""} key={key}>{key==="operations"&&<span className="recommended">RECOMMENDED</span>}<h2>{p.name}</h2><p className="price">{price===null?"Custom":price===0?"€0":`€${price}`}<small>{typeof price==="number"&&price>0?(cycle==="monthly"?" / month":" / year"):""}</small></p><ul><li>{p.vessels===Infinity?"Custom":p.vessels} monitored vessels</li><li>{p.ports===Infinity?"Custom":p.ports} monitored ports</li><li>{p.queries===Infinity?"Custom":p.queries.toLocaleString()} queries / month</li><li>{p.history} history</li><li>{p.seats===Infinity?"Custom":p.seats} user seat{p.seats===1?"":"s"}</li>{key==="enterprise"&&<li>API access and SLA</li>}</ul><button onClick={()=>choose(key)}>{key==="enterprise"?"Contact sales":key==="free"?"Start free":"Choose plan"}</button></article>})}</div>
    <p className="checkoutMessage" role="status">{message}</p>
  </>
}
