<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="edit_calendar"/>
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" @click="isDialogComponenteConsulta = true" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title>
          Programación Ordenes de Trabajo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formordenEntrada" @submit="guardarProgramacion">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <q-select class="col-xs-12 col-md-5 q-field--with-bottom"
              outlined
              v-model="ProgramacionOrden.Id_banco"
              map-options emit-value option-value="banco"
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
            <q-select class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              v-model="condicionMontada.Id_rangomedicion"
              map-options emit-value option-value="Id_rangomedicion"
              option-label="Nombre_rangomedicion"
              :options="listaRangoMedicion"
              :rules="[ regla ]"
              @input="val => { consultarFiltro() }"
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
            <q-select class="col-xs-12 col-md-3 q-field--with-bottom"
              outlined
              v-model="condicionMontada.Diametro_medidor"
              map-options emit-value option-value="Diametro_medidor"
              option-label="Diametro_medidor"
              :options="listaDiametros"
              @input="val => { consultarFiltro() }"
              :rules="[ regla ]"
              label="Diámetro Nominal"
            >
              <template v-slot:prepend>
                <q-icon name="hdr_weak" size="lg" />
              </template>
            </q-select>
        <div class="col-xs-12 col-sm-12 col-md-4">
        <div class="bg-cyan text-white">
          <q-toolbar>
            <q-btn flat round dense icon="list" />
            <q-toolbar-title> Pruebas a realizar </q-toolbar-title>
            <q-btn flat round dense icon="add_task" />
          </q-toolbar>
        </div>
        <q-table class="col-xs-12 col-sm-12 col-md-3" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
          :data="listaCaudales"
          :columns="columnsCaudales"
          row-key="Id_caudal"
          selection="multiple"
          :selected.sync="SelectedPruebas">
          <template v-slot:body-cell-Modificar_caudal="props">
            <q-td key="Id_caudal" :props="props" auto-width>
              <q-btn icon="mode_edit" color="green" align="center" outline @click="cargarInstrumentoscaudal(props.row)"
              v-if="props.row">
              </q-btn>
            </q-td>
          </template>
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
            v-model="ordenEntradaD.Id_normaref"
            map-options emit-value option-value="Id_normaref"
            option-label="Nombre_normaref"
            clearable
            :options="lisNormareferencia"
            @input="val => { consultarFiltro() }"
            :rules="[ regla ]"
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
        <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
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
        <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
          <q-select
          filled
          v-model="ProgramacionOrden.Supervisor_programacionorden"
          map-options emit-value option-value="LoginUsuario"
          option-label="NombrePersona"
          :options="listaUsuarios"
          :rules="[ regla ]"
          use-input
          hide-dropdown-icon
          hide-selected
          fill-input
          input-debounce="0"
          label="Supervisor Calibración"
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
          <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
          <q-select
            filled
            v-model="ProgramacionOrden.Encargado_programacionorden"
            map-options emit-value option-value="LoginUsuario"
            option-label="NombrePersona"
            :options="listaUsuarios"
            :rules="[ regla ]"
            use-input
            hide-dropdown-icon
            hide-selected
            fill-input
            input-debounce="0"
            label="Encargado Calibración"
            @filter="filterFnUsuario"
          >
          <template v-slot:prepend>
          <q-icon name="engineering" size="lg" />
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
          <q-input class="col-xs-6 col-sm-6 col-md-4 q-field--with-bottom"
            outlined
            stack-label
            v-model="ProgramacionOrden.Fechacalibracion_programacionorden"
            type="date"
            label="Fecha Calibración"
            :rules="[ regla ]"
          />
          <q-input class="col-xs-6 col-sm-6 col-md-4 q-field--with-bottom" 
            filled v-model="ProgramacionOrden.Horacalibracion_programacionorden" mask="time" :rules="['time']">
              <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="ProgramacionOrden.Horacalibracion_programacionorden">
                      <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                  </q-time>
                  </q-popup-proxy>
              </q-icon>
              </template>
          </q-input>
          <q-input class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
              outlined
              stack-label
              v-model="ProgramacionOrden.Duracioncalibracion_programacionorden"
              type="number"
              label="Duración Calibración (Minutos)"
              :rules="[ regla ]"
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
            </div>
          </div>
            <div class="bg-cyan text-white col-xs-12 col-sm-12 col-md-12" dense >
              <q-toolbar>
                <q-btn flat round dense icon="list" />
                <q-toolbar-title>{{ getSelectedString() }} </q-toolbar-title>
              </q-toolbar>
            </div>
            <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
              :data="lisMedidores"
              :columns="columnsMedidores"
              selection="multiple"
              row-key="Id_ordenentradad"
              v-if="ProgramacionOrden.Id_banco"
              :selected.sync="selectedMedidores"
              :visible-columns="vcMedidores">
              <template v-slot:header-selection="scope">
                <q-toggle v-model="scope.selected" />
              </template>
              <template v-slot:body-selection="scope">
                <q-toggle v-model="scope.selected" dense />
              </template>
              <template v-slot:top="props">
                <q-btn
                  color="primary"
                  icon-right="archive"
                  label=""
                  no-caps
                  @click="exportTable(lisMedidores, columnsMedidores)"
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
            </q-table>
            <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" stack-label label="Observaciones" v-model="ProgramacionOrden.Observacion_programacionorden" type="textarea" outlined  />
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Programar" icon="save" type="submit" outline align="center" unelevated >
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
    <q-dialog v-model="isDialogComponenteFiltro" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Consulta Medidores x Filtro</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="ordenEntradaD.Marcamedidor"
                  map-options emit-value option-value="Marcamedidor"
                  option-label="Nombre_marcamedidor"
                  :options="lisMarcamedidor"
                  clearable
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
                  v-model="ordenEntradaD.Modelomedidor"
                  map-options emit-value option-value="Modelomedidor"
                  option-label="Descripcion_modelomedidor"
                  :options="lisModelomedidor"
                  clearable
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
                        <q-item-label caption>Diametro Nominal: {{ scope.opt.Diametronominal_modelomedidor }}</q-item-label>
                        <q-item-label caption>División Escala: {{ scope.opt.Divisionescala_modelomedidor }}</q-item-label>
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
                  label="Apto para calibrar"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="schedule" size="lg" />
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" 
                  stack-label label="Año Fabricación" 
                  v-model="ordenEntradaD.Fabricacion_ordenentradad"
                  type="number" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Lectura Medidor" 
                  v-model="ordenEntradaD.Lectura_ordenentradad" 
                  type="number" outlined />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Serial Medidor" v-model="ordenEntradaD.Serialmedidor_ordenentradad" outlined  />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Registros Encontrados" v-model="lisMedidores.length" outlined  />
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Buscar" icon="search" outline align="center" unelevated @click="consultarFiltro()">
              </q-btn>
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteInstrumentos" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Instrumentos Caudal {{ caudal.Id_caudal }} ({{ caudal.Nombre_caudal }})</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="ListaInstrumentosGeneral"
                :columns="columnsInstrumentos"
                row-key="Id_instrumento">
                <template v-slot:body-cell-Modificar_instrumento="props">
                  <q-td key="Modificar_instrumento" :props="props" auto-width>
                    <q-btn icon="mode_edit" color="green" align="center" outline @click="cambiarInstrumento(props.row)"
                    v-if="props.row">
                    </q-btn>
                  </q-td>
                </template>      
              </q-table>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Regresar" icon="logout" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteCambiarInstrumento" style="max-width: 650px">
        <q-card>
          <q-bar>
            <div>Instrumento {{ Instrumento.Id_instrumento }} ({{ Instrumento.Nombre_instrumento }})</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <q-table class="col-xs-12 col-sm-12 col-md-12" dense title="" no-data-label="No hay registros" hide-bottom :rows-per-page-options="[0]" flat bordered
                :data="listaInstrumentosModificar"
                :columns="columnsInstrumentos"
                row-key="Id_instrumento">
                <template v-slot:body-cell-Modificar_instrumento="props">
                  <q-td key="Modificar_instrumento" :props="props" auto-width>
                    <q-btn icon="mode_edit" color="green" align="center" outline @click="modificarInstrumento(props.row)"
                    v-if="props.row">
                    </q-btn>
                  </q-td>
                </template>      
              </q-table>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Regresar" icon="logout" outline align="center" unelevated v-close-popup>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteConsulta" style="max-width: 650px">
      <q-card>
        <q-bar>
          <div>Consulta Programaciones</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
            <q-select
              filled
              v-model="ProgramacionOrdenB.Login_programacionorden"
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
            v-model="ProgramacionOrdenB.Observacion_programacionorden"
            label="Observación"
          />
          <q-toggle class="col-xs-12 col-sm-4 col-md-3 q-field--with-bottom q-pt-sm"
            v-model="todasFechas"
            checked-icon="check"
            color="green"
            :true-value="1"
            :false-value="0"
            label="Todas las fechas"
            unchecked-icon="clear"
          />
          <q-input class="col-xs-12 col-sm-4 col-md-4"
            outlined
            stack-label
            v-model="ProgramacionOrdenB.FechaIni"
            type="date"
            label="Fecha Desde"
            :readonly="todasFechas === 1"
          />
          <q-input class="col-xs-12 col-sm-4 col-md-4"
            outlined
            stack-label
            v-model="ProgramacionOrdenB.FechaFin"
            type="date"
            label="Fecha Hasta"
            :readonly="todasFechas === 1"
          />
          Trazabilidad: <br/>   
          1: PROGRAMADO  <br/>  
          2: CALIBRADO   <br/> 
          3: VERIFICADO		<br/>  
          4: CERTIFICADO	<br/> 
          5: ENTREGADO
          <div class="row justify-center q-pa-sm">
            <q-btn label="Consultar" icon="search" outline align="center" unelevated @click="consultarordenProgramacionFechas()" >
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
                    <b> {{ formatoNumero(listaProgramaciones.length, 0) }} </b>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <div class="q-pa-md q-gutter-md">
            <q-list>
              <q-item v-for="p in listaProgramaciones" :key="p.Id_programacionorden" @click="programacionOrdenImprimirPDF(p.Id_programacionorden)" class="q-my-sm" clickable>
                <q-item-section avatar>
                  <q-icon name="receipt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label> <b> {{  }} </b> </q-item-label>
                  <q-item-label>
                    Id Programacion: {{ p.Id_programacionorden }} <br/>
                    Medidores: {{ p.LisProgOrdenDet.length }} <br/>
                    Supervisor: {{ p.Nombre_supervisor }} <br/>
                    Encargado: {{ p.Nombre_encargado }} <br/>
                    IdentificacionBanco: {{ p.Identificacion_banco }} <br/>
                    TipoEnsayo: {{ p.Nombre_tipoensayo }} <br/>
                    Observaciones: {{ p.Observacion_programacionorden }} <br/>
                    FechaCalibracion:  {{ p.Fechacalibracion_programacionorden }} <br/>
                    HoraCalibracion:  {{ p.Horacalibracion_programacionorden }} <br/>
                    Trazabilidad: {{ p.Trazabilidad_programacionorden }} <br/>
                    Login:  {{ p.Login_programacionorden }} <br/>
                    Fecha:  {{ p.Fecha_programacionorden }} <br/>
                  </q-item-label>
                  <q-separator />
                </q-item-section>
              </q-item>
            </q-list>
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
  name: 'programacionOrden',
  data () {
    return {
      model: null,
      todasFechas: 0,
      listaProgramaciones: [],
      selectedDate: '',
      listaDiametros: ['15', '20', '25'],
      listaRangoMedicion: [],
      rangoMedicion: { Id_rangomedicion: '', Nombre_rangomedicion: '', Diametromedidor_rangomedicion: 0, Estado_rangomedicion: 1 },
      condicionMontada: { Id_rangomedicion: '', Diametro_medidor: -1 },      
      // modeloMedidor: { id_modelomedidor: -1, id_marcamedidor: -1,	id_tipoindicador: '',	id_princfisico: -1,	id_posicionmed: '',	id_rangom3: -1,	id_rangomedicion: '',	diametronominal_modelomedidor: -1,	divisionescala_modelomedidor: -1,	descripcion_modelomedidor: '',	fecha_modelomedidor: '', login_modelomedidor: '',	estado_modelomedidor: 1 },
      ListaInstrumentosGeneral: [],
      listaInstrumentos: [],
      listaInstrumentosModificar: [],
      columnsInstrumentos: [
        { name: 'Modificar_instrumento', label: 'Modificar', field: 'Modificar_instrumento', sortable: true },
        { name: 'Id_instrumento', label: 'Id', field: 'Id_instrumento', sortable: true },
        { name: 'NombreTipoInstrumento', align: 'left', label: 'Tipo Instrumento', field: 'NombreTipoInstrumento', sortable: true },
        { name: 'Nombre_instrumento', align: 'left', label: 'Nombre Instrumento', field: 'Nombre_instrumento', sortable: true },
        { name: 'Codigo_instrumento', align: 'left', label: 'Código', field: 'Codigo_instrumento', sortable: true }
        // { name: 'Fechacalibracion_instrumento', align: 'left', label: 'Calibrado', field: 'Fechacalibracion_instrumento', sortable: true }
      ],
      SelectedInstrumentos: [],
      Instrumento: { Id_instrumento: -1, IdTipoInstrumento: '', Id_variablemedicion: '', Nombre_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Activo_instrumento: false, Login_instrumento: '', LisTrazabilidadInstrumentos: [], Calibrado_instrumento: 0 },
      banco: { Id_banco: -1, Identificacion_banco: '', Tipo_banco: '', Lineas_banco: -1, Medidores_banco: -1, Descripcion_banco: '', Login_banco: '', Estado_banco: 1 },
      tipoensayo: { Id_tipoensayo: -1, Nombre_tipoensayo: '', Estado_tipoensayo: 1 },
      caudal: { Id_caudal: '', Nombre_caudal: '', Caudal_caudal: '', Estado_caudal: 1 },
      // time: ref('07:30'),
      listaUsuarios: [],
      listaParametrosCalibracion: [],
      parametroCalibracion: { Id_parcal: -1, Descripcion_parcal: '', Observaciones_parcal: -1, Coefexpter_parcal: -1, Incertcoefexpter_parcal: -1, Incertcomprenagua_parcal: -1, Coefexptermat_parcal: -1, Comprenagua_parcal: -1, Incertcoefexptva_parcal: -1, Activo_parcal: -1, Login_parcal: '', Fecha_parcal: '', Estado_parcal: -1 },
      listaCaudales: [],
      SelectedPruebas: [],
      ProgramacionOrden: { Id_programacionorden: null, Id_ordenentradad: null, Id_tipoensayo: null, Nombre_tipoensayo: '', Id_banco: null, Nombre_banco: '', Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', LisProgOrdenDet: [], LisInstProg: [] },
      ProgramacionOrdenB: { Id_programacionorden: -1, Id_parcal: -1, Id_ordenentradad: -1, Id_tipoensayo: -1, Nombre_tipoensayo: '', Id_banco: -1, Nombre_banco: '', Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: -1, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', Trazabilidad_programacionorden: -1, FechaIni: '', FechaFin: '', LisProgOrdenDet: [], LisInstProg: [] },
      Normaref: { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [] },
      selectedMedidores: [],
      lisNormareferencia: [],
      lisAptocalibrar: ['SI', 'NO'],
      lisMarcamedidor: [],
      lisModelomedidor: [],
      lisMedidores: [],
      lisordenEntrada: [],
      lisBancos: [],
      lisTipoEnsayo: [],
      fechaIni: '',
      fechaFin: '',
      componente: null,
      isDialogComponente: false,
      isDialogComponenteInstrumentos: false,
      isDialogComponenteCambiarInstrumento: false,
      isDialogComponenteConsulta: false,
      isDialogComponenteFiltro: false,
      fecha: date,
      usuario: {},
      ordenEntradaD: { Id_ordenentradad: -1, Id_ordenentrada: -1, Id_marcamedidor: -1, Diametronominal_ordenentradad: 0, Id_modelomedidor: -1, Id_normaref: null, Aptocalibrar_ordenentradad: '', Fabricacion_ordenentradad: '', Lectura_ordenentradad: '', Serialmedidor_ordenentradad: '', Caudalpermanente_ordenentradad: 0, Claseprecision_ordenentradad: 0, Presionmax_ordenentradad: 0, Perdidapresion_ordenentradad: '',
        Rangomedicion1_ordenentradad: 0, Rangomedicion2_ordenentradad: 0, Clasetemperatura_ordenentradad: '', Sensibilidadaar_ordenentradad: '', Sebsibilidadaab_ordenentradad: '', Identificador_ordenentradad: 0, Clasemetrologica_ordenentradad: '', Precisionnominal_ordenentradad: 0, Observacion_ordenentradad: '', Estado_ordenentradad: 0, Nombre_marcamedidor: '', Descripcion_modelomedidor: '', Nombre_normaref: '', Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: '' }, Modelomedidor: { Id_modelomedidor: null, Descripcion_modelomedidor: '', Diametronominal_modelomedidor: '' }, Icono: 'edit', Incidencias: 0, ListaIncidencias: [], Programado_ordenentradad: 0, Calibrado_ordenentradad: 0, Certificado_ordenentradad: 0 },
      columnsMedidores: [
        { name: 'Id_ordenentradad', align: 'left', label: 'Id', field: 'Id_ordenentradad', required: true, sortable: true },
        { name: 'Serialmedidor_ordenentradad', align: 'left', label: 'Serial', field: 'Serialmedidor_ordenentradad', sortable: true },
        { name: 'Fabricacion_ordenentradad', align: 'left', label: 'AñoFab', field: 'Fabricacion_ordenentradad', sortable: true },
        { name: 'Lectura_ordenentradad', label: 'Lectura', field: 'Lectura_ordenentradad', sortable: true },
        { name: 'Nombre_marcamedidor', align: 'left', label: 'Marca Medidor', field: 'Nombre_marcamedidor', sortable: true },
        { name: 'Descripcion_modelomedidor', align: 'left', label: 'Modelo Medidor', field: 'Descripcion_modelomedidor', sortable: true },
        { name: 'Aptocalibrar_ordenentradad', align: 'left', label: 'AptoCal', field: 'Aptocalibrar_ordenentradad', sortable: true },
        { name: 'Diametronominal_ordenentradad', align: 'left', label: 'DNom', field: 'Diametronominal_ordenentradad', sortable: true },
        { name: 'Nombre_normaref', align: 'left', label: 'Norma Referencia', field: 'Nombre_normaref', sortable: true }
      ],
      vcMedidores: ['Id_ordenentradad', 'Serialmedidor_ordenentradad', 'Fabricacion_ordenentradad', 'Lectura_ordenentradad', 'Descripcion_modelomedidor'],
      columnsCaudales: [
        { name: 'Id_caudal', align: 'left', label: 'Id', field: 'Id_caudal', sortable: true },
        { name: 'Nombre_caudal', align: 'left', label: 'Nombre Prueba', field: 'Nombre_caudal', sortable: true },
        { name: 'Modificar_caudal', label: 'Modificar', field: 'Modificar_caudal' }
      ]
    }
  },
  mounted () {
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    this.mostrarRangoMedicion(this.rangoMedicion);
    this.mostrarMarcaMedidor(-1, '-1')
    const norma = { Id_normaref: -1, Nombre_normaref: '', Claseprecision_normaref: -1, LisNormaInfoTecnica: [] }
    this.mostrarNormaReferencia(norma)
    this.mostrarBancos(this.banco)
    this.mostrarTipoEnsayo(this.tipoensayo)
    this.mostrarCaudales(this.caudal)
    this.mostrarParametrosCalibracion(this.parametroCalibracion)
    this.reiniciarProgramacion()
    this.ProgramacionOrdenB.FechaIni = utils.fechaActual()
    this.ProgramacionOrdenB.FechaFin = utils.fechaActual()
  },
  created () {
    const instrumento = { Id_instrumento: -1, IdTipoInstrumento: '', Id_variablemedicion: '', Nombre_variablemedicion: '', Nombre_instrumento: '', Serial_instrumento: '', Codigo_instrumento: '', Descripcion_instrumento: '', Medida_instrumento: -1, Activo_instrumento: 1, Login_instrumento: '', LisTrazabilidadInstrumentos: [] }
    this.mostrarInstrumentosGeneral(instrumento)
  },
  methods: {
    cambiarInstrumento(instrumento) {
      const self = this
      this.Instrumento = instrumento
      self.listaInstrumentosModificar = []
      self.listaInstrumentos.forEach(function (inst) {
        if (inst.IdTipoInstrumento === instrumento.Instrumento.IdTipoInstrumento) {
          self.listaInstrumentosModificar.push(inst)
        }
      })
      this.isDialogComponenteCambiarInstrumento = true
    },
    modificarInstrumento (instrumento) {
      const self = this
      self.ListaInstrumentosGeneral.forEach(function (inst) {
        if (inst.Id_instrumento === self.Instrumento.Id_instrumento) {
          inst.Id_instrumento = instrumento.Id_instrumento
          inst.Nombre_instrumento = instrumento.Nombre_instrumento
          inst.Codigo_instrumento = instrumento.Codigo_instrumento
          // self.listaInstrumentosModificar.push(inst)
          self.isDialogComponenteCambiarInstrumento = false
        }
      })
    },
    mostrarRangoMedicion (rm) {
      const self = this
      self.$q.loading.show()
      api.post('/programacionorden/rangoMedicionMostrar/', rm)
        .then((response) => {
          self.listaRangoMedicion = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Rango Medicion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarInstrumentosGeneral (inst) {
      const self = this
      self.$q.loading.show()
      api.post('/instrumento/instrumentoMostrarFiltro/', inst)
        .then((response) => {
          self.listaInstrumentos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Instrumentos Gral ' + error)
          self.$q.loading.hide()
        })
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

      var nombreArchivo = 'ConsultaProgramacionMedidores_' + utils.fechaActual()
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
    mostrarModelos (marca) {
      if (marca !== null) {
        this.lisModelomedidor = marca.LisModelomedidor
        this.ordenEntradaD.Nombre_marcamedidor = marca.Nombre_marcamedidor
        this.ordenEntradaD.Id_marcamedidor = marca.Id_marcamedidor
        if (marca.LisModelomedidor.length < 1) {
          this.ordenEntradaD.Id_modelomedidor = ''
        }
      }
    },
    cargarModelo (modelo) {
      if (modelo !== null) {
        this.ordenEntradaD.Descripcion_modelomedidor = modelo.Descripcion_modelomedidor
        this.ordenEntradaD.Id_modelomedidor = modelo.Id_modelomedidor
        this.ordenEntradaD.Diametronominal_ordenentradad = modelo.Diametronominal_modelomedidor
      }
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
    mostrarNormaReferencia (norma) {
      const self = this
      self.$q.loading.show()
      api.post('/medidor/normaReferenciaMostrar/', norma)
        .then((response) => {
          self.lisNormareferencia = response.data
          // self.ordenEntradaD.Id_normaref = response.data[0].Id_normaref
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Norma Referencia ' + error)
          self.$q.loading.hide()
        })
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
    mostrarCaudales (caudal) {
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
    cargarInstrumentoscaudal (c) {
      const self = this
      this.caudal = c
      self.ListaInstrumentosGeneral = []
      for (const prueba of this.SelectedPruebas) {
        if (prueba.Id_caudal === c.Id_caudal) {
          this.isDialogComponenteInstrumentos = true
          self.ListaInstrumentosGeneral = prueba.ListaInstrumentoCaudal
        }
      }
    },
    getSelectedString () {
      return this.selectedMedidores.length > this.banco.Medidores_banco ? `No puede agragar medidores que superen la capacidad del banco - ${this.selectedMedidores.length} medidores` : this.selectedMedidores.length === 0 ? '' : `${this.selectedMedidores.length} medidor${this.selectedMedidores.length > 1 ? 'es' : ''} de ${this.lisMedidores.length} medidores`
    },
    getSelectdMedidores () {
      return this.lisMedidores.length === 0 ? '' : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? 'es' : ''} `
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
    regresar () {
      this.$router.push('/admin')
    },
    reiniciarProgramacion () {
      // this.ordenEntradaD = { Id_puse: 'PS01', Login_ordenEntrada: this.usuario.LoginUsuario, Numero_ordenEntrada: '0', Valor_ordenEntrada: 0, Observaciones_ordenEntrada: '' }
      this.ProgramacionOrden = { Id_programacionorden: null, Id_ordenentradad: null, Id_tipoensayo: null, Nombre_tipoensayo: '', Id_banco: null, Nombre_banco: '', Fechacalibracion_programacionorden: '', Horacalibracion_programacionorden: '', Duracioncalibracion_programacionorden: 0, Medidores_programacionorden: 0, Supervisor_programacionorden: '', Encargado_programacionorden: '', Observacion_programacionorden: '', Login_programacionorden: '', LisProgOrdenDet: [], LisInstProg: [] }
      this.ProgramacionOrden.Fechacalibracion_programacionorden = utils.fechaActual()
      this.ProgramacionOrden.Horacalibracion_programacionorden = '07:30'
      this.ProgramacionOrden.Login_programacionorden = this.usuario.LoginUsuario 
      this.fechaIni = this.ProgramacionOrden.Fechacalibracion_programacionorden
      this.fechaFin = this.ProgramacionOrden.Fechacalibracion_programacionorden
      this.listaClientes = []
      this.selectedMedidores = []
      this.SelectedPruebas = []
      this.SelectedInstrumentos = []
      this.consultarFiltro()
    },
    consultarordenProgramacionFechas () {
      const self = this
      self.$q.loading.show()
      if (self.todasFechas === 1) {
        self.ProgramacionOrdenB.Id_programacionorden = 1
      } else {
        self.ProgramacionOrdenB.Id_programacionorden = 0
      }
      if (self.ProgramacionOrdenB.Login_programacionorden === null) {
        self.ProgramacionOrdenB.Login_programacionorden = ''
      }

      api.post('/programacionorden/ProgramacionConsultaFechas/', this.ProgramacionOrdenB)
        .then((response) => {
          if (response.data != null) {
            self.listaProgramaciones = response.data
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Consulta RC - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    programacionOrdenImprimirPDF (IdProgramacionOrden) {
      this.$q.loading.show()
      api.get(`/programacionorden/programacionImprimirPDF/${IdProgramacionOrden}`, { responseType: 'arraybuffer' })
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
    guardarProgramacion () {
      const self = this
      if (self.ProgramacionOrden.Supervisor_programacionorden === self.ProgramacionOrden.Encargado_programacionorden) {
        utils.mensaje('No puedes seleccionar el mismo supervisor al encargado de la calibración')
        return
      }
      if (this.SelectedPruebas.length < 1) {
        utils.mensaje('Debe seleccionar al menos una prueba de caudal para realizar las pruebas')
        return
      }
      if (this.selectedMedidores.length < 1) {
        utils.mensaje('No ha seleccionados medidores para las pruebas, debe seleccionar al menos uno')
        return
      }
      if (this.selectedMedidores.length > this.banco.Medidores_banco) {
        utils.mensaje('Los medidores seleccionados no pueden superar la capcidad del banco, Capacidad del Banco: ' + this.banco.Medidores_banco + ', Medidores seleccionados: ' + this.selectedMedidores.length)
        return
      }
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Esta seguro de guardar la programación?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.ProgramacionOrden.LisProgOrdenDet = []
        self.ProgramacionOrden.LisInstProg = []
        self.ProgramacionOrden.Medidores_programacionorden = self.selectedMedidores.length
        self.ProgramacionOrden.Id_banco = this.banco.Id_banco
        for (const oed of self.selectedMedidores) {
          const oeDet = { Id_pod: 0, Id_programacionorden: 0, Id_ordenentradad: oed.Id_ordenentradad, Estado_pod: 1 }
          self.ProgramacionOrden.LisProgOrdenDet.push(oeDet)
        }
        // VERIFICAR TRAZABILIDAD DEL INSTRUMENTO      
        for (const caudalP of self.SelectedPruebas) {
          if (caudalP.ListaInstrumentoCaudal.length > 0) {
            for (const lic of caudalP.ListaInstrumentoCaudal) {
              // El Id_trazabilidadinst: se actualiza con el procedimiento almacenado.
              let instr = { Id_instprog: -1, Id_programacionorden: 0, Id_caudal: caudalP.Id_caudal, IdTipoInstrumento: lic.IdTipoInstrumento, Id_instrumento: lic.Id_instrumento, Id_trazabilidadinst: 0, Login_instprog: self.usuario.LoginUsuario, Fecha_instprog: '', Estado_instprog: 1 }
              self.ProgramacionOrden.LisInstProg.push(instr)
            }
          } else {
            utils.mensaje('El Caudal ' + caudalP.Nombre_caudal + ' no tiene instrumentos asociados')
            return
          }
        }
        if (self.ProgramacionOrden.LisInstProg.length > 0) {
          api.post('/programacionorden/guardarProgramacion/', this.ProgramacionOrden)
          .then((response) => {
            utils.mensaje('Programación realizada con éxito para ' + response.data.Medidores_programacionorden + ' medidores')
            self.programacionOrdenImprimirPDF(response.data.Id_programacionorden)
            self.reiniciarProgramacion()
            self.$q.loading.hide()
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion - Guardar Programacion ' + error)
            self.$q.loading.hide()
          })
        } else {
          utils.mensaje('No cuenta con instrumentos asociados a la calibración, verifique')
          return
        }
      }).onCancel(() => {
      })
    },
   formatoNumero (numero, decimales) {
      return utils.formatoNumero(numero, decimales)
    },
    consultarFiltro () {
      const self = this
      self.$q.loading.show()
      self.ordenEntradaD.Clasemetrologica_ordenentradad = self.condicionMontada.Id_rangomedicion
      self.ordenEntradaD.Diametronominal_ordenentradad = self.condicionMontada.Diametro_medidor

      if (self.ordenEntradaD.Lectura_ordenentradad === '') {
        self.ordenEntradaD.Lectura_ordenentradad = -1
      }
      if (self.ordenEntradaD.Fabricacion_ordenentradad === '') {
        self.ordenEntradaD.Fabricacion_ordenentradad = -1
      }
      api.post('/ordenentrada/OrdenentradadetMostrarFiltro/', self.ordenEntradaD)
        .then((response) => {
          self.lisMedidores = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion - Medidores ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>
