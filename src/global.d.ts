/*Esto le dice a TypeScript que cualquier importación de .scss
es un objeto con clases como claves.*/
/*
Sirve para cualquier archivo .scss, sea global o módulo.
Si importás import "./FormularioPaciente.scss", esto evita el error de TS.
Pero no distingue entre estilos globales y módulos,
así que podrías terminar usando styles.miClase aunque 
el archivo no sea .module.scss.
*/

/*declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
*/
/*
Más estricto y recomendado si trabajás con CSS Modules.
Solo aplica a archivos que terminan en .module.scss.
Te obliga a usar la convención correcta (FormularioPaciente.module.scss).
El readonly evita que accidentalmente modifiques las clases importadas.
*/
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
/*
Si tu proyecto mezcla SCSS globales y CSS Modules, lo mejor es tener ambos:
declare module "*.scss";
declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
  */

/*
.scss
Se trata de un archivo de estilos globales.
Todo lo que definas ahí (clases, selectores, variables)
 se compila y se aplica a nivel global en tu aplicación.
 
 .module.scss
Es un CSS Module: el bundler transforma las clases en nombres únicos
 y las expone como un objeto en tu componente.
 
--------------------------------------------------------
Usa .scss → estilos globales (reset, tipografía base, variables compartidas).
Usa .module.scss → estilos locales por componente
(lo más recomendado en React + TS).
👉 Lo ideal es combinar ambos:
Un global.scss para cosas generales.
Archivos .module.scss para cada componente.
 
 */