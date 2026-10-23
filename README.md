# Domino's Analysis Console — Cloudflare Pages + D1

Todo en Cloudflare, gratis: la web (Pages), los votos (base de datos D1) y el precio de DPZ (función con caché).

## Pasos
1. **GitHub**: crea un repositorio y sube el contenido de esta carpeta (`index.html`, `functions/`, `lib/`).
2. **Cloudflare → Workers & Pages → Create → Pages → Connect to Git**: elige el repositorio.
   Framework: *None*. Build command: vacío. Build output directory: `/`. Despliega.
3. **Base de datos**: Cloudflare → *Storage & Databases → D1 → Create database* (nombre `votos`).
   Luego en tu proyecto de Pages: *Settings → Bindings → Add → D1 database*, nombre de variable **`DB`**, elige `votos`.
   (No hay que crear tablas: la función las crea sola la primera vez.)
4. **Contraseña del presentador**: *Settings → Variables and Secrets → Add*: **`ADMIN_PASSWORD`** = una frase larga (tipo *secret*).
   Opcional, precio en vivo: **`AV_KEY`** = clave gratuita de https://www.alphavantage.co/support/#api-key
   Después, *Deployments → Retry deployment* para que lo lea.
5. **Dominio propio**: pestaña *Custom domains → Set up a custom domain*.
   Si el dominio no está en Cloudflare, usa un subdominio (p. ej. `presenta.tudominio.com`) con el registro CNAME que te indica.
   Para el dominio raíz (sin subdominio), Cloudflare exige apuntar los *nameservers* del dominio a Cloudflare.

## Uso en clase
- Abajo a la derecha, **Presenter sign-in** → tu contraseña. Aparece **Class view: locked/open**.
- *Locked*: los demás solo ven la votación. *Open*: ven toda la consola, al instante (se actualiza cada ~4 s).
- Votación: **Open vote** (antes) → presentas → **Open vote** (después) → **Reveal**. *Reset* borra los votos.
- Los alumnos no necesitan cuenta: votan desde el móvil, un voto por navegador.

## Límites
- *Locked* oculta la interfaz, pero el contenido viaja en el mismo archivo: quien lea el código fuente puede verlo.
- Un voto por navegador; en otro navegador o modo privado se puede votar otra vez.
- Plan gratuito de Pages Functions: 100.000 peticiones/día. Cada pestaña abierta consulta cada 4 s: una clase de 40 personas durante una hora son unas 36.000. No dejes la página abierta todo el día.
- Alpha Vantage gratis: 25 consultas/día. La respuesta se guarda 30 min para que la clase comparta una sola.
