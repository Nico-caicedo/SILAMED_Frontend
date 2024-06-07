INSTALAR 
1. Installa nodejs
2. pm2 = npm install -g pm2 
3. http-server =  npm install -g http-server


observación:
Para el requerimiento una carpeta única en un disco con espació para almacenar imágenes, se toma la decisión de servir una carpeta con ayuda de la herramienta pm2 y http-server

Instrucciones:

1.Debe crearse una carpeta en el disco en el que se desee servir, todo lo que se cree dentro de la carpeta se podrá usar
2.Abra una ventana cmd, símbolo de sistema o Windows + r  escriba cmd y enter, deberá abrir la ventana de símbolo del sistema
3.navegue hasta la carpeta que desea servir y la que almacenara, para hacerlo escriba cd ubicación/de/laCarpeta
4.escriba  npm init -y con esto debe crear un package.json
5.escriba npm install http-server debe crear un  package-lock.json y una carpeta node_module
6.crea un archivo js y escribe:

const httpServer = require('http-server');
const path = require('path');

const server = httpServer.createServer({
  root: path.join(__dirname, '/'),
  port: 3000
});

server.listen(3000, () => {
  console.log('HTTP Server is listening on port 3000');
});



puedes cambiar el puerto en el que se va ejecutar por ejemplo puerto 8080 , 8081 , 4000, pero teniendo en cuenta que estos no estén ocupados, puede generar errores

7.una vez hecho esto, vuelve a la cmd y ubícate en la misma carpeta en la que se ejecutaron los comandos, y ejecuta el comando pm2 start + el nombre del archivo js que creaste, luego ejecuta pm2 ls , deberas poder ver un registro con un campo de nombre status el cual tendrá online , esto significa que la carpeta ha sido servida exitosamente
7. Ahora tenga en cuenta el puerto que coloco en el archivo js de la carpeta que sirvió
8. busque la ip4 que arroja su computador, para hacerlo vaya a la cmd y escriba ipconfig y busque Dirección IPv4 que se encuentra hasta abajo
9. Al juntar el puerto y Dirección IPv4 debe quedarnos algo así "http://170.0.1.62:3000/" 
10.Ahora, ve al proyecto, esa dirección copia la y pégala dentro del archivo server.js que se encuentra dentro de boot

Nota: esos pasos debería asegurar que las imágenes se pueda guardar contenido in problemas
 