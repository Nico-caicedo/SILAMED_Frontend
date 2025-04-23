<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="fact_check" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-toolbar-title>Acciones Correctivas - Identificación
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container v-if="FirstView">

      <q-form ref="formEntregaMedidores">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <q-input :disable="Active" class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Fecha Apertura"
              v-model="AccionCorrectiva.FechaApertura" type="date" outlined>
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>

            <q-select class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom" filled
              v-model="AccionCorrectiva.TipoEvaluacion" option-value="Nombre" :disable="Active" option-label="Nombre"
              :options="TipoEvaluacion" label="Tipo de Evaluación" emit-value map-options />

            <q-input :disable="Active" v-if="AccionCorrectiva.TipoEvaluacion == 'Otro'" type="text" label="Otro"
              outlined class="col-xs-12 col-sm-6 col-md-5" v-model="AccionCorrectiva.OtroTipoEvaulacion" />

            <q-input :disable="Active" class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.QuienLevantaAccion" label="Quién detecta la Acción" />
            <q-input :disable="Active" class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.CargoQuienLevantaAccion" label="Cargo" />

            <q-input :disable="Active" class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.ProcesoLevantaAccion" label="Proceso al que se levanta acción" />

            <div class="col-xs-8 col-sm-9 col-md-6 q-field--with-bottom">
              <q-select :disable="Active" filled v-model="AccionCorrectiva.IdTramitoAccion" map-options emit-value
                option-value="LoginUsuario" option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]"
                use-input hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Quién tramita Acción"
                @filter="filterFnUsuario">
                <template v-slot:prepend>
                  <q-icon name="person" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.NombrePersona" />
                      <q-item-label caption>Login: {{ scope.opt.LoginUsuario }}
                      </q-item-label>
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
            <q-input :disable="Active" class="col-xs-12 col-sm-12 col-md-6 q-pt-sm" v-model="AccionCorrectiva.Hallazgo"
              label="Hallazgo" autogrow />

            <q-input :disable="Active" class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.NCSimilares" label="No conformidades similares o con potencial de ocurrir"
              autogrow />
            <div>
              <p class="text-h5">Identificación de Causas</p>
              <q-card class="">
                <q-card-section class="q-gutter-xs">
                  <q-btn label="Agregar Categoría" @click="CategoriasModal = true" color="primary" class="q-mt-md"
                    :disable="IdentificacionStatus" />
                  <q-btn label="Efecto" color="yellow-8" class="q-mt-md" @click="ModalFieldText(1)"
                    :disable="IdentificacionStatus" />
                  <q-btn label="Causa Raíz" color="orange-5" class="q-mt-md" @click="ModalFieldText(0)"
                    :disable="IdentificacionStatus" />
                </q-card-section>

                <q-list class="flex q-gutter-x-md" bordered separator>
                  <div v-for="(categoria, index) in categoriaList" :key="index" :label="categoria" expand-separator>
                    <div class="flex justify-center items-center" style="height: 50px">
                      <p class="text-h6">{{ categoria.Categoria }}</p>
                    </div>
                    <div class="flex flex q-gutter-x-md q-ma-sm">
                      <q-btn label="CAUSAS" color="blue-6" rounded @click="CausaModalActive(categoria, index)" />
                      <q-btn label="SUBCAUSAS" color="indigo-5" rounded @click="ShowSubcausaModal" />
                    </div>
                    <!-- <q-input
                    v-model="nuevaSubcausa[index]"
                    label="Nueva Subcausa"
                    @keyup.enter="agregarSubcausa(index)"
                  /> -->
                    <!-- <q-btn
                    label="Agregar Subcausa"
                    @click="agregarSubcausa(index)"
                    color="secondary"
                    class="q-mt-md q-mb-md"
                  /> -->

                    <q-list dense>
                      <q-item v-for="(subcausa, subIndex) in categoria.subcausas" :key="subIndex">
                        <q-item-section>{{ subcausa }}</q-item-section>
                        <q-item-section side>
                          <q-btn icon="delete" color="red" flat dense @click="eliminarSubcausa(index, subIndex)" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-list>
              </q-card>
            </div>

            <q-dialog v-model="CategoriasModal">
              <div class="q-pa-md bg-white" style="width: 200px; max-width: none">
                <div class="column" style="height: 300px">
                  <q-checkbox class="" v-model="categorias" val="Mano de obra" label="Mano de obra" color="" />
                  <q-checkbox class="" v-model="categorias" val="Maquinaria" label="Maquinaria" color="" />
                  <q-checkbox v-model="categorias" val="Medio ambiente" label="Medio ambiente" color="" />
                  <q-checkbox v-model="categorias" val="Material" label="Material" color="" />
                  <q-checkbox v-model="categorias" val="Medición" label="Medición" color="" />
                  <q-checkbox v-model="categorias" val="Método" label="Método" color="" />
                </div>

                <q-btn label="guardar cambios" @click="SaveChange" icon="save" color="positive" v-close-popup />
              </div>
            </q-dialog>

            <q-dialog persistent v-model="CausaState">
              <q-card v-if="showCausa == false" style="width: 600px; max-width: none">
                <q-card-section class="q-gutter-sm">
                  <div class="text-h6 text-center">
                    Categoría {{ TitleCategoria.Categoria }}
                  </div>

                  <div class="row justify-end q-gutter-sm">
                    <q-btn label="Causas" icon="visibility" color="primary" @click="ReadCausas" />
                    <q-btn label="Agregar Causa" @click="AddCausa" icon="add_box" color="positive " />
                  </div>
                  <q-scroll-area style="height: 200px">
                    <div class="q-pa-sm">
                      <div v-for="(item, index) in CausaCampo" :key="index" class="q-gutter-sm">
                        <div class="row q-gutter-sm">
                          <p class="row items-center justify-center col-xs-1 col-sm-1 col-md-1" style="
                              font-weight: bold;
                              font-size: 1.5em;
                              width: 20px;
                            ">
                            {{ index + 1 }}
                          </p>

                          <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="CausaTxt[index]" type="text" autogrow
                            filled />
                          <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red"
                            @click="RemoveCausa(index)" />
                        </div>
                      </div>
                    </div>
                  </q-scroll-area>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn label="Cancelar" color="negative" v-close-popup />
                  <q-btn label="guardar" icon="save" color="positive" @click="ProcesarCausas" />
                </q-card-actions>
              </q-card>
              <q-card v-if="showCausa" style="max-width: none; width: 800px">
                <q-card-section class="q-gutter-sm">
                  <div class="text-h6 text-center text-weight-bolder">
                    Categoría {{ TitleCategoria.Categoria }}
                  </div>
                  <!-- v-if="SinInfo.Evidencias" -->
                  <q-scroll-area style="height: 300px">
                    <div class="q-pa-sm" style="width: 700px">
                      <div v-if="ShowListCausas.length == 0">
                        Aún no se han agregado causas
                      </div>
                      <div v-for="(item, index) in ShowListCausas" :key="index" style="width: 100%" class="q-gutter-sm">
                        <div v-if="ShowListCausas.length > 0" class="row q-gutter-sm" style="width: 100%">
                          <p class="row justify-center col-xs-1 col-sm-1 col-md-1" style="
                              font-weight: bold;
                              font-size: 1.5em;
                              width: 20px;
                            ">
                            {{ index + 1 }}
                          </p>

                          <div :class="[
                            'row',
                            'col-xs-5',
                            'col-sm-8',
                            BtnAcciones ? 'col-md-9' : 'col-md-8',
                          ]">
                            <q-input :class="['col-xs-8', 'col-sm-10', 'col-md-10']" v-if="item.editing" filled
                              v-model="item.CausaTxt" label="Descripción de la Acción" @blur="saveAction(item)"
                              @keyup.enter="saveAction(item)" />

                            <p v-else style="
                                border-radius: 5px;
                                padding: 3px;
                                margin-bottom: 0;
                              " class="bg-grey-3 col-xs-8 col-sm-12 col-md-12">
                              {{ item.CausaTxt }}
                            </p>
                            <p class="text-italic text-caption">
                              {{ item.NombreCrea }} - {{ item.CargoCrea }} -
                              {{ item.FechaCreacion }}
                            </p>
                          </div>

                          <div v-if="BtnAcciones" class="row q-gutter-xs col-xs-2 col-sm-2 col-md-2"
                            style="margin-top: 0">
                            <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="save"
                              color="positive" @click="saveAction(item)" v-if="item.editing" />
                            <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="edit"
                              color="primary" @click="editCausa(item)" v-if="!item.editing" />
                            <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="delete"
                              color="red" @click="ProcesarEliminacion(item, index)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-scroll-area>

                  <!-- <div v-if="SinInfo.Evidencias === false">
            <p class="text-center text-h6">SIN ACCIONES AÚN</p>
          </div> -->
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn v-if="BtnAcciones" label="regresar" color="primary" @click="ReturnCausas" />

                  <q-btn v-if="!BtnAcciones" label="continuar" color="positive" v-close-popup />
                </q-card-actions>
              </q-card>

              <!-- <q-btn label="cerrar" v-close-popup /> -->
            </q-dialog>
            <q-dialog v-model="DeleteCausaVisible" class="col-xs-12 col-sm-12 col-md-12" persistent>
              <q-card style="width: 600px; max-width: none">
                <q-card-section style="padding: 16px 16px 0 16px">
                  <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
                    ¿Esta seguro de eliminar la Causa?
                  </div>
                </q-card-section>

                <q-card-section>
                  <div>
                    <p class="text-h6">
                      Confirmar la eliminación de la causa también eliminará las
                      subcausas relacionadas.
                    </p>
                  </div>
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn label="Cancelar" color="negative" v-close-popup />
                  <q-btn label="Confirmar" color="positive" @click="DeleteAccion(PaqAccion)" />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <q-dialog persistent v-model="FieldTextShow">
              <q-card>
                <div class="q-pa-md bg-white" style="width: 350px; max-width: none">
                  <q-input autogrow v-model="CausaRaizField" label="Causa Raiz" v-if="!FieldText" />
                  <q-input autogrow v-model="EfectoField" label="Efecto" v-if="FieldText" />
                </div>
                <q-card-actions align="center">
                  <q-btn label="Cancelar" color="negative" v-close-popup @click="Resetearinfo" />
                  <q-btn label="guardar" color="positive" v-if="!FieldText" @click="SaveFiledText(0)" v-close-popup />
                  <q-btn label="guardar" color="positive" v-if="FieldText" @click="SaveFiledText(1)" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-dialog v-model="ShowSubCausa" class="col-xs-12 col-sm-12 col-md-5" persistent>
              <q-card style="width: 800px">
                <q-card-section>
                  <div class="text-h5 text-center text-weight-bolder">
                    Causas
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="bg-white" style="
                      width: 95% !important;
                      max-width: none;
                      min-height: none;
                      height: 95%;
                    ">
                    <p class="text-weight-bold q-ma-none">
                      Presione alguna de las Causas para ver las subcausas
                    </p>

                    <q-scroll-area style="height: 300px">
                      <div class="q-pa-sm">
                        <div v-for="(item, index) in ShowListCausas" :key="index" class="q-gutter-sm">
                          <div class="row q-gutter-sm">
                            <p class="row justify-center col-xs-1 col-sm-1 col-md-1" style="
                                font-weight: bold;
                                font-size: 1.5em;
                                width: 20px;
                              ">
                              {{ index + 1 }}

                            </p>

                            <p style="cursor: pointer; border-radius: 5px; padding: 3px"
                              class="row items-center justify-center bg-grey-3 col-xs-11 col-sm-11 col-md-11"
                              @click="GetSubCausasId(item.IdCausa, item.IndexCategoria)">
                              {{ item.CausaTxt }}
                            </p>

                            <!-- <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="datos[index]" type="text" autogrow filled />
                  <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" @click="RemoveAction(index)" /> -->
                          </div>
                        </div>
                      </div>
                    </q-scroll-area>

                    <!-- <div v-if="SinInfo.Evidencias === false">
                      <p class="text-center text-h6">SIN EVIDENCIAS AÚN</p>
                    </div> -->
                    <!-- <div style="gap: 10px;" class="q-pa-sm row justify-evenly">

              
                  <q-img style="width: 100px; max-width: 90vh; height: 150px; " 
                    :src="Ruta" fit="contain" />
                  <div class="bg-grey-7 column items-center justify-center" style="height: 60px;">
                    <p class="q-ma-none text-white">nombre imagen</p>
                    <p class="q-ma-none text-grey-2">servicio</p>
                    <q-btn icon="download" color="positive" @click="Descarga" />
                    <q-btn  color="grey-2" text-color="grey-9" icon="cloud_upload"
                      /> 

               
                </div>

              </div>  -->

                    <!-- <q-dialog v-model="dialogoAbierto" :content-css="{ width: '95%', height: '95%' }">
              <q-img :src="imagenSeleccionada" fit="" />
            </q-dialog> -->
                  </div>
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn label="OK" color="positive" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>


            <q-dialog persistent v-model="ShowSubCausaIndividualVisible">
              <q-card v-if="ShowSubcausaState == false" style="width: 600px; max-width: none">
                <q-card-section class="q-gutter-sm">
                  <div class="text-h6 text-center">
                    SubCausas de Categoría {{ TitleCategoria.Categoria }}
                  </div>

                  <div class="row justify-end q-gutter-sm">
                    <q-btn label="SubCausas" icon="visibility" color="primary" @click="ReadSubCausas" />
                    <q-btn label="Agregar SubCausa" @click="AddSubCausa" icon="add_box" color="positive " />
                  </div>
                  <q-scroll-area style="height: 200px">
                    <div class="q-pa-sm">
                      <div v-for="(item, index) in SubCausaCampo" :key="index" class="q-gutter-sm">
                        <div class="row q-gutter-sm">
                          <p class="row items-center justify-center col-xs-1 col-sm-1 col-md-1" style="
                              font-weight: bold;
                              font-size: 1.5em;
                              width: 20px;
                            ">
                            {{ index + 1 }}
                          </p>

                          <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="SubCausaTxt[index]" type="text" autogrow
                            filled />
                          <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red"
                            @click="RemoveSubCausa(index)" />
                        </div>
                      </div>
                    </div>
                  </q-scroll-area>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn label="regresar" color="primary" @click="ReturnSubcausa" />
                  <q-btn label="guardar" icon="save" color="positive" @click="ProcesarSubCausas" />
                </q-card-actions>
              </q-card>
              <q-card v-if="ShowSubcausaState" style="max-width: none; width: 800px">
                <q-card-section class="q-gutter-sm">
                  <div class="text-h6 text-center text-weight-bolder">
                    SubCausas de Categoría {{ TitleCategoria.Categoria }}
                  </div>
                  <!-- v-if="SinInfo.Evidencias" -->
                  <q-scroll-area style="height: 300px">
                    <div class="q-pa-sm" style="width: 700px">
                      <div v-for="(item, index) in ShowListSubCausas" :key="index" style="width: 100%"
                        class="q-gutter-sm">
                        <div class="row q-gutter-sm" style="width: 100%">
                          <p class="row justify-center col-xs-1 col-sm-1 col-md-1" style="
                              font-weight: bold;
                              font-size: 1.5em;
                              width: 20px;
                            ">
                            {{ index + 1 }}
                          </p>

                          <div :class="[
                            'row',
                            'col-xs-5',
                            'col-sm-8',
                            BtnAcciones ? 'col-md-9' : 'col-md-8',
                          ]">
                            <q-input :class="['col-xs-8', 'col-sm-10', 'col-md-10']" v-if="item.editing" filled
                              v-model="item.SubCausaTxt" label="Descripción de la Acción" @blur="saveAction(item)"
                              @keyup.enter="saveAction(item)" />

                            <p v-else style="
                                border-radius: 5px;
                                padding: 3px;
                                margin-bottom: 0;
                              " class="bg-grey-3 col-xs-8 col-sm-12 col-md-12">
                              {{ item.SubCausaTxt }}
                            </p>
                            <p class="text-italic text-caption">
                              {{ item.NombreCrea }} - {{ item.CargoCrea }} -
                              {{ item.FechaCreacion }}
                            </p>
                          </div>

                          <div v-if="BtnAcciones" class="row q-gutter-xs col-xs-2 col-sm-2 col-md-2"
                            style="margin-top: 0">
                            <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="save"
                              color="positive" @click="saveAction(item)" v-if="item.editing" />
                            <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="edit"
                              color="primary" @click="editCausa(item)" v-if="!item.editing" />
                            <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="delete"
                              color="red" @click="ProcesarEliminacion(item, index)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-scroll-area>

                  <!-- <div v-if="SinInfo.Evidencias === false">
            <p class="text-center text-h6">SIN ACCIONES AÚN</p>
          </div> -->
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn v-if="BtnAcciones" label="regresar" color="primary" v-close-popup
                    @click="ShowSubcausaState = false" />
                  <q-btn v-if="!BtnAcciones" label="continuar" color="positive" v-close-popup />
                </q-card-actions>
              </q-card>

              <!-- <q-btn label="cerrar" v-close-popup /> -->
            </q-dialog>
          </div>
        </div>
        <div class="row justify-center q-gutter-sm q-pa-sm">
          <q-btn label="regresar" icon="undo" @click="ReturnView" color="info" />
          <q-btn label="Guardar" v-if="!Edit" icon="save" @click="ValidarCamposDocAc()" color="positive" unelevated />
          <q-btn label="Guardar Identificación" v-if="Edit" icon="save" @click="SaveIdentificacion()" color="positive"
            unelevated />



        </div>
      </q-form>
    </q-page-container>
    <q-page-container v-if="!FirstView">
      <div class="row justify-end q-mt-sm" style="margin-right: 15px">
        <q-btn label="Crear Acción Correctiva" color="positive" icon="add_circle" @click="CreateAC" />
      </div>
      <q-table class="col-xs-12 col-sm-12 col-md-12" title="" style="margin: 15px" separator="cell"
        no-data-label="No hay registros" show-bottom flat bordered :data="DocsAc" :columns="columnsDocAc"
        :rows-per-page-options="[10]">
        <!-- :visible-columns="vcCertificado" -->
        <template v-slot:top="props">
          <q-space />
          <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen" class="q-ml-md" />
          <q-space />
          <q-select v-model="vcAC" multiple outlined dense options-dense :display-value="$q.lang.table.columns"
            emit-value map-options :options="columnsDocAc" option-value="name" options-cover style="min-width: 150px" />
        </template>

        <template v-slot:body-cell-Hallazgos="props" flat class="">
          <q-td key="Hallazgos" :props="props" class="cursor-pointer"
            @click="viewDescription(props.row.Hallazgo, 'Hallazgos')">
            <q-btn class="" label="" icon="visibility" flat color="" />
          </q-td>
        </template>
        <template v-slot:body-cell-NCSimiliares="props" flat class="">
          <q-td key="NCSimiliares" :props="props" class="cursor-pointer"
            @click="viewDescription(props.row.NCSimilares, 'NCSimilares')">
            <q-btn class="" label="" icon="visibility" flat />
          </q-td>
        </template>
        <template v-slot:body-cell-operaciones="props">
          <q-td key="operaciones" :props="props" auto-width>
            <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
            <q-btn icon="arrow_forward_ios" @click="ChangeView(props.row.IdAC)" flat color="positive" />
            <q-btn v-if="props.row.QuienTramitaAccion == usuario.LoginUsuario" icon="edit"
              to="/Procesos/AccionesCorrectivas" flat color="primary" />
            <q-btn v-if="props.row.QuienTramitaAccion == usuario.LoginUsuario" icon="delete" color="negative"
              align="center" flat @click="DeleteAccion(props.rowIndex)" />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="DescripcionVisible" persistent>
        <q-card style="width: 600px">
          <q-card-section>
            <div class="text-h5 text-center">{{ titleDescripcion }}</div>
          </q-card-section>

          <q-card-section>
            <p>{{ Descripcion }}</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Ok" color="positive" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>

import { TouchSwipe } from "quasar";
import utils from "../../commons/utils.js";
import { api } from "boot/axios";
export default {
  name: "AccionesCorrectivas",
  data() {
    return {
      // Aquí van las propiedades reactivas del componente
      TipoEvaluacion: [
        { IdTipoEvaluacion: "I", Nombre: "Interna" },
        { IdTipoEvaluacion: "E", Nombre: "Externa" },
        { IdTipoEvaluacion: "O", Nombre: "Otro" },
      ],
      FirstView: false,
      AccionCorrectiva: {
        IdAccionCorrectiva: "",
        TipoEvaluacion: "",
        OtroTipoEvaulacion: "",
        FechaApertura: "",
        ProcesoLevantaAccion: "",
        QuienLevantaAccion: "",
        CargoQuienLevantaAccion: "",
        IdTramitoAccion: "",
        Hallazgo: "",
        NCSimilares: "",
        CausaRaiz: "",

      },
      Edit: false,
      Active: true,
      nuevaCategoria: "",
      nuevaSubcausa: {},
      categorias: [],
      categoria: [],
      categoriaList: [],
      CausasList: [],
      SubCausasList: [],
      ShowListCausas: [],
      ShowListSubCausas: [],
      CategoriasModal: false,
      listaUsuarios: [],
      CausaState: false,
      showCausa: false,
      ShowSubCausa: false,
      ShowSubcausaState: false,
      ShowSubCausaIndividualVisible: false,
      SubCausaState: false,
      BtnAcciones: true,
      IdentificacionStatus: true,
      CausaCampo: [0],
      SubCausaCampo: [0],
      Efecto: "",
      EfectoField: "",
      CausaRaizField: "",
      CausaTxt: [],
      SubCausaTxt: [],
      TitleCategoria: "",
      IndexCategoria: "",
      IndexCausa: '',
      DeleteCausaVisible: false,
      FieldTextShow: false,
      FieldText: false,
      columnsDocAc: [
        {
          name: "Consecutivo",
          label: "No. Ac",
          align: "center",
          field: "Consecutivo",
        },
        {
          name: "TipoEvaluacion",
          label: "Tipo Evaluación",
          align: "center",
          field: "TipoEvaluacion",
        },
        {
          name: "FechaApertura",
          label: "Fecha Apertura",
          align: "center",
          field: "FechaApertura",
        },
        // { name: "AccionTxt", label: "Acciones", align: "left", field: row => row. AccionTxt },
        {
          name: "QuienLevantaAccion",
          label: "Quien Detecta",
          align: "center",
          field: "QuienLevantaAccion",
          format: (val) => (val ? val.toUpperCase() : ""),
        },
        {
          name: "QuienTramitaAccion",
          label: "Quien Tramito",
          align: "center",
          field: "QuienTramitaAccion",
        },
        {
          name: "Hallazgos",
          label: "Hallazgos",
          align: "center",
          field: "Hallazgos",
        },
        {
          name: "NCSimiliares",
          label: "NCSimiliares",
          align: "center",
          field: "NCSimiliares",
        },
        {
          name: "operaciones",
          label: "Operaciones",
          align: "center",
          field: "operaciones",
        },
      ],
      DocsAc: [],
      vcAC: ["acciones", "fecha", "evidencias"],
      IdAc: '',
      Ac: {},
      DescripcionVisible: false,
      Descripcion: '',
      titleDescripcion: ''

    };
  },
  methods: {
    ReturnView() {
      this.FirstView = false;
      this.Active = false
      this.Acciones = []
      this.AcCorrectivas = []
      this.Correcciones = []
    },
    SaveChange() {

      this.categoriaList = []
      for (let i = 0; this.categorias.length > i; i++) {

        this.categoriaList.push({
          Categoria: this.categorias[i],
          IdAc: this.IdAc
        })


      }
    },
    ChangeView(IdAc) {
      this.FirstView = true;

      this.GetIdAc(IdAc)  
      this.categoriaList = []
      this.CausasList = []
      this.SubCausasList = []

    },

    Resetearinfo() {
      this.CausaRaizField = ''
      this.EfectoField = ''
    },
    CreateAC() {
      this.AccionCorrectiva = {
        IdAccionCorrectiva: "",
        TipoEvaluacion: "",
        OtroTipoEvaulacion: "",
        FechaApertura: "",
        ProcesoLevantaAccion: "",
        QuienLevantaAccion: "",
        CargoQuienLevantaAccion: "",
        IdTramitoAccion: "",
        Hallazgo: "",
        NCSimilares: "",
        CausaRaiz: "",

      },
        this.IdentificacionStatus = true
      this.Edit = false
      this.FirstView = true
      this.Active = false

    },
    viewDescription(Description, title) {
      this.DescripcionVisible = true;
      this.Descripcion = Description;
      this.titleDescripcion = title
    },
    ValidarCamposDocAc() {
      let errores = 0;
      if (!this.AccionCorrectiva.TipoEvaluacion) {
        console.log(this.AccionCorrectiva.TipoEvaluacion)
        this.Notificaciones('Falta Campo Tipo Evaluación', 'warning', 'bottom')
        errores++;
      }
      if (
        this.AccionCorrectiva.TipoEvaluacion === "Otro" &&
        !this.AccionCorrectiva.OtroTipoEvaulacion
      ) {
        this.Notificaciones('Falta Campo Otro Tipo Evaluación', 'warning', 'bottom')
        errores++;
      }
      if (!this.AccionCorrectiva.FechaApertura) {
        errores++;
        this.Notificaciones('Falta Campo Fecha Apertura', 'warning', 'bottom')
      }
      if (!this.AccionCorrectiva.ProcesoLevantaAccion) {
        this.Notificaciones('Falta Campo Proceso Levanta acción', 'warning', 'bottom')
        errores++;
      }
      if (!this.AccionCorrectiva.QuienLevantaAccion) {
        this.Notificaciones('Falta Campo Quien Levanta', 'warning', 'bottom')
        errores++;
      }
      if (!this.AccionCorrectiva.CargoQuienLevantaAccion) {
        this.Notificaciones('Falta Campo Cargo Quién levanta', 'warning', 'bottom')
        errores++;
      }
      if (!this.AccionCorrectiva.IdTramitoAccion) {
        this.Notificaciones('Falta Campo Quién Tramita', 'warning', 'bottom')
        errores++;
      }
      if (!this.AccionCorrectiva.Hallazgo) {
        this.Notificaciones('Falta Campo Hallazgo', 'warning', 'bottom')
        errores++;
      }

      if (
        !this.AccionCorrectiva.NCSimilares) {
        this.Notificaciones('Falta Campo NCSimilares', 'warning', 'bottom')
        errores++
      }

      // Si hay errores, los mostramos y retornamos falso
      if (errores > 0) {
        this.Notificaciones('Faltan Campos por completar', 'warning', 'bottom')
        errores = 0
        return false;
      }

      // Si no hay errores, la validación pasa
      this.CreateDocAc()
    },
    GetPaqIdentificacionId() {
      api
        .get(`/AcCorrectivas/GetAcId/${this.IdAc}`)
        .then((response) => {
          var Ac = response.data;
          this.AccionCorrectiva = {
            IdAccionCorrectiva: Ac.IdAc,
            TipoEvaluacion: Ac.TipoEvaluacion,
            OtroTipoEvaulacion: Ac.OtroTipoEvaluacion,
            FechaApertura: Ac.FechaApertura,
            ProcesoLevantaAccion: Ac.ProcesoLevantaAccion,
            QuienLevantaAccion: Ac.QuienLevantaAccion,
            CargoQuienLevantaAccion: Ac.CargoQuienLevantaAccion,
            IdTramitoAccion: Ac.QuienTramitaAccion,
            Hallazgo: Ac.Hallazgo,
            NCSimilares: Ac.NCSimilares,
            CausaRaiz: Ac.CausaRaiz,
            FechaCierre: Ac.FechaCierre
          }
          this.ValidarCargo()
          console.log(Ac)
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });

    },
    GetIdAc(IdAC) {
      // GetAcId
      this.IdAc = IdAC
      api
        .get(`/AcCorrectivas/GetAcId/${IdAC}`)
        .then((response) => {
          var Ac = response.data;
          this.AccionCorrectiva = {
            IdAccionCorrectiva: Ac.IdAc,
            TipoEvaluacion: Ac.TipoEvaluacion,
            OtroTipoEvaulacion: Ac.OtroTipoEvaluacion,
            FechaApertura: Ac.FechaApertura,
            ProcesoLevantaAccion: Ac.ProcesoLevantaAccion,
            QuienLevantaAccion: Ac.QuienLevantaAccion,
            CargoQuienLevantaAccion: Ac.CargoQuienLevantaAccion,
            IdTramitoAccion: Ac.QuienTramitaAccion,
            Hallazgo: Ac.Hallazgo,
            NCSimilares: Ac.NCSimilares,
            CausaRaiz: Ac.CausaRaiz,
            FechaCierre: Ac.FechaCierre
          }
          this.GetIdentificacionId(IdAC)
          this.ValidarCargo()
          console.log(Ac)
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },

    GetIdentificacionId(IdAC) {
      api
        .get(`/AcCorrectivas/GetIdentificacion/${IdAC}`)
        .then((response) => {
          console.log(response.data)
          var data = response.data[0]
          console.log('data', data)
          for (let i = 0; data.Categorias.length > i; i++) {
            this.categorias.push(data.Categorias[i].Categoria)
            this.categoriaList.push({ Categoria: data.Categorias[i].Categoria })
            for (let a = 0; data.Causas.length > a; a++) {
              let CA = data.Causas[a]
              this.CausasList.push({
                IdCausa: CA.IdCausa,
                CausaTxt: CA.CausaTxt,
                IndexCategoria: i,
              })


              for (let b = 0; data.SubCausas.length > b; b++) {

                let Sub = data.SubCausas[b]
                this.SubCausasList.push({
                  IdSubCausa: Sub.IdSubCausa,
                  SubCausaTxt: Sub.SubCausaTxt,
                  IndexCausa: a,
                });
              }

            }
          }
          console.log('causas', this.CausasList)

        })

    },

    ValidarCargo() {
      console.log(this.usuario)

      if (this.AccionCorrectiva.IdTramitoAccion == this.usuario.LoginUsuario) {
        this.IdentificacionStatus = false
        this.Edit = true
        this.Active = true

      }
    },

    SaveIdentificacion() {




      console.log('categorias', this.categoriaList)
      console.log('causas', this.CausasList)
      console.log('subcausas', this.SubCausasList)

      var AccionesCorrectivas = {
        IdAC: this.IdAc,
        Categorias: this.categoriaList,
        Causas: this.CausasList,
        SubCausas: this.SubCausasList
      }

      api
        .post(
          '/AcCorrectivas/SaveIdentificacion/',
          AccionesCorrectivas
        )
        .then((response) => {
          this.Notificaciones(
            "Se guardaron Cambios",
            "positive",
            "bottom-right"
          );

        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });

      this.categoriaList = []
      this.CausasList = []
      this.SubCausasList = []

    },


    CreateDocAc() {
      console.log(this.AccionCorrectiva)
      api
        .post(
          '/AcCorrectivas/CreateDocAC/',
          this.AccionCorrectiva
        )
        .then((response) => {
          this.Notificaciones(
            "Se guardaron Cambios",
            "positive",
            "bottom-right"
          );

        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    ModalFieldText(NumberField) {
      if (NumberField == 1) {
        this.FieldText = true;
        this.EfectoField = this.Efecto;
      } else if (NumberField == 0) {
        this.CausaRaizField = this.AccionCorrectiva.CausaRaiz;
        this.FieldText = false;
      }
      this.FieldTextShow = true;
    },
    SaveFiledText(NumberField) {
      if (this.AccionCorrectiva.IdAccionCorrectiva == "") {
        if (NumberField == 1) {
          if (this.EfectoField != "") {
            this.Efecto = this.EfectoField;
            this.CausaRaizField = this.AccionCorrectiva.IdAccionCorrectiva;
          } else {
            this.Notificaciones(
              "Debe Completar el campo",
              "negative",
              "bottom"
            );
          }
        }

        this.Notificaciones("Se guardo con exitó", "positive", "bottom");
      } else if (this.AccionCorrectiva.IdAccionCorrectiva != "") {
      }
    },
    ShowSubcausaModal() {
      this.ShowSubCausa = true;
      this.GetCausas();
    },
    ReturnSubcausa() {
      this.SubCausaCampo = [0]
      this.SubCausaTxt = []
      this.ShowSubCausaIndividualVisible = false
      this.ShowSubCausa = true
    },
    CausaModalActive(TitleCategoria, index) {
      this.TitleCategoria = TitleCategoria;
      this.IndexCategoria = index;
      this.CausaState = true;
    },
    agregarCategoria() {
      if (this.nuevaCategoria.trim() !== "") {
        this.categorias.push({ nombre: this.nuevaCategoria, subcausas: [] });
        console.log(this.categorias, 'pruebas')
        this.nuevaCategoria = "";
      }
    },
    agregarSubcausa(index) {
      if (
        this.nuevaSubcausa[index] &&
        this.nuevaSubcausa[index].trim() !== ""
      ) {
        this.categorias[index].subcausas.push(this.nuevaSubcausa[index]);
        this.nuevaSubcausa[index] = "";
      }
    },
    eliminarSubcausa(catIndex, subIndex) {
      this.categorias[catIndex].subcausas.splice(subIndex, 1);
    },
    RemoveCausa(index) {
      this.CausaTxt.splice(index, 1);
      this.CausaCampo.splice(index, 1);
    },
    RemoveSubCausa(index) {
      this.SubCausaTxt.splice(index, 1);
      this.SubCausaCampo.splice(index, 1);
    },
    AddCausa() {
      this.CausaCampo.push({});
    },
    AddSubCausa() {
      this.SubCausaCampo.push({});
    },
    editCausa(item) {
      this.$set(item, "editing", true);
    },
    saveAction(item) {
      this.$set(item, "editing", false);

      this.UpdateAction(item);
      // Aquí puedes agregar la lógica para guardar los cambios si es necesario
    },
    ProcesarEliminacion(PaqAccion, indexs) {
      // console.log(IdAction)

      if (this.AccionCorrectiva.IdAccionCorrectiva == "") {
        this.DeleteCausaVisible = true;
        this.PaqAccion = PaqAccion;
      } else {
        this.Acciones.splice(indexs, 1);
        this.DeleteAccion(PaqAccion);
      }
    },
    ReturnCausas() {
      this.showCausa = false;
    },
    ProcesarCausas() {
      if (this.CausaCampo.length === 0) {
        this.Notificaciones(
          "Sin Acciones para registrar",
          "negative",
          "bottom"
        );
      } else {
        let camposVacios = false;

        // Iterar sobre cada entrada para verificar campos vacíos
        this.CausaCampo.forEach((causacampo, index) => {
          if (!this.CausaTxt[index]) {
            camposVacios = true;
          }
        });

        if (camposVacios) {
          this.Notificaciones(
            "Faltan Campos por completar en alguna acción",
            "negative",
            "bottom"
          );
        } else {
          // Procesar las acciones
          // this.handleOk();

          // const Causa = {
          //   IdCausa: 'nn',
          //   CausaTxt: this.CausaTxt,
          //   IndexCategoria: this.IndexCategoria,
          // };
          for (let i = 0; i < this.CausaTxt.length; i++) {
            this.CausasList.push({
              IdCausa: "",
              CausaTxt: this.CausaTxt[i],
              IndexCategoria: this.IndexCategoria,
            });
          }
          // this.CausasList.push({  IdCausa: 'nn',
          //   CausaTxt: this.CausaTxt,
          //   IndexCategoria: this.IndexCategoria,})
          // this.SetActions(Causa);

          this.CausaCampo = [0];
          this.CausaTxt = [];
          this.Notificaciones("causas guardadas", "positive", "bottom");
          this.CausaState = false

        }
      }
    },
    ProcesarSubCausas() {
      if (this.SubCausaCampo.length === 0) {
        this.Notificaciones(
          "Sin Acciones para registrar",
          "negative",
          "bottom"
        );
      } else {
        let camposVacios = false;

        // Iterar sobre cada entrada para verificar campos vacíos
        this.SubCausaCampo.forEach((subcausacampo, index) => {
          if (!this.SubCausaTxt[index]) {
            camposVacios = true;
          }
        });

        if (camposVacios) {
          this.Notificaciones(
            "Faltan Campos por completar en alguna acción",
            "negative",
            "bottom"
          );
        } else {
          // Procesar las acciones
          // this.handleOk();

          // const Causa = {
          //   IdCausa: 'nn',
          //   CausaTxt: this.CausaTxt,
          //   IndexCategoria: this.IndexCategoria,
          // };
          for (let i = 0; i < this.SubCausaTxt.length; i++) {
            this.SubCausasList.push({
              IdSubCausa: "",
              SubCausaTxt: this.SubCausaTxt[i],
              IndexCausa: this.IndexCausa,
            });
          }
          // this.CausasList.push({  IdCausa: 'nn',
          //   CausaTxt: this.CausaTxt,
          //   IndexCategoria: this.IndexCategoria,})
          // this.SetActions(Causa);

          this.SubCausaCampo = [0];
          this.SubCausaTxt = [];
          this.Notificaciones("causas guardadas", "positive", "bottom");
          // this.CausaState = false
          console.log(this.SubCausasList)

        }
      }
    },
    ReadCausas() {
      if (this.AccionCorrectiva.IdAccionCorrectiva == "") {
        this.showCausa = true;
        this.GetCausas();
      } else if (this.AccionCorrectiva.IdAccionCorrectiva != "") {
        this.GetCausas();
        this.CreateAccion = false;
        this.ShowAccion = true;
        this.showCausa = true;
      }
    },
    ReadSubCausas() {
      if (this.AccionCorrectiva.IdAccionCorrectiva == "") {
        this.ShowSubcausaState = true;
        this.GetSubCausas();
      } else if (this.AccionCorrectiva.IdAccionCorrectiva != "") {
        this.GetSubCausas();
        this.CreateAccion = false;
        this.ShowSubcausaState = true;
      }
    },
    GetCausas() {
      console.log('causas listas', this.CausasList)
      const listaCausas = this.CausasList.filter(
        (causa) => causa.IndexCategoria === this.IndexCategoria
      );
      this.ShowListCausas = listaCausas;
      console.log(this.ShowListCausas);
    },
    GetSubCausas() {
      const listaSubCausas = this.SubCausasList.filter(
        (subcausa) => subcausa.IndexCausa === this.IndexCausa
      );
      this.ShowListSubCausas = listaSubCausas;
      console.log(this.ShowListSubCausas);
    },
    GetSubCausasId(IdCausa, IndexCausa) {
      this.IndexCausa = IndexCausa
      this.ShowSubCausa = false
      this.ShowSubCausaIndividualVisible = true

    },

    // ---------------------------------------------------
    Notificaciones(text, color, position) {
      this.$q.notify({
        type: color,
        message: `${text}`,
        position: position,
      });
    },
    filterFnUsuario(val, update, abort) {
      if (val.length === 0) {
        abort();
        return;
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        api
          .get(`/usuario/usuariosFiltro/${val}`)
          .then((response) => {
            update(() => {
              this.listaUsuarios = response.data;
              this.$q.loading.hide();
            });
          })
          .catch((error) => {
            utils.mensaje("Fallo la conexion " + error);
            this.$q.loading.hide();
          });
      }, 500);
    },
    regla(val) {
      if (val !== null && val !== "" && val !== undefined) {
        return true;
      }
      return false || "Falta completar información";
    },
    GetDocsAC() {
      api
        .get("/AcCorrectivas/GetDocsAC")
        .then((response) => {
          this.DocsAc = response.data;
          console.log(this.DocsAc)

        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },

  },
  // computed: {
  //   // Aquí van las propiedades computadas del componente
  // },
  mounted() {
    this.GetDocsAC();
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
  },
};
</script>
