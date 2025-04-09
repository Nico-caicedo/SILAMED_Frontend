<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn
            flat
            round
            dense
            icon="content_paste_search"
            @click="isDialogComponenteFiltro = true"
          />
        </q-avatar>
        <q-toolbar-title>
          Verificación Calibración de Medidores
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formVerificacionCalibracionMedidores">
        <div class="q-pa-md">
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step
              :name="1"
              title="1. Seleccione una calibración para realizar la verificación"
              icon="search"
              :done="step > 1"
            >
              <div class="row q-col-gutter-sm">
                <q-toggle
                  class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm"
                  v-model="todasFechas"
                  checked-icon="check"
                  color="green"
                  label="Consultar todas las fechas"
                  unchecked-icon="clear"
                />
                <q-input
                  class="col-xs-12 col-sm-6 col-md-3 q-pt-sm"
                  readonly
                  stack-label
                  label="Registros Encontrados"
                  v-model="LisCalibraciones.length"
                  outlined
                />
                <q-input
                  class="col-xs-12 col-sm-6 col-md-3 q-pt-sm"
                  stack-label
                  label="Fecha Inicio"
                  :readonly="todasFechas === true"
                  v-model="Calibracion.Fechaini_calibracion"
                  type="date"
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input
                  class="col-xs-12 col-sm-6 col-md-3 q-pt-sm"
                  stack-label
                  label="Fecha Fin"
                  :readonly="todasFechas === true"
                  v-model="Calibracion.Fechafin_calibracion"
                  type="date"
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-table
                  class="col-xs-12 col-sm-12 col-md-12"
                  title=""
                  no-data-label="No hay registros"
                  hide-bottom
                  :rows-per-page-options="[0]"
                  flat
                  bordered
                  :data="LisCalibraciones"
                  :columns="columnsCalibraciones"
                  :visible-columns="vcCalibraciones"
                >
                  <template v-slot:body-cell-Seleccionar_calibracion="props">
                    <q-td
                      key="Seleccionar_calibracion"
                      :props="props"
                      auto-width
                    >
                      <q-btn
                        :icon="props.row.Icono"
                        :color="props.row.Color"
                        align="center"
                        outline
                        @click="CargarCalibracion(props.row)"
                      />
                    </q-td>
                  </template>
                  <template v-slot:top="props">
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="
                        exportTable(LisCalibraciones, columnsCalibraciones)
                      "
                    />
                    <q-space />
                    <q-btn
                      flat
                      round
                      dense
                      :icon="
                        props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                      "
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
                <q-btn
                  label="Consultar"
                  icon="search"
                  outline
                  align="center"
                  unelevated
                  @click="consultarFiltroCalibracion()"
                >
                </q-btn>
              </div>
            </q-step>

            <q-step
              :name="2"
              title="2. Verificar Pruebas por Caudal"
              icon="settings"
              :done="step > 2"
            >
              Seleccione cada prueba para realizar la verificación por cada
              repetición e ingrese observación
              <q-table
                class="col-xs-12 col-sm-12 col-md-12"
                title=""
                no-data-label="No hay registros"
                hide-bottom
                :rows-per-page-options="[0]"
                flat
                bordered
                :data="LisCalibracionPrueba"
                :columns="columnsCalibracionPruebas"
                :visible-columns="vcCalibracionPruebas"
              >
                <template
                  v-slot:body-cell-Seleccionar_calibracionprueba="props"
                >
                  <q-td
                    key="Seleccionar_calibracionprueba"
                    :props="props"
                    auto-width
                  >
                    <q-btn
                      icon="verified"
                      color="blue"
                      align="center"
                      outline
                      @click="CargarCargarCalibracionPrueba(props.row)"
                    />
                  </q-td>
                </template>
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="
                      exportTable(
                        LisCalibracionPrueba,
                        columnsCalibracionPruebas
                      )
                    "
                  />
                  <q-space />
                  <q-btn
                    flat
                    round
                    dense
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
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
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      key="Seleccionar_calibracionprueba"
                      :props="props"
                      auto-width
                    >
                      <q-btn
                        :icon="props.row.Icono"
                        :color="props.row.Color"
                        align="center"
                        outline
                        @click="CargarCargarCalibracionPrueba(props.row)"
                      />
                    </q-td>
                    <q-td key="Id_calprueba" :props="props">
                      {{ props.row.Id_calprueba }}
                    </q-td>
                    <q-td key="Id_calibracion" :props="props">
                      {{ props.row.Id_calibracion }}
                    </q-td>
                    <q-td key="Id_caudal" :props="props">
                      {{ props.row.Id_caudal }}
                    </q-td>
                    <q-td key="Fechaini_calprueba" :props="props">
                      {{ props.row.Fechaini_calprueba }}
                    </q-td>
                    <q-td key="Fechafin_calprueba" :props="props">
                      {{ props.row.Fechafin_calprueba }}
                    </q-td>
                    <q-td key="Login_calprueba" :props="props">
                      {{ props.row.Login_calprueba }}
                    </q-td>
                    <q-td key="Observacion_calprueba" :props="props">
                      {{ props.row.Observacion_calprueba }}
                    </q-td>
                    <q-td key="Fecha_calprueba" :props="props">
                      {{ props.row.Fecha_calprueba }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <q-stepper-navigation>
                <q-btn
                  @click="step = 6"
                  outline
                  align="center"
                  unelevated
                  color="red"
                  label="Saltar"
                  class="q-ml-sm"
                />
                <q-btn
                  @click="step = 1"
                  color="primary"
                  label="Volver"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="3"
              title="3. Verificar repeticiones por prueba"
              icon="update"
              :done="step > 3"
            >
              Proceda a realizar la verificación por cada repetición de la
              prueba <b> {{ IdCaudalMostrar }} </b>
              <q-table
                class="col-xs-12 col-sm-12 col-md-12"
                title=""
                no-data-label="No hay registros"
                hide-bottom
                :rows-per-page-options="[0]"
                flat
                bordered
                :data="LisRepeticionCP"
                :columns="columnsRepeticionesCP"
                :visible-columns="vcRepeticionesCP"
                row-key="Id_repcp"
              >
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="exportTable(LisRepeticionCP, columnsRepeticionesCP)"
                  />
                  <q-space />
                  <q-btn
                    flat
                    round
                    dense
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="q-ml-md"
                  />
                  <q-space />
                  <q-select
                    v-model="vcRepeticionesCP"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columnsRepeticionesCP"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                  />
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="Seleccionar_repcp" :props="props" auto-width>
                      <q-btn
                        :icon="props.row.Icono"
                        :color="props.row.Color"
                        align="center"
                        outline
                        @click="CargarRepeticion(props.row)"
                      />
                    </q-td>
                    <q-td key="Id_repcp" :props="props">
                      {{ props.row.Id_repcp }}
                    </q-td>
                    <q-td key="Id_calprueba" :props="props">
                      {{ props.row.Id_calprueba }}
                    </q-td>
                    <q-td key="Id_pod" :props="props">
                      {{ props.row.Id_pod }}
                    </q-td>
                    <q-td key="Nrepeticion_repcp" :props="props">
                      {{ props.row.Nrepeticion_repcp }}
                    </q-td>
                    <q-td key="Duracionh_repcp" :props="props">
                      <q-badge color="orange">
                        {{ props.row.Duracionh_repcp }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Modificar"
                        label-cancel="Cancelar"
                        v-model="props.row.Duracionh_repcp"
                        title="Duración en horas"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.Duracionh_repcp"
                          autofocus
                        >
                          <template v-slot:prepend>
                            <q-icon name="access_time" size="lg" />
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="Duracionm_repcp" :props="props">
                      <q-badge color="orange">
                        {{ props.row.Duracionm_repcp }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Modificar"
                        label-cancel="Cancelar"
                        v-model="props.row.Duracionm_repcp"
                        title="Duración en minutos"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.Duracionm_repcp"
                          autofocus
                        >
                          <template v-slot:prepend>
                            <q-icon name="access_time" size="lg" />
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="Duracions_repcp" :props="props">
                      <q-badge color="orange">
                        {{ props.row.Duracions_repcp }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Modificar"
                        label-cancel="Cancelar"
                        v-model="props.row.Duracions_repcp"
                        title="Duración en segundos"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.Duracions_repcp"
                          autofocus
                        >
                          <template v-slot:prepend>
                            <q-icon name="access_time" size="lg" />
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>

                    <q-td key="Fechaini_repcp" :props="props">
                      {{ props.row.Fechaini_repcp }}
                    </q-td>
                    <q-td key="Fechafin_repcp" :props="props">
                      {{ props.row.Fechafin_repcp }}
                    </q-td>
                    <q-td key="Observacion_repcp" :props="props">
                      <q-badge color="green">
                        {{ props.row.Observacion_repcp }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Modificar"
                        label-cancel="Cancelar"
                        v-model="props.row.Observacion_repcp"
                        title="Observación"
                        buttons
                      >
                        <q-input
                          v-model="props.row.Observacion_repcp"
                          autofocus
                        >
                          <template v-slot:prepend>
                            <q-icon name="list" size="lg" />
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <q-stepper-navigation>
                <q-btn
                  @click="step = 6"
                  outline
                  align="center"
                  unelevated
                  color="red"
                  label="Saltar"
                  class="q-ml-sm"
                />
                <q-btn
                  @click="step = 2"
                  color="primary"
                  label="Volver"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="4"
              title="4. Verificar repeticiones por instrumento"
              icon="update"
              :done="step > 4"
            >
              Proceda a realizar la verificación de instrumentos de la prueba
              <b> {{ IdCaudalMostrar }} </b> de la repetición
              <b> {{ NRepeticion }} </b>
              <q-table
                class="col-xs-12 col-sm-12 col-md-12"
                title=""
                no-data-label="No hay registros"
                hide-bottom
                :rows-per-page-options="[0]"
                flat
                bordered
                :data="LisRepeticionCPInstrumentos"
                :columns="columnsInstrumentosRepeticion"
                :visible-columns="vcInstrumentosRepeticion"
                row-key="Id_repcp"
              >
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="
                      exportTable(
                        LisRepeticionCPInstrumentos,
                        columnsInstrumentosRepeticion
                      )
                    "
                  />
                  <q-space />
                  <q-btn
                    flat
                    round
                    dense
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
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
                    <q-td
                      key="Seleccionar_repeticionInstrumento"
                      :props="props"
                      auto-width
                    >
                      <q-btn
                        :icon="props.row.Icono"
                        :color="props.row.Color"
                        align="center"
                        outline
                        @click="modificarLecturaInstrumento(props.row)"
                      />
                    </q-td>
                    <q-td key="IdRepeticionCPInst" :props="props">
                      {{ props.row.IdRepeticionCPInst }}
                    </q-td>
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
                    <q-td key="LecturaAnterior" :props="props">
                      {{
                        formatoNumeroTipo(
                          props.row.LecturaAnterior,
                          props.row.IdTipoInstrumento
                        )
                      }}
                    </q-td>
                    <q-td key="CorreccionAnterior" :props="props">
                      {{
                        formatoNumeroTipo(
                          props.row.CorreccionAnterior,
                          props.row.IdTipoInstrumento
                        )
                      }}
                    </q-td>
                    <q-td key="LecturaNueva" :props="props">
                      <q-badge color="green">
                        {{
                          formatoNumeroTipo(
                            props.row.LecturaNueva,
                            props.row.IdTipoInstrumento
                          )
                        }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Ingresar"
                        label-cancel="Cancelar"
                        v-model="props.row.LecturaNueva"
                        title="Ingrese Lectura"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.LecturaNueva"
                          autofocus
                          @input="
                            (val) => {
                              CalcularCorreccion(props.row);
                            }
                          "
                        >
                          <template v-slot:prepend>
                            <q-icon name="update" size="lg" />
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="CorreccionNueva" :props="props">
                      {{
                        formatoNumeroTipo(
                          props.row.CorreccionNueva,
                          props.row.IdTipoInstrumento
                        )
                      }}
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
                    <q-td
                      key="Factorcorreccion_trazabilidadinst"
                      :props="props"
                    >
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
              <q-stepper-navigation>
                <q-btn color="primary" @click="step = 5" label="Siguiente" />
                <q-btn
                  flat
                  @click="step = 3"
                  color="primary"
                  label="Volver"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="5"
              title="5. Verificar repeticiones por medidor"
              icon="update"
              :done="step > 5"
            >
              Proceda a realizar la verificación de medidores de la prueba
              <b> {{ IdCaudalMostrar }} </b> de la repetición
              <b> {{ NRepeticion }} </b>
              <q-table
                class="col-xs-12 col-sm-12 col-md-12"
                title=""
                no-data-label="No hay registros"
                hide-bottom
                :rows-per-page-options="[0]"
                flat
                bordered
                :data="LisRepeticionCPMedidores"
                :columns="columnsMedidores"
                :visible-columns="vcMedidores"
                row-key="IdRepeticionCPMedidor"
              >
                <template v-slot:top="props">
                  <q-btn
                    color="primary"
                    icon-right="archive"
                    label=""
                    no-caps
                    @click="
                      exportTable(LisRepeticionCPMedidores, columnsMedidores)
                    "
                  />
                  <q-space />
                  <q-btn
                    flat
                    round
                    dense
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
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
                    <q-td
                      key="Seleccionar_repeticionMedidor"
                      :props="props"
                      auto-width
                    >
                      <q-btn
                        :icon="props.row.Icono"
                        :color="props.row.Color"
                        align="center"
                        outline
                        @click="modificarLecturaMedidor(props.row)"
                      />
                    </q-td>
                    <q-td key="IdRepeticionCPMedidor" :props="props">
                      {{ props.row.IdRepeticionCPMedidor }}
                    </q-td>
                    <q-td key="NpuestoBanco" :props="props">
                      {{ props.row.NpuestoBanco }}
                    </q-td>
                    <q-td key="Id_pod" :props="props">
                      {{ props.row.Id_pod }}
                    </q-td>
                    <q-td key="Id_repcp" :props="props">
                      {{ props.row.Id_repcp }}
                    </q-td>
                    <q-td key="Serialmedidor_ordenentradad" :props="props">
                      {{ props.row.Serialmedidor_ordenentradad }}
                    </q-td>
                    <q-td key="VolumenInicialAnterior" :props="props">
                      {{ formatoNumero(props.row.VolumenInicialAnterior, 2) }}
                    </q-td>
                    <q-td key="VolumenFinalAnterior" :props="props">
                      {{ formatoNumero(props.row.VolumenFinalAnterior, 2) }}
                    </q-td>
                    <q-td key="VolumenInicialNuevo" :props="props">
                      <q-badge color="green">
                        {{ formatoNumero(props.row.VolumenInicialNuevo, 2) }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Ingresar"
                        label-cancel="Cancelar"
                        v-model="props.row.VolumenInicialNuevo"
                        title="Ingrese Volumen Inicial"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.VolumenInicialNuevo"
                          autofocus
                          @input="
                            (val) => {
                              CalcularError(props.row);
                            }
                          "
                        >
                          <template v-slot:prepend>
                            <q-icon name="update" size="lg" />
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="VolumenFinalNuevo" :props="props">
                      <q-badge color="orange">
                        {{ formatoNumero(props.row.VolumenFinalNuevo, 2) }}
                      </q-badge>
                      <q-popup-edit
                        label-set="Ingresar"
                        label-cancel="Cancelar"
                        v-model="props.row.VolumenFinalNuevo"
                        title="Ingrese Volumen final"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.VolumenFinalNuevo"
                          autofocus
                          @input="
                            (val) => {
                              CalcularError(props.row);
                            }
                          "
                        >
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
                    <q-td key="Descripcion_modelomedidor" :props="props">
                      {{ props.row.Descripcion_modelomedidor }}
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
                <q-btn
                  color="primary"
                  @click="SiguienteRepeticion()"
                  label="Siguiente"
                />
                <q-btn
                  flat
                  @click="step = 4"
                  color="primary"
                  label="Volver"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="6"
              title="6. Fin de la Verificación"
              icon="emoji_events"
              :done="step > 6"
            >
              Ingrese una observación para la finalización de la verificación de
              la calibración
              <div class="row q-col-gutter-sm">
                <q-input
                  class="col-xs-12 col-sm-12 col-md-12 q-pt-sm"
                  stack-label
                  label="Observación Verificación Calibración"
                  v-model="VerificacionCalibracion.Observacion_verifcalib"
                  type="textarea"
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="list" size="lg" />
                  </template>
                </q-input>
              </div>
              <q-stepper-navigation>
                <q-btn
                  color="primary"
                  @click="FinalizarVerificacion()"
                  label="Finalizar Verificación"
                />
                <q-btn
                  flat
                  @click="step = 5"
                  color="primary"
                  label="Volver"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
          <div class="row q-col-gutter-sm">
            <div class="q-pa-md q-gutter-md">
              <q-btn
                label="Regresar"
                icon="replay"
                outline
                align="center"
                unelevated
                @click="regresar"
              >
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
<script>
import { api } from "boot/axios";
import utils from "../../commons/utils.js";
import { date } from "quasar";
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== undefined ? formatFn(val) : val;

  formatted =
    formatted === undefined || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default {
  name: "programacionOrden",
  data() {
    return {
      model: null,
      Repeticiones: 1,
      IdCaudalMostrar: "",
      NRepeticion: 0,
      RepeticionesFaltantes: 0,
      VerificacionCalibracion: {
        Id_verifcalib: -1,
        Id_calibracion: -1,
        Fecha_verifcalib: "",
        Login_verifcalib: "",
        Observacion_verifcalib: "",
        Estado_verifcalib: 1,
        ListaVerificacionInstrumento: [],
        ListaVerificacionMedidor: [],
      },
      VerificacionCalCaudal: {
        Id_verifcalibcaudal: -1,
        Id_verifcalib: -1,
        Id_calprueba: -1,
        Tempambini_calprueba: 0,
        Tempambfin_calprueba: 0,
        Humedadrelini_calprueba: 0,
        Humedadrelfin_calprueba: 0,
        Login_verifcalibcaudal: "",
        Fecha_verifcalibcaudal: "",
        Observacion_verifcalibcaudal: "",
        Estado_verifcalibcaudal: 1,
        ListaVerificacionRepeticiones: [],
        Icono: "edit",
        Color: "green",
      },
      VerificacionCalibRepeticion: {
        Id_verifcalibrepeticion: -1,
        Id_verifcalibcaudal: -1,
        Id_repcp: -1,
        Npuestobanco_repcp: 0,
        Volumeninicial_repcp: 0,
        Volumenfinal_repcp: 0,
        Caudal1_repcp: 0,
        Caudal2_repcp: 0,
        Caudal3_repcp: 0,
        Presionent1_repcp: 0,
        Presionent2_repcp: 0,
        Presionent3_repcp: 0,
        Presionsal1_repcp: 0,
        Presionsal2_repcp: 0,
        Presionsal3_repcp: 0,
        Templinea1_repcp: 0,
        Templinea2_repcp: 0,
        Templinea3_repcp: 0,
        Temprvm_repcp: 0,
        Volumenrvm_repcp: 0,
        Duracionh_repcp: 0,
        Duracionm_repcp: 0,
        Duracions_repcp: 0,
        Observacion_repcp: "",
        Login_verifcalibrepeticion: "",
        Fecha_verifcalibrepeticion: "",
        Estado_verifcalibrepeticion: 1,
        Icono: "edit",
        Color: "green",
        colorError: "blue",
      },
      Calibracion: {
        Id_calibracion: -1,
        Id_programacionorden: -1,
        Fechaini_calibracion: "",
        Fechafin_calibracion: "",
        Fecha_calibracion: "",
        Observacion_calibracion: "",
        Login_calibracion: "",
        Estado_calibracion: 1,
        Programacionorden: {},
        LisCalibracionPrueba: [],
        Medidores_programacionorden: 0,
        Nombre_supervisor: "",
        Nombre_encargado: "",
      },
      CalibracionPrueba: {
        Id_calprueba: -1,
        Id_calibracion: -1,
        Id_caudal: "",
        Tempambini_calprueba: 0,
        Tempambfin_calprueba: 0,
        Humedadrelini_calprueba: 0,
        Humedadrelfin_calprueba: 0,
        Observacion_calprueba: "",
        Fechaini_calprueba: "",
        Fechafin_calprueba: "",
        Fecha_calprueba: "",
        Login_calprueba: "",
        Estado_calprueba: 0,
        LisRepeticionCP: [],
      },
      RepeticioCP: {
        Id_repcp: -1,
        Id_calprueba: -1,
        Id_pod: 0,
        Nrepeticion_repcp: 0,
        Npuestobanco_repcp: 0,
        Volumeninicial_repcp: 0,
        Volumenfinal_repcp: 0,
        Caudal1_repcp: 0,
        Caudal2_repcp: 0,
        Caudal3_repcp: 0,
        Presionent1_repcp: 0,
        Presionent2_repcp: 0,
        Presionent3_repcp: 0,
        Presionsal1_repcp: 0,
        Presionsal2_repcp: 0,
        Presionsal3_repcp: 0,
        Templinea1_repcp: 0,
        Templinea2_repcp: 0,
        Templinea3_repcp: 0,
        Temprvm_repcp: 0,
        Volumenrvm_repcp: 0,
        Duracionh_repcp: 0,
        Duracionm_repcp: 0,
        Duracions_repcp: 0,
        Fechaini_repcp: "",
        Fechafin_repcp: "",
        Observacion_repcp: "",
        Estado_repcp: 1,
      },
      RepeticionCPInst: {
        IdRepeticionCPInst: 0,
        Id_caudal: 0,
        IdTipoInstrumento: 0,
        Id_instrumento: 0,
        Id_instprog: 0,
        Id_trazabilidadinst: 0,
        NombreTipoInstrumento: "",
        LecturaAnterior: 0,
        CorreccionAnterior: 0,
        LecturaNueva: 0,
        CorreccionNueva: 0,
        Nombre_instrumento: "",
        Codigo_instrumento: "",
        Nombre_variablemedicion: "",
        X_trazabilidadinst: 0,
        A_trazabilidadinst: 0,
        B_trazabilidadinst: 0,
        C_trazabilidadinst: 0,
        Factorcorreccion_trazabilidadinst: 0,
        Aplus_trazabilidadinst: "",
        Bplus_trazabilidadinst: "",
        Cplus_trazabilidadinst: "",
        FechaToma: "",
        Icono: "edit",
        Color: "green",
      },
      RepeticionCPMedidor: {
        IdRepeticionCPMedidor: 0,
        Id_repcp: 0,
        Id_pod: 0,
        NpuestoBanco: 0,
        VolumenInicialAnterior: 0,
        VolumenFinalAnterior: 0,
        VolumenInicialNuevo: 0,
        VolumenFinalNuevo: 0,
        Error_repcp: 0,
        FechaTomaIni: "",
        FechaTomaFin: "",
        Estado: 1,
        Serialmedidor_ordenentradad: "",
        Descripcion_modelomedidor: "",
        Icono: "edit",
        Color: "green",
        colorError: "blue",
      },
      VerificacionRepeticionMedidor: {
        IdVerificacionRepMed: 0,
        IdRepeticionCPMedidor: 0,
        Id_verifcalib: 0,
        VolumenInicialAnterior: 0,
        VolumenInicialNuevo: 0,
        VolumenFinalAnterior: 0,
        VolumenFinalNuevo: 0,
        Error_repcp: 0,
        Fecha: "",
        Estado: 1,
        Icono: "edit",
        Color: "green",
      },
      VerificacionRepeticionInstrumento: {
        IdVerificacionRepInst: 0,
        IdRepeticionCPInst: 0,
        Id_verifcalib: 0,
        LecturaAnterior: 0,
        LecturaNueva: 0,
        CorreccionAnterior: 0,
        CorreccionNueva: 0,
        Fecha: "",
        Estado: 1,
        Icono: "edit",
        Color: "green",
      },
      LisCalibraciones: [],
      LisCalibracionPrueba: [],
      LisRepeticionCP: [],
      LisRepeticionCPInstrumentos: [],
      LisRepeticionCPMedidores: [],
      step: 1,
      LisLecturasIniciales: [],
      LisLecturasFinales: [],
      todasFechas: false,
      ListaInstrumentosGeneral: [],
      listaInstrumentos: [],
      columnsInstrumentos: [
        {
          name: "Id_instrumento",
          label: "Id",
          field: "Id_instrumento",
          sortable: true,
        },
        {
          name: "Codigo_instrumento",
          align: "left",
          label: "Código",
          field: "Codigo_instrumento",
          sortable: true,
        },
        {
          name: "Descripcion_instrumento",
          label: "Descripción",
          field: "Descripcion_instrumento",
          sortable: true,
        },
      ],
      vcInstrumentosRepeticion: [
        "Id_caudal",
        "NombreTipoInstrumento",
        "LecturaNueva",
        "CorreccionNueva",
        "Nombre_instrumento",
      ],
      columnsInstrumentosRepeticion: [
        {
          name: "Seleccionar_repeticionInstrumento",
          align: "left",
          label: "Modificar",
          field: "Seleccionar_repeticionInstrumento",
          required: true,
          sortable: true,
        },
        {
          name: "Id_caudal",
          label: "Caudal",
          field: "Id_caudal",
          sortable: true,
        },
        {
          name: "IdTipoInstrumento",
          label: "ITI",
          field: "IdTipoInstrumento",
          sortable: true,
        },
        {
          name: "Id_instrumento",
          label: "IdInst",
          field: "Id_instrumento",
          sortable: true,
        },
        {
          name: "Id_instprog",
          label: "IdIP",
          field: "Id_instprog",
          sortable: true,
        },
        {
          name: "Id_trazabilidadinst",
          label: "IdTI",
          field: "Id_trazabilidadinst",
          sortable: true,
        },
        {
          name: "NombreTipoInstrumento",
          label: "NombreTipoInstrumento",
          field: "NombreTipoInstrumento",
          align: "left",
          sortable: true,
        },
        {
          name: "LecturaAnterior",
          label: "LecturaA",
          field: "LecturaAnterior",
          sortable: true,
        },
        {
          name: "CorreccionAnterior",
          label: "CorreccionA",
          field: "CorreccionAnterior",
          sortable: true,
        },
        {
          name: "LecturaNueva",
          label: "LecturaN",
          field: "LecturaNueva",
          sortable: true,
        },
        {
          name: "CorreccionNueva",
          label: "CorreccionN",
          field: "CorreccionNueva",
          sortable: true,
        },
        {
          name: "Nombre_instrumento",
          align: "left",
          label: "Nombre instrumento",
          field: "Nombre_instrumento",
          sortable: true,
        },
        {
          name: "Codigo_instrumento",
          align: "left",
          label: "Código",
          field: "Codigo_instrumento",
          sortable: true,
        },
        {
          name: "Nombre_variablemedicion",
          align: "left",
          label: "Variable medicion",
          field: "Nombre_variablemedicion",
          sortable: true,
        },
        {
          name: "X_trazabilidadinst",
          label: "A2",
          field: "X_trazabilidadinst",
          sortable: true,
        },
        {
          name: "A_trazabilidadinst",
          label: "A",
          field: "A_trazabilidadinst",
          sortable: true,
        },
        {
          name: "B_trazabilidadinst",
          label: "B",
          field: "B_trazabilidadinst",
          sortable: true,
        },
        {
          name: "C_trazabilidadinst",
          label: "C",
          field: "C_trazabilidadinst",
          sortable: true,
        },
        {
          name: "Factorcorreccion_trazabilidadinst",
          label: "Fact.Correccion",
          field: "Factorcorreccion_trazabilidadinst",
          sortable: true,
        },
        {
          name: "Aplus_trazabilidadinst",
          label: "+-",
          field: "Aplus_trazabilidadinst",
          sortable: true,
        },
        {
          name: "Bplus_trazabilidadinst",
          label: "+-",
          field: "Bplus_trazabilidadinst",
          sortable: true,
        },
        {
          name: "Cplus_trazabilidadinst",
          label: "+-",
          field: "Cplus_trazabilidadinst",
          sortable: true,
        },
        {
          name: "FechaToma",
          label: "Fecha",
          field: "FechaToma",
          align: "left",
          sortable: true,
        },
      ],
      SelectedInstrumentos: [],
      Instrumento: {
        Id_instrumento: -1,
        IdTipoInstrumento: "",
        Id_variablemedicion: "",
        Nombre_variablemedicion: "",
        Nombre_instrumento: "",
        Serial_instrumento: "",
        Codigo_instrumento: "",
        Descripcion_instrumento: "",
        Activo_instrumento: false,
        Login_instrumento: "",
        LisTrazabilidadInstrumentos: [],
      },
      banco: {
        Id_banco: -1,
        Identificacion_banco: "",
        Tipo_banco: "",
        Lineas_banco: -1,
        Medidores_banco: -1,
        Descripcion_banco: "",
        Login_banco: "",
        Estado_banco: 1,
      },
      tipoensayo: {
        Id_tipoensayo: -1,
        Nombre_tipoensayo: "",
        Estado_tipoensayo: 1,
      },
      caudal: {
        Id_caudal: "",
        Nombre_caudal: "",
        Emp_caudal: 0,
        Factorcobertura_caudal: "",
        Estado_caudal: 1,
      },
      // time: ref('07:30'),
      listaUsuarios: [],
      listaParametrosCalibracion: [],
      parametroCalibracion: {
        Id_parcal: -1,
        Descripcion_parcal: "",
        Observaciones_parcal: -1,
        Coefexpter_parcal: -1,
        Incertcoefexpter_parcal: -1,
        Incertcomprenagua_parcal: -1,
        Coefexptermat_parcal: -1,
        Comprenagua_parcal: -1,
        Incertcoefexptva_parcal: -1,
        Activo_parcal: -1,
        Login_parcal: "",
        Fecha_parcal: "",
        Estado_parcal: -1,
      },
      listaCaudales: [],
      SelectedPruebas: [],
      ProgramacionOrden: {
        Id_programacionorden: -1,
        Id_ordenentradad: -1,
        Id_tipoensayo: -1,
        Nombre_tipoensayo: "",
        Id_banco: -1,
        Identificacion_banco: "",
        Id_parcal: -1,
        Fechacalibracion_programacionorden: "",
        Horacalibracion_programacionorden: "",
        Duracioncalibracion_programacionorden: 0,
        Medidores_programacionorden: 0,
        Supervisor_programacionorden: "",
        Encargado_programacionorden: "",
        Observacion_programacionorden: "",
        Login_programacionorden: "",
        Calibrado_programacionorden: -1,
        LisProgOrdenDet: [],
        LisInstProg: [],
        Liscaudal: [],
        FechaIni: "",
        FechaFin: "",
        Icono: "edit",
        Color: "blue",
      },
      Normaref: {
        Id_normaref: -1,
        Nombre_normaref: "",
        Claseprecision_normaref: -1,
        LisNormaInfoTecnica: [],
      },
      selected: [],
      lisNormareferencia: [],
      lisAptocalibrar: ["SI", "NO"],
      lisMarcamedidor: [],
      lisModelomedidor: [],
      lisMedidores: [],
      lisordenEntrada: [],
      lisBancos: [],
      lisTipoEnsayo: [],
      fechaIni: "",
      fechaFin: "",
      componente: null,
      isDialogComponente: false,
      isDialogComponenteInstrumentos: false,
      isDialogComponenteFiltro: false,
      VolumenRecipiente: 0,
      fecha: date,
      usuario: {},
      LisRepeticionInsMOD: [],
      LisRepeticionMedMOD: [],
      ordenEntradaD: {
        Id_ordenentradad: -1,
        Id_ordenentrada: -1,
        Id_marcamedidor: -1,
        Id_modelomedidor: -1,
        Id_normaref: -1,
        Aptocalibrar_ordenentradad: "",
        Fabricacion_ordenentradad: "",
        Lectura_ordenentradad: "",
        Serialmedidor_ordenentradad: "",
        Caudalpermanente_ordenentradad: 0,
        Claseprecision_ordenentradad: 0,
        Presionmax_ordenentradad: 0,
        Perdidapresion_ordenentradad: "",
        Rangomedicion1_ordenentradad: 0,
        Rangomedicion2_ordenentradad: 0,
        Clasetemperatura_ordenentradad: "",
        Sensibilidadaar_ordenentradad: "",
        Sebsibilidadaab_ordenentradad: "",
        Identificador_ordenentradad: 0,
        Clasemetrologica_ordenentradad: "",
        Precisionnominal_ordenentradad: 0,
        Observacion_ordenentradad: "",
        Estado_ordenentradad: 0,
        Nombre_marcamedidor: "",
        Descripcion_modelomedidor: "",
        Nombre_normaref: "",
        Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: "" },
        Modelomedidor: {
          Id_modelomedidor: null,
          Descripcion_modelomedidor: "",
          Diametronominal_modelomedidor: "",
        },
        Icono: "edit",
        Color: "green",
        Incidencias: 0,
        ListaIncidencias: [],
        Programado_ordenentradad: 0,
        Calibrado_ordenentradad: 0,
        Certificado_ordenentradad: 0,
      },
      columnsMedidores: [
        {
          name: "Seleccionar_repeticionMedidor",
          align: "left",
          label: "Modificar",
          field: "Seleccionar_repeticionMedidor",
          required: true,
        },
        {
          name: "IdRepeticionCPMedidor",
          align: "left",
          label: "IdRCPM",
          field: "IdRepeticionCPMedidor",
        },
        {
          name: "NpuestoBanco",
          align: "left",
          label: "Puesto",
          field: "NpuestoBanco",
          required: true,
        },
        { name: "Id_pod", align: "left", label: "Id", field: "Id_pod" },
        { name: "Id_repcp", align: "left", label: "IdRCP", field: "Id_repcp" },
        {
          name: "Serialmedidor_ordenentradad",
          align: "left",
          label: "Serial",
          field: "Serialmedidor_ordenentradad",
        },
        {
          name: "VolumenInicialAnterior",
          label: "VolumenIniA",
          field: "VolumenInicialAnterior",
        },
        {
          name: "VolumenFinalAnterior",
          label: "VolumenFinA",
          field: "VolumenFinalAnterior",
        },
        {
          name: "VolumenInicialNuevo",
          label: "VolumenIniN",
          field: "VolumenInicialNuevo",
        },
        {
          name: "VolumenFinalNuevo",
          label: "VolumenFinN",
          field: "VolumenFinalNuevo",
        },
        {
          name: "Error_repcp",
          label: "Error",
          field: "Error_repcp",
          sortable: true,
        },
        {
          name: "Descripcion_modelomedidor",
          align: "left",
          label: "Modelo Medidor",
          field: "Descripcion_modelomedidor",
        },
        {
          name: "FechaTomaIni",
          label: "FechaIni",
          field: "FechaTomaIni",
          align: "left",
          sortable: true,
        },
        {
          name: "FechaTomaFin",
          label: "FechaFin",
          field: "FechaTomaFin",
          align: "left",
          sortable: true,
        },
      ],
      vcMedidores: [
        "NpuestoBanco",
        "Serialmedidor_ordenentradad",
        "VolumenInicialNuevo",
        "VolumenFinalNuevo",
        "Error_repcp",
        "Descripcion_modelomedidor",
      ],
      columnsPruebas: [
        {
          name: "Id_caudal",
          align: "left",
          label: "Id",
          field: "Id_caudal",
          sortable: true,
        },
        {
          name: "Nombre_caudal",
          align: "left",
          label: "Nombre Prueba",
          field: "Nombre_caudal",
          sortable: true,
        },
        {
          name: "Caudal_caudal",
          label: "Caudal",
          field: "Caudal_caudal",
          sortable: true,
        },
        {
          name: "Modificar_caudal",
          label: "Modificar",
          field: "Modificar_caudal",
        },
      ],
      LisProgramaciones: [],
      vcProgramaciones: [
        "Fechacalibracion_programacionorden",
        "Horacalibracion_programacionorden",
        "Duracioncalibracion_programacionorden",
        "Medidores_programacionorden",
        "Nombre_supervisor",
      ],
      columnsProgramaciones: [
        {
          name: "Seleccionar_programacionorden",
          align: "left",
          label: "Cargar",
          field: "Seleccionar_programacionorden",
          required: true,
          sortable: true,
        },
        {
          name: "Id_programacionorden",
          align: "left",
          label: "Id",
          field: "Id_programacionorden",
          required: true,
          sortable: true,
        },
        {
          name: "Id_tipoensayo",
          align: "left",
          label: "IdTE",
          field: "Id_tipoensayo",
          sortable: true,
        },
        {
          name: "Nombre_tipoensayo",
          align: "left",
          label: "Nombre tipoensayo",
          field: "Nombre_tipoensayo",
          sortable: true,
        },
        {
          name: "Id_banco",
          label: "IdBanco",
          field: "Id_banco",
          sortable: true,
        },
        {
          name: "Identificacion_banco",
          align: "left",
          label: "Nombre Banco",
          field: "Identificacion_banco",
          sortable: true,
        },
        {
          name: "Id_parcal",
          align: "left",
          label: "IdParcal",
          field: "Id_parcal",
          sortable: true,
        },
        {
          name: "Fechacalibracion_programacionorden",
          align: "left",
          label: "FechaCalibracion",
          field: "Fechacalibracion_programacionorden",
          sortable: true,
        },
        {
          name: "Horacalibracion_programacionorden",
          align: "left",
          label: "Hora",
          field: "Horacalibracion_programacionorden",
          sortable: true,
        },
        {
          name: "Duracioncalibracion_programacionorden",
          label: "Duracion",
          field: "Duracioncalibracion_programacionorden",
          sortable: true,
        },
        {
          name: "Medidores_programacionorden",
          label: "Medidores",
          field: "Medidores_programacionorden",
          sortable: true,
        },
        {
          name: "Supervisor_programacionorden",
          label: "Supervisor",
          field: "Supervisor_programacionorden",
          sortable: true,
        },
        {
          name: "Nombre_supervisor",
          align: "left",
          label: "Nombre Supervisor",
          field: "Nombre_supervisor",
          sortable: true,
        },
        {
          name: "Encargado_programacionorden",
          label: "Encargado",
          field: "Encargado_programacionorden",
          sortable: true,
        },
        {
          name: "Nombre_encargado",
          align: "left",
          label: "Nombre Encargado",
          field: "Nombre_encargado",
          sortable: true,
        },
        {
          name: "Observacion_programacionorden",
          align: "left",
          label: "Observacion",
          field: "Observacion_programacionorden",
          sortable: true,
        },
        {
          name: "Login_programacionorden",
          align: "left",
          label: "Login",
          field: "Login_programacionorden",
          sortable: true,
        },
        {
          name: "Fecha_programacionorden",
          align: "left",
          label: "Fecha",
          field: "Fecha_programacionorden",
          sortable: true,
        },
        {
          name: "Login_programacionorden",
          align: "left",
          label: "Login",
          field: "Login_programacionorden",
          sortable: true,
        },
      ],
      vcCalibraciones: [
        "Fechaini_calibracion",
        "Fechafin_calibracion",
        "Medidores_programacionorden",
        "Nombre_supervisor",
      ],
      columnsCalibraciones: [
        {
          name: "Seleccionar_calibracion",
          align: "left",
          label: "Verificar",
          field: "Seleccionar_calibracion",
          required: true,
          sortable: true,
        },
        {
          name: "Id_calibracion",
          align: "left",
          label: "Id",
          field: "Id_calibracion",
          required: true,
          sortable: true,
        },
        {
          name: "Id_programacionorden",
          align: "left",
          label: "OrdenTrabajo",
          field: "Id_programacionorden",
          required: true,
          sortable: true,
        },
        {
          name: "Medidores_programacionorden",
          label: "Medidores",
          field: "Medidores_programacionorden",
          sortable: true,
        },
        {
          name: "Nombre_supervisor",
          align: "left",
          label: "Nombre Supervisor",
          field: "Nombre_supervisor",
          sortable: true,
        },
        {
          name: "Nombre_encargado",
          align: "left",
          label: "Nombre Encargado",
          field: "Nombre_encargado",
          sortable: true,
        },
        {
          name: "Observacion_calibracion",
          align: "left",
          label: "Observacion",
          field: "Observacion_calibracion",
          sortable: true,
        },
        {
          name: "Login_calibracion",
          align: "left",
          label: "Login",
          field: "Login_calibracion",
          sortable: true,
        },
        {
          name: "Fechaini_calibracion",
          align: "left",
          label: "Inicio",
          field: "Fechaini_calibracion",
          sortable: true,
        },
        {
          name: "Fechafin_calibracion",
          align: "left",
          label: "Final",
          field: "Fechafin_calibracion",
          sortable: true,
        },
        {
          name: "Fecha_calibracion",
          align: "left",
          label: "Fecha",
          field: "Fecha_calibracion",
          sortable: true,
        },
      ],
      vcCalibracionPruebas: [
        "Tempambini_calprueba",
        "Tempambfin_calprueba",
        "Humedadrelini_calprueba",
        "Humedadrelfin_calprueba",
        "Fechaini_calprueba",
        "Fechafin_calprueba",
      ],
      columnsCalibracionPruebas: [
        {
          name: "Seleccionar_calibracionprueba",
          align: "left",
          label: "Verificar",
          field: "Seleccionar_calibracionprueba",
          required: true,
          sortable: true,
        },
        {
          name: "Id_calprueba",
          align: "left",
          label: "Id",
          field: "Id_calprueba",
          required: true,
          sortable: true,
        },
        {
          name: "Id_calibracion",
          align: "left",
          label: "IdCal",
          field: "Id_calibracion",
          required: true,
          sortable: true,
        },
        {
          name: "Id_caudal",
          align: "left",
          label: "caudal",
          field: "Id_caudal",
          required: true,
          sortable: true,
        },
        {
          name: "Fechaini_calprueba",
          align: "left",
          label: "Inicio",
          field: "Fechaini_calprueba",
          sortable: true,
        },
        {
          name: "Fechafin_calprueba",
          align: "left",
          label: "Final",
          field: "Fechafin_calprueba",
          sortable: true,
        },
        {
          name: "Login_calprueba",
          align: "left",
          label: "Login",
          field: "Login_calprueba",
          sortable: true,
        },
        {
          name: "Observacion_calprueba",
          align: "left",
          label: "Observacion",
          field: "Observacion_calprueba",
          sortable: true,
        },
        {
          name: "Fecha_calprueba",
          align: "left",
          label: "Fecha",
          field: "Fecha_calprueba",
          sortable: true,
        },
      ],
      vcRepeticionesCP: [
        "Id_calprueba",
        "Nrepeticion_repcp",
        "Fechaini_repcp",
        "Fechafin_repcp",
      ],
      columnsRepeticionesCP: [
        {
          name: "Seleccionar_repcp",
          align: "left",
          label: "OK",
          field: "Seleccionar_repcp",
          required: true,
          sortable: true,
        },
        {
          name: "Id_repcp",
          align: "left",
          label: "Id",
          field: "Id_repcp",
          required: true,
          sortable: true,
        },
        {
          name: "Id_calprueba",
          align: "left",
          label: "IdCalP",
          field: "Id_calprueba",
          required: true,
          sortable: true,
        },
        // { name: 'Id_pod', align: 'left', label: 'IdPod', field: 'Id_pod', required: true, sortable: true },
        {
          name: "Nrepeticion_repcp",
          label: "Repetición",
          field: "Nrepeticion_repcp",
          sortable: true,
        },
        // { name: 'Npuestobanco_repcp', label: 'PuestoBanco', field: 'Npuestobanco_repcp', sortable: true },
        // { name: 'Volumeninicial_repcp', label: 'VolIni', field: 'Volumeninicial_repcp', sortable: true },
        // { name: 'Volumenfinal_repcp', label: 'VolFin', field: 'Volumenfinal_repcp', sortable: true },
        // { name: 'Caudal1_repcp', label: 'Caudal1', field: 'Caudal1_repcp', sortable: true },
        // { name: 'Caudal2_repcp', label: 'Caudal2', field: 'Caudal2_repcp', sortable: true },
        // { name: 'Caudal3_repcp', label: 'Caudal3', field: 'Caudal3_repcp', sortable: true },
        // { name: 'Presionent1_repcp', label: 'PresionEnt1', field: 'Presionent1_repcp', sortable: true },
        // { name: 'Presionent2_repcp', label: 'PresionEnt2', field: 'Presionent2_repcp', sortable: true },
        // { name: 'Presionent3_repcp', label: 'PresionEnt3', field: 'Presionent3_repcp', sortable: true },
        // { name: 'Presionsal1_repcp', label: 'PresionSal1', field: 'Presionsal1_repcp', sortable: true },
        // { name: 'Presionsal2_repcp', label: 'PresionSal2', field: 'Presionsal2_repcp', sortable: true },
        // { name: 'Presionsal3_repcp', label: 'PresionSal3', field: 'Presionsal3_repcp', sortable: true },
        // { name: 'Templinea1_repcp', label: 'TempLinea1', field: 'Templinea1_repcp', sortable: true },
        // { name: 'Templinea2_repcp', label: 'TempLinea2', field: 'Templinea2_repcp', sortable: true },
        // { name: 'Templinea3_repcp', label: 'TempLinea3', field: 'Templinea3_repcp', sortable: true },
        // { name: 'Temprvm_repcp', label: 'TempRVM', field: 'Temprvm_repcp', sortable: true },
        // { name: 'Volumenrvm_repcp', label: 'VolRVM', field: 'Volumenrvm_repcp', sortable: true },
        {
          name: "Duracionh_repcp",
          label: "Horas",
          field: "Duracionh_repcp",
          sortable: true,
        },
        {
          name: "Duracionm_repcp",
          label: "Minutos",
          field: "Duracionm_repcp",
          sortable: true,
        },
        {
          name: "Duracions_repcp",
          label: "Segundos",
          field: "Duracions_repcp",
          sortable: true,
        },
        {
          name: "Fechaini_repcp",
          align: "left",
          label: "Inicio",
          field: "Fechaini_repcp",
          sortable: true,
        },
        {
          name: "Fechafin_repcp",
          align: "left",
          label: "Final",
          field: "Fechafin_repcp",
          sortable: true,
        },
        {
          name: "Observacion_repcp",
          align: "left",
          label: "Observacion",
          field: "Observacion_repcp",
          sortable: true,
        },
      ],
    };
  },
  mounted() {
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
    utils.verificarUsuario(this.usuario.LoginUsuario, this);
    this.accesos = this.$q.localStorage.getItem("accesosSILAMED");
  },
  created() {
    const instrumento = {
      Id_instrumento: -1,
      IdTipoInstrumento: 0,
      Id_variablemedicion: "",
      Nombre_variablemedicion: "",
      Nombre_instrumento: "",
      Serial_instrumento: "",
      Codigo_instrumento: "",
      Descripcion_instrumento: "",
      Activo_instrumento: 1,
      Login_instrumento: "",
      LisTrazabilidadInstrumentos: [],
    };
    this.mostrarInstrumentosGeneral(instrumento);
    const caudal = { ...this.caudal };
    caudal.Id_caudal = "";
    caudal.Nombre_caudal = "";
    this.mostrarCaudal(caudal);
    this.Calibracion.Fechaini_calibracion = utils.fechaActual();
    this.Calibracion.Fechafin_calibracion = utils.fechaActual();
  },
  methods: {
    mostrarCaudal(caudal) {
      const self = this;
      self.$q.loading.show();
      api
        .post("/programacionorden/caudalMostrar/", caudal)
        .then((response) => {
          self.listaCaudales = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Tipo Ensayo " + error);
          self.$q.loading.hide();
        });
    },
    CalcularCorreccion(fila) {
      fila.CorreccionNueva = utils.verificarValorX(fila, fila.LecturaNueva);
      if (fila.IdTipoInstrumento === "RV") {
        this.VolumenRecipiente = fila.CorreccionNueva;
      }
      fila.FechaToma = utils.fechaHora();
    },
    CalcularError(fila) {
      const self = this;
      fila.Error_repcp =
        (((fila.VolumenFinalNuevo - fila.VolumenInicialNuevo) * 1000 -
          this.VolumenRecipiente * 1000) /
          (this.VolumenRecipiente * 1000)) *
        100;
      if (
        fila.Error_repcp > self.caudal.Emp_caudal ||
        fila.Error_repcp < self.caudal.Emp_caudal * -1
      ) {
        fila.colorError = "red";
      } else {
        fila.colorError = "blue";
      }
    },
    SiguienteRepeticion() {
      const self = this;
      let RInst = { ...self.VerificacionRepeticionInstrumento };
      let RMed = { ...self.VerificacionRepeticionMedidor };

      for (const rI of self.LisRepeticionCPInstrumentos) {
        RInst.IdRepeticionCPInst = rI.IdRepeticionCPInst;
        RInst.Id_verifcalib = rI.Id_verifcalib;
        RInst.LecturaNueva = rI.LecturaNueva;
        RInst.CorreccionNueva = rI.CorreccionNueva;
        RInst.LecturaAnterior = rI.LecturaAnterior;
        RInst.CorreccionAnterior = rI.CorreccionAnterior;
      }

      if (self.LisRepeticionCP.length > 0) {
        self.step = 3;
      } else {
        if (self.LisCalibracionPrueba.length > 0) {
          self.step = 2;
        } else {
          self.step = 6;
        }
      }
    },
    modificarLecturaInstrumento(RepInst) {
      if (RepInst.LecturaAnterior === RepInst.LecturaNueva) {
        utils.mensaje(
          "No hay variación de lecturas, no es necesario modificar"
        );
        return;
      }
      this.$q
        .dialog({
          title: "SILAMED",
          dark: true,
          message:
            "Está seguro de modificar las lecturas del intrumento <br>Instrumento: " +
            RepInst.NombreTipoInstrumento +
            "<br>Lectura Actual: " +
            RepInst.LecturaAnterior +
            "<br>Lectura Nueva: " +
            RepInst.LecturaNueva,
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(() => {
          const self = this;
          let ri = { ...self.RepeticionCPInst };
          ri = RepInst;
          self.LisRepeticionInsMOD.push(ri);
          var i = self.LisRepeticionCPInstrumentos.indexOf(RepInst);
          RepInst.Icono = "verified";
          RepInst.Color = "red";
          // self.LisRepeticionCPInstrumentos.splice(i, 1)
        })
        .onCancel(() => {});
    },
    modificarLecturaMedidor(RepMed) {
      if (
        RepMed.VolumenInicialNuevo === RepMed.VolumenInicialAnterior &&
        RepMed.VolumenFinalNuevo === RepMed.VolumenFinalAnterior
      ) {
        utils.mensaje(
          "No hay variación de lecturas, no es necesario modificar"
        );
        return;
      }
      this.$q
        .dialog({
          title: "SILAMED",
          dark: true,
          message:
            "Está seguro de modificar las lecturas del medidor <br>Serial: " +
            RepMed.Serialmedidor_ordenentradad +
            "<br>Volumen Inicial: " +
            RepMed.VolumenInicialAnterior +
            " Cambia a " +
            RepMed.VolumenInicialNuevo +
            "<br>Volumen Final: " +
            RepMed.VolumenFinalAnterior +
            " Cambia a " +
            RepMed.VolumenFinalNuevo,
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(() => {
          const self = this;
          let rm = { ...self.RepeticionCPMedidor };
          rm = RepMed;
          self.LisRepeticionMedMOD.push(rm);
          var i = self.LisRepeticionCPMedidores.indexOf(RepMed);
          // self.LisRepeticionCPMedidores.splice(i, 1)
          RepMed.Icono = "verified";
          RepMed.Color = "red";
        })
        .onCancel(() => {});
    },
    VerificarRepeticion() {
      if (this.selected.length < this.LisRepeticionCP.length) {
        utils.mensaje("Debe verificar todas las repeticiones");
        return;
      }
      if (this.LisCalibracionPrueba.length > 0) {
        this.VerificacionCalibracion.ListaVerificacionCaudal.push(
          this.VerificacionCalCaudal
        );
        this.step = 2;
      } else {
        this.VerificacionCalibracion.ListaVerificacionCaudal.push(
          this.VerificacionCalCaudal
        );
        this.step = 4;
      }
    },
    CargarRepeticion(Rep) {
      const self = this;
      Rep.Icono = "verified";
      Rep.Color = "red";
      self.Repeticiones = Rep;
      self.NRepeticion = Rep.Nrepeticion_repcp;
      self.LisRepeticionCPInstrumentos = [];
      for (const Iti of Rep.LisRepeticionCPInstrumento) {
        let repeticionInstrumento = { ...self.RepeticionCPInst };
        repeticionInstrumento.IdRepeticionCPInst = Iti.IdRepeticionCPInst;
        repeticionInstrumento.Id_caudal = Iti.InstrumentoProgramacion.Id_caudal;
        repeticionInstrumento.IdTipoInstrumento =
          Iti.InstrumentoProgramacion.IdTipoInstrumento;
        repeticionInstrumento.Id_instrumento =
          Iti.InstrumentoProgramacion.Id_instrumento;
        repeticionInstrumento.Id_instprog = Iti.Id_instprog;
        repeticionInstrumento.Id_trazabilidadinst =
          Iti.InstrumentoProgramacion.Id_trazabilidadinst;
        repeticionInstrumento.NombreTipoInstrumento =
          Iti.InstrumentoProgramacion.Instrumento.NombreTipoInstrumento;
        repeticionInstrumento.LecturaAnterior = Iti.Lectura;
        repeticionInstrumento.CorreccionAnterior = Iti.Correccion;
        repeticionInstrumento.LecturaNueva = Iti.Lectura;
        repeticionInstrumento.CorreccionNueva = Iti.Correccion;
        repeticionInstrumento.Nombre_instrumento =
          Iti.InstrumentoProgramacion.Instrumento.Nombre_instrumento;
        repeticionInstrumento.Codigo_instrumento =
          Iti.InstrumentoProgramacion.Instrumento.Codigo_instrumento;
        repeticionInstrumento.Nombre_variablemedicion =
          Iti.InstrumentoProgramacion.Instrumento.Nombre_variablemedicion;
        repeticionInstrumento.X_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.X_trazabilidadinst;
        repeticionInstrumento.A_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.A_trazabilidadinst;
        repeticionInstrumento.B_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.B_trazabilidadinst;
        repeticionInstrumento.C_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.C_trazabilidadinst;
        repeticionInstrumento.Factorcorreccion_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.Factorcorreccion_trazabilidadinst;
        repeticionInstrumento.Aplus_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.Aplus_trazabilidadinst;
        repeticionInstrumento.Bplus_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.Bplus_trazabilidadinst;
        repeticionInstrumento.Cplus_trazabilidadinst =
          Iti.InstrumentoProgramacion.TrazabilidadInstrumento.Cplus_trazabilidadinst;
        repeticionInstrumento.FechaToma = Iti.FechaToma;
        if (repeticionInstrumento.IdTipoInstrumento === "RV") {
          this.VolumenRecipiente = repeticionInstrumento.CorreccionNueva;
        }
        self.LisRepeticionCPInstrumentos.push(repeticionInstrumento);
      }

      self.LisRepeticionCPMedidores = [];
      for (const Rm of Rep.LisRepeticionCPMedidor) {
        let repeticionMedidor = { ...self.RepeticionCPMedidor };
        repeticionMedidor.IdRepeticionCPMedidor = Rm.IdRepeticionCPMedidor;
        repeticionMedidor.Id_repcp = Rm.Id_repcp;
        repeticionMedidor.Descripcion_modelomedidor =
          Rm.Descripcion_modelomedidor;
        repeticionMedidor.Id_pod = Rm.Id_pod;
        repeticionMedidor.NpuestoBanco = Rm.NpuestoBanco;
        repeticionMedidor.VolumenInicialAnterior = Rm.VolumenInicial;
        repeticionMedidor.VolumenFinalAnterior = Rm.VolumenFinal;
        repeticionMedidor.Error_repcp =
          (((Rm.VolumenFinal - Rm.VolumenInicial) * 1000 -
            this.VolumenRecipiente * 1000) /
            (this.VolumenRecipiente * 1000)) *
          100;
        if (
          repeticionMedidor.Error_repcp > self.caudal.Emp_caudal ||
          repeticionMedidor.Error_repcp < self.caudal.Emp_caudal * -1
        ) {
          repeticionMedidor.colorError = "red";
        } else {
          repeticionMedidor.colorError = "blue";
        }
        repeticionMedidor.VolumenInicialNuevo = Rm.VolumenInicial;
        repeticionMedidor.VolumenFinalNuevo = Rm.VolumenFinal;
        repeticionMedidor.FechaTomaIni = Rm.FechaTomaIni;
        repeticionMedidor.FechaTomaFin = Rm.FechaTomaFin;
        repeticionMedidor.Serialmedidor_ordenentradad =
          Rm.Serialmedidor_ordenentradad;
        self.LisRepeticionCPMedidores.push(repeticionMedidor);
      }

      var i = this.LisRepeticionCP.indexOf(Rep);
      // this.LisRepeticionCP.splice(i, 1)
      this.step = 4;
    },
    CargarCalibracion(Cal) {
      const self = this;
      self.LisRepeticionInsMOD = [];
      self.LisRepeticionMedMOD = [];
      self.Calibracion = Cal;
      self.VerificacionCalibracion.Id_calibracion = Cal.Id_calibracion;
      self.VerificacionCalibracion.Login_verifcalib = self.usuario.LoginUsuario;
      self.LisCalibracionPrueba = Cal.LisCalibracionPrueba;
      Cal.Icono = "verified";
      Cal.Color = "red";

      var i = this.LisCalibraciones.indexOf(Cal);
      // this.LisCalibraciones.splice(i, 1)
      this.step = 2;
    },
    CargarCargarCalibracionPrueba(CP) {
      const self = this;
      // Verificar si hubo cambio en algún concepto de la prueba...
      CP.Icono = "verified";
      CP.Color = "red";
      self.VerificacionCalCaudal.Id_calprueba = CP.Id_calprueba;
      self.VerificacionCalCaudal.Tempambini_calprueba = CP.Tempambini_calprueba;
      self.VerificacionCalCaudal.Tempambfin_calprueba = CP.Tempambfin_calprueba;
      self.VerificacionCalCaudal.Humedadrelini_calprueba =
        CP.Humedadrelini_calprueba;
      self.VerificacionCalCaudal.Humedadrelfin_calprueba =
        CP.Humedadrelfin_calprueba;
      self.VerificacionCalCaudal.Login_verifcalibcaudal =
        self.usuario.LoginUsuario;
      self.IdCaudalMostrar = CP.Id_caudal;
      self.listaCaudales.forEach(function (caudal) {
        if (caudal.Id_caudal === CP.Id_caudal) {
          self.caudal = caudal;
        }
      });

      self.CalibracionPrueba = CP;
      self.LisRepeticionCP = CP.LisRepeticionCP;

      var i = this.LisCalibracionPrueba.indexOf(CP);
      // this.LisCalibracionPrueba.splice(i, 1)

      self.step = 3;
    },
    AceptarVerificacionRepeticion(Repeticion) {
      const self = this;
      const verifRepeticion = { ...this.VerificacionCalibRepeticion };
      verifRepeticion.Id_repcp = Repeticion.Id_repcp;
      verifRepeticion.Npuestobanco_repcp = Repeticion.Npuestobanco_repcp;
      verifRepeticion.Caudal1_repcp = Repeticion.Caudal1_repcp;
      verifRepeticion.Caudal2_repcp = Repeticion.Caudal2_repcp;
      verifRepeticion.Caudal3_repcp = Repeticion.Caudal3_repcp;
      verifRepeticion.Presionent1_repcp = Repeticion.Presionent1_repcp;
      verifRepeticion.Presionent2_repcp = Repeticion.Presionent2_repcp;
      verifRepeticion.Presionent3_repcp = Repeticion.Presionent3_repcp;
      verifRepeticion.Presionsal1_repcp = Repeticion.Presionsal1_repcp;
      verifRepeticion.Presionsal2_repcp = Repeticion.Presionsal2_repcp;
      verifRepeticion.Presionsal3_repcp = Repeticion.Presionsal3_repcp;
      verifRepeticion.Templinea1_repcp = Repeticion.Templinea1_repcp;
      verifRepeticion.Templinea2_repcp = Repeticion.Templinea2_repcp;
      verifRepeticion.Templinea3_repcp = Repeticion.Templinea3_repcp;
      verifRepeticion.Temprvm_repcp = Repeticion.Temprvm_repcp;
      verifRepeticion.Volumenrvm_repcp = Repeticion.Volumenrvm_repcp;
      verifRepeticion.Duracionh_repcp = Repeticion.Duracionh_repcp;
      verifRepeticion.Duracionm_repcp = Repeticion.Duracionm_repcp;
      verifRepeticion.Duracions_repcp = Repeticion.Duracions_repcp;
      verifRepeticion.Observacion_repcp = Repeticion.Observacion_repcp;
      verifRepeticion.Login_verifcalibrepeticion = self.usuario.LoginUsuario;
      verifRepeticion.Volumeninicial_repcp = Repeticion.Volumeninicial_repcp;
      verifRepeticion.Volumenfinal_repcp = Repeticion.Volumenfinal_repcp;

      self.VerificacionCalCaudal.ListaVerificacionRepeticiones.push(
        verifRepeticion
      );
      var i = this.LisRepeticionCP.indexOf(Repeticion);
      // this.LisRepeticionCP.splice(i, 1)
    },
    FinalizarVerificacion() {
      // Guardar la verificación y reiniciar las variables
      this.guardarVerificacionCalibracion();
    },
    actualizarInstrumentos(tp) {
      tp.ListaInstrumentos = this.SelectedInstrumentos;
    },
    mostrarInstrumentosGeneral(inst) {
      const self = this;
      self.$q.loading.show();
      api
        .post("/instrumento/instrumentoMostrarFiltro/", inst)
        .then((response) => {
          self.ListaInstrumentosGeneral = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Instrumentos Gral " + error);
          self.$q.loading.hide();
        });
    },
    exportTable(tablaE, columnasE) {
      // naive encoding to csv format
      const content = [columnasE.map((col) => wrapCsvValue(col.label))]
        .concat(
          tablaE.map((row) =>
            columnasE
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === undefined ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      var nombreArchivo =
        "ConsultaVerificacionCalibracion_" + utils.fechaActual();
      const status = exportFile(nombreArchivo + ".csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "No existen datos para descargar",
          color: "negative",
          icon: "warning",
        });
      }
    },
    getSelectdMedidores() {
      return this.lisMedidores.length === 0
        ? ""
        : `${this.lisMedidores.length} medidor${
            this.lisMedidores.length > 1 ? "es" : ""
          } para calibrar`;
    },
    regresar() {
      this.$router.push("/admin");
    },
    regla(val) {
      if (val !== null && val !== "" && val !== undefined) {
        return true;
      }
      return false || "Falta completar información";
    },
    ordenEntradaImprimirPDF(numRC) {
      this.$q.loading.show();
      this.$axios
        .get(`/ordenEntradaD/ordenEntradaImprimirPDF/${numRC}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const blobURL = URL.createObjectURL(blob);
          window.open(blobURL);
          this.$q.loading.hide();
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
        });
    },
    guardarVerificacionCalibracion() {
      const self = this;
      self.VerificacionCalibracion.ListaVerificacionInstrumento =
        self.LisRepeticionInsMOD;
      self.VerificacionCalibracion.ListaVerificacionMedidor =
        self.LisRepeticionMedMOD;
      this.$q
        .dialog({
          title: "SILAMED",
          dark: true,
          message: "Esta seguro de guardar la Verificación de medidores?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          api
            .post(
              "/calibracionmedidores/insertarVerificacionCalibracion/",
              this.VerificacionCalibracion
            )
            .then((response) => {
              if (response.data === true) {
                this.LisCalibracionPrueba = [];
                this.step = 1;
              } else {
                utils.mensaje("Algo salió mal, verifique");
              }
              self.$q.loading.hide();
            })
            .catch((error) => {
              utils.mensaje(
                "Fallo la conexion - Guardar Programacion " + error
              );
              self.$q.loading.hide();
            });
        })
        .onCancel(() => {});
    },
    formatoNumero(numero, decimales) {
      return utils.formatoNumero(numero, decimales);
    },
    formatoNumeroTipo(numero, tipo) {
      // RECIPIENTES VOLUMETRICOS
      let decimales = 0;
      switch (tipo) {
        case "HR":
        case "TA":
          decimales = 1;
          break;
        case "RV":
          decimales = 3;
          break;
        default:
          decimales = 2;
      }
      return utils.formatoNumero(numero, decimales);
    },
    consultarFiltroCalibracion() {
      const self = this;
      self.$q.loading.show();
      self.LisCalibraciones = [];
      self.Calibracion.Observacion_calibracion = "";
      self.Calibracion.Id_calibracion = 2; //Verificar los medidores ya calibrados
      self.Calibracion.Id_programacionorden = -1;
      if (self.todasFechas === true) {
        self.Calibracion.Estado_calibracion = 1;
      } else {
        self.Calibracion.Estado_calibracion = 0;
      }
      self.Calibracion.Login_calibracion = "";
      api
        .post(
          "/calibracionmedidores/verificacionCalibracionMedidores/",
          this.Calibracion
        )
        .then((response) => {
          const lista = response.data;
          lista.forEach(function (lcalib) {
            var calib = { ...self.Calibracion };
            calib = lcalib;
            calib.Medidores_programacionorden =
              lcalib.Programacionorden.Medidores_programacionorden;
            calib.Nombre_supervisor =
              lcalib.Programacionorden.Nombre_supervisor;
            calib.Nombre_encargado = lcalib.Programacionorden.Nombre_encargado;
            calib.Color = "blue";
            calib.Icono = "edit";
            self.LisCalibraciones.push(calib);
          });
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - LisCalibraciones " + error);
          self.$q.loading.hide();
        });
    },
  },
};
</script>
