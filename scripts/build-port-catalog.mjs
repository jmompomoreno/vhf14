import fs from "node:fs";

const [locodeDir,geonamesFile,outputFile]=process.argv.slice(2);
if(!locodeDir||!geonamesFile||!outputFile)throw new Error("Usage: node build-port-catalog.mjs LOCODE_CSV_DIR GEONAMES_FILE OUTPUT_JSON");
const normalise=value=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const csv=line=>{const out=[];let value="",quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'&&quoted){value+='"';i++}else if(c==='"')quoted=!quoted;else if(c===","&&!quoted){out.push(value);value=""}else value+=c}out.push(value);return out};
const coord=value=>{const m=/^(\d{2})(\d{2})([NS]) (\d{3})(\d{2})([EW])$/.exec(value);if(!m)return null;const lat=(+m[1]+ +m[2]/60)*(m[3]==="S"?-1:1);const lon=(+m[4]+ +m[5]/60)*(m[6]==="W"?-1:1);return[lat,lon]};

const citiesByCountry=new Map(),citiesByName=new Map();
for(const line of fs.readFileSync(geonamesFile,"utf8").split("\n")){const x=line.split("\t");if(x.length<18||!x[17])continue;const city={name:x[1],ascii:x[2],lat:+x[4],lon:+x[5],country:x[8],timezone:x[17]};const list=citiesByCountry.get(city.country)??[];list.push(city);citiesByCountry.set(city.country,list);for(const name of [city.name,city.ascii,...x[3].split(",")]){const key=`${city.country}|${normalise(name)}`;if(!citiesByName.has(key))citiesByName.set(key,city)}}
const nearest=(country,lat,lon)=>{let best=null,distance=Infinity;for(const city of citiesByCountry.get(country)??[]){const dx=(city.lat-lat)*Math.cos(lat*Math.PI/180),dy=city.lon-lon,d=dx*dx+dy*dy;if(d<distance){best=city;distance=d}}return best};
const singleZones=new Map([...citiesByCountry].map(([country,cities])=>{const zones=[...new Set(cities.map(x=>x.timezone))];return[country,zones.length===1?zones[0]:""]}));
const ports=[];
for(const file of fs.readdirSync(locodeDir).filter(x=>/^UNLOCODE CodeListPart\d+\.csv$/.test(x)).sort())for(const line of fs.readFileSync(`${locodeDir}/${file}`,"utf8").split("\n")){const x=csv(line);if(x.length<11||!x[2]||x[6]?.[0]!=="1")continue;const country=x[1],code=`${country}${x[2]}`,name=x[3],ascii=x[4]||name,point=coord(x[10]??"");let city=citiesByName.get(`${country}|${normalise(name)}`)||citiesByName.get(`${country}|${normalise(ascii)}`);if(!city&&point)city=nearest(country,point[0],point[1]);const timezone=city?.timezone||singleZones.get(country)||"";ports.push([code,name,ascii,country,x[5]||"",timezone,point?.[0]??null,point?.[1]??null])}
ports.sort((a,b)=>a[0].localeCompare(b[0]));fs.writeFileSync(outputFile,JSON.stringify({edition:"UN/LOCODE 2025-1",timezoneSource:"GeoNames cities500 2026-09-15",ports}));
const unresolved=ports.filter(x=>!x[5]);console.log(JSON.stringify({ports:ports.length,withTimezone:ports.length-unresolved.length,unresolved:unresolved.length,sample:unresolved.slice(0,10)}));
