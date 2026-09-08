import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return <Link className="brand" href="/" aria-label="Innomarks Technology Consulting home">
    <Image src="/brand/symbol.png" alt="" width={48} height={48} />
    <span><strong>INNOMARKS <span>TECH</span></strong><small>Technology Consulting</small></span>
  </Link>;
}
