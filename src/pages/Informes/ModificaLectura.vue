<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-blue-grey-3 text-black">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="sync" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="delete_outline" @click="limpiar()" />
        </q-avatar>
        <q-toolbar-title>
          Modificar Ultima Lectura
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
                  stack-label label="Código" 
                  v-model="Suscriptor.Codigo" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="code" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Ruta" readonly
                  v-model="Suscriptor.Ruta" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="home" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                  stack-label label="Nombre" readonly
                  v-model="Suscriptor.NombreCompleto" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="person" size="lg" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Consultar" icon="search" outline align="center" @click="consultar(Suscriptor)" unelevated >
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
            :visible-columns="vcSuscriptor"
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
                v-model="vcSuscriptor"
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
                    <q-btn outline icon-right="autorenew" @click="Actualizar()" />
                </template>
                </q-input>
            </template>
            <template v-slot:body-cell-Seleccionar="props">
                <q-td key="Seleccionar" :props="props" auto-width>
                <q-btn :icon="props.row.Icono" :color="props.row.IconoColor" align="center" outline label="" @click="seleccionarSuscriptor(props.row)"/>
                </q-td>
            </template>
            <template v-slot:body-cell-LecturaAnterior="props">
              <q-td key="LecturaAnterior" :props="props" auto-width>
                {{ props.row.LecturaAnterior }}
                <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.LecturaAnterior" title="Ingrese Lectura Anterior" buttons>
                    <q-input type="number" v-model="props.row.LecturaAnterior" autofocus>
                    <template v-slot:prepend>
                        <q-icon name="update" size="lg" />
                    </template>
                    </q-input>
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-LecturaActual="props">
              <q-td key="LecturaActual" :props="props" auto-width>
                {{ props.row.LecturaActual }}
                <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.LecturaActual" title="Ingrese Lectura Actual" buttons>
                    <q-input type="number" v-model="props.row.LecturaActual" autofocus>
                    <template v-slot:prepend>
                        <q-icon name="update" size="lg" />
                    </template>
                    </q-input>
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-Consumo="props">
              <q-td key="Consumo" :props="props" auto-width>
                {{ props.row.Consumo }}
                <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Consumo" title="Ingrese Consumo" buttons>
                    <q-input type="number" v-model="props.row.Consumo" autofocus>
                    <template v-slot:prepend>
                        <q-icon name="update" size="lg" />
                    </template>
                    </q-input>
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-IdNovedadLectura="props">
              <q-td key="IdNovedadLectura" :props="props" auto-width>
                {{ props.row.IdNovedadLectura }}
                <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.IdNovedadLectura" title="Ingrese Id Novedad Lectura" buttons>
                    <q-input type="number" v-model="props.row.IdNovedadLectura" autofocus>
                    <template v-slot:prepend>
                        <q-icon name="update" size="lg" />
                    </template>
                    </q-input>
                </q-popup-edit>
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
      Suscriptor: { Seleccionar: 0, IdSuscriptor: 0, Codigo: '', Ruta: '', NombreCompleto: '', Direccion: '', LecturaActual: 0, LecturaAnterior: 0, Consumo: 0, Promedio: 0, IdNovedadLectura: 0, NovedadLectura: '', IdVigencia: 0, IdMes: 0, IsSuspendido: -1, IdEstadoSuscriptor: -1, IconoColor: 'blue', Icono: 'edit' },
      filterSuscriptores: '',
      todasCriticas: false,
      lisSuscriptorModificar: [],
      options: [],
      isDialogComponenteConsulta: false,
      isDialogComponenteConsultaDetalle: false,
      isDialogComponenteordenEntrada: false,
      fecha: date,
      usuario: {},
      vcSuscriptor: ['Seleccionar', 'Codigo', 'Ruta', 'NombreCompleto', 'LecturaAnterior', 'LecturaActual', 'Consumo', 'IdNovedadLectura', 'NovedadLetura', 'IdVigencia', 'IdMes'],
      columnsSuscriptor: [
        { name: 'Seleccionar', align: 'left', label: 'Seleccionar', field: 'Seleccionar', sortable: true },
        { name: 'IdSuscriptor', align: 'left', label: 'Id', field: 'IdSuscriptor', sortable: true },
        { name: 'Codigo', align: 'left', label: 'Codigo', field: 'Codigo', sortable: true },
        { name: 'Ruta', align: 'left', label: 'Ruta', field: 'Ruta', sortable: true },
        { name: 'IdCiclo', align: 'left', label: 'Ciclo', field: 'IdCiclo', sortable: true },
        { name: 'NombreCompleto', align: 'left', label: 'NombreCompleto', field: 'NombreCompleto', sortable: true },
        { name: 'Direccion', align: 'left', label: 'Direccion', field: 'Direccion', sortable: true },
        { name: 'NumeroMedidor', align: 'left', label: 'Serial Medidor', field: 'NumeroMedidor', sortable: true },
        { name: 'LecturaAnterior', align: 'left', label: 'Lect. Anterior', field: 'LecturaAnterior', sortable: true },
        { name: 'LecturaActual', label: 'Lectura Actual', field: 'LecturaActual', sortable: true },
        { name: 'ConsumoFijo', label: 'ConsFijo', field: 'ConsumoFijo', sortable: true },
        { name: 'Consumo', label: 'Consumo', field: 'Consumo', sortable: true },
        { name: 'Promedio', label: 'Promedio', field: 'Promedio', sortable: true },
        { name: 'IdNovedadLectura', label: 'IdNotL', field: 'IdNovedadLectura', sortable: true },
        { name: 'NovedadLectura', label: 'Novedad Lectura', field: 'NovedadLectura', sortable: true },
        { name: 'IsSuspendido', align: 'left', label: 'Susp', field: 'IsSuspendido', sortable: true },
        { name: 'IdEstadoSuscriptor', align: 'left', label: 'Estado', field: 'IdEstadoSuscriptor', sortable: true },
        { name: 'IdVigencia', align: 'left', label: 'Vigen', field: 'IdVigencia', sortable: true },
        { name: 'IdMes', align: 'left', label: 'Mes', field: 'IdMes', sortable: true }
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

      var nombreArchivo = 'ConsumoFijo_' + this.Suscriptor.Codigo
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
    Actualizar () {
      if (this.lisSuscriptorModificar.length > 0) {
        this.modificarLecturasSuscriptor(this.lisSuscriptorModificar)
      } else {
        utils.mensaje('No existen registros para modificar')
      }
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
    limpiar () {
      this.Suscriptor = { Seleccionar: 0, IdSuscriptor: 0, Codigo: '', Ruta: '', NombreCompleto: '', Direccion: '', LecturaActual: 0, LecturaAnterior: 0, IsSuspendido: -1, IdEstadoSuscriptor: -1, IconoColor: 'blue', Icono: 'edit' }
      this.lisSuscriptorModificar = []
      this.ListaSuscriptores = []
      this.listaConsumosFijos = []
    },
    consultar (susc) {
      const self = this
      if (susc.Codigo === '') {
        utils.mensaje('Debe ingresar un código de suscriptor')
        return
      }
      self.$q.loading.show()
      self.ListaSuscriptores = []
      api.post('/serviWeb/Suscriptor/', susc)
        .then((response) => {
          const usuario = response.data
          usuario.IconoColor = 'blue'
          usuario.Icono = 'edit'
          self.ListaSuscriptores.push(usuario)
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Suscriptores  ' + error)
          self.$q.loading.hide()
        })
    },
    getSelectedString () {
      return this.lisSuscriptorModificar.length === 0 ? '' : `${this.lisSuscriptorModificar.length} seleccionado${this.lisSuscriptorModificar.length > 1 ? 's' : ''} de ${this.lisIncidencias.length} seleccionados`
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} `
    },
    seleccionarSuscriptor (fila) {
      const self = this
      var i = this.lisSuscriptorModificar.indexOf(fila)
      if (fila.Icono === 'edit') {
        fila.Icono = 'save'
        fila.IconoColor = 'red'
        self.Suscriptor.Codigo = fila.Codigo
        self.Suscriptor.NombreCompleto = fila.NombreCompleto
        self.Suscriptor.Ruta = fila.Ruta
        self.lisSuscriptorModificar.push(fila)
      } else {
        fila.Icono = 'edit'
        fila.IconoColor = 'blue'
        self.lisSuscriptorModificar.splice(i)
        self.Suscriptor.Codigo = ''
        self.Suscriptor.NombreCompleto = ''
        self.Suscriptor.Ruta = ''
      }
    },
    regresar () {
      this.$router.push('/admin')
    },
    modificarLecturasSuscriptor (susc) {
      const self = this
      self.$q.loading.show()
      api.post('/serviWeb/modificarLecturasSuscriptor/', susc)
        .then((response) => {
          self.consultar(self.Suscriptor)
          utils.mensaje(response.data + ' Registros actualizados')
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Suscriptores' + error)
          self.$q.loading.hide()
        })
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    }
  }
}
</script>