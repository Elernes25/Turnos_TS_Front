# Reglas de arquitectura y estilo

## Stack Tecnológico
- React 19 + Vite 8.
- Typescript estricto.
- React Router DOM.
- React Bootstrap (para el diseño base) + SCSS Modules (estilos personalizados).

## Tipado y Componentes
- **PROHIBIDO** el uso de `any` y `@ts-ignore`.
- **PROHIBIDO** el uso de `React.FC`, los componentes funcionales deben tipar sus argumentos (props) directamentes deconstruyendo el objeto: `const MiComponente - ({prop1, prop2}:MicomponenteProps)=> {...}  `.
- Los eventos del DOM deben estar tipados estrictamente (ej:`React.CangeEvent<HTMLInputElement>` ).






