import type { ReactNode } from 'react'

export function SectionHeading({
  number,
  title,
  note,
  subtitle,
}: {
  number: string;
  title: string;
  note?: ReactNode;
  subtitle?: ReactNode;
}) {
  const body = note ?? subtitle

  return (
    <div className="section-head">
      <div className="section-label">{number} / {title}</div>
      {body && <p>{body}</p>}
    </div>
  )
}
