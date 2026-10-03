import catalog from "../../../data/ports.json";

type PortRow=[string,string,string,string,string,string,number|null,number|null];
const rows=catalog.ports as PortRow[];
const countries=new Intl.DisplayNames(["en"],{type:"region"});
const normalise=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");

export async function GET(request:Request){
 const query=new URL(request.url).searchParams.get("q")?.trim()??"";if(query.length<2)return Response.json({ports:[]});
 const q=normalise(query),codeQuery=query.toUpperCase().replace(/[^A-Z0-9]/g,"");
 const matches=rows.flatMap(row=>{const[code,name,ascii,country,subdivision,timezone,latitude,longitude]=row;const n=normalise(name),a=normalise(ascii);let score=99;if(code===codeQuery)score=0;else if(code.startsWith(codeQuery))score=1;else if(n===q||a===q)score=2;else if(n.startsWith(q)||a.startsWith(q))score=3;else if(n.includes(q)||a.includes(q))score=4;else return[];return[{score,port:{code,name,country,countryName:countries.of(country)??country,subdivision,timezone,latitude,longitude,source:catalog.edition}}]});
 matches.sort((a,b)=>a.score-b.score||a.port.name.localeCompare(b.port.name));return Response.json({ports:matches.slice(0,12).map(x=>x.port),edition:catalog.edition},{headers:{"cache-control":"public, max-age=3600"}});
}
