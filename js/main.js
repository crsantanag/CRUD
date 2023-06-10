//Javascrip 

let arregloConciertos = []
let colorActual = ""
let colorBoton = ""
let enProcesoA = true
let enProcesoM = false
let enProcesoE = false
let identificadorDeLinea = 0

// Define la variable identificador y omite este paso si está definida,
// esta variable genera un identificador único para cada registro
if (localStorage.getItem("identificadorLS") === null) {
    var identificador = 0;
    localStorage.setItem("identificadorLS", JSON.stringify(identificador))
} else {
    var identificador= Number(JSON.parse(localStorage.getItem("identificadorLS")));
}

// Llama a leer el localStorage y despliega los datos en el DOM
leerLocalStorage()

// Queda esperando el click de LIMPIAR / AGREGAR
const botonLimpiar = document.getElementById("limpia")
const botonAgregar = document.getElementById("agrega")

botonAgregar.addEventListener ("click", function (eventoClick) {
  eventoClick.preventDefault()
  if (enProcesoA == true && enProcesoM == false && enProcesoE == false) {
    agregaDatos(eventoClick)
  } else if (enProcesoM === true) {
    modificaDatos(eventoClick)
  } else if (enProcesoE === true) {
    borraDatos (eventoClick)
  }
})

botonLimpiar.addEventListener("click", function (eventoClick) {
  eventoClick.preventDefault()
    const formulario = document.getElementById('formulario')
  formulario.reset()

  if (identificadorDeLinea != 0) {
    const fila = document.getElementById(identificadorDeLinea)
    // Regresa el color que tenía la fila
    fila.style.backgroundColor = colorActual  
    // Regresa el color que tenía la letra
    fila.style.color = 'black'
    // Restaura el resto de los valores y colores
    document.getElementById("limpia").style.backgroundColor = 'white'
    document.getElementById("limpia").style.color = 'black'
    document.getElementById("agrega").style.backgroundColor = colorBoton
    botonLimpiar.innerText = 'Limpia Formulario'
    botonAgregar.innerText = 'Agrega Concierto'
  }

  enProcesoA = true
  enProcesoM = false
  enProcesoE = false
})

// FUNCIONES

// Lee el arreglo desde el Local Storage. Si no existe, entonces lo define
// Muestra todos los elementos por fila
function leerLocalStorage() {
  if (JSON.parse(localStorage.getItem("arregloConciertosLS")) === null) {
    arregloConciertos=[]
  } else {
    arregloConciertos=JSON.parse(localStorage.getItem("arregloConciertosLS"))
    arregloConciertos.forEach((linea) => muestraLinea(linea))
  }
}

// Despliega todas los Conciertos y los despliega en una tabla
function muestraLinea(linea) {
  const tbody = document.getElementById('tbody')
  tbody.innerHTML += `
         <tr id="${linea.clave}">
            <td>${linea.concierto}</td>
            <td>${linea.grupo}</td>
            <td>${linea.medio}</td>
            <td>${linea.descripcion}</td>
            <td>
                <button class="modificar" onclick="modificaLinea(${linea.clave})">Modificar</button>
                <button class="eliminar" onclick="eliminaLinea(${linea.clave})">Eliminar</button>
            </td>
        </tr>
    `
}

function agregaDatos(eventoClick) {
  eventoClick.preventDefault()

  const linea = leerFormulario()
  const objetosLinea = Object.values(linea);
  const campos = objetosLinea.every((value) => value !== "")

  if (campos === true && linea.medio !== "Seleccione una opción") {
    linea.clave=nuevoNumero()
    arregloConciertos.push(linea)
    localStorage.setItem("arregloConciertosLS", JSON.stringify(arregloConciertos))
    muestraLinea(linea)

    enProcesoA = true
    const formulario = document.getElementById('formulario')
    formulario.reset()

  } else {
    alert ("Hay campos vacios, todos los campos son obligatorios")
  }
}

function leerFormulario() {
  const conciertoInput = document.getElementById("concierto")
  const grupoInput = document.getElementById("grupo")
  const medioInput = document.getElementById("medio")
  const descripcionInput = document.getElementById("descripcion")

  const linea = {
    clave: -1,
    concierto: conciertoInput.value,
    grupo: grupoInput.value,
    medio: medioInput.value,
    descripcion: descripcionInput.value
  }
    return linea
}

// Esta función siempre entrega un número ascendente respecto del anterior, 
// y es único e identifica cada registro (se almacena en localStorage)
function nuevoNumero () {
  identificador=Number(JSON.parse(localStorage.getItem("identificadorLS")));
  identificador=identificador+1;
  localStorage.setItem("identificadorLS",JSON.stringify(identificador))
  return identificador
}

function modificaLinea(identificador) {
  if (enProcesoM === true || enProcesoE === true) {
    alert ("En proceso de MODIFICACION / ELIMINACION, finalice ese proceso primero")
  }
  else {
    enProcesoM = true
    botonAgregar.innerText = "Modifica Concierto"
    identificadorDeLinea = identificador

  // Almacena el color actual del boton "Agrega / Modifica"
    colorBoton = document.getElementById("agrega").style.backgroundColor
  // Almacena el color actual de la fila que se debe modificar
    colorActual = document.getElementById(identificador).style.backgroundColor
  // Modifica los colores cuando de edita a fondo verde y letra blanca
    document.getElementById("limpia").style.backgroundColor = 'black'
    document.getElementById("limpia").style.color = 'white'
    botonLimpiar.innerText = 'Anula Modificación'
    document.getElementById("agrega").style.backgroundColor = 'green'

    document.getElementById(identificador).style.backgroundColor = 'green'
    document.getElementById(identificador).style.color= 'white'

    const linea = arregloConciertos.find((linea) => linea.clave === identificador)

    const conciertoInput = document.getElementById("concierto")
    const grupoInput = document.getElementById("grupo")
    const medioInput = document.getElementById("medio")
    const descripcionInput = document.getElementById("descripcion")

    conciertoInput.value = linea.concierto
    grupoInput.value = linea.grupo
    medioInput.value = linea.medio
    descripcionInput.value = linea.descripcion
  }
}

// Actualiza la linea de datos después de la modificación
function modificaDatos(eventoClick) {
  eventoClick.preventDefault()

  const linea = leerFormulario()
  linea.clave = identificadorDeLinea

// Modifica el arreglo
  const indice = arregloConciertos.findIndex((tarea) => tarea.clave === identificadorDeLinea)
  arregloConciertos.splice(indice, 1, linea)
// Modifica el LS
  localStorage.setItem('arregloConciertosLS', JSON.stringify(arregloConciertos))
// Modifica la línea de la tabla
  const fila = document.getElementById(identificadorDeLinea)

  fila.innerHTML = `
    <td>${linea.concierto}</td>
    <td>${linea.grupo}</td>
    <td>${linea.medio}</td>
    <td>${linea.descripcion}</td>
    <td>
        <button class="modificar" onclick="modificaLinea(${linea.clave})">Modificar</button>
        <button class="eliminar" onclick="eliminaLinea(${linea.clave})">Eliminar</button>
    </td>
  `
  // Regresa el color que tenía la fila
  fila.style.backgroundColor = colorActual  
  // Regresa el color que tenía la letra
  fila.style.color = 'black'

  identificadorDeLinea = 0
  
  document.getElementById("limpia").style.backgroundColor = 'white'
  document.getElementById("limpia").style.color = 'black'
  document.getElementById("agrega").style.backgroundColor = colorBoton
  botonLimpiar.innerText = 'Limpia Formulario'
  botonAgregar.innerText = 'Agrega Concierto'

  enProcesoM = false
  const formulario = document.getElementById('formulario')
  formulario.reset()
}



function eliminaLinea (identificador) {
if (enProcesoM === true || enProcesoE === true) {
  alert ("En proceso de MODIFICACION / ELIMINACION, finalice ese proceso primero")
}
else {
  enProcesoE = true
  botonAgregar.innerText = "Elimina Concierto"
  identificadorDeLinea = identificador

// Almacena el color actual del boton "Agrega / Modifica / Elimina"
  colorBoton = document.getElementById("agrega").style.backgroundColor
// Almacena el color actual de la fila que se debe modificar
  colorActual = document.getElementById(identificador).style.backgroundColor
// Modifica los colores cuando de elimina a fondo verde y letra blanca
  document.getElementById("limpia").style.backgroundColor = 'black'
  document.getElementById("limpia").style.color = 'white'
  botonLimpiar.innerText = 'Anula Eliminación'
  document.getElementById("agrega").style.backgroundColor = 'red'

  document.getElementById(identificador).style.backgroundColor = 'red'
  document.getElementById(identificador).style.color= 'white'

  const linea = arregloConciertos.find((linea) => linea.clave === identificador)

  const conciertoInput = document.getElementById("concierto")
  const grupoInput = document.getElementById("grupo")
  const medioInput = document.getElementById("medio")
  const descripcionInput = document.getElementById("descripcion")

  conciertoInput.value = linea.concierto
  grupoInput.value = linea.grupo
  medioInput.value = linea.medio
  descripcionInput.value = linea.descripcion
  }
}


function borraDatos (eventoClick) {
  eventoClick.preventDefault()

  const linea = arregloConciertos.find((linea) => linea.clave === identificadorDeLinea)
  let nombre = linea.concierto 

  // Elimino la fila en el DOM
    const fila = document.getElementById(identificadorDeLinea)
    fila.remove()
  // Elimino la fila desde el arreglo arregloConciertos
    arregloConciertos=arregloConciertos.filter((fila) => fila.clave !== identificadorDeLinea)
  // Almaceno el arreglo arregloConciertos en el LS
  localStorage.setItem('arregloConciertosLS', JSON.stringify(arregloConciertos))

  document.getElementById("limpia").style.backgroundColor = 'white'
  document.getElementById("limpia").style.color = 'black'
  document.getElementById("agrega").style.backgroundColor = colorBoton
  botonLimpiar.innerText = 'Limpia Formulario'
  botonAgregar.innerText = 'Agrega Concierto'

  enProcesoE = false
  const formulario = document.getElementById('formulario')
  formulario.reset()

  }


