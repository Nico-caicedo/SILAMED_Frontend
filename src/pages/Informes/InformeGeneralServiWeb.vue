<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-blue-grey-3 text-black">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="system_security_update_good" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" @click="isDialogComponenteConsulta=true" />
        </q-avatar>
        <q-toolbar-title>
          Análisis Critica de Consumo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenEntrada" >
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-sm-12 col-md-6" use-chips outlined v-model="ciclosSeleccionados" 
                  :options="lisModelomedidor" label="Ciclos" multiple emit-value map-options
                  option-value="Id_marcamedidor" option-label="Nombre_marcamedidor">
                  <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" v-on="itemEvents">
                      <q-item-section>
                        <q-item-label v-html="opt.Nombre_marcamedidor" ></q-item-label>
                        </q-item-section>
                      <q-item-section side>
                        <q-checkbox color="grey" :value="selected" @input="toggleOption(opt)" />
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-checkbox color="grey" v-model="checkedCiclos" @input="checkedCiclos ? ciclosSeleccionados = lisModelomedidor.map(v => v.Id_marcamedidor) : ciclosSeleccionados = []" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="style" size="lg"/>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-sm-12 col-md-6" use-chips outlined v-model="Critica.IdLector" 
                  :options="lisModelomedidor" label="Lector o Terminal" multiple emit-value map-options
                  option-value="Id_marcamedidor" option-label="Nombre_marcamedidor">
                  <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" v-on="itemEvents">
                      <q-item-section>
                        <q-item-label v-html="opt.Nombre_marcamedidor" ></q-item-label>
                        </q-item-section>
                      <q-item-section side>
                        <q-checkbox color="grey" :value="selected" @input="toggleOption(opt)" />
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-checkbox color="grey" v-model="checkedCiclos" @input="checkedCiclos ? ciclosSeleccionados = lisModelomedidor.map(v => v.Id_marcamedidor) : ciclosSeleccionados = []" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="device_unknown" size="lg"/>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-sm-12 col-md-6" use-chips outlined v-model="Critica.IdTipoCritica" 
                  :options="lisModelomedidor" label="Tipo Crítica" multiple emit-value map-options
                  option-value="Id_marcamedidor" option-label="Nombre_marcamedidor">
                  <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" v-on="itemEvents">
                      <q-item-section>
                        <q-item-label v-html="opt.Nombre_marcamedidor" ></q-item-label>
                        </q-item-section>
                      <q-item-section side>
                        <q-checkbox color="grey" :value="selected" @input="toggleOption(opt)" />
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-checkbox color="grey" v-model="checkedCiclos" @input="checkedCiclos ? ciclosSeleccionados = lisModelomedidor.map(v => v.Id_marcamedidor) : ciclosSeleccionados = []" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="wifi_find" size="lg"/>
                  </template>
                </q-select>
                <q-toggle class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm"
                  v-model="todasCriticas"
                  checked-icon="check"
                  color="green"
                  label="Criticas Realizadas"
                  unchecked-icon="clear"
                  size="LG"
                />
              </div>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Cargar" icon="search" outline align="center" @click="consultarCriticas" unelevated >
              </q-btn>
            </div>
            <div class="q-pa-md q-gutter-md">
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
            </div>
          </div>
        </div>
        <div class="q-pa-md q-gutter-md">
            <q-table class="col-xs-12 col-sm-12 col-md-12" flat bordered 
            :data="listaCriticas" 
            :visible-columns="vcCriticas"
            :filter="filterCriticas" :columns="columnsCritica" separator="cell">
            <template v-slot:top="props">
                <q-btn
                color="primary"
                icon-right="archive"
                label=""
                no-caps
                @click="exportTable(listaCriticas, columnsCritica)"
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
                v-model="vcCriticas"
                multiple
                outlined
                dense
                options-dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columnsCritica"
                option-value="name"
                options-cover
                style="min-width: 150px"
                />
                <q-space />
                <q-input dense outlined debounce="300" v-model="filterCriticas" placeholder="Filtrar">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                <template v-slot:after>
                    <q-btn outline icon-right="autorenew" @click="CriticasPendientes()" />
                </template>
                </q-input>
            </template>
            <template v-slot:body-cell-SeleccionarCritica="props">
                <q-td key="SeleccionarCritica" :props="props" auto-width>
                <q-btn :icon="props.row.Icono" color="blue" align="center" outline label="" @click="seleccionarCritica(props.row)" v-close-popup/>
                </q-td>
            </template>
            </q-table>
        </div>
      </q-form>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteConsultaDetalle" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta Medidores x Orden</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            Orden de Entrada No. {{ ciclosSeleccionados }}
            <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
              :data="listaCriticas"
              :columns="columnsMedidoresC"
              color="red"
              row-key="Id_incidencia">
            </q-table>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Imprimir" icon="print" outline align="center" unelevated >
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
  name: 'Criticas',
  data () {
    return {
      model: null,
      checkedCiclos: [],
      ciclos: [],
      ciclosSeleccionados: [],
      Critica: { IdCritica: -1, IdPeriodo: -1, IdCiclo: 0, IdTipoCritica: -1, LecturaAnterior: -1, LecturaActual: -1, Consumo: -1, FechaCreacion: '', IdLector: -1, Observacion: '', IdSuscriptor: -1, IdNovedadLectura: -1, NLecturaAnterior: 0, NLecturaActual: 0, NConsumo: 0, ObservacionCritica: '', IdNovedadCritica: -1, IdTramite: null, ImagenSrc: null, IdUsuario: '', FechaCritica: '' },
      listaCriticas: [],
      vcCriticas: [ 'IdCritica', 'IdSuscriptor', 'RutaSuscriptor', 'IdCiclo', 'Serialmedidor', 'LecturaAnterior', 'LecturaActual', 'Consumo' ],
      filterCriticas: '',
      todasCriticas: false,
      lisModelomedidor: [],
      options: [],
      isDialogComponenteConsulta: false,
      isDialogComponenteConsultaDetalle: false,
      isDialogComponenteordenEntrada: false,
      fecha: date,
      usuario: {},
      columnsCritica: [
        { name: 'SeleccionarCritica', label: 'Seleccionar', required: true, field: 'SeleccionarCritica', sortable: true },
        { name: 'IdCritica', align: 'left', label: 'Id', field: 'IdCritica', sortable: true },
        { name: 'IdSuscriptor', align: 'left', label: 'Codigo', field: 'IdSuscriptor', sortable: true },
        { name: 'RutaSuscriptor', align: 'left', label: 'Ruta', field: 'RutaSuscriptor', sortable: true },
        { name: 'IdCiclo', align: 'left', label: 'Ciclo', field: 'IdCiclo', sortable: true },
        { name: 'Serialmedidor', align: 'left', label: 'Serial Medidor', field: 'Serialmedidor', sortable: true },
        { name: 'LecturaAnterior', align: 'left', label: 'Lect. Anterior', field: 'LecturaAnterior', sortable: true },
        { name: 'LecturaActual', label: 'Lectura Actual', field: 'LecturaActual', sortable: true },
        { name: 'Consumo', label: 'Consumo', field: 'Consumo', sortable: true },
        { name: 'IdNovedadLectura', label: 'Novedad Lectura', field: 'IdNovedadLectura', sortable: true },
        { name: 'FechaCreacion', align: 'left', label: 'FechaCreacion', field: 'FechaCreacion', sortable: true },
        { name: 'ImagenSrc', align: 'left', label: 'Imagen', field: 'ImagenSrc', sortable: true }
      ],
      columnsMedidoresC: [
        { name: 'Id_ordenentradad', label: 'Id', required: true, field: 'Id_ordenentradad', sortable: true },
        { name: 'Programado_ordenentradad', label: 'Prog', required: true, field: 'Programado_ordenentradad', sortable: true },
        { name: 'Calibrado_ordenentradad', label: 'Calib', field: 'Calibrado_ordenentradad', sortable: true },
        { name: 'Certificado_ordenentradad', label: 'Cert', field: 'Certificado_ordenentradad', sortable: true },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'Serial', field: 'Serialmedidor_ordenentradad', sortable: true },
        { name: 'Fabricacion_ordenentradad', align: 'left', label: 'AñoFab', field: 'Fabricacion_ordenentradad', sortable: true },
        { name: 'Lectura_ordenentradad', label: 'Lectura', field: 'Lectura_ordenentradad', sortable: true },
        { name: 'Nombre_marcamedidor', align: 'left', label: 'Marca Medidor', field: 'Nombre_marcamedidor', sortable: true },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'Modelo Medidor', field: 'Descripcion_modelomedidor', sortable: true },
        { name: 'Aptocalibrar_ordenentradad', align: 'left', label: 'AptoCal', field: 'Aptocalibrar_ordenentradad', sortable: true },
        { name: 'Nombre_normaref', align: 'left', label: 'Norma Referencia', field: 'Nombre_normaref', sortable: true }
      ]
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
  },
  created () {
  },
  methods: {
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

      var nombreArchivo = 'ConsultaCriticas_' + utils.fechaActual()
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
    CriticasPendientes () {

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
    consultarCriticas () {
      const self = this
      self.$q.loading.show()
      api.post('/critica/mostrarCriticasFiltro/', this.Critica)
        .then((response) => {
          if (response.data != null) {
            self.listaCriticas = response.data
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Mostrar Criticas - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })  
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} incidencia${this.selected.length > 1 ? 's' : ''} de ${this.lisIncidencias.length} incidencias`
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} `
    },
    seleccionarCritica (fila) {
      var i = this.lisMedidores.indexOf(fila)
      if (fila.Icono === 'edit') {
        fila.Icono = 'save'
        this.ordenEntradaD = this.lisMedidores[i]
        this.selected = this.lisMedidores[i].ListaIncidencias
        this.lisMarcamedidor.forEach(function marcaMed() {
          if (marcaMed.Id_marcamedidor === this.ordenEntradaD.Id_marcamedidor) {
            this.ordenEntradaD.Marcamedidor = marcaMed
            this.ordenEntradaD.Id_marcamedidor = marcaMed.Id_marcamedidor
          }
        })
        this.lisModelomedidor.forEach(function modeloMed() {
          if (modeloMed.Id_modelomedidor === this.ordenEntradaD.Id_modelomedidor) {
            this.ordenEntradaD.Modelomedidor = modeloMed
            this.ordenEntradaD.Id_modelomedidor = modeloMed.Id_modelomedidor
          }
        })
        this.lisNormareferencia.forEach(function normaR() {
          if (normaR.Id_normaref === this.ordenEntradaD.Id_normaref) {
            this.ordenEntradaD.Normaref = normaR
            this.ordenEntradaD.Id_normaref = normaR.Id_normaref
          }
        })

        utils.mensaje('Proceda a modificar el registro item ' + fila.Item_ordenentradad)
      } else {
        fila.Icono = 'edit'
        this.modificarMedidor(fila)
      }
    },
    regresar () {
      this.$router.push('/admin')
    },
    mostrarModelos (marca) {
      this.lisModelomedidor = marca.LisModelomedidor
      this.ordenEntradaD.Nombre_marcamedidor = marca.Nombre_marcamedidor
      this.ordenEntradaD.Id_marcamedidor = marca.Id_marcamedidor
      if (marca.LisModelomedidor.length < 1) {
        this.ordenEntradaD.Id_modelomedidor = ''
      }
    },
    cargarModelo (modelo) {
      this.ordenEntradaD.Descripcion_modelomedidor = modelo.Descripcion_modelomedidor
      this.ordenEntradaD.Id_modelomedidor = modelo.Id_modelomedidor
      this.ordenEntradaD.Diametronominal_modelomedidor = modelo.Diametronominal_modelomedidor
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
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    guardarCritica () {
    },
    formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    }
  }
}
</script>