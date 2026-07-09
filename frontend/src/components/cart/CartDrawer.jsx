import './CartDrawer.css'

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

const getItemImage = (item) => item.photos?.[0] || item.image || ''

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onCheckout,
}) {
  if (!isOpen) {
    return null
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <button
        type="button"
        className="cart-overlay"
        onClick={onClose}
        aria-label="Cerrar carrito"
      ></button>

      <aside className="cart-drawer">
        <header className="cart-header">
          <h2>Tu carrito</h2>
          <button type="button" onClick={onClose} className="close-cart" aria-label="Cerrar carrito">
            ×
          </button>
        </header>

        <div className="cart-list">
          {items.length === 0 ? (
            <p className="empty-cart">Tu carrito esta vacio.</p>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={getItemImage(item)} alt={item.name} className="cart-item-image" />
                <div className="cart-item-main">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">{formatCurrency(item.price)}</p>
                  <p className="cart-item-color">Color: {item.color}</p>
                </div>
                <div className="quantity-controls" aria-label={`Cantidad de ${item.name}`}>
                  <button type="button" onClick={() => onDecrement(item.id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onIncrement(item.id)}>
                    +
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <footer className="cart-footer">
          <p className="cart-total">Total: {formatCurrency(total)}</p>
          <button type="button" className="checkout-btn" disabled={items.length === 0} onClick={() => onCheckout && onCheckout()}>
            Continuar
          </button>
        </footer>
      </aside>
    </div>
  )
}
