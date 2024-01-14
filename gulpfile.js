const { src, dest, watch, parallel } = require("gulp");

//css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

//imagenes
const cache = require('gulp-cache')
const imagemin = require ('gulp-imagemin')
const webp = import("gulp-webp");
const avif = require('gulp-avif')

function css(done) {
  //identificar el archivo de sass
  src("src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass()) //ejecutar los archivos de sass
    .pipe(dest("build/css")); //almacenar en el hdd

  done(); //avisa a gulp cuando llegamos al final de la funcion
}

//minificar imagenes
function imagenes(done){
  const opciones = {
    optimizationLevel:3
  }

  src("src/img/**/*.{png,jpg}") //'{}' busca archivos con esas extensione'
  .pipe(cache(imagemin(opciones)))
  .pipe(dest('build/img'))
  done()
}

async function versionWebp(done) {
  const opciones = {
    quality: 50,
  };

  const webpModule = await webp;
  src("src/img/**/*.{png,jpg}") //'{}' busca archivos con esas extensione'
    .pipe(webpModule.default(opciones))
    .pipe(dest("build/img"));
  done();
}


async function versionAvif(done) {
  const opciones = {
    quality: 50,
  };

  const webpModule = await webp;
  src("src/img/**/*.{png,jpg}") //'{}' busca archivos con esas extensione'
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
  done();
}

function javascript(done){
  
  src('src/js/**/*.js')
    .pipe(dest('build/js'))

  done()
}

function dev(done) {
  //escucha cambios del archivo app.scss
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);

  done();
}



exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes,versionWebp,versionAvif, javascript, dev );
