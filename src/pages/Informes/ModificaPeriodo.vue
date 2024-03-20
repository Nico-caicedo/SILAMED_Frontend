<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-blue-grey-3 text-black">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="change_circle" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="delete_outline" @click="limpiar()" />
        </q-avatar>
        <q-toolbar-title>
          Abrir o Cerrar Periodo Lectura
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenEntrada" >
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-md-3 q-field--with-bottom"
                  outlined
                  v-model="Periodo.IdCiclo"
                  map-options emit-value option-value="IdCiclo"
                  option-label="Nombre"
                  :options="listaCiclos"
                  :rules="[ regla ]"
                  label="Ciclo"
                >
                  <template v-slot:prepend>
                    <q-icon name="circle" size="lg" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.Nombre" />
                        <q-item-label caption>Código: {{ scope.opt.IdCiclo }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Consultar" icon="search" outline align="center" @click="consultar(Periodo.IdCiclo)" unelevated >
              </q-btn>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Modificar" icon="save" outline align="center" @click="ActualizarPeriodo()" unelevated >
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
            :data="listaPeriodos" 
            :visible-columns="vcPeriodo"
            :columns="columnsPeriodo" separator="cell">
            <template v-slot:top="props">
              <q-btn
                color="primary"
                icon-right="archive"
                label=""
                no-caps
                @click="exportTable(listaPeriodos, columnsPeriodo)"
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
                v-model="vcPeriodo"
                multiple
                outlined
                dense
                options-dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columnsPeriodo"
                option-value="name"
                options-cover
                style="min-width: 150px"
              />
            </template>
            <template v-slot:body-cell-IsCerrado="props">
              <q-td key="IsCerrado" :props="props" auto-width>
                {{ props.row.IsCerrado }}
                <q-popup-edit label-set="Cambiar" label-cancel="Cancelar" v-model="props.row.IsCerrado" title="Estado Periodo" buttons>
                  <q-select
                    outlined
                    v-model="props.row.IsCerrado"
                    map-options emit-value option-value="Nombre"
                    option-label="Nombre"
                    :options="CerrarP"
                    label="Estado Periodo"
                  >
                    <template v-slot:prepend>
                      <q-icon name="bookmark_border" size="lg" />
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section>
                          <q-item-label v-html="scope.opt.Nombre" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
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
  name: 'PeriodoLectura',
  data () {
    return {
      model: null,
      ListaSuscriptores: [],
      Periodo: { IdPeriodo: null, FechaInicial: '', FechaFinal: '', FechaVencimiento: '', FechaSuspension: '', IdCiclo: 0, IdVigencia: 0, IdMes: 0, IdZona: 0, FechaFacturacion: '', FechaFacturacionCritica: '', FechaVencimientoCritica: '', FechaSuspensionCritica: '', IsCerrado: 0, IdUsuario: 0, FechaCreacion: '', IconoColor: 'blue', Icono: 'edit' },
      CerrarP: [
        { IsCerrado: 1, Nombre: 'Cerrado' },
        { IsCerrado: 0, Nombre: 'Abierto' }
      ],
      filterSuscriptores: '',
      listaPeriodos: [],
      options: [],
      isDialogComponenteConsulta: false,
      isDialogComponenteConsultaDetalle: false,
      isDialogComponenteordenEntrada: false,
      fecha: date,
      usuario: {},
      vcPeriodo: ['IdPeriodo', 'FechaInicial', 'FechaFinal', 'FechaVencimiento', 'FechaSuspension', 'IdCiclo', 'IdVigencia', 'IdMes', 'IsCerrado' ],
      columnsPeriodo: [
        { name: 'IdPeriodo', align: 'left', label: 'Id', field: 'IdPeriodo', sortable: true },
        { name: 'FechaInicial', align: 'left', label: 'FechaInicial', field: 'FechaInicial', sortable: true },
        { name: 'FechaFinal', align: 'left', label: 'FechaFinal', field: 'FechaFinal', sortable: true },
        { name: 'IdCiclo', align: 'left', label: 'Ciclo', field: 'IdCiclo', sortable: true },
        { name: 'IdVigencia', align: 'left', label: 'Vigen', field: 'IdVigencia', sortable: true },
        { name: 'IdMes', align: 'left', label: 'Mes', field: 'IdMes', sortable: true },
        { name: 'IsCerrado', align: 'left', label: 'Estado', field: 'IsCerrado', sortable: true },
        { name: 'FechaVencimiento', align: 'left', label: 'FechaVencimiento', field: 'FechaVencimiento', sortable: true },
        { name: 'FechaSuspension', align: 'left', label: 'FechaSuspension', field: 'FechaSuspension', sortable: true },
        { name: 'FechaFacturacion', align: 'left', label: 'FechaFacturacion', field: 'FechaFacturacion', sortable: true },
        { name: 'FechaFacturacionCritica', align: 'left', label: 'FechaFacturacionCritica', field: 'FechaFacturacionCritica', sortable: true },
        { name: 'FechaVencimientoCritica', label: 'FechaVencimientoCritica', field: 'FechaVencimientoCritica', sortable: true },
        { name: 'FechaSuspensionCritica', label: 'FechaSuspensionCritica', field: 'FechaSuspensionCritica', sortable: true },
        { name: 'FechaCreacion', label: 'FechaCreacion', field: 'FechaCreacion', sortable: true }
      ],
      listaCiclos: [
        { IdCiclo: 1, Nombre: 'Ciclo 1'},
        { IdCiclo: 2, Nombre: 'Ciclo 2'},
        { IdCiclo: 3, Nombre: 'Ciclo 3'},
        { IdCiclo: 4, Nombre: 'Ciclo 4'},
        { IdCiclo: 5, Nombre: 'Ciclo 5'},
        { IdCiclo: 6, Nombre: 'Ciclo 6'},
        { IdCiclo: 7, Nombre: 'Ciclo 7'},
        { IdCiclo: 8, Nombre: 'Ciclo 8'},
        { IdCiclo: 9, Nombre: 'Ciclo 9'},
        { IdCiclo: 10, Nombre: 'Ciclo 10'},
        { IdCiclo: 11, Nombre: 'Ciclo 11'},
        { IdCiclo: 12, Nombre: 'Ciclo 12'},
        { IdCiclo: 13, Nombre: 'Ciclo 13'},
        { IdCiclo: 14, Nombre: 'Ciclo 14'},
        { IdCiclo: 15, Nombre: 'Ciclo 15'},
        { IdCiclo: 16, Nombre: 'Ciclo 16'}
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

      var nombreArchivo = 'Periodo_' + this.Periodo.IdPeriodo
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
    ActualizarPeriodo () {
      if (this.listaPeriodos.length > 0) {
        this.AbrirPeriodo(this.listaPeriodos)
      } else {
        utils.mensaje('No existen registros para modificar')
      }
    },
    limpiar () {
      this.Periodo = { IdPeriodo: null, FechaInicial: '', FechaFinal: '', FechaVencimiento: '', FechaSuspension: '', IdCiclo: 0, IdVigencia: 0, IdMes: 0, IdZona: 0, FechaFacturacion: '', FechaFacturacionCritica: '', FechaVencimientoCritica: '', FechaSuspensionCritica: '', IsCerrado: 'Cerrado', IdUsuario: 0, FechaCreacion: '', IconoColor: 'blue', Icono: 'edit' }
      this.listaPeriodos = []
    },
    consultar (ciclo) {
      const self = this
      if (ciclo === null) {
        utils.mensaje('Debe seleccionar un ciclo de facturacion')
        return
      }
      self.$q.loading.show()
      self.listaPeriodos = []
      api.get(`/serviWeb/PeriodosActivos/${ciclo}`)
        .then((response) => {
          const listaP = response.data
          for (const periodo of listaP) {
            periodo.IconoColor = 'blue'
            periodo.Icono = 'edit'
            if (periodo.IsCerrado === 0) {
              periodo.IsCerrado = 'Abierto'
            } else {
              periodo.IsCerrado = 'Cerrado'
            }
            self.listaPeriodos.push(periodo)
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Periodos  ' + error)
          self.$q.loading.hide()
        })
    },
    regresar () {
      this.$router.push('/admin')
    },
    AbrirPeriodo (listaPeriodos) {
      const self = this
      var resultado = 0
      self.$q.loading.show()
      for (const periodo of listaPeriodos) {
        var IsCerrado = 0
        if (periodo.IsCerrado === 'Cerrado') {
          IsCerrado = 1
        }
        api.get(`/serviWeb/AbrirPeriodo/${periodo.IdPeriodo}/${IsCerrado}`)
        .then((response) => {
          resultado = resultado + response.data
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Abrir Peiodo' + error)
          self.$q.loading.hide()
        })
      }
      utils.mensaje('Registros actualizados')
      self.$q.loading.hide()
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