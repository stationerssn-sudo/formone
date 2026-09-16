import { useInstitutionName } from '../lib/useInstitutionName'

export function Footer({ useInstitution = true }: { useInstitution?: boolean }) {
  const name = useInstitutionName(useInstitution)
  return (
    <footer className="site-footer">
      <span>2025 {name}</span>
      <span>Maandalizi ya Kidato cha Kwanza</span>
    </footer>
  )
}
