<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="done_outline" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" @click="isDialogComponenteConsulta = true" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title>
          Autorización de Firmas
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formEntregaMedidores">
        <div class="q-pa-md">
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step :name="1" title="1. Seleccione rango de fechas" icon="search" :done="step > 1">
              <div class="row q-col-gutter-sm">
                <q-toggle class="col-xs-12 col-sm-6 col-md-2 q-field--with-bottom q-pt-sm" v-model="todasFechas"
                  checked-icon="check" color="green" label="Todas las fechas" unchecked-icon="clear" />

                  <!-- <q-toggle class="col-xs-12 col-sm-6 col-md-2 q-field--with-bottom q-pt-sm" v-model="certificado"
                  checked-icon="check" color="orange" label="Certificado" unchecked-icon="clear" @change="Cambio" @click.native="Cambio('certificado')"/>
                  <q-toggle class="col-xs-12 col-sm-6 col-md-2 q-field--with-bottom q-pt-sm" v-model="informe"
                  checked-icon="check" color="yellow" label="Informe" unchecked-icon="clear"  @change="Cambio" @click.native="Cambio('informe')" /> -->


                  <q-select filled  v-model="Documento" emit-value map-options :options="options" label="Tipo Documento"
                   class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm" />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm"
                 stack-label label="Fecha Inicio"
                  :readonly="todasFechas === true" v-model="fechaIni" type="date" outlined>
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Fecha Fin"
                  :readonly="todasFechas === true" v-model="fechaFin" type="date" outlined>
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-table v-if="Documento == 'Certificados'" class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" show-bottom
                  flat bordered :data="ListaCertificados" :columns="columnsCertificado" row-key="IdCertificado"
                  selection="multiple" :selected.sync="SelectedCertificados" :visible-columns="vcCertificado">
                  <template v-slot:header-selection="scope">
                    <q-toggle v-model="scope.selected" />
                  </template>
                  <template v-slot:body-selection="scope">
                    <q-toggle v-model="scope.selected" dense />
                  </template>
                  <template v-slot:top="props">
                    <q-btn color="primary" icon-right="archive" label="" no-caps
                      @click="exportTable(ListaCertificados, columnsCertificado)" />
                    <q-space />
                    <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen" class="q-ml-md" />
                    <q-space />
                    <q-select v-model="vcCertificado" multiple outlined dense options-dense
                      :display-value="$q.lang.table.columns" emit-value map-options :options="columnsCertificado"
                      option-value="name" options-cover style="min-width: 150px" />
                  </template>
                </q-table>

                <q-table v-if="Documento == 'Informes'" class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" show-bottom
                  flat bordered :data="Listaocumentos" :columns="columnsInforme" row-key="IdInforme"
                  selection="multiple" :selected.sync="SelectedInformes" :visible-columns="viInforme">
                  <template v-slot:header-selection="scope">
                    <q-toggle v-model="scope.selected" />
                  </template>
                  <template v-slot:body-selection="scope">
                    <q-toggle v-model="scope.selected" dense />
                  </template>
                  <template v-slot:top="props">
                    <q-btn color="primary" icon-right="archive" label="" no-caps
                      @click="exportTable(ListaInformes, columnsInforme)" />
                    <q-space />
                    <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen" class="q-ml-md" />
                    <q-space />
                    <q-select v-model="viInforme" multiple outlined dense options-dense
                      :display-value="$q.lang.table.columns" emit-value map-options :options="columnsInforme"
                      option-value="name" options-cover style="min-width: 150px" />
                  </template>
                </q-table>

                <q-table v-if="Documento == 'Trabajo No Conforme'" class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" show-bottom
                  flat bordered :data="ListaCertificados" :columns="columnsTNC" row-key="IdCertificado"
                  selection="multiple" :selected.sync="SelectedCertificados" :visible-columns="vcTNC">
                  <template v-slot:header-selection="scope">
                    <q-toggle v-model="scope.selected" />
                  </template>
                  <template v-slot:body-selection="scope">
                    <q-toggle v-model="scope.selected" dense />
                  </template>
                  <template v-slot:top="props">
                    <q-btn color="primary" icon-right="archive" label="" no-caps
                      @click="exportTable(ListaCertificados, columnsTNC)" />
                    <q-space />
                    <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen" class="q-ml-md" />
                    <q-space />
                    <q-select v-model="vcCertificado" multiple outlined dense options-dense
                      :display-value="$q.lang.table.columns" emit-value map-options :options="columnsTNC"
                      option-value="name" options-cover style="min-width: 150px" />
                  </template>
                </q-table>

                <q-table v-if="Documento == 'Acciones Correctivas'" class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" show-bottom
                  flat bordered :data="ListaCertificados" :columns="columnsAC" row-key="IdCertificado"
                  selection="multiple" :selected.sync="SelectedCertificados" :visible-columns="vcAC">
                  <template v-slot:header-selection="scope">
                    <q-toggle v-model="scope.selected" />
                  </template>
                  <template v-slot:body-selection="scope">
                    <q-toggle v-model="scope.selected" dense />
                  </template>
                  <template v-slot:top="props">
                    <q-btn color="primary" icon-right="archive" label="" no-caps
                      @click="exportTable(ListaCertificados, columnsAC)" />
                    <q-space />
                    <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen" class="q-ml-md" />
                    <q-space />
                    <q-select v-model="vcCertificado" multiple outlined dense options-dense
                      :display-value="$q.lang.table.columns" emit-value map-options :options="columnsAC"
                      option-value="name" options-cover style="min-width: 150px" />
                  </template>
                </q-table>

                
              </div>
              <div class="row justify-center q-pa-sm">
                <q-btn label="Consultar" icon="search" outline align="center" unelevated
                  @click="consultarFiltroEntregar(consultaGeneral, todasFechas, fechaIni, fechaFin)">
                </q-btn>
              </div>
              <q-stepper-navigation>
                <q-btn color="primary" v-if="Documento == 'Certificados'" @click="EnviarCertificados()" label="Autorizar" />
                <q-btn color="primary" v-if="Documento == 'Informes'" @click="EnviarInformes()" label="Autorizar" />
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
    <q-dialog v-model="isDialogComponenteGuardarEntrega" style="max-width: 650px">
      <q-card>
        <q-bar>
          <div>Guardar Entrega de Medidores</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form ref="ordenEntrada" @submit="guardarEntrega()">
            <div class="row q-col-gutter-sm">
              <q-input class="col-xs-12 col-sm-12 col-md-4 q-field--with-bottom" outlined stack-label
                v-model="EntregaMedidor.FechaEntrega" type="date" label="Fecha de Entrega" :rules="[regla]" />
              <div class="col-xs-12 col-sm-12 col-md-8 q-field--with-bottom">
                <q-select filled v-model="EntregaMedidor.Id_persona" map-options emit-value option-value="Id_persona"
                  option-label="Razonsocial_cliente" :options="listaClientes" clearable use-input hide-dropdown-icon
                  hide-selected fill-input input-debounce="0" label="Cliente" :rules="[regla]" @filter="filterFn"
                  @input="val => { seleccionarCliente(val) }">
                  <template v-slot:prepend>
                    <q-icon name="person" size="lg" />
                  </template>
                  <template v-slot:append>
                    <q-btn icon="person_add" color="black" flat dense unelevated @click="agregarCliente" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.Razonsocial_cliente" />
                        <q-item-label caption>Identificación: {{ scope.opt.Codigo_cliente }} - Id Cliente:
                          {{ scope.opt.Id_cliente }} - Id Zona: {{ scope.opt.Id_zona }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <q-input class="col-xs-12 col-sm-12 col-md-12 q-field--with-bottom" outlined stack-label
                v-model="EntregaMedidor.Observacion" type="textarea" label="Observación" />
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Guardar" icon="save" outline align="center" unelevated type="submit"
                @submit="guardarEntrega">
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteConsulta" style="max-width: 650px">
      <q-card>
        <q-bar>
          <div>Consulta Ordenes de Entrega</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="col-xs-12 col-sm-12 col-md-9 q-field--with-bottom">
            <q-select filled v-model="EntregaMedidorConsulta.Id_persona" map-options emit-value
              option-value="Id_persona" option-label="Razonsocial_cliente" :options="listaClientes" clearable use-input
              hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Todos los clientes"
              @filter="filterFn" @input="val => { seleccionarCliente(val) }">
              <template v-slot:prepend>
                <q-icon name="person" size="lg" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.Razonsocial_cliente" />
                    <q-item-label caption>Identificación: {{ scope.opt.Codigo_cliente }} - Id Cliente:
                      {{ scope.opt.Id_cliente }} - Id Zona: {{ scope.opt.Id_zona }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
            <q-select filled v-model="EntregaMedidorConsulta.Login" map-options emit-value option-value="LoginUsuario"
              option-label="NombrePersona" :options="listaUsuarios" use-input hide-dropdown-icon hide-selected
              fill-input input-debounce="0" label="Todos los usuarios" clearable @filter="filterFnUsuario">
              <template v-slot:prepend>
                <q-icon name="supervisor_account" size="lg" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.NombrePersona" />
                    <q-item-label caption>Login: {{ scope.opt.LoginUsuario }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <q-input class="col-xs-12 col-md-12 col-sm-12" outlined v-model="EntregaMedidorConsulta.Observacion"
            label="Observación" />
          <q-toggle class="col-xs-12 col-sm-4 col-md-3 q-field--with-bottom q-pt-sm" v-model="todasFechas"
            checked-icon="check" color="green" label="Consultar todas las fechas" unchecked-icon="clear" />
          <q-input class="col-xs-12 col-sm-4 col-md-4" outlined stack-label v-model="EntregaMedidorConsulta.Fecha"
            type="date" label="Fecha Desde" :readonly="todasFechas === true" />
          <q-input class="col-xs-12 col-sm-4 col-md-4" outlined stack-label
            v-model="EntregaMedidorConsulta.FechaEntrega" type="date" label="Fecha Hasta"
            :readonly="todasFechas === true" />
          <div class="row justify-center q-pa-sm">
            <q-btn label="Consultar" icon="search" outline align="center" unelevated
              @click="consultarordenEntregaFechas()">
            </q-btn>
            <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
            </q-btn>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 q-field--with-bottom">
            <q-table class="col-md-12" dense title="Resumen Ordenes de Entrada" no-data-label="No hay registros"
              hide-bottom :rows-per-page-options="[0]" flat bordered>
              <template v-slot:bottom-row>
                <q-tr>
                  <q-td colspan="2" align="center">
                  </q-td>
                  <q-td align="left">
                    <b> Total Registros </b>
                  </q-td>
                  <q-td align="left">
                    <b> {{ formatoNumero(listaMedidoresConsultaEntrega.length, 0) }} </b>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <div class="q-pa-md q-gutter-md">
            <q-list>
              <q-item v-for="md in listaMedidoresConsultaEntrega" :key="md.IdEntregaMedidor"
                @click.native="imprimirOrdenEntregaPDF(md.IdEntregaMedidor)" class="q-my-sm" clickable>
                <q-item-section avatar>
                  <q-icon name="receipt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label> <b> {{ md.Nombre_persona }} </b> </q-item-label>
                  <q-item-label>
                    Identificacion: {{ md.Identificacion_persona }} <br />
                    IdEntregaMedidor: {{ md.IdEntregaMedidor }} <br />
                    Medidores: {{ md.NMedidores }} <br />
                    Login: {{ md.Login }} <br />
                    Fecha: {{ md.FechaEntrega }} <br />
                    Observaciones: {{ md.Observacion }} <br />
                  </q-item-label>
                  <q-separator />
                </q-item-section>
              </q-item>
            </q-list>
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

function wrapCsvValue(val, formatFn) {
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
  data() {
    return {
      certificado: true,
      informe:false,
      model: null,
      Id_ordenentrada: null,
      Id_programacionorden: null,
      EntregaMedidor: { IdEntregaMedidor: 0, Id_persona: null, NMedidores: 0, FechaEntrega: '', Fecha: '', Login: '', Observacion: '', Estado: 1, ListaEntregaMD: [], Id_ordenentrada: null, Id_programacionorden: null },
      EntregaMD: { IdEntregaMD: 0, IdEntregaMedidor: 0, Id_ordenentradad: 0, Id_pod: 0, Id_calibracion: 0, IdCertificado: 0, SerialMedidor: '', Estado: 1 },
      EntregaMedidorConsulta: { IdEntregaMedidor: 0, Id_persona: -1, NMedidores: 0, FechaEntrega: '', Fecha: '', Login: '', Observacion: '', Estado: 0, ListaEntregaMD: [] },
      LecturaMedidor: { Puesto_ordenentradad: 0, Id_pod: 0, Id_ordenentradad: -1, Serialmedidor_ordenentradad: '', Lectura_ordenentradad: 0, Volumeninicial_repcp: 0, Volumenfinal_repcp: 0, Diametronominal_modelomedidor: '', Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Fabricacion_ordenentradad: '', Aptocalibrar_ordenentradad: '', Nombre_normaref: '' },
      step: 1,
      isDialogComponenteGuardarEntrega: false,
      isDialogComponenteConsulta: false,
      consultaGeneral: '',
      Certificado: {},
      todasFechas: false,
      isEntregado: true,
      ListaMedidoresEntregar: [],
      SelectedCertificados: [],
      SelectedInformes: [],
      ListaCertificados: [],
      ListaInformes:[],
      listaClientes: [],
      options: [{ label: 'Certificados', value: "Certificados" }
      ,{ label: 'Informes', value: 'Informes' }
      ,{ label: 'Trabajo No Conforme', value: "Trabajo No Conforme" }
      ,{ label: 'Acciones Correctivas', value: "Acciones Correctivas" }],
      Documento:'Certificados',
        columnsCertificado: [
        { name: 'IdCertificado', label: 'Id', field: 'IdCertificado', sortable: true },
        { name: 'Id_calibracion', align: 'left', label: 'IdCal', field: 'Id_calibracion', sortable: true },
        { name: 'Id_ordenentrada', label: 'OrdenEntrada', field: 'Id_ordenentrada', sortable: true },
        { name: 'Id_programacionorden', label: 'OrdenTrabajo', field: 'Id_programacionorden', sortable: true },
        { name: 'Id_pod', label: 'IdPod', field: 'Id_pod', sortable: true },
        { name: 'NCertificado', label: 'NCertificado', field: 'NCertificado', sortable: true },
        { name: 'Serialmedidor_ordenentradad', label: 'Serialmedidor', align: 'left', field: 'Serialmedidor_ordenentradad', sortable: true },
        { name: 'Codigo_cliente', label: 'Nit', field: 'Codigo_cliente', align: 'left', sortable: true },
        { name: 'Razonsocial_cliente', label: 'Razonsocial_cliente', align: 'left', field: 'Razonsocial_cliente', sortable: true },
        { name: 'FechaEmision', label: 'FechaEmision', field: 'FechaEmision', align: 'left', sortable: true },
        { name: 'FechaCertificado', label: 'FechaCertificado', field: 'FechaCertificado', align: 'left', sortable: true },
        { name: 'Login', label: 'Login', field: 'Login', align: 'left', sortable: true }
      ],
      
      SelectedInstrumentos: [],
      listaUsuarios: [],
      ProgramacionOrden: { Id_programacionorden: -1, Id_ordenentradad: -1, Id_tipoensayo: -1, Nombre_tipoensayo: '', Id_banco: -1, Identificacion_banco: '', Id_parcal: -1, Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', Calibrado_programacionorden: -1, LisProgOrdenDet: [], LisInstProg: [], Liscaudal: [], FechaIni: '', FechaFin: '' },
      selected: [],
      lisMedidores: [],
      lisordenEntrada: [],
      listaMedidoresConsultaEntrega: [],
      fechaIni: '',
      fechaFin: '',
      componente: null,
      isDialogComponente: false,
      isDialogComponenteInstrumentos: false,
      isDialogComponenteFiltro: false,
      fecha: date,
      usuario: {},
      ordenEntradaD: {
        Id_ordenentradad: -1, Id_ordenentrada: -1, Id_marcamedidor: -1, Id_modelomedidor: -1, Id_normaref: -1, Aptocalibrar_ordenentradad: '', Fabricacion_ordenentradad: '', Lectura_ordenentradad: '', Serialmedidor_ordenentradad: '', Caudalpermanente_ordenentradad: 0, Claseprecision_ordenentradad: 0, Presionmax_ordenentradad: 0, Perdidapresion_ordenentradad: '',
        Rangomedicion1_ordenentradad: 0, Rangomedicion2_ordenentradad: 0, Clasetemperatura_ordenentradad: '', Sensibilidadaar_ordenentradad: '', Sebsibilidadaab_ordenentradad: '', Identificador_ordenentradad: 0, Clasemetrologica_ordenentradad: '', Precisionnominal_ordenentradad: 0, Observacion_ordenentradad: '', Estado_ordenentradad: 0, Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Nombre_normaref: '', Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: '' }, Modelomedidor: { Id_modelomedidor: null, Descripcion_modelomedidor: '', Diametronominal_modelomedidor: '' }, Icono: 'edit', Incidencias: 0, ListaIncidencias: [], Programado_ordenentradad: 0, Calibrado_ordenentradad: 0, Certificado_ordenentradad: 0
      },
      columnsInforme:[  
        { name: 'IdInforme', align: 'left', label: 'Id', field: 'IdInforme', required: true },
        { name: 'IdOrdenEntradad', align: 'left', label: 'Id_OrdenEntradad', field: 'IdOrdenEntradad' },
        { name: 'NInforme', align: 'left', label: 'NInforme', field: 'NInforme' },
        { name: 'FechaEmision', align: 'left', label: 'FechaEmisión', field: 'FechaEmision' },
       ]
      ,
      columnsTNC:[  
        // { name: 'IdInforme', align: 'left', label: 'Id', field: 'IdInforme', required: true },
        // { name: 'IdOrdenEntradad', align: 'left', label: 'Id_OrdenEntradad', field: 'IdOrdenEntradad' },
        { name: 'NTNC', align: 'left', label: 'No. TNC', field: 'NInforme' },
        {name: 'Responsable', align: 'left', label: 'Responsable', field: 'Responsable'},
        { name: 'FechaEmision', align: 'left', label: 'FechaEmisión', field: 'FechaEmision' },
       ]
      ,
      columnsAC:[  
        { name: 'IdInforme', align: 'left', label: 'Id', field: 'IdInforme', required: true },
        // { name: 'IdOrdenEntradad', align: 'left', label: 'Id_OrdenEntradad', field: 'IdOrdenEntradad' },
        { name: 'No. AC', align: 'left', label: 'NAC', field: 'NAC' },
        {name: 'Responsable', align: 'left', label: 'Responsable', field: 'Responsable'},
        { name: 'FechaEmision', align: 'left', label: 'FechaEmisión', field: 'FechaEmision' },
       ]
      ,
      vcCertificado: ['IdCertificado', 'NCertificado', 'Serialmedidor_ordenentradad'],
      viInforme: ['IdInforme', 'NInforme', 'SerialMedidor'],
      vcTNC:['NTNC','Responsable','FechaEmision' ],
      vcAC:['NAC','Responsable','FechaEmisión']
     
    }
  },
  mounted() {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.fechaIni = utils.fechaActual()
    this.fechaFin = utils.fechaActual()
    this.EntregaMedidorConsulta.Fecha = utils.fechaActual()
    this.EntregaMedidorConsulta.FechaEntrega = utils.fechaActual()
  },
  created() {
  },
  methods: {
    exportTable(tablaE, columnasE) {
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
    Cambio(value){
      if(value == 'informe'){
        this.certificado = false
        console.log('informe activo')
      }
      if(value == 'certificado'){
        this.informe = false
        console.log('certificado activo')
      } 
       
    },
    consultarordenEntregaFechas() {
      const self = this
      // estado = todasFechas, Fecha = FechaIni, FechaEntrega = FechaFin, Observacion puede tener serial medidor y Numero Certificado
      self.$q.loading.show()
      if (self.todasFechas === true) {
        self.EntregaMedidorConsulta.Estado = 1
      } else {
        self.EntregaMedidorConsulta.Estado = 0
      }
      if (self.EntregaMedidorConsulta.Id_persona === null) {
        self.EntregaMedidorConsulta.Id_persona = -1
      }

      api.post('/certificado/mostrarMedidoresEntregadosCriterioFechas/', this.EntregaMedidorConsulta)
        .then((response) => {
          self.listaMedidoresConsultaEntrega = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Mostrar Medidores Entregados ' + error)
          self.$q.loading.hide()
        })
    },
    filterFnUsuario(val, update, abort) {
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
    AutorizarCertificados(Certificados) {
      const Login = this.usuario.LoginUsuario
      this.$q.loading.show()
      api.post(`/certificado/InsertCertificadosAutorizar/${Login}`, Certificados)
        .then(response => {
          this.$q.loading.hide()
          this.consultarFiltroEntregar(this.consultaGeneral, this.todasFechas, this.fechaIni, this.fechaFin)
        }).catch(error => {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    EnviarCertificados() {
      const self = this

      let certificados = []
      for (const em of self.SelectedCertificados) {
        certificados.push(em.IdCertificado)
      }
      console.log(certificados)

      if (self.SelectedCertificados.length > 0) {
        this.$q.dialog({
          title: 'SILAMED',
          dark: true,
          message: 'Está seguro autorizar ' + self.SelectedCertificados.length + ' certificados?',
          cancel: true,
          persistent: true,
          html: true
        }).onOk(() => {

          if (certificados.length > 0) {
            self.AutorizarCertificados(certificados)
          }

        }).onCancel(() => {
        })
      }
      // else {
      //   self.step = 2
      // }
    },
    AutorizarInformes(informes) {
      const Login = this.usuario.LoginUsuario
      this.$q.loading.show()
      api.post(`/medidor/InsertInformesAutorizar/${Login}`, informes)
        .then(response => {
          this.$q.loading.hide()
          this.consultarFiltroEntregar(this.consultaGeneral, this.todasFechas, this.fechaIni, this.fechaFin)
        }).catch(error => {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    EnviarInformes() {
      const self = this

      let informes = []
      for (const em of self.SelectedInformes) {
        informes.push(em.IdInforme)
      }
      console.log(informes)

      if (self.SelectedInformes.length > 0) {
        this.$q.dialog({
          title: 'SILAMED',
          dark: true,
          message: 'Está seguro autorizar ' + self.SelectedInformes.length + ' informe?',
          cancel: true,
          persistent: true,
          html: true
        }).onOk(() => {

          if (informes.length > 0) {
            self.AutorizarInformes(informes)
          }

        }).onCancel(() => {
        })
      }
      // else {
      //   self.step = 2
      // }
    }
    ,
    guardarEntrega() {
      const self = this
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Esta seguro de guardar la entrega de medidores?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        api.post('/certificado/entregaMedidoresInsertar/', this.EntregaMedidor)
          .then((response) => {
            self.imprimirOrdenEntregaPDF(response.data.IdEntregaMedidor)
            self.isDialogComponenteGuardarEntrega = false
            let certificados = []
            for (const em of self.SelectedCertificados) {
              certificados.push(em.IdCertificado)
            }
            self.imprimirCertificadoMasivoPDF(certificados)
            this.step = 2
            self.$q.loading.hide()
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion - Guardar Entrega de medidor ' + error)
            self.$q.loading.hide()
          })
        this.step = 2
      }).onCancel(() => {
      })
    },
    imprimirCertificadoPDF(idCertificado) {
      this.$q.loading.show()
      api.get(`/certificado/certificadoImprimirPDF/${idCertificado}`, { responseType: 'arraybuffer' })
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
    imprimirCertificadoMasivoPDF(certificados) {
      this.$q.loading.show()
      api.post('/certificado/certificadoImprimirMasivoPDF/', certificados, { responseType: 'arraybuffer' })
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
    imprimirOrdenEntregaPDF(idEntregaMedidor) {
      this.$q.loading.show()
      api.get(`/certificado/entregaMedidorImprimirPDF/${idEntregaMedidor}`, { responseType: 'arraybuffer' })
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
    filterFn(val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.get(`/tercero/cliente/${val}`)
          .then((response) => {
            update(() => {
              this.listaClientes = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    agregarCliente() {
      for (var t = 0; t < this.accesos.length; t++) {
        if (this.accesos[t].Hijos !== null) {
          for (var h = 0; h < this.accesos[t].Hijos.length; h++) {
            if (this.accesos[t].Hijos[h].AspxAcceso === '/Administracion/Tercero') {
              this.componente = () => import('pages/Administracion/Tercero.vue')
              this.isDialogComponente = true
              return
            }
          }
        }
      }
    },
    getSelectdMedidores() {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} para calibrar`
    },
    regresar() {
      this.$router.push('/admin')
    },
    reiniciarCalibracion() {
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
      this.Certificado = { Id_calibracion: -1, Id_programacionorden: -1, Fechaini_calibracion: '', Fechafin_calibracion: '', Fecha_calibracion: '', Observacion_calibracion: '', Login_calibracion: '', Estado_calibracion: 1, Programacionorden: {}, LisCalibracionPrueba: [], Medidores_programacionorden: 0, Nombre_supervisor: '', Nombre_encargado: '' }
      this.CalibracionPrueba = { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Tempambini_calprueba: 0, Tempambfin_calprueba: 0, Humedadrelini_calprueba: 0, Humedadrelfin_calprueba: 0, Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] }
      this.RepeticioCP = { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Npuestobanco_repcp: 0, Volumeninicial_repcp: 0, Volumenfinal_repcp: 0, Caudal1_repcp: 0, Caudal2_repcp: 0, Caudal3_repcp: 0, Presionent1_repcp: 0, Presionent2_repcp: 0, Presionent3_repcp: 0, Presionsal1_repcp: 0, Presionsal2_repcp: 0, Presionsal3_repcp: 0, Templinea1_repcp: 0, Templinea2_repcp: 0, Templinea3_repcp: 0, Temprvm_repcp: 0, Volumenrvm_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1 }
    },
    regla(val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    formatoNumero(numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    },
    consultarFiltroEntregar(consultaGeneral, todasFechas, fechaIni, fechaFin) {
      const self = this
      let consulta = '-1'
      let todasLasFechas = 0
      let isEntregadoCertificado = 1
      let Certificado = this.certificado
      let Informe = this.informe
      let ioe = -1
      let ipo = -1
      self.SelectedCertificados = []
      const Login = this.usuario.LoginUsuario
      console.log(Login)
      self.$q.loading.show()
      if (todasFechas === true) {
        todasLasFechas = 1
      }

      if (this.Id_ordenentrada === null || this.Id_ordenentrada === '') {
        ioe = -1
      } else {
        ioe = this.Id_ordenentrada
      }
      if (this.Id_programacionorden === null || this.Id_programacionorden === '') {
        ipo = -1
      } else {
        ipo = this.Id_programacionorden
      }
      api.get(`/certificado/mostrarMedidoresEntregadosFechas/${consulta}/${isEntregadoCertificado}/${todasLasFechas}/${fechaIni}/${fechaFin}/${ioe}/${ipo}/${Login}/${this.Documento}`)
        .then((response) => {
          if(this.informe){
            self.ListaInformes = response.data
            console.log(self.ListaInformes)
          }


          if(this.certificado){
            self.ListaCertificados = response.data
            console.log(self.ListaCertificados)
          }
          
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - LisCalibraciones ' + error)
          self.$q.loading.hide()
        })
    },
    seleccionarCliente(clie) {
      if (clie != null) {
        this.cliente = clie
      }
    }
  }
}
</script>
