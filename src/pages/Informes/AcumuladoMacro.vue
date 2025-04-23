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
          Acumulado Macro
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenEntrada" >
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Código Macro" 
                  v-model="AcumuladoMacro.Codigo" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="person" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Vigencia" 
                  v-model="AcumuladoMacro.IdVigencia" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Mes" 
                  v-model="AcumuladoMacro.IdMes" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Acumulado" readonly
                  v-model="AcumuladoMacro.Acumulado" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="done_outline" size="lg" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Consultar" icon="search" outline align="center" @click="consultar(AcumuladoMacro.Codigo, AcumuladoMacro.IdVigencia, AcumuladoMacro.IdMes)" unelevated >
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
            :data="ListaSuscriptores" 
            :visible-columns="vcCriticas"
            :filter="filterSuscriptores"
            :columns="columnsSuscriptor" separator="cell">
            <template v-slot:top="props">
                <q-btn
                color="primary"
                icon-right="archive"
                label=""
                no-caps
                @click="exportTable(ListaSuscriptores, columnsSuscriptor)"
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
                :options="columnsSuscriptor"
                option-value="name"
                options-cover
                style="min-width: 150px"
                />
                <q-space />
                <q-input dense outlined debounce="300" v-model="filterSuscriptores" placeholder="Filtrar">
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
      ListaSuscriptores: [],
      AcumuladoMacro: { Codigo: 0, IdVigencia: 2022, IdMes: 1, Acumulado: 0 },
      Critica: { IdCritica: -1, IdPeriodo: -1, IdCiclo: 0, IdTipoCritica: -1, LecturaAnterior: -1, LecturaActual: -1, Consumo: -1, FechaCreacion: '', IdLector: -1, Observacion: '', IdSuscriptor: -1, IdNovedadLectura: -1, NLecturaAnterior: 0, NLecturaActual: 0, NConsumo: 0, ObservacionCritica: '', IdNovedadCritica: -1, IdTramite: null, ImagenSrc: null, IdUsuario: '', FechaCritica: '' },
      listaCriticas: [],
      vcCriticas: [ 'Codigo', 'Ruta', 'LecturaAnterior', 'LecturaActual', 'Consumo' ],
      filterSuscriptores: '',
      todasCriticas: false,
      lisModelomedidor: [],
      options: [],
      isDialogComponenteConsulta: false,
      isDialogComponenteConsultaDetalle: false,
      isDialogComponenteordenEntrada: false,
      fecha: date,
      usuario: {},
      columnsSuscriptor: [
        { name: 'IdSuscriptor', align: 'left', label: 'Id', field: 'IdSuscriptor', sortable: true },
        { name: 'Codigo', align: 'left', label: 'Codigo', field: 'Codigo', sortable: true },
        { name: 'Ruta', align: 'left', label: 'Ruta', field: 'Ruta', sortable: true },
        { name: 'NombreCompleto', align: 'left', label: 'NombreCompleto', field: 'NombreCompleto', sortable: true },
        { name: 'Direccion', align: 'left', label: 'Direccion', field: 'Direccion', sortable: true },
        { name: 'NumeroMedidor', align: 'left', label: 'Serial Medidor', field: 'NumeroMedidor', sortable: true },
        { name: 'LecturaAnterior', align: 'left', label: 'Lect. Anterior', field: 'LecturaAnterior', sortable: true },
        { name: 'LecturaActual', label: 'Lectura Actual', field: 'LecturaActual', sortable: true },
        { name: 'Consumo', label: 'Consumo', field: 'Consumo', sortable: true },
        { name: 'Promedio', label: 'Promedio', field: 'Promedio', sortable: true },
        { name: 'NovedadLectura', label: 'Novedad Lectura', field: 'NovedadLectura', sortable: true },
        { name: 'IsSuspendido', align: 'left', label: 'Susp', field: 'IsSuspendido', sortable: true },
        { name: 'IdEstadoSuscriptor', align: 'left', label: 'Estado', field: 'IdEstadoSuscriptor', sortable: true }
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

      var nombreArchivo = 'AcumuladoMacro_' + this.AcumuladoMacro.Codigo
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
    consultar (Codigo, Vigencia, Mes) {
      const self = this

      self.$q.loading.show()
      api.get(`/serviWeb/acumuladoMacro/${Codigo}/${Vigencia}/${Mes}`)
        .then((response) => {
          self.ListaSuscriptores = response.data
          let acumulado = 0
          for (const susc of self.ListaSuscriptores) {
            acumulado += susc.Consumo
          }
          self.AcumuladoMacro.Acumulado = acumulado
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Suscriptores' + error)
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