'use client'

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex-box-r">
      <Link href='/' className="flex-1">j3hn</Link>
      <Link href='/'>Home</Link>
      <div>Writing</div>
    </header>
  );
}
