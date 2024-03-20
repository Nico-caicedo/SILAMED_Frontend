<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="report_problem" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print"  />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title>
          Trabajo no Conforme
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formVerificacionCalibracionMedidores">
        <div class="q-pa-md">
          <q-stepper
            v-model="step"
            vertical
            color="primary"
            animated
            >
            <q-step
                :name="1"
                title="1. Seleccione medidor para realizar trabajo no conforme"
                icon="search"
                :done="step > 1"
            >
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="consulta"
                  map-options emit-value option-value="Id"
                  option-label="Nombre"
                  :options="lisTipoConsulta"
                  label="Tipo de Consulta"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" size="lg" />
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" stack-label label="Ingrese Datos" 
                  v-model="ordenEntradaD.Lectura_ordenentradad"
                  outlined />
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                    :data="LisCalibraciones"
                    :columns="columnsCalibraciones"
                    :visible-columns="vcCalibraciones">
                  <template v-slot:body-cell-Seleccionar_calibracion="props">
                  <q-td key="Seleccionar_calibracion" :props="props" auto-width>
                    <q-btn icon="verified" color="blue" align="center" outline @click="CargarCalibracion(props.row)"/>
                  </q-td>
                  </template>
                  <template v-slot:top="props">
                    <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisCalibraciones, columnsCalibraciones)"
                    />
                    <q-space />
                    <q-btn
                    flat round dense
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                    class="q-ml-md"
                    />
                    <q-space />
                    <q-select
                    v-model="vcCalibraciones"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsCalibraciones"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                    />
                </template>
                </q-table>
                </div>
                <div class="row justify-center q-pa-sm">
                <q-btn label="Consultar" icon="search" outline align="center" unelevated @click="consultarFiltroCalibracion()">
                </q-btn>
            </div>
            </q-step>

            <q-step
                :name="2"
                title="2. Verificar Pruebas por Caudal"
                icon="settings"
                :done="step > 2"
            >
                
                Seleccione cada prueba para realizar la verificación por cada repetición
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="LisCalibracionPrueba"
                :columns="columnsCalibracionPruebas"
                :visible-columns="vcCalibracionPruebas">
                <template v-slot:body-cell-Seleccionar_calibracionprueba="props">
                  <q-td key="Seleccionar_calibracionprueba" :props="props" auto-width>
                    <q-btn icon="verified" color="blue" align="center" outline @click="CargarCargarCalibracionPrueba(props.row)"/>
                  </q-td>
                </template>
                <template v-slot:top="props">
                    <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisCalibracionPrueba, columnsCalibracionPruebas)"
                    />
                    <q-space />
                    <q-btn
                    flat round dense
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                    class="q-ml-md"
                    />
                    <q-space />
                    <q-select
                    v-model="vcCalibracionPruebas"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsCalibracionPruebas"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                    />
                </template>
                </q-table>
                <q-stepper-navigation>
                <q-btn flat @click="step = 1" color="primary" label="Volver" class="q-ml-sm" />
                </q-stepper-navigation>
            </q-step>

            <q-step
                :name="3"
                title="3. Verificar repeticiones por prueba"
                icon="update"
                :done="step > 3"
            >
              Ingrese condiciones ambientales iniciales para dar inicio a la prueba 
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="LisRepeticionCP"
                :columns="columnsRepeticionesCP"
                :visible-columns="vcRepeticionesCP"
                row-key="Id_repcp"
                selection="multiple"
                :selected.sync="selected">
                <template v-slot:header-selection="scope">
                  <q-toggle v-model="scope.selected" />
                </template>
                <template v-slot:body-selection="scope">
                  <q-toggle v-model="scope.selected" dense color="green" />
                </template>
                <template v-slot:top="props">
                    <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisRepeticionCP, columnsRepeticionesCP)"
                    />
                    <q-space />
                    <q-btn
                    flat round dense
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                    class="q-ml-md"
                    />
                    <q-space />
                    <q-select
                    v-model="vcRepeticionesCP"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsRepeticionesCP"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                    />
                </template>
                </q-table>
            <q-stepper-navigation>
                <q-btn color="primary" @click="VerificarRepeticion()" label="Siguiente" />
                <q-btn flat @click="step = 2" color="primary" label="Volver" class="q-ml-sm" />
            </q-stepper-navigation>
            </q-step>
            <q-step
                :name="4"
                title="4. Fin de la Verificación"
                icon="emoji_events"
                :done="step > 4"
            >
                Ingrese una observación para la finalización de la verificación de la calibración
                <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observación de la Calibración" v-model="Calibracion.Observacion_calibracion" type="textarea" outlined  />
                </div>
                <q-stepper-navigation>
                <q-btn color="primary" label="Finalizar Verificación" />
                <q-btn flat @click="step = 3" color="primary" label="Volver" class="q-ml-sm" />
                </q-stepper-navigation>
            </q-step>
            </q-stepper>
          <div class="row q-col-gutter-sm">
            <div class="q-pa-md q-gutter-md">
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
            </div>            
          </div>
        </div>
      </q-form>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteFiltro" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta LisProgramaciones</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
                <q-toggle class="col-xs-12 col-sm-12 col-md-8 q-field--with-bottom q-pt-sm"
                  v-model="todasFechas"
                  checked-icon="check"
                  color="green"
                  label="Consultar todas las fechas"
                  unchecked-icon="clear"
                />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" readonly stack-label label="Registros Encontrados" v-model="lisMedidores.length" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                  stack-label label="Fecha Inicio" 
                  :readonly="todasFechas === true"
                  v-model="ProgramacionOrden.FechaIni"
                  type="date" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                  stack-label label="Fecha Fin" 
                  :readonly="todasFechas === true"
                  v-model="ProgramacionOrden.FechaFin"
                  type="date" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                    :data="LisProgramaciones"
                    :columns="columnsProgramaciones"
                    :visible-columns="vcProgramaciones">
                    <template v-slot:header-selection="scope">
                        <q-toggle v-model="scope.selected" />
                    </template>
                    <template v-slot:top="props">
                    <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisProgramaciones, columnsProgramaciones)"
                    />
                    <q-space />
                    <q-btn
                    flat round dense
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                    class="q-ml-md"
                    />
                    <q-space />
                    <q-select
                    v-model="vcProgramaciones"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsProgramaciones"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                    />
                </template>
                </q-table>                
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Consultar" icon="search" outline align="center" unelevated @click="consultarFiltroProgramacion()">
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
  </q-layout>
</template>
<script>
import { api } from 'boot/axios'
import utils from '../../commons/utils.js'
import { date } from 'quasar'
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== undefined
    ? formatFn(val)
    : val

  formatted = formatted === undefined || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  name: 'programacionOrden',
  data () {
    return {
      model: null,
      consulta: 1,
      Repeticiones: 1,
      RepeticionesFaltantes: 0,
      Calibracion: { Id_calibracion: -1, Id_programacionorden: -1, Fechaini_calibracion: '', Fechafin_calibracion: '', Fecha_calibracion: '', Observacion_calibracion: '', Login_calibracion: '', Estado_calibracion: 1, Programacionorden: {}, LisCalibracionPrueba: [], Medidores_programacionorden: 0, Nombre_supervisor: '', Nombre_encargado: '' },
      CalibracionPrueba: { Id_calprueba: -1, Id_calibracion: -1, Id_tipoprueba: '', Tempambini_calprueba: 0, Tempambfin_calprueba: 0, Humedadrelini_calprueba: 0, Humedadrelfin_calprueba: 0, Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] },
      RepeticioCP: { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Npuestobanco_repcp: 0, Volumeninicial_repcp: 0, Volumenfinal_repcp: 0, Caudal1_repcp: 0, Caudal2_repcp: 0, Caudal3_repcp: 0, Presionent1_repcp: 0, Presionent2_repcp: 0, Presionent3_repcp: 0, Presionsal1_repcp: 0, Presionsal2_repcp: 0, Presionsal3_repcp: 0, Templinea1_repcp: 0, Templinea2_repcp: 0, Templinea3_repcp: 0, Temprvm_repcp: 0, Volumenrvm_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1 },
      LecturaMedidor: { Puesto_ordenentradad: 0, Id_pod: 0, Id_ordenentradad: -1, Serialmedidor_ordenentradad: '', Lectura_ordenentradad: 0, Volumeninicial_repcp: 0, Volumenfinal_repcp: 0, Diametronominal_modelomedidor: '', Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Fabricacion_ordenentradad: '', Aptocalibrar_ordenentradad: '', Nombre_normaref: ''  },
      LisCalibraciones: [],
      LisCalibracionPrueba: [],
      LisRepeticionCP: [],
      step: 1,
      LisLecturasIniciales: [],
      LisLecturasFinales: [],
      todasFechas: false,
      ListaInstrumentosGeneral: [],
      listaInstrumentos: [],
      columnsInstrumentos: [
        { name: 'Id_instrumento', label: 'Id', field: 'Id_instrumento', sortable: true },
        { name: 'Codigo_instrumento', align: 'left', label: 'Código', field: 'Codigo_instrumento', sortable: true },
        { name: 'Descripcion_instrumento', label: 'Descripción', field: 'Descripcion_instrumento', sortable: true }
      ],
      SelectedInstrumentos: [],
      Instrumento: { Id_instrumento: -1, Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Activo_instrumento: false, Login_instrumento: '', LisTrazabilidadInstrumentos: [] },
      banco: { Id_banco: -1, Identificacion_banco: '', Tipo_banco: '', Lineas_banco: -1, Medidores_banco: -1, Descripcion_banco: '', Login_banco: '', Estado_banco: 1 },
      tipoensayo: { Id_tipoensayo: -1, Nombre_tipoensayo: '', Estado_tipoensayo: 1 },
      tipoPrueba: { Id_tipoprueba: '', Nombre_tipoprueba: '', Caudal_tipoprueba: '', Estado_tipoprueba: 1 },
      // time: ref('07:30'),
      listaUsuarios: [],
      listaParametrosCalibracion: [],
      parametroCalibracion: { Id_parcal: -1, Descripcion_parcal: '', Observaciones_parcal: -1, Coefexpter_parcal: -1, Incertcoefexpter_parcal: -1, Incertcomprenagua_parcal: -1, Coefexptermat_parcal: -1, Comprenagua_parcal: -1, Incertcoefexptva_parcal: -1, Activo_parcal: -1, Login_parcal: '', Fecha_parcal: '', Estado_parcal: -1 },
      listaPruebas: [],
      SelectedPruebas: [],
      ProgramacionOrden: { Id_programacionorden: -1, Id_ordenentradad: -1, Id_tipoensayo: -1, Nombre_tipoensayo: '', Id_banco: -1, Identificacion_banco: '', Id_parcal: -1, Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', Calibrado_programacionorden: -1, LisProgOrdenDet: [], LisInstProg: [], LisTipoPrueba: [], FechaIni: '', FechaFin: '' },
      Normaref: { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [] },
      selected: [],
      lisNormareferencia: [],
      lisTipoConsulta: [ {Id: 1, Nombre: 'Número Certificado' }, {Id: 2, Nombre: 'Serial Meidor' }],
      lisMarcamedidor: [],
      lisModelomedidor: [],
      lisMedidores: [],
      lisordenEntrada: [],
      lisBancos: [],
      lisTipoEnsayo: [],
      fechaIni: '',
      fechaFin: '',
      componente: null,
      isDialogComponente: false,
      isDialogComponenteInstrumentos: false,
      isDialogComponenteFiltro: false,
      fecha: date,
      usuario: {},
      ordenEntradaD: { Id_ordenentradad: -1, Id_ordenentrada: -1, Id_marcamedidor: -1, Id_modelomedidor: -1, Id_normaref: -1, Aptocalibrar_ordenentradad: '', Fabricacion_ordenentradad: '', Lectura_ordenentradad: '', Serialmedidor_ordenentradad: '', Caudalpermanente_ordenentradad: 0, Claseprecision_ordenentradad: 0, Presionmax_ordenentradad: 0, Perdidapresion_ordenentradad: '',
        Rangomedicion1_ordenentradad: 0, Rangomedicion2_ordenentradad: 0, Clasetemperatura_ordenentradad: '', Sensibilidadaar_ordenentradad: '', Sebsibilidadaab_ordenentradad: '', Identificador_ordenentradad: 0, Clasemetrologica_ordenentradad: '', Precisionnominal_ordenentradad: 0, Observacion_ordenentradad: '', Estado_ordenentradad: 0, Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Nombre_normaref: '', Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: '' }, Modelomedidor: { Id_modelomedidor: null, Descripcion_modelomedidor: '', Diametronominal_modelomedidor: '' }, Icono: 'edit', Incidencias: 0, ListaIncidencias: [], Programado_ordenentradad: 0, Calibrado_ordenentradad: 0, Certificado_ordenentradad: 0 },
      columnsMedidores: [
        { name: 'Puesto_ordenentradad', align: 'left', label: 'Puesto', field: 'Puesto_ordenentradad', required: true },
        { name: 'Id_pod', align: 'left', label: 'Id', field: 'Id_pod' },
        { name: 'Id_ordenentradad', align: 'left', label: 'IdOED', field: 'Id_ordenentradad' },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'Serial', field: 'Serialmedidor_ordenentradad' },
        { name: 'Lectura_ordenentradad', label: 'Lectura', field: 'Lectura_ordenentradad' },
        { name: 'Volumeninicial_repcp', label: 'Vol. Inicial', field: 'Volumeninicial_repcp' },
        { name: 'Volumenfinal_repcp', label: 'Vol. Final', field: 'Volumenfinal_repcp' },
        { name: 'Nombre_marcamedidor', align: 'left', label: 'Marca Medidor', field: 'Nombre_marcamedidor' },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'Modelo Medidor', field: 'Descripcion_modelomedidor' },
        { name: 'Fabricacion_ordenentradad', align: 'left', label: 'AñoFab', field: 'Fabricacion_ordenentradad' },
        { name: 'Aptocalibrar_ordenentradad', align: 'left', label: 'AptoCal', field: 'Aptocalibrar_ordenentradad' },
        { name: 'Nombre_normaref', align: 'left', label: 'Norma Referencia', field: 'Nombre_normaref' }
      ],
      vcMedidores: ['Puesto_ordenentradad', 'Serialmedidor_ordenentradad', 'Volumeninicial_repcp', 'Volumenfinal_repcp', 'Descripcion_modelomedidor'],
      columnsPruebas: [
        { name: 'Id_tipoprueba', align: 'left', label: 'Id', field: 'Id_tipoprueba', sortable: true },
        { name: 'Nombre_tipoprueba', align: 'left', label: 'Nombre Prueba', field: 'Nombre_tipoprueba', sortable: true },
        { name: 'Caudal_tipoprueba', label: 'Caudal', field: 'Caudal_tipoprueba', sortable: true },
        { name: 'Modificar_tipoprueba', label: 'Modificar', field: 'Modificar_tipoprueba' }
      ],
      LisProgramaciones: [],
      vcProgramaciones: ['Fechacalibracion_programacionorden', 'Horacalibracion_programacionorden', 'Duracioncalibracion_programacionorden', 'Medidores_programacionorden', 'Nombre_supervisor'],
      columnsProgramaciones: [
        { name: 'Seleccionar_programacionorden', align: 'left', label: 'Cargar', field: 'Seleccionar_programacionorden', required: true, sortable: true },
        { name: 'Id_programacionorden', align: 'left', label: 'Id', field: 'Id_programacionorden', required: true, sortable: true },
        { name: 'Id_tipoensayo', align: 'left', label: 'IdTE', field: 'Id_tipoensayo', sortable: true },
        { name: 'Nombre_tipoensayo', align: 'left', label: 'Nombre tipoensayo', field: 'Nombre_tipoensayo', sortable: true },
        { name: 'Id_banco', label: 'IdBanco', field: 'Id_banco', sortable: true },
        { name: 'Identificacion_banco', align: 'left', label: 'Nombre Banco', field: 'Identificacion_banco', sortable: true },
        { name: 'Id_parcal', align: 'left', label: 'IdParcal', field: 'Id_parcal', sortable: true },
        { name: 'Fechacalibracion_programacionorden', align: 'left', label: 'FechaCalibracion', field: 'Fechacalibracion_programacionorden', sortable: true },
        { name: 'Horacalibracion_programacionorden', align: 'left', label: 'Hora', field: 'Horacalibracion_programacionorden', sortable: true },
        { name: 'Duracioncalibracion_programacionorden', label: 'Duracion', field: 'Duracioncalibracion_programacionorden', sortable: true },
        { name: 'Medidores_programacionorden', label: 'Medidores', field: 'Medidores_programacionorden', sortable: true },
        { name: 'Supervisor_programacionorden', label: 'Supervisor', field: 'Supervisor_programacionorden', sortable: true },
        { name: 'Nombre_supervisor', align: 'left', label: 'Nombre Supervisor', field: 'Nombre_supervisor', sortable: true },
        { name: 'Encargado_programacionorden', label: 'Encargado', field: 'Encargado_programacionorden', sortable: true },
        { name: 'Nombre_encargado', align: 'left', label: 'Nombre Encargado', field: 'Nombre_encargado', sortable: true },
        { name: 'Observacion_programacionorden', align: 'left', label: 'Observacion', field: 'Observacion_programacionorden', sortable: true },
        { name: 'Login_programacionorden', align: 'left', label: 'Login', field: 'Login_programacionorden', sortable: true },
        { name: 'Fecha_programacionorden', align: 'left', label: 'Fecha', field: 'Fecha_programacionorden', sortable: true },
        { name: 'Login_programacionorden', align: 'left', label: 'Login', field: 'Login_programacionorden', sortable: true }
      ],
      vcCalibraciones: ['Fechaini_calibracion', 'Fechafin_calibracion', 'Medidores_programacionorden', 'Nombre_supervisor'],
      columnsCalibraciones: [
        { name: 'Seleccionar_calibracion', align: 'left', label: 'Verificar', field: 'Seleccionar_calibracion', required: true, sortable: true },
        { name: 'Id_calibracion', align: 'left', label: 'Id', field: 'Id_calibracion', required: true, sortable: true },
        { name: 'Id_programacionorden', align: 'left', label: 'IdPrg', field: 'Id_programacionorden', required: true, sortable: true },
        { name: 'Medidores_programacionorden', label: 'Medidores', field: 'Medidores_programacionorden', sortable: true },
        { name: 'Nombre_supervisor', align: 'left', label: 'Nombre Supervisor', field: 'Nombre_supervisor', sortable: true },
        { name: 'Nombre_encargado', align: 'left', label: 'Nombre Encargado', field: 'Nombre_encargado', sortable: true },
        { name: 'Observacion_calibracion', align: 'left', label: 'Observacion', field: 'Observacion_calibracion', sortable: true },
        { name: 'Login_calibracion', align: 'left', label: 'Login', field: 'Login_calibracion', sortable: true },
        { name: 'Fechaini_calibracion', align: 'left', label: 'Inicio', field: 'Fechaini_calibracion', sortable: true },
        { name: 'Fechafin_calibracion', align: 'left', label: 'Final', field: 'Fechafin_calibracion', sortable: true },
        { name: 'Fecha_calibracion', align: 'left', label: 'Fecha', field: 'Fecha_calibracion', sortable: true }
      ],
      vcCalibracionPruebas: ['Tempambini_calprueba', 'Tempambfin_calprueba', 'Humedadrelini_calprueba', 'Humedadrelfin_calprueba', 'Fechaini_calprueba', 'Fechafin_calprueba'],
      columnsCalibracionPruebas: [
        { name: 'Seleccionar_calibracionprueba', align: 'left', label: 'Verificar', field: 'Seleccionar_calibracionprueba', required: true, sortable: true },
        { name: 'Id_calprueba', align: 'left', label: 'Id', field: 'Id_calprueba', required: true, sortable: true },
        { name: 'Id_calibracion', align: 'left', label: 'IdCal', field: 'Id_calibracion', required: true, sortable: true },
        { name: 'Id_tipoprueba', align: 'left', label: 'TipoPrueba', field: 'Id_tipoprueba', required: true, sortable: true },
        { name: 'Tempambini_calprueba', label: 'TempAmbIni', field: 'Tempambini_calprueba', sortable: true },
        { name: 'Tempambfin_calprueba', label: 'TempAmbFin', field: 'Tempambfin_calprueba', sortable: true },
        { name: 'Humedadrelini_calprueba', label: 'HumRelIni', field: 'Humedadrelini_calprueba', sortable: true },
        { name: 'Humedadrelfin_calprueba', label: 'HumRelFin', field: 'Humedadrelfin_calprueba', sortable: true },
        { name: 'Fechaini_calprueba', align: 'left', label: 'Inicio', field: 'Fechaini_calprueba', sortable: true },
        { name: 'Fechafin_calprueba', align: 'left', label: 'Final', field: 'Fechafin_calprueba', sortable: true },
        { name: 'Login_calprueba', align: 'left', label: 'Login', field: 'Login_calprueba', sortable: true },
        { name: 'Observacion_calprueba', align: 'left', label: 'Observacion', field: 'Observacion_calprueba', sortable: true },
        { name: 'Fecha_calprueba', align: 'left', label: 'Fecha', field: 'Fecha_calprueba', sortable: true }
      ],
      vcRepeticionesCP: ['Nrepeticion_repcp', 'Puestobanco_repcp', 'Volumeninicial_repcp', 'Volumenfinal_repcp', 'Fechaini_repcp', 'Fechafin_repcp'],
      columnsRepeticionesCP: [
        { name: 'Id_repcp', align: 'left', label: 'Id', field: 'Id_repcp', required: true, sortable: true },
        { name: 'Id_pod', align: 'left', label: 'IdPod', field: 'Id_pod', required: true, sortable: true },
        { name: 'Id_calprueba', align: 'left', label: 'IdCalP', field: 'Id_calprueba', required: true, sortable: true },
        { name: 'Nrepeticion_repcp', label: 'Repetición', field: 'Nrepeticion_repcp', sortable: true },
        { name: 'Nuestobanco_repcp', label: 'PuestoBanco', field: 'Npuestobanco_repcp', sortable: true },
        { name: 'Volumeninicial_repcp', label: 'VolIni', field: 'Volumeninicial_repcp', sortable: true },
        { name: 'Volumenfinal_repcp', label: 'VolFin', field: 'Volumenfinal_repcp', sortable: true },
        { name: 'Caudal1_repcp', label: 'Caudal1', field: 'Caudal1_repcp', sortable: true },
        { name: 'Caudal2_repcp', label: 'Caudal2', field: 'Caudal2_repcp', sortable: true },
        { name: 'Caudal3_repcp', label: 'Caudal3', field: 'Caudal3_repcp', sortable: true },
        { name: 'Presionent1_repcp', label: 'PresionEnt1', field: 'Presionent1_repcp', sortable: true },
        { name: 'Presionent2_repcp', label: 'PresionEnt2', field: 'Presionent2_repcp', sortable: true },
        { name: 'Presionent3_repcp', label: 'PresionEnt3', field: 'Presionent3_repcp', sortable: true },
        { name: 'Presionsal1_repcp', label: 'PresionSal1', field: 'Presionsal1_repcp', sortable: true },
        { name: 'Presionsal2_repcp', label: 'PresionSal2', field: 'Presionsal2_repcp', sortable: true },
        { name: 'Presionsal3_repcp', label: 'PresionSal3', field: 'Presionsal3_repcp', sortable: true },
        { name: 'Templinea1_repcp', label: 'TempLinea1', field: 'Templinea1_repcp', sortable: true },
        { name: 'Templinea2_repcp', label: 'TempLinea2', field: 'Templinea2_repcp', sortable: true },
        { name: 'Templinea3_repcp', label: 'TempLinea3', field: 'Templinea3_repcp', sortable: true },
        { name: 'Temprvm_repcp', label: 'TempRVM', field: 'Temprvm_repcp', sortable: true },
        { name: 'Volumenrvm_repcp', label: 'VolRVM', field: 'Volumenrvm_repcp', sortable: true },
        { name: 'Duracionh_repcp', label: 'Horas', field: 'Duracionh_repcp', sortable: true },
        { name: 'Duracionm_repcp', label: 'Minutos', field: 'Duracionm_repcp', sortable: true },
        { name: 'Duracions_repcp', label: 'Segundos', field: 'Duracions_repcp', sortable: true },
        { name: 'Fechaini_repcp', align: 'left', label: 'Inicio', field: 'Fechaini_repcp', sortable: true },
        { name: 'Fechafin_repcp', align: 'left', label: 'Final', field: 'Fechafin_repcp', sortable: true },
        { name: 'Observacion_repcp', align: 'left', label: 'Observacion', field: 'Observacion_repcp', sortable: true }
      ]     
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
  },
  created () {
  },
  methods: {
    VerificarRepeticion () {
      if (this.selected.length < this.LisRepeticionCP.length) {
        utils.mensaje('Debe verificar todas las repeticiones')
        return
      }
      if (this.LisCalibracionPrueba.length > 0) {
        this.step = 2  
      } else {
        this.step = 4
      }
    },
    CargarCalibracion (Cal) {
      const self = this
      self.Calibracion = Cal
      self.LisCalibracionPrueba = Cal.LisCalibracionPrueba

      var i = this.LisCalibraciones.indexOf(Cal)
      this.LisCalibraciones.splice(i, 1)
      this.step = 2
    },
    CargarCargarCalibracionPrueba (CP) {
      const self = this
      self.CalibracionPrueba = CP
      self.LisRepeticionCP = CP.LisRepeticionCP

      var i = this.LisCalibracionPrueba.indexOf(CP)
      this.LisCalibracionPrueba.splice(i, 1)

      self.step = 3
    },
    CargarProgramacionOrden (progOrden) {
      const self = this
      self.ProgramacionOrden = progOrden
      self.listaPruebas = progOrden.LisTipoPrueba

      // llenar objeto Calibración
      self.Calibracion.Id_programacionorden = progOrden.Id_programacionorden
      self.Calibracion.Fechaini_calibracion = utils.fechaHora()
      self.Calibracion.Login_calibracion = self.usuario.LoginUsuario

      const lista = progOrden.LisProgOrdenDet
      self.lisMedidores = []
      var puesto = 1
      for (const med of lista) {
        const medidor = { ...this.LecturaMedidor }
        medidor.Puesto_ordenentradad = puesto
        medidor.Id_pod = med.Id_pod
        medidor.Id_ordenentradad = med.Id_ordenentradad
        medidor.Lectura_ordenentradad = med.OrdenED.Lectura_ordenentradad
        medidor.Volumeninicial_repcp = ''
        medidor.Volumenfinal_repcp = ''
        medidor.Fabricacion_ordenentradad = med.OrdenED.Fabricacion_ordenentradad
        medidor.Aptocalibrar_ordenentradad = med.OrdenED.Aptocalibrar_ordenentradad
        medidor.Nombre_normaref = med.OrdenED.Nombre_normaref
        medidor.Nombre_marcamedidor = med.OrdenED.Nombre_marcamedidor
        medidor.Descripcion_modelomedidor = med.OrdenED.Descripcion_modelomedidor
        medidor.Serialmedidor_ordenentradad = med.OrdenED.Serialmedidor_ordenentradad
        // medidor.Diametronominal_modelomedidor = med.OrdenED.

        self.lisMedidores.push(medidor)
        puesto++
      }
      var i = this.LisProgramaciones.indexOf(progOrden)
      this.LisProgramaciones.splice(i, 1)
      this.step = 2
    },
    mostrarInstrumentosGeneral (inst) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/instrumentoMostrarFiltro/', inst)
        .then((response) => {
          self.ListaInstrumentosGeneral = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Instrumentos Gral ' + error)
          self.$q.loading.hide()
        })
    },
    exportTable (tablaE, columnasE) {
      // naive encoding to csv format
      const content = [columnasE.map(col => wrapCsvValue(col.label))].concat(
        tablaE.map(row => columnasE.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === undefined ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      var nombreArchivo = 'ConsultaVerificacionCalibracion_' + utils.fechaActual()
      const status = exportFile(
        nombreArchivo + '.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'No existen datos para descargar',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} para calibrar`
    },
    filterFnUsuario (val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.get(`/usuario/usuariosFiltro/${val}`)
          .then((response) => {
            update(() => {
              this.listaUsuarios = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    regresar () {
      this.$router.push('/admin')
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    },
    consultarFiltro () {
      const self = this
      self.$q.loading.show()
      if (self.ordenEntradaD.Lectura_ordenentradad === '') {
        self.ordenEntradaD.Lectura_ordenentradad = -1
      }
      if (self.ordenEntradaD.Fabricacion_ordenentradad === '') {
        self.ordenEntradaD.Fabricacion_ordenentradad = -1
      }
      api.post('/ordenentrada/OrdenentradadetMostrarFiltro/', this.ordenEntradaD)
        .then((response) => {
          const lista = response.data
          lista.forEach(function (medidor) {
            const registro = { ...self.LecturaMedidor }
            registro.Id_pod = 0
            registro.Id_ordenentradad = medidor.Id_ordenentradad
            
            self.lisMedidores.push(registro)
          })
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Medidores ' + error)
          self.$q.loading.hide()
        })
    },
    consultarFiltroProgramacion () {
      const self = this
      self.$q.loading.show()
      self.ProgramacionOrden.FechaIni = utils.fechaActual()
      self.ProgramacionOrden.FechaFin = utils.fechaActual()
      if (self.todasFechas === true) {
        self.ProgramacionOrden.Id_programacionorden = 0
      } else {
        self.ProgramacionOrden.Id_programacionorden = 2
      }
      self.ProgramacionOrden.Login_programacionorden = ''
      self.ProgramacionOrden.Encargado_programacionorden = this.usuario.LoginUsuario
      self.ProgramacionOrden.Calibrado_programacionorden = 0
      api.post('/programacionorden/ProgramacionConsultaFechas/', this.ProgramacionOrden)
        .then((response) => {
          self.LisProgramaciones = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - LisProgramaciones ' + error)
          self.$q.loading.hide()
        })
    },
    consultarFiltroCalibracion () {
      const self = this
      self.$q.loading.show()
      self.LisCalibraciones = []
      self.Calibracion.Fechaini_calibracion = utils.fechaActual()
      self.Calibracion.Fechafin_calibracion = utils.fechaActual()
      self.Calibracion.Id_calibracion = -1
      self.Calibracion.Id_programacionorden = -1
      if (self.todasFechas === true) {
        self.Calibracion.Estado_calibracion = 1
      } else {
        self.Calibracion.Estado_calibracion = 0
      }
      self.Calibracion.Login_calibracion = ''
      api.post('/calibracionmedidores/consultarCalibracionMedidores/', this.Calibracion)
        .then((response) => {
          const lista = response.data
          lista.forEach(function (lcalib) {
              var calib = { ...self.Calibracion }
              calib = lcalib
              calib.Medidores_programacionorden = lcalib.Programacionorden.Medidores_programacionorden
              calib.Nombre_supervisor = lcalib.Programacionorden.Nombre_supervisor
              calib.Nombre_encargado = lcalib.Programacionorden.Nombre_encargado
              
              self.LisCalibraciones.push(calib)
          })
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - LisCalibraciones ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>
