import type { AnchorHTMLAttributes } from "react";

export function NativeLink({href,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string}){
  return <a href={href} {...props}/>;
}
