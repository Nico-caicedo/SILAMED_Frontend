
const routes = [
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/Administracion/AdminUsuarios', component: () => import('pages/Administracion/AdminUsuarios.vue') },
      { path: '/Administracion/Roles', component: () => import('pages/Administracion/Roles.vue') },
      { path: '/Administracion/cambioClave', component: () => import('pages/Administracion/CambioClave.vue') },
      { path: '/Administracion/Tercero', component: () => import('pages/Administracion/Tercero.vue') },
      { path: '/Administracion/ParametroInstrumentos', component: () => import('pages/Administracion/ParametroInstrumentos.vue') },
      { path: '/Administracion/ParametroMedidores', component: () => import('pages/Administracion/ParametroMedidores.vue') },
      { path: '/Procesos/OrdenEntrada', component: () => import('pages//Procesos/OrdenEntrada.vue') },
      { path: '/Procesos/ProgramacionOrdenes', component: () => import('pages//Procesos/ProgramacionOrdenes.vue') },
      { path: '/Procesos/CalibracionMedidores', component: () => import('pages//Procesos/CalibracionMedidores.vue') },
      { path: '/Procesos/VerificacionCalibracion', component: () => import('pages//Procesos/VerificacionCalibracion.vue') },
      { path: '/Procesos/OrdeTrabajo', component: () => import('pages//Procesos/OrdenTrabajo.vue') },
      { path: '/Procesos/EntregaMedidores', component: () => import('pages//Procesos/EntregaMedidores.vue') },
      { path: '/Procesos/GeneracionResultados', component: () => import('pages//Procesos/GeneracionResultados.vue') },
      { path: '/Procesos/AutorizarFirmas', component: () => import('pages//Procesos/AutorizacionFirmas.vue') },
      { path: '/Procesos/TrabajoNoConforme', component: () => import('pages//Procesos/TrabajoNoConforme.vue') },
      { path: '/Procesos/InformeMedidor', component: () => import('pages//Procesos/InformeMedidor.vue') },
      { path: '/Procesos/ImprimirInformes', component: () => import('pages//Procesos/ImprimirInformes.vue') },
      { path: '/Procesos/VerificacionInforme', component: () => import('pages//Procesos/VerificacionInforme.vue') },
      { path: '/Informes/AcumuladoMacro', component: () => import('src/pages/Informes/AcumuladoMacro.vue') },
      { path: '/Informes/ArchivosFacturacion', component: () => import('src/pages/Informes/ArchivosFacturacion.vue') },
      { path: '/Informes/ConsumoFijo', component: () => import('src/pages/Informes/ConsumoFijo.vue') },
      { path: '/Informes/ConsumosPeriodo', component: () => import('src/pages/Informes/ConsumosPeriodo.vue') },
      { path: '/Informes/ModificaLectura', component: () => import('src/pages/Informes/ModificaLectura.vue') },
      { path: '/Informes/ModificaPeriodo', component: () => import('src/pages/Informes/ModificaPeriodo.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/Inicio.vue')
  },
  {
    path: '/descarga/:id',
    component: () => import('src/pages/Prueba.vue'),
    children: [
      { path: '/des', component: () => import('src/pages/Prueba.vue') },
    ]
  }
]
  // Always leave this as last one,
  // but you can also remove it
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    })
  }
  export default routes
