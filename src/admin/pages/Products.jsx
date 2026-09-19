import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { move, remove, setState, useSiteState } from '../../store/siteStore'
import { Badge, Button, ConfirmDialog, EmptyState, IconButton, PageHeader, Toggle, useSave } from '../components/ui'
import Icon from '../components/Icon'
import { formatPrice } from '../format'

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
  const navigate = useNavigate()
  const save = useSave()
  const filter = matches[params.get('filter')] ? params.get('filter') : 'all'

  const q = query.trim().toLowerCase()
  const shown = products.filter((p) => matches[filter](p) && (!q || p.name.toLowerCase().includes(q)))
  const reorderable = filter === 'all' && !q

  const setVisible = (id, visible) =>
    save(setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, visible } : p)) })), visible ? 'Now showing on the home page' : 'Hidden from the home page')

  return (
    <>
      <PageHeader
        title="Products"
        description="The “Featured Cannabis Products” grid. Order here is the order on the page: 3, 3, then 4 per row."
        actions={
          <Button variant="primary" icon="plus" onClick={() => navigate('/admin/products/new')}>
            Add product
          </Button>
        }
      />

      <div className="adm-toolbar">
        <label className="adm-search">
          <Icon name="search" size={16} />
          <input type="search" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
        </label>
        <div className="adm-chips" role="tablist" aria-label="Filter products">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              className={filter === f.value ? 'is-active' : ''}
              onClick={() => setParams(f.value === 'all' ? {} : { filter: f.value })}
            >
              {f.label}
              <em>{products.filter(matches[f.value]).length}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        {shown.length ? (
          <table className="adm-table adm-table--products">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>On home page</th>
                <th className="actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p, i) => (
                <tr key={p.id} className={p.visible ? '' : 'is-muted'}>
                  <td>
                    <Link to={`/admin/products/${p.id}`} className="adm-product">
                      {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span className="adm-thumb-ph" />}
                      <span>
                        <strong>{p.name}</strong>
                        {p.rating != null && (
                          <small>
                            ★ {Number(p.rating).toFixed(2)}
                          </small>
                        )}
                      </span>
                    </Link>
                  </td>
                  <td data-label="Price">{formatPrice(p.price)}</td>
                  <td data-label="Status">
                    <div className="adm-badges">
                      {p.stock === 'outofstock' ? <Badge tone="danger">Out of stock</Badge> : <Badge tone="success">In stock</Badge>}
                      {(p.onSale || p.price?.type === 'sale') && <Badge tone="accent">Sale</Badge>}
                    </div>
                  </td>
                  <td data-label="On home page">
                    <Toggle checked={p.visible} onChange={(v) => setVisible(p.id, v)} label={<span className="sr-only">Show {p.name} on home page</span>} />
                  </td>
                  <td className="actions">
<div className="adm-rowactions">
                    {reorderable && (
                      <>
                        <IconButton icon="up" label="Move up" disabled={i === 0} onClick={() => save(move('products', p.id, -1))} />
                        <IconButton icon="down" label="Move down" disabled={i === shown.length - 1} onClick={() => save(move('products', p.id, 1))} />
                      </>
                    )}
                    <IconButton icon="edit" label={`Edit ${p.name}`} onClick={() => navigate(`/admin/products/${p.id}`)} />
                    <IconButton icon="trash" label={`Delete ${p.name}`} variant="danger" onClick={() => setToDelete(p)} />
</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No products match">Try a different search or filter.</EmptyState>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete product?"
        message={toDelete && `“${toDelete.name}” will be removed from the catalog and the home page. You can restore the original catalog from Settings.`}
        onConfirm={() => save(remove('products', toDelete.id), 'Product deleted')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
