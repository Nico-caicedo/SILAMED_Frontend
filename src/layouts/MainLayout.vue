<template>
<q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-light-blue-9">
      <q-toolbar>
        <q-btn flat dense round 
          @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          SILAMED V 2025.05.19.1
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-scroll-area style="height: calc(100% - 30px); margin-top: 30px; border-right: 6px solid #ddd">
          <q-list padding>
            <div v-for="mItem in menuElements" :key="mItem.IdAcceso">
              <q-expansion-item
                expand-separator
                icon="settings"
                :label="mItem.DescripcionAcceso"
                v-if="mItem.Hijos && !mItem.AspxAcceso"
                :content-inset-level="1"
              >
                <q-item v-for="subMenu in mItem.Hijos" :key="subMenu.IdAcceso" clickable v-ripple @click.native="redirect(subMenu.AspxAcceso)">
                  <q-item-section avatar>
                    <q-icon :name="subMenu.IconoAcceso" />
                  </q-item-section>
                  <q-item-section >
                    {{subMenu.DescripcionAcceso}}
                  </q-item-section>
                </q-item>
              </q-expansion-item>
              <q-item clickable v-ripple v-else @click.native="redirect('/inicio')">
                <q-item-section avatar>
                  <q-icon name="exit_to_app" />
                </q-item-section>
                <q-item-section >
                  {{mItem.DescripcionAcceso}}
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-scroll-area>
        <div class="absolute-top bg-white" style="height: 30px; border-right: 6px solid #0000">
          <div class="text-weight-bold" style="padding:10px">Usuario: {{ usuario.Persona.Nombre_persona + ' ' + usuario.Persona.Apellido1_persona }}</div>
        </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { api } from 'boot/axios'
import utils from '../commons/utils.js'
// import localForage from 'localforage'
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      menuElements: [],
      usuario: { }
    }
  },
  created () {
    this.inicio()
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
  },
  methods: {
    openURL,
    redirect (path) {
      if (path === undefined) {
        return
      } else {
        if (path === '/inicio') {
          this.salir()
          return
        }
      }

      this.$router.push(path)
    },
    salir () {
      this.$q.localStorage.remove('usuarioSILAMED')
      this.$q.localStorage.remove('cajeroSILAMED')
      this.$q.localStorage.remove('accesosSILAMED')
      this.$q.localStorage.remove('vendedorSILAMED')
      this.$router.push('/')
    },
    inicio () {
      const self = this
      const usuario = utils.traerUsuario()
      if (!usuario) {
        this.$router.push('/')
        return
      }
      self.usuario = usuario
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const accesos = utils.traerAccesos()
        self.menuElements = accesos
      }, 500)
    }
  }
}
</script>