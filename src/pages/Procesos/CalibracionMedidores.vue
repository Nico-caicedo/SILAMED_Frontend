<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="slow_motion_video" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print"  />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title>
          Calibración de Medidores
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formCalibracionMedidores">
        <div class="q-pa-md">
          <q-stepper
            v-model="step"
            vertical
            color="primary"
            animated
            >
            <q-step
                :name="1"
                title="1. Seleccione una programación para dar inicio a las pruebas"
                icon="settings"
                :done="step > 1"
            >
                Recuerde que solo se mostrarán las programaciones de quien haya sido programado como Encargado (<b> {{ usuario.LoginUsuario }} </b>) 
                <div class="row q-col-gutter-sm">
                <q-toggle class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm"
                  v-model="todasFechas"
                  checked-icon="check"
                  color="green"
                  label="Consultar todas las fechas"
                  unchecked-icon="clear"
                />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" readonly stack-label label="Registros Encontrados" v-model="LisProgramaciones.length" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Fecha Inicio" 
                  :readonly="todasFechas === true"
                  v-model="ProgramacionOrden.FechaIni"
                  type="date" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" 
                  stack-label label="Fecha Fin" 
                  :readonly="todasFechas === true"
                  v-model="ProgramacionOrden.FechaFin"
                  type="date" outlined  >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                    :data="LisProgramaciones"
                    :columns="columnsProgramaciones"
                    :visible-columns="vcProgramaciones">
                  <template v-slot:body-cell-Seleccionar_programacionorden="props">
                  <q-td key="Seleccionar_programacionorden" :props="props" auto-width>
                    <q-btn icon="verified" color="blue" align="center" outline @click="CargarProgramacionOrden(props.row)"
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
                    @click="exportTable(LisProgramaciones, columnsProgramaciones, 'ConsultaProgramaciones_')"
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
                    v-model="vcProgramaciones"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsProgramaciones"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                    />
                </template>
                </q-table>
                </div>
                <div class="row justify-center q-pa-sm">
                <q-btn label="Consultar" icon="search" outline align="center" unelevated @click="consultarFiltroProgramacion()">
                </q-btn>
            </div>
            </q-step>

            <q-step
                :name="2"
                title="2. Organizar montada e ingresar lecturas iniciales"
                icon="settings"
                :done="step > 2"
            >
                
                Ingrese lecturas para dar inicio a la prueba.
                <div class="bg-cyan text-white col-xs-12 col-sm-12 col-md-12" dense >
                <q-toolbar>
                  <q-btn flat round dense icon="list" />
                  <q-toolbar-title>{{ getSelectdMedidores() }} </q-toolbar-title>
                </q-toolbar>
                </div>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="lisMedidores"
                :columns="columnsMedidores"
                :visible-columns="vcMedidores"
                row-key="id"
                >
                <template v-slot:top="props">
                    <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(lisMedidores, columnsMedidores, 'ConsultaMedidores_')"
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
                    v-model="vcMedidores"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsMedidores"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                    />
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                    <q-td key="Puesto_ordenentradad" :props="props">
                        {{ props.row.Puesto_ordenentradad }}
                    </q-td>
                    <q-td key="Id_pod" :props="props">
                        {{ props.row.Id_pod }}
                    </q-td>
                    <q-td key="Id_ordenentradad" :props="props">
                        {{ props.row.Id_ordenentradad }}
                    </q-td>
                    <q-td key="Serialmedidor_ordenentradad" :props="props">
                        {{ props.row.Serialmedidor_ordenentradad }}
                    </q-td>
                    <q-td key="Lectura_ordenentradad" :props="props">
                        {{ props.row.Lectura_ordenentradad }}
                    </q-td>
                    <q-td key="Volumeninicial_repcp" :props="props">
                        <q-badge color="green">
                            {{ formatoNumero(props.row.Volumeninicial_repcp, 2) }}
                        </q-badge>
                        <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Volumeninicial_repcp" title="Ingrese Lectura(litros)" buttons>
                          <q-input type="number" v-model="props.row.Volumeninicial_repcp" autofocus @input="val => { fechaTomaMedidor(props.row, 'I') }">
                          <template v-slot:prepend>
                            <q-icon name="update" size="lg" />
                          </template>
                          </q-input>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Volumenfinal_repcp" :props="props">
                        {{ formatoNumero(props.row.Volumenfinal_repcp, 2) }}
                    </q-td>
                    <q-td key="Error_repcp" :props="props">
                      {{ formatoNumero(props.row.Error, 2) }}
                    </q-td>
                    <q-td key="Nombre_marcamedidor" :props="props">
                        {{ props.row.Nombre_marcamedidor }}
                    </q-td>
                    <q-td key="Descripcion_modelomedidor" :props="props">
                        {{ props.row.Descripcion_modelomedidor }}
                    </q-td>
                    <q-td key="Fabricacion_ordenentradad" :props="props">
                        {{ props.row.Fabricacion_ordenentradad }}
                    </q-td>
                    <q-td key="Aptocalibrar_ordenentradad" :props="props">
                        {{ props.row.Aptocalibrar_ordenentradad }}
                    </q-td>
                    <q-td key="Nombre_normaref" :props="props">
                        {{ props.row.Nombre_normaref }}
                    </q-td>
                    <q-td key="FechaTomaIni" :props="props">
                      {{ props.row.FechaTomaIni }}
                    </q-td>
                    <q-td key="FechaTomaFin" :props="props">
                      {{ props.row.FechaTomaFin }}
                    </q-td>
                    </q-tr>
                </template>
                </q-table>
                <q-stepper-navigation>
                <q-btn @click="MontadaInicial()" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-step>

            <q-step
                :name="3"
                title="3. Seleccione un Caudal para iniciar kit de pruebas"
                icon="update"
                :done="step > 3"
            >
              <div class="row q-col-gutter-sm">
                Seleccione Caudal para dar inicio a la prueba
                <!-- <q-input class="col-xs-12 col-sm-6 col-md-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="CalibracionPrueba.Tempambini_calprueba"
                  :rules="[ regla ]"
                  label="Temperatura Ambiente (C°)">
                  <template v-slot:prepend>
                    <q-icon name="thermostat" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="CalibracionPrueba.Humedadrelini_calprueba"
                  :rules="[ regla ]"
                  label="Humedad Relativa (%)">
                  <template v-slot:prepend>
                    <q-icon name="tungsten" size="lg" />
                  </template>
                </q-input> -->
              </div>
              <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-12 col-md-6">
                <div class="bg-cyan text-white">
                    <q-toolbar>
                    <q-btn flat round dense icon="list" />
                    <q-toolbar-title> Pruebas a realizar </q-toolbar-title>
                    <q-btn flat round dense icon="add_task" />
                    </q-toolbar>
                </div>
                 <q-table class="col-xs-12 col-sm-12 col-md-6" title="Pruebas" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                    :data="listaCaudales"
                    :columns="columnsCaudales"
                    row-key="Id_caudal">
                    <template v-slot:body-cell-Modificar_caudal="props">
                      <q-td key="Id_caudal" :props="props" auto-width>
                        <q-btn icon="verified" label="Iniciar" color="green" align="center" outline @click="IniciarPrueba(props.row)"
                        v-if="props.row">
                        </q-btn>
                      </q-td>
                    </template>
                 </q-table>
                </div>
              </div>
            <div class="col-xs-12 col-sm-12 col-md-8">
              <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-md-7 q-field--with-bottom"
                    outlined
                    v-model="ProgramacionOrden.Id_banco"
                    map-options emit-value option-value="Id_banco"
                    option-label="Identificacion_banco"
                    :options="lisBancos"
                    :rules="[ regla ]"
                    @input="val => { cargarBanco(val) }"
                    label="Banco de Pruebas"
                >
                    <template v-slot:prepend>
                    <q-icon name="business" size="lg" />
                    </template>
                    <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section>
                        <q-item-label v-html="scope.opt.Identificacion_banco" />
                        <q-item-label caption>Descripción Banco: {{ scope.opt.Descripcion_banco }}</q-item-label>
                        <q-item-label caption>Tipo Banco: {{ scope.opt.Tipo_banco }}</q-item-label>
                        <q-item-label caption>Líneas Banco: {{ scope.opt.Lineas_banco }}</q-item-label>
                        <q-item-label caption>Capacidad Medidores: {{ scope.opt.Medidores_banco }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    </template>
                </q-select>
                <q-select class="col-xs-12 col-md-5 q-field--with-bottom"
                    outlined
                    v-model="ProgramacionOrden.Id_tipoensayo"
                    map-options emit-value option-value="Id_tipoensayo"
                    option-label="Nombre_tipoensayo"
                    :options="lisTipoEnsayo"
                    :rules="[ regla ]"
                    label="Tipo de Ensayo"
                >
                    <template v-slot:prepend>
                      <q-icon name="shutter_speed" size="lg" />
                    </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                  stack-label label="Supervisor de la Prueba" 
                  v-model="ProgramacionOrden.Nombre_supervisor"
                  :rules="[ regla ]"
                  outlined>
                  <template v-slot:prepend>
                    <q-icon name="supervisor_account" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                  stack-label label="Encargado de la Prueba" 
                  v-model="ProgramacionOrden.Nombre_encargado"
                  :rules="[ regla ]"
                  outlined>
                  <template v-slot:prepend>
                    <q-icon name="engineering" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-7 col-sm-7 col-md-4 q-field--with-bottom"
                  outlined
                  stack-label
                  v-model="ProgramacionOrden.Fechacalibracion_programacionorden"
                  :rules="[ regla ]"
                  label="Fecha Calibración">
                  <template v-slot:prepend>
                    <q-icon name="today" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-5 col-sm-5 col-md-4 q-field--with-bottom"
                  outlined
                  stack-label
                  v-model="ProgramacionOrden.Horacalibracion_programacionorden"
                  :rules="[ regla ]"
                  label="Hora">
                  <template v-slot:prepend>
                    <q-icon name="access_time" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
                  outlined
                  stack-label
                  v-model="ProgramacionOrden.Duracioncalibracion_programacionorden"
                  :rules="[ regla ]"
                  type="number"
                  label="Duración Calibración (Minutos)"
                />
                <q-select class="col-xs-12 col-md-12 q-field--with-bottom"
                  outlined
                  v-model="ProgramacionOrden.Id_parcal"
                  map-options emit-value option-value="Id_parcal"
                  option-label="Descripcion_parcal"
                  :options="listaParametrosCalibracion"
                  :rules="[ regla ]"
                  label="Parámetros de Calibración"
                >
                  <template v-slot:prepend>
                    <q-icon name="book" size="lg" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.Descripcion_parcal" />
                        <q-item-label caption>Número de observaciones por medidor en cada prueba: {{ scope.opt.Observaciones_parcal }}</q-item-label>
                        <q-item-label caption>Coeficiente de expansión térmico-volumétrico del agua: {{ scope.opt.Coefexpter_parcal }}</q-item-label>
                        <q-item-label caption>Incertidumbre de Coeficiente de expansión térmico-volumétrico del material RVM: {{ scope.opt.Incertcoefexpter_parcal }}</q-item-label>
                        <q-item-label caption>Incertidumbre de comprensibilidad del Agua (KPa): {{ scope.opt.Incertcomprenagua_parcal }}</q-item-label>
                        <q-item-label caption>Coeficiente de expansión térmico-volumétrico del material RVM: {{ scope.opt.Coefexptermat_parcal }}</q-item-label>
                        <q-item-label caption>Compresibilidad del agua (kPa-1): {{ scope.opt.Comprenagua_parcal }}</q-item-label>
                        <q-item-label caption>Incertidumbre de coeficiente de expanción térmico-volumétrico del agua (°C): {{ scope.opt.Incertcoefexptva_parcal }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observaciones" v-model="ProgramacionOrden.Observacion_programacionorden" type="textarea" outlined  />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn flat @click="step = 2" color="primary" label="Volver" class="q-ml-sm" />
            </q-stepper-navigation>
            </q-step>

            <q-step
              :name="4"
              title="4. Iniciar Repeticiones"
              icon="build"
              :done="step > 4"
          >
              <div class="row q-col-gutter-sm">
                Iniciar la prueba  *** {{ caudal.Nombre_caudal }} ({{ caudal.Id_caudal }}) ***  para la repetición número {{ Repeticiones }}, Repeticiones faltantes: {{ RepeticionesFaltantes - 1 }}, recuerde ingresar las condiciones durante la prueba para hallar el promedio de las mismas.
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                  :data="LisRepeticionCPInstrumentos"
                  :columns="columnsInstrumentosRepeticion"
                  :visible-columns="vcInstrumentosRepeticion">
                  <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportTable(LisRepeticionCPInstrumentos, columnsInstrumentosRepeticion, 'ConsultaRepeticiones_')"
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
                      v-model="vcInstrumentosRepeticion"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsInstrumentosRepeticion"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="Id_caudal" :props="props">
                        {{ props.row.Id_caudal }}
                      </q-td>
                      <q-td key="IdTipoInstrumento" :props="props">
                        {{ props.row.IdTipoInstrumento }}
                      </q-td>
                      <q-td key="Id_instrumento" :props="props">
                        {{ props.row.Id_instrumento }}
                      </q-td>
                      <q-td key="Id_instprog" :props="props">
                        {{ props.row.Id_instprog }}
                      </q-td>
                      <q-td key="Id_trazabilidadinst" :props="props">
                        {{ props.row.Id_trazabilidadinst }}
                      </q-td>
                      <q-td key="NombreTipoInstrumento" :props="props">
                        {{ props.row.NombreTipoInstrumento }}
                      </q-td>
                      <q-td key="Lectura" :props="props">
                        <q-badge color="green">
                          {{ formatoNumeroTipo(props.row.Lectura, props.row.IdTipoInstrumento) }}
                        </q-badge>
                        <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Lectura" title="Ingrese Datos" buttons>
                          <q-input type="number" v-model="props.row.Lectura" autofocus @input="val => { CalcularCorreccion(props.row) }">
                            <template v-slot:prepend>
                              <q-icon name="update" size="lg" />
                            </template>
                          </q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="Correccion" :props="props">
                        {{ formatoNumeroTipo(props.row.Correccion, props.row.IdTipoInstrumento) }}
                      </q-td>
                      <q-td key="Nombre_instrumento" :props="props">
                        {{ props.row.Nombre_instrumento }}
                      </q-td>
                      <q-td key="Codigo_instrumento" :props="props">
                        {{ props.row.Codigo_instrumento }}
                      </q-td>
                      <q-td key="Nombre_variablemedicion" :props="props">
                        {{ props.row.Nombre_variablemedicion }}
                      </q-td>
                      <q-td key="X_trazabilidadinst" :props="props">
                        {{ props.row.X_trazabilidadinst }}
                      </q-td>
                      <q-td key="A_trazabilidadinst" :props="props">
                        {{ props.row.A_trazabilidadinst }}
                      </q-td>
                      <q-td key="B_trazabilidadinst" :props="props">
                        {{ props.row.B_trazabilidadinst }}
                      </q-td>
                      <q-td key="C_trazabilidadinst" :props="props">
                        {{ props.row.C_trazabilidadinst }}
                      </q-td>
                      <q-td key="Factorcorreccion_trazabilidadinst" :props="props">
                        {{ props.row.Factorcorreccion_trazabilidadinst }}
                      </q-td>
                      <q-td key="Aplus_trazabilidadinst" :props="props">
                        {{ props.row.Aplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Bplus_trazabilidadinst" :props="props">
                        {{ props.row.Bplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Cplus_trazabilidadinst" :props="props">
                        {{ props.row.Cplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="FechaToma" :props="props">
                        {{ props.row.FechaToma }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <q-stepper-navigation>
                <q-btn color="primary" @click="IniciarRepeticion()" label="Iniciar Kit" />
              </q-stepper-navigation>
            </q-step>
            
            <q-step
                :name="5"
                title="5. Ingrese lecturas de instrumentos"
                icon="access_time"
                :done="step > 5"
            >
                <!-- <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Caudal1_repcp"
                  :rules="[ regla ]"
                  label="1. Caudal (l/h)">
                  <template v-slot:prepend>
                    <q-icon name="shower" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Presionent1_repcp"
                  :rules="[ regla ]"
                  label="1. Presión de Entrada (Kpa)">
                  <template v-slot:prepend>
                    <q-icon name="tungsten" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Presionsal1_repcp"
                  :rules="[ regla ]"
                  label="1. Presión de Salida (Kpa)">
                  <template v-slot:prepend>
                    <q-icon name="network_check" size="lg" />
                  </template>
                </q-input>
                </div>
                Ingrese segunda muestra de la prueba  *** {{ caudal.Nombre_caudal }} ({{ caudal.Id_caudal }}) ***  de las condiciones durante la calibración para la repetición {{ Repeticiones }} 
                <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Caudal2_repcp"
                  :rules="[ regla ]"
                  label="2. Caudal (l/h)">
                  <template v-slot:prepend>
                    <q-icon name="shower" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Presionent2_repcp"
                  :rules="[ regla ]"
                  label="2. Presión de Entrada (Kpa)">
                  <template v-slot:prepend>
                    <q-icon name="tungsten" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Presionsal2_repcp"
                  :rules="[ regla ]"
                  label="2. Presión de Salida (Kpa)">
                  <template v-slot:prepend>
                    <q-icon name="network_check" size="lg" />
                  </template>
                </q-input>
                </div>
                Ingrese tercera muestra de la prueba  *** {{ caudal.Nombre_caudal }} ({{ caudal.Id_caudal }}) ***  de las condiciones durante la calibración para la repetición {{ Repeticiones }}
                <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Caudal3_repcp"
                  :rules="[ regla ]"
                  label="3. Caudal (l/h)">
                  <template v-slot:prepend>
                    <q-icon name="shower" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Presionent3_repcp"
                  :rules="[ regla ]"
                  label="3. Presión de Entrada (Kpa)">
                  <template v-slot:prepend>
                    <q-icon name="tungsten" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Presionsal3_repcp"
                  :rules="[ regla ]"
                  label="3. Presión de Salida (Kpa)">
                  <template v-slot:prepend>
                    <q-icon name="network_check" size="lg" />
                  </template>
                </q-input>
                </div>
                <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-md-4 col-sm-6 q-field--with-bottom"
                  outlined
                  stack-label
                  type="number"
                  v-model="RepeticionCP.Templinea2_repcp"
                  :rules="[ regla ]"
                  label="Temperatura final de la Línea (C°)">
                  <template v-slot:prepend>
                    <q-icon name="hot_tub" size="lg" />
                  </template>
                </q-input>
                </div> -->
                <div class="row q-col-gutter-sm">
                  Ingrese datos para el caudal *** {{ caudal.Nombre_caudal }} ({{ caudal.Id_caudal }}) ***  de la repetición {{ Repeticiones }}

                  <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                    :data="LisRepeticionCPInstrumentos"
                    :columns="columnsInstrumentosRepeticion"
                    :visible-columns="vcInstrumentosRepeticion">
                    <template v-slot:top="props">
                      <q-btn
                        color="primary"
                        icon-right="archive"
                        label=""
                        no-caps
                        @click="exportTable(LisRepeticionCPInstrumentos, columnsInstrumentosRepeticion, 'ConsultaInstrumentos_')"
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
                        v-model="vcInstrumentosRepeticion"
                        multiple
                        outlined
                        dense
                        options-dense
                        :display-value="$q.lang.table.columns"
                        emit-value
                        map-options
                        :options="columnsInstrumentosRepeticion"
                        option-value="name"
                        options-cover
                        style="min-width: 150px"
                      />
                    </template>
                    <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="Id_caudal" :props="props">
                        {{ props.row.Id_caudal }}
                      </q-td>
                      <q-td key="IdTipoInstrumento" :props="props">
                        {{ props.row.IdTipoInstrumento }}
                      </q-td>
                      <q-td key="Id_instrumento" :props="props">
                        {{ props.row.Id_instrumento }}
                      </q-td>
                      <q-td key="Id_instprog" :props="props">
                        {{ props.row.Id_instprog }}
                      </q-td>
                      <q-td key="Id_trazabilidadinst" :props="props">
                        {{ props.row.Id_trazabilidadinst }}
                      </q-td>
                      <q-td key="NombreTipoInstrumento" :props="props">
                        {{ props.row.NombreTipoInstrumento }}
                      </q-td>
                      <q-td key="Lectura" :props="props">
                        <q-badge color="green">
                          {{ formatoNumeroTipo(props.row.Lectura, props.row.IdTipoInstrumento) }}
                        </q-badge>
                        <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Lectura" title="Ingrese Datos" buttons>
                          <q-input type="number" v-model="props.row.Lectura" autofocus @input="val => { CalcularCorreccion(props.row) }">
                            <template v-slot:prepend>
                              <q-icon name="update" size="lg" />
                            </template>
                          </q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="Correccion" :props="props">
                        {{ formatoNumeroTipo(props.row.Correccion, props.row.IdTipoInstrumento) }}
                      </q-td>
                      <q-td key="Nombre_instrumento" :props="props">
                        {{ props.row.Nombre_instrumento }}
                      </q-td>
                      <q-td key="Codigo_instrumento" :props="props">
                        {{ props.row.Codigo_instrumento }}
                      </q-td>
                      <q-td key="Nombre_variablemedicion" :props="props">
                        {{ props.row.Nombre_variablemedicion }}
                      </q-td>
                      <q-td key="X_trazabilidadinst" :props="props">
                        {{ props.row.X_trazabilidadinst }}
                      </q-td>
                      <q-td key="A_trazabilidadinst" :props="props">
                        {{ props.row.A_trazabilidadinst }}
                      </q-td>
                      <q-td key="B_trazabilidadinst" :props="props">
                        {{ props.row.B_trazabilidadinst }}
                      </q-td>
                      <q-td key="C_trazabilidadinst" :props="props">
                        {{ props.row.C_trazabilidadinst }}
                      </q-td>
                      <q-td key="Factorcorreccion_trazabilidadinst" :props="props">
                        {{ props.row.Factorcorreccion_trazabilidadinst }}
                      </q-td>
                      <q-td key="Aplus_trazabilidadinst" :props="props">
                        {{ props.row.Aplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Bplus_trazabilidadinst" :props="props">
                        {{ props.row.Bplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Cplus_trazabilidadinst" :props="props">
                        {{ props.row.Cplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="FechaToma" :props="props">
                        {{ props.row.FechaToma }}
                      </q-td>
                    </q-tr>
                  </template>
                  </q-table>
                </div>
                <q-stepper-navigation>
                <q-btn color="primary" @click="FinalizarKit()" label="Finalizar Kit" />
                </q-stepper-navigation>
            </q-step>
            <q-step
                :name="6"
                title="6. Ingrese lecturas finales de los medidores"
                icon="shutter_speed"
                :done="step > 6"
            >
                Ingrese datos para finalizar la prueba  *** {{ caudal.Nombre_caudal }} ({{ caudal.Id_caudal }}) ***  para la repetición: {{ Repeticiones }}.  Repeticiones Pendientes: {{ RepeticionesFaltantes - 1 }}
                <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-sm-3 col-md-3 q-field--with-bottom"
                    outlined
                    stack-label
                    type="number"
                    v-model="RepeticionCP.Duracionh_repcp"
                    @input="val => { CalcularTiempo() }"
                    :rules="[ val => val && val > 0 && val.length < 3 || 'No puede ingresar tantas horas']"
                    label="Horas (HH)">
                    <template v-slot:prepend>
                      <q-icon name="shutter_speed" size="lg" />
                    </template>
                  </q-input>
                  <q-input class="col-xs-12 col-sm-3 col-md-3 q-field--with-bottom"
                    outlined
                    stack-label
                    type="number"
                    v-model="RepeticionCP.Duracionm_repcp"
                    @input="val => { CalcularTiempo() }"
                    :rules="[ val => val && val > 0 && val.length < 3 || 'No puede ingresar tantos minutos']"
                    label="Minutos (MM)">
                    <template v-slot:prepend>
                      <q-icon name="shutter_speed" size="lg" />
                    </template>
                  </q-input>
                  <q-input class="col-xs-12 col-sm-3 col-md-3 q-field--with-bottom"
                    outlined
                    stack-label
                    type="number"
                    v-model="RepeticionCP.Duracions_repcp"
                    @input="val => { CalcularTiempo() }"
                    :rules="[ val => val && val > 0 && val.length < 3 || 'No puede ingresar tantos segundos']"
                    label="Segundos (SS)">
                    <template v-slot:prepend>
                      <q-icon name="shutter_speed" size="lg" />
                    </template>
                  </q-input>
                  <q-input class="col-xs-12 col-sm-3 col-md-3 q-field--with-bottom"
                    outlined
                    stack-label readonly
                    type="number"
                    v-model="RepeticionCP.Duraciont_repcp"
                    :rules="[ regla ]"
                    label="Total Segundos">
                    <template v-slot:prepend>
                      <q-icon name="watch" size="lg" />
                    </template>
                  </q-input>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" v-if="LisRepeticionCPInstrumentos.length > 0" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                  :data="LisRepeticionCPInstrumentos"
                  :columns="columnsInstrumentosRepeticion"
                  :visible-columns="vcInstrumentosRepeticion">
                  <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportTable(LisRepeticionCPInstrumentos, columnsInstrumentosRepeticion, 'ConsultaRepeticiones_')"
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
                      v-model="vcInstrumentosRepeticion"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsInstrumentosRepeticion"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="Id_caudal" :props="props">
                        {{ props.row.Id_caudal }}
                      </q-td>
                      <q-td key="IdTipoInstrumento" :props="props">
                        {{ props.row.IdTipoInstrumento }}
                      </q-td>
                      <q-td key="Id_instrumento" :props="props">
                        {{ props.row.Id_instrumento }}
                      </q-td>
                      <q-td key="Id_instprog" :props="props">
                        {{ props.row.Id_instprog }}
                      </q-td>
                      <q-td key="Id_trazabilidadinst" :props="props">
                        {{ props.row.Id_trazabilidadinst }}
                      </q-td>
                      <q-td key="NombreTipoInstrumento" :props="props">
                        {{ props.row.NombreTipoInstrumento }}
                      </q-td>
                      <q-td key="Lectura" :props="props">
                        <q-badge color="green">
                          {{ formatoNumeroTipo(props.row.Lectura, props.row.IdTipoInstrumento) }}
                        </q-badge>
                        <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Lectura" title="Ingrese Datos" buttons>
                          <q-input type="number" v-model="props.row.Lectura" autofocus @input="val => { CalcularCorreccion(props.row) }">
                            <template v-slot:prepend>
                              <q-icon name="update" size="lg" />
                            </template>
                          </q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="Correccion" :props="props">
                        {{ formatoNumeroTipo(props.row.Correccion, props.row.IdTipoInstrumento) }}
                      </q-td>
                      <q-td key="Nombre_instrumento" :props="props">
                        {{ props.row.Nombre_instrumento }}
                      </q-td>
                      <q-td key="Codigo_instrumento" :props="props">
                        {{ props.row.Codigo_instrumento }}
                      </q-td>
                      <q-td key="Nombre_variablemedicion" :props="props">
                        {{ props.row.Nombre_variablemedicion }}
                      </q-td>
                      <q-td key="X_trazabilidadinst" :props="props">
                        {{ props.row.X_trazabilidadinst }}
                      </q-td>
                      <q-td key="A_trazabilidadinst" :props="props">
                        {{ props.row.A_trazabilidadinst }}
                      </q-td>
                      <q-td key="B_trazabilidadinst" :props="props">
                        {{ props.row.B_trazabilidadinst }}
                      </q-td>
                      <q-td key="C_trazabilidadinst" :props="props">
                        {{ props.row.C_trazabilidadinst }}
                      </q-td>
                      <q-td key="Factorcorreccion_trazabilidadinst" :props="props">
                        {{ props.row.Factorcorreccion_trazabilidadinst }}
                      </q-td>
                      <q-td key="Aplus_trazabilidadinst" :props="props">
                        {{ props.row.Aplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Bplus_trazabilidadinst" :props="props">
                        {{ props.row.Bplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Cplus_trazabilidadinst" :props="props">
                        {{ props.row.Cplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="FechaToma" :props="props">
                        {{ props.row.FechaToma }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                  :data="lisMedidores"
                  :columns="columnsMedidores"
                  :visible-columns="vcMedidores">
                  <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportTable(lisMedidores, columnsMedidores, 'ConsultaMedidores')"
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
                      v-model="vcMedidores"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsMedidores"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                    <q-td key="Puesto_ordenentradad" :props="props">
                        {{ props.row.Puesto_ordenentradad }}
                    </q-td>
                    <q-td key="Id_pod" :props="props">
                        {{ props.row.Id_pod }}
                    </q-td>
                    <q-td key="Id_ordenentradad" :props="props">
                        {{ props.row.Id_ordenentradad }}
                    </q-td>
                    <q-td key="Serialmedidor_ordenentradad" :props="props">
                        {{ props.row.Serialmedidor_ordenentradad }}
                    </q-td>
                    <q-td key="Lectura_ordenentradad" :props="props">
                        {{ props.row.Lectura_ordenentradad }}
                    </q-td>
                    <q-td key="Volumeninicial_repcp" :props="props">
                      {{ formatoNumero(props.row.Volumeninicial_repcp, 2) }}
                    </q-td>
                    <q-td key="Volumenfinal_repcp" :props="props">
                        <q-badge color="green">
                          {{ formatoNumero(props.row.Volumenfinal_repcp, 2) }}
                        </q-badge>
                        <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Volumenfinal_repcp" title="Ingrese Lectura(litros)" buttons>
                          <q-input type="number" v-model="props.row.Volumenfinal_repcp" autofocus @input="val => { fechaTomaMedidor(props.row, 'F') }">
                          <template v-slot:prepend>
                            <q-icon name="update" size="lg" />
                          </template>
                          </q-input>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Error_repcp" :props="props">
                      <q-badge :color="props.row.colorError">
                        <b> {{ formatoNumero(props.row.Error_repcp, 2) }} </b>
                      </q-badge>
                    </q-td>
                    <q-td key="Nombre_marcamedidor" :props="props">
                        {{ props.row.Nombre_marcamedidor }}
                    </q-td>
                    <q-td key="Descripcion_modelomedidor" :props="props">
                        {{ props.row.Descripcion_modelomedidor }}
                    </q-td>
                    <q-td key="Fabricacion_ordenentradad" :props="props">
                        {{ props.row.Fabricacion_ordenentradad }}
                    </q-td>
                    <q-td key="Aptocalibrar_ordenentradad" :props="props">
                        {{ props.row.Aptocalibrar_ordenentradad }}
                    </q-td>
                    <q-td key="Nombre_normaref" :props="props">
                        {{ props.row.Nombre_normaref }}
                    </q-td>
                    <q-td key="FechaTomaIni" :props="props">
                      {{ props.row.FechaTomaIni }}
                    </q-td>
                    <q-td key="FechaTomaFin" :props="props">
                      {{ props.row.FechaTomaFin }}
                    </q-td>
                    </q-tr>
                </template>
                </q-table>
                <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observación para la repetición" v-model="RepeticionCP.Observacion_repcp" type="textarea" outlined  />
                </div>
                <q-stepper-navigation>
                <q-btn color="primary" @click="finalizarRepeticion()" label="Finalizar Repetición" />
                </q-stepper-navigation>
            </q-step>
            <q-step
                :name="7"
                title="7. Ingrese Condiciones Ambientales Finales"
                icon="sunny"
                :done="step > 7"
            >
                <div class="row q-col-gutter-sm">
                  Ingrese condiciones ambientales finales para dar finalización a la prueba   *** {{ caudal.Nombre_caudal }} ({{ caudal.Id_caudal }}) ***  
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                  :data="LisRepeticionCPInstrumentos"
                  :columns="columnsInstrumentosRepeticion"
                  :visible-columns="vcInstrumentosRepeticion">
                  <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportTable(LisRepeticionCPInstrumentos, columnsInstrumentosRepeticion, 'ConsultaRepeticiones_')"
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
                      v-model="vcInstrumentosRepeticion"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsInstrumentosRepeticion"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="Id_caudal" :props="props">
                        {{ props.row.Id_caudal }}
                      </q-td>
                      <q-td key="IdTipoInstrumento" :props="props">
                        {{ props.row.IdTipoInstrumento }}
                      </q-td>
                      <q-td key="Id_instrumento" :props="props">
                        {{ props.row.Id_instrumento }}
                      </q-td>
                      <q-td key="Id_instprog" :props="props">
                        {{ props.row.Id_instprog }}
                      </q-td>
                      <q-td key="Id_trazabilidadinst" :props="props">
                        {{ props.row.Id_trazabilidadinst }}
                      </q-td>
                      <q-td key="NombreTipoInstrumento" :props="props">
                        {{ props.row.NombreTipoInstrumento }}
                      </q-td>
                      <q-td key="Lectura" :props="props">
                        <q-badge color="green">
                          {{ props.row.Lectura }}
                        </q-badge>
                        <q-popup-edit label-set="Ingresar" label-cancel="Cancelar" v-model="props.row.Lectura" title="Ingrese Datos" buttons>
                          <q-input type="number" v-model="props.row.Lectura" autofocus @input="val => { CalcularCorreccion(props.row) }">
                            <template v-slot:prepend>
                              <q-icon name="update" size="lg" />
                            </template>
                          </q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="Correccion" :props="props">
                        {{ formatoNumero(props.row.Correccion, 2) }}
                      </q-td>
                      <q-td key="Nombre_instrumento" :props="props">
                        {{ props.row.Nombre_instrumento }}
                      </q-td>
                      <q-td key="Codigo_instrumento" :props="props">
                        {{ props.row.Codigo_instrumento }}
                      </q-td>
                      <q-td key="Nombre_variablemedicion" :props="props">
                        {{ props.row.Nombre_variablemedicion }}
                      </q-td>
                      <q-td key="X_trazabilidadinst" :props="props">
                        {{ props.row.X_trazabilidadinst }}
                      </q-td>
                      <q-td key="A_trazabilidadinst" :props="props">
                        {{ props.row.A_trazabilidadinst }}
                      </q-td>
                      <q-td key="B_trazabilidadinst" :props="props">
                        {{ props.row.B_trazabilidadinst }}
                      </q-td>
                      <q-td key="C_trazabilidadinst" :props="props">
                        {{ props.row.C_trazabilidadinst }}
                      </q-td>
                      <q-td key="Factorcorreccion_trazabilidadinst" :props="props">
                        {{ props.row.Factorcorreccion_trazabilidadinst }}
                      </q-td>
                      <q-td key="Aplus_trazabilidadinst" :props="props">
                        {{ props.row.Aplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Bplus_trazabilidadinst" :props="props">
                        {{ props.row.Bplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="Cplus_trazabilidadinst" :props="props">
                        {{ props.row.Cplus_trazabilidadinst }}
                      </q-td>
                      <q-td key="FechaToma" :props="props">
                        {{ props.row.FechaToma }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observación prueba" v-model="CalibracionPrueba.Observacion_calprueba" type="textarea" outlined  />
                </div>
                <q-stepper-navigation>
                <q-btn color="primary" @click="FinalizarPruebaCaudal()" label="Finalizar Prueba" />
                </q-stepper-navigation>
            </q-step>

            <q-step
                :name="8"
                title="8. Fin de la Calibración"
                icon="emoji_events"
                :done="step > 8"
            >
                <div class="row q-col-gutter-sm">
                  Ingrese una observación para cerrar la calibración de los medidores
                <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observación de la Calibración" v-model="Calibracion.Observacion_calibracion" type="textarea" outlined  />
                </div>
                <q-stepper-navigation>
                <q-btn color="primary" @click="FinalizarCalibracion()" label="Finalizar Calibración" />
                </q-stepper-navigation>
            </q-step>
            </q-stepper>
          <div class="row q-col-gutter-sm">
            <div class="q-pa-md q-gutter-md">
                <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
                </q-btn>
            </div>            
          </div>
        </div>
      </q-form>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteFiltro" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta Calibraciones</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <q-toggle class="col-xs-12 col-sm-6 col-md-6 q-field--with-bottom q-pt-sm"
                v-model="todasFechas"
                checked-icon="check"
                color="green"
                label="Consultar todas las fechas"
                unchecked-icon="clear"
              />
              <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" readonly stack-label label="Registros Encontrados" v-model="LisCalibraciones.length" outlined  />
              <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                stack-label label="Fecha Inicio" 
                :readonly="todasFechas === true"
                v-model="Calibracion.Fechaini_calibracion"
                type="date" outlined  >
                <template v-slot:prepend>
                  <q-icon name="date_range" size="lg" />
                </template>
              </q-input>
              <q-input class="col-xs-12 col-sm-6 col-md-6 q-pt-sm" 
                stack-label label="Fecha Fin" 
                :readonly="todasFechas === true"
                v-model="Calibracion.Fechafin_calibracion"
                type="date" outlined  >
                <template v-slot:prepend>
                  <q-icon name="date_range" size="lg" />
                </template>
              </q-input>
              <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="LisCalibraciones"
                :columns="columnsCalibraciones"
                :visible-columns="vcCalibraciones">
                <template v-slot:body-cell-Seleccionar_calibracion="props">
                  <q-td key="Seleccionar_calibracion" :props="props" auto-width>
                    <q-btn icon="search" color="blue" align="center" outline @click="CargarCalibracion(props.row)"/>
                  </q-td>
                </template>
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisCalibraciones, columnsCalibraciones, 'ConsultaCalibraciones_')"
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
                    v-model="vcCalibraciones"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsCalibraciones"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                  />
                </template>
              </q-table>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Consultar" icon="search" outline align="center" unelevated @click="consultarFiltroCalibracion()">
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteFiltroPruebas" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta Pruebas x Calibración</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              Seleccione la prueba que desea observar
              <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom 
                :rows-per-page-options="[0]" flat bordered
                :data="LisCalibracionPrueba"
                :columns="columnsCalibracionPruebas"
                :visible-columns="vcCalibracionPruebas">
                <template v-slot:body-cell-Seleccionar_lecturamedidores="props">
                  <q-td key="Seleccionar_lecturamedidores" :props="props" auto-width>
                    <q-btn icon="slow_motion_video" color="orange" align="center" outline @click="CargarCargarCalibracionPruebaMed(props.row)"/>
                  </q-td>
                </template>
                <template v-slot:body-cell-Seleccionar_lecturainstrumentos="props">
                  <q-td key="Seleccionar_lecturainstrumentos" :props="props" auto-width>
                    <q-btn icon="settings" color="green" align="center" outline @click="CargarCargarCalibracionPruebaInst(props.row)"/>
                  </q-td>
                </template>
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisCalibracionPrueba, columnsCalibracionPruebas, 'ConsultaPruebasInst_')"
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
                    v-model="vcCalibracionPruebas"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsCalibracionPruebas"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                  />
                </template>
              </q-table>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteFiltroRepeticionesInst" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta Repeticiones x Pruebas Instrumentos</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="ListaConsultaPruebasInstInst"
                :columns="columnsConsultaInst"
                :visible-columns="vcConsultaInst">
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(ListaConsultaPruebasInstInst, columnsConsultaInst, 'ConsultaRepeticionInstrumentos_')"
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
                    v-model="vcConsultaInst"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsConsultaInst"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                  />
                </template>
              </q-table>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteFiltroRepeticionesMed" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta Repeticiones x Pruebas Medidores</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="ListaConsultaPruebasMed"
                :columns="columnsConsultaMed"
                :visible-columns="vcConsultaMed">
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(ListaConsultaPruebasMed, columnsConsultaMed, 'ConsultaRepeticionMedidores_')"
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
                    v-model="vcConsultaMed"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsConsultaMed"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                  />
                </template>
              </q-table>
            </div>
            <div class="row justify-center q-pa-sm">
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
  name: 'calibracionMedidores',
  data () {
    return {
      model: null,
      rangoMedicionDet: [],
      Clasemetrologica: { Id_rangomedicion: 0, Nombre_rangomedicion: '' },
      Repeticiones: 1,
      RepeticionesFaltantes: 0,
      ConsultaPruebasInst: { Id_calibracion: -1, Id_repcp: -1, Nrepeticion_repcp: 0, IdRepeticionCPInst: 0, Id_caudal: '', Nombre_instrumento: '', Lectura: 0, Correccion: 0 },
      ListaConsultaPruebasInstInst: [],
      columnsConsultaInst: [
        { name: 'Id_calibracion', align: 'left', label: 'IdCal', field: 'Id_calibracion', required: true },
        { name: 'Id_repcp', align: 'left', label: 'Idrcp', field: 'Id_repcp' },
        { name: 'Nrepeticion_repcp', align: 'left', label: 'Repeticion', field: 'Nrepeticion_repcp' },
        { name: 'IdRepeticionCPInst', align: 'left', label: 'Id', field: 'IdRepeticionCPInst' },
        { name: 'Id_caudal', align: 'left', label: 'Caudal', field: 'Id_caudal' },
        { name: 'Nombre_instrumento', align: 'left', label: 'Instrumento', field: 'Nombre_instrumento' },
        { name: 'Lectura', label: 'Lectura', field: 'Lectura' },
        { name: 'Correccion', label: 'Correccion', field: 'Correccion' }
      ],
      vcConsultaInst: [ 'Nrepeticion_repcp', 'Id_caudal', 'Nombre_instrumento', 'Lectura' ],
      ConsultaPruebasMed: { Id_calibracion: -1, Id_repcp: -1, Nrepeticion_repcp: 0, IdRepeticionCPMedidor: 0, Id_caudal: '', Descripcion_modelomedidor: '', Serialmedidor_ordenentradad: '', VolumenInicial: 0, VolumenFinal: 0 },
      ListaConsultaPruebasMed: [],
      columnsConsultaMed: [
        { name: 'Id_calibracion', align: 'left', label: 'IdCal', field: 'Id_calibracion', required: true },
        { name: 'Id_repcp', align: 'left', label: 'Idrcp', field: 'Id_repcp' },
        { name: 'Nrepeticion_repcp', align: 'left', label: 'Repeticion', field: 'Nrepeticion_repcp' },
        { name: 'IdRepeticionCPMedidor', align: 'left', label: 'Id', field: 'IdRepeticionCPMedidor' },
        { name: 'Id_caudal', align: 'left', label: 'Caudal', field: 'Id_caudal' },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'ModeloMedidor', field: 'Descripcion_modelomedidor' },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'SerialMedidor', field: 'Serialmedidor_ordenentradad' },
        { name: 'VolumenInicial', label: 'VolumenInicial', field: 'VolumenInicial' },
        { name: 'VolumenFinal', label: 'VolumenFinal', field: 'VolumenFinal' }
      ],
      vcConsultaMed: [ 'Nrepeticion_repcp', 'Id_caudal', 'NpuestoBanco', 'Serialmedidor_ordenentradad', 'VolumenInicial', 'VolumenFinal' ],
      Calibracion: { Id_calibracion: -1, Id_programacionorden: -1, Fechaini_calibracion: '', Fechafin_calibracion: '', Fecha_calibracion: '', Observacion_calibracion: '', Login_calibracion: '', Estado_calibracion: 1, LisCalibracionPrueba: [] },
      CalibracionPrueba: { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] },
      RepeticionCP: { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Duraciont_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1, LisRepeticionCPMedidor: [], LisRepeticionCPInstrumento: [] },
      RepeticionCPInst: { IdRepeticionCPInst: 0, Id_repcp: -1, Id_caudal: 0, IdTipoInstrumento: 0, Id_instrumento: 0, Id_instprog: 0, Id_trazabilidadinst: 0, NombreTipoInstrumento: '', LecturaAnterior: 0, CorreccionAnterior: 0, LecturaNueva: 0, CorreccionNueva: 0, Nombre_instrumento: '', Codigo_instrumento: '', Nombre_variablemedicion: '', X_trazabilidadinst: 0, A_trazabilidadinst: 0, B_trazabilidadinst: 0, C_trazabilidadinst: 0, Factorcorreccion_trazabilidadinst: 0, Aplus_trazabilidadinst: '', Bplus_trazabilidadinst: '', Cplus_trazabilidadinst: '', FechaToma: '' },
      RepeticionCPMedidor: { IdRepeticionCPMedidor: 0, Id_repcp: -1, Id_pod: 0, NpuestoBanco: 0, VolumenInicial: 0, VolumenFinal: 0, FechaTomaIni: '', FechaTomaFin: '',  Estado: 1, colorError: 'blue' },
      LecturaMedidor: { Puesto_ordenentradad: 0, Id_pod: 0, Id_caudal: 0, Id_ordenentradad: -1, Serialmedidor_ordenentradad: '', Lectura_ordenentradad: 0, Volumeninicial_repcp: 0, Volumenfinal_repcp: 0, Error_repcp: 0, Diametronominal_modelomedidor: '', Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Fabricacion_ordenentradad: '', Aptocalibrar_ordenentradad: '', Nombre_normaref: '', FechaTomaIni: '', FechaTomaFin: '' },
      LisCalibracionPrueba: [],
      LisRepeticionCP: [],
      LisCalibraciones: [],
      LisRepeticionCPInstrumentos: [],
      step: 1,
      todasFechas: false,
      listaInstrumentosProgramacion: [],
      vcInstrumentosRepeticion: ['Id_caudal', 'NombreTipoInstrumento', 'Lectura', 'Correccion', 'Nombre_instrumento'],
      columnsInstrumentosRepeticion: [
        { name: 'Id_caudal', label: 'Caudal', field: 'Id_caudal', sortable: true },
        { name: 'IdTipoInstrumento', label: 'ITI', field: 'IdTipoInstrumento', sortable: true },
        { name: 'Id_instrumento', label: 'IdInst', field: 'Id_instrumento', sortable: true },
        { name: 'Id_instprog', label: 'IdIP', field: 'Id_instprog', sortable: true },
        { name: 'Id_trazabilidadinst', label: 'IdTI', field: 'Id_trazabilidadinst', sortable: true },
        { name: 'NombreTipoInstrumento', label: 'NombreTipoInstrumento', field: 'NombreTipoInstrumento', align: 'left', sortable: true },
        { name: 'Lectura', label: 'Lectura', field: 'Lectura', sortable: true },
        { name: 'Correccion', label: 'Correccion', field: 'Correccion', sortable: true },
        { name: 'Nombre_instrumento', align: 'left', label: 'Nombre instrumento', field: 'Nombre_instrumento', sortable: true },
        { name: 'Codigo_instrumento', align: 'left', label: 'Código', field: 'Codigo_instrumento', sortable: true },
        { name: 'Nombre_variablemedicion', align: 'left', label: 'Variable medicion', field: 'Nombre_variablemedicion', sortable: true },
        { name: 'X_trazabilidadinst', label: 'A2', field: 'X_trazabilidadinst', sortable: true },
        { name: 'A_trazabilidadinst', label: 'A', field: 'A_trazabilidadinst', sortable: true },
        { name: 'B_trazabilidadinst', label: 'B', field: 'B_trazabilidadinst', sortable: true },
        { name: 'C_trazabilidadinst', label: 'C', field: 'C_trazabilidadinst', sortable: true },
        { name: 'Factorcorreccion_trazabilidadinst', label: 'Fact.Correccion', field: 'Factorcorreccion_trazabilidadinst', sortable: true },
        { name: 'Aplus_trazabilidadinst', label: '+-', field: 'Aplus_trazabilidadinst', sortable: true },
        { name: 'Bplus_trazabilidadinst', label: '+-', field: 'Bplus_trazabilidadinst', sortable: true },
        { name: 'Cplus_trazabilidadinst', label: '+-', field: 'Cplus_trazabilidadinst', sortable: true },
        { name: 'FechaToma', label: 'Fecha', field: 'FechaToma', align: 'left', sortable: true }
      ],
      Instrumento: { Id_instrumento: -1, IdTipoInstrumento: '', Id_variablemedicion: '', Nombre_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Activo_instrumento: false, Login_instrumento: '', LisTrazabilidadInstrumentos: [] },
      banco: { Id_banco: -1, Identificacion_banco: '', Tipo_banco: '', Lineas_banco: -1, Medidores_banco: -1, Descripcion_banco: '', Login_banco: '', Estado_banco: 1 },
      tipoensayo: { Id_tipoensayo: -1, Nombre_tipoensayo: '', Estado_tipoensayo: 1 },
      caudal: { Id_caudal: '', Nombre_caudal: '', Emp_caudal: 0, Factorcobertura_caudal: 0, Estado_caudal: 1 },
      // time: ref('07:30'),
      listaParametrosCalibracion: [],
      parametroCalibracion: { Id_parcal: -1, Descripcion_parcal: '', Observaciones_parcal: -1, Coefexpter_parcal: -1, Incertcoefexpter_parcal: -1, Incertcomprenagua_parcal: -1, Coefexptermat_parcal: -1, Comprenagua_parcal: -1, Incertcoefexptva_parcal: -1, Activo_parcal: -1, Login_parcal: '', Fecha_parcal: '', Estado_parcal: -1 },
      listaCaudales: [],
      SelectedPruebas: [],
      ProgramacionOrden: { Id_programacionorden: -1, Id_ordenentradad: -1, Id_tipoensayo: -1, Nombre_tipoensayo: '', Id_banco: -1, Identificacion_banco: '', Id_parcal: -1, Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', Trazabilidad_programacionorden: -1, LisProgOrdenDet: [], LisInstProg: [], LisCaudales: [], FechaIni: '', FechaFin: '' },
      Normaref: { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [] },
      lisCalibraciones: [],
      lisMedidores: [],
      lisBancos: [],
      lisTipoEnsayo: [],
      fechaIni: '',
      fechaFin: '',
      componente: null,
      isDialogComponente: false,
      isDialogComponenteFiltro: false,
      isDialogComponenteFiltroPruebas: false,
      isDialogComponenteFiltroRepeticionesInst: false,
      isDialogComponenteFiltroRepeticionesMed: false,
      fecha: date,
      usuario: {},
      VolumenRecipiente: 0,
      columnsMedidores: [
        { name: 'Puesto_ordenentradad', align: 'left', label: 'Puesto', field: 'Puesto_ordenentradad', required: true },
        { name: 'Id_pod', align: 'left', label: 'Id', field: 'Id_pod' },
        { name: 'Id_ordenentradad', align: 'left', label: 'IdOED', field: 'Id_ordenentradad' },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'Serial', field: 'Serialmedidor_ordenentradad' },
        { name: 'Lectura_ordenentradad', label: 'Lectura', field: 'Lectura_ordenentradad' },
        { name: 'Volumeninicial_repcp', label: 'Lectura Inicial', field: 'Volumeninicial_repcp' },
        { name: 'Volumenfinal_repcp', label: 'Lectura Final', field: 'Volumenfinal_repcp' },
        { name: 'Error_repcp', label: 'Error', field: 'Error_repcp' },
        { name: 'Nombre_marcamedidor', align: 'left', label: 'Marca Medidor', field: 'Nombre_marcamedidor' },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'Modelo Medidor', field: 'Descripcion_modelomedidor' },
        { name: 'Fabricacion_ordenentradad', align: 'left', label: 'AñoFab', field: 'Fabricacion_ordenentradad' },
        { name: 'Aptocalibrar_ordenentradad', align: 'left', label: 'AptoCal', field: 'Aptocalibrar_ordenentradad' },
        { name: 'Nombre_normaref', align: 'left', label: 'Norma Referencia', field: 'Nombre_normaref' },
        { name: 'FechaTomaIni', label: 'FechaIni', field: 'FechaTomaIni', align: 'left', sortable: true },
        { name: 'FechaTomaFin', label: 'FechaFin', field: 'FechaTomaFin', align: 'left', sortable: true }
      ],
      vcMedidores: ['Puesto_ordenentradad', 'Serialmedidor_ordenentradad', 'Volumeninicial_repcp', 'Volumenfinal_repcp', 'Error_repcp'],
      columnsCaudales: [
        { name: 'Id_caudal', align: 'left', label: 'Id', field: 'Id_caudal', sortable: true },
        { name: 'Nombre_caudal', align: 'left', label: 'Nombre Prueba', field: 'Nombre_caudal', sortable: true },
        { name: 'Modificar_caudal', label: 'Modificar', field: 'Modificar_caudal' }
      ],
      LisProgramaciones: [],
      columnsProgramaciones: [
        { name: 'Seleccionar_programacionorden', align: 'left', label: 'Cargar', field: 'Seleccionar_programacionorden', required: true, sortable: true },
        { name: 'Id_programacionorden', align: 'left', label: 'OrdenTrabajo', field: 'Id_programacionorden', required: true, sortable: true },
        { name: 'Id_tipoensayo', align: 'left', label: 'IdTE', field: 'Id_tipoensayo', sortable: true },
        { name: 'Nombre_tipoensayo', align: 'left', label: 'Nombre tipoensayo', field: 'Nombre_tipoensayo', sortable: true },
        { name: 'Id_banco', label: 'IdBanco', field: 'Id_banco', sortable: true },
        { name: 'Identificacion_banco', align: 'left', label: 'Nombre Banco', field: 'Identificacion_banco', sortable: true },
        { name: 'Id_parcal', align: 'left', label: 'IdParcal', field: 'Id_parcal', sortable: true },
        { name: 'Fechacalibracion_programacionorden', align: 'left', label: 'FechaCalibracion', field: 'Fechacalibracion_programacionorden', sortable: true },
        { name: 'Horacalibracion_programacionorden', align: 'left', label: 'Hora', field: 'Horacalibracion_programacionorden', sortable: true },
        { name: 'Duracioncalibracion_programacionorden', label: 'Duracion', field: 'Duracioncalibracion_programacionorden', sortable: true },
        { name: 'Medidores_programacionorden', label: 'Medidores', field: 'Medidores_programacionorden', sortable: true },
        { name: 'Supervisor_programacionorden', label: 'Supervisor', field: 'Supervisor_programacionorden', sortable: true },
        { name: 'Nombre_supervisor', align: 'left', label: 'Nombre Supervisor', field: 'Nombre_supervisor', sortable: true },
        { name: 'Encargado_programacionorden', label: 'Encargado', field: 'Encargado_programacionorden', sortable: true },
        { name: 'Nombre_encargado', align: 'left', label: 'Nombre Encargado', field: 'Nombre_encargado', sortable: true },
        { name: 'Observacion_programacionorden', align: 'left', label: 'Observacion', field: 'Observacion_programacionorden', sortable: true },
        { name: 'Login_programacionorden', align: 'left', label: 'Login', field: 'Login_programacionorden', sortable: true },
        { name: 'Fecha_programacionorden', align: 'left', label: 'Fecha', field: 'Fecha_programacionorden', sortable: true },
        { name: 'Login_programacionorden', align: 'left', label: 'Login', field: 'Login_programacionorden', sortable: true }
      ],
      vcProgramaciones: ['Fechacalibracion_programacionorden', 'Horacalibracion_programacionorden', 'Duracioncalibracion_programacionorden', 'Medidores_programacionorden', 'Nombre_encargado', 'Nombre_supervisor'],
      vcCalibraciones: ['Fechaini_calibracion', 'Fechafin_calibracion', 'Medidores_programacionorden', 'Nombre_encargado', 'Nombre_supervisor'],
      columnsCalibraciones: [
        { name: 'Seleccionar_calibracion', align: 'left', label: 'Verificar', field: 'Seleccionar_calibracion', required: true, sortable: true },
        { name: 'Id_calibracion', align: 'left', label: 'Id', field: 'Id_calibracion', required: true, sortable: true },
        { name: 'Id_programacionorden', align: 'left', label: 'IdPrg', field: 'Id_programacionorden', required: true, sortable: true },
        { name: 'Medidores_programacionorden', label: 'Medidores', field: 'Medidores_programacionorden', sortable: true },
        { name: 'Nombre_supervisor', align: 'left', label: 'Nombre Supervisor', field: 'Nombre_supervisor', sortable: true },
        { name: 'Nombre_encargado', align: 'left', label: 'Nombre Encargado', field: 'Nombre_encargado', sortable: true },
        { name: 'Observacion_calibracion', align: 'left', label: 'Observacion', field: 'Observacion_calibracion', sortable: true },
        { name: 'Login_calibracion', align: 'left', label: 'Login', field: 'Login_calibracion', sortable: true },
        { name: 'Fechaini_calibracion', align: 'left', label: 'Inicio', field: 'Fechaini_calibracion', sortable: true },
        { name: 'Fechafin_calibracion', align: 'left', label: 'Final', field: 'Fechafin_calibracion', sortable: true },
        { name: 'Fecha_calibracion', align: 'left', label: 'Fecha', field: 'Fecha_calibracion', sortable: true }
      ],
      vcCalibracionPruebas: ['Tempambini_calprueba', 'Tempambfin_calprueba', 'Humedadrelini_calprueba', 'Humedadrelfin_calprueba', 'Fechaini_calprueba', 'Fechafin_calprueba'],
      columnsCalibracionPruebas: [
        { name: 'Seleccionar_lecturamedidores', align: 'left', label: 'Medidores', field: 'Seleccionar_lecturamedidores', required: true, sortable: true },
        { name: 'Seleccionar_lecturainstrumentos', align: 'left', label: 'Instrumentos', field: 'Seleccionar_lecturainstrumentos', required: true, sortable: true },
        { name: 'Id_calprueba', align: 'left', label: 'Id', field: 'Id_calprueba', sortable: true },
        { name: 'Id_calibracion', align: 'left', label: 'IdCal', field: 'Id_calibracion', sortable: true },
        { name: 'Id_caudal', align: 'left', label: 'caudal', field: 'Id_caudal', required: true, sortable: true },
        { name: 'Fechaini_calprueba', align: 'left', label: 'Inicio', field: 'Fechaini_calprueba', sortable: true },
        { name: 'Fechafin_calprueba', align: 'left', label: 'Final', field: 'Fechafin_calprueba', sortable: true },
        { name: 'Login_calprueba', align: 'left', label: 'Login', field: 'Login_calprueba', sortable: true },
        { name: 'Observacion_calprueba', align: 'left', label: 'Observacion', field: 'Observacion_calprueba', sortable: true },
        { name: 'Fecha_calprueba', align: 'left', label: 'Fecha', field: 'Fecha_calprueba', sortable: true }
      ]
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.mostrarBancos(this.banco)
    this.mostrarTipoEnsayo(this.tipoensayo)
    this.mostrarCaudal(this.caudal)
    this.mostrarParametrosCalibracion(this.parametroCalibracion)
    this.reiniciarCalibracion()
    this.Calibracion.Fechaini_calibracion = utils.fechaActual()
    this.Calibracion.Fechafin_calibracion = utils.fechaActual()
  },
  created () {
    // const instrumento = { Id_instrumento: -1, Id_variablemedicion: '', Nombre_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Activo_instrumento: 1, Login_instrumento: '', LisTrazabilidadInstrumentos: [] }
    // this.mostrarInstrumentosGeneral(instrumento)
  },
  methods: {
    limpiarCalibracionPruebas () {
      this.CalibracionPrueba = { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] }
      this.RepeticionCP = { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Duraciont_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1, LisRepeticionCPMedidor: [], LisRepeticionCPInstrumento: [] }
      this.RepeticionCPInst = { IdRepeticionCPInst: -1, Id_repcp: -1, Id_caudal: 0, IdTipoInstrumento: 0, Id_instrumento: 0, Id_instprog: 0, Id_trazabilidadinst: 0, NombreTipoInstrumento: '', LecturaAnterior: 0, CorreccionAnterior: 0, LecturaNueva: 0, CorreccionNueva: 0, Nombre_instrumento: '', Codigo_instrumento: '', Nombre_variablemedicion: '', X_trazabilidadinst: 0, A_trazabilidadinst: 0, B_trazabilidadinst: 0, C_trazabilidadinst: 0, Factorcorreccion_trazabilidadinst: 0, Aplus_trazabilidadinst: '', Bplus_trazabilidadinst: '', Cplus_trazabilidadinst: '', FechaToma: '' }
      this.RepeticionCPMedidor = { IdRepeticionCPMedidor: 0, Id_repcp: -1, Id_pod: 0, NpuestoBanco: 0, VolumenInicial: 0, VolumenFinal: 0, FechaTomaIni: '', FechaTomaFin: '',  Estado: 1, colorError: 'blue' }
    },
    handleKeydown(event) {
      if (event.key === "Tab") {
        this.$refs.table.nextCell();
      }
    },
    CalcularCorreccion (fila) {
      fila.Correccion = utils.verificarValorX(fila, fila.Lectura)
      if (fila.IdTipoInstrumento === 'RV') {
        this.VolumenRecipiente = fila.Correccion
      }
      // let newListaRangoMedicion = this.rangoMedicionDet.filter(x => x.TipoInstrumento.Aplica === Aplica && x.TipoInstrumento.Ejecuta === Ejecuta)
      fila.FechaToma = utils.fechaHora()
    },
    CalcularTiempo () {
      this.RepeticionCP.Duraciont_repcp = (parseFloat(this.RepeticionCP.Duracionh_repcp) * 3600) + (parseFloat(this.RepeticionCP.Duracionm_repcp) * 60) + parseFloat(this.RepeticionCP.Duracions_repcp)
      for (const t of this.LisRepeticionCPInstrumentos) {
        if (t.IdTipoInstrumento === 'TP') {
          t.Lectura = this.RepeticionCP.Duraciont_repcp
          this.CalcularCorreccion(t)
          break
        }
      }
    },
    fechaTomaMedidor (fila, iniFin)
    {
      const self = this
      if (iniFin === 'I') {
        fila.FechaTomaIni = utils.fechaHora()
      } else {
        fila.FechaTomaFin = utils.fechaHora()
        fila.Error_repcp = ((((fila.Volumenfinal_repcp - fila.Volumeninicial_repcp) * 1000) - (this.VolumenRecipiente * 1000)) / (this.VolumenRecipiente * 1000)) * 100
        if (fila.Error_repcp > self.caudal.Emp_caudal || fila.Error_repcp < (self.caudal.Emp_caudal * -1)) {
        fila.colorError = 'red'
        } else {
          fila.colorError = 'blue'
        }
      }
    },
    CargarCalibracion (Cal) {
      const self = this
      self.Calibracion = Cal
      self.Calibracion.Fechaini_calibracion = utils.fechaHora()
      self.Calibracion.Fechafin_calibracion = utils.fechaHora()
      self.LisCalibracionPrueba = Cal.LisCalibracionPrueba
      self.isDialogComponenteFiltroPruebas = true
    },
    CargarCargarCalibracionPruebaInst (CP) {
      const self = this
      self.ListaConsultaPruebasInstInst = []
      self.CalibracionPrueba = CP
      for (const rep of CP.LisRepeticionCP) {
        for (const repIns of rep.LisRepeticionCPInstrumento) {
          let conP = {...self.ConsultaPruebasInst}
          conP.Id_calibracion = CP.Id_calibracion
          conP.Id_repcp = repIns.Id_repcp
          conP.Nrepeticion_repcp = rep.Nrepeticion_repcp
          conP.IdRepeticionCPInst = repIns.IdRepeticionCPInst
          conP.Id_caudal = CP.Id_caudal
          conP.Nombre_instrumento = repIns.InstrumentoProgramacion.Instrumento.Nombre_instrumento
          conP.Lectura = repIns.Lectura
          conP.Correccion = repIns.Correccion
          self.ListaConsultaPruebasInstInst.push(conP)
        }
      }
      // self.LisRepeticionCP = CP.LisRepeticionCP
      self.isDialogComponenteFiltroRepeticionesInst = true
    },
    CargarCargarCalibracionPruebaMed (CP) {
      const self = this
      self.ListaConsultaPruebasMed = []
      self.CalibracionPrueba = CP
      for (const rep of CP.LisRepeticionCP) {
        for (const repMed of rep.LisRepeticionCPMedidor) {
          let conP = {...self.ConsultaPruebasMed}
          conP.Id_calibracion = CP.Id_calibracion
          conP.Id_repcp = repMed.Id_repcp
          conP.Nrepeticion_repcp = rep.Nrepeticion_repcp
          conP.IdRepeticionCPMedidor = repMed.IdRepeticionCPMedidor
          conP.Id_caudal = CP.Id_caudal
          conP.Descripcion_modelomedidor = repMed.Descripcion_modelomedidor
          conP.Serialmedidor_ordenentradad = repMed.Serialmedidor_ordenentradad
          conP.VolumenInicial = repMed.VolumenInicial
          conP.VolumenFinal = repMed.VolumenFinal
          self.ListaConsultaPruebasMed.push(conP)
        }
      }
      // self.LisRepeticionCP = CP.LisRepeticionCP
      self.isDialogComponenteFiltroRepeticionesMed = true
    },
    LlenarTablaDatosPrueba (Aplica, Ejecuta)
    {
      const self = this
      for (const cpInst of self.LisRepeticionCPInstrumentos) {
        self.RepeticionCP.LisRepeticionCPInstrumento.push(cpInst)
      }

      self.LisRepeticionCPInstrumentos = []
      let newListaC = self.listaInstrumentosProgramacion.filter(c => c.Id_caudal === self.caudal.Id_caudal)
      let newListaIP = newListaC.filter(x => x.TipoInstrumento.Aplica === Aplica && x.TipoInstrumento.Ejecuta === Ejecuta)
      for (const Iti of newListaIP) {
        let repeticionInstrumento = {...self.RepeticionCPInst }
        repeticionInstrumento.Id_caudal = this.caudal.Id_caudal
        repeticionInstrumento.IdTipoInstrumento = Iti.IdTipoInstrumento
        repeticionInstrumento.Id_instrumento = Iti.Id_instrumento
        repeticionInstrumento.Id_instprog = Iti.Id_instprog
        repeticionInstrumento.Id_trazabilidadinst = Iti.Id_trazabilidadinst
        repeticionInstrumento.NombreTipoInstrumento = Iti.Instrumento.NombreTipoInstrumento
        repeticionInstrumento.Lectura = ''
        repeticionInstrumento.Correccion = 0
        repeticionInstrumento.Nombre_instrumento = Iti.Instrumento.Nombre_instrumento
        repeticionInstrumento.Codigo_instrumento = Iti.Instrumento.Codigo_instrumento
        repeticionInstrumento.Nombre_variablemedicion = Iti.Instrumento.Nombre_variablemedicion
        repeticionInstrumento.X_trazabilidadinst = Iti.TrazabilidadInstrumento.X_trazabilidadinst
        repeticionInstrumento.A_trazabilidadinst = Iti.TrazabilidadInstrumento.A_trazabilidadinst
        repeticionInstrumento.B_trazabilidadinst = Iti.TrazabilidadInstrumento.B_trazabilidadinst
        repeticionInstrumento.C_trazabilidadinst = Iti.TrazabilidadInstrumento.C_trazabilidadinst
        repeticionInstrumento.Factorcorreccion_trazabilidadinst = Iti.TrazabilidadInstrumento.Factorcorreccion_trazabilidadinst
        repeticionInstrumento.Aplus_trazabilidadinst = Iti.TrazabilidadInstrumento.Aplus_trazabilidadinst
        repeticionInstrumento.Bplus_trazabilidadinst = Iti.TrazabilidadInstrumento.Bplus_trazabilidadinst
        repeticionInstrumento.Cplus_trazabilidadinst = Iti.TrazabilidadInstrumento.Cplus_trazabilidadinst
        self.LisRepeticionCPInstrumentos.push(repeticionInstrumento)
      }
    },
    CargarProgramacionOrden (progOrden) {
      const self = this
      const listaTipoInstrumentos = [ 'HR', 'TA', 'PE', 'PS', 'QX', 'RV', 'TL', 'TP', 'TR' ]
      self.ProgramacionOrden = progOrden
      self.listaCaudales = progOrden.LisCaudales
      self.listaInstrumentosProgramacion = progOrden.LisInstProg
      self.rangoMedicionDet = []
      // Verificar los instrumentos programados para la calibración por cada Caudal
      if (self.listaCaudales.length < 1) {
        utils.mensaje('No existen caudales para la calibración')
        return
      }
      if (self.listaInstrumentosProgramacion.length < 8) {
        utils.mensaje('No existen instrumentos suficientes para la calibración')
        return
      }
      for (const caudal of self.listaCaudales) {
        let newListaC = self.listaInstrumentosProgramacion.filter(c => c.Id_caudal === caudal.Id_caudal)
        for (const ti of listaTipoInstrumentos) {
          let newListaIP = newListaC.filter(x => x.IdTipoInstrumento === ti)
          if (newListaIP.length < 1) {
            utils.mensaje('No existe instrumento programado para la calibración, Tipo Instrumento: ' + ti)
            return  
          }
        }
      }
      
      // llenar objeto Calibración
      self.Calibracion.Id_programacionorden = progOrden.Id_programacionorden
      self.Calibracion.Fechaini_calibracion = utils.fechaHora()
      self.Calibracion.Login_calibracion = self.usuario.LoginUsuario

      // Inicializar CalibracionPrube - RepeticionCP - RepeticionMedidorCP - RepeticionInstrumentosCP
      self.limpiarCalibracionPruebas()

      const lista = progOrden.LisProgOrdenDet
      self.lisMedidores = []
      var puesto = 1
      for (const med of lista) {
        const medidor = { ...this.LecturaMedidor }
        const clasemetrologica = {...this.Clasemetrologica}

        clasemetrologica.Id_rangomedicion = med.OrdenED.Clasemetrologica_ordenentradad
        // self.rangoMedicionDet.push(clasemetrologica)
        // const calPrueba = { ...this.CalibracionPrueba }
        medidor.Puesto_ordenentradad = puesto
        medidor.Id_pod = med.Id_pod
        // medidor.Id_caudal = med.Id_caudal
        medidor.Id_ordenentradad = med.Id_ordenentradad
        medidor.Lectura_ordenentradad = med.OrdenED.Lectura_ordenentradad
        medidor.Volumeninicial_repcp = ''
        medidor.Volumenfinal_repcp = ''
        medidor.Fabricacion_ordenentradad = med.OrdenED.Fabricacion_ordenentradad
        medidor.Aptocalibrar_ordenentradad = med.OrdenED.Aptocalibrar_ordenentradad
        medidor.Nombre_normaref = med.OrdenED.Nombre_normaref
        medidor.Nombre_marcamedidor = med.OrdenED.Nombre_marcamedidor
        medidor.Descripcion_modelomedidor = med.OrdenED.Descripcion_modelomedidor
        medidor.Serialmedidor_ordenentradad = med.OrdenED.Serialmedidor_ordenentradad
        // medidor.Diametronominal_modelomedidor = med.OrdenED.
        self.lisMedidores.push(medidor)
        puesto++
      }
      var i = this.LisProgramaciones.indexOf(progOrden)
      // self.rangoMedicionDet = utils.rangoMedicionDetMostrarIdRangoMedicion('R160', self)
      self.LisProgramaciones.splice(i, 1)
      this.step = 2
    },
    MontadaInicial () {
      for (const medidor of this.lisMedidores) {
        if (medidor.Volumeninicial_repcp === '') {
          utils.mensaje('Debe ingresar la lectura inicial de todos los medidores expresado en litros (l)')
          return
        }
      }
      this.step = 3
    },
    FinalizarKit () {
      const self = this
      // CARGAR LOS DATOS DE LA REPETICION
      if (self.RepeticionCP.Fechaini_repcp === '') {
        self.RepeticionCP.Fechaini_repcp = utils.fechaHora()
      }
      self.LlenarTablaDatosPrueba('Repeticion', 'Final')
      this.step = 6
    },
    finalizarRepeticion () {
      //Guardar Repetición
      const self = this
      let idPod = 0
      for (const medidor of this.lisMedidores) {
        if (medidor.Volumenfinal_repcp === '') {
          utils.mensaje('Debe ingresar la lectura final de todos los medidores expresado en litros (l)')
          return
        }
      }
      //Llenar lista de los medidores de la repetición
      for (const medidor of self.lisMedidores) {
        const repeticionMed = { ...self.RepeticionCPMedidor }
        idPod = medidor.Id_pod
        repeticionMed.Id_pod = medidor.Id_pod
        repeticionMed.NpuestoBanco = medidor.Puesto_ordenentradad
        repeticionMed.VolumenInicial = medidor.Volumeninicial_repcp
        repeticionMed.VolumenFinal = medidor.Volumenfinal_repcp
        repeticionMed.FechaTomaIni = medidor.FechaTomaIni
        repeticionMed.FechaTomaFin = medidor.FechaTomaFin
        self.RepeticionCP.LisRepeticionCPMedidor.push(repeticionMed)
        medidor.Volumeninicial_repcp = medidor.Volumenfinal_repcp
        medidor.Volumenfinal_repcp = ''
      }

      self.RepeticionCP.Fechafin_repcp = utils.fechaHora()
      self.RepeticionCP.Nrepeticion_repcp = self.Repeticiones
      self.RepeticionCP.Id_pod = idPod

      if (self.RepeticionesFaltantes > 1) {
        self.LlenarTablaDatosPrueba('Repeticion', 'Inicio')
        const repeticionCP = { ...self.RepeticionCP }
      
        self.CalibracionPrueba.LisRepeticionCP.push(repeticionCP)
        self.RepeticionCP = { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Duraciont_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1, LisRepeticionCPMedidor: [], LisRepeticionCPInstrumento: [] }
        this.RepeticionesFaltantes--
        this.Repeticiones++
        this.step = 5
      } else {
        this.LlenarTablaDatosPrueba('Caudal', 'Inicio y Final')
        self.RepeticionCP.Fechafin_repcp = utils.fechaHora()
        this.step = 7
      }
    },
    FinalizarPruebaCaudal () {
      const self = this
      // CARGAR LAS CONDICIONES INICIALES TEMPERATURA Y HUMEDAD RELATIVA
      self.LlenarTablaDatosPrueba('Caudal', 'Inicio y Final')
      const repeticionCP = { ...self.RepeticionCP }
      
      self.CalibracionPrueba.LisRepeticionCP.push(repeticionCP)
      self.RepeticionCP = { Id_repcp: -1, Id_pod: 0, Id_calprueba: -1, Nrepeticion_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Duraciont_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1, LisRepeticionCPMedidor: [], LisRepeticionCPInstrumento: [] }
        
      this.CalibracionPrueba.Fechafin_calprueba = utils.fechaHora()
      const calibracionP = { ...this.CalibracionPrueba }
      this.Calibracion.LisCalibracionPrueba.push(calibracionP)
      this.CalibracionPrueba = { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] }
      // this.LisRepeticionCP = []

      if (this.listaCaudales.length > 0) {
        this.Repeticiones = 1
        this.RepeticionesFaltantes = 0
        this.step = 2
      } else {
        this.step = 8
      }
    },
    FinalizarCalibracion () {
      // Guardar la Calibración y reiniciar las variables
      this.Calibracion.Fechafin_calibracion = utils.fechaHora()
      this.guardarCalibracion()
    },
    TerminarPrueba () {
      if (this.listaCaudales.length > 0) {
        this.step = 5
      } else {
        this.step = 3
      }
    },
    exportTable (tablaE, columnasE, nombreTabla) {
      // naive encoding to csv format
      const content = [columnasE.map(col => wrapCsvValue(col.label))].concat(
        tablaE.map(row => columnasE.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === undefined ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      var nombreArchivo = nombreTabla + utils.fechaActual()
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
    mostrarBancos (banco) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/bancosMostrarFiltro/', banco)
        .then((response) => {
          self.lisBancos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Bancos ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarParametrosCalibracion (parcal) {
      const self = this
      self.$q.loading.show()
      api.post('/programacionorden/parametrosCalibracionMostrarFiltro/', parcal)
        .then((response) => {
          self.listaParametrosCalibracion = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Parametros Calibración' + error)
          self.$q.loading.hide()
        })
    },
    cargarBanco(banco) {
      this.banco = banco
    },
    mostrarTipoEnsayo (tipoEns) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/tipoEnsayoMostrar/', tipoEns)
        .then((response) => {
          self.lisTipoEnsayo = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Tipo Ensayo ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarCaudal (caudal) {
      const self = this
      self.$q.loading.show()
      api.post('/programacionorden/caudalMostrar/', caudal)
        .then((response) => {
          self.listaCaudales = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Tipo Ensayo ' + error)
          self.$q.loading.hide()
        })
    },
    IniciarPrueba (fila) {
      const self = this
      var i = this.listaCaudales.indexOf(fila)
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de iniciar la prueba ' + fila.Nombre_caudal + '?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.Repeticiones = 1
        self.RepeticionesFaltantes = 0
        self.LisRepeticionCPInstrumentos = []
        for (const p of self.listaParametrosCalibracion) {
          if (p.Id_parcal === self.ProgramacionOrden.Id_parcal) {
            self.RepeticionesFaltantes = p.Observaciones_parcal
            break
          }
        }
        this.SelectedPruebas.push(fila)
        this.listaCaudales.splice(i, 1)
        self.CalibracionPrueba.Id_caudal = fila.Id_caudal
        self.CalibracionPrueba.Fechaini_calprueba = utils.fechaHora()
        self.CalibracionPrueba.Login_calprueba = self.usuario.LoginUsuario
        self.caudal = fila
        
        // CARGAR LAS CONDICIONES INICIALES TEMPERATURA Y HUMEDAD RELATIVA
        self.LlenarTablaDatosPrueba('Caudal', 'Inicio y Final')
        self.step = 4
      }).onCancel(() => {
      })
    },
    IniciarRepeticion () {
      const self = this
      // CARGAR LOS DATOS DE LA REPETICION
      self.LlenarTablaDatosPrueba('Repeticion', 'Inicio')
      self.RepeticionCP.Fechaini_repcp = utils.fechaHora()
      self.step = 5
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} para calibrar`
    },
    regresar () {
      this.$router.push('/admin')
    },
    reiniciarCalibracion () {
      this.ProgramacionOrden = { Id_programacionorden: -1, Id_ordenentradad: -1, Id_tipoensayo: -1, Nombre_tipoensayo: '', Id_banco: -1, Identificacion_banco: '', Id_parcal: -1, Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', LisProgOrdenDet: [], LisInstProg: [] }
      this.ProgramacionOrden.Fechacalibracion_programacionorden = utils.fechaActual()
      this.ProgramacionOrden.FechaIni = utils.fechaActual()
      this.ProgramacionOrden.FechaFin = utils.fechaActual()
      this.ProgramacionOrden.Horacalibracion_programacionorden = '07:30'
      this.ProgramacionOrden.Login_programacionorden = this.usuario.LoginUsuario 
      this.fechaIni = this.ProgramacionOrden.Fechacalibracion_programacionorden
      this.fechaFin = this.ProgramacionOrden.Fechacalibracion_programacionorden
      this.SelectedPruebas = []
      this.LisCalibracionPrueba = []
      this.Calibracion = { Id_calibracion: -1, Id_programacionorden: -1, Fechaini_calibracion: '', Fechafin_calibracion: '', Fecha_calibracion: '', Observacion_calibracion: '', Login_calibracion: '', Estado_calibracion: 1, LisCalibracionPrueba: [] }
      this.CalibracionPrueba = { Id_calprueba: -1, Id_calibracion: -1, Id_caudal: '', Tempambini_calprueba: 0, Tempambfin_calprueba: 0, Humedadrelini_calprueba: 0, Humedadrelfin_calprueba: 0, Observacion_calprueba: '', Fechaini_calprueba: '', Fechafin_calprueba: '', Fecha_calprueba: '', Login_calprueba: '', Estado_calprueba: 0, LisRepeticionCP: [] }
      this.RepeticionCP = { Id_repcp: -1, Id_calprueba: -1, Nrepeticion_repcp: 0, Duracionh_repcp: 0, Duracionm_repcp: 0, Duracions_repcp: 0, Duraciont_repcp: 0, Fechaini_repcp: '', Fechafin_repcp: '', Observacion_repcp: '', Estado_repcp: 1, LisRepeticionCPMedidor: [], LisRepeticionCPInstrumento: [] }
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    guardarCalibracion () {
      const self = this
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Esta seguro de guardar la calibración?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        api.post('/calibracionmedidores/insertarCalibracionMedidores/', this.Calibracion)
        .then((response) => {
          self.reiniciarCalibracion()
          self.$q.loading.hide()
          this.step = 1
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Guardar Calibración ' + error)
          self.$q.loading.hide()
        })
      }).onCancel(() => {
      })
    },
   formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    },
    formatoNumeroTipo (numero, tipo) {
      // RECIPIENTES VOLUMETRICOS
      let decimales = 0
      switch(tipo) {
        case 'HR':
        case 'TA':
          decimales = 1
          break
        case 'RV':
          decimales = 3
          break
        default: 
          decimales = 2
      }
      return utils.formatoNumero(numero, decimales)
    },
    consultarFiltroProgramacion () {
      const self = this
      self.$q.loading.show()
      self.ProgramacionOrden.FechaIni = utils.fechaActual()
      self.ProgramacionOrden.FechaFin = utils.fechaActual()
      if (self.todasFechas === true) {
        self.ProgramacionOrden.Id_programacionorden = 1
      } else {
        self.ProgramacionOrden.Id_programacionorden = 2
      }
      self.ProgramacionOrden.Login_programacionorden = ''
      self.ProgramacionOrden.Encargado_programacionorden = this.usuario.LoginUsuario
      self.ProgramacionOrden.Trazabilidad_programacionorden = 1
      api.post('/programacionorden/ProgramacionConsultaFechas/', this.ProgramacionOrden)
        .then((response) => {
          self.LisProgramaciones = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - LisProgramaciones ' + error)
          self.$q.loading.hide()
        })
    },
    consultarFiltroCalibracion () {
      const self = this
      self.$q.loading.show()
      self.LisCalibraciones = []
      self.Calibracion.Id_calibracion = -1
      self.Calibracion.Id_programacionorden = -1
      if (self.todasFechas === true) {
        self.Calibracion.Estado_calibracion = 1
      } else {
        self.Calibracion.Estado_calibracion = 0
      }
      self.Calibracion.Login_calibracion = ''
      api.post('/calibracionmedidores/consultarCalibracionMedidores/', this.Calibracion)
        .then((response) => {
          const lista = response.data
          lista.forEach(function (lcalib) {
              var calib = { ...self.Calibracion }
              calib = lcalib
              calib.Medidores_programacionorden = lcalib.Programacionorden.Medidores_programacionorden
              calib.Nombre_supervisor = lcalib.Programacionorden.Nombre_supervisor
              calib.Nombre_encargado = lcalib.Programacionorden.Nombre_encargado
              
              self.LisCalibraciones.push(calib)
          })
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - LisCalibraciones ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>
