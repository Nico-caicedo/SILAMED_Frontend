<template>
  <q-layout view="lHh lpr lFf" container style="height: 92vh" class="shadow-2 rounded-borders">
    <q-header v-if="mostrarse == true" bordered class="bg-white text-primary col-xs-12 col-sm-12 col-md-12 q-pt-sm">
      <div class="row justify-center q-gutter-md">
        <div class="row justify-center" :style="{
          width: cc.Logoancho_contcambios,
          height: cc.Logoalto_contcambios,
        }">
          <q-img style="height: 100px; width: 300px" :src="cc.Logo_contcambios" />
        </div>

        <div>
          <p style="color: black; font-size: 20px; margin-top: 10px">
            CONTROL DE TRABAJO NO CONFORME
          </p>
          <div class="row justify-around q-gutter-md">
            <div>
              <p class="row justify-center" style="color: black; font-size: 12px; margin: 0">
                CÓDIGO:
              </p>
              <p class="row justify-center" style="color: black; font-size: 12px">
                {{ cc.Codigo_formato }}
              </p>
            </div>

            <div>
              <p class="row justify-center" style="color: black; font-size: 12px; margin: 0">
                VERSIÓN
              </p>
              <p class="row justify-center" style="color: black; font-size: 12px">
                {{ cc.Version_contcambios }}
              </p>
            </div>

            <div>
              <p class="row justify-center" style="color: black; font-size: 12px; margin: 0">
                FECHA:
              </p>
              <p class="row justify-center" style="color: black; font-size: 12px">
                {{ cc.Fechacreacion_contcambios }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </q-header>

    <q-footer v-if="mostrarse == true" bordered class="bg-white text-primary" style="height: 80px">
      <div class="row justify-center items-center q-gutter-lg">
        <div>
          <p class="row justify-center" style="
              font-weight: bold;
              color: black;
              font-size: 12px;
              margin: 0;
              padding-top: 5px;
            ">
            ELABORÓ
          </p>
          <p class="row justify-center" style="color: black; margin: 0">
            {{ cc.Elaboro_contcambios }}
          </p>
          <p class="row justify-center" style="color: black">
            {{ cc.Cargoelaboro_contcambios }}
          </p>
        </div>

        <div>
          <p class="row justify-center" style="
              font-weight: bold;
              color: black;
              font-size: 12px;
              margin: 0;
              padding-top: 5px;
            ">
            REVISÓ
          </p>
          <p class="row justify-center" style="color: black; margin: 0">
            {{ cc.Reviso_contcambios }}
          </p>
          <p class="row justify-center" style="color: black">
            {{ cc.Cargoreviso_contcambios }}
          </p>
        </div>

        <div>
          <p class="row justify-center" style="
              font-weight: bold;
              color: black;
              font-size: 12px;
              margin: 0;
              padding-top: 5px;
            ">
            APROBÓ
          </p>
          <p class="row justify-center" style="color: black; margin: 0">
            {{ cc.Aprobo_contcambios }}
          </p>
          <p class="row justify-center" style="color: black">
            {{ cc.Cargoaprobo_contcambios }}
          </p>
        </div>
      </div>
    </q-footer>

    <!-- vista para llamar trabajos no conformes o crear -->
    <q-page-container v-if="mostrarse == false" class="q-gutter-y-md">
      <div class="bg-grey-5">
        <q-toolbar>
          <q-avatar>
            <q-icon name="description" size="1.5rem" />
          </q-avatar>

          <q-toolbar-title class="text-black">
            Trabajo No Conforme
          </q-toolbar-title>
        </q-toolbar>
      </div>

      <div class="row justify-end" style="margin-right: 15px">
        <q-btn label="Crear TNC" color="positive" icon="add_circle" @click="CreateTNC" />
      </div>

      <q-table class="col-xs-12 col-sm-12 col-md-12" title="" style="margin: 15px" separator="cell"
        no-data-label="No hay registros" show-bottom flat bordered :data="ListTNC" :columns="columnsTNC"
        :rows-per-page-options="[10]">
        <!-- :visible-columns="vcCertificado" -->
        <template v-slot:top="props">
          <q-btn color="primary" icon-right="archive" label="" no-caps @click="exportTable(ListTNC, columnsTNC)" />
          <q-space />
          <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen" class="q-ml-md" />
          <q-space />
          <q-select v-model="vcTNC" multiple outlined dense options-dense :display-value="$q.lang.table.columns"
            emit-value map-options :options="columnsTNC" option-value="name" options-cover style="min-width: 150px" />
        </template>

        <template v-slot:body-cell-Descripcion="props" flat class="">
          <q-td key="Descripcion" :props="props" class="cursor-pointer"
            @click="viewDescription(props.row.DescripcionProblema)">
            <q-btn class="" label="" icon="visibility" flat />
            <!-- <p class=""  >{{ props.row.DescripcionProblema }}</p> -->
          </q-td>
        </template>
        <template class="row justify-start" v-slot:body-cell-Operaciones="props">
          <q-td  key="Operaciones"  :props="props" auto-width>
            <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
            <q-btn icon="visibility" color="black" flat
              @click="VerificarResponsabilidad(props.row, 1)" />
            <q-btn icon="folder" flat color="yellow" @click="openEvidence(props.row.IdTNC)" />
            <q-btn icon="edit" flat v-if="BtnCalidad" color="primary" @click="VisibleBtn(props.row.IdTNC)" />
            <q-btn icon="picture_as_pdf" v-if="props.row.FechaCierre != 'En Curso'" @click="PrintTNC(props.row.IdTNC)"
              flat color="negative" />
          </q-td>
        </template>
      </q-table>
    </q-page-container>

    <!-- vista para crear trabajo no conforme -->

    <q-page-container v-if="mostrarse == true">
      <div class="q-pa-md row items-center q-gutter-md">
        <q-input class="col-xs-12 col-sm-4 col-md-2 q-pt-sm" stack-label label="Fecha Inicio" disable
          v-model="Trabajo.FechaApertura" type="date" outlined />
        <q-input label="Detectado Por" v-model="Trabajo.Detectado" :disable="DetectadoView" filled
          class="col-xs-12 col-sm-7 col-md-4 q-pt-sm" />

        <q-card class="my-card col-xs-12 col-sm-6 col-md-3 q-pt-sm">
          <q-card-section>
            <div class="h5 text-center">DESCRIPCIÓN DEL PROBLEMA</div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn style="width: 100%" label="Abrir" icon="edit_note" color="primary"
              @click="editor('DescripcionProblema', Editar, leer)" />
          </q-card-actions>
        </q-card>

        <q-card class="my-card col-xs-12 col-sm-5 col-md-2 q-pt-sm">
          <q-card-section>
            <div class="h5 text-center">VALORACIÓN DEL IMPACTO</div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn style="width: 100%" label="Abrir" icon="edit_note" color="primary"
              @click="editor('ValoracionImpacto', Editar, leer)" />
          </q-card-actions>
        </q-card>

        <q-card flat bordered class="my-card bg-gray col-xs-12 col-sm-12 col-md-4">
          <q-card-section style="padding: 10px">
            <div class="column items-left q-gutter-md">
              <div class="row q-gutter-md" style="margin-top: 0">
                <p class="" style="width: 50%">Acepta Trabajo No Conforme</p>
                <q-option-group v-model="Trabajo.AceptaTNC" :disable="OptionsDisabledM" :options="options"
                  color="primary" inline dense @input="AceptaTNC(Trabajo.AceptaTNC)" />
              </div>

              <div class="row q-gutter-md" style="margin-top: 0">
                <p class="" style="width: 50%">Afecta los Resultados Previos</p>
                <q-option-group v-model="Trabajo.AfectaResultadosPrevios" :disable="OptionsDisabledMo"
                  :options="options" color="primary" inline dense />
              </div>

              <div class="row q-gutter-md" style="margin-top: 0">
                <p class="text-left" style="width: 50%">
                  Se Detiene la Actividad
                </p>
                <q-option-group v-model="Trabajo.DetieneActividad" :disable="OptionsDisabled" :options="options"
                  color="primary" inline dense @input="DetieneVisibles()" />

                <div class="row justify-center" v-if="EditEmailDetener"
                  style="margin-left: 5px; margin-top: 10px; height: 15px">
                  <q-btn color="positive" icon="edit_note" @click="EditEmail(2, 2)" :disable="OptionsDisabled" />
                </div>
                <div class="row justify-center" v-if="ShowEmailInd"
                  style="margin-left: 5px; margin-top: 10px; height: 15px">
                  <q-btn color="positive" icon="edit_note" @click="ReadEmail(1)" />
                </div>
                <!--   @input="DetieneVisibles(Trabajo.DetieneActividad)" -->
              </div>

              <div class="row q-gutter-md" style="margin-top: 0">
                <p class="text-left" style="width: 50%">
                  Se Debe Notificar al Usuario
                </p>
                <q-option-group v-model="Trabajo.NotificarUsuario" :options="options" color="primary" inline dense
                  :disable="OptionsDisabled" @input="NotificarVisibles(Trabajo.NotificarUsuario)" />
                <div class="row justify-center" v-if="EditNotificacion"
                  style="margin-left: 5px; margin-top: 10px; height: 15px">
                  <q-btn color="positive" icon="edit_note" @click="OpenNotificacion" :disable="OptionsDisabled" />
                </div>

                <div class="row justify-center" v-if="ShowEmailMas"
                  style="margin-left: 5px; margin-top: 10px; height: 15px">
                  <q-btn color="positive" icon="edit_note" @click="ReadEmail(2)" />
                </div>
                <!-- colocar de nuevo disabled  ----------------------------- -->
                <!-- -->
              </div>

              <div class="row q-gutter-md" style="margin-top: 0">
                <p class="text-left" style="width: 50%">
                  Anular Certificado de Calibración o informe de medidor
                </p>
                <q-option-group v-model="Trabajo.AnularDocumento" :options="options" color="primary" inline dense
                  @input="AnularDocumento(Trabajo.AnularDocumento)" :disable="OptionsDisabled" />
                <div class="row justify-center" v-if="InfoAnular"
                  style="margin-left: 5px; margin-top: 10px; height: 15px">
                  <q-btn color="positive" icon="edit_note" @click="RetomarAnulacion(1)" />
                </div>

                <div class="row justify-center" v-if="ShowAnular"
                  style="margin-left: 5px; margin-top: 10px; height: 15px">
                  <q-btn color="positive" icon="edit_note" @click="RetomarAnulacion(2)" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="row col-xs-12 col-sm-12 col-md-7 q-pt-sm q-gutter-sm">
          <q-card class="my-card col-xs-11 col-sm-6 col-md-6 q-pt-sm">
            <q-card-section>
              <div class="h5 text-center">
                EXPLIQUE LA ACCIÓN CORRECTORA QUE TOMO
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn style="width: 100%" label="Abrir" icon="edit_note" color="primary"
                @click="editor('ExpliqueAccion', Editar, leer)" :disabled="RAcciondiasable" />
            </q-card-actions>
          </q-card>

          <q-card class="col-xs-11 col-sm-5 col-md-5 q-pt-sm">
            <q-card-section>
              <div class="row justify-center q-gutter-md" style="margin-top: 0">
                <p class="h5 text-center">¿REQUIERE ACCIÓN CORRECTIVA?</p>
                <q-option-group v-model="Trabajo.RequiereAccionCorrectiva" :options="options" color="primary" inline
                  dense :disable="RAcciondiasableOption" @input="SaveOpt" />
              </div>
            </q-card-section>
          </q-card>

          <q-card class="my-card col-xs-11 col-sm-6 col-md-3 q-pt-sm">
            <q-card-section>
              <div class="h5 text-center">ACCIÓN A TOMAR</div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn style="width: 100%" label="Abrir" icon="edit_note" color="primary" :disabled="RAcciondiasable"
                @click="AccionVisibles" />
            </q-card-actions>
          </q-card>
          <div class="col-xs-8 col-sm-9 col-md-6 q-field--with-bottom">
            <q-select :disable="GeneralView" filled v-model="Trabajo.ResponsableAccion" map-options emit-value
              option-value="LoginUsuario" option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]"
              use-input hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Responsable de la Acción"
              @filter="filterFnUsuario" @blur="ValidarResponsables(1)">
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

          <q-btn class="col-xs-3 col-sm-2 col-md-2 q-pt-sm" style="height: 60px" label="evidencias" icon="folder_open"
            color="warning" @click="EvidenciaVisibles" :disabled="Evidenciadisable" v-if="ShowEvidence == true" />

          <q-btn class="col-xs-3 col-sm-2 col-md-2 q-pt-sm" style="height: 60px" label="evidencias" icon="folder_open"
            color="warning" @click="ShowEvidenceVisible = true" v-if="ShowEvidence == false" />

          <!-- volver a colocar -->
          <!--  :disabled="Evidenciadisable" -->
        </div>

        <q-card class="row justify-center items-center q-gutter-md col-xs-12 col-sm-5 col-md-4 q-pt-sm">
          <div class="row q-gutter-sm" style="margin-top: 0">
            <p class="h5 text-center" style="font-weight: bold">
              AUTORIZADO POR:
            </p>
            <div>
              <P class="text-center" style="margin-bottom: 0">
                {{ cc.Aprobo_contcambios }}</P>
              <p class="text-center">{{ cc.Cargoaprobo_contcambios }}</p>
            </div>
          </div>
        </q-card>

        <q-card class="col-xs-12 col-sm-3 col-md-3 q-pt-sm">
          <q-card-section>
            <div class="row justify-center q-gutter-md" style="margin-top: 0">
              <p class="h5 text-center">REANUDAR ACTIVIDAD</p>
              <div class="row items-center justify-center" style="margin-top: 0">
                <q-option-group v-model="Trabajo.ReanudarActividad" :options="options" color="primary" inline dense
                  @input="ReanudaActividad(Trabajo.ReanudarActividad)" :disable="ResumeActivity" />
                <!--  -->

                <div class="row justify-center items-center" v-if="EditEmailReanudar"
                  style="margin-left: 5px; margin-top: 0; padding-top: 0">
                  <q-btn color="positive" icon="edit_note" @click="EditEmail(3, 3)" />
                </div>
                <div class="row justify-center" v-if="ShowEmailReanudar" style="margin-left: 5px; margin-top: 10px">
                  <q-btn color="positive" icon="edit_note" @click="ReadEmail(3)" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="my-card col-xs-12 col-sm-3 col-md-3 q-pt-sm">
          <q-card-section>
            <div class="h5 text-center">SEGUIMIENTO DE ACCIÓN TOMADA</div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn style="width: 100%" label="Abrir" icon="edit_note" color="primary"
              @click="editor('SeguimientoAccion', Editar, leer)" :disabled="DesAccionTomada" />
          </q-card-actions>
        </q-card>

        <div class="col-xs-12 col-sm-7 col-md-4 q-field--with-bottom">
          <q-select :disable="GeneralView" filled v-model="Trabajo.ResponsableSeguimiento" map-options emit-value
            option-value="LoginUsuario" option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]" use-input
            hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Responsable de Seguimiento"
            @filter="filterFnUsuario" style="padding-top: 40px" @blur="ValidarResponsables(2)">
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
        <q-input class="col-xs-12 col-sm-4 col-md-2 q-pt-sm" stack-label label="Fecha Cierre" readonly disable
          v-model="Trabajo.FechaCierre" type="date" outlined style="padding-top: 4px" />
        <div class="col-xs-12 col-sm-12 col-md-4 q-field--with-bottom">
          <q-select :disable="GeneralView" filled v-model="Trabajo.LoginCierra" map-options emit-value
            option-value="LoginUsuario" option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]" use-input
            hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Cerrado por" @filter="filterFnUsuario"
            style="padding-top: 40px" @blur="ValidarResponsables(3)">
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

        <div class="col-xs-12 col-sm-12 col-md-5 q-gutter-sm">
          <q-btn label="Guardar" icon="save" color="positive" class="col-xs-12 col-sm-6 col-md-2 q-pt-sm"
            @click="AvisoVisible = true" v-if="BtnSaveGeneral" />
          <q-btn label="guardar Cambios" v-if="BtnSaveChange" @click="CreatorChanges" color="positive" icon="save"
            class="col-xs-12 col-sm-5 col-md-2 q-pt-sm" />
          <q-btn icon="save" @click="AvisoVisibleTwo = true" class="col-xs-12 col-sm-6 col-md-2 q-pt-sm"
            color="positive" label="guardar" v-if="BtnSaveAceptaTNC" />
          <q-btn label="regresar" icon="keyboard_return" color="negative" class="col-xs-12 col-sm-5 col-md-2 q-pt-sm"
            @click="ReturnView" />

          <q-btn label="Cerrar Trabajo" v-if="BtnCerrarTNC" icon="assignment_turned_in" color="positive"
            class="col-xs-12 col-sm-5 col-md-2 q-pt-sm" @click="CerrarTNC" />
          <!-- <q-btn
          label="Terminar"
          icon="pending_actions"
          color="positive"
          class="col-xs-12 col-sm-5 col-md-2 q-pt-sm"
        /> -->
        </div>
      </div>
    </q-page-container>
    <q-dialog v-model="GestionRiego" persistent>
      <div class="q-pa-md bg-white" style="width: 800px; max-width: none">
        <div class="row justify-end">
          <q-btn icon="close" flat color="red" v-close-popup size="20px" />
        </div>

        <q-carousel control-color="primary" animated v-model="slide" arrows infinite
          style="width: 750px; height: 450px; max-width: none">
          <q-carousel-slide :name="1" img-src="~assets/imagen1.png" />
          <q-carousel-slide :name="2" style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 450px;
            ">
            <img src="~assets/imagen2.png" style="max-width: 100%; max-height: 100%" />
          </q-carousel-slide>
          <!-- <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" /> -->
        </q-carousel>

        <!-- <q-img src="~assets/imagen1.png" /> -->
      </div>
    </q-dialog>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="width: 600px">
        <q-card-section>
          <div class="text-h6 text-center">{{ TitleEditor }}</div>
        </q-card-section>
        <div v-if="editores.editor2 == true" class="row justify-end" style="margin-right: 15px">
          <q-btn icon="visibility" label="Gestión de riesgo" color="primary" @click="GestionRiego = true" />
        </div>
        <q-card-section>
          <q-editor v-if="editores.editor1 == true" v-model="BoxText.DescripcionProblema" />
          <p v-if="editores.leer1 == true && Trabajo.DescripcionProblema" v-html="Trabajo.DescripcionProblema"></p>
          <p v-else-if="editores.leer1 == true">
            Aún no se ha registrado información
          </p>

          <q-editor v-if="editores.editor2 == true" v-model="BoxText.ValoracionImpacto" />
          <p v-if="editores.leer2 == true && Trabajo.ValoracionImpacto" v-html="Trabajo.ValoracionImpacto"></p>
          <p v-else-if="editores.leer2 == true">
            Aún no se ha registrado información
          </p>

          <q-editor v-if="editores.editor3 == true" v-model="BoxText.DesAccionCorrectiva" />
          <p v-if="editores.leer3 == true && Trabajo.DesAccionCorrectiva" v-html="Trabajo.DesAccionCorrectiva"></p>
          <p v-else-if="editores.leer3 == true">
            Aún no se ha registrado información
          </p>

          <q-editor v-if="editores.editor4 == true" v-model="BoxText.SeguimientoAccion" />
          <p v-if="editores.leer4 == true && Trabajo.SeguimientoAccion" v-html="Trabajo.SeguimientoAccion"></p>
          <p v-else-if="editores.leer4 == true">
            Aún no se ha registrado información
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="BtnBoxTextRead" label="continuar" color="positive" @click="handleOk" />
          <q-btn v-if="BtnBoxText" label="Cancelar" color="negative" v-close-popup @click="CancelInfo" />
          <q-btn v-if="BtnBoxText" label="Guardar" icon="save" color="positive" @click="SaveInfoBtn" />
          <q-btn v-if="BtnBoxText2" label="Cancelar" color="negative" v-close-popup @click="CancelInfo" />
          <q-btn v-if="BtnBoxText2" label="Guardar" icon="save" color="positive" @click="SaveInfoBtn2" />
          <q-btn v-if="BtnSeguimientoAccion" label="Cancelar" color="negative" v-close-popup @click="CancelInfo" />
          <q-btn v-if="BtnSeguimientoAccion" label="Guardar" icon="save" color="positive"
            @click="SaveSeguimientoAccion" />
          <q-btn v-if="BtnDesAccionCorrectiva" label="Cancelar" color="negative" v-close-popup @click="CancelInfo" />
          <q-btn v-if="BtnDesAccionCorrectiva" label="Guardars" icon="save" color="positive"
            @click="SaveDesAccionCorrectiva" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="AccionVisible" persistent class="col-xs-12 col-sm-12 col-md-5">
      <q-card v-if="CreateAccion" style="width: 600px; max-width: none">
        <q-card-section class="q-gutter-sm">
          <div class="text-h6 text-center">{{ TitleEditor }}</div>

          <div class="row justify-end q-gutter-sm">
            <q-btn label="Ver acciones" icon="visibility" color="primary" @click="ReadActions" />
            <q-btn label="Agregar Acción" @click="AddAction" icon="add_box" color="positive " />
          </div>
          <q-scroll-area style="height: 200px">
            <div class="q-pa-sm">
              <div v-for="(item, index) in Action" :key="index" class="q-gutter-sm">
                <div class="row q-gutter-sm">
                  <p class="row items-center justify-center col-xs-1 col-sm-1 col-md-1"
                    style="font-weight: bold; font-size: 1.5em; width: 20px">
                    {{ index + 1 }}
                  </p>

                  <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="datos[index]" type="text" autogrow filled />
                  <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" @click="RemoveAction(index)" />
                </div>
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="guardar" icon="save" color="positive" @click="ProcesarActions" />
        </q-card-actions>
      </q-card>

      <q-card v-if="ShowAccion" style="max-width: none; width: 800px">
        <q-card-section class="q-gutter-sm">
          <div class="text-h6 text-center text-weight-bolder">
            {{ TitleEditor }}
          </div>

          <q-scroll-area v-if="SinInfo.Evidencias" style="height: 300px">
            <div class="q-pa-sm" style="width: 700px">
              <div v-for="(item, index) in Acciones" :key="index" style="width: 100%" class="q-gutter-sm">
                <div class="row q-gutter-sm" style="width: 100%">
                  <p class="row justify-center col-xs-1 col-sm-1 col-md-1"
                    style="font-weight: bold; font-size: 1.5em; width: 20px">
                    {{ index + 1 }}
                  </p>

                  <div :class="[
                    'row',
                    'col-xs-5',
                    'col-sm-8',
                    BtnAcciones ? 'col-md-9' : 'col-md-8',
                  ]">
                    <q-input :class="['col-xs-8', 'col-sm-10', 'col-md-10']" v-if="item.editing" filled
                      v-model="item.DescripcionAccion" label="Descripción de la Acción" @blur="saveAction(item)"
                      @keyup.enter="saveAction(item)" />

                    <p v-else style="border-radius: 5px; padding: 3px; margin-bottom: 0"
                      class="bg-grey-3 col-xs-8 col-sm-12 col-md-12">
                      {{ item.DescripcionAccion }}
                    </p>
                    <p class="text-italic text-caption">
                      {{ item.NombreCrea }} - {{ item.CargoCrea }} -
                      {{ item.FechaCreacion }}
                    </p>
                  </div>

                  <div v-if="BtnAcciones" class="row q-gutter-xs col-xs-2 col-sm-2 col-md-2" style="margin-top: 0">
                    <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="save"
                      color="positive" @click="saveAction(item)" v-if="item.editing" />
                    <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="edit"
                      color="primary" @click="editAction(item)" v-if="!item.editing" />
                    <q-btn style="width: 40px; height: 40px" class="col-xs-4 col-sm-4 col-md-4" icon="delete"
                      color="red" @click="ProcesarEliminacion(item, index)" />
                  </div>
                </div>
              </div>
            </div>
          </q-scroll-area>

          <div v-if="SinInfo.Evidencias === false">
            <p class="text-center text-h6">SIN ACCIONES AÚN</p>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="BtnAcciones" label="regresar" color="primary" @click="ReturnActions" />
          <q-btn v-if="!BtnAcciones" label="continuar" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="EvidenciaVisible" persistent class="col-xs-12 col-sm-12 col-md-5">
      <q-card style="width: 600px">
        <q-card-section class="q-gutter-sm">
          <div class="text-h6 text-center">EVIDENCIAS</div>

          <q-scroll-area style="height: 200px">
            <div v-for="(item, index) in Action" :key="index" class="q-gutter-sm">
              <div class="row q-gutter-sm">
                <p class="row items-center justify-center col-xs-1 col-sm-1 col-md-1"
                  style="font-weight: bold; font-size: 1.5em; width: 20px">
                  {{ index + 1 }}
                </p>

                <q-file v-model="files[index]" label="Evidencias de Accion" use-chips filled multiple append
                  style="max-width: 300px" />
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn label="guardar" icon="save" color="positive" @click="SaveEvidence" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="AnularVisible" persistent class="col-xs-12 col-sm-12 col-md-5">
      <q-card style="width: 800px; max-width: none">
        <q-card-section>
          <p class="text-h6 text-center" v-if="ReadAnular == false">
            Anular Documento
          </p>
          <p class="text-h6 text-center" v-if="ReadAnular">
            Documentos Anulados
          </p>
          <q-btn v-if="AnularM" label="Anular documento" icon="add" color="positive" @click="AnularMore" />
        </q-card-section>
        <q-separator />

        <q-card-section v-if="ReadAnular == false" class="q-gutter-sm">
          <q-select filled v-model="Trabajo.TipoDocumento" :options="TipoDocumentos" label="Tipo documento"
            @input="ObtenerVigencias" />

          <!-- <q-select
            filled
            v-model="Documento"
            :options="Documentos"
            label="Documento"
          /> -->
          <q-input label="No. Orden Trabajo" v-if="Trabajo.TipoDocumento.value === 'Certificado'" filled type="number"
            v-model="Id_programacionorden" @keyup.enter="
              consultarFiltroEntregar(
                consultaGeneral,
                isEntregado,
                todasFechas,
                fechaIni,
                fechaFin
              )
              " />
          <q-scroll-area v-if="Trabajo.TipoDocumento.value === 'Certificado'" style="height: 200px">
            <div v-for="(item, index) in ListaCertificados" :key="index" class="q-gutter-sm">
              <div class="row q-gutter-sm">
                <p class="row justify-center col-xs-1 col-sm-1 col-md-1"
                  style="font-weight: bold; font-size: 1.5em; width: 20px"></p>

                <div class="row items-center">
                  <q-item-section class="row items-center" style="width: 50px">
                    <q-checkbox @input="
                      CambioCheckbox(item.IdCertificado, item.NCertificado)
                      " v-model="IdsAprobar" :val="item.IdCertificado">
                      <q-tooltip> Anular </q-tooltip>
                    </q-checkbox>
                    <q-icon class="" v-if="item.Aprobado === 1" color="green" name="cancel" size="1.9rem">
                      <q-tooltip> Anulado </q-tooltip>
                    </q-icon>
                  </q-item-section>
                  <p class="row items-center" style="margin-bottom: 0px">
                    <b>NCertificado: </b>&nbsp; &nbsp;{{ item.NCertificado }}
                  </p>
                </div>
              </div>
            </div>
          </q-scroll-area>

          <q-select v-if="Trabajo.TipoDocumento.value === 'Informes'" filled v-model="VigenciaInforme"
            :options="Vigencias" label="Vigencia" />

          <div v-if="Trabajo.TipoDocumento.value === 'Informes'" class="col-xs-12 col-sm-7 col-md-4">
            <q-select filled v-model="Trabajo.IdDocumento" map-options emit-value :option-value="(val) => ({
                IdDocumento: val.IdInforme,
                NDocumento: val.NInforme,
              })
              " option-label="NInforme" :options="ListaInformes" use-input hide-dropdown-icon hide-selected fill-input
              input-debounce="0" label="NInforme" @filter="filterFnInformes" style="padding-top: 5px"
              @blur="AddDocumentoAnular" @keyup.enter="AddDocumentoAnular">
              <template v-slot:prepend>
                <q-icon name="person" size="lg" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.NInforme" />
                    <q-item-label caption>IdInforme: {{ scope.opt.IdInforme }}
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

          <div>
            <q-chip v-for="(dato, index) in DocumentosAnular" removable
              @remove="removeDocumentoAnular(index, dato.TipoDocumento)" :key="index" class="q-mt-sm q-mr-sm">
              {{ dato.TipoDocumento }} - {{ dato.NDocumento }}
            </q-chip>
          </div>
        </q-card-section>

        <q-card-section class="row q-gutter-sm" v-if="ReadAnular">
          <div v-for="(item, index) in DocumentosAnular" :key="index" class="bg-grey-12"
            style="padding: 5px; border-radius: 5px">
            <div class="column items-center text-h6">
              <p style="margin: 0; padding: 1px">
                Tipo Documento:
                {{ item.TipoDocumento }}
              </p>
              <p style="margin: 0; padding: 1px">
                No. Documento:
                {{ item.NDocumento }}
              </p>
            </div>
          </div>
        </q-card-section>
        <q-card-actions v-if="ReadAnular">
          <q-btn label="continuar" color="positive" v-close-popup />
        </q-card-actions>

        <q-card-actions v-if="ReadAnular == false" align="right">
          <q-btn v-if="BtnSaveAnular2" label="Cancelar" color="negative" v-close-popup @click="CancelAnular(1)" />
          <q-btn v-if="BtnSaveAnular2" label="guardar" icon="save" color="positive" @click="SaveAnular(1)" />

          <q-btn v-if="BtnSaveAnular" label="regresar" color="negative" v-close-popup @click="CancelAnular(0)" />
          <q-btn v-if="BtnSaveAnular" label="guardar cambioss" icon="save" color="positive" @click="SaveAnular(2)" />

          <q-btn v-if="BtnAnularMore" label="regresar" color="negative" @click="CancelAnular(2)" />
          <q-btn v-if="BtnAnularMore" label="guardar cambiosm" icon="save" color="positive" @click="SaveAnular(3)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="NotificarVisible" persistent class="col-xs-12 col-sm-12 col-md-5">
      <q-card style="width: 700px; max-width: none" class="q-gutter-xs">
        <p class="text-h6 text-center text-weight-bolder">
          Notificación para Usuario
        </p>

        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <div class="col-2 text-left text-weight-bold">Para:</div>
            <div class="col-10">
              <q-chip v-for="(email, index) in PaqEmail.Emails" :key="index" removable @remove="removeEmailPaq(index)">
                {{ email }}
              </q-chip>
              <q-input v-model="emailInput" @keyup.enter="addEmail" @blur="addEmail" placeholder="Agregar destinatario"
                hide-bottom-space dense />
            </div>
          </div>
        </q-card-section>

        <q-card-section style="padding-top: 10px" class="q-gutter-xs">
          <q-input label="Asunto" filled autogrow v-model="PaqEmail.Asunto" />

          <q-editor v-model="PaqEmail.Mensaje" placeholder="Escribe tu mensaje aquí..." />

          <q-file v-model="PaqEmail.NotificacionFiles" use-chips label="Adjuntar archivos" multiple filled />
          <q-btn v-if="EmailOk == true" label="nuevo mensaje" icon="add" color="info" @click="AddEmailMasivo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="ReturnMensajes == false" label="cancelar" color="negative" v-close-popup
            @click="CancelarNotificacion" />
          <q-btn v-if="ReturnMensajes == true" label="Regresar" icon="keyboard_return" color="negative" v-close-popup />
          <q-btn v-if="EmailOk == true" label="Guardar correo" icon="save" color="positive" @click="OkEmail" />
          <q-btn v-if="EmailOk == false" label="guardar cambios" icon="save" color="positive"
            @click="SaveChange(1, IndexEdit, 'NOTIFICA')" />

          <!-- @click="SaveNotificacion" -->
          <!-- sendEmail
          Notificaciones -->
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="EditEmailVisible" persistent class="col-xs-12 col-sm-12 col-md-5">
      <q-card style="width: 900px; max-width: none" class="q-gutter-xs">
        <p class="text-h6 text-center">MENSAJES POR ENVIAR</p>
        <q-btn v-if="ShowEmail == false" label="Agregar Mensaje" icon="add" color="positive" @click="AddMensaje" />

        <q-card-section v-if="ShowEmail == true">
          <div v-for="(item, index) in EmailsMasivos" :key="index" class="q-gutter-none">
            <div @click="ShowEmailMasivo(index)" class="row items-center bg-grey-3 hover-shadow"
              style="cursor: pointer; border: 1px solid #b0b0b0ff">
              <p style="margin: 5px" class="row text-weight-bold items-center col-xs-11 col-sm-11 col-md-4 ellipsis">
                {{ item.EmailsTxt }}
              </p>
              <div class="row col-xs-11 col-sm-11 col-md-6">
                <p style="margin: 5px" class="row ellipsis">
                  <b>{{ item.Asunto }}</b>&nbsp; -
                </p>
                <p style="cursor: pointer; margin: 5px" class="row col-xs-11 col-sm-11 col-md-3 ellipsis">
                  {{ item.Mensaje }}
                </p>
              </div>

              <div class="col-xs-11 col-sm-11 col-md-1"></div>
              <!-- @click="GetEvidenceId(item.index) -->

              <!-- <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="datos[index]" type="text" autogrow filled />
                  <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" @click="RemoveAction(index)" /> -->
            </div>
          </div>
        </q-card-section>

        <q-card-section v-if="ShowEmail == false">
          <div v-for="(item, index) in EmailsMasivos" :key="index" class="q-gutter-none">
            <div @click="EditEmail(1, index)" class="row items-center bg-grey-3 hover-shadow"
              style="cursor: pointer; border: 1px solid #b0b0b0ff">
              <p style="margin: 5px" class="row text-weight-bold items-center col-xs-11 col-sm-11 col-md-4 ellipsis">
                {{ item.Emails[0] }}
              </p>
              <div class="row col-xs-11 col-sm-11 col-md-6">
                <p style="margin: 5px" class="row ellipsis">
                  <b>{{ item.Asunto }}</b>&nbsp; -
                </p>
                <p style="cursor: pointer; margin: 5px" class="row col-xs-11 col-sm-11 col-md-3 ellipsis">
                  {{ item.Mensaje }}
                </p>
              </div>

              <div class="col-xs-11 col-sm-11 col-md-1">
                <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" flat @click="removeEmail(index)" />
              </div>
              <!-- @click="GetEvidenceId(item.index) -->

              <!-- <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="datos[index]" type="text" autogrow filled />
                  <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" @click="RemoveAction(index)" /> -->
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <!-- @click="CancelarNotificacion"  -->

          <q-btn label="continuar" color="positive" v-if="ShowEmail == false" v-close-popup @click="Retornar" />
          <q-btn label="regresar" color="positive" v-if="ShowEmail == true" v-close-popup />
          <!-- @click="SaveNotificacion" -->
          <!-- sendEmail
          Notificaciones -->
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="DetenerVisible" persistent class="col-xs-12 col-sm-12 col-md-5">
      <q-card style="width: 600px" class="q-gutter-xs">
        <p class="text-h5 text-center text-weight-bolder">
          Informar a Usuarios
        </p>

        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <div class="col-2 text-left text-weight-bold">Para:</div>
            <div class="col-10">
              <q-chip v-for="(email, index) in PaqEmailDetener.Emails" :key="index" removable
                @remove="removeEmailD(index)">
                {{ email }}
              </q-chip>
              <q-input v-model="emailInput" @keyup.enter="addEmailD" @blur="addEmailD"
                placeholder="Agregar destinatario" hide-bottom-space dense />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-xs">
          <q-input label="Asunto" filled autogrow v-model="PaqEmailDetener.Asunto" />

          <q-editor v-model="PaqEmailDetener.Mensaje" placeholder="Escribe tu mensaje aquí..." />

          <q-file v-model="PaqEmailDetener.NotificacionFiles" use-chips label="Adjuntar archivos" multiple filled />
        </q-card-section>

        <q-card-actions v-if="BtnDetiene" align="right">
          <q-btn label="cancelar" v-if="EditEmailDetener == false" color="negative" v-close-popup @click="CancelarD" />
          <q-btn label="Guardar " v-if="EditEmailDetener == false" icon="save" color="positive" @click="SaveD" />
          <q-btn label="Regresar" v-if="EditEmailDetener == true" color="negative" v-close-popup />
          <q-btn label="Guardar cambios" v-if="EditEmailDetener == true" icon="save" color="positive"
            @click="SaveChange(2, 2, 'DETIENE')" />
          <!-- @click="SaveNotificacion"
           @click="OkDetener"
           @click="CancelarD"  -->
          <!-- sendEmail

   @click="SaveChange(2, 2)"
                // const TipoMensaje = 'DETIENE'
      // this.PaqEmailDetener.TipoMensaje.push(TipoMensaje)
          Notificaciones -->
        </q-card-actions>

        <q-card-actions v-if="BtnReanuda" align="right">
          <q-btn label="cancelar" v-if="!BtnReanudaEdit" color="negative" v-close-popup @click="CancelarT" />
          <q-btn label="Guardar" v-if="!BtnReanudaEdit" icon="save" color="positive" @click="SaveT" />
          <q-btn label="regresar" v-if="BtnReanudaEdit" v-close-popup color="negative" />
          <q-btn label="Guardar" v-if="BtnReanudaEdit" icon="save" color="positive"
            @click="SaveChange(3, 3, 'REANUDA')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="DescripcionVisible" persistent>
      <q-card style="width: 600px">
        <q-card-section>
          <div class="text-h5 text-center">Descripción Del Problema</div>
        </q-card-section>

        <q-card-section>
          <p>{{ Descripcion }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Ok" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="AvisoVisible" persistent>
      <q-card style="width: 600px">
        <q-card-section>
          <div class="text-h5 text-center">Verifica la Información</div>
        </q-card-section>

        <q-card-section>
          <p>
            Recuerde que mientras el TNC este curso usted podra modificar la
            información aquí consignada
          </p>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Continuar" color="positive" @click="ProcesarEnvios" />
          <!-- <q-btn label="correo" color="positive" @click="sendEmail(Emails, 9)" /> -->
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="AvisoVisibleTwo" persistent>
      <q-card style="width: 600px">
        <q-card-section>
          <div class="text-h5 text-center">Verifica la Información</div>
        </q-card-section>

        <q-card-section>
          <p>
            Ha marcado la opción "Acepta Trabajo No Conforme" como "NO". Una vez
            enviado este Trabajo No Conforme, se cerrará.
          </p>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Continuar" color="positive" @click="ProcesarEnvioNoAceptaTNC" />
          <!-- <q-btn label="correo" color="positive" @click="sendEmail(Emails, 9)" /> -->
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ShowEvidenceVisible" class="col-xs-12 col-sm-12 col-md-5" persistent>
      <q-card style="width: 800px">
        <q-card-section>
          <div class="text-h5 text-center text-weight-bolder">Evidencias</div>
        </q-card-section>

        <q-card-section>
          <div class="bg-white" style="
              width: 95% !important;
              max-width: none;
              min-height: none;
              height: 95%;
            ">
            <p v-if="SinInfo.Evidencias == true" class="text-weight-bold q-ma-none">
              Presione alguna de las acciones para ver sus evidencias
            </p>

            <q-scroll-area v-if="SinInfo.Evidencias" style="height: 300px">
              <div class="q-pa-sm">
                <div v-for="(item, index) in Acciones" :key="index" class="q-gutter-sm">
                  <div class="row q-gutter-sm">
                    <p class="row justify-center col-xs-1 col-sm-1 col-md-1"
                      style="font-weight: bold; font-size: 1.5em; width: 20px">
                      {{ index + 1 }}
                    </p>

                    <p style="cursor: pointer; border-radius: 5px; padding: 3px"
                      class="row items-center justify-center bg-grey-3 col-xs-11 col-sm-11 col-md-11"
                      @click="GetEvidenceId(item.IdAccion)">
                      {{ item.DescripcionAccion }}
                    </p>

                    <!-- <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="datos[index]" type="text" autogrow filled />
                  <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" @click="RemoveAction(index)" /> -->
                  </div>
                </div>
              </div>
            </q-scroll-area>

            <div v-if="SinInfo.Evidencias === false">
              <p class="text-center text-h6">SIN EVIDENCIAS AÚN</p>
            </div>
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

            <q-dialog v-model="dialogoAbierto" :content-css="{ width: '95%', height: '95%' }">
              <q-img :src="imagenSeleccionada" fit="" />
            </q-dialog>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="OK" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ShowEvidenceIndividualVisible" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center" style="padding: 16px 16px 0 16px">
            Evidencias
          </div>
        </q-card-section>

        <q-card-section>
          <q-scroll-area style="height: 400px">
            <div class="q-pa-sm q-gutter-sm">
              <q-btn v-if="AccionesResponsable" icon="add" label="agregar evidencia" @click="OpenModalArchivos()"
                color="positive" />
              <q-file ref="ArchivosVarios" multiple append v-model="FileSave" @input="CargarArchivos"
                style="display: none" />
              <!--   @input="handleFileInput" -->
              <div v-if="AccionesSeguimiento" class="row justify-end q-gutter-sm">
                <q-btn label="Aprobar todos" color="blue" @click="AprobarTodos" />
                <q-btn :disabled="IdsAprobar.length === 0" label="Aprobar" color="green" @click="Aprobar" />
              </div>
              <q-scroll-area style="height: 320px">
                <div>
                  <div v-if="Evidencias.length === 0" class="q-gutter-sm">
                    <p class="text-center" style="font-weight: bold; font-size: 1.5em">
                      Sin Evidencias Aún
                    </p>
                  </div>
                  <div v-else>
                    <div v-for="(item, index) in Evidencias" :key="index" class="q-gutter-sm">
                      <div class="row q-gutter-sm">
                        <p class="row justify-center col-xs-1 col-sm-1 col-md-1" style="
                            font-weight: bold;
                            font-size: 1.5em;
                            width: 20px;
                          "></p>

                        <div class="row items-center">
                          <p outlined multiple ellipsis style="max-width: 320px">
                            {{ item.Ruta }}
                          </p>
                          <q-btn icon="download" color="green" flat dense size="20px" @click="Descarga(item.Ruta)">
                            <q-tooltip> Descargar </q-tooltip>
                          </q-btn>
                          <q-btn v-if="AccionesResponsable" icon="publish" color="blue" flat dense size="20px"
                            @click="OpenModalArchivoIndividual(index)">
                            <q-tooltip> Remplazar </q-tooltip>
                          </q-btn>
                          <q-file :ref="'fileInputs' + index" v-model="File" style="display: none"
                            @input="UpdateArchivo(item.IdEvidencia)" />
                          <!--   @input="handleFileInput" -->
                          <q-btn v-if="AccionesResponsable" @click="ModalEvidencia(index, item)" icon="delete"
                            color="red" flat dense size="20px">
                            <q-tooltip> Eliminar </q-tooltip>
                          </q-btn>
                          <q-item-section class="row items-center" style="width: 50px">
                            <q-checkbox :disable="AprobarSeguimiento" v-if="item.Aprobado === 0" v-model="IdsAprobar"
                              :val="item.IdEvidencia">
                              <q-tooltip> Aprobar </q-tooltip>
                            </q-checkbox>
                            <q-icon class="" v-if="item.Aprobado === 1" color="green" name="check_circle" size="1.9rem">
                              <q-tooltip> Aprobado </q-tooltip>
                            </q-icon>
                          </q-item-section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Ok" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="ShowEmailIndividualVisible" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            Vizualizar Correo Notificación Usuario
          </div>
        </q-card-section>

        <q-card-section>
          <div v-if="SinInfo.Detiene">
            <div class="q-gutter-xs" v-for="(item, index) in EmailsP" :key="index">
              <p class="text-weight-bold" style="margin-bottom: 0; font-size: 1.34em">
                Correos
              </p>

              <div class="row bg-grey-4" style="border-radius: 4px; padding: 5px">
                <p>
                  {{ item.EmailsTxt }}
                </p>
              </div>
              <p class="text-weight-bold" style="margin-bottom: 0; font-size: 1.34em">
                Asunto
              </p>
              <p class="row bg-grey-4" style="border-radius: 4px; padding: 5px">
                {{ item.Asunto }}
              </p>
              <p class="text-weight-bold" style="margin-bottom: 0; font-size: 1.34em">
                Mensaje
              </p>
              <p class="row bg-grey-4" style="border-radius: 4px; padding: 5px">
                {{ item.Mensaje }}
              </p>
              <p class="text-weight-bold" style="margin-bottom: 0; font-size: 1.34em">
                Archivos
              </p>
              <div class="row q-gutter-xs">
                <p class="row bg-grey-4" style="padding: 5px; border-radius: 4px">
                  {{ item.ArchivosTxt }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="SinInfo.Detiene == false">
            <p>SIN CORREOS ENVIADOS</p>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Ok" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="DeleteAccionVisible" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            ¿Esta Seguro de eliminar la Acción?
          </div>
        </q-card-section>

        <q-card-section>
          <div>
            <p class="text-h6">
              Confirmar la eliminación de la acción, lo cual también eliminará
              sus evidencias.
            </p>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Confirmar" color="positive" @click="DeleteAccion(PaqAccion)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="ModalEvi" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            ¿Esta Seguro de eliminar la Evidencia?
          </div>
        </q-card-section>

        <q-card-section>
          <div>
            <p class="text-h6 text-center">
              Una vez eliminada la evidencia no podra ser recuperada.
            </p>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Confirmar" color="positive" @click="RemoveEvidencia(PaqEvidencia)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ArchivosVisible" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            Archivos a guardar
          </div>
          <q-btn label="agregar" icon="add" color="positive" @click="AddMoreFiles" />
          <q-file ref="AddArchivos" append multiple v-model="FileTem" style="display: none"
            @input="transferirArchivos" />  
        </q-card-section>

        <q-card-section>
          <q-scroll-area class="q-gutter-sm" style="height: 300px">
            <div class="q-gutter-sm" v-for="(item, index) in FileSave" :key="index">
              <div class="row">
                <p style="max-width: 600px; border-radius: 4px; padding: 5px" outlined ellipsis
                  class="bg-grey-4 col-xs-10 col-sm-10 col-md-10">
                  {{ item.name }}
                </p>
                <q-btn color="negative" style="width: 40px; height: 40px" class="col-xs-1 col-sm-1 col-md-1"
                  icon="delete" @click="RemoveFileSave(index)" />
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="guardar" color="positive" @click="GuardarEvidencias" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ModalCalidad" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            Modificar TNC
          </div>
        </q-card-section>

        <q-card-section>
          <p class="text-weight-bold">Modificar como:</p>
          <div class="q-gutter-xs">
            <q-btn label="Creador" color="secondary" @click="PermisosCalidad(1, IdTNC)" />
            <q-btn color="secondary" label="Responsable de acción" @click="PermisosCalidad(2, IdTNC, 'CALIACCION')" />
            <q-btn color="secondary" label="Responsable de Seguimiento"
              @click="PermisosCalidad(3, IdTNC, 'CALISEGUIMIENTO')" />
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="regresar" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ModalMultiple" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            Modificar TNC
          </div>
        </q-card-section>

        <q-card-section>
          <p class="text-weight-bold">ingresar como:</p>
          <div class="q-gutter-xs">
            <q-btn color="secondary" label="Creador" v-if="BtnCrea" @click="PermisosMultiple(1, IdTNC)" />
            <q-btn label="Responsable Acción" color="primary" v-if="BtnAccion" @click="PermisosMultiple(2, IdTNC)" />
            <q-btn color="secondary" label="Responsable de Seguimiento" v-if="BtnSeguimiento"
              @click="PermisosMultiple(3, IdTNC)" />
            <q-btn color="secondary" label="Responsable de cierre" v-if="BtnCierra"
              @click="PermisosMultiple(4, IdTNC)" />
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="regresar" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { api } from "boot/axios";
import { UrlServer } from "boot/server.js";
import utils from "../../commons/utils.js";
import { date, QSpinnerComment, QSpinnerGears, QSpinnerOval } from "quasar";
export default {
  data() {
    return {
      EmailsP: [],
      ImagenesXOrden: {},
      dialogoAbierto: false,
      imagenSeleccionada: "",
      File: null,
      FileSave: null,
      FileTem: null,
      BtnCalidad: false,
      //
      GeneralView: true,
      DetectadoView: false,
      datos: [],
      prueba: true,
      Evidenciadisable: true, //modificar a true
      RAcciondiasable: true, //modificar a true
      RAcciondiasableOption: true,
      dialogVisible: false,
      AccionVisible: false,
      EvidenciaVisible: false,
      ModalEvi: false,
      PaqEvidencia: [],
      ShowEvidence: false,
      ShowEvidenceVisible: false,
      ModalCalidad: false,
      ModalMultiple: false,
      ShowEvidenceIndividualVisible: false,
      ShowEmailIndividualVisible: false,
      ShowEmail: false,
      ShowEmailInd: false,
      ShowEmailReanudar: false,
      ShowEmailMas: false,
      IdsAprobar: [],
      AccionesSeguimiento: false,
      AccionesResponsable: false,
      AprobarSeguimiento: true,
      AnularVisible: false,
      NotificarVisible: false,
      EditEmailVisible: false,
      EditNotificacion: false,
      EditEmailDetener: false,
      EditEmailReanudar: false,
      DetenerVisible: false,
      ArchivosVisible: false,
      ResumeActivity: true,
      DescripcionVisible: false,
      AvisoVisible: false,
      AvisoVisibleTwo: false,
      DesAccionTomada: true,
      OptionsDisabled: true,
      OptionsDisabledM: true,
      OptionsDisabledMo: true,
      InfoAnular: false,
      ShowAnular: false,
      ReadAnular: false,
      AnularM: false,
      CreateAccion: false,
      ShowAccion: true,
      BtnSaveAnular: false,
      BtnSaveAnular2: false,
      BtnSaveAceptaTNC: false,
      BtnSaveGeneral: false,
      BtnSaveChange: false,
      BtnAnularMore: false,
      GestionRiego: false,
      BtnAcciones: false,
      BtnCerrarTNC: false,
      BtnReanuda: false,
      BtnReanudaEdit: false,
      BtnDetiene: false,
      slide: 1,
      Action: [0],
      IdAccion: "",
      IdTNC: "",
      Permiso: "",
      Evidencias: [],
      editorContent: "",
      Trabajo: {
        IdTNC: "",
        Detectado: "",
        DescripcionProblema: "",
        ValoracionImpacto: "",
        AceptaTNC: 1,
        AfectaResultadosPrevios: 0,
        DetieneActividad: 0,
        NotificarUsuario: 0,
        AnularDocumento: 0,
        TipoDocumento: "",
        IdDocumento: "",
        ID_CONTCAMBIOS: 0,
        DocumentosAnular: [],
        ResponsableAccion: "",
        ResponsableSeguimiento: "",
        FechaApertura: "",
        RequiereAccionCorrectiva: 0,
        ReanudarActividad: 0,
        LoginCrea: "",
        LoginCierra: "",
        Acciones: [],
      },

      Acciones: [],
      SinInfo: { Evidencias: false, Detiene: true },
      DocumentosAnular: [],
      TNC: {
        IdTNC: "",
        Detectado: "",
        DescripcionProblema: "",
        ValoracionImpacto: "",
        AceptaTNC: 0,
        AfectaResultadosPrevios: 0,
        DetieneActividad: 0,
        NotificarUsuario: 0,
        AnularDocumento: 0,
        TipoDocumento: "",
        ID_CONTCAMBIOS: 0,
        IdDocumento: "",
        DocumentosAnular: [],
        DocumentosAnularT: [],
        ResponsableAccion: "",
        ResponsableSeguimiento: "",
        FechaApertura: "",
        RequiereAccionCorrectiva: 0,
        LoginCrea: "",
        LoginCierra: "",
        Acciones: "",
      },
      EstadoEvidencias: false,
      mostrarse: false, // modificar a false
      FechaInicio: null,
      CerradoPor: null,
      options: [
        {
          label: "SI",
          value: 1,
        },
        {
          label: "NO",
          value: 0,
        },
      ],
      Vigencias: [],
      VigenciaCertificado: "",
      VigenciaInforme: "",
      TitleEditor: "",
      listaUsuarios: [],
      ListaCertificados: [],
      ListaInformes: [],
      editores: {
        editor1: false,
        editor2: false,
        editor3: false,
        editor4: false,
        leer1: false,
        leer2: false,
        leer3: false,
        leer4: false,
      },
      BoxText: {
        DescripcionProblema: "",
        ValoracionImpacto: "",
        DesAccionCorrectiva: "",
        AccionTomada: "",
        SeguimientoAccion: "",
      },
      BtnBoxText: false,
      BtnBoxText2: false,
      BtnBoxTextRead: false,
      BtnSeguimientoAccion: false,
      BtnDesAccionCorrectiva: false,
      BtnGestionRiesgo: false,
      BtnCrea: false,
      BtnCierra: false,
      BtnAccion: false,
      BtnSeguimiento: false,
      Editar: false,
      Lectura: false,
      files: [],
      TipoDocumento: "",
      Documento: "",
      TipoDocumentos: [
        { label: "Informe", value: "Informes" },
        { label: "Orden Trabajo", value: "Certificado" },
      ],

      Documentos: [
        { label: "Certificado1", value: "1" },
        { label: "Certificado2", value: "1" },
      ],
      lisMedidoresNoApto: [],
      emailInput: "",
      emails: [],
      Asunto: "",
      mensaje: "",
      NotificacionFiles: null,
      ListTNC: [],
      columnsTNC: [
        {
          name: "NTNC",
          label: "No. TNC",
          align: "center",
          field: "NTNC",
          sortable: true,
        },
        {
          name: "Detectado",
          align: "left",
          label: "Detectado Por",
          field: "Detectado",
          sortable: true,
        },
        {
          name: "Descripcion",
          label: "Descripcion Problema",
          field: "DescripcionProblema",
          sortable: true,
          align: "center",
        },
        {
          name: "ResponsableAccion",
          label: "Responsable Acción",
          field: "ResponsableAccion",
          sortable: true,
          align: "center",
        },
        {
          name: "Autorizado",
          label: "Autorizado por",
          field: "Autoriza",
          sortable: true,
          align: "center",
        },
        {
          name: "ResponsableSegumiento",
          label: "Responsable Seguimiento",
          field: "ResponsableSeguimiento",
          sortable: true,
          align: "center",
        },
        {
          name: "FechaCierra",
          label: "Fecha Cierre",
          field: "FechaCierre",
          sortable: true,
          align: "center",
        },
        {
          name: "Operaciones",
          label: "Operaciones",
          field: "Operaciones",
          required: true,
          sortable: true,
          align: "center",
        },
      ],
      vcTNC: ["Detectado", "Descripcion", "Operaciones"],
      Descripcion: null,
      cc: [],
      usuario: {},
      PaqAcciones: [],
      PaqAccion: "",
      PaqEmail: {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      },
      IndexEdit: 0,
      PaqEmailDetener: {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
        TipoMensaje: "",
      },
      Emails: {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      },
      EmailsReanudar: {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      },
      EmailsMasivos: [],
      ReturnMensajes: false,
      EmailOk: false,
      Id_programacionorden: "",
      Id_ordenentrada: "",
      todasFechas: true,
      isEntregado: true,
      fechaIni: "",
      fechaFin: "",
      consultaGeneral: "",
      DeleteAccionVisible: false,
    };
  },
  mounted() {
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
    utils.verificarUsuario(this.usuario.LoginUsuario, this);
    this.accesos = this.$q.localStorage.getItem("accesosSILAMED");
    this.Trabajo.FechaApertura = utils.fechaActual();
    this.mostrarNormaReferencia();
    this.GetTNC();
    this.fechaIni = utils.fechaActual();
    this.fechaFin = utils.fechaActual();
    this.OperacionesCalidad();
    // this.fechaFin = utils.fechaActual()
  },
  methods: {
    // permisos de dir calidad
    CreatorChanges() {
      var Changes = {
        Detectado: this.Trabajo.Detectado,
        ResponsableAccion: this.Trabajo.ResponsableAccion,
        ResponsableSeguimiento: this.Trabajo.ResponsableSeguimiento,
        LoginCierra: this.Trabajo.LoginCierra,
        IdTNC: this.IdTNC,
      };

      api
        .post("/medidor/SaveChanges", Changes)
        .then((response) => {
          this.Notificaciones(
            "Cambios guardados con exito",
            "positive",
            "bottom"
          );
          this.ReturnView();
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    OperacionesCalidad() {
      if (this.usuario.IdRol == "CALI") {
        this.BtnCalidad = true;
      }
    },
    VisibleBtn(IdTNC) {
      this.IdTNC = IdTNC;
      this.ModalCalidad = true;
    },
    PrintTNC(IdTNC) {
      console.log(this.ListTNC);
    },

    PermisosCalidad(Op, IdTNC, Permiso) {
      this.Permiso = Permiso;
      // Login == this.Trabajo.ResponsableAccion
      this.GetIdTNC(IdTNC, 2);
      this.ModalCalidad = false;
      this.ShowEmailInd = true;
      if (this.Trabajo.DetieneActividad > 0) {
        this.ShowEmailInd = true;
      } else {
        this.ShowEmailInd = false;
      }

      if (this.Trabajo.ReanudarActividad > 0) {
        this.ShowEmailReanudar = true;
      } else {
        this.ShowEmailReanudar = false;
      }

      if (this.Trabajo.NotificarUsuario > 0) {
        this.ShowEmailMas = true;
      } else if (this.Trabajo.NotificarUsuario == 0) {
        this.ShowEmailMas = false;
      }

      if (this.Trabajo.AnularDocumento > 0) {
        this.ShowAnular = true;
      } else if (this.Trabajo.AnularDocumento == 0) {
        this.ShowAnular = false;
      }

      if (Op == 2) {
        this.leer = true;
        this.Editar = false;
        this.RAcciondiasable = false;
        this.RAcciondiasableOption = false;
        this.DesAccionTomada = false;
        this.Evidenciadisable = false;
        this.CreateAccion = true;
        this.ShowAccion = false;
        this.AccionesSeguimiento = false;
        this.AccionesResponsable = true;
        this.AprobarSeguimiento = true;
        this.ReadAnular = true;
        this.AnularM = false;
        this.DetectadoView = true;
        this.BtnAcciones = true;
        this.ShowEvidence = false;
        this.BtnSaveGeneral = false;
      }
      // Login == this.Trabajo.ResponsableSeguimiento
      if (Op == 3) {
        this.ReadAnular = true;
        this.AnularM = false;
        this.AccionesSeguimiento = true;
        this.AccionesResponsable = false;
        this.AprobarSeguimiento = false;
        this.Evidenciadisable = false;
        this.RAcciondiasableOption = true;
        this.RAcciondiasable = false;
        this.leer = true;
        this.Editar = false;
        this.DesAccionTomada = false;
        (this.ShowEvidence = false), (this.ShowAccion = true);
        this.CreateAccion = false;
        this.GeneralView = true;
        this.BtnSeguimientoAccion = true;
        this.BtnBoxText = false;
        this.ShowEvidenceVisible = false;
        this.DetectadoView = true;
        this.BtnSaveGeneral = false;
      }
      // Login == this.Trabajo.LoginCierra
      if (Op == 1) {
        this.OptionsDisabled = true;
        this.OptionsDisabledM = true;
        this.OptionsDisabledMo = true;
        this.leer = false;
        this.Editar = true;
        this.BtnBoxText = true;
        this.GeneralView = false;
        this.ReadAnular = true;
        this.AnularM = true;
        this.BtnSaveAnular2 = false;
        this.BtnSaveAnular = false;
        this.BtnAnularMore = true;
        this.BtnSaveChange = true;
        this.BtnSaveGeneral = false;

        // if (this.Trabajo.DetieneActividad > 0) {
        if (this.Trabajo.DetieneActividad == 0) {
          this.ResumeActivity = true;
        } else if (this.Trabajo.DetieneActividad == 1) {
          this.ResumeActivity = false;
        }
        // this.Trabajo.RequiereAccionCorrectiva = 0

        // } else {
        //   this.ResumeActivity = true
        // }
      }
    },

    // ----------------------//
    CambioCheckbox(id, NDocumento) {
      if (this.IdsAprobar.includes(id)) {
        // Ejecuta cuando se desmarca
        this.Trabajo.IdDocumento = { IdDocumento: id, NDocumento: NDocumento };
        this.AddDocumentoAnular();
      } else {
        // Ejecuta cuando se marca
        this.removeIdOrdenTrabajo(id);
      }
    },
    removeIdOrdenTrabajo(id) {
      const index = this.DocumentosAnular.findIndex(
        (doc) => doc.IdDocumento === id
      );
      if (index !== -1) {
        this.DocumentosAnular.splice(index, 1);
      }
    },
    removeIdsAprobar(id) {
      if (this.IdsAprobar.length > 0) {
        const index = this.IdsAprobar.findIndex((doc) => doc === id);
        if (index !== -1) {
          this.IdsAprobar.splice(index, 1);
        }
      } else {
        this.Notificaciones("No hay evidencias a aprobar");
      }
    },
    RemoveMensaje(index) {
      this.EmailsMasivos.splice(index, 1);
    },
    removeDocumentoAnular(index, TipoDocumento) {
      if (TipoDocumento == "Certificado") {
        this.removeIdsAprobar(this.DocumentosAnular[index].IdDocumento);
      }
      this.removeIdOrdenTrabajo(this.DocumentosAnular[index].IdDocumento);

      // this.DocumentosAnular.splice(index, 1);
    },
    AddDocumentoAnular() {
      if (
        this.Trabajo.TipoDocumento &&
        this.Trabajo.TipoDocumento.value &&
        this.Trabajo.IdDocumento
      ) {
        // Verificar si el documento ya existe en DocumentosAnular
        const documentoExiste = this.DocumentosAnular.some(
          (doc) =>
            doc.TipoDocumento === this.Trabajo.TipoDocumento.value &&
            doc.IdDocumento === this.Trabajo.IdDocumento
        );

        if (documentoExiste) {
          this.Notificaciones(
            "El documento ya está en la lista de documentos a anular.",
            "warning",
            "bottom"
          );
        } else {
          this.DocumentosAnular.push({
            TipoDocumento: this.Trabajo.TipoDocumento.value,
            IdDocumento: this.Trabajo.IdDocumento.IdDocumento,
            NDocumento: this.Trabajo.IdDocumento.NDocumento,
          });
        }
      }

      this.Trabajo.IdDocumento = "";
    },
    ObtenerVigencias() {
      const TipoDoc = this.Trabajo.TipoDocumento.value;

      if (TipoDoc == "Certificado") {
        const Documento = "CERTIFICADO";

        api
          .get(`/certificado/ObtenerConsecutivo/${Documento}`)
          .then((response) => {
            this.Vigencias = response.data.map((item) => {
              return {
                label: item.PrefijoConsecutivo, // Ajusta 'someProperty' al nombre de la propiedad en response.data
                value: item.PrefijoConsecutivo, // Ajusta 'anotherProperty' al nombre de la propiedad en response.data
              };
            });
          })
          .catch((error) => {
            console.error("Tipo Identificacion - Fallo la conexion " + error);
          });
      } else if (TipoDoc == "Informes") {
        const Documento = "INFORME";

        api
          .get(`/certificado/ObtenerConsecutivo/${Documento}`)
          .then((response) => {
            this.Vigencias = response.data.map((item) => {
              return {
                label: item.PrefijoConsecutivo, // Ajusta 'someProperty' al nombre de la propiedad en response.data
                value: item.PrefijoConsecutivo, // Ajusta 'anotherProperty' al nombre de la propiedad en response.data
              };
            });
          })
          .catch((error) => {
            console.error("Tipo Identificacion - Fallo la conexion " + error);
          });
      }
    },
    AprobarEvidencias(Evidencias) {
      api
        .post("/medidor/AprobarEvidencias", Evidencias)
        .then((response) => {
          this.IdsAprobar = [];
          this.GetEvidenceId(this.IdAccion);
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },

    EstadoEvidenciaId(IdTNC) {
      api
        .post(`/medidor/GetAprobados/${IdTNC}`)
        .then((response) => {
          const Obj = response.data;
          this.EstadoEvidencias = Obj.EstadoEvidencias;
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    CerrarTNC() {
      this.EstadoEvidenciaId(this.Trabajo.IdTNC);
      // this.sendEmail(this.EmailsReanudar,this.Trabajo.IdTNC)
      if (this.EstadoEvidencias) {
        api
          .post(
            `/medidor/CloseTNC/${this.Trabajo.IdTNC}/${this.Trabajo.ReanudarActividad}`
          )
          .then((response) => {
            if (response.data) {
              this.sendEmail(this.EmailsReanudar, this.Trabajo.IdTNC);
              this.ReturnView();
              this.Notificaciones(
                "el trabajo no conforme ha sido cerrado",
                "positive",
                "bottom"
              );
            }
          })
          .catch((error) => {
            console.error("Tipo Identificacion - Fallo la conexion " + error);
          });
      } else {
        this.Notificaciones(
          "Sin acciones o evidencias no aprobadas",
          "warning",
          "bottom"
        );
      }
    },
    ReanudaActividad(Op) {
      if (Op == 1) {
        this.DetenerVisible = true;
        this.BtnReanuda = true;
        this.BtnDetiene = false;
      } else if (Op == 0) {
        this.EmailsReanudar = null;
        this.EditEmailReanudar = false;
        this.BtnReanudaEdit = false;
      }
      this.SaveOpt();
    },

    SaveOpt() {
      this.Trabajo.ReanudarActividad;
      this.Trabajo.RequiereAccionCorrectiva;
      api
        .post("/medidor/UpdateOpts/", this.Trabajo)
        .then((responde) => { })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    Aprobar() {
      const dataToSend = this.IdsAprobar.map((id) => {
        return {
          IdEvidencia: id,
          LoginAprueba: this.usuario.LoginUsuario,
        };
      });

      this.AprobarEvidencias(dataToSend);
    },
    AprobarTodos() {
      const evidenciasNoAprobadas = this.Evidencias.filter(
        (e) => e.Aprobado !== 1
      );
      if (evidenciasNoAprobadas.length === 0) {
        this.Notificaciones(
          "Todas las evidencias ya están aprobadas",
          "warning",
          "bottom"
        );
      } else {
        this.IdsAprobar = this.Evidencias.map((e) => e.IdEvidencia);
        const dataToSend = this.IdsAprobar.map((id) => {
          return {
            IdEvidencia: id,
            LoginAprueba: this.usuario.LoginUsuario,
          };
        });
        this.AprobarEvidencias(dataToSend);
      }
    },
    OpenModalArchivoIndividual(index) {
      const fileInputRef = this.$refs["fileInputs" + index];
      if (fileInputRef && fileInputRef[0]) {
        fileInputRef[0].$el.querySelector('input[type="file"]').click();
      }
    },
    OpenModalArchivos() {
      const fileInputRef = this.$refs["ArchivosVarios"];
      if (fileInputRef) {
        fileInputRef.$el.querySelector('input[type="file"]').click();
      }
    },
    AddMoreFiles() {
      const fileInputRef = this.$refs["AddArchivos"];
      if (fileInputRef) {
        fileInputRef.$el.querySelector('input[type="file"]').click();
      }
    },
    transferirArchivos() {
      for (let i = 0; i < this.FileTem.length; i++) {
        this.FileSave.push(this.FileTem[i]);
      }
      this.FileTem = null;
    },
    RemoveFileSave(index) {
      if (this.FileSave.length > 0) {
        this.FileSave.splice(index, 1);
      } else {
        this.Notificaciones(
          "No hay evidencias para eliminar",
          "warning",
          "bottom"
        );
      }
    },
    CargarArchivos() {
      this.ArchivosVisible = true;
    },
    UpdateArchivo(IdEvidencia) {
      const PaqEvidencia = { IdEvidencia: IdEvidencia, File: this.File };
      this.UpdateEvidence(PaqEvidencia);
    },
    UpdateEvidence(PaqEvidencia) {
      this.showLoading("procesando datos", QSpinnerOval);

      const formData = new FormData();
      formData.append(`IdEvidencia`, PaqEvidencia.IdEvidencia);
      formData.append("Evidencia", PaqEvidencia.File);

      api
        .post("/medidor/UpdateEvidencia/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data) {
            this.GetEvidenceId(this.IdAccion);
          }
          this.Notificaciones("Actualización exitosa", "positive", "bottom");
          this.$q.loading.hide();
        })
        .catch((error) => {
          // Manejar el error
          console.error("Error al subir archivos:", error);

          // Ocultar indicador de carga si es necesario
          this.$q.loading.hide();
        });
    },
    GuardarEvidencias() {
      if (this.FileSave.length == 0) {
        this.Notificaciones(
          "Sin evidencias para guardar",
          "negative",
          "bottom"
        );
      } else {
        const Login = this.usuario.LoginUsuario;
        const formData = new FormData();
        formData.append(`IdAccion`, this.IdAccion);
        if (this.FileSave !== null) {
          this.FileSave.forEach((file) => {
            formData.append("Evidencias", file);
          });
        }

        api
          .post("/medidor/InsertEvidencia/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data) {
              this.GetEvidenceId(this.IdAccion);
            }
            this.Notificaciones("Actualización exitosa", "positive", "bottom");
            this.$q.loading.hide();
            this.ArchivosVisible = false;
            this.FileSave = null;
          })
          .catch((error) => {
            // Manejar el error
            console.error("Error al subir archivos:", error);

            // Ocultar indicador de carga si es necesario
            this.$q.loading.hide();
          });
      }
    },
    ModalEvidencia(index, PaqEvidencia) {
      this.ModalEvi = true;
      this.PaqEvidencia = { index: index, PaqEvidencia: PaqEvidencia };
    },
    RemoveEvidencia(Evidencia) {
      this.showLoading("procesando datos", QSpinnerOval);
      const NombreArchivo = Evidencia.PaqEvidencia.Ruta;
      const IdEvidencia = Evidencia.PaqEvidencia.IdEvidencia;
      const Evidencias = { Ruta: NombreArchivo, IdEvidencia: IdEvidencia };
      api
        .post("/medidor/DeleteEvidencia/", Evidencias)
        .then((response) => {
          if (response.data) {
            this.GetEvidenceId(this.IdAccion);
            this.Notificaciones("Eliminación exitosa", "positive", "bottom");
            this.$q.loading.hide();
            this.FileSave = null;
            this.Evidencias.splice(Evidencia.index, 1);
            this.ModalEvi = false;
          }
        })
        .catch((error) => {
          // Manejar el error
          console.error("Error al subir archivos:", error);

          // Ocultar indicador de carga si es necesario
          this.$q.loading.hide();
        });
    },

    Descarga(Ruta) {
      try {
        if (!Ruta) {
          this.$q.notify({
            type: "negative",
            message: "La ruta del archivo no está definida.",
            position: "bottom-right",
          });
          return;
        }

        const a = document.createElement("a");
        a.href = UrlServer + "Evidencias/" + Ruta;
        a.target = "_blank";

        a.download = Ruta; // Nombre del archivo a descargar

        // Agregar el elemento <a> al DOM y simular clic para descargar
        document.body.appendChild(a);
        a.click();

        // Eliminar el elemento <a> del DOM después de la descarga
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        this.$q.notify({
          type: "negative",
          message: "Error al descargar el archivo: " + error.message,
          position: "bottom-right",
        });
      }
    },
    addEmail() {
      const email = this.emailInput.trim();
      if (email && this.isValidEmail(email)) {
        this.PaqEmail.Emails.push(email);
        this.emailInput = "";
      }
    },
    AddEmailMasivo() {
      if (
        this.PaqEmail.Emails === 0 ||
        !this.PaqEmail.Mensaje ||
        !this.PaqEmail.Asunto
      ) {
        this.Notificaciones(
          "Complete los campos para agregar nuevo mensaje",
          "warning",
          "bottom"
        );
      } else {
        this.EmailsMasivos.push({
          Emails: this.PaqEmail.Emails,
          Asunto: this.PaqEmail.Asunto,
          Mensaje: this.PaqEmail.Mensaje,
          NotificacionFiles: this.PaqEmail.NotificacionFiles,
        });
        this.PaqEmail = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
      }
    },
    AddMensaje() {
      this.NotificarVisible = true;
      this.ReturnMensajes = true;
      this.EmailOk = true;
      this.PaqEmail = {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      };
    },
    addEmailD() {
      const email = this.emailInput.trim();
      if (email && this.isValidEmail(email)) {
        this.PaqEmailDetener.Emails.push(email);
        this.emailInput = "";
      }
    },
    removeEmail(index) {
      this.EmailsMasivos.splice(index, 1);
    },
    removeEmailPaq(index) {
      this.PaqEmail.Emails.splice(index, 1);
    },
    removeEmailD(index) {
      this.PaqEmailDetener.Emails.splice(index, 1);
    },
    isValidEmail(email) {
      // Simple email validation
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(email);
    },
    sendEmail(Emails, IdTNC) {
      const formData = new FormData();
      formData.append("Emails", Emails.Emails); // Agregar cada correo electrónico al FormData.
      formData.append("Asunto", Emails.Asunto);
      formData.append("Mensaje", Emails.Mensaje);
      if (Emails.NotificacionFiles !== null) {
        Emails.NotificacionFiles.forEach((file) => {
          formData.append("Archivos", file);
        });
      }
      formData.append("LoginEnvia", this.usuario.LoginUsuario);

      return api
        .post(`/medidor/sendEmail/${IdTNC}/${Emails.TipoMensaje}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.Notificaciones(
            "Todos los correos electrónicos han sido enviados exitosamente.",
            "positive",
            "bottom-right"
          );
          return true;
        })
        .catch((error) => {
          console.error("Error al enviar correos:", error);
          this.Notificaciones(
            "Error al enviar correos",
            "negative",
            "bottom-right"
          );
          return false;
        });
    },
    viewDescription(Description) {
      this.DescripcionVisible = true;
      this.Descripcion = Description;
    },
    ReadEmail(Op) {
      if (Op == 1) {
        this.ShowEmailIndividualVisible = true;
        this.SetEmail(Op, "DETIENE");
      }

      if (Op == 2) {
        this.EditEmailVisible = true;
        this.SetEmail(Op, "NOTIFICA");
      }

      if (Op == 3) {
        this.EditEmailVisible = true;
        this.SetEmail(Op, "REANUDA");
      }
    },
    OpenNotificacion() {
      this.EditEmailVisible = true;
      // this.PaqEmail = this.Emails;
    },
    EditEmail(Op, index) {
      if (Op === 1) {
        this.PaqEmail = JSON.parse(JSON.stringify(this.EmailsMasivos[index]));
        this.PaqEmail.NotificacionFiles =
          this.EmailsMasivos[index].NotificacionFiles;
        this.NotificarVisible = true;
        this.EmailOk = false;
        this.IndexEdit = index;
      }

      if (Op == 2) {
        this.DetenerVisible = true;
        this.PaqEmailDetener = JSON.parse(JSON.stringify(this.Emails));
        this.PaqEmailDetener.NotificacionFiles = this.Emails.NotificacionFiles;
      }

      if (Op == 3) {
        this.DetenerVisible = true;
        this.PaqEmailDetener = JSON.parse(JSON.stringify(this.EmailsReanudar));
        this.PaqEmailDetener.NotificacionFiles = this.Emails.NotificacionFiles;
      }
    },
    ShowEmailMasivo(index) {
      this.EmailsP = [this.EmailsMasivos[index]];
      if (this.EmailsP[0].ArchivosTxt == null) {
        this.EmailsP[0].ArchivosTxt = "Sin Archivos enviados";
      }
      this.ShowEmailIndividualVisible = true;
    },
    SaveChange(Op, Index) {
      if (Op === 1) {
        this.EmailsMasivos[Index] = this.PaqEmail;
        this.PaqEmail = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.NotificarVisible = false;
        this.Notificaciones("Datos Guardados con éxito", "positive", "bottom");
      }

      if (Op === 2) {
        this.Emails = this.PaqEmailDetener;
        this.PaqEmailDetener = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.DetenerVisible = false;
        this.Notificaciones("Datos Guardados con éxito", "positive", "bottom");
      }

      if (Op === 3) {
        this.EmailsReanudar = this.PaqEmailDetener;
        this.PaqEmailDetener = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.DetenerVisible = false;
        this.Notificaciones("Datos Guardados con éxito", "positive", "bottom");
      }
    },
    DetieneVisibles() {
      if (this.Trabajo.DetieneActividad == 1) {
        this.DetenerVisible = true;
        this.BtnDetiene = true;
      }

      if (this.Trabajo.DetieneActividad === 0) {
        this.Emails = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.EditEmailDetener = false;
      }
    },
    NotificarVisibles(notificar) {
      if (notificar == 1) {
        this.NotificarVisible = true;
        this.EmailOk = true;
        this.ReturnMensajes = false;
      } else if (notificar == 0) {
        this.ReturnMensajes = false;
        this.PaqEmail = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };

        this.EditNotificacion = false;
        this.Emails = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.EmailsMasivos = [];
      }
    },
    AceptaTNC(Op) {
      if (Op == 0) {
        this.OptionsDisabled = true;
        this.OptionsDisabledM = false;
        this.OptionsDisabledMo = true;
        this.GeneralView = true;
        this.DetectadoView = false;
        (this.Trabajo.AfectaResultadosPrevios = 0),
          (this.Trabajo.DetieneActividad = 0),
          (this.Trabajo.NotificarUsuario = 0),
          (this.Trabajo.AnularDocumento = 0),
          (this.Trabajo.TipoDocumento = ""),
          (this.Trabajo.IdDocumento = ""),
          (this.Trabajo.DocumentosAnular = []),
          (this.Trabajo.ResponsableAccion = ""),
          (this.Trabajo.ResponsableSeguimiento = ""),
          (this.Trabajo.RequiereAccionCorrectiva = 0),
          (this.Trabajo.LoginCierra = ""),
          (this.Trabajo.Acciones = []);
        this.BtnSaveAceptaTNC = true;
        this.BtnSaveGeneral = false;
      }
      if (Op == 1) {
        this.OptionsDisabled = false;
        this.GeneralView = false;
        this.OptionsDisabledMo = false;
        this.OptionsDisabled = false;
        this.BtnSaveAceptaTNC = false;
        this.BtnSaveGeneral = true;
      }
    },
    CancelarD() {
      this.Trabajo.DetieneActividad = 0;
      this.PaqEmailDetener = {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      };
      this.emailInput = "";
    },
    SaveD() {
      if (
        this.PaqEmailDetener.Emails === 0 ||
        !this.PaqEmailDetener.Mensaje ||
        !this.PaqEmailDetener.Asunto
      ) {
        this.Notificaciones(
          "Debe haber al menos un mensaje para guardar",
          "negative",
          "bottom-right"
        );
      } else {
        this.DetenerVisible = false;
        this.PaqEmailDetener.TipoMensaje = "DETIENE";
        this.Emails = this.PaqEmailDetener;
        this.PaqEmailDetener = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.EditEmailDetener = true;
      }
    },
    CancelarT() {
      this.Trabajo.ReanudarActividad = 0;
      this.PaqEmailDetener = {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      };
      this.emailInput = "";
    },
    SaveT() {
      if (
        this.PaqEmailDetener.Emails === 0 ||
        !this.PaqEmailDetener.Mensaje ||
        !this.PaqEmailDetener.Asunto
      ) {
        this.Notificaciones(
          "Debe haber al menos un mensaje para guardar",
          "negative",
          "bottom-right"
        );
      } else {
        this.DetenerVisible = false;
        this.PaqEmailDetener.TipoMensaje = "REANUDA";
        this.EmailsReanudar = this.PaqEmailDetener;
        this.PaqEmailDetener = {
          Emails: [],
          Asunto: "",
          Mensaje: "",
          NotificacionFiles: null,
        };
        this.emailInput = "";
        this.EditEmailReanudar = true;
        this.BtnReanudaEdit = true;
      }
    },
    editD() { },
    CancelarNotificacion() {
      this.Trabajo.NotificarUsuario = 0;
      this.PaqEmail = {
        Emails: [],
        Asunto: "",
        Mensaje: "",
        NotificacionFiles: null,
      };
      this.emailInput = "";
    },
    Retornar() {
      if (this.EmailsMasivos.length === 0) {
        this.EditNotificacion = false;
        this.Trabajo.NotificarUsuario = 0;
      }
    },
    OkEmail() {
      if (
        (this.PaqEmail.Emails === 0 ||
          !this.PaqEmail.Mensaje ||
          !this.PaqEmail.Asunto) &&
        this.EmailsMasivos.length == 0
      ) {
        this.Notificaciones(
          "Debe haber al menos un mensaje para guardar",
          "negative",
          "bottom-right"
        );
      } else if (
        (this.PaqEmail.Emails === 0 ||
          !this.PaqEmail.Mensaje ||
          !this.PaqEmail.Asunto) &&
        this.EmailsMasivos.length > 0
      ) {
        this.Notificaciones("Datos Guardados", "positive", "bottom-right");
        this.NotificarVisible = false;
        // this.Emails = this.PaqEmail;
        this.EditNotificacion = true;
      } else if (
        (this.PaqEmail.Emails > 0 ||
          this.PaqEmail.Mensaje ||
          this.PaqEmail.Asunto) &&
        this.EmailsMasivos.length === 0
      ) {
        this.PaqEmail.TipoMensaje = "NOTIFICA";

        this.AddEmailMasivo();
        this.Notificaciones("Datos Guardados", "positive", "bottom-right");
        this.NotificarVisible = false;
        // this.Emails = this.PaqEmail;
        this.EditNotificacion = true;
      } else if (
        (this.PaqEmail.Emails > 0 ||
          this.PaqEmail.Mensaje ||
          this.PaqEmail.Asunto) &&
        this.EmailsMasivos.length > 0
      ) {
        this.PaqEmail.TipoMensaje = "NOTIFICA";
        this.AddEmailMasivo();
        this.Notificaciones("Datos Guardados", "positive", "bottom-right");
        this.NotificarVisible = false;
        // this.Emails = this.PaqEmail;
        this.EditNotificacion = true;
      }

      // this.EmailsMasivos.forEach(elemento => {
      //   this.sendEmail(elemento);
      // })
    },
    AnularDocumento(Anular) {
      if (Anular == 1) {
        this.AnularVisible = true;
      }
      if (Anular == 0) {
        this.BtnSaveAnular2 = false;
        this.InfoAnular = false;
        this.Trabajo.DocumentosAnular = [];
        //  this.Trabajo.AnularDocumento = 0;
        this.DocumentosAnular = [];
        this.Trabajo.TipoDocumento = "";
        this.VigenciaInforme = "";
        this.Id_programacionorden = "";
        this.ListaCertificados = [];
      }
    },
    CancelAnular(Op) {
      if (Op == 1) {
        this.Trabajo.DocumentosAnular = [];
        this.Trabajo.AnularDocumento = 0;
      }
      this.DocumentosAnular = [];
      this.Trabajo.TipoDocumento = "";
      this.VigenciaInforme = "";
      this.Id_programacionorden = "";
      this.ListaCertificados = [];
      if (Op == 2) {
        this.DocumentosAnular = this.Trabajo.DocumentosAnular;
        this.AnularM = true;
        this.ReadAnular = true;
      }
    },
    AnularMore() {
      this.AnularM = false;
      this.DocumentosAnular = [];
      this.ReadAnular = false;
      this.BtnSaveAnular = false;
      this.BtnAnularMore = true;
    },
    AddAnular() {
      const doc = this.DocumentosAnular;
      api
        .post(
          `/medidor/AddDocumentosAnulados/${this.Trabajo.IdTNC}/${this.Trabajo.LoginCrea}`,
          this.DocumentosAnular
        )
        .then((response) => {
          this.Notificaciones(
            "Se guardaron Cambios",
            "positive",
            "bottom-right"
          );
          this.Trabajo.DocumentosAnular.push(...this.DocumentosAnular);

          // this.DocumentosAnular = []
          this.Trabajo.TipoDocumento = "";
          this.VigenciaInforme = "";
          this.Id_programacionorden = "";
          this.ListaCertificados = [];
          this.IdsAprobar = [];
          this.DocumentosAnular = this.Trabajo.DocumentosAnular;
          this.AnularM = true;
          this.ReadAnular = true;
          // this.IdsAprobar = [];
          // this.GetEvidenceId(this.IdAccion);
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    SaveAnular(Op) {
      if (this.DocumentosAnular.length > 0 && Op == 1) {
        this.Trabajo.DocumentosAnular = this.DocumentosAnular;
        this.Notificaciones(
          "Se guardaron documentos a anular",
          "positive",
          "bottom-right"
        );
        this.BtnSaveAnular = true;
        this.AnularVisible = false;
        this.InfoAnular = true;
        this.DocumentosAnular = [];
        this.Trabajo.TipoDocumento = "";
        this.VigenciaInforme = "";
        this.Id_programacionorden = "";
        this.ListaCertificados = [];
      } else if (this.DocumentosAnular.length > 0 && Op == 2) {
        this.Trabajo.DocumentosAnular = this.DocumentosAnular;
        this.Notificaciones("Se guardaron Cambios", "positive", "bottom-right");
        this.AnularVisible = false;
        this.InfoAnular = true;
        this.DocumentosAnular = [];
        this.DocumentosAnular = [];
        this.Trabajo.TipoDocumento = "";
        this.VigenciaInforme = "";
        this.Id_programacionorden = "";
        this.ListaCertificados = [];
      } else if (this.DocumentosAnular.length == 0 && Op == 2) {
        this.CancelAnular(1);
        this.AnularVisible = false;
        this.BtnSaveAnular2 = true;
        this.InfoAnular = false;
      } else if (this.DocumentosAnular.length > 0 && Op == 3) {
        this.AddAnular();
      } else if (this.DocumentosAnular.length == 0) {
        this.Notificaciones(
          "No hay documentos por anular",
          "negative",
          "bottom-right"
        );
      }
    },
    RetomarAnulacion(Op) {
      if (Op == 1) {
        this.BtnSaveAnular = true;
        this.BtnSaveAnular2 = false;
        this.BtnAnularMore = false;
      }

      if (Op == 2) {
        this.BtnSaveAnular = true;
        this.BtnSaveAnular2 = false;
        this.BtnAnularMore = false;
      }
      this.AnularVisible = true;
      this.DocumentosAnular = JSON.parse(
        JSON.stringify(this.Trabajo.DocumentosAnular)
      );
    },
    EvidenciaVisibles() {
      this.EvidenciaVisible = true;
    },
    AccionVisibles() {
      this.TitleEditor = "ACCIÓN A TOMAR";
      this.AccionVisible = true;
    },
    AddAction() {
      this.Action.push({});
    },
    agregarAccionConEvidencias(nuevaAccion, nuevasEvidencias) {
      const nuevoPaquete = {
        Accion: nuevaAccion,
        Evidencias: nuevasEvidencias,
      };

      this.PaqAcciones.push(nuevoPaquete);
    },
    RemoveAction(index) {
      this.Action.splice(index, 1); // Elimina la acción en el índice especificado
      this.datos.splice(index, 1); // Elimina el dato correspondiente
      this.files.splice(index, 1);
    },

    openEvidence(IdTNC) {
      this.GetActionsId(IdTNC);
      this.ShowEvidenceVisible = true;
    },
    GetTNC() {
      api
        .get("/medidor/GetTNC")
        .then((response) => {
          this.ListTNC = response.data;
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    editor(expression, editar, leer) {
      switch (expression) {
        case "DescripcionProblema":
          this.TitleEditor = "DESCRIPCIÓN DEL PROBLEMA";
          this.editores.editor1 = editar;
          this.editores.leer1 = leer;
          this.BoxText.DescripcionProblema = JSON.parse(
            JSON.stringify(this.Trabajo.DescripcionProblema)
          );
          this.dialogVisible = true;
          if (editar) {
            (this.BtnBoxText = true),
              (this.BtnBoxText2 = false),
              (this.BtnBoxTextRead = false);
            this.BtnSeguimientoAccion = false;
            this.BtnDesAccionCorrectiva = false;
          }

          if (leer) {
            (this.BtnBoxText = false),
              (this.BtnBoxText2 = false),
              (this.BtnBoxTextRead = true);
            this.BtnDesAccionCorrectiva = false;
            this.BtnSeguimientoAccion = false;
          }

          break;
        case "ValoracionImpacto":
          this.TitleEditor = "VALORACIÓN DEL IMPACTO";
          this.editores.editor2 = editar;
          this.editores.leer2 = leer;
          this.BoxText.ValoracionImpacto = JSON.parse(
            JSON.stringify(this.Trabajo.ValoracionImpacto)
          );
          this.dialogVisible = true;
          if (editar) {
            (this.BtnBoxText = false),
              (this.BtnBoxText2 = true),
              (this.BtnBoxTextRead = false);
            this.BtnGestionRiesgo = false;
            this.BtnDesAccionCorrectiva = false;
            this.BtnSeguimientoAccion = false;
          }

          if (leer) {
            (this.BtnBoxText = false),
              (this.BtnBoxText2 = false),
              (this.BtnBoxTextRead = true);
            this.BtnDesAccionCorrectiva = false;
            this.BtnSeguimientoAccion = false;
          }
          break;
        case "ExpliqueAccion":
          this.TitleEditor = "EXPLIQUE LA ACCIÓN CORRECTORA QUE TOMO";
          if (
            (this.usuario.LoginUsuario === this.Trabajo.ResponsableAccion &&
              this.Trabajo.FechaCierre == "En Curso") ||
            this.Permiso == "CALIACCION"
          ) {
            this.editores.editor3 = true;
            this.editores.leer3 = false;
            this.BoxText.DesAccionCorrectiva = JSON.parse(
              JSON.stringify(this.Trabajo.DesAccionCorrectiva)
            );
            this.BtnBoxText = false;
            this.BtnBoxText2 = false;
            this.BtnBoxTextRead = false;
            this.BtnSeguimientoAccion = false;
            this.BtnDesAccionCorrectiva = true;
          } else {
            this.editores.editor3 = editar;
            this.editores.leer3 = leer;
            this.BtnBoxText = false;
            this.BtnBoxText2 = false;
            this.BtnBoxTextRead = true;
            this.BtnSeguimientoAccion = false;
            this.BtnDesAccionCorrectiva = false;
          }

          this.dialogVisible = true;
          break;

        case "SeguimientoAccion":
          this.TitleEditor = "SEGUIMIENTO DE ACCIÓN TOMADA";

          if (
            (this.usuario.LoginUsuario ===
              this.Trabajo.ResponsableSeguimiento &&
              this.Trabajo.FechaCierre == "En Curso") ||
            this.Permiso == "CALISEGUIMIENTO"
          ) {
            this.editores.editor4 = true;
            this.editores.leer4 = false;
            this.BoxText.SeguimientoAccion = JSON.parse(
              JSON.stringify(this.Trabajo.SeguimientoAccion)
            );
            (this.BtnBoxText = false),
              (this.BtnBoxText2 = false),
              (this.BtnSeguimientoAccion = true);
            this.BtnBoxTextRead = false;
          } else {
            this.editores.editor4 = editar;
            this.editores.leer4 = leer;
            (this.BtnBoxText = false),
              (this.BtnBoxText2 = false),
              (this.BtnBoxTextRead = true);
            this.BtnSeguimientoAccion = false;
            this.BtnDesAccionCorrectiva = false;
          }
          this.dialogVisible = true;
          break;
        default:
        // code block
      }
    },

    handleOk() {
      this.dialogVisible = false;
      this.editores = {
        editor1: false,
        editor2: false,
        editor3: false,
        editor4: false,
        leer1: false,
        leer2: false,
        leer3: false,
        leer4: false,
      };
    },
    handleCancel() {
      this.dialogVisible = false;
      this.editores = {
        editor1: false,
        editor2: false,
        editor3: false,
        editor4: false,
        leer1: false,
        leer2: false,
        leer3: false,
        leer4: false,
      };
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

    filterFnCertificados(val, update, abort) {
      if (val.length === 0) {
        abort();
        return;
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        api
          .get(
            `/certificado/CertificadosFiltro/${val}/${this.VigenciaCertificado.value}`
          )
          .then((response) => {
            update(() => {
              this.ListaCertificados = response.data;
              this.$q.loading.hide();
            });
          })
          .catch((error) => {
            utils.mensaje("Fallo la conexion " + error);
            this.$q.loading.hide();
          });
      }, 500);
    },
    filterFnInformes(val, update, abort) {
      if (val.length === 0) {
        abort();
        return;
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        api
          .get(
            `/certificado/InformesFiltro/${val}/${this.VigenciaInforme.value}`
          )
          .then((response) => {
            update(() => {
              this.ListaInformes = response.data;
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

    SaveEvidence() {
      // console.log("acciones", this.datos);
      // console.log("evidencias", this.files);

      const Login = this.usuario.LoginUsuario;

      // Validar que datos y archivos tengan la misma longitud
      if (this.datos.length !== this.files.length) {
        console.error("Número incorrecto de datos y archivos.");
        return;
      }

      // Crear una nueva instancia de FormData
      const formData = new FormData();

      // Agregar cada acción con sus respectivas evidencias a formData
      for (let i = 0; i < this.datos.length; i++) {
        const formData = new FormData();

        const files = this.files[i];
        formData.append(`IdTNC`, 1);
        formData.append(`LoginCrea`, Login);
        formData.append(`DescripcionAccion`, this.datos[i]);
        files.forEach((file) => {
          formData.append("Evidencias", file);
        });

        api
          .post("/medidor/InsertEvidencia/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            // Manejar la respuesta del servidor
            // Ocultar indicador de carga si es necesario
            // this.$q.loading.hide();
          })
          .catch((error) => {
            // Manejar el error
            console.error("Error al subir archivos:", error);

            // Ocultar indicador de carga si es necesario
            // this.$q.loading.hide();
          });
      }

      // Mostrar los datos que se enviarán
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ":", pair[1]);
      // }

      // Realizar la solicitud POST con Axios
    },
    SaveInfoBtn() {
      if (this.BoxText.DescripcionProblema == "") {
        this.Notificaciones(
          "Digité información antes de guardar",
          "warning",
          "bottom"
        );
      } else if (this.Trabajo.IdTNC == "") {
        this.dialogVisible = false;
        this.editores.editor1 = false;
        this.Trabajo.DescripcionProblema = this.BoxText.DescripcionProblema;
      } else {
        this.dialogVisible = false;
        this.editores.editor1 = false;
        this.Trabajo.DescripcionProblema = this.BoxText.DescripcionProblema;
        this.SentInfoText();
      }
    },
    SaveInfoBtn2() {
      if (this.BoxText.ValoracionImpacto == "") {
        this.Notificaciones(
          "Digité información antes de guardar",
          "warning",
          "bottom"
        );
      } else {
        this.dialogVisible = false;
        this.editores.editor2 = false;
        this.Trabajo.ValoracionImpacto = this.BoxText.ValoracionImpacto;
        this.SentInfoText();
      }
    },
    SaveSeguimientoAccion() {
      if (this.BoxText.SeguimientoAccion == "") {
        this.Notificaciones(
          "Digité información antes de guardar",
          "warning",
          "bottom"
        );
      } else {
        this.dialogVisible = false;
        this.editores.editor4 = false;
        this.Trabajo.SeguimientoAccion = this.BoxText.SeguimientoAccion;
        this.SentInfoText();
      }
    },
    SaveDesAccionCorrectiva() {
      if (this.BoxText.DesAccionCorrectiva == "") {
        this.Notificaciones(
          "Digité información antes de guardar",
          "warning",
          "bottom"
        );
      } else {
        this.dialogVisible = false;
        this.editores.editor3 = false;
        this.Trabajo.DesAccionCorrectiva = this.BoxText.DesAccionCorrectiva;
        this.SentInfoText();
      }
    },
    CancelInfo() {
      this.BoxText.ValoracionImpacto = "";
      this.BoxText.DescripcionProblema = "";
      this.BoxText.SeguimientoAccion = "";
      this.BoxText.DesAccionCorrectiva = "";
      this.dialogVisible = false;
      this.editores.editor1 = false;
      this.editores.editor2 = false;
      this.editores.editor3 = false;
      this.editores.editor4 = false;
    },
    SentInfoText() {
      const DescripcionProblema = this.Trabajo.DescripcionProblema;
      const ValoracionImpacto = this.Trabajo.ValoracionImpacto;
      const SeguimientoAccion = this.Trabajo.SeguimientoAccion;
      const DesAccionCorrectiva = this.Trabajo.DesAccionCorrectiva;
      const IdTNC = this.Trabajo.IdTNC;

      api
        .post("/medidor/ModifTxt/", this.Trabajo)
        .then((response) => {
          this.Notificaciones("Cambios Guardados", "positive", "bottom");
          this.dialogVisible = false;
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    mostrarNormaReferencia() {
      const self = this;
      self.$q.loading.show();
      api
        .get("/medidor/GetMedidoresNoAptos/")
        .then((response) => {
          self.lisMedidoresNoApto = response.data;
          // self.ordenEntradaD.Id_normaref = response.data[0].Id_normaref

          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Norma Referencia " + error);
          self.$q.loading.hide();
        });
    },
    FormatearFecha(Fecha) {
      const fecha = new Date(Fecha);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    ControlCambios() {
      api
        .get("/medidor/ControlCambiosTNC/")
        .then((response) => {
          this.cc = response.data;

          this.cc.Fechacreacion_contcambios = this.FormatearFecha(
            this.cc.Fechacreacion_contcambios
          );

          this.cc.Logo_contcambios = UrlServer + this.cc.Logo_contcambios;
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    GetContCambiosId(Id_contcambios) {
      api
        .post(`/medidor/GetControlCambios/${Id_contcambios}`)
        .then((response) => {
          this.cc = response.data;

          this.cc.Fechacreacion_contcambios = this.FormatearFecha(
            this.cc.Fechacreacion_contcambios
          );

          this.cc.Logo_contcambios = UrlServer + this.cc.Logo_contcambios;
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    ProcesarDatos() {
      this.TNC = this.Trabajo;
      this.TNC.ID_CONTCAMBIOS = this.cc.Id_contcambios;
      if (this.TNC) this.InsertTNC(this.TNC);
    },
    ProcesarEnvios() {
      this.showLoading("procesando datos", QSpinnerOval);

      const camposRequeridos = [
        {
          campo: this.Trabajo.Detectado,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.DescripcionProblema,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.ValoracionImpacto,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.ResponsableAccion,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.ResponsableSeguimiento,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.LoginCierra,
          mensaje: "Faltan Campos por completar",
        },
      ];

      const campoInvalido = camposRequeridos.find(
        (campo) => campo.campo === ""
      );

      if (campoInvalido) {
        this.Notificaciones(campoInvalido.mensaje, "negative", "bottom");
        this.$q.loading.hide();
      } else {
        this.Trabajo.FechaCierra = null;
        this.ProcesarDatos();
      }
    },

    ProcesarEnvioNoAceptaTNC() {
      this.showLoading("procesando datos", QSpinnerOval);

      const camposRequeridos = [
        {
          campo: this.Trabajo.Detectado,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.DescripcionProblema,
          mensaje: "Faltan Campos por completar",
        },
        {
          campo: this.Trabajo.ValoracionImpacto,
          mensaje: "Faltan Campos por completar",
        },
      ];

      const campoInvalido = camposRequeridos.find(
        (campo) => campo.campo === ""
      );

      if (campoInvalido) {
        this.Notificaciones(campoInvalido.mensaje, "negative", "bottom");
        this.$q.loading.hide();
      } else {
        this.Trabajo.ResponsableAccion = "NO ACEPTA TNC";
        this.Trabajo.ResponsableSeguimiento = "NO ACEPTA TNC";
        this.Trabajo.LoginCierra = this.usuario.LoginUsuario;
        this.Trabajo.FechaCierra = utils.fechaActual();
        this.ProcesarDatos();
      }
    },
    InsertTNC(tnc) {
      tnc.LoginCrea = this.usuario.LoginUsuario;

      api
        .post("/medidor/SetTNC/", tnc)
        .then((response) => {
          if (response.data > 0) {
            var IdTNC = response.data;

            if (this.Emails.Emails.length > 0) {
              this.showLoading("Enviando Correos", QSpinnerComment);
              this.sendEmail(this.Emails, IdTNC);
            }

            if (this.EmailsMasivos.length > 0) {
              this.showLoading("Enviando Correos", QSpinnerComment);
              for (const Emails of this.EmailsMasivos) {
                this.sendEmail(Emails, IdTNC);
              }
            }
            this.Notificaciones(
              "Trabajo No Conforme se guardo con exitó",
              "positive",
              "bottom"
            );
            this.$q.loading.hide();
            this.ReturnView();
          }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion:" + error);
          this.$q.loading.hide();
        });
    },
    Notificaciones(text, color, position) {
      this.$q.notify({
        type: color,
        message: `${text}`,
        position: position,
      });
    },

    showLoading(mensaje, TipoSpinner = QSpinnerComment) {
      this.$q.loading.show({
        spinner: TipoSpinner,
        spinnerColor: "red",
        message: `<span class="text-white text-weight-bold">${mensaje}</span><br/><span class="text-orange text-weight-bold">Procesando...</span>`,
      });
    },
    VerificarResponsabilidad(item, Op) {
      var Usuario =
        this.usuario.Persona.Nombre_persona +
        " " +
        this.usuario.Persona.Otrosnombres_persona +
        " " +
        this.usuario.Persona.Apellido1_persona +
        " " +
        this.usuario.Persona.Apellido2_persona;
      var incremento = 0;

      if (item.LoginCrea == Usuario) {
        this.BtnCrea = true;
        incremento++;
      }

      if (item.LoginCierra == Usuario) {
        this.BtnCierra = true;
        incremento++;
      }

      if (item.ResponsableAccion == Usuario) {
        this.BtnAccion = true;
        incremento++;
      }

      if (item.ResponsableSeguimiento == Usuario) {
        this.BtnSeguimiento = true;
        incremento++;
      }

      if (incremento >= 2 && item.FechaCierre == "En Curso") {
        this.ModalMultiple = true;
        this.IdTNC = item.IdTNC;
      } else {
        this.GetIdTNC(item.IdTNC, Op);
      }
    },
    PermisosMultiple(Op, IdTNC) {
      this.GetIdTNC(IdTNC, 0);
      if (Op == 1) {
        this.OptionsDisabled = true;
        this.OptionsDisabledM = true;
        this.OptionsDisabledMo = true;
        this.leer = false;
        this.Editar = true;
        this.BtnBoxText = true;
        this.GeneralView = false;
        this.ReadAnular = true;
        this.AnularM = true;
        this.BtnSaveAnular2 = false;
        this.BtnSaveAnular = false;
        this.BtnAnularMore = true;
        this.BtnSaveGeneral = false;
        this.BtnSaveChange = true;

        if (this.Trabajo.DetieneActividad == 0) {
          this.ResumeActivity = true;
        } else if (this.Trabajo.DetieneActividad == 1) {
          this.ResumeActivity = false;
        }
      }
      if (Op == 2) {
        this.leer = true;
        this.Editar = false;
        this.RAcciondiasable = false;
        this.RAcciondiasableOption = false;
        this.DesAccionTomada = false;
        this.Evidenciadisable = false;
        this.CreateAccion = true;
        this.ShowAccion = false;
        this.AccionesSeguimiento = false;
        this.AccionesResponsable = true;
        this.AprobarSeguimiento = true;
        this.ReadAnular = true;
        this.AnularM = false;
        this.DetectadoView = true;
        this.BtnAcciones = true;
        this.ShowEvidence = false;
        this.BtnSaveGeneral = false;
      }
      if (Op == 3) {
        this.ReadAnular = true;
        this.AnularM = false;
        this.AccionesSeguimiento = true;
        this.AccionesResponsable = false;
        this.AprobarSeguimiento = false;
        this.Evidenciadisable = false;
        this.RAcciondiasableOption = true;
        this.RAcciondiasable = false;
        this.leer = true;
        this.Editar = false;
        this.DesAccionTomada = false;
        (this.ShowEvidence = false), (this.ShowAccion = true);
        this.CreateAccion = false;
        this.GeneralView = true;
        this.BtnSeguimientoAccion = true;
        this.BtnBoxText = false;
        this.ShowEvidenceVisible = false;
        this.DetectadoView = true;
        this.BtnSaveGeneral = false;
      }

      if (Op == 4) {
        this.GeneralView = true;
        this.BtnAcciones = false;
        this.ReadAnular = true;
        this.ShowEmail = true;
        this.leer = true;
        this.Editar = false;
        this.DetectadoView = true;
        this.RAcciondiasable = false;
        // if (this.Trabajo.DetieneActividad > 0) {

        // this.Trabajo.RequiereAccionCorrectiva = 0

        // } else {
        //   this.ResumeActivity = true
        // }
        this.DesAccionTomada = false;
        this.Trabajo.FechaCierre = utils.fechaActual();
        this.ShowEvidence = false;
        this.Evidenciadisable = false;
        this.BtnCerrarTNC = true;
        this.BtnSaveGeneral = false;
      }
      this.ModalMultiple = false;
    },

    GetIdTNC(IdTNC, Op) {
      api
        .post(`/medidor/TNCModify/${IdTNC}`)
        .then((response) => {
          var TNC = response.data;
          TNC.IdDocumento = "";
          TNC.TipoDocumento = "";
          this.Trabajo = TNC;

          this.Trabajo.FechaApertura = this.FormatearFecha(
            this.Trabajo.FechaApertura
          );

          this.GetActionsId(this.Trabajo.IdTNC);
          this.GetContCambiosId(this.Trabajo.ID_CONTCAMBIOS);
          this.mostrarse = true;
          this.EstadoEvidenciaId(IdTNC);

          if (Op == 1) {
            this.ValidarPermisos();
          }
          if (Op == 0) {
            if (this.Trabajo.DetieneActividad > 0) {
              this.ShowEmailInd = true;
            } else {
              this.ShowEmailInd = false;
            }

            if (this.Trabajo.ReanudarActividad > 0) {
              this.ShowEmailReanudar = true;
            } else {
              this.ShowEmailReanudar = false;
            }

            if (this.Trabajo.NotificarUsuario > 0) {
              this.ShowEmailMas = true;
            } else if (this.Trabajo.NotificarUsuario == 0) {
              this.ShowEmailMas = false;
            }

            if (this.Trabajo.AnularDocumento > 0) {
              this.ShowAnular = true;
            } else if (this.Trabajo.AnularDocumento == 0) {
              this.ShowAnular = false;
            }

            if (this.Trabajo.DetieneActividad == 0) {
              this.ResumeActivity = true;
            } else if (this.Trabajo.DetieneActividad == 1) {
              this.ResumeActivity = false;
            }
          }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    GetActionsId(IdTNC) {
      api
        .post(`/medidor/GetActions/${IdTNC}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.Acciones = response.data;
            this.SinInfo.Evidencias = true;
          } else {
            this.SinInfo.Evidencias = false;
          }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    ClearAcciones() {
      this.Acciones = [];
    },

    ProcesarActions() {
      // this.handleOk();

      if (this.Action.length === 0) {
        this.Notificaciones(
          "Sin Acciones para registrar",
          "negative",
          "bottom"
        );
      } else {
        let camposVacios = false;

        // Iterar sobre cada entrada para verificar campos vacíos
        this.Action.forEach((action, index) => {
          if (!this.datos[index]) {
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

          const PaqAcciones = {
            AccionesTxt: this.datos,
            IdTNC: this.Trabajo.IdTNC,
            LoginCrea: this.Trabajo.ResponsableAccion,
          };

          this.SetActions(PaqAcciones);
          this.datos = [];
          this.Action = [0];
        }
      }
    },
    editAction(item) {
      this.$set(item, "editing", true);
    },
    saveAction(item) {
      this.$set(item, "editing", false);

      this.UpdateAction(item);
      // Aquí puedes agregar la lógica para guardar los cambios si es necesario
    },
    ProcesarEliminacion(PaqAccion, indexs) {
      // console.log(IdAction)
      if (PaqAccion.CountEvidence > 0) {
        this.DeleteAccionVisible = true;
        this.PaqAccion = PaqAccion;
      } else {
        this.Acciones.splice(indexs, 1);
        this.DeleteAccion(PaqAccion);
      }
    },
    DeleteAccion(PaqAccion) {
      api
        .post("/medidor/DeleteAccion/", PaqAccion)
        .then((response) => {
          if (response.data) {
            this.DeleteAccionVisible = false;
          }
          this.GetActionsId(this.Trabajo.IdTNC);
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    UpdateAction(PaqAccion) {
      api
        .post("/medidor/UpdateAccion/", PaqAccion)
        .then((response) => {
          if (response.data) {
            this.GetActionsId(this.Trabajo.IdTNC);
          }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    SetActions(PaqAcciones) {
      api
        .post("/medidor/InsertAcciones/", PaqAcciones)
        .then((response) => {
          if (response.data) {
            this.GetActionsId(this.Trabajo.IdTNC);
            this.Notificaciones("Acciones guardas", "positive", "bottom");
          }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    ReadActions() {
      this.GetActionsId(this.Trabajo.IdTNC);
      this.CreateAccion = false;
      this.ShowAccion = true;
    },
    ReturnActions() {
      this.CreateAccion = true;
      this.ShowAccion = false;
    },
    GetEvidenceId(IdAccion) {
      this.IdAccion = IdAccion;
      api
        .post(`/medidor/GetEvidencias/${IdAccion}`)
        .then((response) => {
          this.Evidencias = response.data;
          // for (let i = 0; i < this.Evidencias.length; i++) {
          //   this.Evidencias[i].Ruta = UrlServer + this.Evidencias[i].Ruta;
          // }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });

      this.ShowEvidenceIndividualVisible = true;
    },
    GetCorreos(IdTNC, Tipo) {
      api
        .get(`/medidor/ObtenerCorreos/${IdTNC}/${Tipo}`)
        .then((response) => {
          if (Tipo === "DETIENE") {
            this.EmailsP = [response.data];
          }

          if (Tipo === "NOTIFICA") {
            this.EmailsMasivos = response.data;
          }

          // for (let i = 0; i < this.EmailsP.length; i++) {
          //   this.this.EmailsP[i].ArchivosTxt)
          //   this.EmailsP[i].ArchivoTxt = [this.EmailsP[i].ArchivoTxt.split('/')];
          // }

          //     for (let i = 0; i < this.EmailsP.length; i++) {
          // // Asegurarse de que la propiedad `ArchivoTxt` exista y sea un string

          //   this.EmailsP[i] = {
          //     original: this.EmailsP[i],
          //     ArchivosTxt: this.EmailsP[i].split('/')
          //   };
          // }

          // Imprimir el resultado en la consola
          // console.log(this.EmailsP);
          // this.Evidencias = response.data;
          // for (let i = 0; i < this.Evidencias.length; i++) {
          //   this.Evidencias[i].Ruta = UrlServer + this.Evidencias[i].Ruta;
          // }
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion " + error);
          this.$q.loading.hide();
        });
    },
    SetEmail(Op, Tipo) {
      Op == 1 ? this.GetCorreos(this.Trabajo.IdTNC, Tipo) : "";

      Op == 2 ? this.GetCorreos(this.Trabajo.IdTNC, Tipo) : "";

      Op == 3 ? this.GetCorreos(this.Trabajo.IdTNC, Tipo) : "";
    },
    ValidarPermisos() {
      const loginVista = this.usuario.LoginUsuario;
      if (this.Trabajo.DetieneActividad > 0) {
        this.ShowEmailInd = true;
      } else {
        this.ShowEmailInd = false;
      }

      if (this.Trabajo.ReanudarActividad > 0) {
        this.ShowEmailReanudar = true;
      } else {
        this.ShowEmailReanudar = false;
      }

      if (this.Trabajo.NotificarUsuario > 0) {
        this.ShowEmailMas = true;
      } else if (this.Trabajo.NotificarUsuario == 0) {
        this.ShowEmailMas = false;
      }

      if (this.Trabajo.AnularDocumento > 0) {
        this.ShowAnular = true;
      } else if (this.Trabajo.AnularDocumento == 0) {
        this.ShowAnular = false;
      }

      // if (loginVista === this.Trabajo.LoginCrea) {
      //   if (this.Trabajo.FechaCierre != "En Curso") {
      //     this.VistaGeneral();
      //   }
      // }
      if (
        loginVista === this.Trabajo.ResponsableAccion ||
        loginVista === this.Trabajo.ResponsableSeguimiento ||
        loginVista === this.Trabajo.LoginCierra ||
        loginVista == this.Trabajo.LoginCrea
      ) {
        if (this.Trabajo.FechaCierre != "En Curso") {
          this.VistaGeneral();
        } else {
          this.PermisoAsignados(loginVista);
        }
      } else {
        this.VistaGeneral();
      }
    },

    // funciones para primera vista
    PermisoCreador() {
      this.OptionsDisabled = true;
      this.OptionsDisabledM = true;
      this.OptionsDisabledMo = true;
      this.leer = false;
      this.Editar = true;
      this.BtnBoxText = true;
      this.GeneralView = false;
      this.ReadAnular = true;
      this.AnularM = true;
      this.BtnSaveAnular2 = false;
      this.BtnSaveAnular = false;
      this.BtnAnularMore = true;
      this.BtnSaveGeneral = false;
    },
    PermisoAsignados(Login) {
      if (Login == this.Trabajo.ResponsableAccion) {
        this.leer = true;
        this.Editar = false;
        this.RAcciondiasable = false;
        this.RAcciondiasableOption = false;
        this.DesAccionTomada = false;
        this.Evidenciadisable = false;
        this.CreateAccion = true;
        this.ShowAccion = false;
        this.AccionesSeguimiento = false;
        this.AccionesResponsable = true;
        this.AprobarSeguimiento = true;
        this.ReadAnular = true;
        this.AnularM = false;
        this.DetectadoView = true;
        this.BtnAcciones = true;
        this.ShowEvidence = false;
        this.BtnSaveGeneral = false;
      }
      if (Login == this.Trabajo.ResponsableSeguimiento) {
        // this.ResumeActivity = false
        this.ReadAnular = true;
        this.AnularM = false;
        this.AccionesSeguimiento = true;
        this.AccionesResponsable = false;
        this.AprobarSeguimiento = false;
        this.Evidenciadisable = false;
        this.RAcciondiasableOption = true;
        this.RAcciondiasable = false;
        this.leer = true;
        this.Editar = false;
        this.DesAccionTomada = false;
        (this.ShowEvidence = false), (this.ShowAccion = true);
        this.CreateAccion = false;
        this.GeneralView = true;
        this.BtnSeguimientoAccion = true;
        this.BtnBoxText = false;
        this.ShowEvidenceVisible = false;
        this.DetectadoView = true;
        this.BtnSaveGeneral = false;
      }

      if (Login == this.Trabajo.LoginCierra) {
        this.GeneralView = true;
        this.BtnAcciones = false;
        this.ReadAnular = true;
        this.ShowEmail = true;
        this.leer = true;
        this.Editar = false;
        this.DetectadoView = true;
        this.RAcciondiasable = false;

        // if (this.Trabajo.DetieneActividad > 0) {
        if (this.Trabajo.DetieneActividad == 0) {
          this.ResumeActivity = true;
        } else if (this.Trabajo.DetieneActividad == 1) {
          this.ResumeActivity = false;
        }
        // this.Trabajo.RequiereAccionCorrectiva = 0

        // } else {
        //   this.ResumeActivity = true
        // }

        this.DesAccionTomada = false;
        this.Trabajo.FechaCierre = utils.fechaActual();
        this.ShowEvidence = false;
        this.Evidenciadisable = false;
        this.BtnCerrarTNC = true;
        this.BtnSaveGeneral = false;
      }
      if (Login == this.Trabajo.LoginCrea) {
        this.PermisoCreador();
      }
    },
    VistaGeneral() {
      this.BtnSaveGeneral = false;
      this.ReadAnular = true;
      this.ShowEmail = true;
      this.DesAccionTomada = false;
      this.leer = true;
      this.Editar = false;
      this.GeneralView = true;
      this.RAcciondiasable = false;
      this.RAcciondiasableOption = true;
      this.OptionsDisabled = true;
      this.Evidenciadisable = false;
      this.ShowEvidence = false;
      this.DetectadoView = true;
      this.BtnAcciones = false;
      this.EditEmailReanudar = false;
      this.ShowEmailInd = false;
    },
    CreateTNC() {
      this.DetectadoView = false;
      (this.BtnSaveGeneral = true), this.ControlCambios();
      this.OptionsDisabledM = false;
      this.OptionsDisabledMo = false;
      this.ReadAnular = false;
      this.ShowEmail = false;
      this.ResumeActivity = true;
      this.DesAccionTomada = true;
      this.mostrarse = true;
      this.RAcciondiasable = true;
      this.RAcciondiasableOption = true;
      this.leer = false;
      this.Editar = true;
      this.GeneralView = false;
      this.BtnSaveAnular2 = true;
      this.BtnSaveAnular = false;
      this.BtnAnularMore = false;
      this.OptionsDisabled = false;
      this.Evidenciadisable = true;
      this.Trabajo.FechaCierre = utils.fechaActual();
      this.Trabajo.FechaApertura = utils.fechaActual();
    },
    ReturnView() {
      this.GetTNC();
      this.mostrarse = false;
      this.BtnCerrarTNC = false;
      this.Trabajo = {
        IdTNC: "",
        Detectado: "",
        DescripcionProblema: "",
        ValoracionImpacto: "",
        AceptaTNC: 1,
        AfectaResultadosPrevios: 0,
        DetieneActividad: 0,
        NotificarUsuario: 0,
        AnularDocumento: 0,
        TipoDocumento: "",
        IdDocumento: "",
        ID_CONTCAMBIOS: 0,
        DocumentosAnular: [],
        ResponsableAccion: "",
        ResponsableSeguimiento: "",
        FechaApertura: "",
        RequiereAccionCorrectiva: 0,
        LoginCrea: "",
        LoginCierra: "",
        Acciones: [],
        ReanudarActividad: 0,
      };

      this.EditEmailReanudar = false;
      this.EditNotificacion = false;
      this.ShowEmailMas = false;
      this.EditEmailDetener = false;
      this.ShowEmailInd = false;
      this.InfoAnular = false;
      this.ShowAnular = false;
      this.IdsAprobar = [];
      this.DocumentosAnular = [];
      this.AvisoVisible = false;
      this.AvisoVisibleTwo = false;
      (this.BtnSaveGeneral = true), (this.BtnSaveChange = false);
      this.BtnSaveAceptaTNC = false;
      this.BtnCrea = false;
      this.BtnCierra = false;
      this.BtnAccion = false;
      this.BtnSeguimiento = false;
      this.ResumeActivity = true;
      this.EmailsP = [];
    },
    consultarFiltroEntregar(
      consultaGeneral,
      isEntregado,
      todasFechas,
      fechaIni,
      fechaFin
    ) {
      const self = this;
      let Certificado = true;
      let Informe = false;
      let consulta = "-1";
      let todasLasFechas = 0;
      let isEntregadoCertificado = 0;
      let ioe = -1;
      let ipo = -1;
      self.SelectedCertificados = [];
      const Login = null;
      self.$q.loading.show();
      if (consultaGeneral !== "") {
        consulta = consultaGeneral;
      }
      if (todasFechas === true) {
        todasLasFechas = 1;
      }
      if (isEntregado === true) {
        isEntregadoCertificado = 1;
      }
      if (this.Id_ordenentrada === null || this.Id_ordenentrada === "") {
        ioe = -1;
      } else {
        ioe = this.Id_ordenentrada;
      }
      if (
        this.Id_programacionorden === null ||
        this.Id_programacionorden === ""
      ) {
        ipo = -1;
      } else {
        ipo = this.Id_programacionorden;
      }
      api
        .get(
          `/certificado/mostrarMedidoresEntregadosFechas/${consulta}/${isEntregadoCertificado}/${todasLasFechas}/${fechaIni}/${fechaFin}/${ioe}/${ipo}/${Login}/${Certificado}/${Informe}`
        )
        .then((response) => {
          self.ListaCertificados = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - LisCalibraciones " + error);
          self.$q.loading.hide();
        });
    },
    ValidarResponsables(Op) {
      if (Op == 1 && this.Trabajo.ResponsableAccion != "") {
        if (
          this.Trabajo.ResponsableAccion == this.Trabajo.ResponsableSeguimiento
        ) {
          this.Notificaciones(
            "No puede asingar a la misma persona esta responsabilidad",
            "warning",
            "bottom"
          );
          this.Trabajo.ResponsableAccion = "";
        } else if (this.Trabajo.ResponsableAccion == this.Trabajo.LoginCierra) {
          this.Notificaciones(
            "No puede asingar a la misma persona esta responsabilidad",
            "warning",
            "bottom"
          );
          this.Trabajo.ResponsableAccion = "";
        }
      }
      if (Op == 2 && this.Trabajo.ResponsableSeguimiento != "") {
        if (
          this.Trabajo.ResponsableSeguimiento == this.Trabajo.ResponsableAccion
        ) {
          this.Notificaciones(
            "No puede asingar a la misma persona esta responsabilidad",
            "warning",
            "bottom"
          );
          this.Trabajo.ResponsableSeguimiento = "";
        }
      }

      if (Op == 3 && this.Trabajo.LoginCierra != "") {
        if (this.Trabajo.LoginCierra == this.Trabajo.ResponsableAccion) {
          this.Notificaciones(
            "No puede asingar a la misma persona esta responsabilidad",
            "warning",
            "bottom"
          );
          this.Trabajo.LoginCierra = "";
        }
      }
    },
  },
};
</script>
<style>
.q-table>thead>tr {
  background: #d1d1d1;
  color: #000;
  position: sticky;
  top: 0;
  z-index: 2;
}

.hover-shadow {
  z-index: 1;
  transition: box-shadow 0.5s;
}

.hover-shadow:hover {
  border: 1px solid #787878ff !important;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.3);
}
</style>
