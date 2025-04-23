<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="receipt_long" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title>
          Generar Resultados Calibración de Medidores
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
                title="1. Seleccione una calibración para generar los resultados"
                icon="search"
                :done="step > 1"
            >
                <div class="row q-col-gutter-sm">
                <q-toggle class="col-xs-12 col-sm-6 col-md-2 q-field--with-bottom q-pt-sm"
                  v-model="todasFechas"
                  checked-icon="check"
                  color="green"
                  label="Consultar todas las fechas"
                  unchecked-icon="clear"
                />
                <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" readonly stack-label label="Registros" v-model="LisCalibraciones.length" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" readonly stack-label label="Orden Trabajo" v-model="Id_programacionorden" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Fecha Inicio" 
                  :readonly="todasFechas === true"
                  v-model="Calibracion.Fechaini_calibracion"
                  type="date" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Fecha Fin" 
                  :readonly="todasFechas === true"
                  v-model="Calibracion.Fechafin_calibracion"
                  type="date" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                    :data="LisCalibraciones"
                    :columns="columnsCalibraciones"
                    :visible-columns="vcCalibraciones">
                  <template v-slot:body-cell-Seleccionar_calibracion="props">
                  <q-td key="Seleccionar_calibracion" :props="props" auto-width>
                    <q-btn icon="verified" color="blue" align="center" outline @click="GenerarResultados(props.row)"/>
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
                title="2. Resultados preliminares"
                icon="settings"
                :done="step > 2"
            >
                Verifique si los datos son correctos para generar los certificados de calibración de la Orden de Trabajo No. {{ Id_programacionorden }}
                <div class="row q-col-gutter-sm">
                  <div class="q-pa-md q-gutter-md">
                    <q-btn @click="rectificarVerificacion()" color="orange" label="Rectificar Verificación" class="q-ml-sm" />
                  </div>
                </div>
                <q-table
                  title="Certificados"
                  :data="ListaCertificados"
                  :columns="columnsCertificados"
                  row-key="IdCertificado"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn size="sm" color="accent" round dense @click="cargarDetalleCertificado(props)" :icon="props.expand ? 'remove' : 'add'" />
                      </q-td>
                      <q-td key="IdCertificado" :props="props">
                        {{ props.row.IdCertificado }}
                      </q-td>
                      <q-td key="Id_pod" :props="props">
                        {{ props.row.Id_pod }}
                      </q-td>
                      <q-td key="Serialmedidor_ordenentradad" :props="props">
                        {{ props.row.Serialmedidor_ordenentradad }}
                      </q-td>
                      <q-td key="HumedadRelMin" :props="props">
                        {{ formatoNumero(props.row.HumedadRelMin, 1) }}
                      </q-td>
                      <q-td key="HumedadRelMax" :props="props">
                        {{ formatoNumero(props.row.HumedadRelMax, 1) }}
                      </q-td>
                      <q-td key="HumedadRelProm" :props="props">
                        {{ formatoNumero(props.row.HumedadRelProm, 1) }}
                      </q-td>
                      <q-td key="TempAmbMin" :props="props">
                        {{ formatoNumero(props.row.TempAmbMin, 1) }}
                      </q-td>
                      <q-td key="TempAmbMax" :props="props">
                        {{ formatoNumero(props.row.TempAmbMax, 1) }}
                      </q-td>
                      <q-td key="TempAmbProm" :props="props">
                        {{ formatoNumero(props.row.TempAmbProm, 1) }}
                      </q-td>
                    </q-tr>
                      <q-tr v-show="props.expand" :props="props">
                        <q-td colspan="100%">
                          <q-table
                            title="Certificado Detalle"
                            :data="ListaCertificadoDetalle"
                            :columns="columnsCertificadoDetalle"
                            row-key="IdCertificado"
                          >
                          <template v-slot:body="props">
                            <q-tr :props="props">
                              <q-td key="IdCertificado" :props="props">
                                {{ props.row.IdCertificado }}
                              </q-td>
                              <q-td key="Id_caudal" :props="props">
                                {{ props.row.Id_caudal }}
                              </q-td>
                              <q-td key="VolumenMedPromedio" :props="props">
                                {{ formatoNumero(props.row.VolumenMedPromedio, 3) }}
                              </q-td>
                              <q-td key="VolumenRealPromedio" :props="props">
                                {{ formatoNumero(props.row.VolumenRealPromedio, 3) }}
                              </q-td>
                              <q-td key="ErrorPromedio" :props="props">
                                {{ formatoNumero(props.row.ErrorPromedio, 2) }}
                              </q-td>
                              <q-td key="IncertidumbreExpandida" :props="props">
                                {{ formatoNumero(props.row.IncertidumbreExpandida, 2) }}
                              </q-td>
                              <q-td key="EMP" :props="props">
                                {{ formatoNumero(props.row.EMP, 2) }}
                              </q-td>
                              <q-td key="FactorCobertura" :props="props">
                                {{ formatoNumero(props.row.FactorCobertura, 2) }}
                              </q-td>
                              <q-td key="CaudalMin" :props="props">
                                {{ formatoNumero(props.row.CaudalMin, 2) }}
                              </q-td>
                              <q-td key="CaudalMax" :props="props">
                                {{ formatoNumero(props.row.CaudalMax, 2) }}
                              </q-td>
                              <q-td key="CaudalProm" :props="props">
                                {{ formatoNumero(props.row.CaudalProm, 2) }}
                              </q-td>
                              <q-td key="PresionEntMin" :props="props">
                                {{ formatoNumero(props.row.PresionEntMin, 2) }}
                              </q-td>
                              <q-td key="PresionEntMax" :props="props">
                                {{ formatoNumero(props.row.PresionEntMax, 2) }}
                              </q-td>
                              <q-td key="PresionEntProm" :props="props">
                                {{ formatoNumero(props.row.PresionEntProm, 2) }}
                              </q-td>
                              <q-td key="PresionSalMin" :props="props">
                                {{ formatoNumero(props.row.PresionSalMin, 2) }}
                              </q-td>
                              <q-td key="PresionSalMax" :props="props">
                                {{ formatoNumero(props.row.PresionSalMax, 2) }}
                              </q-td>
                              <q-td key="PresionSalProm" :props="props">
                                {{ formatoNumero(props.row.PresionSalProm, 2) }}
                              </q-td>
                              <q-td key="TempLineaMin" :props="props">
                                {{ formatoNumero(props.row.TempLineaMin, 2) }}
                              </q-td>
                              <q-td key="TempLineaMax" :props="props">
                                {{ formatoNumero(props.row.TempLineaMax, 2) }}
                              </q-td>
                              <q-td key="TempLineaProm" :props="props">
                                {{ formatoNumero(props.row.TempLineaProm, 2) }}
                              </q-td>
                              <q-td key="TempRVMmin" :props="props">
                                {{ formatoNumero(props.row.TempRVMmin, 2) }}
                              </q-td>
                              <q-td key="TempRVMmax" :props="props">
                                {{ formatoNumero(props.row.TempRVMmax, 2) }}
                              </q-td>
                              <q-td key="TempRVMprom" :props="props">
                                {{ formatoNumero(props.row.TempRVMprom, 2) }}
                              </q-td>
                              <q-td key="CaudalPromedio" :props="props">
                                {{ formatoNumero(props.row.CaudalPromedio, 2) }}
                              </q-td>
                            </q-tr>
                          </template>
                          </q-table>
                        </q-td>
                      </q-tr>
                  </template>
                </q-table>
                <q-stepper-navigation>
                <q-btn @click="generarCertificados()" color="blue" label="Generar Certificados" class="q-ml-sm" />
                <q-btn flat @click="step = 1" color="primary" label="Volver" class="q-ml-sm" />
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
      Id_programacionorden: null,
      ListaCertificados: [],
      ListaCertificadoDetalle: [],
      Certificado: { IdCertificado: -1, Id_calibracion: -1, Id_pod: -1, NCertificado: '', Serialmedidor_ordenentradad: '', FechaEmision: '', HumedadRelMin: 0, HumedadRelMax: 0, HumedadRelProm: 0, TempAmbMin: 0, TempAmbMax: 0, TempAmbProm: 0, Login: '', FechaCertificado: '', FechaImpresion: '', Estado: 1 },
      CertificadoDetalle: { IdCertificadoDetalle: -1, IdCertificado: -1, Id_caudal: -1, CaudalMin: 0, CaudalMax: 0, CaudalProm: 0, PresionEntMin: 0, PresionEntMax: 0, PresionEntProm: 0, PresionSalMin: 0, PresionSalMax: 0, PresionSalProm: 0, TempLineaMin: 0, TempLineaMax: 0, TempLineaProm: 0, TempRVMmin: 0, TempRVMmax: 0, TempRVMprom: 0, CaudalPromedio: 0, VolumenMedPromedio: 0, VolumenRealPromedio: 0, ErrorPromedio: 0, IncertidumbreExpandida: 0, EMP: 0, FactorCobertura: 0, Estado: 1 },
      Repeticiones: 1,
      RepeticionesFaltantes: 0,
      Calibracion: { Id_calibracion: -1, Id_programacionorden: -1, Fechaini_calibracion: '', Fechafin_calibracion: '', Fecha_calibracion: '', Observacion_calibracion: '', Login_calibracion: '', Estado_calibracion: 1, Programacionorden: {}, LisCalibracionPrueba: [], Medidores_programacionorden: 0, Nombre_supervisor: '', Nombre_encargado: '' },
      CalibracionPrueba: { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Tempambini_calprueba: 0, Tempambfin_calprueba: 0, Humedadrelini_calprueba: 0, Humedadrelfin_calprueba: 0, Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] },
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
      Instrumento: { Id_instrumento: -1, Id_variablemedicion: '', Nombre_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Activo_instrumento: false, Login_instrumento: '', LisTrazabilidadInstrumentos: [] },
      banco: { Id_banco: -1, Identificacion_banco: '', Tipo_banco: '', Lineas_banco: -1, Medidores_banco: -1, Descripcion_banco: '', Login_banco: '', Estado_banco: 1 },
      tipoensayo: { Id_tipoensayo: -1, Nombre_tipoensayo: '', Estado_tipoensayo: 1 },
      tipoPrueba: { Id_caudal: '', Nombre_tipoprueba: '', Caudal_tipoprueba: '', Estado_tipoprueba: 1 },
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
      lisAptocalibrar: ['SI', 'NO'],
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
      vcCalibraciones: ['Fechaini_calibracion', 'Fechafin_calibracion', 'Medidores_programacionorden', 'Nombre_supervisor'],
      columnsCalibraciones: [
        { name: 'Seleccionar_calibracion', align: 'left', label: 'Generar', field: 'Seleccionar_calibracion', required: true, sortable: true },
        { name: 'Id_calibracion', align: 'left', label: 'Id', field: 'Id_calibracion', required: true, sortable: true },
        { name: 'Id_programacionorden', align: 'left', label: 'OrdenTrabajo', field: 'Id_programacionorden', required: true, sortable: true },
        { name: 'Medidores_programacionorden', label: 'Medidores', field: 'Medidores_programacionorden', sortable: true },
        { name: 'Nombre_supervisor', align: 'left', label: 'Nombre Supervisor', field: 'Nombre_supervisor', sortable: true },
        { name: 'Nombre_encargado', align: 'left', label: 'Nombre Encargado', field: 'Nombre_encargado', sortable: true },
        { name: 'Observacion_calibracion', align: 'left', label: 'Observacion', field: 'Observacion_calibracion', sortable: true },
        { name: 'Login_calibracion', align: 'left', label: 'Login', field: 'Login_calibracion', sortable: true },
        { name: 'Fechaini_calibracion', align: 'left', label: 'Inicio', field: 'Fechaini_calibracion', sortable: true },
        { name: 'Fechafin_calibracion', align: 'left', label: 'Final', field: 'Fechafin_calibracion', sortable: true },
        { name: 'Fecha_calibracion', align: 'left', label: 'Fecha', field: 'Fecha_calibracion', sortable: true }
      ],
      columnsCertificados: [
        { name: 'Seleccionar', align: 'center', label: 'Seleccionar', field: 'Seleccionar', sortable: true },
        { name: 'IdCertificado', align: 'center', label: 'IdCertificado', field: 'IdCertificado', sortable: true },
        { name: 'Id_pod', align: 'center', label: 'IdPod', field: 'Id_pod', sortable: true },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'Serial', field: 'Serialmedidor_ordenentradad' },
        { name: 'HumedadRelMin', align: 'center', label: 'HumedadRelMin', field: 'HumedadRelMin', sortable: true },
        { name: 'HumedadRelMax', align: 'center', label: 'HumedadRelMax', field: 'HumedadRelMax', sortable: true },
        { name: 'HumedadRelProm', align: 'center', label: 'HumedadRelProm', field: 'HumedadRelProm', sortable: true },
        { name: 'TempAmbMin', align: 'center', label: 'TempAmbMin', field: 'TempAmbMin', sortable: true },
        { name: 'TempAmbMax', align: 'center', label: 'TempAmbMax', field: 'TempAmbMax', sortable: true },
        { name: 'TempAmbProm', align: 'center', label: 'TempAmbProm', field: 'TempAmbProm', sortable: true }
      ],
      columnsCertificadoDetalle: [
        { name: 'IdCertificado', align: 'center', label: 'IdCertificado', field: 'IdCertificado', sortable: true },
        { name: 'Id_caudal', align: 'center', label: 'IdCaudal', field: 'Id_caudal', sortable: true },
        { name: 'VolumenMedPromedio', align: 'center', label: 'VolMedP', field: 'VolumenMedPromedio', sortable: true },
        { name: 'VolumenRealPromedio', align: 'center', label: 'VolRProm', field: 'VolumenRealPromedio', sortable: true },
        { name: 'ErrorPromedio', align: 'center', label: 'ErrorProm', field: 'ErrorPromedio', sortable: true },
        { name: 'IncertidumbreExpandida', align: 'center', label: 'IncertExp', field: 'IncertidumbreExpandida', sortable: true },
        { name: 'EMP', align: 'center', label: 'EMP', field: 'EMP', sortable: true },
        { name: 'FactorCobertura', align: 'center', label: 'FactCob', field: 'FactorCobertura', sortable: true },
        { name: 'CaudalMin', align: 'center', label: 'CaudalMin', field: 'CaudalMin', sortable: true },
        { name: 'CaudalMax', align: 'center', label: 'CaudalMax', field: 'CaudalMax', sortable: true },
        { name: 'CaudalProm', align: 'center', label: 'CaudalProm', field: 'CaudalProm', sortable: true },
        { name: 'PresionEntMin', align: 'center', label: 'PresionEntMin', field: 'PresionEntMin', sortable: true },
        { name: 'PresionEntMax', align: 'center', label: 'PresionEntMax', field: 'PresionEntMax', sortable: true },
        { name: 'PresionEntProm', align: 'center', label: 'PresionEntMax', field: 'PresionEntMax', sortable: true },
        { name: 'PresionSalMin', align: 'center', label: 'PresionSalMin', field: 'PresionSalMin', sortable: true },
        { name: 'PresionSalMax', align: 'center', label: 'PresionSalMax', field: 'PresionSalMax', sortable: true },
        { name: 'PresionSalProm', align: 'center', label: 'PresionSalMax', field: 'PresionSalMax', sortable: true },
        { name: 'TempLineaMin', align: 'center', label: 'TempLineaMin', field: 'TempLineaMin', sortable: true },
        { name: 'TempLineaMax', align: 'center', label: 'TempLineaMax', field: 'TempLineaMax', sortable: true },
        { name: 'TempLineaProm', align: 'center', label: 'TempLineaProm', field: 'TempLineaProm', sortable: true },
        { name: 'TempRVMmin', align: 'center', label: 'TempRVMmin', field: 'TempRVMmin', sortable: true },
        { name: 'TempRVMmax', align: 'center', label: 'TempRVMmax', field: 'TempRVMmax', sortable: true },
        { name: 'TempRVMprom', align: 'center', label: 'TempRVMprom', field: 'TempRVMprom', sortable: true },
        { name: 'CaudalPromedio', align: 'center', label: 'CaudProm', field: 'CaudalPromedio', sortable: true }
      ]
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.Calibracion.Fechaini_calibracion = utils.fechaActual()
    this.Calibracion.Fechafin_calibracion = utils.fechaActual()
  },
  created () {
  },
  methods: {
    cargarDetalleCertificado (props) {
      props.expand = !props.expand
      this.ListaCertificadoDetalle = props.row.ListaCertificadoDetalle
    },
    rectificarVerificacion () {
      const self = this
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de volver a verificar la Calibración?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.$q.loading.show()
        api.get(`/programacionorden/programacionActualizarTrazabilidad/${ self.Id_programacionorden }`)
        .then((response) => {
          if (response.data > 0) {
            this.$router.push('/Procesos/VerificacionCalibracion')
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Guardar Certificados' + error)
          self.$q.loading.hide()
        })
      }).onCancel(() => {
      })
    },
    generarCertificados () {
      const self = this
        this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de generar los resultados de Calibración?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // GENERAR CADA CERTIFICADO
        self.guardarCertificados()
        this.step = 1
      }).onCancel(() => {
      })
    },
    guardarCertificados () {
      const self = this
      self.$q.loading.show()
      api.post('/certificado/insertarCertificadoCalibracion/', self.ListaCertificados)
      .then((response) => {
        self.ListaCertificados = []
        self.ListaCertificadoDetalle = []
        self.$q.loading.hide()
      })
      .catch((error) => {
        utils.mensaje('Fallo la conexion - Guardar Certificados' + error)
        self.$q.loading.hide()
      })
    },
    GenerarResultados (Cal) {
      const self = this
            this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de previsualizar los resultados de Calibración?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.Calibracion = Cal
        self.Id_programacionorden = Cal.Id_programacionorden
        //self.LisCalibracionPrueba = Cal.LisCalibracionPrueba

        var i = this.LisCalibraciones.indexOf(Cal)
        this.LisCalibraciones.splice(i, 1)
        // GENERAR CADA CERTIFICADO
        self.previsualizarCertificados()
        this.step = 2
      }).onCancel(() => {
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

      var nombreArchivo = 'ConsultaProgramacionMedidores_' + utils.fechaActual()
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
    mostrarModelos (marca) {
      if (marca !== null) {
        this.lisModelomedidor = marca.LisModelomedidor
        this.ordenEntradaD.Nombre_marcamedidor = marca.Nombre_marcamedidor
        this.ordenEntradaD.Id_marcamedidor = marca.Id_marcamedidor
        if (marca.LisModelomedidor.length < 1) {
          this.ordenEntradaD.Id_modelomedidor = ''
        }
      }
    },
    cargarModelo (modelo) {
      if (modelo !== null) {
        this.ordenEntradaD.Descripcion_modelomedidor = modelo.Descripcion_modelomedidor
        this.ordenEntradaD.Id_modelomedidor = modelo.Id_modelomedidor
        this.ordenEntradaD.Diametronominal_modelomedidor = modelo.Diametronominal_modelomedidor
      }
    },
    mostrarMarcaMedidor (id_marcamedidor, nombre_marcamedidor) {
      const self = this
      self.$q.loading.show()
      api.get(`/medidor/marcaMedidorMostrar/${id_marcamedidor}/${nombre_marcamedidor}`)
        .then((response) => {
          self.lisMarcamedidor = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Marcamedidor' + error)
          self.$q.loading.hide()
        })
    },
    mostrarNormaReferencia (norma) {
      const self = this
      self.$q.loading.show()
      api.post('/medidor/normaReferenciaMostrar/', norma)
        .then((response) => {
          self.lisNormareferencia = response.data
          self.ordenEntradaD.Id_normaref = response.data[0].Id_normaref
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Norma Referencia ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarBancos (banco) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/bancosMostrarFiltro/', banco)
        .then((response) => {
          self.lisBancos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Bancos ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarParametrosCalibracion (parcal) {
      const self = this
      self.$q.loading.show()
      api.post('/programacionorden/parametrosCalibracionMostrarFiltro/', parcal)
        .then((response) => {
          self.listaParametrosCalibracion = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Parametros Calibración' + error)
          self.$q.loading.hide()
        })
    },
    cargarBanco(banco) {
      this.banco = banco
    },
    mostrarTipoEnsayo (tipoEns) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/tipoEnsayoMostrar/', tipoEns)
        .then((response) => {
          self.lisTipoEnsayo = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Tipo Ensayo ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarCaudal (caudal) {
      const self = this
      self.$q.loading.show()
      api.post('/programacionorden/caudalMostrar/', caudal)
        .then((response) => {
          self.listaPruebas = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Caudal ' + error)
          self.$q.loading.hide()
        })
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} para calibrar`
    },
    regresar () {
      this.$router.push('/admin')
    },
    reiniciarCalibracion () {
      // this.ordenEntradaD = { Id_puse: 'PS01', Login_ordenEntrada: this.usuario.LoginUsuario, Numero_ordenEntrada: '0', Valor_ordenEntrada: 0, Observaciones_ordenEntrada: '' }
      this.ProgramacionOrden = { Id_programacionorden: -1, Id_ordenentradad: -1, Id_tipoensayo: -1, Nombre_tipoensayo: '', Id_banco: -1, Identificacion_banco: '', Id_parcal: -1, Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', LisProgOrdenDet: [], LisInstProg: [] }
      this.ProgramacionOrden.Fechacalibracion_programacionorden = utils.fechaActual()
      this.ProgramacionOrden.FechaIni = utils.fechaActual()
      this.ProgramacionOrden.FechaFin = utils.fechaActual()
      this.ProgramacionOrden.Horacalibracion_programacionorden = '07:30'
      this.ProgramacionOrden.Login_programacionorden = this.usuario.LoginUsuario 
      this.fechaIni = this.ProgramacionOrden.Fechacalibracion_programacionorden
      this.fechaFin = this.ProgramacionOrden.Fechacalibracion_programacionorden
      this.selected = []
      this.SelectedPruebas = []
      this.SelectedInstrumentos = []
      this.Calibracion = { Id_calibracion: -1, Id_programacionorden: -1, Fechaini_calibracion: '', Fechafin_calibracion: '', Fecha_calibracion: '', Observacion_calibracion: '', Login_calibracion: '', Estado_calibracion: 1, Programacionorden: {}, LisCalibracionPrueba: [], Medidores_programacionorden: 0, Nombre_supervisor: '', Nombre_encargado: ''  }
      this.CalibracionPrueba = { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Tempambini_calprueba: 0, Tempambfin_calprueba: 0, Humedadrelini_calprueba: 0, Humedadrelfin_calprueba: 0, Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] }
      this.RepeticioCP = { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Npuestobanco_repcp: 0, Volumeninicial_repcp: 0, Volumenfinal_repcp: 0, Caudal1_repcp: 0, Caudal2_repcp: 0, Caudal3_repcp: 0, Presionent1_repcp: 0, Presionent2_repcp: 0, Presionent3_repcp: 0, Presionsal1_repcp: 0, Presionsal2_repcp: 0, Presionsal3_repcp: 0, Templinea1_repcp: 0, Templinea2_repcp: 0, Templinea3_repcp: 0, Temprvm_repcp: 0, Volumenrvm_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1 }
    },
    consultarordenEntradaFechas (consulta, filtroCl, fechaIni, fechaFin) {
      const self = this
      self.$q.loading.show()
      var clienteI = -1
      if (consulta === '') {
        consulta = '-1'
      }

      if (filtroCl === undefined || filtroCl === '' || filtroCl === null) {
        clienteI = -1
      } else {
        clienteI = this.cliente.Id_cliente
      }
      self.$axios.get(`/ordenEntradaD/ordenEntradaFechas/${consulta}/${clienteI}/PS01/-1/-1/-1/${fechaIni}/${fechaFin}`)
        .then((response) => {
          if (response.data != null) {
            self.lisordenEntrada = response.data
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Consulta RC - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    ordenEntradaImprimirPDF (numRC) {
      this.$q.loading.show()
      this.$axios.get(`/ordenEntradaD/ordenEntradaImprimirPDF/${numRC}`, { responseType: 'arraybuffer' })
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const blobURL = URL.createObjectURL(blob)
          window.open(blobURL)
          this.$q.loading.hide()
        }).catch(error => {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    previsualizarCertificados () {
      const self = this
      self.$q.loading.show()
      api.post('/certificado/generarCertificadoCalibracionGeneral/', this.Calibracion)
      .then((response) => {
        self.ListaCertificados = response.data
        self.$q.loading.hide()
      })
      .catch((error) => {
        utils.mensaje('Fallo la conexion - Generar Certificados' + error)
        self.$q.loading.hide()
      })
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
      self.Calibracion.Observacion_calibracion = ''
      self.Calibracion.Id_calibracion = 3 //Verificar los medidores ya calibrados
      self.Calibracion.Id_programacionorden = -1
      if (self.todasFechas === true) {
        self.Calibracion.Estado_calibracion = 1
      } else {
        self.Calibracion.Estado_calibracion = 0
      }
      self.Calibracion.Login_calibracion = ''
      api.post('/calibracionmedidores/verificacionCalibracionMedidores/', this.Calibracion)
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
