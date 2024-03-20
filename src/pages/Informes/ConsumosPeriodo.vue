<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-blue-grey-3 text-black">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="history_toggle_off" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="erase" @click="isDialogComponenteConsulta=true" />
        </q-avatar>
        <q-toolbar-title>
          Consumos x Periodo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenEntrada" >
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-sm-12 col-md-6" use-chips outlined v-model="serviciosSeleccionados" 
                  :options="listaServicios" label="Servicio" multiple emit-value map-options
                  option-value="IdServicio" option-label="Nombre">
                  <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" v-on="itemEvents">
                      <q-item-section>
                        <q-item-label v-html="opt.Nombre" ></q-item-label>
                        </q-item-section>
                      <q-item-section side>
                        <q-checkbox color="grey" :value="selected" @input="toggleOption(opt)" />
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-checkbox color="grey" v-model="checkedServicios" @input="checkedServicios ? serviciosSeleccionados = listaServicios.map(v => v.IdServicio) : serviciosSeleccionados = []" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="wifi_find" size="lg"/>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-sm-12 col-md-6" use-chips outlined v-model="ciclosSeleccionados" 
                  :options="listaCiclos" label="Ciclo" multiple emit-value map-options
                  option-value="IdCiclo" option-label="Nombre">
                  <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" v-on="itemEvents">
                      <q-item-section>
                        <q-item-label v-html="opt.Nombre" ></q-item-label>
                        </q-item-section>
                      <q-item-section side>
                        <q-checkbox color="grey" :value="selected" @input="toggleOption(opt)" />
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-checkbox color="grey" v-model="checkedCiclos" @input="checkedCiclos ? ciclosSeleccionados = listaCiclos.map(v => v.IdCiclo) : ciclosSeleccionados = []" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="circle" size="lg"/>
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Vigencia" 
                  v-model="ConsumosPeriodo.IdVigencia" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Mes" 
                  v-model="ConsumosPeriodo.IdMes" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Consultar" icon="search" outline align="center" @click="consultar(serviciosSeleccionados, ciclosSeleccionados, ConsumosPeriodo.IdVigencia, ConsumosPeriodo.IdMes)" unelevated >
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
            :visible-columns="vcConsumosPeriodo"
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
                v-model="vcConsumosPeriodo"
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
      serviciosSeleccionados: [],
      checkedServicios: [],
      ciclosSeleccionados: [],
      checkedCiclos: [],
      ConsumosPeriodo: { IdCiclo: -1, IdServicio: -1, NombreServicio: '', IdUso: 0, Estrato: '', IdVigencia: 2022, IdMes: 1, Consumo: 0, Valor: 0, Atraso: 0, Total: 0, Suscriptores: 0, Ciclos: '', Servicios: '' },
      listaConsumos: [],
      vcConsumosPeriodo: [ 'IdServicio', 'NombreServicio', 'IdUso', 'Estrato', 'Consumo', 'Suscriptores' ],
      filterSuscriptores: '',
      todasCriticas: false,
      lisModelomedidor: [],
      options: [],
      listaServicios: [
        { IdServicio: 1, Nombre: 'Acueducto' },
        { IdServicio: 2, Nombre: 'Alcantarillado' },
        { IdServicio: 3, Nombre: 'Aseo' }
      ],
      listaCiclos: [
        { IdCiclo: 1, Nombre: 'Ciclo 1' },
        { IdCiclo: 2, Nombre: 'Ciclo 2' },
        { IdCiclo: 3, Nombre: 'Ciclo 3' },
        { IdCiclo: 4, Nombre: 'Ciclo 4' },
        { IdCiclo: 5, Nombre: 'Ciclo 5' },
        { IdCiclo: 6, Nombre: 'Ciclo 6' },
        { IdCiclo: 7, Nombre: 'Ciclo 7' },
        { IdCiclo: 8, Nombre: 'Ciclo 8' },
        { IdCiclo: 9, Nombre: 'Ciclo 9' },
        { IdCiclo: 10, Nombre: 'Ciclo 10' },
        { IdCiclo: 11, Nombre: 'Ciclo 11' },
        { IdCiclo: 12, Nombre: 'Ciclo 12' },
        { IdCiclo: 13, Nombre: 'Ciclo 13' },
        { IdCiclo: 14, Nombre: 'Ciclo 14' },
        { IdCiclo: 15, Nombre: 'Ciclo 15' },
        { IdCiclo: 16, Nombre: 'Ciclo 16' },
      ],
      isDialogComponenteConsulta: false,
      isDialogComponenteConsultaDetalle: false,
      isDialogComponenteordenEntrada: false,
      fecha: date,
      usuario: {},
      columnsSuscriptor: [
        { name: 'IdServicio', align: 'left', label: 'Servicio', field: 'IdServicio', sortable: true },
        { name: 'NombreServicio', align: 'left', label: 'NombreServicio', field: 'NombreServicio', sortable: true },
        { name: 'IdUso', align: 'left', label: 'IdEstrato', field: 'IdUso', sortable: true },
        { name: 'Estrato', align: 'left', label: 'NombreEstrato', field: 'Estrato', sortable: true },
        { name: 'Consumo', label: 'Consumo', field: 'Consumo', sortable: true },
        { name: 'Valor', label: 'Valor', field: 'Valor', sortable: true },
        { name: 'Atraso', label: 'Atraso', field: 'Atraso', sortable: true },
        { name: 'Total', label: 'Total', field: 'Total', sortable: true },
        { name: 'Suscriptores', label: 'Suscriptores', field: 'Suscriptores', sortable: true }
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

      var nombreArchivo = 'ConsumosPeriodo_' + this.ConsumosPeriodo.Codigo
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
    consultar (Servicio, Ciclo, Vigencia, Mes) {
      const self = this
      self.ListaSuscriptores = []
      self.ConsumosPeriodo.Servicios = Servicio
      self.ConsumosPeriodo.Ciclos = Ciclo
      self.ConsumosPeriodo.IdVigencia = Vigencia
      self.ConsumosPeriodo.IdMes = Mes
      self.$q.loading.show()
      api.post('/serviWeb/ConsumosPeriodo/', self.ConsumosPeriodo)
        .then((response) => {
          const listaConsumo = response.data
          for (const consumo of listaConsumo) {
            const newRegistro = {...self.ConsumosPeriodo}
            newRegistro.IdServicio = consumo[0]
            switch (newRegistro.IdServicio) {
              case 1: newRegistro.NombreServicio = 'Acueducto'
                break
              case 2: newRegistro.NombreServicio = 'Alcantarillado'
                break
              case 3: newRegistro.NombreServicio = 'Aseo'
                break
              default: newRegistro.NombreServicio = 'Sin Servicio'
                break
            }
            newRegistro.IdUso = consumo[1]
            newRegistro.Estrato = consumo[2]
            newRegistro.Valor = consumo[3]
            newRegistro.Atraso = consumo[4]
            newRegistro.Total = consumo[5]
            newRegistro.Consumo = consumo[6]
            newRegistro.Suscriptores = consumo[7]
            self.ListaSuscriptores.push(newRegistro)
          }
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