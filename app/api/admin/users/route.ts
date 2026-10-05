import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../db";
import { accounts, adminAuditLog, adminNotes, professionalProfiles } from "../../../../db/schema";
import { requireVHF14Admin, sameOrigin } from "../../../chatgpt-auth";

const schema=z.discriminatedUnion("action",[
 z.object({action:z.enum(["suspend","reactivate"]),userId:z.string().min(1),reason:z.string().trim().min(3).max(500)}),
 z.object({action:z.literal("profile_decision"),userId:z.string().min(1),subject:z.enum(["professional","organisation"]),decision:z.enum(["verified","rejected"]),reason:z.string().trim().min(3).max(500)}),
 z.object({action:z.literal("add_note"),userId:z.string().min(1),note:z.string().trim().min(2).max(2000)})
]);

export async function PATCH(request:Request){
 if(!sameOrigin(request))return Response.json({error:"Invalid request origin"},{status:403});const admin=await requireVHF14Admin("/admin/users");const parsed=schema.safeParse(await request.json());if(!parsed.success)return Response.json({error:"Check the requested action and reason"},{status:400});const db=getDb();const data=parsed.data;const[account]=await db.select().from(accounts).where(eq(accounts.userId,data.userId)).limit(1);if(!account)return Response.json({error:"Account not found"},{status:404});const now=new Date().toISOString();
 if(data.action==="add_note"){await db.insert(adminNotes).values({userId:data.userId,note:data.note,createdBy:admin.userId});await db.insert(adminAuditLog).values({actorUserId:admin.userId,subjectType:"account",subjectId:data.userId,action:"note_added",reason:data.note,previousValue:"",newValue:"internal_note"});return Response.json({ok:true})}
 if(data.action==="suspend"||data.action==="reactivate"){const next=data.action==="suspend"?"suspended":"active";await db.update(accounts).set({status:next,statusReason:data.reason,statusChangedBy:admin.userId,statusChangedAt:now,updatedAt:now}).where(eq(accounts.userId,data.userId));await db.insert(adminAuditLog).values({actorUserId:admin.userId,subjectType:"account",subjectId:data.userId,action:data.action,reason:data.reason,previousValue:account.status,newValue:next});return Response.json({ok:true})}
 const[profile]=await db.select().from(professionalProfiles).where(eq(professionalProfiles.userId,data.userId)).limit(1);if(!profile)return Response.json({error:"Professional profile not found"},{status:404});if(data.subject==="organisation"&&profile.participationType!=="organisation")return Response.json({error:"This profile has no organisation representation"},{status:400});const previous=data.subject==="professional"?profile.status:profile.organisationStatus;if(data.subject==="professional")await db.update(professionalProfiles).set({status:data.decision,professionalReviewedBy:admin.userId,professionalReviewedAt:now,updatedAt:now}).where(eq(professionalProfiles.id,profile.id));else await db.update(professionalProfiles).set({organisationStatus:data.decision,organisationReviewedBy:admin.userId,organisationReviewedAt:now,updatedAt:now}).where(eq(professionalProfiles.id,profile.id));await db.insert(adminAuditLog).values({actorUserId:admin.userId,subjectType:data.subject==="professional"?"professional_profile":"organisation_representation",subjectId:data.userId,action:data.decision,reason:data.reason,previousValue:previous,newValue:data.decision});return Response.json({ok:true});
}
