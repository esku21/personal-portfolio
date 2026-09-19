import type { ReactNode } from 'react'

export function SectionHeading({ number, title, note }: { number: string; title: string; note?: ReactNode }) {
  return <div className="section-head"><div className="section-label">{number} / {title}</div>{note && <p>{note}</p>}</div>
}
