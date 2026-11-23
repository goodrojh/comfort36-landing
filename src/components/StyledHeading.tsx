import { Fragment } from 'react'

type Segment = { text: string; className?: string }

export function StyledHeading({ segments, className = '' }: { segments: Segment[]; className?: string }) {
  return <span className={`inline-block ${className}`}>
    {segments.map((segment, index) => <Fragment key={index}>
      {index > 0 && ' '}<span className={segment.className}>{segment.text}</span>
    </Fragment>)}
  </span>
}
