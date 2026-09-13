type BrandProps = {
  href?: string
}

export function Brand({ href = '#top' }: BrandProps) {
  return (
    <a className="brand" href={href}>
      <span className="brand-mark">EB</span>
      <span>
        <strong>
          Elimu<span>Bora</span>
        </strong>
        <small>PRE-FORM ONE PORTAL</small>
      </span>
    </a>
  )
}
