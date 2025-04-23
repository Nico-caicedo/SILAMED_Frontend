<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="manage_history" />
        </q-avatar>
        <q-toolbar-title>
          Parametrización Marcas y Modelo de Medidores
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formMarcaMedidor">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
              <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                outlined
                filled
                v-model="MarcaMedidor"
                map-options emit-value option-value="MarcaMedidor"
                option-label="Nombre_marcamedidor"
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                use-input
                :options="listaMarcasMedidor"
                @filter="filterFn"
                @input="val => { mostrarModeloMedidor(val) }"
                label="Marca Medidor"
            >
                <template v-slot:prepend>
                  <q-icon name="schedule" size="lg" />
                </template>
                <template v-slot:append>
                  <q-btn icon="alarm_add" size="lg" color="blue" flat dense unelevated @click="prompt=true" />
                </template>
                <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                    <q-item-label v-html="scope.opt.Nombre_marcamedidor" />
                    <q-item-label caption>Id Marca: {{ scope.opt.Id_marcamedidor }}</q-item-label>
                    </q-item-section>
                </q-item>
                </template>
              </q-select>
            </div>
            <q-input class="col-xs-12 col-sm-2 col-md-2 q-pt-sm" stack-label label="Id Marca" v-model="MarcaMedidor.Id_marcamedidor" readonly outlined  />
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="bg-cyan text-white">
                <q-toolbar>
                  <q-btn flat round dense icon="list" />
                  <q-toolbar-title> Modelos de medidor asociados a la marca </q-toolbar-title>
                  <q-btn flat round dense icon="add_task" />
                </q-toolbar>
              </div>
              <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="listaModelosMedidor"
                :columns="columsModelosMedidor"
                :visible-columns="vcModelosMedidor"
                row-key="Id_modelomedidor">
                <template v-slot:body-cell-Editar_modelomedidor="props">
                  <q-td key="Editar_modelomedidor" :props="props" auto-width>
                    <q-btn icon="verified" color="black" align="center" outline @click="CargarModeloMedidor(props.row)"
                    v-if="props.row">
                    </q-btn>
                  </q-td>
                </template>
                <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportTable(listaModelosMedidor, columsModelosMedidor)"
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
                      v-model="vcModelosMedidor"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columsModelosMedidor"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
              </q-table>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Agregar Modelo" icon="add" outline align="center" unelevated @click="agregarModeloMedidor()" >
              </q-btn>
            </div>
            <div class="q-pa-md q-gutter-md">
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </q-page-container>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar marca de medidor</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="MarcaMedidor.Nombre_marcamedidor" autofocus @keyup.enter="prompt = false" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Agregar Marca" @click="guardarMarca()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteMedidor">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Modelo de Medidor</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">  
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" 
                    stack-label label="Id" 
                    v-model="ModeloMedidor.Id_marcamedidor"
                    readonly
                    type="number" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-8 q-pt-sm" 
                    stack-label label="Marca Medidor" 
                    v-model="MarcaMedidor.Nombre_marcamedidor"
                    readonly
                    outlined  />
                <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Modelo de Medidor" v-model="ModeloMedidor.Descripcion_modelomedidor" :rules="[ regla ]" outlined  />
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                    outlined
                    v-model="ModeloMedidor.Id_tipoindicador"
                    map-options emit-value option-value="Id_tipoindicador"
                    option-label="Nombre_tipoindicador"
                    :options="lisTipoIndicador"
                    :rules="[ regla ]"
                    label="Tipo Indicador"
                >
                    <template v-slot:prepend>
                    <q-icon name="schedule" size="lg" />
                    </template>
                </q-select>
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                    outlined
                    v-model="ModeloMedidor.Id_princfisico"
                    map-options emit-value option-value="Id_princfisico"
                    option-label="Nombre_princfisico"
                    :options="lisPrincipioFisico"
                    :rules="[ regla ]"
                    label="Principio Físico"
                >
                    <template v-slot:prepend>
                    <q-icon name="format_color_fill" size="lg" />
                    </template>
                </q-select>
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                    outlined
                    v-model="ModeloMedidor.Id_posicionmed"
                    map-options emit-value option-value="Id_posicionmed"
                    option-label="Nombre_posicionmed"
                    :options="lisPosicionMedidor"
                    :rules="[ regla ]"
                    label="Posición Medidor"
                >
                    <template v-slot:prepend>
                    <q-icon name="align_horizontal_right" size="lg" />
                    </template>
                </q-select>
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                    outlined
                    v-model="ModeloMedidor.Id_rangom3"
                    map-options emit-value option-value="Id_rangom3"
                    option-label="Nombre_rangom3"
                    :options="lisRangoM3"
                    :rules="[ regla ]"
                    label="Rango en m3"
                >
                    <template v-slot:prepend>
                    <q-icon name="design_services" size="lg" />
                    </template>
                </q-select>
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                outlined
                v-model="ModeloMedidor.Id_rangomedicion"
                map-options emit-value option-value="Id_rangomedicion"
                option-label="Nombre_rangomedicion"
                :options="lisRangomedicion"
                :rules="[ regla ]"
                label="Rango de Medición"
                >
                <template v-slot:prepend>
                    <q-icon name="hdr_enhanced_select" size="lg" />
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section aria-checked="Id_rangomedicion">
                        <q-item-label v-html="scope.opt.Nombre_rangomedicion" />
                        <q-item-label caption>IdRango: {{ scope.opt.Id_rangomedicion }}</q-item-label>
                    </q-item-section>
                    </q-item>
                </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                    stack-label label="Diametro Nominal" 
                    v-model="ModeloMedidor.Diametronominal_modelomedidor"
                    :rules="[ regla ]"
                    type="number" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="División de Escala" v-model="ModeloMedidor.Divisionescala_modelomedidor" :rules="[ regla ]" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Caudal Permanente" v-model="ModeloMedidor.Caudalpermanente_modelomedidor" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Presión Máxima" v-model="ModeloMedidor.Presionmax_modelomedidor" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Clase Precisión" v-model="ModeloMedidor.Clasepresicion_modelomedidor" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Pérdida de Presión" v-model="ModeloMedidor.Perdidapresion_modelomedidor" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Clase Temperatura" v-model="ModeloMedidor.Clasetemperatura_modelomedidor" :rules="[ regla ]" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Sensibilidad Aguas Arriba" v-model="ModeloMedidor.Sensibilidadaar_modelomedidor" :rules="[ regla ]" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Sensibilidad Aguas Abajo" v-model="ModeloMedidor.Sensibilidadaab_modelomedidor" :rules="[ regla ]" outlined  />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" @click="guardarModeloMedidor()" color="primary" />
        </q-card-actions>
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
  name: 'parametroInstrumentos',
  data () {
    return {
      model: null,
      prompt: false,
      selected: [],
      listaMarcasMedidorBD: [],
      listaMarcasMedidor: [],
      listaModelosMedidor: [],
      lisTipoIndicador: [
        { Id_tipoindicador: 'ANA', Nombre_tipoindicador: 'ANALÓGICO' },
        { Id_tipoindicador: 'DIG', Nombre_tipoindicador: 'DIGITAL' },
        { Id_tipoindicador: 'MIX', Nombre_tipoindicador: 'MIXTO' }
      ],
      lisPrincipioFisico: [
        { Id_princfisico: 1, Nombre_princfisico: 'VOLUMÉTRICO' },
        { Id_princfisico: 2, Nombre_princfisico: 'VELOCIDAD' },
        { Id_princfisico: 3, Nombre_princfisico: 'CHORRO MULTIPLE' },
        { Id_princfisico: 4, Nombre_princfisico: 'ULTRASONICO' }
      ],
      lisPosicionMedidor: [
        { Id_posicionmed: 'HOR', Nombre_posicionmed: 'HORIZONTAL' },
        { Id_posicionmed: 'NAP', Nombre_posicionmed: 'CUALQUIERA' },
        { Id_posicionmed: 'VER', Nombre_posicionmed: 'VERTICAL' }
      ],
      lisRangoM3: [
        { Id_rangom3: 1, Nombre_rangom3: '0 - 999' },
        { Id_rangom3: 2, Nombre_rangom3: '0 - 9999' },
        { Id_rangom3: 3, Nombre_rangom3: '0 - 99999' },
        { Id_rangom3: 4, Nombre_rangom3: '0 - 999999' }
      ],
      lisRangomedicion: [],
      componente: null,
      isDialogComponentetrazabilidadInstrumento: false,
      isDialogComponenteMedidor: false,
      fecha: date,
      MarcaMedidor: { Id_marcamedidor: -1, Nombre_marcamedidor: '', Estado_marcamedidor: 0, lisModelomedidor: [] },
      usuario: {},
      cliente: {},
      ModeloMedidor: { Editar_modelomedidor: null, Id_modelomedidor: -1, Id_marcamedidor: -1, Id_tipoindicador: '', Id_princfisico: null, Id_posicionmed: '', Id_rangom3: null, Id_rangomedicion: '', Diametronominal_modelomedidor: 0, Divisionescala_modelomedidor: 0, Caudalpermanente_modelomedidor: 0, Presionmax_modelomedidor: 0, Clasepresicion_modelomedidor: 0, Perdidapresion_modelomedidor: 0, Clasetemperatura_modelomedidor: '', Sensibilidadaar_modelomedidor: '', Sensibilidadaab_modelomedidor: '', Descripcion_modelomedidor: '', Fecha_modelomedidor: '', Login_modelomedidor: '', Estado_modelomedidor: 0 },
      columsModelosMedidor: [
        { name: 'Editar_modelomedidor', required: true, label: 'Editar', field: 'Editar_modelomedidor', sortable: true },
        { name: 'Id_modelomedidor', required: true, label: 'Id', field: 'Id_modelomedidor', sortable: true },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'Modelo', field: 'Descripcion_modelomedidor', sortable: true },
        { name: 'Id_marcamedidor', align: 'left', label: 'IdMM', field: 'Id_marcamedidor', sortable: true },
        { name: 'Nombre_marcamedidor', align: 'left', label: 'MarcaMedidor', field: 'Nombre_marcamedidor', sortable: true },
        { name: 'Id_princfisico', align: 'left', label: 'IdPF', field: 'Id_princfisico', sortable: true },
        { name: 'Nombre_princfisico', align: 'left', label: 'Principio Fisico', field: 'Nombre_princfisico', sortable: true },
        { name: 'Nombre_rangom3', align: 'left', label: 'RangoM3', field: 'Nombre_rangom3', sortable: true },
        { name: 'Id_rangomedicion', align: 'left', label: 'RangoMedicion', field: 'Id_rangomedicion', sortable: true },
        { name: 'Diametronominal_modelomedidor', label: 'Diam. Nom', field: 'Diametronominal_modelomedidor', sortable: true },
        { name: 'Divisionescala_modelomedidor', label: 'DivisionEscala', field: 'Divisionescala_modelomedidor', sortable: true },
        { name: 'Caudalpermanente_modelomedidor', label: 'Caudal Perm.', field: 'Caudalpermanente_modelomedidor', sortable: true },
        { name: 'Persionmax_modelomedidor', label: 'PresiónMax', field: 'Presionmax_modelomedidor', sortable: true },
        { name: 'Clasepresicion_modelomedidor', label: 'Clase Pre.', field: 'Clasepresicion_modelomedidor', sortable: true },
        { name: 'Perdidapresion_modelomedidor', label: 'Pérdida Pres.', field: 'Perdidapresion_modelomedidor', sortable: true },
        { name: 'Clasetemperatura_modelomedidor', label: 'Clase Temp.', field: 'Clasetemperatura_modelomedidor', sortable: true },
        { name: 'Sensibilidadar_modelomedidor', label: 'Sensib. Ag Ar', field: 'Sensibilidadaar_modelomedidor', sortable: true },
        { name: 'Sensibilidadab_modelomedidor', label: 'Sensib. Ag Ab', field: 'Sensibilidadaab_modelomedidor', sortable: true },
        { name: 'Fecha_modelomedidor', label: 'Fecha', field: 'Fecha_modelomedidor', sortable: true },
        { name: 'Login_modelomedidor', label: 'Login', field: 'Login_modelomedidor', sortable: true }
      ],
      vcModelosMedidor: ['Editar_modelomedidor', 'Descripcion_modelomedidor', 'Nombre_marcamedidor', 'Nombre_princfisico', 'Diametronominal_modelomedidor', 'Id_rangomedicion'],
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.mostrarMarcaMedidor(-1, '-1')
    this.mostrarRangoMedicion(-1)
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

      var nombreArchivo = 'ConsultaModelosMedidor_' + utils.fechaActual()
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
    CargarModeloMedidor (modelo) {
      const self = this
      self.ModeloMedidor = modelo
      self.isDialogComponenteMedidor = true
    },
    guardarMarca () {
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Esta seguro de guardar la marca del medidor ' + this.MarcaMedidor.Nombre_marcamedidor + '?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const self = this
        self.$q.loading.show()
        api.post(`/medidor/marcaMedidorInsertar/${self.MarcaMedidor.Nombre_marcamedidor.toUpperCase()}`)
            .then((response) => {
            self.mostrarMarcaMedidor(-1, '-1')
            self.$q.loading.hide()
            })
            .catch((error) => {
            utils.mensaje('Fallo la conexion - Guardar Programacion ' + error)
            self.$q.loading.hide()
            })
      }).onCancel(() => {
      })
    },
    filterFn (val, update, abort) {
      if (val.length === 0) {
        this.listaMarcasMedidor = this.listaMarcasMedidorBD
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        update(() => {
          this.listaMarcasMedidor = []
          for (var i = 0; i < this.listaMarcasMedidorBD.length; i++) {
            if (this.listaMarcasMedidorBD[i].Nombre_marcamedidor.includes(val.toUpperCase())) {
              update(() => {
                this.listaMarcasMedidor.push(this.listaMarcasMedidorBD[i])
                this.$q.loading.hide()
              })
            }
          }
        })
      }, 250)
    },
    mostrarRangoMedicion (rm) {
      const self = this
      self.$q.loading.show()
      api.post('/programacionorden/rangoMedicionMostrar/', rm)
        .then((response) => {
          self.lisRangomedicion = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Rango Medicion ' + error)
          self.$q.loading.hide()
        })
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} incidencia${this.selected.length > 1 ? 's' : ''} de ${this.listaMarcasMedidor.length} incidencias`
    },
    regresar () {
      this.$router.push('/admin')
    },
    agregarModeloMedidor () {
      if (this.MarcaMedidor.Id_marcamedidor > 0) {
        this.isDialogComponenteMedidor = true
        this.ModeloMedidor.Id_marcamedidor = this.MarcaMedidor.Id_marcamedidor
      } else {
        this.isDialogComponenteMedidor = false
        utils.mensaje('Debe seleccionar una marca de medidor para agregar un modelo')
      }
      
    },
    consultartrazabilidadInstrumentoFechas (consulta, filtroCl, fechaIni, fechaFin) {
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
      self.$axios.get(`/trazabilidadInstrumento/trazabilidadInstrumentoFechas/${consulta}/${clienteI}/PS01/-1/-1/-1/${fechaIni}/${fechaFin}`)
        .then((response) => {
          if (response.data != null) {
            self.listaModelosMedidor = response.data
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Consulta RC - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarMarcaMedidor (id_marcamedidor, nombre_marcamedidor) {
      const self = this
      self.$q.loading.show()
      api.get(`/medidor/marcaMedidorMostrar/${id_marcamedidor}/${nombre_marcamedidor}`)
        .then((response) => {
          self.listaMarcasMedidorBD = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Marcamedidor' + error)
          self.$q.loading.hide()
        })
    },
    mostrarModeloMedidor (marcamedidor) {
      const self = this
      self.listaModelosMedidor = []
      self.listaModelosMedidor = marcamedidor.LisModelomedidor
      self.MarcaMedidor = marcamedidor
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    guardarModeloMedidor () {
      let mensajeModelo = ''
      if (this.ModeloMedidor.Id_modelomedidor > 0) {
        mensajeModelo = 'Esta seguro de modificar el modelo del medidor ' + this.ModeloMedidor.Descripcion_modelomedidor + '?'
      } else {
        mensajeModelo = 'Esta seguro de guardar el modelo del medidor ' + this.ModeloMedidor.Descripcion_modelomedidor + '?'
      }

      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: mensajeModelo,
        cancel: true,
        persistent: true
      }).onOk(() => {
        const self = this
        self.$q.loading.show()
        self.ModeloMedidor.Descripcion_modelomedidor = self.ModeloMedidor.Descripcion_modelomedidor.toUpperCase()
        self.ModeloMedidor.Clasetemperatura_modelomedidor = self.ModeloMedidor.Clasetemperatura_modelomedidor.toUpperCase()
        self.ModeloMedidor.Sensibilidadaar_modelomedidor = self.ModeloMedidor.Sensibilidadaar_modelomedidor.toUpperCase()
        self.ModeloMedidor.Sensibilidadaab_modelomedidor = self.ModeloMedidor.Sensibilidadaab_modelomedidor.toUpperCase()
        self.ModeloMedidor.Login_modelomedidor = self.usuario.LoginUsuario

        if (self.ModeloMedidor.Id_modelomedidor > 0) {
          self.ModeloMedidorModificar()
        } else {
          self.ModeloMedidorGuardar()
        }
      }).onCancel(() => {
      })
    },
    ModeloMedidorGuardar () {
      const self = this
      // Verificar si el modelo ya existe
      for (const modelo of self.listaModelosMedidor) {
        if (modelo.Descripcion_modelomedidor === self.ModeloMedidor.Descripcion_modelomedidor) {
          self.$q.loading.hide()
          utils.mensaje('El modelo de medidor ingresado ya existe, verifique nuevamente')
          return
        }
      }
      api.post('/medidor/modeloMedidorInsertar/', self.ModeloMedidor)
      .then((response) => {
        self.listaModelosMedidor.push(response.data)
        utils.mensaje('Modelo de medidor creado con éxito')
        self.isDialogComponenteMedidor = false
        self.$q.loading.hide()
      })
      .catch((error) => {
        utils.mensaje('Fallo la conexion - Guardar Modelo Medidor ' + error)
        self.$q.loading.hide()
      })
    },
    ModeloMedidorModificar () {
      const self = this
      api.post('/medidor/modeloMedidorModificar/', self.ModeloMedidor)
      .then((response) => {
        self.listaModelosMedidor.push(response.data)
        utils.mensaje('Modelo de medidor modificado con éxito')
        self.isDialogComponenteMedidor = false
        self.$q.loading.hide()
      })
      .catch((error) => {
        utils.mensaje('Fallo la conexion - Modificar Modelo Medidor ' + error)
        self.$q.loading.hide()
      })
    },
    formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    }
  }
}
</script>
