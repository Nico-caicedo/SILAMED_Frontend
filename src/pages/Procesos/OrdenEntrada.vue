<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="delete" @click="nuevo" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="sync" @click="recargar" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="search" @click="isDialogComponenteConsulta=true" />
        </q-avatar>
        <q-toolbar-title>
          Orden Entrada Medidores
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenEntrada" @submit="agregarMedidor">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-4">
              <div class="bg-cyan text-white">
                <q-toolbar>
                  <q-btn flat round dense icon="list" />
                  <q-toolbar-title>{{ getSelectedString() }} </q-toolbar-title>
                  <q-btn flat round dense icon="add_task" />
                </q-toolbar>
              </div>
              <q-table class="col-xs-12 col-sm-12 col-md-3" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="lisIncidencias"
                :columns="columnsIncidencias"
                row-key="Id_incidencia"
                selection="multiple"
                :selected.sync="selected">
                <template v-slot:header-selection="scope">
                  <q-toggle v-model="scope.selected" />
                </template>
                <template v-slot:body-selection="scope">
                  <q-toggle v-model="scope.selected" dense />
                </template>
              </q-table>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8">
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Id_marcamedidor"
                  map-options emit-value option-value="Id_marcamedidor"
                  option-label="Nombre_marcamedidor"
                  :options="lisMarcamedidor"
                  :rules="[ regla ]"
                  @input="val => { mostrarModelos(val) }"
                  label="Marca Medidor"
                >
                  <template v-slot:prepend>
                    <q-icon name="bookmark_border" size="lg" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.Nombre_marcamedidor" />
                        <q-item-label caption>Código Marca: {{ scope.opt.Id_marcamedidor }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Id_modelomedidor"
                  map-options emit-value option-value="Id_modelomedidor"
                  option-label="Descripcion_modelomedidor"
                  :options="lisModelomedidor"
                  :rules="[ regla ]"
                  @input="val => { cargarModelo(val) }"
                  label="Modelo Medidor"
                >
                  <template v-slot:prepend>
                    <q-icon name="book" size="lg" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.Descripcion_modelomedidor" />
                        <q-item-label caption>Tipo Indicador: {{ scope.opt.Nombre_tipoindicador }}</q-item-label>
                        <q-item-label caption>Principio Físico: {{ scope.opt.Nombre_princfisico }}</q-item-label>
                        <q-item-label caption>Posición Meidor: {{ scope.opt.Nombre_posicionmed }}</q-item-label>
                        <q-item-label caption>Rango M3: {{ scope.opt.Nombre_rangom3 }}</q-item-label>
                        <q-item-label caption>Rango Medición: {{ scope.opt.Id_rangomedicion }}</q-item-label>
                        <q-item-label caption>Diametro Nominal: {{ scope.opt.Diametronominal_modelomedidor }} mm</q-item-label>
                        <q-item-label caption>División Escala: {{ scope.opt.Divisionescala_modelomedidor }}</q-item-label>
                        <q-item-label caption>Caudal Permanente: {{ scope.opt.Caudalpermanente_modelomedidor }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-md-7 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Id_normaref"
                  map-options emit-value option-value="Id_normaref"
                  option-label="Nombre_normaref"
                  :options="lisNormareferencia"
                  :rules="[ regla ]"
                  @input="val => { mostrarNormaRer(val) }"
                  label="Norma de Referencia"
                >
                  <template v-slot:prepend>
                    <q-icon name="style" size="lg" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section aria-checked="Id_normaref">
                        <q-item-label v-html="scope.opt.Nombre_normaref" />
                        <q-item-label caption>Parámetros: {{ scope.opt.LisNormaInfoTecnica.length }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-md-5 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Aptocalibrar_ordenentradad"
                  map-options emit-value option-value="Aptocalibrar_ordenentradad"
                  option-label="Aptocalibrar_ordenentradad"
                  :options="lisAptocalibrar"
                  :rules="[ regla ]"
                  label="Apto para calibrar"
                >
                  <template v-slot:prepend>
                    <q-icon name="schedule" size="lg" />
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" 
                  stack-label label="Código Suscriptor" 
                  v-model="ordenEntradaD.CodigoSuscriptor"
                  type="number" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" 
                  stack-label label="Año Fabricación" 
                  v-model="ordenEntradaD.Fabricacion_ordenentradad"
                  :rules="[ val => val > 0 && val.length < 5 || 'Debe ingresar un año adecuado']"
                  type="number" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Lectura Medidor" 
                  v-model="ordenEntradaD.Lectura_ordenentradad" 
                  :rules="[ val => val >= 0 && val.length <= (ordenEntradaD.Modelomedidor.Id_rangom3 + 2) || 'Debe ingresar una lectura adecuada']"
                  type="number" outlined />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Serial Medidor" v-model="ordenEntradaD.Serialmedidor_ordenentradad" :rules="[ regla ]" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Caudal Permanente (m3/h)" v-model="ordenEntradaD.Caudalpermanente_ordenentradad" v-if="caudalPermanenteVisible === true" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Presión Máxima Permisible (bar)" v-model="ordenEntradaD.Presionmax_ordenentradad" v-if="presionMaxVisible === true" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-select class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Claseprecision_ordenentradad"
                  map-options emit-value option-value="Claseprecision_ordenentradad"
                  option-label="Claseprecision_ordenentradad"
                  v-if="clasePresicionVisible === true"
                  :options="lisClasePresicion"
                  :rules="[ regla ]"
                  label="Clase Precisión"
                >
                  <template v-slot:prepend>
                    <q-icon name="join_left" size="lg" />
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Perdidapresion_ordenentradad"
                  map-options emit-value option-value="Nombre"
                  option-label="Nombre"
                  v-if="perdidaPresionVisible === true"
                  :options="lisPerdidaPresicion"
                  :rules="[ regla ]"
                  label="Pérdida Precisión (∆)"
                >
                  <template v-slot:prepend>
                    <q-icon name="punch_clock" size="lg" />
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Rango de Medición (Q3/Q1)" v-model="ordenEntradaD.Rangomedicion1_ordenentradad" v-if="rangoMedicionVisible === true" :rules="[ regla ]" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Rango de Medición (Q2/Q1)" v-model="ordenEntradaD.Rangomedicion2_ordenentradad" v-if="q2q1Visible === true" :rules="[ regla ]" step="0.10" type="number" outlined  />
                <q-select class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Clasetemperatura_ordenentradad"
                  map-options emit-value option-value="Clasetemperatura_ordenentradad"
                  option-label="Clasetemperatura_ordenentradad"
                  v-if="claseTemperaturaVisible === true"
                  :options="lisClasetemperatura"
                  :rules="[ regla ]"
                  label="Clase Temperatura"
                >
                  <template v-slot:prepend>
                    <q-icon name="thermostat_auto" size="lg" />
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Sensibilidadaar_ordenentradad"
                  map-options emit-value option-value="Sensibilidadaar_ordenentradad"
                  option-label="Sensibilidadaar_ordenentradad"
                  v-if="sensibilidadAguasArribaVisible === true"
                  :options="lisSensibilidadAAr"
                  :rules="[ regla ]"
                  label="Sensibilidad Aguas Arriba"
                >
                  <template v-slot:prepend>
                    <q-icon name="call_made" size="lg" />
                  </template>
                </q-select>
                <q-select class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Sensibilidadaab_ordenentradad"
                  map-options emit-value option-value="Sensibilidadaab_ordenentradad"
                  option-label="Sensibilidadaab_ordenentradad"
                  v-if="sensibilidadAguasAbajoVisible === true"
                  :options="lisSensibilidadAAb"
                  :rules="[ regla ]"
                  label="Sensibilidad Aguas Abajo"
                >
                  <template v-slot:prepend>
                    <q-icon name="call_received" size="lg" />
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Identificador [N(m3/h)]" v-model="ordenEntradaD.Identificador_ordenentradad" v-if="identificadorVisible === true" :rules="[ regla ]" type="number" step="0.10" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Rango o Clase Metrológica" v-model="ordenEntradaD.Clasemetrologica_ordenentradad"  :rules="[ regla ]" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="window" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Presión Nominal (bar)" v-model="ordenEntradaD.Presionnominal_ordenentradad" v-if="presionNominalVisible === true" :rules="[ regla ]" type="number" outlined  />
              </div>
            </div>
            <!-- <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
              stack-label label="Díametro Nominal (mm)" 
              v-model="ordenEntradaD.Diametronominal_ordenEntrada" 
              type="number" outlined  
            >
              <template v-slot:prepend>
                <q-icon name="settings_ethernet" size="lg" />
              </template>
            </q-input> -->
            <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observaciones" v-model="ordenEntradaD.Observacion_ordenentradad" type="textarea" outlined  />
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Terminar" icon="save" outline align="center" @click="abrirGuardar" unelevated >
              </q-btn>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Agregar" icon="add_task" type="submit" outline align="center" unelevated @submit="agregarMedidor" >
              </q-btn>
            </div>
            <div class="q-pa-md q-gutter-md">
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
            </div>
            <div class="bg-cyan text-white col-xs-12 col-sm-12 col-md-12" dense >
              <q-toolbar>
                <q-btn flat round dense icon="list" />
                <q-toolbar-title>{{ getSelectdMedidores() }} </q-toolbar-title>
              </q-toolbar>
            </div>
            <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="lisMedidores"
                :columns="columnsMedidores"
                color="red"
                row-key="Item_ordenentradad">
                <template v-slot:body-cell-Eliminar_ordenentradad="props">
                  <q-td key="Eliminar_ordenentradad" :props="props" auto-width>
                    <q-btn icon="delete" color="red" align="center" outline label="" @click="eliminarMedidor(props.row)"/>
                  </q-td>
                </template>
                <template v-slot:body-cell-Modificar_ordenentradad="props">
                  <q-td key="Modificar_ordenentradad" :props="props" auto-width>
                    <q-btn :icon="props.row.Icono" color="blue" align="center" outline label="" @click="editarMedidor(props.row)"/>
                  </q-td>
                </template>
              </q-table>
          </div>
        </div>
      </q-form>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteordenEntrada" style="max-width: 650px">
      <q-card>
        <q-bar>
          <div>Guardar Orden Entrada</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form ref="ordenEntrada" @submit="guardarOrden">  
            <div class="row q-col-gutter-sm">
              <q-input class="col-xs-12 col-sm-12 col-md-4 q-field--with-bottom"
                outlined
                stack-label
                v-model="ordenEntrada.Fechaingreso_ordenentrada"
                type="date"
                label="Fecha"
                :rules="[ regla ]"
              />
              <div class="col-xs-12 col-sm-12 col-md-8 q-field--with-bottom">
                <q-select
                  filled
                  v-model="ordenEntrada.Id_cliente"
                  map-options emit-value option-value="Id_cliente"
                  option-label="Razonsocial_cliente" :options="listaClientes"
                  clearable
                  use-input
                  hide-dropdown-icon
                  hide-selected
                  fill-input
                  input-debounce="0"
                  label="Cliente"
                  :rules="[ regla ]"
                  @filter="filterFn"
                  @input="val => { seleccionarCliente(val) }"
                >
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
                        <q-item-label caption>Identificación: {{scope.opt.Codigo_cliente}} - Id Cliente: {{scope.opt.Id_cliente}} - Id Zona: {{scope.opt.Id_zona}}</q-item-label>
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
              <q-input class="col-xs-12 col-sm-12 col-md-12 q-field--with-bottom"
                outlined
                stack-label
                v-model="ordenEntrada.Observacion_ordenentrada"
                type="textarea"
                label="Observación"
              />
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Guardar" icon="save" outline align="center" unelevated type="submit" @submit="guardarOrden" >
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteAgregarMedidoresOrden" style="max-width: 650px">
      <q-card>
        <q-bar>
          <div>Seleccione una opción</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form ref="ordenEntradaOpcion">  
            <div class="row justify-center q-pa-sm">
              <q-btn label="Imprimir" icon="print" outline align="center" unelevated @click="isDialogComponenteConsultaDetalle = true" >
              </q-btn>
              <q-btn label="Agregar Medidores" icon="add_task" outline align="center" unelevated @click="agregarMedidoresOrden" >
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
            <div>Consulta Ordenes de Entrada</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="col-xs-12 col-sm-12 col-md-9 q-field--with-bottom">
              <q-select
                filled
                v-model="ordenB.Id_cliente"
                map-options emit-value option-value="Id_cliente"
                option-label="Razonsocial_cliente" :options="listaClientes"
                clearable
                use-input
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                label="Todos los clientes"
                @filter="filterFn"
                @input="val => { seleccionarCliente(val) }"
              >
                <template v-slot:prepend>
                <q-icon name="person" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.Razonsocial_cliente" />
                      <q-item-label caption>Identificación: {{scope.opt.Codigo_cliente}} - Id Cliente: {{scope.opt.Id_cliente}} - Id Zona: {{scope.opt.Id_zona}}</q-item-label>
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
                <q-select
                filled
                v-model="ordenB.Login_ordenentrada"
                map-options emit-value option-value="LoginUsuario"
                option-label="NombrePersona"
                :options="listaUsuarios"
                use-input
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                label="Todos los usuarios"
                clearable
                @filter="filterFnUsuario"
                >
                <template v-slot:prepend>
                <q-icon name="supervisor_account" size="lg" />
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                        <q-item-label v-html="scope.opt.NombrePersona" />
                        <q-item-label caption>Login: {{scope.opt.LoginUsuario}} </q-item-label>
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
            <q-input class="col-xs-12 col-md-12 col-sm-12"
              outlined
              v-model="ordenB.Observacion_ordenentrada"
              label="Observación"
            />
            <q-toggle class="col-xs-12 col-sm-4 col-md-3 q-field--with-bottom q-pt-sm"
              v-model="todasFechas"
              checked-icon="check"
              color="green"
              label="Consultar todas las fechas"
              unchecked-icon="clear"
            />
            <q-input class="col-xs-12 col-sm-4 col-md-4"
              outlined
              stack-label
              v-model="ordenB.FechaIni"
              type="date"
              label="Fecha Desde"
              :readonly="todasFechas === true"
            />
            <q-input class="col-xs-12 col-sm-4 col-md-4"
              outlined
              stack-label
              v-model="ordenB.FechaFin"
              type="date"
              label="Fecha Hasta"
              :readonly="todasFechas === true"
            />
            <div class="row justify-center q-pa-sm">
              <q-btn label="Consultar" icon="search" outline align="center" unelevated @click="consultarordenEntradaFechas()" >
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 q-field--with-bottom">
              <q-table class="col-md-12" dense title="Resumen Ordenes de Entrada" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                >
                <template v-slot:bottom-row>
                  <q-tr>
                    <q-td colspan="2" align="center">
                    </q-td>
                    <q-td align="left">
                      <b> Total Registros </b>
                    </q-td>
                    <q-td align="left">
                      <b> {{ formatoNumero(lisordenEntradaB.length, 0) }} </b>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-list>
                <q-item v-for="rc in lisordenEntradaB" :key="rc.Id_ordenentrada" @click.native="accionOrdenEntrada(rc)" class="q-my-sm" clickable>
                  <q-item-section avatar>
                    <q-icon name="receipt" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label> <b> {{ rc.Razonsocial_cliente }} </b> </q-item-label>
                    <q-item-label>
                      Id ordenEntrada: {{ rc.Id_ordenentrada }} <br/>
                      Medidores: {{ rc.LisOrdenEntradaD.length }} <br/>
                      Observaciones: {{ rc.Observacion_ordenentrada }} <br/>
                      Login:  {{ rc.Login_ordenentrada }} <br/>
                      Fecha:  {{ rc.Fechaingreso_ordenentrada }} <br/>
                    </q-item-label>
                    <q-separator />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
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
            Orden de Entrada No. {{ ordenEntradaNumero }}
            <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
              :data="lisMedidoresB"
              :columns="columnsMedidoresC"
              color="red"
              row-key="Id_incidencia">
            </q-table>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Imprimir" icon="print" outline align="center" unelevated @click="ordenEntradaImprimirPDF(ordenEntradaNumero)">
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
  </q-layout>
</template>
<script>
import { api } from 'boot/axios'
import utils from '../../commons/utils.js'
import { date } from 'quasar'

export default {
  name: 'ordenEntradaD',
  data () {
    return {
      model: null,
      NombreCliente: '',
      ordenEntradaNumero: 0,
      presionMaxVisible: false,
      caudalPermanenteVisible: false,
      clasePresicionVisible: false,
      perdidaPresionVisible: false,
      rangoMedicionVisible: false,
      q2q1Visible: false,
      claseTemperaturaVisible: false,
      sensibilidadAguasArribaVisible: false,
      sensibilidadAguasAbajoVisible: false,
      identificadorVisible: false,
      claseMetrologicaVisible: false,
      presionNominalVisible: false,
      todasFechas: false,
      Normaref: { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [] },
      selected: [],
      listaUsuarios: [],
      lisMedidores: [],
      lisMedidoresB: [],
      lisMarcamedidor: [],
      lisModelomedidor: [],
      lisordenEntrada: [],
      lisordenEntradaB: [],
      listaClientes: [],
      lisNormareferencia: [],
      lisAptocalibrar: ['SI', 'NO'],
      lisClasemetrologica: ['A', 'B', 'C', 'D'],
      lisClasetemperatura: ['T30', 'T50', 'T70', 'T90', 'T130', 'T180', 'T30/70'],
      lisSensibilidadAAr: ['U0', 'U3', 'U5', 'U15', 'U0S', 'U3S', 'U5S', 'U10S'],
      lisSensibilidadAAb: ['D0', 'D3', 'D5', 'D05', 'D35'],
      lisCaudalPermanente: [
        '1.6', '2', '2.8'
      ],
      lisClasePresicion: [
        '1', '2', '3'
      ],
      lisPerdidaPresicion: [],
      ordenEntrada: {Id_ordenentrada: -1, Id_cliente: '', Observacion_ordenentrada: '', Fechaingreso_ordenentrada: '', Fecha_ordenentrada: '', Login_ordenentrada: '', Estado_ordenentrada: 1, LisOrdenEntradaD: [] },
      ordenB: {Id_ordenentrada: 0, Id_cliente: '', Observacion_ordenentrada: '', Fechaingreso_ordenentrada: '', Fecha_ordenentrada: '', Login_ordenentrada: '', Estado_ordenentrada: 1, LisOrdenEntradaD: [], FechaIni: '', FechaFin: '' },
      options: [],
      componente: null,
      isDialogComponenteConsulta: false,
      isDialogComponenteConsultaDetalle: false,
      isDialogComponente: false,
      isDialogComponenteordenEntrada: false,
      isDialogComponenteAgregarMedidoresOrden: false,
      lisIncidencias: [],
      fecha: date,
      usuario: {},
      cliente: {},
      ordenEntradaD: { Id_ordenentradad: -1, Id_ordenentrada: -1, Id_marcamedidor: -1, Id_modelomedidor: -1, Id_normaref: -1, Aptocalibrar_ordenentradad: '', CodigoSuscriptor: '', Fabricacion_ordenentradad: null, Lectura_ordenentradad: null, Serialmedidor_ordenentradad: '', Diametronominal_ordenentradad: 0, Caudalpermanente_ordenentradad: 0, Claseprecision_ordenentradad: 0, Presionmax_ordenentradad: 0, Perdidapresion_ordenentradad: '',
        Rangomedicion1_ordenentradad: 0, Rangomedicion2_ordenentradad: 0, Clasetemperatura_ordenentradad: '', Sensibilidadaar_ordenentradad: '', Sensibilidadaab_ordenentradad: '', Identificador_ordenentradad: 0, Clasemetrologica_ordenentradad: '', Precisionnominal_ordenentradad: 0, Observacion_ordenentradad: '', Estado_ordenentradad: 0, Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Nombre_normaref: '', Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: '' }, Modelomedidor: { Id_modelomedidor: null, Descripcion_modelomedidor: '' }, Programado_ordenentradad: 0, Calibrado_ordenentradad: 0, Certificado_ordenentradad: 0, Entregado_ordenentradad: 0, Estado_ordenentradad: 1, Icono: 'edit', Incidencias: 0, ListaIncidencias: [] },
      columnsIncidencias: [
        {
          name: 'Id_incidencia',
          required: true,
          label: 'Id',
          field: 'Id_incidencia',
          sortable: true
        },
        { name: 'Nombre_incidencia', align: 'left', label: 'Nombre Incidencia', field: 'Nombre_incidencia', sortable: true }
      ],
      vcCP: ['Id_tiporecicaja', 'Nombre_tiporecicaja'],
      columnsMedidores: [
        { name: 'Eliminar_ordenentradad', label: 'Del', required: true, field: 'Eliminar_ordenentradad', sortable: true },
        { name: 'Modificar_ordenentradad', label: 'Edit', required: true, field: 'Modificar_ordenentradad', sortable: true },
        { name: 'Item_ordenentradad', align: 'left', label: 'Item', field: 'Item_ordenentradad', sortable: true },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'Serial', field: 'Serialmedidor_ordenentradad', sortable: true },
        { name: 'Fabricacion_ordenentradad', align: 'left', label: 'AñoFab', field: 'Fabricacion_ordenentradad', sortable: true },
        { name: 'Lectura_ordenentradad', label: 'Lectura', field: 'Lectura_ordenentradad', sortable: true },
        { name: 'Nombre_marcamedidor', align: 'left', label: 'Marca Medidor', field: 'Nombre_marcamedidor', sortable: true },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'Modelo Medidor', field: 'Descripcion_modelomedidor', sortable: true },
        { name: 'Aptocalibrar_ordenentradad', align: 'left', label: 'AptoCal', field: 'Aptocalibrar_ordenentradad', sortable: true },
        { name: 'Diametronominal_ordenentradad', align: 'left', label: 'DNom', field: 'Diametronominal_ordenentradad', sortable: true },
        { name: 'Nombre_normaref', align: 'left', label: 'Norma Referencia', field: 'Nombre_normaref', sortable: true },
        { name: 'Incidencias', align: 'left', label: 'Incidencias', field: 'Incidencias' }
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
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.reiniciarordenEntrada()
  },
  created () {
  },
  methods: {
    nuevo () {
      this.ordenEntrada = {Id_ordenentrada: -1, Id_cliente: '', Observacion_ordenentrada: '', Fechaingreso_ordenentrada: '', Fecha_ordenentrada: '', Login_ordenentrada: '', Estado_ordenentrada: 1, LisOrdenEntradaD: [] }
      this.lisMedidores = []
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
    abrirGuardar () {
      if (this.lisMedidores.length > 0) {
        this.isDialogComponenteordenEntrada = true
      } else {
        utils.dialog('Ingrese al menos un medidor para guardar la orden')
      }
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} incidencia${this.selected.length > 1 ? 's' : ''} de ${this.lisIncidencias.length} incidencias`
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} `
    },
    eliminarMedidor (fila) {
      // const self = this
      fila.Estado_ordenentradad = 0
      fila.Icono = 'recycling'
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de eliminar el item ' + fila.Item_ordenentradad + '?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (fila.Id_ordenentradad > 0) {
          for (const medidor of this.lisMedidores) {
            if (medidor.Item_ordenentradad === fila.Item_ordenentradad) {
              medidor.Icono = 'recycling'
              medidor.Estado_ordenentradad = 0
              this.lisMedidores.push(medidor)
              break
            }
          }
        }
        var i = this.lisMedidores.indexOf(fila)
        this.lisMedidores.splice(i, 1)
      }).onCancel(() => {
      })
    },
    editarMedidor (fila) {
      const self = this
      if (fila.Icono === 'edit' || fila.Icono === 'https') {
        self.selected = fila.ListaIncidencias
        self.mostrarModeloMedidorIdMarca(fila.Id_marcamedidor)
        self.ordenEntradaD.Id_modelomedidor = fila.Id_modelomedidor
        self.mostrarNormaRer(fila.Id_normaref)
        fila.Icono = 'save'
        self.ordenEntradaD = fila
        utils.mensaje('Proceda a modificar el registro item ' + fila.Item_ordenentradad)

        /* self.lisMarcamedidor.forEach(function marcaMed() {
          if (marcaMed.Id_marcamedidor === fila.Id_marcamedidor) {
            self.ordenEntradaD.Marcamedidor = marcaMed
            // this.lisMarcamedidor = fila.Id_marcamedidor
          }
        })
        self.lisModelomedidor.forEach(function modeloMed() {
          if (modeloMed.Id_modelomedidor === fila.Id_modelomedidor) {
            self.ordenEntradaD.Modelomedidor = modeloMed
            self.ordenEntradaD.Id_modelomedidor = modeloMed.Id_modelomedidor
          }
        })
        self.lisNormareferencia.forEach(function normaR() {
          if (normaR.Id_normaref === fila.Id_normaref) {
            self.ordenEntradaD.Normaref = normaR
            self.ordenEntradaD.Id_normaref = normaR.Id_normaref
          }
        }) */
      }
    },
    regresar () {
      this.$router.push('/admin')
    },
    mostrarNormaRer (idNorma) {
      const self = this
      this.caudalPermanenteVisible = false
      this.clasePresicionVisible = false
      this.presionMaxVisible = false
      this.perdidaPresionVisible = false
      this.rangoMedicionVisible = false
      this.q2q1Visible = false
      this.claseTemperaturaVisible = false
      this.sensibilidadAguasArribaVisible = false
      this.sensibilidadAguasAbajoVisible = false
      this.identificadorVisible = false
      this.claseMetrologicaVisible = false
      this.presionNominalVisible = false
      for (const norma of self.lisNormareferencia) {
        if (norma.Id_normaref === idNorma) {
          this.ordenEntradaD.Nombre_normaref = norma.Nombre_normaref
          this.ordenEntradaD.Id_normaref = norma.Id_normaref
          this.lisPerdidaPresicion = norma.LisPerdidaPresion
          norma.LisNormaInfoTecnica.forEach(function (acceso) {
            switch(acceso.Id_infotecnica) {
              case 1:
                break;
              case 2:
                self.caudalPermanenteVisible = true
                break
              case 3:
                self.clasePresicionVisible = true
                break
              case 4:
                self.presionMaxVisible = true
                break;
              case 5:
                self.perdidaPresionVisible = true
                break;
              case 6:
                self.rangoMedicionVisible = true
                break
              case 7:
                self.q2q1Visible = true
                break
              case 8:
                self.claseTemperaturaVisible = true
                break
              case 9:
                self.sensibilidadAguasArribaVisible = true
                break
              case 10:
                self.sensibilidadAguasAbajoVisible = true
                break
              case 11:
                self.identificadorVisible = true
                break
              case 12:
                self.claseMetrologicaVisible = true
                break
              case 13:
                self.presionNominalVisible = true
                break
            }
          })
        }
      }
    },
    mostrarModelos (idMarca) {
      this.lisModelomedidor = []
      this.ordenEntradaD.Id_modelomedidor = null
      this.mostrarModeloMedidorIdMarca(idMarca)
    },
    cargarModelo (idModelo) {
      for (const modelo of this.lisModelomedidor) {
        if (modelo.Id_modelomedidor === idModelo) {
          this.ordenEntradaD.Descripcion_modelomedidor = modelo.Descripcion_modelomedidor
          this.ordenEntradaD.Id_modelomedidor = modelo.Id_modelomedidor
          this.ordenEntradaD.Diametronominal_ordenentradad = modelo.Diametronominal_modelomedidor
          this.ordenEntradaD.Caudalpermanente_ordenentradad = modelo.Caudalpermanente_modelomedidor
          this.ordenEntradaD.Rangomedicion1_ordenentradad = 0
          this.ordenEntradaD.Clasemetrologica_ordenentradad = modelo.Id_rangomedicion
          this.ordenEntradaD.Rangomedicion2_ordenentradad = 1.6
          this.ordenEntradaD.Presionmax_ordenentradad = modelo.Presionmax_modelomedidor
          this.ordenEntradaD.Claseprecision_ordenentradad = modelo.Clasepresicion_modelomedidor
          this.ordenEntradaD.Perdidapresion_ordenentradad = modelo.Perdidapresion_modelomedidor
          this.ordenEntradaD.Clasetemperatura_ordenentradad = modelo.Clasetemperatura_modelomedidor
          this.ordenEntradaD.Sensibilidadaar_ordenentradad = modelo.Sensibilidadaar_modelomedidor
          this.ordenEntradaD.Sensibilidadaab_ordenentradad = modelo.Sensibilidadaab_modelomedidor
          this.ordenEntradaD.Modelomedidor = modelo
        }
      }
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
    recargar () {
      this.mostrarMarcaMedidor(-1, '-1')
      const norma = { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [], LisPerdidaPresicion: [] }
      this.mostrarNormaReferencia(norma)
      const incidencia = { Id_incidencia: -1, Nombre_incidencia: '' }
      this.mostrarIncidencias(incidencia)
    },
    reiniciarordenEntrada () {
      // this.ordenEntradaD = { Id_puse: 'PS01', Login_ordenEntrada: this.usuario.LoginUsuario, Numero_ordenEntrada: '0', Valor_ordenEntrada: 0, Observaciones_ordenEntrada: '' }
      this.mostrarMarcaMedidor(-1, '-1')
      this.selected = []
      const norma = { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [], LisPerdidaPresicion: [] }
      this.mostrarNormaReferencia(norma)
      const incidencia = { Id_incidencia: -1, Nombre_incidencia: '' }
      this.mostrarIncidencias(incidencia)
      this.ordenEntrada.Fechaingreso_ordenentrada = utils.fechaActual()
      this.ordenEntrada.Login_ordenentrada = this.usuario.LoginUsuario
      this.ordenB.FechaIni = this.ordenEntrada.Fechaingreso_ordenentrada
      this.ordenB.FechaFin = this.ordenEntrada.Fechaingreso_ordenentrada
      this.listaClientes = []
      this.lisMedidores = []
    },
    consultarordenEntradaFechas () {
      const self = this
      if (self.todasFechas === true) {
        self.ordenB.Id_ordenentrada = 1
      } else {
        self.ordenB.Id_ordenentrada = 0
      }
      self.$q.loading.show()
      api.post('/ordenentrada/OrdenentradaMostrarFiltro/', this.ordenB)
        .then((response) => {
          if (response.data != null) {
            self.lisordenEntradaB = response.data
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Consulta Orden - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
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
    mostrarModeloMedidorIdMarca (id_marcamedidor) {
      const self = this
      self.$q.loading.show()
      api.get(`/medidor/modeloMedidorMostrarIdMarca/${id_marcamedidor}`)
        .then((response) => {
          self.lisModelomedidor = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Marcamedidor' + error)
          self.$q.loading.hide()
        })
    },
    mostrarNormaReferencia (norma) {
      const self = this
      self.$q.loading.show()
      api.post('/medidor/normaReferenciaMostrar/', norma)
        .then((response) => {
          self.lisNormareferencia = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Norma Referencia ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarIncidencias (incidencia) {
      const self = this
      self.$q.loading.show()
      api.post('/medidor/incidenciasMostrar/', incidencia)
        .then((response) => {
          self.lisIncidencias = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Incidencias ' + error)
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
    guardarOrden () {
      const self = this
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de guardar la orden?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (this.ordenEntrada.Id_ordenentrada < 0) {
          this.guardar()
        } else {
          this.modificar()
        }
      }).onCancel(() => {
      })
    },
    guardar () {
      const self = this
      self.$q.loading.show()
      self.ordenEntrada.LisOrdenEntradaD = self.lisMedidores
      api.post('/ordenentrada/OrdenentradaInsertar/', this.ordenEntrada)
        .then((response) => {
          self.ordenEntrada = response.data
          self.$q.loading.hide()
          self.isDialogComponenteordenEntrada = false
          self.ordenEntradaD = { Id_ordenentradad: -1, Id_ordenentrada: -1, Id_marcamedidor: -1, Id_modelomedidor: -1, Id_normaref: -1, Diametronominal_ordenentradad: 0, Aptocalibrar_ordenentradad: null, Fabricacion_ordenentradad: 0, Lectura_ordenentradad: 0, Serialmedidor_ordenentradad: '', Caudalpermanente_ordenentradad: 0, Claseprecision_ordenentradad: 0, Presionmax_ordenentradad: 0, Perdidapresion_ordenentradad: '',
            Rangomedicion1_ordenentradad: 0, Rangomedicion2_ordenentradad: 0, Clasetemperatura_ordenentradad: '', Sensibilidadaar_ordenentradad: '', Sebsibilidadaab_ordenentradad: '', Identificador_ordenentradad: 0, Clasemetrologica_ordenentradad: '', Precisionnominal_ordenentradad: 0, Observacion_ordenentradad: '', Estado_ordenentradad: 0, Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Nombre_normaref: '', Normaref: { Id_normaref: null, Nombre_normaref: '' }, Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: '' }, Modelomedidor: { Id_modelomedidor: null, Descripcion_modelomedidor: '' }, Icono: 'edit', Incidencias: 0, ListaIncidencias: [] }
          this.reiniciarordenEntrada()
          this.$q.dialog({
            title: 'SILAMED',
            dark: true,
            message: 'Orden de entrada guardada con éxito, Deseas imprimir?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.ordenEntradaImprimirPDF(self.ordenEntrada.Id_ordenentrada)
          }).onCancel(() => {
          })
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    modificar () {
      const self = this
      self.$q.loading.show()
      self.ordenEntrada.LisOrdenEntradaD = self.lisMedidores
      api.post('/ordenentrada/OrdenentradaModificar/', this.ordenEntrada)
        .then((response) => {
          self.ordenEntrada = response.data
          self.$q.loading.hide()
          self.isDialogComponenteordenEntrada = false
          self.ordenEntradaD = { Id_ordenentradad: -1, Id_ordenentrada: -1, Id_marcamedidor: -1, Id_modelomedidor: -1, Id_normaref: -1, Diametronominal_ordenentradad: 0, Aptocalibrar_ordenentradad: null, Fabricacion_ordenentradad: 0, Lectura_ordenentradad: 0, Serialmedidor_ordenentradad: '', Caudalpermanente_ordenentradad: 0, Claseprecision_ordenentradad: 0, Presionmax_ordenentradad: 0, Perdidapresion_ordenentradad: '',
            Rangomedicion1_ordenentradad: 0, Rangomedicion2_ordenentradad: 0, Clasetemperatura_ordenentradad: '', Sensibilidadaar_ordenentradad: '', Sebsibilidadaab_ordenentradad: '', Identificador_ordenentradad: 0, Clasemetrologica_ordenentradad: '', Precisionnominal_ordenentradad: 0, Observacion_ordenentradad: '', Estado_ordenentradad: 0, Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Nombre_normaref: '', Normaref: { Id_normaref: null, Nombre_normaref: '' }, Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: '' }, Modelomedidor: { Id_modelomedidor: null, Descripcion_modelomedidor: '' }, Icono: 'edit', Incidencias: 0, ListaIncidencias: [] }
          this.reiniciarordenEntrada()
          this.$q.dialog({
            title: 'SILAMED',
            dark: true,
            message: 'Orden de entrada guardada con éxito, Deseas imprimir?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.ordenEntradaImprimirPDF(self.ordenEntrada.Id_ordenentrada)
          }).onCancel(() => {
          })
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    accionOrdenEntrada (orden) {
      this.isDialogComponenteAgregarMedidoresOrden = true
      this.lisMedidoresB = orden.LisOrdenEntradaD
      this.lisMedidores = []
      this.ordenEntradaNumero = orden.Id_ordenentrada
      this.ordenEntrada = orden
      this.ordenEntrada.Id_cliente = null
      this.ordenEntrada.Fechaingreso_ordenentrada = orden.Fechaingreso_ordenentrada.slice(0, 10)
      for (const c of this.listaClientes) {
        if (c.Id_cliente === orden.Id_cliente) {
          this.seleccionarCliente(c)
        }
      }
      this.NombreCliente = orden.Razonsocial_cliente
    },
    agregarMedidoresOrden () {
      this.isDialogComponenteConsulta = false
      this.isDialogComponenteAgregarMedidoresOrden = false
      var item = 1
      for (const medidor of this.ordenEntrada.LisOrdenEntradaD) {
        medidor.Icono = 'https'
        medidor.Item_ordenentradad = item
        medidor.ListaIncidencias = []
        medidor.Incidencias = medidor.ListaIncidencias.length
        this.lisMedidores.push(medidor)
        item++
      }
      
    },
    ordenEntradaDetalle (orden) {
      this.$q.loading.show()
      this.ordenEntradaNumero = orden.Id_ordenentrada
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.lisMedidoresB = orden.LisOrdenEntradaD
        this.$q.loading.hide()
      }, 250)
      this.isDialogComponenteConsultaDetalle = true
    },
    ordenEntradaImprimirPDF (orden) {
      this.$q.loading.show()
      api.get(`/ordenentrada/ordenEntradaImprimirPDF/${orden}`, { responseType: 'arraybuffer' })
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
    agregarMedidor () {
      const medidor = {...this.ordenEntradaD }
      medidor.Item_ordenentradad = this.lisMedidores.length + 1
      medidor.ListaIncidencias = this.selected
      medidor.Incidencias = medidor.ListaIncidencias.length
      this.lisMedidores.push(medidor)
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
