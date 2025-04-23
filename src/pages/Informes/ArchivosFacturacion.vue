<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-blue-grey-3 text-black">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="gavel" />
        </q-avatar>
        <q-toolbar-title>
          Archivos para bancos
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenBancos" >
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-md-5 q-field--with-bottom"
                  outlined
                  v-model="Reporte.IdBanco"
                  map-options emit-value option-value="IdBanco"
                  option-label="Nombre"
                  :options="listaBancos"
                  :rules="[ regla ]"
                  @input="val => { seleccionarBanco(val) }"
                  label="Archivo a Generar"
                >
                  <template v-slot:prepend>
                    <q-icon name="bookmark_border" size="lg" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.Nombre" />
                        <q-item-label caption>Código: {{ scope.opt.IdBanco }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-md-3 q-field--with-bottom"
                  outlined
                  v-model="Reporte.IdCiclo"
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
                <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" 
                  stack-label label="Vigencia" 
                  v-model="Reporte.IdVigencia" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" 
                  stack-label label="Mes" 
                  v-model="Reporte.IdMes" outlined  
                  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="generarArchivo" icon="search" outline align="center" @click="generarArchivo(Reporte.IdBanco, Reporte.IdCiclo, Reporte.IdVigencia, Reporte.IdMes)" unelevated >
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
      Reporte: { IdBanco: 0, NombreBanco: '', IdCiclo: 1, IdVigencia: 2023, IdMes: 1, Registros: 0 },
      listaBancos: [
        { IdBanco: 1, Nombre: 'BANCOOMEVA PSE'},
        { IdBanco: 2, Nombre: 'BASES GROUP BBVA'},
        { IdBanco: 3, Nombre: 'BBVA PSE'}
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
      ],
      vcSuscriptores: [ 'Codigo', 'Ruta', 'LecturaAnterior', 'LecturaActual', 'Consumo' ],
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
        //{ name: 'NumeroMedidor', align: 'left', label: 'Serial Medidor', field: 'NumeroMedidor', sortable: true },
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
    seleccionarBanco (val) {
      for (const banco of this.listaBancos) {
        if (banco.IdBanco === val) {
          this.Reporte.NombreBanco = banco.Nombre
          this.Reporte.IdBanco = banco.IdBanco
          return
        }
      }
      this.Reporte.NombreBanco = val.Nombre
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

      var nombreArchivo = 'AcumuladoMacro_' + this.Reporte.Codigo
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
    generarArchivo (IdBanco, IdCiclo, Vigencia, Mes) {
      this.$q.loading.show()
      api.get(`serviWeb/archivoFacturacionBancos/${IdBanco}/${IdCiclo}/${Vigencia}/${Mes}`, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          switch(IdBanco) {
            case 1:
              link.setAttribute('download', this.Reporte.NombreBanco + "_Ciclo_" + this.Reporte.IdCiclo + '.csv'); // Nombre sugerido del archivo
              break
            case 2:
            case 3:
              link.setAttribute('download', this.Reporte.NombreBanco + "_Ciclo_" + this.Reporte.IdCiclo + '.txt'); // Nombre sugerido del archivo
              break            
          }
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$q.loading.hide()
        }).catch(error => {
          console.log(error)
          this.$q.loading.hide()
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