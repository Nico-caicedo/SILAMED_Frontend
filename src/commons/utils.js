import { Dialog, LocalStorage, date } from 'quasar'
import { api } from 'boot/axios'

export default {
  mensaje (texto) {
    Dialog.create({ title: 'SILAMED', message: texto, dark: true })
  },
  verificarValorX (trazabilidadInstrumento, valorX) {
    let polinomio = 0
    let polinomioA1 = 0
    let polinomioA = 0
    let polinomioB = 0
    let polinomioC = 0
    let parte2 = 0
    let parte3 = 0

    polinomioA1 = parseFloat(trazabilidadInstrumento.X_trazabilidadinst) * parseFloat(Math.pow(valorX, 3))
    polinomioA = parseFloat(trazabilidadInstrumento.A_trazabilidadinst) * parseFloat(Math.pow(valorX, 2))
    polinomioB = parseFloat(trazabilidadInstrumento.B_trazabilidadinst) * parseFloat(valorX)
    polinomioC = parseFloat(trazabilidadInstrumento.C_trazabilidadinst)
    switch (trazabilidadInstrumento.Factorcorreccion_trazabilidadinst) {
      case 0:
        polinomio = valorX
        break
      case 1:
        switch (trazabilidadInstrumento.Bplus_trazabilidadinst) {
          case '+':
            parte2 = polinomioA + polinomioB
            break
          case '-':
            parte2 = polinomioA - polinomioB
            break
        }
        switch (trazabilidadInstrumento.Cplus_trazabilidadinst) {
          case '+':
            polinomio = parte2 + polinomioC
            break
          case '-':
            polinomio = parte2 - polinomioC
            break
        }
        break
      case 2: 
        switch (trazabilidadInstrumento.Aplus_trazabilidadinst) {
          case '+':
            parte3 = polinomioA1 + polinomioA
            break
          case '-':
            parte3 = polinomioA1 - polinomioA
            break
        }
        switch (trazabilidadInstrumento.Bplus_trazabilidadinst) {
          case '+':
            parte2 = parte3 + polinomioB
            break
          case '-':
            parte2 = parte3 - polinomioB
            break
        }
        switch (trazabilidadInstrumento.Cplus_trazabilidadinst) {
          case '+':
            polinomio = parte2 + polinomioC
            break
          case '-':
            polinomio = parte2 - polinomioC
            break
        }
    }
    return polinomio
  },
  mensajeError (texto, posicion) {
    this.$q.notify({
      color: 'negative',
      position: posicion === undefined ? 'top' : posicion,
      message: texto,
      icon: 'report_problem'
    })
  },
  mensajeConfirmacion (mensaje) {
    Dialog.create({
      title: 'SILAMED',
      dark: true,
      message: mensaje,
      cancel: true,
      persistent: true
    }).onOk(() => {
      return true
    }).onCancel(() => {
      return false
    })
  },
  traerUsuario () {
    const value = LocalStorage.getItem('usuarioSILAMED')
    return value
  },
  traerAccesos () {
    const value = LocalStorage.getItem('accesosSILAMED')
    return value
  },
  establecerConexion (BD) {
    const self = this
    // self.$q.loading.show()
    api.get(`/usuario/establecerConexion/${BD}`)
      .then((response) => {
        if (response.data != null) {
          return response.data
        } else {
          this.mensaje('No hay conexión a la base de datos')
        }
      })
      .catch((error) => {
        this.mensaje('Establecer Conexión - Fallo la conexion ' + error)
        self.$q.loading.hide()
      })
    // self.$q.loading.hide()
  },
  rangoMedicionDetMostrarIdRangoMedicion (idRangoMedicion, self) {
    self.$q.loading.show()
    api.get(`/calibracionmedidores/rangoMedicionDetMostrarIdRangoMedicion/${idRangoMedicion}`)
      .then((response) => {
        self.$q.loading.hide()
        if (response.data != null) {
          return response.data
        } else {
          mensaje('No hay conexión a la base de datos')
        }
      })
      .catch((error) => {
        mensaje('Establecer Conexión - Fallo la conexion ' + error)
        self.$q.loading.hide()
      })
    self.$q.loading.hide()
  },
  fechaServidor () {
    const self = this
    api.get('/factura/fechaServidor')
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        this.mensaje('Fallo la conexion ' + error)
      })
  },
  formatoFecha (fecha) {
    return date.formatDate(fecha, 'DD/MM/YYYY')
  },
  fechaActual () {
    return date.formatDate(Date.now(), 'YYYY-MM-DD')
  },
  fechaHora () {
    return date.formatDate(Date.now())
  },
  formatoNumero (amount, decimals) {
    amount += ''
    amount = parseFloat(amount.replace(/[^0-9/.]/g, ''))
    decimals = decimals || 0

    if (isNaN(amount) || amount === 0) {
      return parseFloat(0).toFixed(decimals)
    }
    amount = '' + amount.toFixed(decimals)

    var amountParts = amount.split(',')
    const regexp = /(\d+)(\d{3})/

    while (regexp.test(amountParts[0])) {
      amountParts[0] = amountParts[0].replace(regexp, '$1' + ',' + '$2')
    }

    return amountParts.join(',')
  },
  verificarUsuario (login, self) {
    self.$q.loading.show()
    api.get(`/usuario/verificacion/${login}`)
      .then((response) => {
        var datos = response.data
        if (!datos.LoginUsuario) {
          self.$q.localStorage.remove('usuarioSILAMED')
          self.$q.localStorage.remove('cajeroSILAMED')
          self.$q.localStorage.remove('accesosSILAMED')
          self.$q.localStorage.remove('vendedorSILAMED')
          self.$router.push('/')
        } else {
          if (datos.ActivoUsuario === '1') {
            self.$q.localStorage.set('usuarioSILAMED', datos)
          } else {
            self.$q.localStorage.remove('usuarioSILAMED')
            self.$q.localStorage.remove('cajeroSILAMED')
            self.$q.localStorage.remove('accesosSILAMED')
            self.$q.localStorage.remove('vendedorSILAMED')
            self.$router.push('/')
          }
        }
        self.$q.loading.hide()
      })
      .catch((error) => {
        self.$q.loading.hide()
      })
  },
  cargarAccesos (rolUsuario, moduloUsuario, self) {
    self.$q.loading.show()
    api.get(`/usuario/cargarAccesos/${rolUsuario}/${moduloUsuario}`)
      .then((response) => {
        // self.menuElements = response.data
        self.$q.localStorage.set('accesosSILAMED', response.data)
        self.$q.loading.hide()
      })
      .catch((error) => {
        mensaje('Fallo la conexion ' + error)
        self.$q.loading.hide()
      })
  }
}
