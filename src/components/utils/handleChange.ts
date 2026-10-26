export const handleChange = (evento, objeto, setObjeto) => {
  const { name, value } = evento.target;

  if (name.includes(".")) {
    const keys = name.split(".");
    // Copia profunda parcial
    setObjeto((prev) => {
      let nuevo = { ...prev };
      let ref = nuevo;

      // Recorre todas las claves menos la última
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }

      // Asigna el valor en la última clave
      ref[keys[keys.length - 1]] = value;
      return nuevo;
    });
  } else {
    setObjeto((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};
