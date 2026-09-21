import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { move, remove, setState, useSiteState } from '../../store/siteStore'
import Icon from '../components/Icon'
import { ConfirmDialog, EmptyRow, PageHeader, RowAction, SearchBox, StatusBadge, Toggle, useSave } from '../components/ui'
import { formatPrice } from '../format'
import { productPath } from '../../lib/links'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'visible', label: 'On home page' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'sale', label: 'On sale' },
  { value: 'outofstock', label: 'Out of stock' },
]

const matches = {
  all: () => true,
  visible: (p) => p.visible,
  hidden: (p) => !p.visible,
  sale: (p) => p.onSale || p.price?.type === 'sale',
  outofstock: (p) => p.stock === 'outofstock',
}

export default function Products() {
  const products = useSiteState((s) => s.products)
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const save = useSave()
  const filter = matches[params.get('filter')] ? params.get('filter') : 'all'

  const q = query.trim().toLowerCase()
  const shown = products.filter((p) => matches[filter](p) && (!q || p.name.toLowerCase().includes(q)))
  const sortable = filter === 'all' && !q

  const setVisible = (id, visible) =>
    save(
      setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, visible } : p)) })),
      visible ? 'Product is now shown on the home page.' : 'Product hidden from the home page.',
    )

  return (
    <>
      <PageHeader
        title="Products"
        action={
          <Link to="/admin/products/new" className="page-title-action">
            Add New
          </Link>
        }
        description="These are the products in the “Featured Cannabis Products” section of the home page. They appear in the order below."
      />

      <ul className="subsubsub">
        {FILTERS.map((f, i) => (
          <li key={f.value}>
            <button type="button" className={`button-link${filter === f.value ? ' current' : ''}`} onClick={() => setParams(f.value === 'all' ? {} : { filter: f.value })}>
              {f.label} <span className="count">({products.filter(matches[f.value]).length})</span>
            </button>
            {i < FILTERS.length - 1 && ' | '}
          </li>
        ))}
      </ul>
      <SearchBox label="Search products" value={query} onChange={setQuery} />

      <table className="wp-list-table widefat fixed striped table-view-list products">
        <thead>
          <tr>
            <th scope="col" className="column-thumb">
              <span className="screen-reader-text">Photo</span>
            </th>
            <th scope="col" className="column-primary">
              Product
            </th>
            <th scope="col" className="column-price">
              Price
            </th>
            <th scope="col" className="column-stock">
              Stock
            </th>
            <th scope="col" className="column-visible">
              On home page
            </th>
            <th scope="col" className="column-order">
              Order
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && <EmptyRow colSpan={6}>No products found.</EmptyRow>}
          {shown.map((p, i) => (
            <tr key={p.id}>
              <td className="column-thumb">
                {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span className="cb-thumb-ph" />}
              </td>
              <td className="column-primary has-row-actions">
                <strong>
                  <Link to={`/admin/products/${p.id}`} className="row-title">
                    {p.name}
                  </Link>
                </strong>
                {!p.visible && <span className="post-state"> — Hidden</span>}
                <div className="row-actions">
                  <span className="edit">
                    <Link to={`/admin/products/${p.id}`}>Edit</Link>
                  </span>{' '}
                  |{' '}
                  <span className="view">
                    <a href={productPath(p)} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </span>{' '}
                  |{' '}
                  <RowAction danger onClick={() => setToDelete(p)}>
                    Delete
                  </RowAction>
                </div>
              </td>
              <td data-colname="Price">
                {formatPrice(p.price)}
                {(p.onSale || p.price?.type === 'sale') && <StatusBadge tone="accent">Sale</StatusBadge>}
              </td>
              <td data-colname="Stock">
                {p.stock === 'outofstock' ? <StatusBadge tone="danger">Out of stock</StatusBadge> : <StatusBadge tone="success">In stock</StatusBadge>}
              </td>
              <td data-colname="On home page">
                <Toggle checked={p.visible} onChange={(v) => setVisible(p.id, v)} label={`Show ${p.name} on the home page`} />
              </td>
              <td data-colname="Order" className="column-order">
                <button type="button" className="button button-small" disabled={!sortable || i === 0} aria-label="Move up" onClick={() => save(move('products', p.id, -1))}>
                  <Icon name="up" size={14} />
                </button>
                <button type="button" className="button button-small" disabled={!sortable || i === shown.length - 1} aria-label="Move down" onClick={() => save(move('products', p.id, 1))}>
                  <Icon name="down" size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="displaying-num">
        {shown.length} item{shown.length === 1 ? '' : 's'}
      </p>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete product"
        message={toDelete && `“${toDelete.name}” will be removed from the home page. You can restore the original products from Settings.`}
        onConfirm={() => save(remove('products', toDelete.id), 'Product deleted.')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
