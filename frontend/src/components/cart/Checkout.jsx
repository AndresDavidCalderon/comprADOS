import { useState, useContext, useEffect } from 'react'
import './Checkout.css'
import ApiContext from '../../context/ApiContext'
import { esMunicipioCercano } from '../../utils/municipios'

export default function Checkout({ items = [], onSuccess = () => {}, onCancel = () => {} }) {
  const [form, setForm] = useState({
    identificacion: '',
    telefono: '',
    nombre: '',
    departamento: '',
    municipio: '',
    carrera: '',
    calle: '',
    edificio_conjunto: '',
    apto_casa: '',
    observaciones: '',
  })

  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [metodoPago, setMetodoPago] = useState('')

  const requiredFields = ['identificacion', 'telefono', 'nombre', 'departamento', 'municipio', 'carrera', 'calle']

  const { apiUrl } = useContext(ApiContext);

  // Evaluar si el municipio ingresado es cercano
  const esCercano = esMunicipioCercano(form.municipio);

  // Efecto para auto-seleccionar "tarjeta" si el municipio es lejano
  useEffect(() => {
    if (form.municipio.trim() !== '') {
      if (!esCercano) {
        setMetodoPago('tarjeta');
      }
    }
  }, [form.municipio, esCercano]);

  const validate = () => {
    const e = {}
    requiredFields.forEach((f) => {
      if (!form[f] || form[f].trim() === '') {
        e[f] = 'Este campo es obligatorio'
      }
    })
    if (!esCercano && metodoPago !== 'tarjeta') {
      setMetodoPago('tarjeta');
    } else if (!metodoPago) {
      e.metodoPago = 'Selecciona un método de pago'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const buildDireccion = () => {
    const parts = [form.departamento, form.municipio, form.carrera, form.calle].filter(Boolean)
    let direccion = parts.join(', ')
    const extras = []
    if (form.edificio_conjunto) extras.push(`Edificio/Conjunto: ${form.edificio_conjunto}`)
    if (form.apto_casa) extras.push(`Apto/Casa: ${form.apto_casa}`)
    if (form.observaciones) extras.push(`Observaciones: ${form.observaciones}`)
    if (extras.length) direccion = `${direccion} (${extras.join('; ')})`
    return direccion
  }

  const handlePreview = (e) => {
    e.preventDefault()
    if (!validate()) return
    setPreview(buildDireccion())
  }

  const handleSubmit = async () => {
  if (!validate()) return
  setSubmitting(true)
  setServerError(null)

  const detalles = []
  if (form.edificio_conjunto) detalles.push(`Edificio/Conjunto: ${form.edificio_conjunto}`)
  if (form.apto_casa) detalles.push(`Apto/Casa: ${form.apto_casa}`)
  if (form.observaciones) detalles.push(`Observaciones: ${form.observaciones}`)

  const cliente = {
    identificacion: form.identificacion,
    telefono: form.telefono,
    nombre: form.nombre,
    departamento: form.departamento,
    municipio: form.municipio,
    carrera: form.carrera,
    calle: form.calle,
    detalles_extra: detalles.join('; ')
  }

  const items_payload = items.map((it) => ({ producto_id: it.id, cantidad: it.quantityOnCart }))
  const total = items.reduce((acc, item) => acc + item.price * item.quantityOnCart, 0)

  // ─── Flujo TARJETA → Stripe (Obligatorio en municipios lejanos u opcional en cercanos) ───
  if (metodoPago === 'tarjeta' || !esCercano) {
    try {
      const res = await fetch(`${apiUrl}/carrito/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, items: items_payload, total }),
      })
      if (!res.ok) throw new Error('Error al crear sesión de pago')
      const data = await res.json()
      // Redirigir al checkout de Stripe
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setServerError('No se pudo iniciar el pago con tarjeta. Intente más tarde.')
      setSubmitting(false)
    }
    return
  }

  // ─── Flujo EFECTIVO (Contra entrega en municipio cercano) ───
  const payload = {
    cliente,
    items: items_payload,
    total,
    metodo_pago: 'efectivo',
  }

  try {
    const res = await fetch(`${apiUrl}/carrito/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Error en el servidor')
    }
    const data = await res.json()
    setSuccess(data)
    setSubmitting(false)
    onSuccess()
  } catch (err) {
    console.error(err)
    setServerError(err.message || 'No se pudo crear el pedido. Intente más tarde.')
    setSubmitting(false)
  }
}

  if (success) {
    return (
      <div className="checkout-success">
        <h2>🎉 ¡Pedido registrado con éxito!</h2>
        <p><strong>Código de Pedido:</strong> #{success.pedido_id}</p>
        <p><strong>Dirección de entrega:</strong> {success.direccion_resumen}</p>
        
        {success.cliente && (
          <p><strong>Cliente:</strong> {success.cliente.nombre} ({success.cliente.telefono})</p>
        )}

        <div className="contra-entrega-info-box">
          <p>🛵 <strong>Información sobre tu entrega:</strong></p>
          <p>Una vez el domiciliario llegue a tu ubicación, podrás realizar el pago en <strong>efectivo</strong> o mediante <strong>código QR</strong>.</p>
        </div>

        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => { setSuccess(null); onSuccess() }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <h1>Finalizar compra</h1>
        <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </header>

      <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
        <div className="field-group">
          <label>Nombre completo *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>

        <div className="field-group">
          <label>Teléfono *</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} />
          {errors.telefono && <span className="error">{errors.telefono}</span>}
        </div>

        <div className="field-group">
          <label>Número de documento *</label>
          <input name="identificacion" value={form.identificacion} onChange={handleChange} />
          {errors.identificacion && <span className="error">{errors.identificacion}</span>}
        </div>

        <div className="field-group">
          <label>Departamento *</label>
          <input name="departamento" value={form.departamento} onChange={handleChange} />
          {errors.departamento && <span className="error">{errors.departamento}</span>}
        </div>

        <div className="field-group">
          <label>Municipio *</label>
          <input name="municipio" value={form.municipio} placeholder="Ej: Medellín, Bello, Itagüí, Envigado..." onChange={handleChange} />
          {errors.municipio && <span className="error">{errors.municipio}</span>}
          {form.municipio.trim() !== '' && (
            <span className={`municipio-badge ${esCercano ? 'cercano' : 'lejano'}`}>
              {esCercano ? '📍 Municipio cercano (Aplica Pago Contra entrega y Pago en línea)' : '📦 Municipio lejano (Solo Pago en línea)'}
            </span>
          )}
        </div>

        <div className="field-group">
          <label>Carrera *</label>
          <input name="carrera" value={form.carrera} onChange={handleChange} />
          {errors.carrera && <span className="error">{errors.carrera}</span>}
        </div>

        <div className="field-group">
          <label>Calle *</label>
          <input name="calle" value={form.calle} onChange={handleChange} />
          {errors.calle && <span className="error">{errors.calle}</span>}
        </div>

        <hr />
        <h3>Especificaciones (opcional)</h3>
        <div className="field-group">
          <label>Edificio / Conjunto</label>
          <input name="edificio_conjunto" value={form.edificio_conjunto} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Apto / Casa</label>
          <input name="apto_casa" value={form.apto_casa} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Observaciones</label>
          <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
        </div>

        <hr />
        <h3>Método de pago *</h3>

        {/* Escenario 2: Municipio lejano → Pago en línea obligatorio */}
        {form.municipio.trim() !== '' && !esCercano ? (
          <div className="far-municipality-notice">
            <p>🔒 <strong>Pago en línea obligatorio:</strong> Para entregas en municipios lejanos como <em>"{form.municipio}"</em>, la compra se procesa mediante pasarela de pago seguro (Tarjeta / Stripe).</p>
            <label className="payment-option selected" style={{ cursor: 'default' }}>
              <input type="radio" checked readOnly />
              <span className="payment-label">
                <strong>Tarjeta / Pago en línea</strong>
                <small>Redirección a pasarela de pago seguro</small>
              </span>
            </label>
          </div>
        ) : (
          /* Escenario 1: Municipio cercano o sin ingresar → Opción entre Efectivo o Tarjeta */
          <div className="payment-methods">
            <label className={`payment-option ${metodoPago === 'efectivo' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="metodoPago"
                value="efectivo"
                checked={metodoPago === 'efectivo'}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <span className="payment-label">
                <strong>Efectivo</strong>
                <small>Pago contra entrega</small>
              </span>
            </label>

            <label className={`payment-option ${metodoPago === 'tarjeta' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="metodoPago"
                value="tarjeta"
                checked={metodoPago === 'tarjeta'}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <span className="payment-label">
                <strong>Tarjeta</strong>
                <small>Pago en línea</small>
              </span>
            </label>
          </div>
        )}

        {/* Escenario 3: Mensaje informativo cuando selecciona contra entrega en municipio cercano */}
        {esCercano && metodoPago === 'efectivo' && (
          <div className="contra-entrega-info-box">
            <p>💡 <strong>Métodos de pago al entregar:</strong></p>
            <p>Una vez llegue el domiciliario, podrás pagar en <strong>efectivo</strong> o mediante <strong>código QR</strong>.</p>
          </div>
        )}

        {errors.metodoPago && <span className="error">{errors.metodoPago}</span>}

        {serverError && <div className="server-error">{serverError}</div>}

        <div className="checkout-actions">
          <button className="btn-secondary" onClick={handlePreview}>
            Revisar dirección
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Enviando...' : (metodoPago === 'tarjeta' || !esCercano ? 'Ir a la pasarela de pago' : 'Confirmar y crear pedido')}
          </button>
        </div>

        {preview && (
          <div className="address-preview">
            <h4>Dirección completa</h4>
            <p>{preview}</p>
            <p className="small">Confirma que la dirección es correcta antes de crear el pedido.</p>
          </div>
        )}
      </form>
    </div>
  )
}