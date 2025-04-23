<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="manage_history" />
        </q-avatar>
        <q-toolbar-title>
          Trazabilidad Instrumentos Laboratorio de medidores
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formtrazabilidadInstrumento" @submit="guardarTrazabilidad">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
              <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                outlined
                v-model="Instrumento"
                map-options emit-value option-value="Instrumento"
                option-label="Nombre_instrumento"
                :options="lisInstrumentos"
                :rules="[ regla ]"
                @input="val => { mostrarTrazabilidadInstrumento(val) }"
                label="Instrumento"
            >
                <template v-slot:prepend>
                  <q-icon name="schedule" size="lg" />
                </template>
                <template v-slot:append>
                  <q-btn icon="alarm_add" size="lg" color="blue" flat dense unelevated @click="isDialogComponenteInstrumento=true" />
                </template>
                <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                    <q-item-label v-html="scope.opt.Nombre_instrumento" />
                    <q-item-label caption>Serial Instrumento: {{ scope.opt.Serial_instrumento }}</q-item-label>
                    <q-item-label caption>Código Instrumento: {{ scope.opt.Codigo_instrumento }}</q-item-label>
                    </q-item-section>
                </q-item>
                </template>
              </q-select>
            </div>
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" readonly stack-label label="Serial" v-model="Instrumento.Serial_instrumento" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" readonly stack-label label="Código" v-model="Instrumento.Codigo_instrumento" outlined  />
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="bg-cyan text-white">
                <q-toolbar>
                  <q-btn flat round dense icon="list" />
                  <q-toolbar-title> Datos del certificado de calibración </q-toolbar-title>
                </q-toolbar>
              </div>
            </div>
            <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Certificado Calibración No." v-model="trazabilidadInstrumento.Certcalibracion_trazabilidadinst" :rules="[ regla ]" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Fecha Calibración" v-model="trazabilidadInstrumento.Fechacalibracion_trazabilidadinst" :rules="[ regla ]" type="date" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Próxima Calibración" v-model="trazabilidadInstrumento.Proximacalibracion_trazabilidadinst" :rules="[ regla ]" type="date" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" stack-label label="Fuente de Trazabilidad" v-model="trazabilidadInstrumento.Fuentecalibracion_trazabilidadinst" :rules="[ regla ]" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Error Indicación" v-model="trazabilidadInstrumento.Errorindicacion_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Error Indicación Anerior" v-model="trazabilidadInstrumento.Errorindicacionant_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Incertidumbre" v-model="trazabilidadInstrumento.Incertidumbre_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="División de escala" v-model="trazabilidadInstrumento.Divisionescala_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Corrección de escala" v-model="trazabilidadInstrumento.Correccionescala_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Incertidumbre de escala" v-model="trazabilidadInstrumento.Incertidumbreescala_trazabilidadinst" type="number" outlined step="any" />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Factor de cubrimiento" v-model="trazabilidadInstrumento.Factorcubrimiento_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Parametro de referencia" v-model="trazabilidadInstrumento.Parametroref_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Deriva" v-model="trazabilidadInstrumento.Deriva_trazabilidadinst" type="number" step="any" outlined  />
            <q-select class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom"
              outlined
              v-model="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst"
              map-options emit-value option-value="id"
              option-label="Nombre"
              :options="lisFactorCorreccion"
              :rules="[ regla ]"
              label="Factor Corrección">
            </q-select>
            <img class="col-xs-12 col-sm-12 col-md-3" src="~assets/polinomio1.png" v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst === 1" style="height: 6vh" @click="isDialogComponenteVerificarX = true"/>
            <img class="col-xs-12 col-sm-12 col-md-3" src="~assets/polinomio2.png" v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst === 2" style="height: 6vh" @click="isDialogComponenteVerificarX = true"/>
            <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" stack-label label="Nombre Variable Medición" v-model="Instrumento.Nombre_variablemedicion" outlined  />
            <q-toggle class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm"
              v-model="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst"
              v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst === 1"
              checked-icon="check"
              :true-value="1"
              :false-value="0"
              color="green"
              label="Aplica Corrección"
              unchecked-icon="clear"
            />
            <q-toggle class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm"
              v-model="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst"
              v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst === 2"
              checked-icon="check"
              :true-value="2"
              :false-value="0"
              color="green"
              label="Aplica Corrección"
              unchecked-icon="clear"
            />
            <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 1" stack-label label="Polinomio A" v-model="trazabilidadInstrumento.X_trazabilidadinst" type="number" step="any" outlined  />
            <q-select class="col-xs-12 col-sm-2 col-md-1 q-field--with-bottom"
              outlined
              v-model="trazabilidadInstrumento.Aplus_trazabilidadinst"
              map-options emit-value option-value="Aplus_trazabilidadinst"
              option-label="Aplus_trazabilidadinst"
              v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 1"
              :options="lisAplus"
              :rules="[ regla ]"
              label=""
            >
            </q-select>
            <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 0" stack-label label="Polinomio A" v-model="trazabilidadInstrumento.A_trazabilidadinst" type="number" step="any" outlined  />
            <q-select class="col-xs-12 col-sm-2 col-md-1 q-field--with-bottom"
              outlined
              v-model="trazabilidadInstrumento.Bplus_trazabilidadinst"
              map-options emit-value option-value="Bplus_trazabilidadinst"
              option-label="Bplus_trazabilidadinst"
              v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 0"
              :options="lisBplus"
              :rules="[ regla ]"
              label=""
            >
            </q-select>
            <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 0" stack-label label="Polinomio B" v-model="trazabilidadInstrumento.B_trazabilidadinst" type="number" step="any" outlined  />
            <q-select class="col-xs-12 col-sm-2 col-md-1 q-field--with-bottom"
              outlined
              v-model="trazabilidadInstrumento.Cplus_trazabilidadinst"
              map-options emit-value option-value="Cplus_trazabilidadinst"
              option-label="Cplus_trazabilidadinst"
              v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 0"
              :options="lisCplus"
              :rules="[ regla ]"
              label=""
            >
            </q-select>
            <q-input class="col-xs-12 col-sm-6 col-md-2 q-pt-sm" v-if="trazabilidadInstrumento.Factorcorreccion_trazabilidadinst > 0" stack-label label="Polinomio C" v-model="trazabilidadInstrumento.C_trazabilidadinst" type="number" step="any" outlined  />
            <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observación" v-model="trazabilidadInstrumento.Observacion_trazabilidadinst" type="textarea" outlined  />
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Guardar" icon="save" type="submit" outline align="center" unelevated @submit="guardarTrazabilidad" >
              </q-btn>
            </div>
            <div class="q-pa-md q-gutter-md">
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12">
              <div class="bg-cyan text-white">
                <q-toolbar>
                  <q-btn flat round dense icon="list" />
                  <q-toolbar-title> Trazabilidad del Instrumento </q-toolbar-title>
                  <q-btn flat round dense icon="add_task" />
                </q-toolbar>
              </div>
              <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="lisTrazabilidadInstrumento"
                :columns="columnsTrazabilidad"
                :visible-columns="vcTrazabilidad"
                row-key="Mesa_votacion">
                <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportTable(lisTrazabilidadInstrumento, columnsTrazabilidad)"
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
                      v-model="vcTrazabilidad"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsTrazabilidad"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-form>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteInstrumento" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Instrumento de Calibración</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <q-input class="col-xs-12 col-md-12 col-sm-6"
              outlined
              v-model="Instrumento.Nombre_instrumento"
              label="Nombre Instrumento"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="Instrumento.Serial_instrumento"
              label="Serial"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="Instrumento.Codigo_instrumento"
              label="Códogi"
            />
            <q-toggle class="col-xs-12 col-sm-4 col-md-3 q-field--with-bottom q-pt-sm"
              v-model="Instrumento.Activo_instrumento"
              true-value="1"
              false-value="0"
              checked-icon="check"
              color="green"
              label="Activo"
              unchecked-icon="clear"
            />          
            <q-input class="col-xs-12 col-md-12 col-sm-12"
              outlined
              v-model="Instrumento.Descripcion_instrumento"
              type="textarea"
              label="Descripción"
            />
            <div class="row justify-center q-pa-sm">
              <q-btn label="Guardar" icon="save" outline align="center" unelevated @click="consultartrazabilidadInstrumentoFechas(consulta,cliente.Id_cliente, fechaIni, fechaFin)" >
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponente" style="max-width: 500px" :maximized="true">
      <q-card>
        <q-bar>
          <div>Componente</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <component :is="componente"></component>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteVerificarX" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Verificar valor de X aplicando factor de corrección</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <q-input class="col-xs-12 col-md-12 col-sm-6"
              outlined
              v-model="Instrumento.Nombre_instrumento"
              label="Nombre Instrumento"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="Instrumento.Codigo_instrumento"
              label="Códogi"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="trazabilidadInstrumento.X_trazabilidadinst"
              type="number" step="any"
              label="Polinomio A"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="trazabilidadInstrumento.A_trazabilidadinst"
              type="number" step="any"
              label="Polinomio A"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="trazabilidadInstrumento.B_trazabilidadinst"
              type="number" step="any"
              label="Polinomio B"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="trazabilidadInstrumento.C_trazabilidadinst"
              type="number" step="any"
              label="Polinomio C"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="valorX"
              type="number" step="any"
              label="Introduce valor X"
            />
            <q-input class="col-xs-12 col-md-6 col-sm-4"
              outlined
              v-model="resultadoPolinomio"
              type="number" step="any"
              label="Resultado"
            />
            <div class="row justify-center q-pa-sm">
              <q-btn label="Calcular" icon="phonelink_setup" outline align="center" unelevated @click="verificarValorX()" >
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
  name: 'parametroInstrumentos',
  data () {
    return {
      model: null,
      selected: [],
      valorX: null,
      resultadoPolinomio: null,
      lisInstrumentos: [],
      lisTrazabilidadInstrumento: [],
      listaClientes: [],
      lisNormareferencia: [],
      lisAplus: ['+', '-'],
      lisBplus: ['+', '-'],
      lisCplus: ['+', '-'],
      lisFactorCorreccion: [
        { id: 0, Nombre: 'Sin Corrección' },
        { id: 1, Nombre: 'Corrección Grado 2' },
        { id: 2, Nombre: 'Corrección Grado 3' },
      ],
      Instrumentos: [],
      options: [],
      search: '',
      consulta: '',
      text: '',
      fechaIni: '',
      fechaFin: '',
      componente: null,
      isDialogComponente: false,
      isDialogComponentetrazabilidadInstrumento: false,
      isDialogComponenteInstrumento: false,
      isDialogComponenteVerificarX: false,
      fecha: date,
      InstrumentoSeleccionado: {},
      usuario: {},
      cliente: {},
      Instrumento: { Id_instrumento: '', IdTipoInstrumento: '', Id_variablemedicion: '', Nombre_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Activo_instrumento: false, Login_instrumento: '', Nombre_variablemedicion: '', Id_variablemedicion: '', Factorcorreccion_variablemedicion: 0,  LisTrazabilidadInstrumentos: [] },
      trazabilidadInstrumento: {
        Id_trazabilidadinst: null, Nombre_instrumento: '', Nombre_instrumento: '', Codigo_instrumento: '', Serial_instrumento: '',
        Certcalibracion_trazabilidadinst: '', Fechacalibracion_trazabilidadinst: '', Proximacalibracion_trazabilidadinst: '', Fuentecalibracion_trazabilidadinst: '',
        Errorindicacion_trazabilidadinst: null, Errorindicacionant_trazabilidadinst: null, Incertidumbre_trazabilidadinst: null, Divisionescala_trazabilidadinst: null, 
        Correccionescala_trazabilidadinst: null, Incertidumbreescala_trazabilidadinst: null, Factorcubrimiento_trazabilidadinst: null, Parametroref_trazabilidadinst: null, Ultima_trazabilidadinst: null,
        Deriva_trazabilidadinst: null, Factorcorreccion_trazabilidadinst: null, X_trazabilidadinst: null, Aplus_trazabilidadinst: '+', A_trazabilidadinst: null, Bplus_trazabilidadinst: '+', B_trazabilidadinst: null, Bplus_trazabilidadinst: '+', C_trazabilidadinst: null, Cplus_trazabilidadinst: '+', Observacion_trazabilidadinst: '', Login_trazabilidadinst: ''
      },
      trazabilidadInstrumentoGen: {},
      columnsTrazabilidad: [
        { name: 'Id_trazabilidadinst', required: true, label: 'Id', field: 'Id_trazabilidadinst', sortable: true },
        { name: 'Nombre_instrumento', align: 'left', label: 'Nombre Instrumento', field: 'Nombre_instrumento', sortable: true },
        { name: 'Codigo_instrumento', align: 'left', label: 'Código', field: 'Codigo_instrumento', sortable: true },
        { name: 'Serial_instrumento', align: 'left', label: 'Serial', field: 'Serial_instrumento', sortable: true },
        { name: 'Certcalibracion_trazabilidadinst', align: 'left', label: 'Certificado Calibración', field: 'Certcalibracion_trazabilidadinst', sortable: true },
        { name: 'Fechacalibracion_trazabilidadinst', align: 'left', label: 'Fecha Calibración', field: 'Fechacalibracion_trazabilidadinst', sortable: true },
        { name: 'Proximacalibracion_trazabilidadinst', align: 'left', label: 'Próxima Calibración', field: 'Proximacalibracion_trazabilidadinst', sortable: true },
        { name: 'Fuentecalibracion_trazabilidadinst', align: 'left', label: 'Fuente Trazabilidad', field: 'Fuentecalibracion_trazabilidadinst', sortable: true },
        { name: 'Errorindicacion_trazabilidadinst', label: 'Error Indicación', field: 'Errorindicacion_trazabilidadinst', sortable: true },
        { name: 'Errorindicacionant_trazabilidadinst', label: 'Error Indicación ant', field: 'Errorindicacionant_trazabilidadinst', sortable: true },
        { name: 'Incertidumbre_trazabilidadinst', label: 'Incertidumbre', field: 'Incertidumbre_trazabilidadinst', sortable: true },
        { name: 'Divisionescala_trazabilidadinst', label: 'Div. Escala', field: 'Divisionescala_trazabilidadinst', sortable: true },
        { name: 'Correccionescala_trazabilidadinst', label: 'Corrección Escala', field: 'Correccionescala_trazabilidadinst', sortable: true },
        { name: 'Incertidumbreescala_trazabilidadinst', label: 'Incertidumbre Escala', field: 'Incertidumbreescala_trazabilidadinst', sortable: true },
        { name: 'Factorcubrimiento_trazabilidadinst', label: 'Factor Cubrimiento', field: 'Factorcubrimiento_trazabilidadinst', sortable: true },
        { name: 'Parametroref_trazabilidadinst', label: 'Parametro Ref.', field: 'Parametroref_trazabilidadinst', sortable: true },
        { name: 'Deriva_trazabilidadinst', label: 'Devira', field: 'Deriva_trazabilidadinst', sortable: true },
        { name: 'Factorcorreccion_trazabilidadinst', label: 'Fact Corrección', field: 'Factorcorreccion_trazabilidadinst', sortable: true },
        { name: 'Ultima_trazabilidadinst', label: 'Ultima', field: 'Ultima_trazabilidadinst', sortable: true },
        { name: 'X_trazabilidadinst', label: 'Polinomio A', field: 'X_trazabilidadinst', sortable: true },
        { name: 'Aplus_trazabilidadinst', label: '+-', field: 'Aplus_trazabilidadinst', sortable: true },
        { name: 'A_trazabilidadinst', label: 'Polinomio A', field: 'A_trazabilidadinst', sortable: true },
        { name: 'Bplus_trazabilidadinst', label: '+-', field: 'Bplus_trazabilidadinst', sortable: true },
        { name: 'B_trazabilidadinst', label: 'Polinomio B', field: 'B_trazabilidadinst', sortable: true },
        { name: 'Cplus_trazabilidadinst', label: '+-', field: 'Cplus_trazabilidadinst', sortable: true },
        { name: 'C_trazabilidadinst', label: 'Polinomio C', field: 'C_trazabilidadinst', sortable: true }
      ],
      vcTrazabilidad: ['Nombre_instrumento', 'Codigo_instrumento', 'Certcalibracion_trazabilidadinst', 'Fechacalibracion_trazabilidadinst', 'Fuentecalibracion_trazabilidadinst'],
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.reiniciartrazabilidadInstrumento()
  },
  created () {
  },
  methods: {
    verificarValorX () {
      this.resultadoPolinomio = utils.verificarValorX(this.trazabilidadInstrumento, this.valorX)
    },
    verificarValorX2 () {
      let polinomio = 0
      let polinomioA1 = 0
      let polinomioA = 0
      let polinomioB = 0
      let polinomioC = 0
      let parte2 = 0
      let parte3 = 0

      polinomioA1 = parseFloat(this.trazabilidadInstrumento.X_trazabilidadinst) * parseFloat(Math.pow(this.valorX, 3))
      polinomioA = parseFloat(this.trazabilidadInstrumento.A_trazabilidadinst) * parseFloat(Math.pow(this.valorX, 2))
      polinomioB = parseFloat(this.trazabilidadInstrumento.B_trazabilidadinst) * parseFloat(this.valorX)
      polinomioC = parseFloat(this.trazabilidadInstrumento.C_trazabilidadinst)
      switch (this.Instrumento.Factorcorreccion_trazabilidadinst) {
        case 0:
          polinomio = this.valorX
          break
        case 1:
          switch (this.trazabilidadInstrumento.Bplus_trazabilidadinst) {
            case '+':
              parte2 = polinomioA + polinomioB
              break
            case '-':
              parte2 = polinomioA - polinomioB
              break
          }
          switch (this.trazabilidadInstrumento.Cplus_trazabilidadinst) {
            case '+':
              polinomio = parte2 + polinomioC
              break
            case '-':
              polinomio = parte2 - polinomioC
              break
          }
          break
        case 2: 
          switch (this.trazabilidadInstrumento.Aplus_trazabilidadinst) {
            case '+':
              parte3 = polinomioA1 + polinomioA
              break
            case '-':
              parte3 = polinomioA1 - polinomioA
              break
          }
          switch (this.trazabilidadInstrumento.Bplus_trazabilidadinst) {
            case '+':
              parte2 = parte3 + polinomioB
              break
            case '-':
              parte2 = parte3 - polinomioB
              break
          }
          switch (this.trazabilidadInstrumento.Cplus_trazabilidadinst) {
            case '+':
              polinomio = parte2 + polinomioC
              break
            case '-':
              polinomio = parte2 - polinomioC
              break
          }
      }
      this.resultadoPolinomio = polinomio
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

      var nombreArchivo = 'ConsultaTrazabilidadInstrumentos_' + utils.fechaActual()
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
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} incidencia${this.selected.length > 1 ? 's' : ''} de ${this.lisInstrumentos.length} incidencias`
    },
    regresar () {
      this.$router.push('/admin')
    },
    mostrarTrazabilidadInstrumento (instrumento) {
      const self = this
      self.trazabilidadInstrumento = {
        Id_trazabilidadinst: null, Nombre_instrumento: '', Nombre_instrumento: '', Codigo_instrumento: '', Serial_instrumento: '',
        Certcalibracion_trazabilidadinst: '', Fechacalibracion_trazabilidadinst: '', Proximacalibracion_trazabilidadinst: '', Fuentecalibracion_trazabilidadinst: '',
        Errorindicacion_trazabilidadinst: null, Errorindicacionant_trazabilidadinst: null, Incertidumbre_trazabilidadinst: null, Divisionescala_trazabilidadinst: null, 
        Correccionescala_trazabilidadinst: null, Incertidumbreescala_trazabilidadinst: null, Factorcubrimiento_trazabilidadinst: null, Parametroref_trazabilidadinst: null, Ultima_trazabilidadinst: null,
        Deriva_trazabilidadinst: null, Factorcorreccion_trazabilidadinst: null, X_trazabilidadinst: null, A_trazabilidadinst: null, B_trazabilidadinst: null, C_trazabilidadinst: null, Observacion_trazabilidadinst: '', Login_trazabilidadinst: ''
      }
      self.lisTrazabilidadInstrumento = instrumento.LisTrazabilidadInstrumentos
      instrumento.LisTrazabilidadInstrumentos.forEach(function (ultimaCalibracion) {
        if (ultimaCalibracion.Ultima_trazabilidadinst === 1) {
          self.trazabilidadInstrumento = {...ultimaCalibracion}
          self.trazabilidadInstrumento.Fechacalibracion_trazabilidadinst = ultimaCalibracion.Fechacalibracion_trazabilidadinst.slice(0, 10)
          self.trazabilidadInstrumento.Proximacalibracion_trazabilidadinst = ultimaCalibracion.Proximacalibracion_trazabilidadinst.slice(0, 10)
        }
      })
    },
    agregarCliente () {
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
    agregarInstrumento () {
      this.isDialogComponenteInstrumento = true
    },
    mostrarConsultaRCFechas () {
      this.isDialogComponentetrazabilidadInstrumento = true
    },
    reiniciartrazabilidadInstrumento () {
      const instrumento = { Id_instrumento: -1, IdTipoInstrumento: '', Id_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Medida_instrumento: -1, Activo_instrumento: -1, Certificado_instrumento: '', Fuentetrazabilidad_instrumento: '', Login_instrumento: '', LisTrazabilidadInstrumentos: [] }
      this.mostrarInstrumentos(instrumento)
      this.listaInstrumento = []
      this.trazabilidadInstrumento = {
        Id_trazabilidadinst: null, Nombre_instrumento: '', Nombre_instrumento: '', Codigo_instrumento: '', Serial_instrumento: '',
        Certcalibracion_trazabilidadinst: '', Fechacalibracion_trazabilidadinst: '', Proximacalibracion_trazabilidadinst: '', Fuentecalibracion_trazabilidadinst: '',
        Errorindicacion_trazabilidadinst: null, Errorindicacionant_trazabilidadinst: null, Incertidumbre_trazabilidadinst: null, Divisionescala_trazabilidadinst: null, 
        Correccionescala_trazabilidadinst: null, Incertidumbreescala_trazabilidadinst: null, Factorcubrimiento_trazabilidadinst: null, Parametroref_trazabilidadinst: null, Ultima_trazabilidadinst: null,
        Deriva_trazabilidadinst: null, Factorcorreccion_trazabilidadinst: null, X_trazabilidadinst: null, A_trazabilidadinst: null, B_trazabilidadinst: null, C_trazabilidadinst: null, Observacion_trazabilidadinst: '', Login_trazabilidadinst: ''
      }
      this.trazabilidadInstrumento.Fechacalibracion_trazabilidadinst = utils.fechaActual()
      this.trazabilidadInstrumento.Proximacalibracion_trazabilidadinst = utils.fechaActual()
      this.fechaIni = this.trazabilidadInstrumento.Fechacalibracion_trazabilidadinst
      this.fechaFin = this.trazabilidadInstrumento.Fechacalibracion_trazabilidadinst
      this.listaInstrumento = []
      this.filtroBuscaInstrumento = ''
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
            self.listrazabilidadInstrumento = response.data
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Consulta RC - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarInstrumentos (instrumento) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/instrumentoMostrarFiltro/', instrumento)
        .then((response) => {
          self.lisInstrumentos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Instrumentos' + error)
          self.$q.loading.hide()
        })
    },
    filterFn (val, update, abort) {
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
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    guardarTrazabilidad () {
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Esta seguro de guardar la trazabilidad del instrumento ' + this.Instrumento.Nombre_instrumento + '?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const trazabilidadInst = {...this.trazabilidadInstrumento}
        if (trazabilidadInst.A_trazabilidadinst === null) {
          this.trazabilidadInstrumento.A_trazabilidadinst = 0
          this.trazabilidadInstrumento.Aplus_trazabilidadinst = '+'
        }
        if (trazabilidadInst.B_trazabilidadinst === null) {
          this.trazabilidadInstrumento.B_trazabilidadinst = 0
          this.trazabilidadInstrumento.Bplus_trazabilidadinst = '+'
        }
        if (trazabilidadInst.C_trazabilidadinst === null) {
          this.trazabilidadInstrumento.C_trazabilidadinst = 0
          this.trazabilidadInstrumento.Cplus_trazabilidadinst = '+'
        }
        if (trazabilidadInst.Factorcorreccion_trazabilidadinst === null) {
          this.trazabilidadInstrumento.Factorcorreccion_trazabilidadinst = 0
        }
        if (trazabilidadInst.X_trazabilidadinst === null) {
          this.trazabilidadInstrumento.X_trazabilidadinst = 0
        }

        this.guardarTrazabilidadInstrumento()
      }).onCancel(() => {
      })
    },
    guardarTrazabilidadInstrumento () {
      const self = this
      self.$q.loading.show()
      self.trazabilidadInstrumento.Login_trazabilidadinst = self.usuario.LoginUsuario
      self.trazabilidadInstrumento.Id_instrumento = self.Instrumento.Id_instrumento
      api.post('/instrumento/guardarTrazabilidadInstrumento/', self.trazabilidadInstrumento)
        .then((response) => {
          self.reiniciartrazabilidadInstrumento()
          self.lisTrazabilidadInstrumento = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Guardar Programacion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarUltimaTrazabilidadInstrumento (idInstrumento) {
      const self = this
      self.$q.loading.show()
      api.get(`/trazabilidadInstrumento/tipotransaccionMostrarTipoRC/${idInstrumento}`)
        .then((response) => {
          self.lisTipoTransaccion = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion Tipo Transaccion ' + error)
          self.$q.loading.hide()
        })
    },
    filterInstrumento (val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$axios.get(`/trazabilidadInstrumento/InstrumentoMostrar/${val}/-1`)
          .then((response) => {
            update(() => {
              this.listaInstrumento = response.data
              this.$q.loading.hide()
              /* if (this.listaInstrumento.length === 1) {
                const self = this
                self.seleccionarInstrumento(self.listaInstrumento[0])
                setTimeout(function () {
                  self.agregarInstrumento()
                  self.val = ''
                }, 250)
              } */
            })
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 250)
    },
    abortFilterFn () {
      // console.log('delayed filter aborted')
    },
    formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    },
    seleccionarCliente (clie) {
      if (clie != null) {
        this.cliente = clie
      }
    }
  }
}
</script>
