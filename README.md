# Nodepop

**Nodepop** es un servicio API que usa juntamente con una BBDD MongoDB. Proporciona la posibilidad de obtener información de los anuncios y de los usuarios. Los modelos de datos usados son *Anuncios* y *Usuarios*.

Modelo Anuncios:

	nombre: String,
	venta: Boolean,
	precio: Number,
	foto: String,
	tags: [String]

Modelo Usuarios:

	nombre: String,
	email: String,
	clave: String



### Instalación inicial BBDD
Una vez arrancado el servidor **MongoDB**, desde la raíz puede ejecutar el script *installDB* para borrar el contenido de la BBDD y hacer una carga inicial de *Anuncios* y *Usuarios*:
> ```npm run installDB```



### Arrancar la API
Puede usar el siguiente comando para poder probar las funcionalidades de la API:
> ```npm run dev```


### Consumir la API
Desde un navegador (o Postman, por ejemplo para los métodos que lo requieran), usando la url localhost:3000. Solo pueden consumir anuncios los usuarios registrados y autenticados.

### Registrar usuario

Para registrar un usuario se tiene que informar el nombre, email y clave de acceso; se verifica la no existencia del email en la BBDD para evitar el duplicado de usuarios y en el caso de que los formatos de los parámetros sean correctos, se guarda el usuario. A continuación se muestra un ejemplo de registro de usuario en el que se le pasan los parámetros (nombre, email y clave) por el body de la request. Se recoje, si está informado, el lenguaje del header:

> ```http://localhost:3000/apiv1/usuarios/register```

### Autenticar usuario
Solo pueden autenticarse los usuarios que previamente se hayan registrado. Se usa el email y clave (pasados por el body de la request) para verificar la existencia del usuario. En caso afirmativo se genera un token, se firma y se le envía al usuario. Dicho token tiene que enviarse en algunas de las peticiones a la API, para verificar que el usuario existe y está autenticado. Ejemplo autenticación:

> ```http://localhost:3000/apiv1/usuarios/authenticate```

### Obtener listado de anuncios

La lista de los anuncios solo la pueden recibir los usuarios autenticados, por lo que el parámetro token recibido de la autenticación, debe pasarse por la query-string. Los anuncios pueden filtrarse por nombre, si se trata de un artículo que está a la venta o se compra, por intervalo de precio o por tags (ver más adelante la obtenicón de los tags). A la vez se puede usar criterio de ordenación y la posibilidad de escoger algunos de los registros devueltos (desde que anuncio y cuantos anuncios se quieren obtener). Ejemplos:

La petición:

> http://localhost:3000/apiv1/anuncios?includeTotal=true&start=272&limit=3&venta=false

Genera la salida:

> { "success": false, "result": "Request accepted if authenticated." }


La petición:

> http://localhost:3000/apiv1/anuncios?includeTotal=true&start=2&limit=2&venta=false&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1c3RAZ21haWwuY29tIiwiaWF0IjoxNDk1MzYyMTAxLCJleHAiOjE0OTU0NDg1MDF9.JNu1BCcyQt0Xu4ePgQAsgQTAFShf4HuC77dSHtQqbFw

Genera la salida:

> {
  "success": true,
  "info": {
    "ocurrencias": 5,
    "list": [
      {
        "_id": "59216924d79e770cfee2350d",
        "__v": 0,
        "nombre": "Alcatel 1",
        "venta": false,
        "precio": 20,
        "foto": "images/anuncios/alcatel.png",
        "tags": [
          "lifestyle",
          "mobile"
        ]
      },
      {
        "_id": "59216924d79e770cfee2350e",
        "__v": 0,
        "nombre": "Alcatel",
        "venta": false,
        "precio": 500,
        "foto": "images/anuncios/alcatel.png",
        "tags": [
          "lifestyle",
          "work"
        ]
      }
    ]
  }
}

Las imágenes se obtienen accediendo usando la ruta relativa que nos devuelve la consulta de anuncios. Ejemplos:

> ```http://localhost:3000/images/anuncios/iphone.pn```

> ```ttp://localhost:3000/images/anuncios/bici.jpg```

### Obtener listado de tags
No es necesaria la autenticación para usar esta petición. Devuelve dos objetos, el *usedTags* que contiene los tags existentes en la BBDD y el *availableTags* que son los que se pueden usar. Ejemplo de uso:

La petición:

> http://localhost:3000/apiv1/tags

Genera la salida:

> {
  "success": true,
  "tags": {
    "usedTags": [
      "lifestyle",
      "mobile",
      "motor"
    ],
    "availableTags": [
      "lifestyle",
      "mobile",
      "motor",
      "work"
    ]
  }
}