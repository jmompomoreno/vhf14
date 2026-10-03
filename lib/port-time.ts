export const portTimezones: Record<string, { name: string; timezone: string }> = {
  AEAUH:{name:"Abu Dhabi",timezone:"Asia/Dubai"}, AEJEA:{name:"Jebel Ali",timezone:"Asia/Dubai"},
  BEANR:{name:"Antwerp",timezone:"Europe/Brussels"}, BRSSZ:{name:"Santos",timezone:"America/Sao_Paulo"},
  CATOR:{name:"Toronto",timezone:"America/Toronto"}, CNSHA:{name:"Shanghai",timezone:"Asia/Shanghai"},
  CNNGB:{name:"Ningbo",timezone:"Asia/Shanghai"}, DEHAM:{name:"Hamburg",timezone:"Europe/Berlin"},
  EGPSD:{name:"Port Said",timezone:"Africa/Cairo"}, ESVLC:{name:"Valencia",timezone:"Europe/Madrid"},
  FRLEH:{name:"Le Havre",timezone:"Europe/Paris"}, GBFXT:{name:"Felixstowe",timezone:"Europe/London"},
  GRPIR:{name:"Piraeus",timezone:"Europe/Athens"}, HKHKG:{name:"Hong Kong",timezone:"Asia/Hong_Kong"},
  INNSA:{name:"Nhava Sheva",timezone:"Asia/Kolkata"}, ITGOA:{name:"Genoa",timezone:"Europe/Rome"},
  JPTYO:{name:"Tokyo",timezone:"Asia/Tokyo"}, KRPUS:{name:"Busan",timezone:"Asia/Seoul"},
  MAPTM:{name:"Tanger Med",timezone:"Africa/Casablanca"}, MTMAR:{name:"Marsaxlokk",timezone:"Europe/Malta"},
  MXZLO:{name:"Manzanillo",timezone:"America/Mexico_City"}, MYTPP:{name:"Tanjung Pelepas",timezone:"Asia/Kuala_Lumpur"},
  NLRTM:{name:"Rotterdam",timezone:"Europe/Amsterdam"}, PAONX:{name:"Colon",timezone:"America/Panama"},
  SGSIN:{name:"Singapore",timezone:"Asia/Singapore"}, TRMER:{name:"Mersin",timezone:"Europe/Istanbul"},
  USLAX:{name:"Los Angeles",timezone:"America/Los_Angeles"}, USNYC:{name:"New York",timezone:"America/New_York"},
  VNSGN:{name:"Ho Chi Minh City",timezone:"Asia/Ho_Chi_Minh"}, ZADUR:{name:"Durban",timezone:"Africa/Johannesburg"},
};

export function isValidTimezone(timezone:string){try{new Intl.DateTimeFormat("en",{timeZone:timezone}).format();return true}catch{return false}}

function partsAt(date:Date,timezone:string){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(date);return Object.fromEntries(parts.map(x=>[x.type,x.value]))}

export function localTimeToUtc(value:string,timezone:string){
  const match=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);if(!match||!isValidTimezone(timezone))return null;
  const target=Date.UTC(+match[1],+match[2]-1,+match[3],+match[4],+match[5]);let utc=target;
  for(let i=0;i<3;i++){const p=partsAt(new Date(utc),timezone);const shown=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);utc+=target-shown}
  const check=partsAt(new Date(utc),timezone);if(`${check.year}-${check.month}-${check.day}T${check.hour}:${check.minute}`!==value)return null;
  return new Date(utc).toISOString().slice(0,16);
}

export function utcToPortTime(value:string,timezone:string){if(!isValidTimezone(timezone))return value;const p=partsAt(new Date(`${value}Z`),timezone);return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`}

export function shortTime(value:string){return value.slice(11,16)}

export function timezoneOffsetLabel(valueUtc:string,timezone:string){
  if(!isValidTimezone(timezone))return "UTC";const date=new Date(`${valueUtc}Z`);const p=partsAt(date,timezone);const local=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);const minutes=Math.round((local-date.getTime())/60000);const sign=minutes>=0?"+":"−";const abs=Math.abs(minutes);return `UTC${sign}${Math.floor(abs/60)}${abs%60?`:30`:""}`;
}
