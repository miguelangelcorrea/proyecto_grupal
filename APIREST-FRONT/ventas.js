//FUNCIONES PARA EJECUTAR EL PROYECTO

$(document).ready(
    function () {
        cargarDatos();
        listar();
    }
);

function listar(){
    console.log("ENTRANDO A LISTAR");
    $.ajax({
        url:'http://localhost:3999/api/ventas/filtrar',
        type: 'POST',
        data: {
            filtro: $("#txtFiltro").val(),
            filtroCategoria: $("#cboFiltroCategoria").val() 
        },
        success: function(respuesta){
            console.log(respuesta);
            var dataVentas = respuesta.ventas;
            if(dataVentas.length > 0){

                $('#pagination-container').pagination({
                    dataSource: dataVentas,
                    pageSize: 5,
                    callback: function (data,pagination){

                        var FilaVenta = '';

                        for(const i in data){
                            var varVenta = data [i];
                            FilaVenta += "<tr>";
                            FilaVenta += "<td>"+varVenta.codigoventa + "</td>";
                            FilaVenta += "<td>"+varVenta.usuario + "</td>";
                            FilaVenta += "<td>"+varVenta.descripcion + "</td>";
                            FilaVenta += "<td>"+varVenta.cantidad + "</td>";
                            FilaVenta += "<td>"+varVenta.importe + "</td>";
                            FilaVenta += "<td>"+varVenta.modoapagar + "</td>";
                            FilaVenta += "<td>"+varVenta.categoria[0].nomCategoria + "</td>";
                            // FilaVenta += "<td>"+varVenta.acciones + "</td>";
                            
                            FilaVenta +="<td>" + "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#modalForm' onclick='buscar("+ varVenta.codigoventa + ")'>EDITAR</button>"
                            + "</td>";
        
                            FilaVenta +="</tr>";
                        }
                       document.getElementById("dataVentas").innerHTML = FilaVenta;
                    }
                });
            }
        }
    });
}

function guardar(){
    console.log("ENTRANDO A GUARDAR");

    $.ajax({
        url:'http://localhost:3999/api/ventas/save',
        type:'POST',
        data: {
            codigoventa : $("#txtCodigoventa").val(),
            usuario : $("#txtUsuario").val(),
            descripcion : $("#txtDescripcion").val(),
            cantidad : $("#txtCantidad").val(),
            importe : $("#txtImporte").val(),
            modoapagar : $("#txtModoapagar").val(),
            idCategoria : $("#cboCategoria").val()
            // acciones : $("#txtAcciones").val()
        },
        success: function (respuesta){
            console.log(respuesta);
            listar();
        }
    });

}

function buscar(codigoventa){
    console.log('ENTRANDO A BUSCAR...');
    console.log(codigoventa);
    cargarDatos();
    $.ajax({
        url:'http://localhost:3999/api/ventas/' + codigoventa,
        type:'GET',
        success: function (respuesta) {
            console.log(respuesta);
            var varFuente = respuesta.venta;
            $('#txtCodigoventa').val(varFuente.codigoventa);
            $('#txtUsuario').val(varFuente.usuario);
            $('#txtDescripcion').val(varFuente.descripcion);
            $('#txtCantidad').val(varFuente.cantidad);
            $('#txtImporte').val(varFuente.importe);
            $('#txtModoapagar').val(varFuente.modoapagar);
            $('#cboCategoria').val(varFuente.idCategoria);
        }
    });
}

function limpiarForm(){
    $('#txtCodigoventa').val(0);
    $('#txtUsuario').val("");
    $('#txtDescripcion').val("");
    $('#txtCantidad').val("");
    $('#txtImporte').val("");
    $('#txtModoapagar').val("");
    cargarDatos();
}

function cargarDatos(){
        $.ajax({
            url: 'http://localhost:3999/api/categorias',
            type: 'GET',
            success: function (respuesta){
                console.log(respuesta);
                var datos = '';
                var dataCategorias = respuesta.categorias;
                if(dataCategorias.length > 0){
                    datos += "<option value='0'> --- ESCOGER CATEGORIA --- </option>";
                    for(const i in dataCategorias){
                        var datosCategoria = dataCategorias[i];
                        datos += "<option value='"+datosCategoria.idCategoria+"'>"+
                        datosCategoria.nomCategoria+"</option>";
                    }
                }

                document.getElementById("cboCategoria").innerHTML = datos;
                // PARA EL FILTRO CBOFILTROCATEGORIA
                document.getElementById("cboFiltroCategoria").innerHTML = datos;

            }
        });
}

function crearReporte(){
    console.log("ENTRANDO A CREAR REPORTE");
    $.ajax({
        url: 'http://localhost:3999/api/reporte/reporteVentas',
        type: 'GET',
        success: function (respuesta) {
            var dataVentas = respuesta.ventas;
            var xValues = [];
            var yValues = [];
            if(dataVentas.length > 0){
                for (const i in dataVentas) {
                    console.log(dataVentas[i].categoria[0]);
                    xValues.push(dataVentas[i].categoria[0]);
                    yValues.push(dataVentas[i].count);
                }
            }

            new Chart("cuerpo", {
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                        label: 'Reporte',
                        backgroundColor: 'rgba(112, 202, 247)',
                        borderColor: 'rgba(6,6,6)',
                        borderWidth: 1,
                        data: yValues
                    }]
                }
            });
        }
    
    });
}

function generarPDF(){
    console.log("GENERAR PDF");
    const doc = new jsPDF('p','pt');
    var tablaVenta = document.getElementById("tablaventas");
    var tablaJson = doc.autoTableHtmlToJson(tablaVenta);

     // Configuración para aumentar el tamaño de la tabla
     var options = {
        startY: doc.autoTableEndPosY() + 20, 
        tableWidth: 'wrap', // Cambia 'auto' por 'wrap' para permitir que la tabla se expanda 
        columnStyles: {
            1: { columnWidth: 65 }, // Ajusta el ancho de la columna 1 
            2: { columnWidth: 80 }, // Ajusta el ancho de la columna 2 
           
        }
    };

    doc.autoTable(tablaJson.columns, tablaJson.data, options);
    doc.save("Ventas.pdf");
}

function limpiarFiltros(){
    $("#txtFiltro").val("");
    $("#cboFiltroCategoria").val(0);
    listar();
}
