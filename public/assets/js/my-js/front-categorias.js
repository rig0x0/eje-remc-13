//alert('Hola mundo del front de categorias');

//vamos a crear funciones para comunicarnos con el back - API - END POINT
//creamos la funcion
let idEliminarCategoria = 0;
let idActualizarCategoria = 0;

function getURL(){
    let URL = window.location.protocol + '//' +  window.location.hostname
    if(window.location.port)
        URL+=':'+window.location.port
    return URL
}

function muestraUnaCategoriaFront(id){
    let URL = getURL() + '/categorias/api/' + id; //params
    //alert(URL)
        $.ajax({
            method: 'GET',
        url: URL,
        data: {}, //body
        success: function( result ) {
            if(result.estado == 1){
                //debemos mostrar la categoria en la ventana
                const categoria = result.categoria;
                document.getElementById('descripcionCategoriaVisualizar').value=categoria.descripcion
                document.getElementById('observacionesCategoriaVisualizar').value=categoria.observaciones
            } else{
                //mostrar el mensaje de error
                alert(result.estado);
            }
        }
        });    
}

function agregarCategoria(){
    const descripcion = document.getElementById('descripcionCategoriaAgregar').value;
    const observaciones = document.getElementById('observacionesCategoriaAgregar').value;
    const URL = getURL() + '/categorias/api/'
    $.ajax({
        method: 'POST',
        url: URL, //end point
        data: {//body
          descripcion: descripcion,
          observaciones: observaciones
        },
        success: function( result ) {
          if(result.estado == 1){
            //agregar la categoria a la tabla
            //mandamos llamar a la categoria
            const categoria = result.categoria
            let tabla = $('#tabla-categorias').DataTable(); 

            let botones = generaBotones(categoria)
            let nuevoRenglon = tabla.row.add([categoria.descripcion,botones]).node();
            $(nuevoRenglon).attr('id', 'renglon_' +  categoria.id);
            $(nuevoRenglon).find('td').addClass('table-td');
            tabla.draw(false);
            //limpiamos los campos
            document.getElementById('descripcionCategoriaAgregar').value=' ';
            document.getElementById('observacionesCategoriaAgregar').value=' ';

            Swal.fire({
                position: 'top-end',    
                icon: 'success',
                title: 'Categoria guardada',
                showConfirmButton: false,
                timer: 1500
              })
              
          }else{
            alert(result.mensaje)
          }
        }
      });
}

function listaCategoriasFront(){
    let URL = getURL() + '/categorias/api'
    //vamos a usar la libreria JQUERY de java script
    $.ajax({
        method: 'GET',
        url: URL,
        data: {},
        success: function( result ) {
           let estado = result.estado
           let mensaje = result.mensaje
           if(estado == 1){
                let categorias = result.categorias;
                let tabla = $('#tabla-categorias').DataTable();
                
                categorias.forEach(categoria => {
                let botones = generaBotones(categoria)
                //tabla.row.add([categoria.descripcion,botones]).node().id = 'registro_'+categoria.id;
                let nuevoRenglon = tabla.row.add([categoria.descripcion,botones]).node();
                $(nuevoRenglon).attr('id', 'renglon_' +  categoria.id);
                $(nuevoRenglon).find('td').addClass('table-td');
                tabla.draw(false);

            });
           } else {
                alert(mensaje)
           }
        }
      });

}

function idEliminarCategoriaById(){
    $.ajax({
        method: 'DELETE',
        url: getURL() + '/categorias/api/' + idEliminarCategoria,
        data: {},
        success: function( result ) {
          if(result.estado == 1){
            //si se  eliminó de la BD
            //debemo seliminarlo de la tabla
            let tabla = $('#tabla-categorias').DataTable();
            tabla.row('#renglon_' + idEliminarCategoria).remove().draw();
            //mostrar el mensaje agradable
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Categoria eliminada',
                showConfirmButton: false,
                timer: 1500
              })
          }else{
            //mostrar el mensaje de que no se eliminó
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Categoria NO eliminada',
                showConfirmButton: false,
                timer: 1500
              })
          }
        }
      });
}

function generaBotones(categoria){
    let botones = '<div class="flex space-x-3 rtl:space-x-reverse">'
        botones += '<button onclick="muestraUnaCategoriaFront('+categoria.id+')" data-bs-toggle="modal" data-bs-target="#viewModal" class="action-btn" type="button">'
        botones += '  <iconify-icon icon="heroicons:eye"></iconify-icon>'
        botones += '</button>'

        botones += '<button onclick="identificaIdActualizar('+categoria.id+')" data-bs-toggle="modal" data-bs-target="#updateModal" class="action-btn" type="button">'
        botones += '  <iconify-icon icon="heroicons:pencil-square"></iconify-icon>'
        botones += '</button>'

        botones += '<button onclick="identificaIdEliminar('+categoria.id+')" data-bs-toggle="modal" data-bs-target="#deleteModal" class="action-btn" type="button">'
        botones += '  <iconify-icon icon="heroicons:trash"></iconify-icon>'
        botones += '</button>'

        botones += '</div>'
    return botones
}

function identificaIdEliminar(id){
    idEliminarCategoria = id;
    //alert(idEliminarCategoria);

}


function identificaIdActualizar(id){
    idActualizarCategoria = id;

    $.ajax({
      method: 'GET',
      url: getURL() + '/categorias/api/' + idActualizarCategoria,
      data: {},
      success: function( result ) {
        if(result.estado == 1){
          let categoria = result.categoria;
          document.getElementById('nombreCategoriaActualizar').value=categoria.descripcion
          document.getElementById('observacionesCategoriaActualizar').value=categoria.observaciones 
          //alert(categoria.descripcion)
        } else{
          alert(result.mensaje)
        }
      }
    });
}

function actualizarCategoriaById(){
  let descripcionCategoria = document.getElementById('nombreCategoriaActualizar').value;
  let observacionesCategoria = document.getElementById('observacionesCategoriaActualizar').value;
  
  $.ajax({
    method: 'PUT',
    url: getURL() + '/categorias/api/'+ idActualizarCategoria,
    data: {
      descripcion: descripcionCategoria,
      observaciones: observacionesCategoria
    },
    success: function( result ) {
      if(result.estado == 1){
        alert(result.mensaje)
        //debemos de acutalizar la tabla
        let tabla = $('#tabla-categorias').DataTable();
        let renglonTemporal = tabla.row('#renglon_' + idActualizarCategoria).data();

        renglonTemporal[0] = descripcionCategoria
        tabla.row('#renglon_' + idActualizarCategoria).data(renglonTemporal).draw();
      }else{
        alert(result.mensaje)
      }
    }
  });
}
//la mandamos a llamar
listaCategoriasFront();