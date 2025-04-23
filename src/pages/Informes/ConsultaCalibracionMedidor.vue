<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="receipt_long" />
        </q-avatar>
        <q-toolbar-title>
          Consulta Resultados Calibración de Medidor
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formConsultarCalibracionMedidores">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6 col-lg-4">
              <q-input filled v-model="SerialMedidor" label="Serial del Medidor" :rules="[val => val.length > 0 || 'Campo requerido']" />
              <div class="q-pa-md q-gutter-md">
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
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
              </div>            
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
      SerialMedidor: '',
      ListaResultados: []
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
    mostrarCalibracionMedidor (serial) {
      const self = this
      self.$q.loading.show()
      api.post('/medidor/normaReferenciaMostrar/', serial)
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
    regresar () {
      this.$router.push('/admin')
    },
    formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    }
  }
}
</script>
