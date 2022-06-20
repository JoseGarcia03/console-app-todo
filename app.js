require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
    inquirerMenu,
     pausa,
     leerInput,
     listadoTareasBorrar,
     confirmar,
     mostrarListadoChecklist
    } = require('./helpers/inquirir');

const Tareas = require('./models/tareas');



const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ){ // cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        // Imprimir el menu
        opt = await inquirerMenu()

        switch (opt) {
            case '1': // Crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
                break;
            case '2': // Listar tareas
                tareas.listadoCompleto();
                break;
            case '3': // Listar tareas completas
                tareas.listarPendientesCompletadas();
                break;
            case '4': // Listar tareas pendientes
                tareas.listarPendientesCompletadas( false );
                break;
            case '5': // completado \ pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;
            case '6': // Borrar tarea
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ){
                    const ok = await confirmar( '¿Está seguro?' );
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log( "Tarea borrada" );
                    }
                }
                break;
        }

        guardarDB( tareas.listadoArr );

        await pausa(); 
    } while ( opt !== '0');


}


main();

