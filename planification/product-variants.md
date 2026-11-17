# Variantes de producto

## Modelo conceptual

`products` representa la pieza vendida como familia: nombre, descripción, precio, categoría, materiales, etiquetas y visibilidad. `product_variants` representa cada opción comprable de esa pieza.

Cada variante guarda su tipo o color, cantidad disponible propia y galería de fotos. `description_override`, `price_override` y `materials_override` son opcionales: `NULL` significa que se usa el valor correspondiente del producto. Una lista vacía en `materials_override` sí es un override explícito sin materiales. El inventario nunca se hereda del producto.

`is_showcase` identifica la variante que representa al producto en el catálogo. La base permite como máximo una variante de escaparate por producto; la API y el editor aseguran que exista una al guardar. Los productos existentes se migraron a una variante inicial. El valor antiguo `size`, si existía, se conservó como `variant_type`; fotos e inventario se trasladaron sin cambios.

## Esquema

- `products`: `id`, `name`, `description`, `price`, `category`, `materials`, `tags`, `is_hidden`.
- `product_variants`: `id`, `product_id`, `variant_type`, `quantity`, `photos`, `description_override`, `price_override`, `materials_override`, `is_showcase`.
- Eliminar un producto elimina sus variantes mediante `ON DELETE CASCADE`.
- La migración aplicada y repetible está en `backend/app/database/product_variants_migration.sql`.
- `backend/app/database/product_quantity_override_removal_migration.sql` elimina la columna heredada `quantity_override` de instalaciones existentes.

## API

`GET /productos/` conserva los campos agregados que consumen clientes anteriores: `quantity` es la suma del inventario de sus variantes y `photos` son las fotos de la variante de escaparate. Los campos base `description`, `price` y `materials` siguen representando los valores predeterminados del producto. También devuelve `variants` y `showcase_variant`, que es el índice de la variante de escaparate dentro de esa lista. Cada variante incluye su `quantity` propio y los campos override; `NULL` significa que descripción, precio o materiales usan el valor base del producto. La respuesta no repite `description` en cada variante ni incluye `quantity_override`.

`POST /productos/` acepta `producto` con sus campos base y una lista `variants`. `PATCH /productos/{id}` reemplaza la lista de variantes enviada: conserva las variantes con `id`, crea las que no lo tienen y elimina las omitidas. En ambos casos se exige al menos una variante y una única variante de escaparate. Si se omite `variants` en creación, la API crea una variante `Unica` para clientes anteriores.

El carrito envía `variant_id` al checkout. Los flujos de pago en línea y contra entrega calculan el precio efectivo y validan/descuentan la cantidad de la variante seleccionada.

## Interfaz

La interfaz sigue en español. El editor presenta datos base del producto y permite administrar tipo/color, fotos, inventario, variante de escaparate y overrides por variante. El catálogo presenta la variante de escaparate; el detalle permite elegir otra variante y actualiza galería, descripción, precio, materiales e inventario. El carrito distingue las líneas por variante.
