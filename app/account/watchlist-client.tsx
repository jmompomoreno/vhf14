"use client";
import { useState } from "react";
type Item={id:number;kind:"vessel"|"port";reference:string;label:string};
export function WatchlistClient({initial}:{initial:Item[]}){
 const[items,setItems]=useState(initial);const[msg,setMsg]=useState("");
 async function add(form:FormData){setMsg("Saving…");const r=await fetch("/api/watchlist",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(form))});const b=await r.json() as {error?:string;item?:Item};if(!r.ok||!b.item){setMsg(b.error??"Unable to save");return}const item=b.item;setItems(x=>[...x,item]);setMsg("Added to monitoring.")}
 async function remove(id:number){await fetch(`/api/watchlist?id=${id}`,{method:"DELETE"});setItems(x=>x.filter(i=>i.id!==id))}
 return <section className="accountBlock"><div><p className="kicker">MONITORING SCOPE</p><h2>Vessels and ports</h2></div><form action={add} className="watchForm"><select name="kind"><option value="vessel">Vessel</option><option value="port">Port</option></select><input name="label" required placeholder="Name (e.g. MSC Aurora)"/><input name="reference" required placeholder="IMO or UN/LOCODE"/><button>Add</button></form><p className="formMessage">{msg}</p><div className="watchItems">{items.map(i=><div key={i.id}><span>{i.kind}</span><b>{i.label}</b><small>{i.reference}</small><button onClick={()=>remove(i.id)}>Remove</button></div>)}{!items.length&&<p>No monitored assets yet. Add the vessel or port you need first.</p>}</div></section>
}
