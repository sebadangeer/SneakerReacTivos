# Facture Sneakers

Tienda de zapatillas migrada a React y Vite. El escaparate, catálogo, detalle, carrito, acceso, registro, contacto, journal y paneles administrativos se renderizan desde la aplicación React de `src/`. La carpeta `pagina web obsoleta/` conserva la versión HTML anterior como referencia.

## Ejecutar

Requisitos: Node.js y npm.

```sh
npm install
npm run dev
```

Para generar la versión de producción:

```sh
npm run build
npm run preview
```

## Backend

Por defecto la app consulta `http://localhost:8080`. Para usar otra instancia, crea un archivo `.env.local` en la raíz:

```text
VITE_API_URL=http://localhost:8080
```

El frontend mantiene un catálogo local de respaldo para que la interfaz se pueda revisar sin el servicio. Las operaciones de cuenta, carrito, inventario y boletas requieren un backend compatible con la API original.

## Inventario

La única fuente de disponibilidad es `tallasDisponibles`, con el formato `{ "40": 3, "41": 1 }`. El catálogo indica cuántas tallas tienen unidades; el detalle solo permite seleccionar tallas disponibles y limita la cantidad al stock de esa talla. El carrito identifica cada línea por producto y talla. No se usa un campo de stock agregado.

## Rutas de la tienda

- `/` portada
- `/marcas` selección de colecciones
- `/catalogo/nike-urban`, `/catalogo/nike-sports` y `/catalogo/jordan`
- `/producto?id=ID`, detalle y selección de talla
- `/carrito` y `/checkout`
- `/login` y `/registro`
- `/nosotros`, `/contacto` y `/blogs`
- `/admin/productos` y `/admin/usuarios`

La sesión y el carrito se conservan en `localStorage`. La autorización real debe validarse también en el backend.