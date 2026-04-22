import type { BreadcrumbItem } from '@/lib/types/product'

type Props = {
  brand: string
  category: string
  breadcrumb: BreadcrumbItem[]
}

export function ProductMeta({ brand, category, breadcrumb }: Props) {
  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol>
          {breadcrumb.map((item, index) => (
            <li key={item.href}>
              {index < breadcrumb.length - 1 ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <p>
        <span>Brand: </span>
        <span>{brand}</span>
      </p>

      <p>
        <span>Category: </span>
        <span>{category}</span>
      </p>
    </div>
  )
}
