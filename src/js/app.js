let pagina = 1;



document.addEventListener('DOMContentLoaded', function(){
	iniciarApp();
});

const iniciarApp = () =>{
	mostrarServicios();

	//Resalta el div actual segun el tab preionado
	mostrarSeccion();

	//ocultar o mostrar seccion
	cambiarSeccion();

	//paginacion sig y ant
	paginaSiguiente();
	paginaAnterior();

	//comprueba la pagina actual para ocultar o mostrar la paginacion
	botonesPaginador();

	//Mostrar resumen de cita y validacion
	mostrarResumen();

	//Guardar nombre de la cita
	nombreCita();

	//almacena la fecha de la cita en el bojeto xd
	fechaCita();

	//Deshabilita dias pasados
	desabilitarFechaAnterior();

	//Almacena la hr de cita
	horaCita();
}

function mostrarSeccion(){

	//eliminar clase seccion
	const seccionAnterior = document.querySelector('.mostrar-seccion');
	if(seccionAnterior){
		seccionAnterior.classList.remove('mostrar-seccion');
	}


	const seccionActual = document.querySelector(`#paso-${pagina}`);
	seccionActual.classList.add('mostrar-seccion');

	//elimnar la clase actual mostrar-seccion
	const tabAnterior = document.querySelector('.tabs .actual');
	if(tabAnterior){
		tabAnterior.classList.remove('actual');
	}
	

	//RESALTAR TAB
	const tab = document.querySelector(`[data-paso="${pagina}"]`);
	tab.classList.add('actual');
}

function cambiarSeccion(){
	const enlaces = document.querySelectorAll('.tabs button');
	enlaces.forEach(enlace => {
		enlace.addEventListener('click', e => {
			e.preventDefault();
			pagina = parseInt(e.target.dataset.paso);

			//Llamar la funcion mostar seccion
			mostrarSeccion();

			botonesPaginador();
		});
	});
}

async function mostrarServicios(){
	try{
		const resultado = await fetch('./servicios.json');
		const db = await resultado.json();

		const {servicios} = db;

		//Generar HTML
		servicios.forEach(servicio =>{
			const {id, nombre, precio} = servicio;

			//DOM SCRIPT
			//Generar nombre servicio
			const nombreServicio = document.createElement('P');
			nombreServicio.textContent = nombre;
			nombreServicio.classList.add('nombre-servicio');

			//Generar precio servicio
			const precioServicio = document.createElement('P');
			precioServicio.textContent = '$ ' + precio;
			precioServicio.classList.add('precio-servicio');

			//Generar div
			const servicioDiv = document.createElement('DIV');
			servicioDiv.classList.add('servicio');
			servicioDiv.dataset.idServicio = id;

			//Seleccionar div para cita
			servicioDiv.onclick = seleccionarServicio;

			//inyectar precio y service
			servicioDiv.appendChild(nombreServicio);
			servicioDiv.appendChild(precioServicio);

			//Inyecarle al HTML
			document.querySelector('#servicios').appendChild(servicioDiv);
		})

	}catch(error){
		console.log(error);
	}
}

function seleccionarServicio(e){
	let elemento;
	//Forzar click al div
	if(e.target.tagName === 'P'){
		elemento = e.target.parentElement;
	}else{
		elemento = e.target;
	}

	if(elemento.classList.contains('seleccionado')){
		elemento.classList.remove('seleccionado');

		const id = parseInt(elemento.dataset.idServicio);

		eliminarServicio(id);
	}else{
		elemento.classList.add('seleccionado');

		const servicioObj = {
			id: parseInt(elemento.dataset.idServicio),
			nombre: elemento.firstElementChild.textContent,
			precio: elemento.firstElementChild.nextElementSibling.textContent
		}
		// console.log(servicioObj)
		agregarServicio(servicioObj);
	}
}

function eliminarServicio(id){
	const {servicios} = cita;
	cita.servicios = servicios.filter(servicio => servicio.id !== id);

	console.log(cita)
}
function agregarServicio(servicioObj){
	const {servicios} = cita;

	cita.servicios = [...servicios, servicioObj];

	console.log(cita)
}

function paginaSiguiente(){
	const paginaSiguiente = document.querySelector('#siguiente');
	paginaSiguiente.addEventListener('click', () => {
		pagina++;
		console.log(pagina);
		botonesPaginador();
	});
}
function paginaAnterior(){
	const paginaAnterior = document.querySelector('#anterior');
	paginaAnterior.addEventListener('click', () => {
		pagina--;
		console.log(pagina);
		botonesPaginador();
	});
}
function botonesPaginador(){
	const paginaSiguiente = document.querySelector('#siguiente');
	const paginaAnterior = document.querySelector('#anterior');

	if (pagina === 1){
		paginaAnterior.classList.add('ocultar');
	}else if(pagina === 3){
		paginaSiguiente.classList.add('ocultar');
		paginaAnterior.classList.remove('ocultar');

		mostrarResumen();//Pagina 3 y carga el resumen de cita
	}else{
		paginaAnterior.classList.remove('ocultar');
		paginaSiguiente.classList.remove('ocultar');
	}

	mostrarSeccion(); //Cambia la seccion que se muestra por la de pagina
}

const cita = {
	nombre: '',
	fecha: '',
	hora: '',
	servicios: []
}
function mostrarResumen(){
	//dESTRUCTURING
	const {nombre, fecha, hora, servicios} = cita;

	//seleccionar div resumen
	const resumenDiv = document.querySelector('.contenido-resumen');

	//Limpia HTML previo
	while(resumenDiv.firstChild){
		resumenDiv.removeChild(resumenDiv.firstChild);
	}

	//VALIDACION DE OBJETO
	if(Object.values(cita).includes('')){
		const noServicios = document.createElement('P');
		noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

		noServicios.classList.add('invalidar-cita');

		//Agregar a resumen DIV
		resumenDiv.appendChild(noServicios);

		return;
	}

	const headingCita = document.createElement('H3');
	headingCita.textContent = 'Resumen de Cita';
	//mostrar Resumen
	const nombreCita = document.createElement('P');
	nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

	const fechaCita = document.createElement('P');
	fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

	const horaCita = document.createElement('P');
	horaCita.innerHTML = `<span>Hora: </span> ${hora}`;


	const serviciosCita = document.createElement('DIV');
	serviciosCita.classList.add('resumen-servicios');


	const headingServicios = document.createElement('H3');
	headingServicios.textContent = 'Resumen de Servicios';

	serviciosCita.appendChild(headingServicios);

	let cantidad = 0;

	//iterar sobre el arreglo de servicios
	servicios.forEach(servicio => {
		const {nombre, precio} = servicio;
		const contenedorServicio = document.createElement('DIV');
		contenedorServicio.classList.add('contenedor-servicio');

		const textoServicio = document.createElement('P');
		textoServicio.textContent = nombre;

		const precioServicio = document.createElement('P');
		precioServicio.textContent = precio;
		precioServicio.classList.add('precio');

		const totalServicio = precio.split('$');
		// console.log(parseInt(totalServicio[1].trim()));

		cantidad += parseInt(totalServicio[1].trim());
		
		//colocar texto y precio en Div
		contenedorServicio.appendChild(textoServicio);
		contenedorServicio.appendChild(precioServicio);

		serviciosCita.appendChild(contenedorServicio);
	});


	resumenDiv.appendChild(headingCita);
	resumenDiv.appendChild(nombreCita);
	resumenDiv.appendChild(fechaCita);
	resumenDiv.appendChild(horaCita);

	resumenDiv.appendChild(serviciosCita);

	const cantidadPagar = document.createElement('P');
	cantidadPagar.classList.add('total');
	cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$${cantidad}`;

	resumenDiv.appendChild(cantidadPagar);
}
function nombreCita(){
	const nombreInput = document.querySelector('#nombre');

	nombreInput.addEventListener('input', e => {
		const nombreTexto = e.target.value.trim();
		//validar nombre lleno
		if(nombreTexto === '' || nombreTexto.length < 3){
			mostrarAlerta('nombre invalido', 'error');
		}else{

			const alerta = document.querySelector('.alerta');
			if(alerta){
				alerta.remove();
			}
			cita.nombre = nombreTexto;

		}
	})
}

function mostrarAlerta(mensaje, tipo){
	//Si hay alerta previa no crear nd
	const alertaPrevia = document.querySelector('.alerta');
	if(alertaPrevia){
		return;
	}
	const alerta = document.createElement('DIV');
	alerta.textContent = mensaje;
	alerta.classList.add('alerta');
	if(tipo === 'error'){
		alerta.classList.add('error');
	}

	//insertar en el HTML
	const formulario = document.querySelector('.formulario');
	formulario.appendChild(alerta);

	//Eliminar alerte despues de 3 seg
	setTimeout(()=>{
		alerta.remove();
	},3000)
}
function fechaCita(){
	const fechaInput = document.querySelector('#fecha');
	fechaInput.addEventListener('input', e =>{
		const dia = new Date(e.target.value).getUTCDay();

		if([0, 6].includes(dia)){
			e.preventDefault;
			fechaInput.value = '';
			mostrarAlerta('Fines de semana no premitidos', 'error');
		}else{
			cita.fecha = fechaInput.value;
			console.log(cita)
		}
	})
}
//**********************ARREGLAR BUG DE MESES CON 2 CIFRAS
function desabilitarFechaAnterior(){
	const inputFecha = document.querySelector('#fecha');

	const fechaAhora = new Date();
	const year = fechaAhora.getFullYear();
	const mes = fechaAhora.getMonth() + 1;
	const dia = fechaAhora.getDate() + 1;


	//formato deseado año-mes-dia

	const fechaDeshabilitar = `${year}-0${mes}-${dia}`;


	inputFecha.min = fechaDeshabilitar;
}
function horaCita(){
	const inputHora = document.querySelector('#hora');
	inputHora.addEventListener('input', e => {


		const horaCita = e.target.value;
		const hora = horaCita.split(':');

		if(hora[0] < 10 || hora[0] > 18){
			mostrarAlerta('Hora no valida', 'error');
			setTimeout(()=>{
				inputHora.value = '';
			}, 3000)
		}else{
			cita.hora = horaCita;

			console.log(cita)
		}
	})
}