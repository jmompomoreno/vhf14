import { desc, eq, sql } from "drizzle-orm";
import { NativeLink as Link } from "../native-link";
import { getDb } from "../../db";
import { accounts, contributionCredits, reports, watchlist } from "../../db/schema";
import { requireChatGPTUser, chatGPTSignOutPath, isVHF14Admin } from "../chatgpt-auth";
import { WatchlistClient } from "./watchlist-client";
import { MyReportsClient } from "./my-reports-client";

export const dynamic="force-dynamic";

export default async function Account(){
 const user=await requireChatGPTUser("/account");const db=getDb();
 let[account]=await db.select().from(accounts).where(eq(accounts.userId,user.userId)).limit(1);
 if(!account)[account]=await db.insert(accounts).values({userId:user.userId,email:user.email,fullName:user.fullName}).returning();
 const items=await db.select().from(watchlist).where(eq(watchlist.userId,user.userId));
 const myReports=(await db.select().from(reports).where(eq(reports.reporterUserId,user.userId)).orderBy(desc(reports.createdAt)).limit(100)).map(report=>({
  ...report,
  eventType:report.eventType==="Pilot Away"?"Pilot Off":report.eventType,
  // Requested is reserved for future structured exchange and is not user-facing yet.
  timeBasis:report.timeBasis==="requested"?"estimated":report.timeBasis,
 }));
 const [creditRow]=await db.select({balance:sql<number>`coalesce(sum(${contributionCredits.amount}), 0)`}).from(contributionCredits).where(eq(contributionCredits.userId,user.userId));
 const credits=Number(creditRow?.balance??0);const vessels=items.filter(i=>i.kind==="vessel").length;const ports=items.filter(i=>i.kind==="port").length;
 return <main className="commercial"><header className="simpleTop"><Link className="brand" href="/"><b>14</b><span>VHF14<small>PORT OPERATIONS INTELLIGENCE</small></span></Link><nav><Link href="/">Operations</Link><Link href="/pricing">Free Beta</Link><Link href="/contact">Contact</Link>{isVHF14Admin(user)&&<Link className="adminAccess" href="/admin">Admin console</Link>}<a href={chatGPTSignOutPath("/")}>Sign out</a></nav></header><section className="accountHero"><div><p className="kicker">MY VHF14</p><h1>{user.displayName}</h1><p>{user.email}</p></div><div className="planBadge"><span>CURRENT ACCESS</span><b>Free Beta</b><Link href="/pricing#reciprocity">How credits work</Link></div></section><section className="usage"><article><span>VESSELS</span><b>{vessels} monitored</b></article><article><span>PORTS</span><b>{ports} monitored</b></article><article><span>ACCESS</span><b>Free</b></article><article><span>CONTRIBUTION CREDITS</span><b>{credits} earned</b></article></section><MyReportsClient initial={myReports}/><WatchlistClient initial={items}/><section className="accountBlock"><p className="kicker">CONTRIBUTION CREDITS</p><h2>Useful information earns greater access</h2><p>Each unique operational event accepted after verification earns 1 credit. During the Free Beta every available port call remains open, credits do not expire and nothing is deducted from your balance.</p><p>Only after the network reaches meaningful coverage will VHF14 test a free consultation allowance. Your own contributed information will remain accessible and earned credits will extend access to third-party port calls. The exact allowance will be based on real usage and announced in advance.</p><p><b>No credit is awarded for duplicates or unverified reports.</b> A good-faith report that cannot be verified receives no penalty.</p></section></main>
}
