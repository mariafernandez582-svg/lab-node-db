# Laboratorio: conectar MongoDB y listar personas

Estudiantes: María Camila Fernández Patiño

Fecha: Noviembre 5, 2026

Vas a completar una aplicación de Node.js que se conecta a MongoDB Atlas y muestra las personas en una tabla HTML. El proyecto ya tiene la estructura, los estilos y el motor de plantillas EJS. Tu trabajo es escribir el código marcado con `TODO`.

En cada paso haz esto: abre el archivo que se indica, escribe el código del recuadro, guarda y comprueba el resultado antes de seguir.

Al terminar, al abrir `http://localhost:3000` verás una tabla con nombre, apellido, edad y correo. En la consola deben aparecer estas dos líneas:

```text
Conectado a MongoDB. Base de datos: lab_personas
Servidor listo en http://localhost:3000
```

Busca la palabra `TODO` en el proyecto. Cada una indica el archivo y el paso de esta guía. Completa los pasos en orden.

Empieza por clonar la plantilla. Al terminar, sube el código a un repositorio de tu cuenta de GitHub. El repositorio de la plantilla solo sirve para descargar el laboratorio.

## Qué hace cada pieza

Cuando el navegador pide la página, el recorrido es este:

```mermaid
flowchart LR
  navegador[Navegador] --> servidor[server.js]
  servidor --> expressApp[src/index.js]
  expressApp --> ruta[personaRoutes.js]
  ruta --> controlador[personaController.js]
  controlador --> modelo[Modelo Persona]
  modelo --> mongo[(MongoDB: personas)]
  controlador --> vista[index.ejs]
  vista --> navegador
```

| Archivo | Para qué sirve | Qué completas |
| --- | --- | --- |
| `.env` | Guarda el puerto y la cadena de conexión | Paso 2 |
| `src/configurations/database.js` | Abre la conexión con MongoDB | Paso 4 |
| `server.js` | Arranca la aplicación y abre el puerto | Paso 5 |
| `src/models/persona.js` | Describe cómo es una persona | Paso 6 |
| `src/controllers/personaController.js` | Pide las personas y elige la vista | Paso 7 |
| `src/routes/personaRoutes.js` | Une la dirección `/` con el controlador | Paso 8 |
| `src/index.js` | Configura Express y monta las rutas | Paso 9 |
| `src/views/personas/index.ejs` | Dibuja la tabla | Paso 10 |

Estas herramientas ya están declaradas en `package.json`:

| Paquete | Función |
| --- | --- |
| `express` | Servidor web. Recibe la visita del navegador. |
| `mongoose` | Habla con MongoDB desde JavaScript. |
| `ejs` | Convierte la plantilla en HTML y mete los datos dentro. |
| `dotenv` | Lee el archivo `.env` y lo deja en `process.env`. |

Estos archivos ya funcionan. Léelos para entender el proyecto y déjalos como están:

- `public/css/estilos.css`: estilos de la tabla.
- En `src/index.js`, el motor EJS y la carpeta `public` ya están configurados. Ahí solo harás el paso 9.

## Clonar la plantilla

En la terminal, clona el repositorio de la plantilla y entra a la carpeta:

```powershell
git clone https://github.com/juliomartinezpascual/lab-node-db.git
cd lab-node-db
```

Todos los comandos siguientes se ejecutan dentro de esa carpeta. Ahí están el `README.md`, `server.js` y la carpeta `src`.

## Paso 1. Preparar Node.js e instalar

Necesitas Node.js 20.19 o superior. Mongoose 9 no arranca en versiones anteriores. Compruébalo en la terminal, dentro de `lab-node-db`:

```powershell
node -v
npm install
```

`npm install` descarga lo que dice `package.json` y lo guarda en `node_modules`.

Para arrancar el proyecto, en la carpeta del laboratorio puedes usar cualquiera de estos comandos:

```powershell
npm run dev
```

```powershell
node server
```

`npm run dev` reinicia el servidor cada vez que guardas un archivo. `node server` ejecuta `server.js` una vez. Después de cada cambio, detén ese proceso con Ctrl+C y vuelve a lanzarlo. `npm start` hace lo mismo que `node server`.

## Paso 2. Pegar la URL de MongoDB Atlas

La aplicación se conecta a MongoDB Atlas, que es MongoDB en internet. En `MONGODB_URI` va la URL de tu clúster. Esa URL empieza por `mongodb+srv://`. La dirección `mongodb://127.0.0.1:27017` pertenece a un MongoDB instalado en el computador y en este laboratorio no se usa.

Atlas llama a esa dirección URI o connection string. En este proyecto se guarda en la variable `MONGODB_URI`, dentro del archivo `.env`. Ahí va el usuario y la clave. El archivo `.gitignore` ya evita que `.env` se suba a un repositorio.

### 2.1. Conseguir la URL en Atlas

1. Entra a [MongoDB Atlas](https://www.mongodb.com/atlas) y crea un proyecto con un clúster gratuito.
2. Crea un usuario de base de datos. Anota el usuario y la contraseña.
3. En Network Access, autoriza tu IP. Durante la clase puedes permitir el acceso desde cualquier dirección.
4. Pulsa Connect, elige Drivers y después Node.js. Copia la URL.
5. Borra el texto `<password>`, con los signos `<` y `>`, y escribe tu contraseña en ese lugar.
6. Agrega el nombre de la base antes del signo `?`. El nombre de este laboratorio es `lab_personas`.

Atlas entrega una URL parecida a esta:

```text
mongodb+srv://usuario:clave@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Después del paso 6 debe quedar así, con `/lab_personas` antes del `?`:

```text
mongodb+srv://usuario:clave@cluster.xxxxx.mongodb.net/lab_personas?retryWrites=true&w=majority
```

Si la contraseña tiene `@`, `#`, `%` u otro símbolo, codifícalo. Por ejemplo, `@` se escribe `%40`.

### 2.2. Guardarla en `.env`

Abre el archivo `.env` que ya está en la carpeta del proyecto. Si no lo ves, ejecuta esto en la terminal:

```powershell
copy .env-example .env
```

Deja la línea así, en una sola línea, sin comillas y sin espacios alrededor del `=`:

```text
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@cluster.xxxxx.mongodb.net/lab_personas?retryWrites=true&w=majority
```

Sustituye `USUARIO`, `CLAVE` y el host por los datos de tu clúster. `PORT=3000` puede quedarse como está.

## Paso 3. Guardar personas de prueba

La aplicación de este laboratorio solo lee. Primero hay que guardar documentos en la colección `personas`, dentro de la base `lab_personas`.

Cada documento usa estos campos:

| Campo | Tipo | Ejemplo |
| --- | --- | --- |
| `nombre` | texto | `"Ana"` |
| `apellido` | texto | `"Gómez"` |
| `edad` | número, sin comillas | `21` |
| `correo` | texto | `"ana.gomez@correo.com"` |

En Atlas abre Database, luego Browse Collections. Crea la base `lab_personas` y la colección `personas`. Con Insert Document pega un documento cada vez:

```json
{ "nombre": "Ana", "apellido": "Gómez", "edad": 21, "correo": "ana.gomez@correo.com" }
```

```json
{ "nombre": "Luis", "apellido": "Pérez", "edad": 23, "correo": "luis.perez@correo.com" }
```

```json
{ "nombre": "María", "apellido": "Rojas", "edad": 19, "correo": "maria.rojas@correo.com" }
```

```json
{ "nombre": "Camilo", "apellido": "Herrera", "edad": 22, "correo": "camilo.herrera@correo.com" }
```

Si ya tienes `mongosh`, también puedes insertar los cuatro de una vez. Conéctate con la misma URL de Atlas y ejecuta:

```javascript
use lab_personas

db.personas.insertMany([
  { nombre: "Ana", apellido: "Gómez", edad: 21, correo: "ana.gomez@correo.com" },
  { nombre: "Luis", apellido: "Pérez", edad: 23, correo: "luis.perez@correo.com" },
  { nombre: "María", apellido: "Rojas", edad: 19, correo: "maria.rojas@correo.com" },
  { nombre: "Camilo", apellido: "Herrera", edad: 22, correo: "camilo.herrera@correo.com" }
])
```

MongoDB agrega el campo `_id` a cada documento. La tabla de este laboratorio muestra nombre, apellido, edad y correo.

La edad va sin comillas porque es un número. Escríbela así: `21`.

## Paso 4. Conectar Mongoose

Archivo: `src/configurations/database.js`

`server.js` ya llama a `conectarBaseDeDatos()` antes de abrir el puerto. Esa función lee `process.env.MONGODB_URI`. Falta pedirle a Mongoose que use esa URL.

Antes de editar el archivo, ejecuta `npm run dev` o `node server`. El programa se detiene y la primera línea es `No se pudo iniciar el servidor.`

- Si después dice `Falta MONGODB_URI`, vuelve al paso 2 y pega la URL de Atlas.
- Si después dice `TODO pendiente (paso 4)`, la URL ya está cargada. Esa parada es la que corresponde ahora.

Busca el comentario `TODO (paso 4)`. Borra el `throw` y escribe en ese mismo lugar:

```javascript
await mongoose.connect(uri);
console.log("Conectado a MongoDB. Base de datos:", mongoose.connection.name);
```

`mongoose.connect(uri)` abre la conexión y devuelve una promesa. `await` espera la respuesta de MongoDB Atlas. `mongoose.connection.name` debe imprimir `lab_personas`. Si imprime otro nombre, la URL de Atlas apunta a otra base.

Comprueba: ejecuta otra vez `npm run dev` o `node server`. El mensaje del paso 4 desaparece y aparece el del paso 5. Si en cambio ves un error de usuario, contraseña o IP, revísalo en la sección Errores frecuentes y quédate en este paso.

## Paso 5. Abrir el puerto

Archivo: `server.js`

La conexión ya se espera con `await conectarBaseDeDatos()`. Ahora Express tiene que escuchar visitas.

Busca el comentario `TODO (paso 5)`. Borra el `throw` y escribe en ese mismo lugar:

```javascript
app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
```

`PORT` sale de `.env`. Si esa variable no existe, el código usa `3000`.

Comprueba: la consola muestra la conexión y la dirección. Abre `http://localhost:3000`. Debes ver el mensaje **Servidor en marcha**. Express ya responde y la conexión con Atlas está hecha.

## Paso 6. Describir a la persona

Archivo: `src/models/persona.js`

Un modelo le dice a Mongoose qué campos tiene un documento y de qué tipo son. El nombre del modelo es `Persona`. La colección real se llama `personas`.

Borra por completo el `module.exports` provisional, el que contiene la función `find`. Si dejas los dos `module.exports`, el último reemplaza al modelo. En su lugar escribe el esquema:

```javascript
const personaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    edad: {
      type: Number,
      required: true,
      min: 0,
    },
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    collection: "personas",
  }
);

module.exports = mongoose.model("Persona", personaSchema);
```

Qué significa cada opción:

- `String` y `Number` son los tipos del campo.
- `required: true` marca el campo como obligatorio.
- `trim` quita espacios al inicio y al final del texto.
- `lowercase` pasa el correo a minúsculas cuando Mongoose lo guarda.
- `min: 0` rechaza una edad negativa.
- `collection: "personas"` usa exactamente la colección que creaste en el paso 3.
- `mongoose.model("Persona", personaSchema)` deja el modelo listo para consultar.

Los nombres del esquema y los nombres de los documentos tienen que ser los mismos. Si en la base el campo se llama `name` y en el esquema `nombre`, la celda sale vacía.

## Paso 7. Pedir las personas y renderizar la vista

Archivo: `src/controllers/personaController.js`

El controlador hace el trabajo de esta pantalla: consulta y responde. La función ya es `async` porque la consulta tarda.

Busca el comentario `TODO (paso 7)`. Borra el `throw` y escribe dentro de la función:

```javascript
const personas = await Persona.find().sort({ apellido: 1, nombre: 1 }).lean();

res.render("personas/index", {
  titulo: "Listado de personas",
  personas: personas,
});
```

Qué hace cada parte:

- `Persona.find()` trae todos los documentos de la colección. Sin un filtro, el resultado es el listado completo.
- `sort({ apellido: 1, nombre: 1 })` los ordena de la A a la Z. El `1` significa ascendente.
- `lean()` entrega objetos sencillos, que son los que la vista necesita.
- `await` espera el arreglo. Sin `await`, la vista recibiría una promesa y no podría recorrerla.
- `res.render("personas/index", ...)` busca `src/views/personas/index.ejs`.
- `titulo` y `personas` quedan disponibles dentro de la plantilla, con esos mismos nombres.

## Paso 8. Unir la dirección con el controlador

Archivo: `src/routes/personaRoutes.js`

La ruta dice qué función atiende cada URL. En este laboratorio la página principal es `GET /`.

Busca el comentario `TODO (paso 8)`. Debajo de `const router = express.Router();`, quita el comentario y deja esta línea:

```javascript
router.get("/", listarPersonas);
```

`listarPersonas` ya está importada al inicio del archivo.

## Paso 9. Montar el router

Archivo: `src/index.js`

Express todavía responde con el mensaje "Servidor en marcha" porque esa ruta está escrita en `app.get`. Hay que entregar `/` al router de personas antes de ese mensaje.

Busca el comentario `TODO (paso 9)`. Quita `//` de estas dos líneas y déjalas donde están, encima de `app.get`:

```javascript
const personaRoutes = require("./routes/personaRoutes");
app.use("/", personaRoutes);
```

El orden importa. Express usa la primera ruta que coincide. Si `app.use` queda después de `app.get`, sigues viendo el mensaje "Servidor en marcha".

Comprueba: recarga `http://localhost:3000`.

- Si los pasos 6, 7 y 8 ya están escritos, el mensaje desaparece. Aparece la tabla con los encabezados y una fila amarilla que pide completar la vista.
- Si sigues viendo **Servidor en marcha**, revisa el `router.get` del paso 8 y que las dos líneas de este paso estén antes de `app.get`.
- Si la consola muestra el TODO del paso 6 o del paso 7, vuelve a ese archivo.

## Paso 10. Pintar la tabla

Archivo: `src/views/personas/index.ejs`

EJS mezcla HTML y JavaScript. Estas son las marcas que vas a usar:

| Marca | Uso |
| --- | --- |
| `<% ... %>` | Ejecuta código y no lo imprime. Sirve para `if` y `forEach`. |
| `<%= ... %>` | Imprime el valor y lo escapa. Úsala para los datos de cada persona. |
| `<%# ... %>` | Es un comentario. El navegador no lo recibe. |

`<%=` convierte los caracteres especiales del texto. Así un dato guardado en la base se muestra como texto y no se interpreta como HTML.

En `<tbody>`, borra la fila amarilla y los comentarios `TODO (paso 10)`. En ese lugar escribe:

```ejs
<% if (personas.length === 0) { %>
  <tr class="aviso">
    <td colspan="4">No hay personas registradas en la colección.</td>
  </tr>
<% } %>

<% personas.forEach(function (persona) { %>
  <tr>
    <td><%= persona.nombre %></td>
    <td><%= persona.apellido %></td>
    <td><%= persona.edad %></td>
    <td><%= persona.correo %></td>
  </tr>
<% }) %>
```

Debajo de la tabla, borra el comentario del total y escribe:

```ejs
<p class="total">Total: <%= personas.length %></p>
```

`personas` es el arreglo que enviaste en el paso 7. `forEach` recorre cada elemento y EJS repite el `<tr>`. `persona.nombre` lee el campo del documento.

Comprueba: recarga el navegador. La tabla muestra las personas que guardaste en el paso 3, ordenadas por apellido. Si usaste los cuatro ejemplos, el orden es Ana Gómez, Camilo Herrera, Luis Pérez y María Rojas, y el total es 4.

## Cómo saber que terminaste

- La consola muestra la base `lab_personas` y la dirección del servidor.
- `http://localhost:3000` muestra la tabla, no el mensaje "Servidor en marcha".
- Cada fila sale de MongoDB. Si borras un documento en Atlas y recargas, la fila desaparece.
- `MONGODB_URI` en `.env` es la URL de MongoDB Atlas y empieza por `mongodb+srv://`.
- Los `throw` de los pasos 4, 5, 6 y 7 ya no están en el código.
- El código completado está en un repositorio de tu cuenta de GitHub.

## Entrega. Subir el código a tu repositorio

Cuando la tabla ya funcione, sube el laboratorio a un repositorio tuyo. La dirección `https://github.com/juliomartinezpascual/lab-node-db.git` es la plantilla: se clona al empezar y no recibe tu entrega.

1. Entra a GitHub con tu cuenta y crea un repositorio nuevo. Puedes llamarlo `lab-node-db`. Créalo vacío, sin README, sin `.gitignore` y sin licencia.
2. Copia la URL de ese repositorio. Tiene esta forma: `https://github.com/TU_USUARIO/lab-node-db.git`.
3. En la terminal, dentro de la carpeta del laboratorio, cambia el destino y sube tu código:

```powershell
git remote set-url origin https://github.com/TU_USUARIO/lab-node-db.git
git add .
git commit -m "Completa el laboratorio de listado de personas"
git push -u origin HEAD
```

Sustituye la URL por la de tu repositorio. GitHub puede pedir tu usuario y una contraseña de acceso, o abrir el inicio de sesión en el navegador.

4. Abre tu repositorio en el navegador. Deben verse `server.js`, la carpeta `src` y este `README.md` con tus cambios.
5. El archivo `.env` queda fuera del repositorio. Ahí está la clave de Atlas. `.gitignore` ya lo excluye. Antes del `git add`, ejecuta `git status`: `.env` no debe aparecer en la lista.

La URL de tu repositorio es la entrega del laboratorio.

## Errores frecuentes

| Lo que ves | Dónde mirar |
| --- | --- |
| `Cannot find module 'dotenv'` o `Cannot find module 'ejs'` | Ejecuta `npm install` en la carpeta del proyecto. |
| `Falta MONGODB_URI` | Crea `.env` a partir de `.env-example` y pega la URL de Atlas. |
| TODO pendiente del paso 4, 5, 6 o 7 | El mensaje dice el archivo. Completa ese paso y borra su `throw`. |
| `ECONNREFUSED 127.0.0.1:27017` | Pegaste la URL local. En `MONGODB_URI` va la URL de Atlas, la que empieza por `mongodb+srv://`. |
| `bad auth` o `Authentication failed` | Usuario o contraseña de Atlas. Revisa símbolos en la clave. |
| `IP that isn't whitelisted` | En Atlas, autoriza tu IP en Network Access. |
| Se queda esperando y luego falla la conexión | Revisa internet, el clúster y que la URL de Atlas sea una sola línea. |
| La consola conecta, pero el navegador no abre | Completa el `app.listen` del paso 5. |
| Sigues viendo **Servidor en marcha** | Falta `router.get` o el `app.use` quedó debajo de `app.get`. |
| `Failed to lookup view "personas/index"` | El `res.render` debe usar exactamente `"personas/index"`. |
| La tabla abre y dice que no hay personas | La URL debe incluir `/lab_personas` antes del `?` y la colección debe llamarse `personas`. |
| Las celdas salen vacías | El nombre del campo en la base y en el esquema es distinto. |
| `personas is not defined` | El controlador debe enviar la variable `personas` en `res.render`. |

## Qué ocurre al abrir el navegador

1. `server.js` carga `.env`, espera la conexión y deja Express escuchando.
2. El navegador hace `GET /`.
3. `src/index.js` entrega esa ruta al router.
4. `personaRoutes.js` llama a `listarPersonas`.
5. El controlador consulta el modelo `Persona`.
6. Mongoose lee la colección `personas` en MongoDB.
7. `res.render` llena `index.ejs` con el arreglo.
8. EJS genera el HTML de la tabla y Express lo envía al navegador.

## Para recordar

1. **¿Por qué la URL va en `.env`?** La contraseña queda fuera del código y no se comparte con la carpeta del proyecto.
2. **¿Qué pasa si el documento guarda `name` y el esquema define `nombre`?** La columna Nombre sale vacía. Los nombres del campo tienen que coincidir.
3. **¿Para qué sirve `await`?** `find()` tarda en responder. `await` espera el arreglo de personas antes de pintar la vista.
4. **¿Por qué se usa `<%=`?** Imprime el dato como texto. El contenido de la base se ve en la celda y el HTML de la página se mantiene.
