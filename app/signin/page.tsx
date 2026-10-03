import { redirect } from "next/navigation";
import { getChatGPTUser, safeReturnPath } from "../chatgpt-auth";
import SignInForm from "./signin-form";

export const dynamic = "force-dynamic";

export default async function SignInPage({searchParams}:{searchParams:Promise<{return_to?:string}>}) {
  const {return_to="/account"}=await searchParams;
  const returnTo=safeReturnPath(return_to);
  const user=await getChatGPTUser();
  if(user)redirect(returnTo);
  return <main className="signinPage"><header className="simpleTop"><a className="brand" href="/"><b>14</b><span>VHF14<small>PORT OPERATIONS INTELLIGENCE</small></span></a><nav><a href="/">Operations</a></nav></header><section className="signinCard"><p className="kicker">SECURE ACCOUNT ACCESS</p><h1>Sign in to VHF14</h1><p>Access your professional profile, reports, watchlist and contribution activity through one secure account.</p><SignInForm returnTo={returnTo}/></section></main>;
}
