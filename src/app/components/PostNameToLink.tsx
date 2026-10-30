'use client'

import { useState } from 'react';
import Link from 'next/link';

export function PostNameToLinkComponent({ name }: { name: string }) {
  const [isSelected, setIsSelected] = useState(false);
  
  return (
    <Link
      key={name}
      href={'/writing/' + name}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
    >
      {isSelected ? '[*] ' : '[ ] '}{name}
    </Link>
  );
}
