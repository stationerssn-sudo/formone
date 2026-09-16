import { useInstitutionName } from '../lib/useInstitutionName'

type BrandProps = {
  href?: string
  /** Kama `false`, inaonyesha jina la kawaida (ElimuBora) — inatumika kwenye landing page. */
  useInstitution?: boolean
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function Brand({ href = '#top', useInstitution = true }: BrandProps) {
  const name = useInstitutionName(useInstitution)
  return (
    <a className="brand" href={href}>
      <span className="brand-mark">{getInitials(name)}</span>
      <span>
        <strong>{name}</strong>
        <small>PRE-FORM ONE PORTAL</small>
      </span>
    </a>
  )
}
