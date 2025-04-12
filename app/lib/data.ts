export interface Empresa {
  id: number;
  NIT: string;
  Nombre: string;
  Representante: string;
  Cedula: string;
  Telefono: string;
  Direccion: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Municipio {
  "Código Departamento": string | number,
  "Nombre Departamento": string,
  "Código Municipio": string | number,
  "Nombre Municipio": string,
  "Tipo: Municipio / Isla / Área no municipalizada": string,
  "longitud": string | number,
  "Latitud": string | number
}

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  linea: string;
  modelo: string;
  color: string;
  claseVehiculo: string;
  tipoCarroceria: string;
  combustible: string;
  numeroMotor: string;
  vin: string;
  numeroSerie: string;
  numeroChasis: string;
  propietarioNombre: string;
  propietarioIdentificacion: string;
  kilometraje: number | null;
  estado: string;
  latitud: string | null;
  longitud: string | null;
  propietarioId: number | null;
  conductorId: string | null; // Assuming conductor ID might be UUID
  createdAt: string;
  updatedAt: string;
  galeria: string; // Assuming JSON string or adjust type if needed
  soatVencimiento: string | null;
  tecnomecanicaVencimiento: string | null;
  fechaMatricula: string | null;
  tarjetaDeOperacionVencimiento: string | null;
  polizaContractualVencimiento: string | null;
  polizaExtraContractualVencimiento: string | null;
  polizaTodoRiesgoVencimiento: string | null;
}

/**
 * Interfaz que define la estructura de un objeto Conductor
 */
export interface Conductor {
  /**
   * Identificador único del conductor (UUID)
   */
  id: string;

  /**
   * Nombre(s) del conductor
   */
  nombre: string;

  /**
   * Apellido(s) del conductor
   */
  apellido: string;

  /**
   * Tipo de documento de identidad (CC, TI, CE, etc.)
   */
  tipoDocumento: string;

  /**
   * Número de documento de identidad
   */
  numeroDocumento: number;

  /**
   * Correo electrónico del conductor
   */
  correo: string;

  /**
   * Número de teléfono del conductor
   */
  telefono: string | number;

  /**
   * Fecha de nacimiento en formato ISO (YYYY-MM-DD)
   */
  fechaNacimiento: string | null;

  /**
   * Género del conductor (MASCULINO, FEMENINO)
   */
  genero: string;

  /**
   * Cargo o posición del conductor
   */
  cargo: string;

  /**
   * Fecha de inicio del contrato en formato ISO (YYYY-MM-DD)
   */
  fechaContrato: string;

  /**
   * Salario del conductor (valor numérico)
   */
  salario: number;

  /**
   * Estado laboral del conductor (ACTIVO, INACTIVO, etc.)
   */
  estado: string;

  /**
   * Nombre de la empresa a la que está vinculado
   */
  empresa: string;

  /**
   * Tipo de contratación (Planta, Contratista, etc.)
   */
  tipoContrato: string;

  /**
   * Información relacionada con la licencia de conducción
   */
  licencia: {
    /**
     * Categoría de la licencia (C1, C2, etc.)
     */
    categoria: string | null;

    /**
     * Fecha de vencimiento de la licencia en formato ISO (YYYY-MM-DD)
     */
    fechaVencimiento: string | null;
  };

  /**
   * Ubicación o sede del conductor (Ciudad)
   */
  ubicacion: string;

  /**
   * Fecha y hora de creación del registro
   */
  fechaCreacion: string;

  /**
   * Fecha y hora de la última actualización del registro
   */
  fechaActualizacion: string;
}


export const empresas: Empresa[] = [
  {
    "id": 10,
    "NIT": "860.528.871",
    "Nombre": "FEPCO SERVICIOS S.A.S",
    "Representante": "NELLY MARIA MORALES ROMERO",
    "Cedula": "39.949.277",
    "Telefono": "3123193627",
    "Direccion": "CLL 16 # 06-95",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 11,
    "NIT": "830.002.560",
    "Nombre": "FMC TECHNOLOGIES INC",
    "Representante": "DIANA PAOLA COY GONZALEZ",
    "Cedula": "52.423.914",
    "Telefono": "3173715421",
    "Direccion": "CRA 7 # 71 - 21 TORRE A PISO 5",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 12,
    "NIT": "830.126.302",
    "Nombre": "FRONTERA ENERGY",
    "Representante": "GUSTAVO ANDRES PATIÑO",
    "Cedula": "79.908.682",
    "Telefono": "3124092835",
    "Direccion": "BOGOTA",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 13,
    "NIT": "800.172.871",
    "Nombre": "GEOCOL CONSULTORES S.A.",
    "Representante": "NELLY MARIA MORALES ROMERO",
    "Cedula": "39.949.277",
    "Telefono": "3123193627",
    "Direccion": "CLL 16 # 06-99",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 14,
    "NIT": "900.081.451",
    "Nombre": "GO INTERNATIONAL SAS",
    "Representante": "NELLY MARIA MORALES ROMERO",
    "Cedula": "39.949.277",
    "Telefono": "3123193627",
    "Direccion": "CLL 16 # 06-95",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 15,
    "NIT": "892.099.216",
    "Nombre": "GOBERNACION DE CASANARE",
    "Representante": "NELLY MARIA MORALES ROMERO",
    "Cedula": "39.949.277",
    "Telefono": "3123193627",
    "Direccion": "CLL 16 # 06-98",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 16,
    "NIT": "900.284.090",
    "Nombre": "INGENIERIA CIVIL Y AMBIENTAL LIMITADA",
    "Representante": "TERESA DEL PILAR OSPINA VARGAS",
    "Cedula": "47.439.529",
    "Telefono": "3108598173",
    "Direccion": "CRR 33 Nº 40-26 OF 301",
    "createdAt": null,
    "updatedAt": null
  },
];


export const vehiculos: Vehiculo[] = [
  {
    "id": 3,
    "placa": "EYX108",
    "marca": "FOTON",
    "linea": "BJ2037Y3MDV",
    "modelo": "2019",
    "color": "BLANCO",
    "claseVehiculo": "CAMIONETA",
    "tipoCarroceria": "DOBLE CABINA",
    "combustible": "DIESEL",
    "numeroMotor": "76079340",
    "vin": "9G4B2MBV8KPC00959",
    "numeroSerie": "9G4B2MBV8KPC00959",
    "numeroChasis": "9G4B2MBV8KPC00959",
    "propietarioNombre": "CEPEDA ORDUZ SERVICIOS Y TRANSPORT",
    "propietarioIdentificacion": "NIT 900543553",
    "kilometraje": null,
    "estado": "DISPONIBLE",
    "latitud": null,
    "longitud": null,
    "propietarioId": null,
    "conductorId": null,
    "createdAt": "2024-08-30 14:48:46.3140000 +00:00",
    "updatedAt": "2025-01-29 23:03:12.2830000 +00:00",
    "galeria": "[]",
    "soatVencimiento": "2026-01-09",
    "tecnomecanicaVencimiento": "2026-01-12",
    "fechaMatricula": "2018-12-11",
    "tarjetaDeOperacionVencimiento": "2025-05-25",
    "polizaContractualVencimiento": "2025-02-27",
    "polizaExtraContractualVencimiento": "2025-02-27",
    "polizaTodoRiesgoVencimiento": "2025-07-31"
  },
  {
    "id": 4,
    "placa": "FST006",
    "marca": "TOYOTA",
    "linea": "HILUX",
    "modelo": "2020",
    "color": "SUPER BLANCO",
    "claseVehiculo": "CAMIONETA",
    "tipoCarroceria": "DOBLE CABINA",
    "combustible": "DIESEL",
    "numeroMotor": "2GD-4686218",
    "vin": "8AJKB3CD0L1618404",
    "numeroSerie": "8AJKB3CD0L1618404",
    "numeroChasis": "8AJKB3CD0L1618404",
    "propietarioNombre": "MURALES ROMERO NELLY MARIA",
    "propietarioIdentificacion": "C.C. 39949277",
    "kilometraje": null,
    "estado": "DISPONIBLE",
    "latitud": null,
    "longitud": null,
    "propietarioId": null,
    "conductorId": null,
    "createdAt": "2024-08-30 15:03:33.8180000 +00:00",
    "updatedAt": "2025-01-11 15:02:43.8570000 +00:00",
    "galeria": "[]",
    "soatVencimiento": "2025-10-03",
    "tecnomecanicaVencimiento": "2025-10-08",
    "fechaMatricula": "2019-10-04",
    "tarjetaDeOperacionVencimiento": "2025-05-31",
    "polizaContractualVencimiento": "2025-02-27",
    "polizaExtraContractualVencimiento": "2025-02-27",
    "polizaTodoRiesgoVencimiento": "2025-04-11"
  },
  {
    "id": 6,
    "placa": "EXX216",
    "marca": "FOTON",
    "linea": "BJ2037Y3MDV",
    "modelo": "2019",
    "color": "BLANCO",
    "claseVehiculo": "CAMIONETA",
    "tipoCarroceria": "DOBLE CABINA",
    "combustible": "DIESEL",
    "numeroMotor": "76031383",
    "vin": "9G4B2MBV2KPC00861",
    "numeroSerie": "9G4B2MBV2KPC00861",
    "numeroChasis": "9G4B2MBV2KPC00861",
    "propietarioNombre": "CEPEDA ORDUZ SERVICIOS Y TRANSPORT",
    "propietarioIdentificacion": "NIT 900543553",
    "kilometraje": null,
    "estado": "DISPONIBLE",
    "latitud": "3,72944",
    "longitud": "-71,754271",
    "propietarioId": null,
    "conductorId": null,
    "createdAt": "2024-08-30 15:05:05.3940000 +00:00",
    "updatedAt": "2025-01-11 14:58:53.7260000 +00:00",
    "galeria": "[]",
    "soatVencimiento": "2025-06-30",
    "tecnomecanicaVencimiento": "2025-06-25",
    "fechaMatricula": "2018-06-05",
    "tarjetaDeOperacionVencimiento": "2025-06-02",
    "polizaContractualVencimiento": "2025-02-27",
    "polizaExtraContractualVencimiento": "2025-02-27",
    "polizaTodoRiesgoVencimiento": "2025-06-30"
  },
  {
    "id": 7,
    "placa": "LLQ895",
    "marca": "TOYOTA",
    "linea": "HILUX",
    "modelo": "2023",
    "color": "SUPER BLANCO",
    "claseVehiculo": "CAMIONETA",
    "tipoCarroceria": "DOBLE CABINA",
    "combustible": "DIESEL",
    "numeroMotor": "8AJKB3CD0P1653997",
    "vin": "8AJKB3CD0P1653997",
    "numeroSerie": "******",
    "numeroChasis": "8AJKB3CD0P1653997",
    "propietarioNombre": "RUBIANO FARFAN JOSE ISRAEL",
    "propietarioIdentificacion": "C.C. 17355989",
    "kilometraje": null,
    "estado": "DISPONIBLE",
    "latitud": null,
    "longitud": null,
    "propietarioId": null,
    "conductorId": null,
    "createdAt": "2024-08-30 15:18:38.3950000 +00:00",
    "updatedAt": "2025-01-11 15:47:50.4460000 +00:00",
    "galeria": "[]",
    "soatVencimiento": "2025-06-06",
    "tecnomecanicaVencimiento": null,
    "fechaMatricula": "2023-06-07",
    "tarjetaDeOperacionVencimiento": "2025-06-20",
    "polizaContractualVencimiento": "2025-02-27",
    "polizaExtraContractualVencimiento": "2025-02-27",
    "polizaTodoRiesgoVencimiento": "2025-06-07"
  },
  {
    "id": 8,
    "placa": "GUQ721",
    "marca": "MITSUBISHI",
    "linea": "L200 2.5",
    "modelo": "2020",
    "color": "BLANCO PERLA",
    "claseVehiculo": "CAMIONETA",
    "tipoCarroceria": "DOBLE CABINA",
    "combustible": "DIESEL",
    "numeroMotor": "4D56UAX2226",
    "vin": "MMBJNKL30LH001339",
    "numeroSerie": "******",
    "numeroChasis": "MMBJNKL30LH001339",
    "propietarioNombre": "BANCOLOMBIA S.A.",
    "propietarioIdentificacion": "NIT 890903938",
    "kilometraje": null,
    "estado": "DISPONIBLE",
    "latitud": null,
    "longitud": null,
    "propietarioId": null,
    "conductorId": null,
    "createdAt": "2024-08-30 15:18:58.8400000 +00:00",
    "updatedAt": "2025-01-11 15:15:58.0710000 +00:00",
    "galeria": "[]",
    "soatVencimiento": "2025-10-24",
    "tecnomecanicaVencimiento": "2025-10-19",
    "fechaMatricula": "2019-10-30",
    "tarjetaDeOperacionVencimiento": "2025-07-11",
    "polizaContractualVencimiento": "2025-02-27",
    "polizaExtraContractualVencimiento": "2025-02-27",
    "polizaTodoRiesgoVencimiento": "2025-11-04"
  },
];

export const conductores: Conductor[] = [
  {
    "id": "28de6cc0-dc37-4143-88a3-035be8a6f57b",
    "nombre": "NESTOR CAMILO",
    "apellido": "MORALES DIAZ",
    "tipoDocumento": "CC",
    "numeroDocumento": 1121823351,
    "correo": "temp-correo-28@example.com",
    "telefono": "temp-phone-28",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1500000,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Villanueva",
    "fechaCreacion": "2024-08-20 14:08:08.047-05",
    "fechaActualizacion": "2024-08-20 14:08:08.047-05"
  },
  {
    "id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "nombre": "LUIS HERNANDO",
    "apellido": "HERNANDEZ",
    "tipoDocumento": "CC",
    "numeroDocumento": 74378954,
    "correo": "temp-correo-30@example.com",
    "telefono": "temp-phone-30",
    "fechaNacimiento": "1982-11-11",
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1500000,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Villanueva",
    "fechaCreacion": "2024-08-20 14:08:08.613-05",
    "fechaActualizacion": "2024-08-20 14:08:08.613-05"
  },
  {
    "id": "49944cdf-3890-4407-8462-e13e4391ee06",
    "nombre": "LUIS ALBEIRO",
    "apellido": "BARRERA ALFONSO",
    "tipoDocumento": "CC",
    "numeroDocumento": 1115912901,
    "correo": "temp-correo-59@example.com",
    "telefono": "temp-phone-59",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1500000,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": null,
      "fechaVencimiento": null
    },
    "ubicacion": "Villanueva",
    "fechaCreacion": "2024-08-20 22:36:41.981-05",
    "fechaActualizacion": "2024-09-26 17:16:53.877-05"
  },
  {
    "id": "deff4f42-4faf-419f-9dff-543c4d21cd36",
    "nombre": "JULIO ASTIBIES",
    "apellido": "CUTA OYOLA",
    "tipoDocumento": "CC",
    "numeroDocumento": 9534361,
    "correo": "temp-correo-11@example.com",
    "telefono": "temp-phone-11",
    "fechaNacimiento": "1967-12-29",
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1423500,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Yopal",
    "fechaCreacion": "2024-08-20 14:08:07.915-05",
    "fechaActualizacion": "2024-08-20 14:08:07.915-05"
  },
  {
    "id": "dc091112-6208-4a2d-9c03-a3ac61448b9d",
    "nombre": "NICOLAS",
    "apellido": "CARDONA ACEVEDO",
    "tipoDocumento": "CC",
    "numeroDocumento": 1118544079,
    "correo": "temp-correo-19@example.com",
    "telefono": "temp-phone-19",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1423500,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C1",
      "fechaVencimiento": null
    },
    "ubicacion": "Yopal",
    "fechaCreacion": "2024-08-20 14:08:07.915-05",
    "fechaActualizacion": "2024-08-20 14:08:07.915-05"
  },
  {
    "id": "b7c08dc8-3bf9-44b0-8b6d-2aeedcaab1fd",
    "nombre": "WILMER WILLERMAN JAMES",
    "apellido": "MORENO CANIZALEZ",
    "tipoDocumento": "CC",
    "numeroDocumento": 1122626694,
    "correo": "temp-correo-23@example.com",
    "telefono": "temp-phone-23",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1423500,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Yopal",
    "fechaCreacion": "2024-08-20 14:08:08.047-05",
    "fechaActualizacion": "2024-08-20 14:08:08.047-05"
  },
  {
    "id": "589c10d1-7058-4065-b9f2-dc72d2610809",
    "nombre": "LUIS ALBERTO",
    "apellido": "ORDUZ SIABATTO",
    "tipoDocumento": "CC",
    "numeroDocumento": 9534177,
    "correo": "temp-correo-60@example.com",
    "telefono": "temp-phone-60",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1423500,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": null,
      "fechaVencimiento": null
    },
    "ubicacion": "Yopal",
    "fechaCreacion": "2024-08-20 22:36:41.981-05",
    "fechaActualizacion": "2024-09-26 17:16:53.877-05"
  },
  {
    "id": "05da4bcb-95ac-4ddb-9484-31dcba698008",
    "nombre": "DIEGO FERNANDO",
    "apellido": "VERA ANGEL",
    "tipoDocumento": "CC",
    "numeroDocumento": 1007599111,
    "correo": "nohay",
    "telefono": "temp-phone-29",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1423500,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Yopal",
    "fechaCreacion": "2024-08-20 14:08:08.047-05",
    "fechaActualizacion": "2024-08-20 14:08:08.047-05"
  },
  {
    "id": "05373b00-5a5e-49d9-8d2a-772b1a049ea2",
    "nombre": "MONICA ANDREA",
    "apellido": "MORALES DIAZ",
    "tipoDocumento": "CC",
    "numeroDocumento": 39951232,
    "correo": "monikamd84@hotmail.com",
    "telefono": "temp-phone-17",
    "fechaNacimiento": "1984-11-11",
    "genero": "FEMENINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2022-12-14",
    "salario": 1500000,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Villanueva",
    "fechaCreacion": "2024-08-20 14:08:07.915-05",
    "fechaActualizacion": "2024-08-20 14:08:07.915-05"
  },
  {
    "id": "173e66bc-9404-46b4-8c64-bbbce7b56662",
    "nombre": "JUAN DAVID",
    "apellido": "VASQUEZ SIERRA",
    "tipoDocumento": "CC",
    "numeroDocumento": 1118203307,
    "correo": "judavassi@gmail.com",
    "telefono": "temp-phone-9",
    "fechaNacimiento": null,
    "genero": "MASCULINO",
    "cargo": "CONDUCTOR VEHÍCULO LIVIANO",
    "fechaContrato": "2025-03-12",
    "salario": 1500000,
    "estado": "ACTIVO",
    "empresa": "Transmeralda",
    "tipoContrato": "Planta",
    "licencia": {
      "categoria": "C2",
      "fechaVencimiento": null
    },
    "ubicacion": "Villanueva",
    "fechaCreacion": "2024-08-20 14:08:05.871-05",
    "fechaActualizacion": "2024-08-20 14:08:05.871-05"
  }
]

export const municipios: Municipio[] = [
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05001",
    "Nombre Municipio": "MEDELLÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,581775",
    "Latitud": "6,246631"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05002",
    "Nombre Municipio": "ABEJORRAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,428739",
    "Latitud": "5,789315"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05004",
    "Nombre Municipio": "ABRIAQUÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,064304",
    "Latitud": "6,632282"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05021",
    "Nombre Municipio": "ALEJANDRÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,141346",
    "Latitud": "6,376061"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05030",
    "Nombre Municipio": "AMAGÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,702188",
    "Latitud": "6,038708"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05031",
    "Nombre Municipio": "AMALFI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,077501",
    "Latitud": "6,909655"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05034",
    "Nombre Municipio": "ANDES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,878828",
    "Latitud": "5,657194"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05036",
    "Nombre Municipio": "ANGELÓPOLIS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,711389",
    "Latitud": "6,109719"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05038",
    "Nombre Municipio": "ANGOSTURA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,335116",
    "Latitud": "6,885175"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05040",
    "Nombre Municipio": "ANORÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,148355",
    "Latitud": "7,074703"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05042",
    "Nombre Municipio": "SANTA FÉ DE ANTIOQUIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,826648",
    "Latitud": "6,556484"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05044",
    "Nombre Municipio": "ANZÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,854442",
    "Latitud": "6,302641"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05045",
    "Nombre Municipio": "APARTADÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,625279",
    "Latitud": "7,882968"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05051",
    "Nombre Municipio": "ARBOLETES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,426708",
    "Latitud": "8,849317"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05055",
    "Nombre Municipio": "ARGELIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,14107",
    "Latitud": "5,731474"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05059",
    "Nombre Municipio": "ARMENIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,786647",
    "Latitud": "6,155667"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05079",
    "Nombre Municipio": "BARBOSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,331627",
    "Latitud": "6,439195"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05086",
    "Nombre Municipio": "BELMIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,667779",
    "Latitud": "6,606319"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05088",
    "Nombre Municipio": "BELLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,555245",
    "Latitud": "6,333587"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05091",
    "Nombre Municipio": "BETANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,97679",
    "Latitud": "5,74615"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05093",
    "Nombre Municipio": "BETULIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,984452",
    "Latitud": "6,115208"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05101",
    "Nombre Municipio": "CIUDAD BOLÍVAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,021509",
    "Latitud": "5,850273"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05107",
    "Nombre Municipio": "BRICEÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,55036",
    "Latitud": "7,112803"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05113",
    "Nombre Municipio": "BURITICÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,907",
    "Latitud": "6,720759"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05120",
    "Nombre Municipio": "CÁCERES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,35205",
    "Latitud": "7,578366"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05125",
    "Nombre Municipio": "CAICEDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,98293",
    "Latitud": "6,405607"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05129",
    "Nombre Municipio": "CALDAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,633673",
    "Latitud": "6,091077"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05134",
    "Nombre Municipio": "CAMPAMENTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,298091",
    "Latitud": "6,979771"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05138",
    "Nombre Municipio": "CAÑASGORDAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,028228",
    "Latitud": "6,753859"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05142",
    "Nombre Municipio": "CARACOLÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,757421",
    "Latitud": "6,409829"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05145",
    "Nombre Municipio": "CARAMANTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,643868",
    "Latitud": "5,54853"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05147",
    "Nombre Municipio": "CAREPA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,652652",
    "Latitud": "7,755148"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05148",
    "Nombre Municipio": "EL CARMEN DE VIBORAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,333901",
    "Latitud": "6,082885"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05150",
    "Nombre Municipio": "CAROLINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,283192",
    "Latitud": "6,725995"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05154",
    "Nombre Municipio": "CAUCASIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,197996",
    "Latitud": "7,977278"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05172",
    "Nombre Municipio": "CHIGORODÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,681531",
    "Latitud": "7,666147"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05190",
    "Nombre Municipio": "CISNEROS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,087047",
    "Latitud": "6,537829"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05197",
    "Nombre Municipio": "COCORNÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,185483",
    "Latitud": "6,058295"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05206",
    "Nombre Municipio": "CONCEPCIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,257587",
    "Latitud": "6,394348"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05209",
    "Nombre Municipio": "CONCORDIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,908448",
    "Latitud": "6,045738"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05212",
    "Nombre Municipio": "COPACABANA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,509384",
    "Latitud": "6,348557"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05234",
    "Nombre Municipio": "DABEIBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,261614",
    "Latitud": "6,998112"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05237",
    "Nombre Municipio": "DONMATÍAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,39263",
    "Latitud": "6,485603"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05240",
    "Nombre Municipio": "EBÉJICO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,766413",
    "Latitud": "6,325615"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05250",
    "Nombre Municipio": "EL BAGRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,799097",
    "Latitud": "7,5975"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05264",
    "Nombre Municipio": "ENTRERRÍOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,517685",
    "Latitud": "6,566273"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05266",
    "Nombre Municipio": "ENVIGADO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,582192",
    "Latitud": "6,166695"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05282",
    "Nombre Municipio": "FREDONIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,675072",
    "Latitud": "5,928039"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05284",
    "Nombre Municipio": "FRONTINO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,130765",
    "Latitud": "6,776066"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05306",
    "Nombre Municipio": "GIRALDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,952158",
    "Latitud": "6,680808"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05308",
    "Nombre Municipio": "GIRARDOTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,444238",
    "Latitud": "6,379472"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05310",
    "Nombre Municipio": "GÓMEZ PLATA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,220018",
    "Latitud": "6,683269"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05313",
    "Nombre Municipio": "GRANADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,184446",
    "Latitud": "6,142892"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05315",
    "Nombre Municipio": "GUADALUPE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,239862",
    "Latitud": "6,815069"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05318",
    "Nombre Municipio": "GUARNE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,441612",
    "Latitud": "6,27787"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05321",
    "Nombre Municipio": "GUATAPÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,160041",
    "Latitud": "6,232461"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05347",
    "Nombre Municipio": "HELICONIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,734322",
    "Latitud": "6,206757"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05353",
    "Nombre Municipio": "HISPANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,906587",
    "Latitud": "5,799461"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05360",
    "Nombre Municipio": "ITAGÜÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,612056",
    "Latitud": "6,175079"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05361",
    "Nombre Municipio": "ITUANGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,764673",
    "Latitud": "7,171629"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05364",
    "Nombre Municipio": "JARDÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,818982",
    "Latitud": "5,597542"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05368",
    "Nombre Municipio": "JERICÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,785499",
    "Latitud": "5,789748"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05376",
    "Nombre Municipio": "LA CEJA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,429433",
    "Latitud": "6,028062"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05380",
    "Nombre Municipio": "LA ESTRELLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,637708",
    "Latitud": "6,145238"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05390",
    "Nombre Municipio": "LA PINTADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,60781",
    "Latitud": "5,743808"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05400",
    "Nombre Municipio": "LA UNIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,360874",
    "Latitud": "5,973845"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05411",
    "Nombre Municipio": "LIBORINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,812838",
    "Latitud": "6,677316"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05425",
    "Nombre Municipio": "MACEO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,78716",
    "Latitud": "6,552116"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05440",
    "Nombre Municipio": "MARINILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,339345",
    "Latitud": "6,173995"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05467",
    "Nombre Municipio": "MONTEBELLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,523455",
    "Latitud": "5,946313"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05475",
    "Nombre Municipio": "MURINDÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,817485",
    "Latitud": "6,97771"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05480",
    "Nombre Municipio": "MUTATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,435875",
    "Latitud": "7,242875"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05483",
    "Nombre Municipio": "NARIÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,176262",
    "Latitud": "5,610777"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05490",
    "Nombre Municipio": "NECOCLÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,787271",
    "Latitud": "8,434526"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05495",
    "Nombre Municipio": "NECHÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,77647",
    "Latitud": "8,094129"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05501",
    "Nombre Municipio": "OLAYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,811773",
    "Latitud": "6,626492"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05541",
    "Nombre Municipio": "PEÑOL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,242693",
    "Latitud": "6,219349"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05543",
    "Nombre Municipio": "PEQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,910357",
    "Latitud": "7,021029"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05576",
    "Nombre Municipio": "PUEBLORRICO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,839903",
    "Latitud": "5,79158"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05579",
    "Nombre Municipio": "PUERTO BERRÍO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,410016",
    "Latitud": "6,487028"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05585",
    "Nombre Municipio": "PUERTO NARE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,583012",
    "Latitud": "6,186025"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05591",
    "Nombre Municipio": "PUERTO TRIUNFO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,64119",
    "Latitud": "5,871318"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05604",
    "Nombre Municipio": "REMEDIOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,698135",
    "Latitud": "7,029424"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05607",
    "Nombre Municipio": "RETIRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,501301",
    "Latitud": "6,062454"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05615",
    "Nombre Municipio": "RIONEGRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,377316",
    "Latitud": "6,147148"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05628",
    "Nombre Municipio": "SABANALARGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,816645",
    "Latitud": "6,850028"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05631",
    "Nombre Municipio": "SABANETA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,615479",
    "Latitud": "6,149903"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05642",
    "Nombre Municipio": "SALGAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,976807",
    "Latitud": "5,964198"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05647",
    "Nombre Municipio": "SAN ANDRÉS DE CUERQUÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,674564",
    "Latitud": "6,916676"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05649",
    "Nombre Municipio": "SAN CARLOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,988097",
    "Latitud": "6,187746"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05652",
    "Nombre Municipio": "SAN FRANCISCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,101562",
    "Latitud": "5,963476"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05656",
    "Nombre Municipio": "SAN JERÓNIMO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,726975",
    "Latitud": "6,44809"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05658",
    "Nombre Municipio": "SAN JOSÉ DE LA MONTAÑA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,683352",
    "Latitud": "6,85009"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05659",
    "Nombre Municipio": "SAN JUAN DE URABÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,52857",
    "Latitud": "8,758964"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05660",
    "Nombre Municipio": "SAN LUIS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,993619",
    "Latitud": "6,043017"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05664",
    "Nombre Municipio": "SAN PEDRO DE LOS MILAGROS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,556743",
    "Latitud": "6,46012"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05665",
    "Nombre Municipio": "SAN PEDRO DE URABÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,380567",
    "Latitud": "8,276884"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05667",
    "Nombre Municipio": "SAN RAFAEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,02849",
    "Latitud": "6,293759"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05670",
    "Nombre Municipio": "SAN ROQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,019109",
    "Latitud": "6,485939"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05674",
    "Nombre Municipio": "SAN VICENTE FERRER",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,332616",
    "Latitud": "6,282164"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05679",
    "Nombre Municipio": "SANTA BÁRBARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,567351",
    "Latitud": "5,875527"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05686",
    "Nombre Municipio": "SANTA ROSA DE OSOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,460723",
    "Latitud": "6,643366"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05690",
    "Nombre Municipio": "SANTO DOMINGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,164903",
    "Latitud": "6,473032"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05697",
    "Nombre Municipio": "EL SANTUARIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,265465",
    "Latitud": "6,136871"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05736",
    "Nombre Municipio": "SEGOVIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,701596",
    "Latitud": "7,079648"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05756",
    "Nombre Municipio": "SONSÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,309596",
    "Latitud": "5,714851"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05761",
    "Nombre Municipio": "SOPETRÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,747378",
    "Latitud": "6,500745"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05789",
    "Nombre Municipio": "TÁMESIS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,714429",
    "Latitud": "5,664645"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05790",
    "Nombre Municipio": "TARAZÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,401407",
    "Latitud": "7,580127"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05792",
    "Nombre Municipio": "TARSO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,822956",
    "Latitud": "5,864542"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05809",
    "Nombre Municipio": "TITIRIBÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,791887",
    "Latitud": "6,062391"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05819",
    "Nombre Municipio": "TOLEDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,692281",
    "Latitud": "7,010328"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05837",
    "Nombre Municipio": "TURBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,728858",
    "Latitud": "8,089929"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05842",
    "Nombre Municipio": "URAMITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,173284",
    "Latitud": "6,898393"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05847",
    "Nombre Municipio": "URRAO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,133951",
    "Latitud": "6,317343"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05854",
    "Nombre Municipio": "VALDIVIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,439274",
    "Latitud": "7,1652"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05856",
    "Nombre Municipio": "VALPARAÍSO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,624452",
    "Latitud": "5,614555"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05858",
    "Nombre Municipio": "VEGACHÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,798714",
    "Latitud": "6,773525"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05861",
    "Nombre Municipio": "VENECIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,735544",
    "Latitud": "5,964693"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05873",
    "Nombre Municipio": "VIGÍA DEL FUERTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,896004",
    "Latitud": "6,588164"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05885",
    "Nombre Municipio": "YALÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,840059",
    "Latitud": "6,676554"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05887",
    "Nombre Municipio": "YARUMAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,418828",
    "Latitud": "6,963832"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05890",
    "Nombre Municipio": "YOLOMBÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,013385",
    "Latitud": "6,594511"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05893",
    "Nombre Municipio": "YONDÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,912445",
    "Latitud": "7,00396"
  },
  {
    "Código Departamento": "05",
    "Nombre Departamento": "ANTIOQUIA",
    "Código Municipio": "05895",
    "Nombre Municipio": "ZARAGOZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,867075",
    "Latitud": "7,488583"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08001",
    "Nombre Municipio": "BARRANQUILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,815546",
    "Latitud": "10,977961"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08078",
    "Nombre Municipio": "BARANOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,916077",
    "Latitud": "10,79445"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08137",
    "Nombre Municipio": "CAMPO DE LA CRUZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,880847",
    "Latitud": "10,378291"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08141",
    "Nombre Municipio": "CANDELARIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,879717",
    "Latitud": "10,461903"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08296",
    "Nombre Municipio": "GALAPA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,870385",
    "Latitud": "10,919033"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08372",
    "Nombre Municipio": "JUAN DE ACOSTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,041032",
    "Latitud": "10,83254"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08421",
    "Nombre Municipio": "LURUACO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,14199",
    "Latitud": "10,610491"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08433",
    "Nombre Municipio": "MALAMBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,776923",
    "Latitud": "10,857086"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08436",
    "Nombre Municipio": "MANATÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,956867",
    "Latitud": "10,449089"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08520",
    "Nombre Municipio": "PALMAR DE VARELA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,754765",
    "Latitud": "10,738591"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08549",
    "Nombre Municipio": "PIOJÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,107592",
    "Latitud": "10,749216"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08558",
    "Nombre Municipio": "POLONUEVO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,852981",
    "Latitud": "10,777363"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08560",
    "Nombre Municipio": "PONEDERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,753885",
    "Latitud": "10,641779"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08573",
    "Nombre Municipio": "PUERTO COLOMBIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,888627",
    "Latitud": "11,015322"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08606",
    "Nombre Municipio": "REPELÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,125534",
    "Latitud": "10,493357"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08634",
    "Nombre Municipio": "SABANAGRANDE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,759496",
    "Latitud": "10,792453"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08638",
    "Nombre Municipio": "SABANALARGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,921256",
    "Latitud": "10,632091"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08675",
    "Nombre Municipio": "SANTA LUCÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,959204",
    "Latitud": "10,324303"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08685",
    "Nombre Municipio": "SANTO TOMÁS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,757859",
    "Latitud": "10,758735"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08758",
    "Nombre Municipio": "SOLEDAD",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,786054",
    "Latitud": "10,909921"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08770",
    "Nombre Municipio": "SUAN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,881687",
    "Latitud": "10,335432"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08832",
    "Nombre Municipio": "TUBARÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,978704",
    "Latitud": "10,873586"
  },
  {
    "Código Departamento": "08",
    "Nombre Departamento": "ATLÁNTICO",
    "Código Municipio": "08849",
    "Nombre Municipio": "USIACURÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,976985",
    "Latitud": "10,74298"
  },
  {
    "Código Departamento": 11,
    "Nombre Departamento": "BOGOTÁ, D.C.",
    "Código Municipio": 11001,
    "Nombre Municipio": "BOGOTÁ, D.C.",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,106992",
    "Latitud": "4,649251"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13001,
    "Nombre Municipio": "CARTAGENA DE INDIAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,496269",
    "Latitud": "10,385126"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13006,
    "Nombre Municipio": "ACHÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,557676",
    "Latitud": "8,570107"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13030,
    "Nombre Municipio": "ALTOS DEL ROSARIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,164905",
    "Latitud": "8,791865"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13042,
    "Nombre Municipio": "ARENAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,941099",
    "Latitud": "8,458865"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13052,
    "Nombre Municipio": "ARJONA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,344332",
    "Latitud": "10,25666"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13062,
    "Nombre Municipio": "ARROYOHONDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,019215",
    "Latitud": "10,250075"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13074,
    "Nombre Municipio": "BARRANCO DE LOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,104391",
    "Latitud": "8,947787"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13140,
    "Nombre Municipio": "CALAMAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,916144",
    "Latitud": "10,250431"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13160,
    "Nombre Municipio": "CANTAGALLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,914605",
    "Latitud": "7,378678"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13188,
    "Nombre Municipio": "CICUCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,645981",
    "Latitud": "9,274281"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13212,
    "Nombre Municipio": "CÓRDOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,827399",
    "Latitud": "9,586942"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13222,
    "Nombre Municipio": "CLEMENCIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,328469",
    "Latitud": "10,567452"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13244,
    "Nombre Municipio": "EL CARMEN DE BOLÍVAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,121178",
    "Latitud": "9,718653"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13248,
    "Nombre Municipio": "EL GUAMO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,976084",
    "Latitud": "10,030958"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13268,
    "Nombre Municipio": "EL PEÑÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,949274",
    "Latitud": "8,988271"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13300,
    "Nombre Municipio": "HATILLO DE LOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,077912",
    "Latitud": "8,956014"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13430,
    "Nombre Municipio": "MAGANGUÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,766742",
    "Latitud": "9,263799"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13433,
    "Nombre Municipio": "MAHATES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,191643",
    "Latitud": "10,233285"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13440,
    "Nombre Municipio": "MARGARITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,285137",
    "Latitud": "9,15784"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13442,
    "Nombre Municipio": "MARÍA LA BAJA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,300516",
    "Latitud": "9,982402"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13458,
    "Nombre Municipio": "MONTECRISTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,471176",
    "Latitud": "8,297234"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13468,
    "Nombre Municipio": "SANTA CRUZ DE MOMPOX",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,42818",
    "Latitud": "9,244241"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13473,
    "Nombre Municipio": "MORALES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,868172",
    "Latitud": "8,276558"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13490,
    "Nombre Municipio": "NOROSÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,038003",
    "Latitud": "8,526259"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13549,
    "Nombre Municipio": "PINILLOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,462279",
    "Latitud": "8,914947"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13580,
    "Nombre Municipio": "REGIDOR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,821638",
    "Latitud": "8,666258"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13600,
    "Nombre Municipio": "RÍO VIEJO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,840466",
    "Latitud": "8,58795"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13620,
    "Nombre Municipio": "SAN CRISTÓBAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,065076",
    "Latitud": "10,392836"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13647,
    "Nombre Municipio": "SAN ESTANISLAO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,153101",
    "Latitud": "10,398602"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13650,
    "Nombre Municipio": "SAN FERNANDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,323811",
    "Latitud": "9,214183"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13654,
    "Nombre Municipio": "SAN JACINTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,12105",
    "Latitud": "9,830275"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13655,
    "Nombre Municipio": "SAN JACINTO DEL CAUCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,721156",
    "Latitud": "8,25158"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13657,
    "Nombre Municipio": "SAN JUAN NEPOMUCENO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,081761",
    "Latitud": "9,953751"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13667,
    "Nombre Municipio": "SAN MARTÍN DE LOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,039134",
    "Latitud": "8,937485"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13670,
    "Nombre Municipio": "SAN PABLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,924602",
    "Latitud": "7,476747"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13673,
    "Nombre Municipio": "SANTA CATALINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,287855",
    "Latitud": "10,605294"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13683,
    "Nombre Municipio": "SANTA ROSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,369824",
    "Latitud": "10,444396"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13688,
    "Nombre Municipio": "SANTA ROSA DEL SUR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,052243",
    "Latitud": "7,963938"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13744,
    "Nombre Municipio": "SIMITÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,947264",
    "Latitud": "7,953916"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13760,
    "Nombre Municipio": "SOPLAVIENTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,136404",
    "Latitud": "10,38839"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13780,
    "Nombre Municipio": "TALAIGUA NUEVO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,567479",
    "Latitud": "9,30403"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13810,
    "Nombre Municipio": "TIQUISIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,262922",
    "Latitud": "8,558666"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13836,
    "Nombre Municipio": "TURBACO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,427249",
    "Latitud": "10,348316"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13838,
    "Nombre Municipio": "TURBANÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,44265",
    "Latitud": "10,274585"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13873,
    "Nombre Municipio": "VILLANUEVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,275613",
    "Latitud": "10,444089"
  },
  {
    "Código Departamento": 13,
    "Nombre Departamento": "BOLÍVAR",
    "Código Municipio": 13894,
    "Nombre Municipio": "ZAMBRANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,817879",
    "Latitud": "9,746306"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15001,
    "Nombre Municipio": "TUNJA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,355539",
    "Latitud": "5,53988"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15022,
    "Nombre Municipio": "ALMEIDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,378933",
    "Latitud": "4,970857"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15047,
    "Nombre Municipio": "AQUITANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,88399",
    "Latitud": "5,518602"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15051,
    "Nombre Municipio": "ARCABUCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,437503",
    "Latitud": "5,755673"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15087,
    "Nombre Municipio": "BELÉN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,911641",
    "Latitud": "5,98923"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15090,
    "Nombre Municipio": "BERBEO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,12721",
    "Latitud": "5,227451"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15092,
    "Nombre Municipio": "BETÉITIVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,809014",
    "Latitud": "5,909978"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15097,
    "Nombre Municipio": "BOAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,584905",
    "Latitud": "6,330703"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15104,
    "Nombre Municipio": "BOYACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,361945",
    "Latitud": "5,454578"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15106,
    "Nombre Municipio": "BRICEÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,92326",
    "Latitud": "5,690879"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15109,
    "Nombre Municipio": "BUENAVISTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,94217",
    "Latitud": "5,512594"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15114,
    "Nombre Municipio": "BUSBANZÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,884158",
    "Latitud": "5,831393"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15131,
    "Nombre Municipio": "CALDAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,865553",
    "Latitud": "5,55458"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15135,
    "Nombre Municipio": "CAMPOHERMOSO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,104173",
    "Latitud": "5,031676"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15162,
    "Nombre Municipio": "CERINZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,947918",
    "Latitud": "5,955939"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15172,
    "Nombre Municipio": "CHINAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,368476",
    "Latitud": "5,167486"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15176,
    "Nombre Municipio": "CHIQUINQUIRÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,818745",
    "Latitud": "5,61379"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15180,
    "Nombre Municipio": "CHISCAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,500957",
    "Latitud": "6,553136"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15183,
    "Nombre Municipio": "CHITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,471892",
    "Latitud": "6,187083"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15185,
    "Nombre Municipio": "CHITARAQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,4471",
    "Latitud": "6,027425"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15187,
    "Nombre Municipio": "CHIVATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,282529",
    "Latitud": "5,558949"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15189,
    "Nombre Municipio": "CIÉNEGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,296049",
    "Latitud": "5,408694"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15204,
    "Nombre Municipio": "CÓMBITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,323957",
    "Latitud": "5,634545"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15212,
    "Nombre Municipio": "COPER",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,045636",
    "Latitud": "5,475074"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15215,
    "Nombre Municipio": "CORRALES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,844795",
    "Latitud": "5,828064"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15218,
    "Nombre Municipio": "COVARACHÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,738978",
    "Latitud": "6,500177"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15223,
    "Nombre Municipio": "CUBARÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,107939",
    "Latitud": "6,997275"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15224,
    "Nombre Municipio": "CUCAITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,454338",
    "Latitud": "5,544452"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15226,
    "Nombre Municipio": "CUÍTIVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,965923",
    "Latitud": "5,580367"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15232,
    "Nombre Municipio": "CHÍQUIZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,449463",
    "Latitud": "5,639834"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15236,
    "Nombre Municipio": "CHIVOR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,368398",
    "Latitud": "4,888173"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15238,
    "Nombre Municipio": "DUITAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,03063",
    "Latitud": "5,822964"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15244,
    "Nombre Municipio": "EL COCUY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,444537",
    "Latitud": "6,407738"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15248,
    "Nombre Municipio": "EL ESPINO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,497007",
    "Latitud": "6,483027"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15272,
    "Nombre Municipio": "FIRAVITOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,993392",
    "Latitud": "5,668885"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15276,
    "Nombre Municipio": "FLORESTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,918111",
    "Latitud": "5,859519"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15293,
    "Nombre Municipio": "GACHANTIVÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,549092",
    "Latitud": "5,751891"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15296,
    "Nombre Municipio": "GÁMEZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,80553",
    "Latitud": "5,802333"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15299,
    "Nombre Municipio": "GARAGOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,364413",
    "Latitud": "5,083234"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15317,
    "Nombre Municipio": "GUACAMAYAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,500812",
    "Latitud": "6,459667"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15322,
    "Nombre Municipio": "GUATEQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,471207",
    "Latitud": "5,007321"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15325,
    "Nombre Municipio": "GUAYATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,489698",
    "Latitud": "4,967122"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15332,
    "Nombre Municipio": "GÜICÁN DE LA SIERRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,411763",
    "Latitud": "6,462864"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15362,
    "Nombre Municipio": "IZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,979559",
    "Latitud": "5,611577"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15367,
    "Nombre Municipio": "JENESANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,363738",
    "Latitud": "5,385813"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15368,
    "Nombre Municipio": "JERICÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,571122",
    "Latitud": "6,145735"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15377,
    "Nombre Municipio": "LABRANZAGRANDE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,57777",
    "Latitud": "5,562687"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15380,
    "Nombre Municipio": "LA CAPILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,444347",
    "Latitud": "5,095687"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15401,
    "Nombre Municipio": "LA VICTORIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,234393",
    "Latitud": "5,523792"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15403,
    "Nombre Municipio": "LA UVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,559982",
    "Latitud": "6,31616"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15407,
    "Nombre Municipio": "VILLA DE LEYVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,524948",
    "Latitud": "5,632455"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15425,
    "Nombre Municipio": "MACANAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,319593",
    "Latitud": "4,972464"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15442,
    "Nombre Municipio": "MARIPÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,00405",
    "Latitud": "5,550091"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15455,
    "Nombre Municipio": "MIRAFLORES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,14563",
    "Latitud": "5,196515"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15464,
    "Nombre Municipio": "MONGUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,79809",
    "Latitud": "5,754242"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15466,
    "Nombre Municipio": "MONGUÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,849292",
    "Latitud": "5,723486"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15469,
    "Nombre Municipio": "MONIQUIRÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,573374",
    "Latitud": "5,876331"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15476,
    "Nombre Municipio": "MOTAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,367841",
    "Latitud": "5,5777"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15480,
    "Nombre Municipio": "MUZO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,10269",
    "Latitud": "5,532758"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15491,
    "Nombre Municipio": "NOBSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,937042",
    "Latitud": "5,768046"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15494,
    "Nombre Municipio": "NUEVO COLÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,456759",
    "Latitud": "5,355317"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15500,
    "Nombre Municipio": "OICATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,308399",
    "Latitud": "5,595235"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15507,
    "Nombre Municipio": "OTANCHE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,180965",
    "Latitud": "5,657536"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15511,
    "Nombre Municipio": "PACHAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,396953",
    "Latitud": "5,140065"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15514,
    "Nombre Municipio": "PÁEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,052737",
    "Latitud": "5,097319"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15516,
    "Nombre Municipio": "PAIPA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,11782",
    "Latitud": "5,779894"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15518,
    "Nombre Municipio": "PAJARITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,703231",
    "Latitud": "5,293783"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15522,
    "Nombre Municipio": "PANQUEBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,459424",
    "Latitud": "6,443416"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15531,
    "Nombre Municipio": "PAUNA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,978449",
    "Latitud": "5,656323"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15533,
    "Nombre Municipio": "PAYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,423775",
    "Latitud": "5,625699"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15537,
    "Nombre Municipio": "PAZ DE RÍO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,749137",
    "Latitud": "5,987645"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15542,
    "Nombre Municipio": "PESCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,050872",
    "Latitud": "5,558808"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15550,
    "Nombre Municipio": "PISBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,486023",
    "Latitud": "5,72141"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15572,
    "Nombre Municipio": "PUERTO BOYACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,587782",
    "Latitud": "5,976646"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15580,
    "Nombre Municipio": "QUÍPAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,180033",
    "Latitud": "5,52055"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15599,
    "Nombre Municipio": "RAMIRIQUÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,334839",
    "Latitud": "5,400303"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15600,
    "Nombre Municipio": "RÁQUIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,632543",
    "Latitud": "5,539136"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15621,
    "Nombre Municipio": "RONDÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,208474",
    "Latitud": "5,357378"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15632,
    "Nombre Municipio": "SABOYÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,764456",
    "Latitud": "5,697756"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15638,
    "Nombre Municipio": "SÁCHICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,542539",
    "Latitud": "5,584305"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15646,
    "Nombre Municipio": "SAMACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,485589",
    "Latitud": "5,492161"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15660,
    "Nombre Municipio": "SAN EDUARDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,077747",
    "Latitud": "5,22401"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15664,
    "Nombre Municipio": "SAN JOSÉ DE PARE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,545397",
    "Latitud": "6,018924"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15667,
    "Nombre Municipio": "SAN LUIS DE GACENO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,168076",
    "Latitud": "4,81976"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15673,
    "Nombre Municipio": "SAN MATEO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,555264",
    "Latitud": "6,401683"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15676,
    "Nombre Municipio": "SAN MIGUEL DE SEMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,722009",
    "Latitud": "5,518083"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15681,
    "Nombre Municipio": "SAN PABLO DE BORBUR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,069963",
    "Latitud": "5,650743"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15686,
    "Nombre Municipio": "SANTANA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,481639",
    "Latitud": "6,056866"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15690,
    "Nombre Municipio": "SANTA MARÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,263518",
    "Latitud": "4,857193"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15693,
    "Nombre Municipio": "SANTA ROSA DE VITERBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,982461",
    "Latitud": "5,874547"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15696,
    "Nombre Municipio": "SANTA SOFÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,602707",
    "Latitud": "5,713269"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15720,
    "Nombre Municipio": "SATIVANORTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,708458",
    "Latitud": "6,131132"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15723,
    "Nombre Municipio": "SATIVASUR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,712435",
    "Latitud": "6,093183"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15740,
    "Nombre Municipio": "SIACHOQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,24466",
    "Latitud": "5,511811"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15753,
    "Nombre Municipio": "SOATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,684051",
    "Latitud": "6,331945"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15755,
    "Nombre Municipio": "SOCOTÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,636653",
    "Latitud": "6,041162"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15757,
    "Nombre Municipio": "SOCHA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,691963",
    "Latitud": "5,996717"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15759,
    "Nombre Municipio": "SOGAMOSO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,924355",
    "Latitud": "5,723976"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15761,
    "Nombre Municipio": "SOMONDOCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,433393",
    "Latitud": "4,985726"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15762,
    "Nombre Municipio": "SORA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,450153",
    "Latitud": "5,56684"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15763,
    "Nombre Municipio": "SOTAQUIRÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,246585",
    "Latitud": "5,764986"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15764,
    "Nombre Municipio": "SORACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,332804",
    "Latitud": "5,500898"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15774,
    "Nombre Municipio": "SUSACÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,690289",
    "Latitud": "6,230332"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15776,
    "Nombre Municipio": "SUTAMARCHÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,620536",
    "Latitud": "5,619781"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15778,
    "Nombre Municipio": "SUTATENZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,452317",
    "Latitud": "5,022989"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15790,
    "Nombre Municipio": "TASCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,781011",
    "Latitud": "5,909821"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15798,
    "Nombre Municipio": "TENZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,421176",
    "Latitud": "5,076781"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15804,
    "Nombre Municipio": "TIBANÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,396457",
    "Latitud": "5,317251"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15806,
    "Nombre Municipio": "TIBASOSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,999449",
    "Latitud": "5,74723"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15808,
    "Nombre Municipio": "TINJACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,646847",
    "Latitud": "5,579713"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15810,
    "Nombre Municipio": "TIPACOQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,691729",
    "Latitud": "6,419203"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15814,
    "Nombre Municipio": "TOCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,184794",
    "Latitud": "5,566464"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15816,
    "Nombre Municipio": "TOGÜÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,513655",
    "Latitud": "5,937438"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15820,
    "Nombre Municipio": "TÓPAGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,832245",
    "Latitud": "5,768201"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15822,
    "Nombre Municipio": "TOTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,985898",
    "Latitud": "5,560497"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15832,
    "Nombre Municipio": "TUNUNGUÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,933155",
    "Latitud": "5,730582"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15835,
    "Nombre Municipio": "TURMEQUÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,491825",
    "Latitud": "5,323261"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15837,
    "Nombre Municipio": "TUTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,230285",
    "Latitud": "5,689082"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15839,
    "Nombre Municipio": "TUTAZÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,856035",
    "Latitud": "6,032608"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15842,
    "Nombre Municipio": "ÚMBITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,456917",
    "Latitud": "5,221176"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15861,
    "Nombre Municipio": "VENTAQUEMADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,522368",
    "Latitud": "5,368739"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15879,
    "Nombre Municipio": "VIRACACHÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,296894",
    "Latitud": "5,436833"
  },
  {
    "Código Departamento": 15,
    "Nombre Departamento": "BOYACÁ",
    "Código Municipio": 15897,
    "Nombre Municipio": "ZETAQUIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,17098",
    "Latitud": "5,283443"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17001,
    "Nombre Municipio": "MANIZALES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,491025",
    "Latitud": "5,057657"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17013,
    "Nombre Municipio": "AGUADAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,45487",
    "Latitud": "5,610244"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17042,
    "Nombre Municipio": "ANSERMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,784343",
    "Latitud": "5,236471"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17050,
    "Nombre Municipio": "ARANZAZU",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,49129",
    "Latitud": "5,271195"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17088,
    "Nombre Municipio": "BELALCÁZAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,811918",
    "Latitud": "4,993785"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17174,
    "Nombre Municipio": "CHINCHINÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,607529",
    "Latitud": "4,985227"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17272,
    "Nombre Municipio": "FILADELFIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,562474",
    "Latitud": "5,297091"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17380,
    "Nombre Municipio": "LA DORADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,668819",
    "Latitud": "5,460834"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17388,
    "Nombre Municipio": "LA MERCED",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,546486",
    "Latitud": "5,39647"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17433,
    "Nombre Municipio": "MANZANARES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,152829",
    "Latitud": "5,255699"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17442,
    "Nombre Municipio": "MARMATO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,600049",
    "Latitud": "5,47422"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17444,
    "Nombre Municipio": "MARQUETALIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,053097",
    "Latitud": "5,297525"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17446,
    "Nombre Municipio": "MARULANDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,259721",
    "Latitud": "5,284304"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17486,
    "Nombre Municipio": "NEIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,520006",
    "Latitud": "5,166895"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17495,
    "Nombre Municipio": "NORCASIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,889543",
    "Latitud": "5,574796"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17513,
    "Nombre Municipio": "PÁCORA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,459621",
    "Latitud": "5,527172"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17524,
    "Nombre Municipio": "PALESTINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,624577",
    "Latitud": "5,017879"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17541,
    "Nombre Municipio": "PENSILVANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,160299",
    "Latitud": "5,383281"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17614,
    "Nombre Municipio": "RIOSUCIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,702104",
    "Latitud": "5,423673"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17616,
    "Nombre Municipio": "RISARALDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,76722",
    "Latitud": "5,164509"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17653,
    "Nombre Municipio": "SALAMINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,487223",
    "Latitud": "5,403025"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17662,
    "Nombre Municipio": "SAMANÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,992263",
    "Latitud": "5,41308"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17665,
    "Nombre Municipio": "SAN JOSÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,792063",
    "Latitud": "5,08231"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17777,
    "Nombre Municipio": "SUPÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,64966",
    "Latitud": "5,446843"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17867,
    "Nombre Municipio": "VICTORIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,911239",
    "Latitud": "5,317437"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17873,
    "Nombre Municipio": "VILLAMARÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,502487",
    "Latitud": "5,038925"
  },
  {
    "Código Departamento": 17,
    "Nombre Departamento": "CALDAS",
    "Código Municipio": 17877,
    "Nombre Municipio": "VITERBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,87061",
    "Latitud": "5,062664"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18001,
    "Nombre Municipio": "FLORENCIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,609831",
    "Latitud": "1,618196"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18029,
    "Nombre Municipio": "ALBANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,878375",
    "Latitud": "1,328526"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18094,
    "Nombre Municipio": "BELÉN DE LOS ANDAQUÍES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,872405",
    "Latitud": "1,415812"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18150,
    "Nombre Municipio": "CARTAGENA DEL CHAIRÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,847867",
    "Latitud": "1,332371"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18205,
    "Nombre Municipio": "CURILLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,919205",
    "Latitud": "1,033473"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18247,
    "Nombre Municipio": "EL DONCELLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,283631",
    "Latitud": "1,679951"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18256,
    "Nombre Municipio": "EL PAUJÍL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,326093",
    "Latitud": "1,570226"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18410,
    "Nombre Municipio": "LA MONTAÑITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,436408",
    "Latitud": "1,479173"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18460,
    "Nombre Municipio": "MILÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,506926",
    "Latitud": "1,29021"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18479,
    "Nombre Municipio": "MORELIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,724146",
    "Latitud": "1,486611"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18592,
    "Nombre Municipio": "PUERTO RICO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,157604",
    "Latitud": "1,909063"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18610,
    "Nombre Municipio": "SAN JOSÉ DEL FRAGUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,973796",
    "Latitud": "1,330266"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18753,
    "Nombre Municipio": "SAN VICENTE DEL CAGUÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,767894",
    "Latitud": "2,119413"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18756,
    "Nombre Municipio": "SOLANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,253702",
    "Latitud": "0,699077"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18785,
    "Nombre Municipio": "SOLITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,619902",
    "Latitud": "0,87654"
  },
  {
    "Código Departamento": 18,
    "Nombre Departamento": "CAQUETÁ",
    "Código Municipio": 18860,
    "Nombre Municipio": "VALPARAÍSO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,70671",
    "Latitud": "1,194619"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19001,
    "Nombre Municipio": "POPAYÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,599377",
    "Latitud": "2,459641"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19022,
    "Nombre Municipio": "ALMAGUER",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,85607",
    "Latitud": "1,913429"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19050,
    "Nombre Municipio": "ARGELIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,24905",
    "Latitud": "2,257427"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19075,
    "Nombre Municipio": "BALBOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,215773",
    "Latitud": "2,040998"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19100,
    "Nombre Municipio": "BOLÍVAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,966215",
    "Latitud": "1,837538"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19110,
    "Nombre Municipio": "BUENOS AIRES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,642238",
    "Latitud": "3,015382"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19130,
    "Nombre Municipio": "CAJIBÍO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,570682",
    "Latitud": "2,623371"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19137,
    "Nombre Municipio": "CALDONO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,484319",
    "Latitud": "2,798059"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19142,
    "Nombre Municipio": "CALOTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,408941",
    "Latitud": "3,034531"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19212,
    "Nombre Municipio": "CORINTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,261866",
    "Latitud": "3,173854"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19256,
    "Nombre Municipio": "EL TAMBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,810911",
    "Latitud": "2,451409"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19290,
    "Nombre Municipio": "FLORENCIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,072547",
    "Latitud": "1,682535"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19300,
    "Nombre Municipio": "GUACHENÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,392189",
    "Latitud": "3,134153"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19318,
    "Nombre Municipio": "GUAPI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,88797",
    "Latitud": "2,571337"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19355,
    "Nombre Municipio": "INZÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,063503",
    "Latitud": "2,549183"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19364,
    "Nombre Municipio": "JAMBALÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,323877",
    "Latitud": "2,777834"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19392,
    "Nombre Municipio": "LA SIERRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,763278",
    "Latitud": "2,179383"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19397,
    "Nombre Municipio": "LA VEGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,778771",
    "Latitud": "2,001803"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19418,
    "Nombre Municipio": "LÓPEZ DE MICAY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,247803",
    "Latitud": "2,846788"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19450,
    "Nombre Municipio": "MERCADERES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,164319",
    "Latitud": "1,789193"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19455,
    "Nombre Municipio": "MIRANDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,228722",
    "Latitud": "3,254651"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19473,
    "Nombre Municipio": "MORALES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,629106",
    "Latitud": "2,754684"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19513,
    "Nombre Municipio": "PADILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,313265",
    "Latitud": "3,220984"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19517,
    "Nombre Municipio": "PÁEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,970685",
    "Latitud": "2,645724"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19532,
    "Nombre Municipio": "PATÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,981075",
    "Latitud": "2,115875"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19533,
    "Nombre Municipio": "PIAMONTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,327588",
    "Latitud": "1,11754"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19548,
    "Nombre Municipio": "PIENDAMÓ - TUNÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,528615",
    "Latitud": "2,64228"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19573,
    "Nombre Municipio": "PUERTO TEJADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,417673",
    "Latitud": "3,233254"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19585,
    "Nombre Municipio": "PURACÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,496698",
    "Latitud": "2,341507"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19622,
    "Nombre Municipio": "ROSAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,740336",
    "Latitud": "2,260941"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19693,
    "Nombre Municipio": "SAN SEBASTIÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,769467",
    "Latitud": "1,838451"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19698,
    "Nombre Municipio": "SANTANDER DE QUILICHAO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,485141",
    "Latitud": "3,015008"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19701,
    "Nombre Municipio": "SANTA ROSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,573252",
    "Latitud": "1,700916"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19743,
    "Nombre Municipio": "SILVIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,379753",
    "Latitud": "2,611927"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19760,
    "Nombre Municipio": "SOTARÁ - PAISPAMBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,613365",
    "Latitud": "2,253156"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19780,
    "Nombre Municipio": "SUÁREZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,69357",
    "Latitud": "2,959785"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19785,
    "Nombre Municipio": "SUCRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,926279",
    "Latitud": "2,038237"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19807,
    "Nombre Municipio": "TIMBÍO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,684476",
    "Latitud": "2,349686"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19809,
    "Nombre Municipio": "TIMBIQUÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,667541",
    "Latitud": "2,777312"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19821,
    "Nombre Municipio": "TORIBÍO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,270284",
    "Latitud": "2,953017"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19824,
    "Nombre Municipio": "TOTORÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,403628",
    "Latitud": "2,510252"
  },
  {
    "Código Departamento": 19,
    "Nombre Departamento": "CAUCA",
    "Código Municipio": 19845,
    "Nombre Municipio": "VILLA RICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,458025",
    "Latitud": "3,17762"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20001,
    "Nombre Municipio": "VALLEDUPAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,259398",
    "Latitud": "10,460472"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20011,
    "Nombre Municipio": "AGUACHICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,614027",
    "Latitud": "8,306811"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20013,
    "Nombre Municipio": "AGUSTÍN CODAZZI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,238389",
    "Latitud": "10,040454"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20032,
    "Nombre Municipio": "ASTREA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,975842",
    "Latitud": "9,498062"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20045,
    "Nombre Municipio": "BECERRIL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,278707",
    "Latitud": "9,704404"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20060,
    "Nombre Municipio": "BOSCONIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,888761",
    "Latitud": "9,975098"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20175,
    "Nombre Municipio": "CHIMICHAGUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,813278",
    "Latitud": "9,25875"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20178,
    "Nombre Municipio": "CHIRIGUANÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,599913",
    "Latitud": "9,361058"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20228,
    "Nombre Municipio": "CURUMANÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,540843",
    "Latitud": "9,201716"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20238,
    "Nombre Municipio": "EL COPEY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,962703",
    "Latitud": "10,149883"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20250,
    "Nombre Municipio": "EL PASO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,742012",
    "Latitud": "9,668461"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20295,
    "Nombre Municipio": "GAMARRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,737558",
    "Latitud": "8,324793"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20310,
    "Nombre Municipio": "GONZÁLEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,38004",
    "Latitud": "8,389604"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20383,
    "Nombre Municipio": "LA GLORIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,80321",
    "Latitud": "8,619298"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20400,
    "Nombre Municipio": "LA JAGUA DE IBIRICO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,334143",
    "Latitud": "9,563752"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20443,
    "Nombre Municipio": "MANAURE BALCÓN DEL CESAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,029472",
    "Latitud": "10,390776"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20517,
    "Nombre Municipio": "PAILITAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,625825",
    "Latitud": "8,959399"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20550,
    "Nombre Municipio": "PELAYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,666735",
    "Latitud": "8,689451"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20570,
    "Nombre Municipio": "PUEBLO BELLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,586211",
    "Latitud": "10,417321"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20614,
    "Nombre Municipio": "RÍO DE ORO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,386393",
    "Latitud": "8,292292"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20621,
    "Nombre Municipio": "LA PAZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,171365",
    "Latitud": "10,387552"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20710,
    "Nombre Municipio": "SAN ALBERTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,393889",
    "Latitud": "7,76111"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20750,
    "Nombre Municipio": "SAN DIEGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,181208",
    "Latitud": "10,333039"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20770,
    "Nombre Municipio": "SAN MARTÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,510914",
    "Latitud": "7,999855"
  },
  {
    "Código Departamento": 20,
    "Nombre Departamento": "CESAR",
    "Código Municipio": 20787,
    "Nombre Municipio": "TAMALAMEQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,812172",
    "Latitud": "8,861725"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23001,
    "Nombre Municipio": "MONTERÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,873096",
    "Latitud": "8,759789"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23068,
    "Nombre Municipio": "AYAPEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,146048",
    "Latitud": "8,313838"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23079,
    "Nombre Municipio": "BUENAVISTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,480897",
    "Latitud": "8,221187"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23090,
    "Nombre Municipio": "CANALETE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,241476",
    "Latitud": "8,786939"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23162,
    "Nombre Municipio": "CERETÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,796093",
    "Latitud": "8,888532"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23168,
    "Nombre Municipio": "CHIMÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,626886",
    "Latitud": "9,149698"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23182,
    "Nombre Municipio": "CHINÚ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,399633",
    "Latitud": "9,105473"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23189,
    "Nombre Municipio": "CIÉNAGA DE ORO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,620807",
    "Latitud": "8,875794"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23300,
    "Nombre Municipio": "COTORRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,799216",
    "Latitud": "9,037163"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23350,
    "Nombre Municipio": "LA APARTADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,336031",
    "Latitud": "8,050125"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23417,
    "Nombre Municipio": "LORICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,816084",
    "Latitud": "9,240789"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23419,
    "Nombre Municipio": "LOS CÓRDOBAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,35518",
    "Latitud": "8,892098"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23464,
    "Nombre Municipio": "MOMIL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,67796",
    "Latitud": "9,240707"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23466,
    "Nombre Municipio": "MONTELÍBANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,416818",
    "Latitud": "7,973777"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23500,
    "Nombre Municipio": "MOÑITOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,1291",
    "Latitud": "9,245223"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23555,
    "Nombre Municipio": "PLANETA RICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,583241",
    "Latitud": "8,4082"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23570,
    "Nombre Municipio": "PUEBLO NUEVO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,508035",
    "Latitud": "8,504099"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23574,
    "Nombre Municipio": "PUERTO ESCONDIDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,260411",
    "Latitud": "9,005372"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23580,
    "Nombre Municipio": "PUERTO LIBERTADOR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,671761",
    "Latitud": "7,888859"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23586,
    "Nombre Municipio": "PURÍSIMA DE LA CONCEPCIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,724987",
    "Latitud": "9,239295"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23660,
    "Nombre Municipio": "SAHAGÚN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,445834",
    "Latitud": "8,943048"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23670,
    "Nombre Municipio": "SAN ANDRÉS DE SOTAVENTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,50879",
    "Latitud": "9,145448"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23672,
    "Nombre Municipio": "SAN ANTERO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,76112",
    "Latitud": "9,376434"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23675,
    "Nombre Municipio": "SAN BERNARDO DEL VIENTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,955107",
    "Latitud": "9,35247"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23678,
    "Nombre Municipio": "SAN CARLOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,698799",
    "Latitud": "8,799282"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23682,
    "Nombre Municipio": "SAN JOSÉ DE URÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,533476",
    "Latitud": "7,787303"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23686,
    "Nombre Municipio": "SAN PELAYO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,835615",
    "Latitud": "8,958436"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23807,
    "Nombre Municipio": "TIERRALTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,059797",
    "Latitud": "8,170612"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23815,
    "Nombre Municipio": "TUCHÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,553962",
    "Latitud": "9,186625"
  },
  {
    "Código Departamento": 23,
    "Nombre Departamento": "CÓRDOBA",
    "Código Municipio": 23855,
    "Nombre Municipio": "VALENCIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,150756",
    "Latitud": "8,255016"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25001,
    "Nombre Municipio": "AGUA DE DIOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,669221",
    "Latitud": "4,375309"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25019,
    "Nombre Municipio": "ALBÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,438261",
    "Latitud": "4,878022"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25035,
    "Nombre Municipio": "ANAPOIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,528676",
    "Latitud": "4,562737"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25040,
    "Nombre Municipio": "ANOLAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,46384",
    "Latitud": "4,7617"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25053,
    "Nombre Municipio": "ARBELÁEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,414901",
    "Latitud": "4,272534"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25086,
    "Nombre Municipio": "BELTRÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,741666",
    "Latitud": "4,802832"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25095,
    "Nombre Municipio": "BITUIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,539609",
    "Latitud": "4,872171"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25099,
    "Nombre Municipio": "BOJACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,344594",
    "Latitud": "4,737205"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25120,
    "Nombre Municipio": "CABRERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,484549",
    "Latitud": "3,985164"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25123,
    "Nombre Municipio": "CACHIPAY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,435711",
    "Latitud": "4,730957"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25126,
    "Nombre Municipio": "CAJICÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,02298",
    "Latitud": "4,920009"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25148,
    "Nombre Municipio": "CAPARRAPÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,491045",
    "Latitud": "5,34758"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25151,
    "Nombre Municipio": "CÁQUEZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,946473",
    "Latitud": "4,404112"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25154,
    "Nombre Municipio": "CARMEN DE CARUPA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,901357",
    "Latitud": "5,349119"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25168,
    "Nombre Municipio": "CHAGUANÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,593455",
    "Latitud": "4,948916"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25175,
    "Nombre Municipio": "CHÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,05",
    "Latitud": "4,866508"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25178,
    "Nombre Municipio": "CHIPAQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,044876",
    "Latitud": "4,442671"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25181,
    "Nombre Municipio": "CHOACHÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,922894",
    "Latitud": "4,527048"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25183,
    "Nombre Municipio": "CHOCONTÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,683533",
    "Latitud": "5,145224"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25200,
    "Nombre Municipio": "COGUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,978497",
    "Latitud": "5,061842"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25214,
    "Nombre Municipio": "COTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,102569",
    "Latitud": "4,812564"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25224,
    "Nombre Municipio": "CUCUNUBÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,766113",
    "Latitud": "5,249795"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25245,
    "Nombre Municipio": "EL COLEGIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,442261",
    "Latitud": "4,577951"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25258,
    "Nombre Municipio": "EL PEÑÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,290207",
    "Latitud": "5,248747"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25260,
    "Nombre Municipio": "EL ROSAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,263103",
    "Latitud": "4,850589"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25269,
    "Nombre Municipio": "FACATATIVÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,350085",
    "Latitud": "4,813353"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25279,
    "Nombre Municipio": "FÓMEQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,892523",
    "Latitud": "4,485474"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25281,
    "Nombre Municipio": "FOSCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,93902",
    "Latitud": "4,339093"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25286,
    "Nombre Municipio": "FUNZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,201528",
    "Latitud": "4,710412"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25288,
    "Nombre Municipio": "FÚQUENE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,795855",
    "Latitud": "5,403997"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25290,
    "Nombre Municipio": "FUSAGASUGÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,37543",
    "Latitud": "4,336723"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25293,
    "Nombre Municipio": "GACHALÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,520161",
    "Latitud": "4,693579"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25295,
    "Nombre Municipio": "GACHANCIPÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,873464",
    "Latitud": "4,990947"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25297,
    "Nombre Municipio": "GACHETÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,636377",
    "Latitud": "4,816411"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25299,
    "Nombre Municipio": "GAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,611037",
    "Latitud": "4,763325"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25307,
    "Nombre Municipio": "GIRARDOT",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,798201",
    "Latitud": "4,313069"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25312,
    "Nombre Municipio": "GRANADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,350766",
    "Latitud": "4,519763"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25317,
    "Nombre Municipio": "GUACHETÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,686972",
    "Latitud": "5,383378"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25320,
    "Nombre Municipio": "GUADUAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,603402",
    "Latitud": "5,072076"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25322,
    "Nombre Municipio": "GUASCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,877143",
    "Latitud": "4,866719"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25324,
    "Nombre Municipio": "GUATAQUÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,790058",
    "Latitud": "4,517517"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25326,
    "Nombre Municipio": "GUATAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,83293",
    "Latitud": "4,935211"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25328,
    "Nombre Municipio": "GUAYABAL DE SÍQUIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,467437",
    "Latitud": "4,877968"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25335,
    "Nombre Municipio": "GUAYABETAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,815107",
    "Latitud": "4,215306"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25339,
    "Nombre Municipio": "GUTIÉRREZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,003042",
    "Latitud": "4,254679"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25368,
    "Nombre Municipio": "JERUSALÉN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,695474",
    "Latitud": "4,562273"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25372,
    "Nombre Municipio": "JUNÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,662961",
    "Latitud": "4,79057"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25377,
    "Nombre Municipio": "LA CALERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,968161",
    "Latitud": "4,721104"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25386,
    "Nombre Municipio": "LA MESA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,461588",
    "Latitud": "4,631028"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25394,
    "Nombre Municipio": "LA PALMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,391022",
    "Latitud": "5,358816"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25398,
    "Nombre Municipio": "LA PEÑA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,394105",
    "Latitud": "5,198945"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25402,
    "Nombre Municipio": "LA VEGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,336885",
    "Latitud": "4,997768"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25407,
    "Nombre Municipio": "LENGUAZAQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,711512",
    "Latitud": "5,306131"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25426,
    "Nombre Municipio": "MACHETÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,608226",
    "Latitud": "5,08007"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25430,
    "Nombre Municipio": "MADRID",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,265854",
    "Latitud": "4,732791"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25436,
    "Nombre Municipio": "MANTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,540444",
    "Latitud": "5,009008"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25438,
    "Nombre Municipio": "MEDINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,348449",
    "Latitud": "4,506298"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25473,
    "Nombre Municipio": "MOSQUERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,221154",
    "Latitud": "4,70653"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25483,
    "Nombre Municipio": "NARIÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,824732",
    "Latitud": "4,399837"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25486,
    "Nombre Municipio": "NEMOCÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,877888",
    "Latitud": "5,068705"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25488,
    "Nombre Municipio": "NILO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,620009",
    "Latitud": "4,305838"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25489,
    "Nombre Municipio": "NIMAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,38604",
    "Latitud": "5,125992"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25491,
    "Nombre Municipio": "NOCAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,379093",
    "Latitud": "5,069466"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25506,
    "Nombre Municipio": "VENECIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,478301",
    "Latitud": "4,089056"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25513,
    "Nombre Municipio": "PACHO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,156132",
    "Latitud": "5,136907"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25518,
    "Nombre Municipio": "PAIME",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,152213",
    "Latitud": "5,370487"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25524,
    "Nombre Municipio": "PANDI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,486641",
    "Latitud": "4,190393"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25530,
    "Nombre Municipio": "PARATEBUENO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,212825",
    "Latitud": "4,374832"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25535,
    "Nombre Municipio": "PASCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,302276",
    "Latitud": "4,308979"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25572,
    "Nombre Municipio": "PUERTO SALGAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,653695",
    "Latitud": "5,465413"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25580,
    "Nombre Municipio": "PULÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,71438",
    "Latitud": "4,682022"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25592,
    "Nombre Municipio": "QUEBRADANEGRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,48014",
    "Latitud": "5,118076"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25594,
    "Nombre Municipio": "QUETAME",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,863214",
    "Latitud": "4,329884"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25596,
    "Nombre Municipio": "QUIPILE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,533705",
    "Latitud": "4,74481"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25599,
    "Nombre Municipio": "APULO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,593926",
    "Latitud": "4,520304"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25612,
    "Nombre Municipio": "RICAURTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,772861",
    "Latitud": "4,282113"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25645,
    "Nombre Municipio": "SAN ANTONIO DEL TEQUENDAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,351443",
    "Latitud": "4,616138"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25649,
    "Nombre Municipio": "SAN BERNARDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,42296",
    "Latitud": "4,179433"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25653,
    "Nombre Municipio": "SAN CAYETANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,024754",
    "Latitud": "5,332938"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25658,
    "Nombre Municipio": "SAN FRANCISCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,289672",
    "Latitud": "4,972917"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25662,
    "Nombre Municipio": "SAN JUAN DE RIOSECO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,621919",
    "Latitud": "4,847575"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25718,
    "Nombre Municipio": "SASAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,432628",
    "Latitud": "4,962167"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25736,
    "Nombre Municipio": "SESQUILÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,796099",
    "Latitud": "5,04476"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25740,
    "Nombre Municipio": "SIBATÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,257874",
    "Latitud": "4,492625"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25743,
    "Nombre Municipio": "SILVANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,405534",
    "Latitud": "4,381981"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25745,
    "Nombre Municipio": "SIMIJACA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,850703",
    "Latitud": "5,505231"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25754,
    "Nombre Municipio": "SOACHA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,215463",
    "Latitud": "4,579268"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25758,
    "Nombre Municipio": "SOPÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,943328",
    "Latitud": "4,915395"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25769,
    "Nombre Municipio": "SUBACHOQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,172773",
    "Latitud": "4,929118"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25772,
    "Nombre Municipio": "SUESCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,798227",
    "Latitud": "5,103495"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25777,
    "Nombre Municipio": "SUPATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,235403",
    "Latitud": "5,06162"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25779,
    "Nombre Municipio": "SUSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,813938",
    "Latitud": "5,455291"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25781,
    "Nombre Municipio": "SUTATAUSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,853159",
    "Latitud": "5,247482"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25785,
    "Nombre Municipio": "TABIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,096461",
    "Latitud": "4,916832"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25793,
    "Nombre Municipio": "TAUSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,887813",
    "Latitud": "5,196333"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25797,
    "Nombre Municipio": "TENA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,389193",
    "Latitud": "4,655286"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25799,
    "Nombre Municipio": "TENJO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,143724",
    "Latitud": "4,872014"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25805,
    "Nombre Municipio": "TIBACUY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,452662",
    "Latitud": "4,348605"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25807,
    "Nombre Municipio": "TIBIRITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,504514",
    "Latitud": "5,052278"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25815,
    "Nombre Municipio": "TOCAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,636296",
    "Latitud": "4,459279"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25817,
    "Nombre Municipio": "TOCANCIPÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,91207",
    "Latitud": "4,964641"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25823,
    "Nombre Municipio": "TOPAIPÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,300626",
    "Latitud": "5,336224"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25839,
    "Nombre Municipio": "UBALÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,531489",
    "Latitud": "4,74762"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25841,
    "Nombre Municipio": "UBAQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,933477",
    "Latitud": "4,483788"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25843,
    "Nombre Municipio": "VILLA DE SAN DIEGO DE UBATÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,814367",
    "Latitud": "5,307463"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25845,
    "Nombre Municipio": "UNE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,025183",
    "Latitud": "4,40245"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25851,
    "Nombre Municipio": "ÚTICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,483154",
    "Latitud": "5,19055"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25862,
    "Nombre Municipio": "VERGARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,346163",
    "Latitud": "5,117258"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25867,
    "Nombre Municipio": "VIANÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,56132",
    "Latitud": "4,875208"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25871,
    "Nombre Municipio": "VILLAGÓMEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,195145",
    "Latitud": "5,273024"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25873,
    "Nombre Municipio": "VILLAPINZÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,595704",
    "Latitud": "5,216393"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25875,
    "Nombre Municipio": "VILLETA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,469686",
    "Latitud": "5,012754"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25878,
    "Nombre Municipio": "VIOTÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,523131",
    "Latitud": "4,43935"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25885,
    "Nombre Municipio": "YACOPÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,33806",
    "Latitud": "5,459272"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25898,
    "Nombre Municipio": "ZIPACÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,379566",
    "Latitud": "4,759932"
  },
  {
    "Código Departamento": 25,
    "Nombre Departamento": "CUNDINAMARCA",
    "Código Municipio": 25899,
    "Nombre Municipio": "ZIPAQUIRÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,994444",
    "Latitud": "5,025477"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27001,
    "Nombre Municipio": "QUIBDÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,638144",
    "Latitud": "5,682166"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27006,
    "Nombre Municipio": "ACANDÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,279951",
    "Latitud": "8,512178"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27025,
    "Nombre Municipio": "ALTO BAUDÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,974373",
    "Latitud": "5,516221"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27050,
    "Nombre Municipio": "ATRATO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,635674",
    "Latitud": "5,531419"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27073,
    "Nombre Municipio": "BAGADÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,416063",
    "Latitud": "5,409681"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27075,
    "Nombre Municipio": "BAHÍA SOLANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,401359",
    "Latitud": "6,222807"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27077,
    "Nombre Municipio": "BAJO BAUDÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,365717",
    "Latitud": "4,954576"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27099,
    "Nombre Municipio": "BOJAYÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,886773",
    "Latitud": "6,559708"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27135,
    "Nombre Municipio": "EL CANTÓN DEL SAN PABLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,726844",
    "Latitud": "5,335321"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27150,
    "Nombre Municipio": "CARMEN DEL DARIÉN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,970798",
    "Latitud": "7,158294"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27160,
    "Nombre Municipio": "CÉRTEGUI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,607619",
    "Latitud": "5,371373"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27205,
    "Nombre Municipio": "CONDOTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,650683",
    "Latitud": "5,091003"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27245,
    "Nombre Municipio": "EL CARMEN DE ATRATO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,142112",
    "Latitud": "5,899789"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27250,
    "Nombre Municipio": "EL LITORAL DEL SAN JUAN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,363702",
    "Latitud": "4,259564"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27361,
    "Nombre Municipio": "ISTMINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,68518",
    "Latitud": "5,153946"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27372,
    "Nombre Municipio": "JURADÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,762751",
    "Latitud": "7,103619"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27413,
    "Nombre Municipio": "LLORÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,545147",
    "Latitud": "5,49789"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27425,
    "Nombre Municipio": "MEDIO ATRATO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,783042",
    "Latitud": "5,994935"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27430,
    "Nombre Municipio": "MEDIO BAUDÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,950891",
    "Latitud": "5,192471"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27450,
    "Nombre Municipio": "MEDIO SAN JUAN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,694409",
    "Latitud": "5,098291"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27491,
    "Nombre Municipio": "NÓVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,609467",
    "Latitud": "4,956063"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27493,
    "Nombre Municipio": "NUEVO BELÉN DE BAJIRÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,71727",
    "Latitud": "7,3719"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27495,
    "Nombre Municipio": "NUQUÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,265507",
    "Latitud": "5,709812"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27580,
    "Nombre Municipio": "RÍO IRÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,472925",
    "Latitud": "5,1863"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27600,
    "Nombre Municipio": "RÍO QUITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,740684",
    "Latitud": "5,483667"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27615,
    "Nombre Municipio": "RIOSUCIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,113156",
    "Latitud": "7,436704"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27660,
    "Nombre Municipio": "SAN JOSÉ DEL PALMAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,234227",
    "Latitud": "4,896954"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27745,
    "Nombre Municipio": "SIPÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,643453",
    "Latitud": "4,65262"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27787,
    "Nombre Municipio": "TADÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,558571",
    "Latitud": "5,264873"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27800,
    "Nombre Municipio": "UNGUÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,092538",
    "Latitud": "8,04406"
  },
  {
    "Código Departamento": 27,
    "Nombre Departamento": "CHOCÓ",
    "Código Municipio": 27810,
    "Nombre Municipio": "UNIÓN PANAMERICANA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,630143",
    "Latitud": "5,281108"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41001,
    "Nombre Municipio": "NEIVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,277327",
    "Latitud": "2,935432"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41006,
    "Nombre Municipio": "ACEVEDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,888706",
    "Latitud": "1,805173"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41013,
    "Nombre Municipio": "AGRADO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,772022",
    "Latitud": "2,25987"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41016,
    "Nombre Municipio": "AIPE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,239017",
    "Latitud": "3,223996"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41020,
    "Nombre Municipio": "ALGECIRAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,315389",
    "Latitud": "2,521674"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41026,
    "Nombre Municipio": "ALTAMIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,788471",
    "Latitud": "2,063841"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41078,
    "Nombre Municipio": "BARAYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,054843",
    "Latitud": "3,152204"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41132,
    "Nombre Municipio": "CAMPOALEGRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,325748",
    "Latitud": "2,686767"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41206,
    "Nombre Municipio": "COLOMBIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,802815",
    "Latitud": "3,376745"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41244,
    "Nombre Municipio": "ELÍAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,938301",
    "Latitud": "2,012854"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41298,
    "Nombre Municipio": "GARZÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,627057",
    "Latitud": "2,196493"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41306,
    "Nombre Municipio": "GIGANTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,547681",
    "Latitud": "2,384031"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41319,
    "Nombre Municipio": "GUADALUPE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,757185",
    "Latitud": "2,02426"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41349,
    "Nombre Municipio": "HOBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,447697",
    "Latitud": "2,580812"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41357,
    "Nombre Municipio": "ÍQUIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,634497",
    "Latitud": "2,649359"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41359,
    "Nombre Municipio": "ISNOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,217637",
    "Latitud": "1,929467"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41378,
    "Nombre Municipio": "LA ARGENTINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,979763",
    "Latitud": "2,198496"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41396,
    "Nombre Municipio": "LA PLATA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,891254",
    "Latitud": "2,389263"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41483,
    "Nombre Municipio": "NÁTAGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,808756",
    "Latitud": "2,5451"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41503,
    "Nombre Municipio": "OPORAPA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,995165",
    "Latitud": "2,025088"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41518,
    "Nombre Municipio": "PAICOL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,773158",
    "Latitud": "2,449651"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41524,
    "Nombre Municipio": "PALERMO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,435296",
    "Latitud": "2,889649"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41530,
    "Nombre Municipio": "PALESTINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,133251",
    "Latitud": "1,723725"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41548,
    "Nombre Municipio": "PITAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,804544",
    "Latitud": "2,266618"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41551,
    "Nombre Municipio": "PITALITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,049441",
    "Latitud": "1,852631"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41615,
    "Nombre Municipio": "RIVERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,258753",
    "Latitud": "2,777586"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41660,
    "Nombre Municipio": "SALADOBLANCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,044747",
    "Latitud": "1,9934"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41668,
    "Nombre Municipio": "SAN AGUSTÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,27036",
    "Latitud": "1,881081"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41676,
    "Nombre Municipio": "SANTA MARÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,586223",
    "Latitud": "2,939603"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41770,
    "Nombre Municipio": "SUAZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,79525",
    "Latitud": "1,976051"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41791,
    "Nombre Municipio": "TARQUI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,823976",
    "Latitud": "2,111325"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41797,
    "Nombre Municipio": "TESALIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,730271",
    "Latitud": "2,486364"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41799,
    "Nombre Municipio": "TELLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,138773",
    "Latitud": "3,067538"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41801,
    "Nombre Municipio": "TERUEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,567034",
    "Latitud": "2,740968"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41807,
    "Nombre Municipio": "TIMANÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,932167",
    "Latitud": "1,974539"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41872,
    "Nombre Municipio": "VILLAVIEJA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,217174",
    "Latitud": "3,218822"
  },
  {
    "Código Departamento": 41,
    "Nombre Departamento": "HUILA",
    "Código Municipio": 41885,
    "Nombre Municipio": "YAGUARÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,518023",
    "Latitud": "2,664694"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44001,
    "Nombre Municipio": "RIOHACHA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,911795",
    "Latitud": "11,528588"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44035,
    "Nombre Municipio": "ALBANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,61232",
    "Latitud": "11,151628"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44078,
    "Nombre Municipio": "BARRANCAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,793639",
    "Latitud": "10,958669"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44090,
    "Nombre Municipio": "DIBULLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,307598",
    "Latitud": "11,27155"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44098,
    "Nombre Municipio": "DISTRACCIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,887405",
    "Latitud": "10,898414"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44110,
    "Nombre Municipio": "EL MOLINO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,92673",
    "Latitud": "10,653505"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44279,
    "Nombre Municipio": "FONSECA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,846319",
    "Latitud": "10,886734"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44378,
    "Nombre Municipio": "HATONUEVO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,75904",
    "Latitud": "11,068864"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44420,
    "Nombre Municipio": "LA JAGUA DEL PILAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,072638",
    "Latitud": "10,511862"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44430,
    "Nombre Municipio": "MAICAO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,242738",
    "Latitud": "11,378535"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44560,
    "Nombre Municipio": "MANAURE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,438739",
    "Latitud": "11,773767"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44650,
    "Nombre Municipio": "SAN JUAN DEL CESAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,000629",
    "Latitud": "10,769546"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44847,
    "Nombre Municipio": "URIBIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,265906",
    "Latitud": "11,711904"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44855,
    "Nombre Municipio": "URUMITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,012507",
    "Latitud": "10,560169"
  },
  {
    "Código Departamento": 44,
    "Nombre Departamento": "LA GUAJIRA",
    "Código Municipio": 44874,
    "Nombre Municipio": "VILLANUEVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,977583",
    "Latitud": "10,608774"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47001,
    "Nombre Municipio": "SANTA MARTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,199829",
    "Latitud": "11,204679"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47030,
    "Nombre Municipio": "ALGARROBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,061132",
    "Latitud": "10,188059"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47053,
    "Nombre Municipio": "ARACATACA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,186702",
    "Latitud": "10,589791"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47058,
    "Nombre Municipio": "ARIGUANÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,236515",
    "Latitud": "9,847047"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47161,
    "Nombre Municipio": "CERRO DE SAN ANTONIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,868474",
    "Latitud": "10,325531"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47170,
    "Nombre Municipio": "CHIVOLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,622242",
    "Latitud": "10,026631"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47189,
    "Nombre Municipio": "CIÉNAGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,241286",
    "Latitud": "11,006654"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47205,
    "Nombre Municipio": "CONCORDIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,83303",
    "Latitud": "10,257314"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47245,
    "Nombre Municipio": "EL BANCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,97437",
    "Latitud": "9,008503"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47258,
    "Nombre Municipio": "EL PIÑÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,823094",
    "Latitud": "10,402781"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47268,
    "Nombre Municipio": "EL RETÉN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,268444",
    "Latitud": "10,610488"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47288,
    "Nombre Municipio": "FUNDACIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,191453",
    "Latitud": "10,514146"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47318,
    "Nombre Municipio": "GUAMAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,223689",
    "Latitud": "9,144354"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47460,
    "Nombre Municipio": "NUEVA GRANADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,391841",
    "Latitud": "9,80186"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47541,
    "Nombre Municipio": "PEDRAZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,9154",
    "Latitud": "10,18825"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47545,
    "Nombre Municipio": "PIJIÑO DEL CARMEN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,459034",
    "Latitud": "9,331922"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47551,
    "Nombre Municipio": "PIVIJAY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,613312",
    "Latitud": "10,460707"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47555,
    "Nombre Municipio": "PLATO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,784549",
    "Latitud": "9,796713"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47570,
    "Nombre Municipio": "PUEBLOVIEJO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,28253",
    "Latitud": "10,994766"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47605,
    "Nombre Municipio": "REMOLINO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,716172",
    "Latitud": "10,701952"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47660,
    "Nombre Municipio": "SABANAS DE SAN ÁNGEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,213946",
    "Latitud": "10,032536"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47675,
    "Nombre Municipio": "SALAMINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,794189",
    "Latitud": "10,491229"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47692,
    "Nombre Municipio": "SAN SEBASTIÁN DE BUENAVISTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,351498",
    "Latitud": "9,241656"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47703,
    "Nombre Municipio": "SAN ZENÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,498992",
    "Latitud": "9,245061"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47707,
    "Nombre Municipio": "SANTA ANA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,566845",
    "Latitud": "9,324294"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47720,
    "Nombre Municipio": "SANTA BÁRBARA DE PINTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,704667",
    "Latitud": "9,432263"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47745,
    "Nombre Municipio": "SITIONUEVO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,720021",
    "Latitud": "10,775285"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47798,
    "Nombre Municipio": "TENERIFE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,859783",
    "Latitud": "9,898273"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47960,
    "Nombre Municipio": "ZAPAYÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,716878",
    "Latitud": "10,168297"
  },
  {
    "Código Departamento": 47,
    "Nombre Departamento": "MAGDALENA",
    "Código Municipio": 47980,
    "Nombre Municipio": "ZONA BANANERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,140091",
    "Latitud": "10,763024"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50001,
    "Nombre Municipio": "VILLAVICENCIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,622601",
    "Latitud": "4,126369"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50006,
    "Nombre Municipio": "ACACÍAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,766034",
    "Latitud": "3,990413"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50110,
    "Nombre Municipio": "BARRANCA DE UPÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,961083",
    "Latitud": "4,566225"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50124,
    "Nombre Municipio": "CABUYARO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,791768",
    "Latitud": "4,286705"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50150,
    "Nombre Municipio": "CASTILLA LA NUEVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,687302",
    "Latitud": "3,830005"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50223,
    "Nombre Municipio": "CUBARRAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,837999",
    "Latitud": "3,793653"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50226,
    "Nombre Municipio": "CUMARAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,487052",
    "Latitud": "4,270042"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50245,
    "Nombre Municipio": "EL CALVARIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,713325",
    "Latitud": "4,352665"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50251,
    "Nombre Municipio": "EL CASTILLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,794225",
    "Latitud": "3,563907"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50270,
    "Nombre Municipio": "EL DORADO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,835264",
    "Latitud": "3,739984"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50287,
    "Nombre Municipio": "FUENTE DE ORO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,618121",
    "Latitud": "3,462875"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50313,
    "Nombre Municipio": "GRANADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,705815",
    "Latitud": "3,547147"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50318,
    "Nombre Municipio": "GUAMAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,768815",
    "Latitud": "3,879657"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50325,
    "Nombre Municipio": "MAPIRIPÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,135509",
    "Latitud": "2,896617"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50330,
    "Nombre Municipio": "MESETAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,044328",
    "Latitud": "3,382732"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50350,
    "Nombre Municipio": "LA MACARENA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,78661",
    "Latitud": "2,177143"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50370,
    "Nombre Municipio": "URIBE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,351508",
    "Latitud": "3,239634"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50400,
    "Nombre Municipio": "LEJANÍAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,023514",
    "Latitud": "3,525115"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50450,
    "Nombre Municipio": "PUERTO CONCORDIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,760209",
    "Latitud": "2,624006"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50568,
    "Nombre Municipio": "PUERTO GAITÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,087649",
    "Latitud": "4,314905"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50573,
    "Nombre Municipio": "PUERTO LÓPEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,957324",
    "Latitud": "4,09349"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50577,
    "Nombre Municipio": "PUERTO LLERAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,37385",
    "Latitud": "3,272117"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50590,
    "Nombre Municipio": "PUERTO RICO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,206314",
    "Latitud": "2,939621"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50606,
    "Nombre Municipio": "RESTREPO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,565408",
    "Latitud": "4,259556"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50680,
    "Nombre Municipio": "SAN CARLOS DE GUAROA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,242253",
    "Latitud": "3,71065"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50683,
    "Nombre Municipio": "SAN JUAN DE ARAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,875832",
    "Latitud": "3,373728"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50686,
    "Nombre Municipio": "SAN JUANITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,676699",
    "Latitud": "4,458181"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50689,
    "Nombre Municipio": "SAN MARTÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,695812",
    "Latitud": "3,701899"
  },
  {
    "Código Departamento": 50,
    "Nombre Departamento": "META",
    "Código Municipio": 50711,
    "Nombre Municipio": "VISTAHERMOSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,750966",
    "Latitud": "3,125579"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52001,
    "Nombre Municipio": "PASTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,278795",
    "Latitud": "1,212352"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52019,
    "Nombre Municipio": "ALBÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,080712",
    "Latitud": "1,474978"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52022,
    "Nombre Municipio": "ALDANA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,700564",
    "Latitud": "0,882381"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52036,
    "Nombre Municipio": "ANCUYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,514512",
    "Latitud": "1,263276"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52051,
    "Nombre Municipio": "ARBOLEDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,135467",
    "Latitud": "1,503418"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52079,
    "Nombre Municipio": "BARBACOAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,13765",
    "Latitud": "1,671733"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52083,
    "Nombre Municipio": "BELÉN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,015619",
    "Latitud": "1,595681"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52110,
    "Nombre Municipio": "BUESACO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,156463",
    "Latitud": "1,381453"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52203,
    "Nombre Municipio": "COLÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,019777",
    "Latitud": "1,643878"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52207,
    "Nombre Municipio": "CONSACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,466136",
    "Latitud": "1,207854"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52210,
    "Nombre Municipio": "CONTADERO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,549409",
    "Latitud": "0,910458"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52215,
    "Nombre Municipio": "CÓRDOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,517897",
    "Latitud": "0,854564"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52224,
    "Nombre Municipio": "CUASPUD CARLOSAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,728947",
    "Latitud": "0,862978"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52227,
    "Nombre Municipio": "CUMBAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,792505",
    "Latitud": "0,906367"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52233,
    "Nombre Municipio": "CUMBITARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,578616",
    "Latitud": "1,647163"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52240,
    "Nombre Municipio": "CHACHAGÜÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,281869",
    "Latitud": "1,360545"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52250,
    "Nombre Municipio": "EL CHARCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,110217",
    "Latitud": "2,479688"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52254,
    "Nombre Municipio": "EL PEÑOL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,438522",
    "Latitud": "1,453567"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52256,
    "Nombre Municipio": "EL ROSARIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,33417",
    "Latitud": "1,745309"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52258,
    "Nombre Municipio": "EL TABLÓN DE GÓMEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,097101",
    "Latitud": "1,427277"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52260,
    "Nombre Municipio": "EL TAMBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,390772",
    "Latitud": "1,407913"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52287,
    "Nombre Municipio": "FUNES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,448913",
    "Latitud": "1,001159"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52317,
    "Nombre Municipio": "GUACHUCAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,731589",
    "Latitud": "0,959744"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52320,
    "Nombre Municipio": "GUAITARILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,549824",
    "Latitud": "1,129574"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52323,
    "Nombre Municipio": "GUALMATÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,568701",
    "Latitud": "0,919652"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52352,
    "Nombre Municipio": "ILES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,521227",
    "Latitud": "0,96952"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52354,
    "Nombre Municipio": "IMUÉS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,496339",
    "Latitud": "1,05506"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52356,
    "Nombre Municipio": "IPIALES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,646367",
    "Latitud": "0,827732"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52378,
    "Nombre Municipio": "LA CRUZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,970504",
    "Latitud": "1,601318"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52381,
    "Nombre Municipio": "LA FLORIDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,402882",
    "Latitud": "1,29753"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52385,
    "Nombre Municipio": "LA LLANADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,58091",
    "Latitud": "1,472892"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52390,
    "Nombre Municipio": "LA TOLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,189725",
    "Latitud": "2,398999"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52399,
    "Nombre Municipio": "LA UNIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,131316",
    "Latitud": "1,600219"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52405,
    "Nombre Municipio": "LEIVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,306135",
    "Latitud": "1,934453"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52411,
    "Nombre Municipio": "LINARES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,523953",
    "Latitud": "1,350814"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52418,
    "Nombre Municipio": "LOS ANDES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,521303",
    "Latitud": "1,494587"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52427,
    "Nombre Municipio": "MAGÜÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,182924",
    "Latitud": "1,765633"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52435,
    "Nombre Municipio": "MALLAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,864549",
    "Latitud": "1,141037"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52473,
    "Nombre Municipio": "MOSQUERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,452992",
    "Latitud": "2,507139"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52480,
    "Nombre Municipio": "NARIÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,357972",
    "Latitud": "1,288979"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52490,
    "Nombre Municipio": "OLAYA HERRERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,325814",
    "Latitud": "2,347457"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52506,
    "Nombre Municipio": "OSPINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,566082",
    "Latitud": "1,058433"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52520,
    "Nombre Municipio": "FRANCISCO PIZARRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,658361",
    "Latitud": "2,040629"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52540,
    "Nombre Municipio": "POLICARPA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,458686",
    "Latitud": "1,627196"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52560,
    "Nombre Municipio": "POTOSÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,573003",
    "Latitud": "0,806639"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52565,
    "Nombre Municipio": "PROVIDENCIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,596794",
    "Latitud": "1,237814"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52573,
    "Nombre Municipio": "PUERRES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,504211",
    "Latitud": "0,885125"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52585,
    "Nombre Municipio": "PUPIALES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,636042",
    "Latitud": "0,870442"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52612,
    "Nombre Municipio": "RICAURTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,995153",
    "Latitud": "1,212492"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52621,
    "Nombre Municipio": "ROBERTO PAYÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,245716",
    "Latitud": "1,697492"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52678,
    "Nombre Municipio": "SAMANIEGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,594341",
    "Latitud": "1,335438"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52683,
    "Nombre Municipio": "SANDONÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,47313",
    "Latitud": "1,283438"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52685,
    "Nombre Municipio": "SAN BERNARDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,0475",
    "Latitud": "1,513762"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52687,
    "Nombre Municipio": "SAN LORENZO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,21542",
    "Latitud": "1,503362"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52693,
    "Nombre Municipio": "SAN PABLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,013984",
    "Latitud": "1,669429"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52694,
    "Nombre Municipio": "SAN PEDRO DE CARTAGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,11941",
    "Latitud": "1,551572"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52696,
    "Nombre Municipio": "SANTA BÁRBARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,979916",
    "Latitud": "2,449653"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52699,
    "Nombre Municipio": "SANTACRUZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,677035",
    "Latitud": "1,222589"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52720,
    "Nombre Municipio": "SAPUYES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,62028",
    "Latitud": "1,037536"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52786,
    "Nombre Municipio": "TAMINANGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,2808",
    "Latitud": "1,570358"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52788,
    "Nombre Municipio": "TANGUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,393735",
    "Latitud": "1,09482"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52835,
    "Nombre Municipio": "SAN ANDRÉS DE TUMACO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-78,764073",
    "Latitud": "1,807399"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52838,
    "Nombre Municipio": "TÚQUERRES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,61672",
    "Latitud": "1,085044"
  },
  {
    "Código Departamento": 52,
    "Nombre Departamento": "NARIÑO",
    "Código Municipio": 52885,
    "Nombre Municipio": "YACUANQUER",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,400169",
    "Latitud": "1,115937"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54001,
    "Nombre Municipio": "SAN JOSÉ DE CÚCUTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,508178",
    "Latitud": "7,905725"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54003,
    "Nombre Municipio": "ÁBREGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,221722",
    "Latitud": "8,081616"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54051,
    "Nombre Municipio": "ARBOLEDAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,798952",
    "Latitud": "7,642985"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54099,
    "Nombre Municipio": "BOCHALEMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,64701",
    "Latitud": "7,612192"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54109,
    "Nombre Municipio": "BUCARASICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,868231",
    "Latitud": "8,041299"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54125,
    "Nombre Municipio": "CÁCOTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,642059",
    "Latitud": "7,268705"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54128,
    "Nombre Municipio": "CÁCHIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,048983",
    "Latitud": "7,741248"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54172,
    "Nombre Municipio": "CHINÁCOTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,601162",
    "Latitud": "7,603112"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54174,
    "Nombre Municipio": "CHITAGÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,665468",
    "Latitud": "7,138187"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54206,
    "Nombre Municipio": "CONVENCIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,3372",
    "Latitud": "8,470374"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54223,
    "Nombre Municipio": "CUCUTILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,772816",
    "Latitud": "7,539633"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54239,
    "Nombre Municipio": "DURANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,658491",
    "Latitud": "7,714804"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54245,
    "Nombre Municipio": "EL CARMEN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,446687",
    "Latitud": "8,510579"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54250,
    "Nombre Municipio": "EL TARRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,09614",
    "Latitud": "8,574281"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54261,
    "Nombre Municipio": "EL ZULIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,604717",
    "Latitud": "7,938572"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54313,
    "Nombre Municipio": "GRAMALOTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,787233",
    "Latitud": "7,916946"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54344,
    "Nombre Municipio": "HACARÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,145997",
    "Latitud": "8,321506"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54347,
    "Nombre Municipio": "HERRÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,483519",
    "Latitud": "7,506541"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54377,
    "Nombre Municipio": "LABATECA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,495983",
    "Latitud": "7,298414"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54385,
    "Nombre Municipio": "LA ESPERANZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,328126",
    "Latitud": "7,639839"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54398,
    "Nombre Municipio": "LA PLAYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,239986",
    "Latitud": "8,21124"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54405,
    "Nombre Municipio": "LOS PATIOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,505612",
    "Latitud": "7,833186"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54418,
    "Nombre Municipio": "LOURDES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,832376",
    "Latitud": "7,945631"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54480,
    "Nombre Municipio": "MUTISCUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,747169",
    "Latitud": "7,300469"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54498,
    "Nombre Municipio": "OCAÑA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,35607",
    "Latitud": "8,248574"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54518,
    "Nombre Municipio": "PAMPLONA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,647714",
    "Latitud": "7,372802"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54520,
    "Nombre Municipio": "PAMPLONITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,639111",
    "Latitud": "7,436745"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54553,
    "Nombre Municipio": "PUERTO SANTANDER",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,411363",
    "Latitud": "8,359993"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54599,
    "Nombre Municipio": "RAGONVALIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,476708",
    "Latitud": "7,577861"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54660,
    "Nombre Municipio": "SALAZAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,813064",
    "Latitud": "7,773683"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54670,
    "Nombre Municipio": "SAN CALIXTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,208622",
    "Latitud": "8,40214"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54673,
    "Nombre Municipio": "SAN CAYETANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,625459",
    "Latitud": "7,875695"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54680,
    "Nombre Municipio": "SANTIAGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,716203",
    "Latitud": "7,865856"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54720,
    "Nombre Municipio": "SARDINATA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,800577",
    "Latitud": "8,082105"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54743,
    "Nombre Municipio": "SILOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,757128",
    "Latitud": "7,204736"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54800,
    "Nombre Municipio": "TEORAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,28707",
    "Latitud": "8,438134"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54810,
    "Nombre Municipio": "TIBÚ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,734496",
    "Latitud": "8,639891"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54820,
    "Nombre Municipio": "TOLEDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,481915",
    "Latitud": "7,307692"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54871,
    "Nombre Municipio": "VILLA CARO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,973601",
    "Latitud": "7,914244"
  },
  {
    "Código Departamento": 54,
    "Nombre Departamento": "NORTE DE SANTANDER",
    "Código Municipio": 54874,
    "Nombre Municipio": "VILLA DEL ROSARIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,469758",
    "Latitud": "7,847672"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63001,
    "Nombre Municipio": "ARMENIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,680786",
    "Latitud": "4,53598"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63111,
    "Nombre Municipio": "BUENAVISTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,739572",
    "Latitud": "4,360029"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63130,
    "Nombre Municipio": "CALARCÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,646085",
    "Latitud": "4,520982"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63190,
    "Nombre Municipio": "CIRCASIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,636533",
    "Latitud": "4,617759"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63212,
    "Nombre Municipio": "CÓRDOBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,687866",
    "Latitud": "4,392485"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63272,
    "Nombre Municipio": "FILANDIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,658387",
    "Latitud": "4,674338"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63302,
    "Nombre Municipio": "GÉNOVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,790402",
    "Latitud": "4,206641"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63401,
    "Nombre Municipio": "LA TEBAIDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,786887",
    "Latitud": "4,453755"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63470,
    "Nombre Municipio": "MONTENEGRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,749827",
    "Latitud": "4,565057"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63548,
    "Nombre Municipio": "PIJAO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,703329",
    "Latitud": "4,335036"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63594,
    "Nombre Municipio": "QUIMBAYA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,765074",
    "Latitud": "4,624387"
  },
  {
    "Código Departamento": 63,
    "Nombre Departamento": "QUINDÍO",
    "Código Municipio": 63690,
    "Nombre Municipio": "SALENTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,570844",
    "Latitud": "4,637157"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66001,
    "Nombre Municipio": "PEREIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,719711",
    "Latitud": "4,804985"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66045,
    "Nombre Municipio": "APÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,942356",
    "Latitud": "5,106526"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66075,
    "Nombre Municipio": "BALBOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,958663",
    "Latitud": "4,949096"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66088,
    "Nombre Municipio": "BELÉN DE UMBRÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,868334",
    "Latitud": "5,200793"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66170,
    "Nombre Municipio": "DOSQUEBRADAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,675371",
    "Latitud": "4,833131"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66318,
    "Nombre Municipio": "GUÁTICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,799005",
    "Latitud": "5,315367"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66383,
    "Nombre Municipio": "LA CELIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,0032",
    "Latitud": "5,002787"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66400,
    "Nombre Municipio": "LA VIRGINIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,880394",
    "Latitud": "4,896624"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66440,
    "Nombre Municipio": "MARSELLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,73879",
    "Latitud": "4,935771"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66456,
    "Nombre Municipio": "MISTRATÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,882886",
    "Latitud": "5,297039"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66572,
    "Nombre Municipio": "PUEBLO RICO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,030801",
    "Latitud": "5,222043"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66594,
    "Nombre Municipio": "QUINCHÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,730431",
    "Latitud": "5,340456"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66682,
    "Nombre Municipio": "SANTA ROSA DE CABAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,623268",
    "Latitud": "4,876271"
  },
  {
    "Código Departamento": 66,
    "Nombre Departamento": "RISARALDA",
    "Código Municipio": 66687,
    "Nombre Municipio": "SANTUARIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,964628",
    "Latitud": "5,074911"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68001,
    "Nombre Municipio": "BUCARAMANGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,132562",
    "Latitud": "7,11647"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68013,
    "Nombre Municipio": "AGUADA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,523132",
    "Latitud": "6,162355"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68020,
    "Nombre Municipio": "ALBANIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,91336",
    "Latitud": "5,759166"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68051,
    "Nombre Municipio": "ARATOCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,01786",
    "Latitud": "6,694418"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68077,
    "Nombre Municipio": "BARBOSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,615965",
    "Latitud": "5,932531"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68079,
    "Nombre Municipio": "BARICHARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,223047",
    "Latitud": "6,634111"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68081,
    "Nombre Municipio": "BARRANCABERMEJA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,849243",
    "Latitud": "7,064857"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68092,
    "Nombre Municipio": "BETULIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,283669",
    "Latitud": "6,899525"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68101,
    "Nombre Municipio": "BOLÍVAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,771346",
    "Latitud": "5,988953"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68121,
    "Nombre Municipio": "CABRERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,246475",
    "Latitud": "6,592118"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68132,
    "Nombre Municipio": "CALIFORNIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,946491",
    "Latitud": "7,347989"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68147,
    "Nombre Municipio": "CAPITANEJO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,695427",
    "Latitud": "6,527394"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68152,
    "Nombre Municipio": "CARCASÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,627099",
    "Latitud": "6,629016"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68160,
    "Nombre Municipio": "CEPITÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,973536",
    "Latitud": "6,753518"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68162,
    "Nombre Municipio": "CERRITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,694851",
    "Latitud": "6,840405"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68167,
    "Nombre Municipio": "CHARALÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,146873",
    "Latitud": "6,284339"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68169,
    "Nombre Municipio": "CHARTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,968798",
    "Latitud": "7,28082"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68176,
    "Nombre Municipio": "CHIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,373656",
    "Latitud": "6,344348"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68179,
    "Nombre Municipio": "CHIPATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,637111",
    "Latitud": "6,062521"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68190,
    "Nombre Municipio": "CIMITARRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,953011",
    "Latitud": "6,320886"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68207,
    "Nombre Municipio": "CONCEPCIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,694567",
    "Latitud": "6,768908"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68209,
    "Nombre Municipio": "CONFINES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,240554",
    "Latitud": "6,357327"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68211,
    "Nombre Municipio": "CONTRATACIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,474426",
    "Latitud": "6,290561"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68217,
    "Nombre Municipio": "COROMORO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,040816",
    "Latitud": "6,294999"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68229,
    "Nombre Municipio": "CURITÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,069383",
    "Latitud": "6,605099"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68235,
    "Nombre Municipio": "EL CARMEN DE CHUCURÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,51066",
    "Latitud": "6,700038"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68245,
    "Nombre Municipio": "EL GUACAMAYO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,496908",
    "Latitud": "6,245111"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68250,
    "Nombre Municipio": "EL PEÑÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,815532",
    "Latitud": "6,05537"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68255,
    "Nombre Municipio": "EL PLAYÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,20287",
    "Latitud": "7,470715"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68264,
    "Nombre Municipio": "ENCINO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,098749",
    "Latitud": "6,137429"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68266,
    "Nombre Municipio": "ENCISO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,699647",
    "Latitud": "6,668034"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68271,
    "Nombre Municipio": "FLORIÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,97143",
    "Latitud": "5,804659"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68276,
    "Nombre Municipio": "FLORIDABLANCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,099104",
    "Latitud": "7,072329"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68296,
    "Nombre Municipio": "GALÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,287769",
    "Latitud": "6,638423"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68298,
    "Nombre Municipio": "GÁMBITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,344185",
    "Latitud": "5,945998"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68307,
    "Nombre Municipio": "GIRÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,166832",
    "Latitud": "7,070432"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68318,
    "Nombre Municipio": "GUACA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,856322",
    "Latitud": "6,876563"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68320,
    "Nombre Municipio": "GUADALUPE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,419292",
    "Latitud": "6,245847"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68322,
    "Nombre Municipio": "GUAPOTÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,320732",
    "Latitud": "6,308635"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68324,
    "Nombre Municipio": "GUAVATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,700906",
    "Latitud": "5,954348"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68327,
    "Nombre Municipio": "GÜEPSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,575146",
    "Latitud": "6,025013"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68344,
    "Nombre Municipio": "HATO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,308399",
    "Latitud": "6,543957"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68368,
    "Nombre Municipio": "JESÚS MARÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,783396",
    "Latitud": "5,876497"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68370,
    "Nombre Municipio": "JORDÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,096053",
    "Latitud": "6,732727"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68377,
    "Nombre Municipio": "LA BELLEZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,965494",
    "Latitud": "5,85925"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68385,
    "Nombre Municipio": "LANDÁZURI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,811359",
    "Latitud": "6,218812"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68397,
    "Nombre Municipio": "LA PAZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,58959",
    "Latitud": "6,178509"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68406,
    "Nombre Municipio": "LEBRIJA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,219524",
    "Latitud": "7,113351"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68418,
    "Nombre Municipio": "LOS SANTOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,102739",
    "Latitud": "6,755203"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68425,
    "Nombre Municipio": "MACARAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,593105",
    "Latitud": "6,50658"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68432,
    "Nombre Municipio": "MÁLAGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,732089",
    "Latitud": "6,703081"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68444,
    "Nombre Municipio": "MATANZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,015566",
    "Latitud": "7,323175"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68464,
    "Nombre Municipio": "MOGOTES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,969807",
    "Latitud": "6,475246"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68468,
    "Nombre Municipio": "MOLAGAVITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,809175",
    "Latitud": "6,67432"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68498,
    "Nombre Municipio": "OCAMONTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,122563",
    "Latitud": "6,339988"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68500,
    "Nombre Municipio": "OIBA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,299791",
    "Latitud": "6,26521"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68502,
    "Nombre Municipio": "ONZAGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,816766",
    "Latitud": "6,344104"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68522,
    "Nombre Municipio": "PALMAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,29109",
    "Latitud": "6,537789"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68524,
    "Nombre Municipio": "PALMAS DEL SOCORRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,287764",
    "Latitud": "6,406139"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68533,
    "Nombre Municipio": "PÁRAMO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,17022",
    "Latitud": "6,416811"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68547,
    "Nombre Municipio": "PIEDECUESTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,054795",
    "Latitud": "6,997245"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68549,
    "Nombre Municipio": "PINCHOTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,174209",
    "Latitud": "6,531552"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68572,
    "Nombre Municipio": "PUENTE NACIONAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,677567",
    "Latitud": "5,878381"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68573,
    "Nombre Municipio": "PUERTO PARRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,056129",
    "Latitud": "6,650785"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68575,
    "Nombre Municipio": "PUERTO WILCHES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,899909",
    "Latitud": "7,344057"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68615,
    "Nombre Municipio": "RIONEGRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,150177",
    "Latitud": "7,265014"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68655,
    "Nombre Municipio": "SABANA DE TORRES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,49906",
    "Latitud": "7,391919"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68669,
    "Nombre Municipio": "SAN ANDRÉS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,848864",
    "Latitud": "6,811511"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68673,
    "Nombre Municipio": "SAN BENITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,50907",
    "Latitud": "6,126656"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68679,
    "Nombre Municipio": "SAN GIL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,134776",
    "Latitud": "6,551952"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68682,
    "Nombre Municipio": "SAN JOAQUÍN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,867638",
    "Latitud": "6,427548"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68684,
    "Nombre Municipio": "SAN JOSÉ DE MIRANDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,733616",
    "Latitud": "6,658995"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68686,
    "Nombre Municipio": "SAN MIGUEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,644123",
    "Latitud": "6,575315"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68689,
    "Nombre Municipio": "SAN VICENTE DE CHUCURÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,411024",
    "Latitud": "6,880383"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68705,
    "Nombre Municipio": "SANTA BÁRBARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,907445",
    "Latitud": "6,990996"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68720,
    "Nombre Municipio": "SANTA HELENA DEL OPÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,616716",
    "Latitud": "6,339565"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68745,
    "Nombre Municipio": "SIMACOTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,337368",
    "Latitud": "6,443469"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68755,
    "Nombre Municipio": "SOCORRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,261198",
    "Latitud": "6,46387"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68770,
    "Nombre Municipio": "SUAITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,44165",
    "Latitud": "6,101329"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68773,
    "Nombre Municipio": "SUCRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,790975",
    "Latitud": "5,918743"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68780,
    "Nombre Municipio": "SURATÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,984232",
    "Latitud": "7,36658"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68820,
    "Nombre Municipio": "TONA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,967023",
    "Latitud": "7,201417"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68855,
    "Nombre Municipio": "VALLE DE SAN JOSÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,143507",
    "Latitud": "6,448028"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68861,
    "Nombre Municipio": "VÉLEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,672447",
    "Latitud": "6,009275"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68867,
    "Nombre Municipio": "VETAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,871041",
    "Latitud": "7,30981"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68872,
    "Nombre Municipio": "VILLANUEVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,174307",
    "Latitud": "6,670078"
  },
  {
    "Código Departamento": 68,
    "Nombre Departamento": "SANTANDER",
    "Código Municipio": 68895,
    "Nombre Municipio": "ZAPATOCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,268034",
    "Latitud": "6,814387"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70001,
    "Nombre Municipio": "SINCELEJO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,395445",
    "Latitud": "9,302322"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70110,
    "Nombre Municipio": "BUENAVISTA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,972827",
    "Latitud": "9,319794"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70124,
    "Nombre Municipio": "CAIMITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,117141",
    "Latitud": "8,789324"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70204,
    "Nombre Municipio": "COLOSÓ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,353256",
    "Latitud": "9,494192"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70215,
    "Nombre Municipio": "COROZAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,293048",
    "Latitud": "9,318749"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70221,
    "Nombre Municipio": "COVEÑAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,680158",
    "Latitud": "9,402779"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70230,
    "Nombre Municipio": "CHALÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,312697",
    "Latitud": "9,545352"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70233,
    "Nombre Municipio": "EL ROBLE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,198378",
    "Latitud": "9,100647"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70235,
    "Nombre Municipio": "GALERAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,04959",
    "Latitud": "9,160379"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70265,
    "Nombre Municipio": "GUARANDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,537749",
    "Latitud": "8,468556"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70400,
    "Nombre Municipio": "LA UNIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,276056",
    "Latitud": "8,853975"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70418,
    "Nombre Municipio": "LOS PALMITOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,268716",
    "Latitud": "9,380269"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70429,
    "Nombre Municipio": "MAJAGUAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,628077",
    "Latitud": "8,541163"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70473,
    "Nombre Municipio": "MORROA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,305949",
    "Latitud": "9,331395"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70508,
    "Nombre Municipio": "OVEJAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,229037",
    "Latitud": "9,527176"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70523,
    "Nombre Municipio": "PALMITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,541264",
    "Latitud": "9,333157"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70670,
    "Nombre Municipio": "SAMPUÉS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,380222",
    "Latitud": "9,183193"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70678,
    "Nombre Municipio": "SAN BENITO ABAD",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,031089",
    "Latitud": "8,930108"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70702,
    "Nombre Municipio": "SAN JUAN DE BETULIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,243565",
    "Latitud": "9,273066"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70708,
    "Nombre Municipio": "SAN MARCOS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,133831",
    "Latitud": "8,661774"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70713,
    "Nombre Municipio": "SAN ONOFRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,522398",
    "Latitud": "9,736955"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70717,
    "Nombre Municipio": "SAN PEDRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,063647",
    "Latitud": "9,39625"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70742,
    "Nombre Municipio": "SAN LUIS DE SINCÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,145999",
    "Latitud": "9,244308"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70771,
    "Nombre Municipio": "SUCRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,723175",
    "Latitud": "8,811737"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70820,
    "Nombre Municipio": "SANTIAGO DE TOLÚ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,581112",
    "Latitud": "9,525387"
  },
  {
    "Código Departamento": 70,
    "Nombre Departamento": "SUCRE",
    "Código Municipio": 70823,
    "Nombre Municipio": "SAN JOSÉ DE TOLUVIEJO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,44085",
    "Latitud": "9,451819"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73001,
    "Nombre Municipio": "IBAGUÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,19425",
    "Latitud": "4,432248"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73024,
    "Nombre Municipio": "ALPUJARRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,9329",
    "Latitud": "3,391548"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73026,
    "Nombre Municipio": "ALVARADO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,953418",
    "Latitud": "4,567356"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73030,
    "Nombre Municipio": "AMBALEMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,764429",
    "Latitud": "4,782682"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73043,
    "Nombre Municipio": "ANZOÁTEGUI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,093772",
    "Latitud": "4,631756"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73055,
    "Nombre Municipio": "ARMERO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,884438",
    "Latitud": "5,030744"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73067,
    "Nombre Municipio": "ATACO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,382545",
    "Latitud": "3,590591"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73124,
    "Nombre Municipio": "CAJAMARCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,431971",
    "Latitud": "4,438812"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73148,
    "Nombre Municipio": "CARMEN DE APICALÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,717633",
    "Latitud": "4,152334"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73152,
    "Nombre Municipio": "CASABIANCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,120966",
    "Latitud": "5,078465"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73168,
    "Nombre Municipio": "CHAPARRAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,480765",
    "Latitud": "3,722918"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73200,
    "Nombre Municipio": "COELLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,898464",
    "Latitud": "4,287276"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73217,
    "Nombre Municipio": "COYAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,193862",
    "Latitud": "3,798036"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73226,
    "Nombre Municipio": "CUNDAY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,692227",
    "Latitud": "4,059259"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73236,
    "Nombre Municipio": "DOLORES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,896761",
    "Latitud": "3,539072"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73268,
    "Nombre Municipio": "ESPINAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,885446",
    "Latitud": "4,151314"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73270,
    "Nombre Municipio": "FALAN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,953007",
    "Latitud": "5,123104"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73275,
    "Nombre Municipio": "FLANDES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,818763",
    "Latitud": "4,276373"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73283,
    "Nombre Municipio": "FRESNO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,035722",
    "Latitud": "5,153576"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73319,
    "Nombre Municipio": "GUAMO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,968135",
    "Latitud": "4,030992"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73347,
    "Nombre Municipio": "HERVEO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,177151",
    "Latitud": "5,080228"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73349,
    "Nombre Municipio": "HONDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,75699",
    "Latitud": "5,211816"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73352,
    "Nombre Municipio": "ICONONZO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,531969",
    "Latitud": "4,176487"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73408,
    "Nombre Municipio": "LÉRIDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,910716",
    "Latitud": "4,862046"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73411,
    "Nombre Municipio": "LÍBANO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,061959",
    "Latitud": "4,92042"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73443,
    "Nombre Municipio": "SAN SEBASTIÁN DE MARIQUITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,889276",
    "Latitud": "5,199708"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73449,
    "Nombre Municipio": "MELGAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,641317",
    "Latitud": "4,203655"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73461,
    "Nombre Municipio": "MURILLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,171022",
    "Latitud": "4,874341"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73483,
    "Nombre Municipio": "NATAGAIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,093182",
    "Latitud": "3,624324"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73504,
    "Nombre Municipio": "ORTEGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,222601",
    "Latitud": "3,934916"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73520,
    "Nombre Municipio": "PALOCABILDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,022167",
    "Latitud": "5,120918"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73547,
    "Nombre Municipio": "PIEDRAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,878106",
    "Latitud": "4,543951"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73555,
    "Nombre Municipio": "PLANADAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,644163",
    "Latitud": "3,197911"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73563,
    "Nombre Municipio": "PRADO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,927447",
    "Latitud": "3,750939"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73585,
    "Nombre Municipio": "PURIFICACIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,935555",
    "Latitud": "3,857246"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73616,
    "Nombre Municipio": "RIOBLANCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,644069",
    "Latitud": "3,529932"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73622,
    "Nombre Municipio": "RONCESVALLES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,605959",
    "Latitud": "4,011567"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73624,
    "Nombre Municipio": "ROVIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,240648",
    "Latitud": "4,239019"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73671,
    "Nombre Municipio": "SALDAÑA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,016852",
    "Latitud": "3,929815"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73675,
    "Nombre Municipio": "SAN ANTONIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,480074",
    "Latitud": "3,914146"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73678,
    "Nombre Municipio": "SAN LUIS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,095804",
    "Latitud": "4,133721"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73686,
    "Nombre Municipio": "SANTA ISABEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,097934",
    "Latitud": "4,713606"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73770,
    "Nombre Municipio": "SUÁREZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,831885",
    "Latitud": "4,048891"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73854,
    "Nombre Municipio": "VALLE DE SAN JUAN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,115669",
    "Latitud": "4,197494"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73861,
    "Nombre Municipio": "VENADILLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,929333",
    "Latitud": "4,717878"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73870,
    "Nombre Municipio": "VILLAHERMOSA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,117729",
    "Latitud": "5,030452"
  },
  {
    "Código Departamento": 73,
    "Nombre Departamento": "TOLIMA",
    "Código Municipio": 73873,
    "Nombre Municipio": "VILLARRICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,600285",
    "Latitud": "3,936902"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76001,
    "Nombre Municipio": "SANTIAGO DE CALI",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,52133",
    "Latitud": "3,413686"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76020,
    "Nombre Municipio": "ALCALÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,779792",
    "Latitud": "4,674994"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76036,
    "Nombre Municipio": "ANDALUCÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,167925",
    "Latitud": "4,171713"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76041,
    "Nombre Municipio": "ANSERMANUEVO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,992003",
    "Latitud": "4,794984"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76054,
    "Nombre Municipio": "ARGELIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,119905",
    "Latitud": "4,726945"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76100,
    "Nombre Municipio": "BOLÍVAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,183583",
    "Latitud": "4,337846"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76109,
    "Nombre Municipio": "BUENAVENTURA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,01074",
    "Latitud": "3,875708"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76111,
    "Nombre Municipio": "GUADALAJARA DE BUGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,298979",
    "Latitud": "3,900736"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76113,
    "Nombre Municipio": "BUGALAGRANDE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,15682",
    "Latitud": "4,208358"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76122,
    "Nombre Municipio": "CAICEDONIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,830594",
    "Latitud": "4,334808"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76126,
    "Nombre Municipio": "CALIMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,484132",
    "Latitud": "3,933664"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76130,
    "Nombre Municipio": "CANDELARIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,346519",
    "Latitud": "3,408354"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76147,
    "Nombre Municipio": "CARTAGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,924374",
    "Latitud": "4,742192"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76233,
    "Nombre Municipio": "DAGUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,68886",
    "Latitud": "3,657318"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76243,
    "Nombre Municipio": "EL ÁGUILA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,042779",
    "Latitud": "4,906062"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76246,
    "Nombre Municipio": "EL CAIRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,221611",
    "Latitud": "4,760874"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76248,
    "Nombre Municipio": "EL CERRITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,311972",
    "Latitud": "3,684229"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76250,
    "Nombre Municipio": "EL DOVIO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,237084",
    "Latitud": "4,510452"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76275,
    "Nombre Municipio": "FLORIDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,234199",
    "Latitud": "3,324118"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76306,
    "Nombre Municipio": "GINEBRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,268068",
    "Latitud": "3,724181"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76318,
    "Nombre Municipio": "GUACARÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,330911",
    "Latitud": "3,761815"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76364,
    "Nombre Municipio": "JAMUNDÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,538472",
    "Latitud": "3,258751"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76377,
    "Nombre Municipio": "LA CUMBRE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,56805",
    "Latitud": "3,649268"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76400,
    "Nombre Municipio": "LA UNIÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,099661",
    "Latitud": "4,533869"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76403,
    "Nombre Municipio": "LA VICTORIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,036529",
    "Latitud": "4,523603"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76497,
    "Nombre Municipio": "OBANDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,974709",
    "Latitud": "4,575712"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76520,
    "Nombre Municipio": "PALMIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,298846",
    "Latitud": "3,531544"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76563,
    "Nombre Municipio": "PRADERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,241799",
    "Latitud": "3,419793"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76606,
    "Nombre Municipio": "RESTREPO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,523329",
    "Latitud": "3,821351"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76616,
    "Nombre Municipio": "RIOFRÍO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,288313",
    "Latitud": "4,156908"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76622,
    "Nombre Municipio": "ROLDANILLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,152277",
    "Latitud": "4,413601"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76670,
    "Nombre Municipio": "SAN PEDRO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,228692",
    "Latitud": "3,995073"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76736,
    "Nombre Municipio": "SEVILLA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,931629",
    "Latitud": "4,270714"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76823,
    "Nombre Municipio": "TORO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,076859",
    "Latitud": "4,608085"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76828,
    "Nombre Municipio": "TRUJILLO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,318818",
    "Latitud": "4,212037"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76834,
    "Nombre Municipio": "TULUÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,197731",
    "Latitud": "4,085399"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76845,
    "Nombre Municipio": "ULLOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-75,737808",
    "Latitud": "4,703623"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76863,
    "Nombre Municipio": "VERSALLES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,199203",
    "Latitud": "4,575019"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76869,
    "Nombre Municipio": "VIJES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,441804",
    "Latitud": "3,698686"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76890,
    "Nombre Municipio": "YOTOCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,382698",
    "Latitud": "3,861241"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76892,
    "Nombre Municipio": "YUMBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,499893",
    "Latitud": "3,540097"
  },
  {
    "Código Departamento": 76,
    "Nombre Departamento": "VALLE DEL CAUCA",
    "Código Municipio": 76895,
    "Nombre Municipio": "ZARZAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,070795",
    "Latitud": "4,392658"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81001,
    "Nombre Municipio": "ARAUCA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-70,747408",
    "Latitud": "7,072726"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81065,
    "Nombre Municipio": "ARAUQUITA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,426733",
    "Latitud": "7,02702"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81220,
    "Nombre Municipio": "CRAVO NORTE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-70,204286",
    "Latitud": "6,303913"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81300,
    "Nombre Municipio": "FORTUL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,76877",
    "Latitud": "6,796695"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81591,
    "Nombre Municipio": "PUERTO RONDÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,10339",
    "Latitud": "6,281461"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81736,
    "Nombre Municipio": "SARAVENA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,872812",
    "Latitud": "6,953926"
  },
  {
    "Código Departamento": 81,
    "Nombre Departamento": "ARAUCA",
    "Código Municipio": 81794,
    "Nombre Municipio": "TAME",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,754427",
    "Latitud": "6,453324"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85001,
    "Nombre Municipio": "YOPAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,396132",
    "Latitud": "5,327102"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85010,
    "Nombre Municipio": "AGUAZUL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,546838",
    "Latitud": "5,172641"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85015,
    "Nombre Municipio": "CHÁMEZA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,87016",
    "Latitud": "5,214527"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85125,
    "Nombre Municipio": "HATO COROZAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,764213",
    "Latitud": "6,154099"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85136,
    "Nombre Municipio": "LA SALINA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,334978",
    "Latitud": "6,127762"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85139,
    "Nombre Municipio": "MANÍ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,281384",
    "Latitud": "4,81681"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85162,
    "Nombre Municipio": "MONTERREY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,894065",
    "Latitud": "4,877017"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85225,
    "Nombre Municipio": "NUNCHÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,195323",
    "Latitud": "5,636474"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85230,
    "Nombre Municipio": "OROCUÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,338533",
    "Latitud": "4,790258"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85250,
    "Nombre Municipio": "PAZ DE ARIPORO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,890348",
    "Latitud": "5,879827"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85263,
    "Nombre Municipio": "PORE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,99286",
    "Latitud": "5,72773"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85279,
    "Nombre Municipio": "RECETOR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,760991",
    "Latitud": "5,229181"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85300,
    "Nombre Municipio": "SABANALARGA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-73,038696",
    "Latitud": "4,854787"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85315,
    "Nombre Municipio": "SÁCAMA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,250157",
    "Latitud": "6,096738"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85325,
    "Nombre Municipio": "SAN LUIS DE PALENQUE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,732198",
    "Latitud": "5,422397"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85400,
    "Nombre Municipio": "TÁMARA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,16165",
    "Latitud": "5,829543"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85410,
    "Nombre Municipio": "TAURAMENA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,74662",
    "Latitud": "5,018977"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85430,
    "Nombre Municipio": "TRINIDAD",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,662812",
    "Latitud": "5,412178"
  },
  {
    "Código Departamento": 85,
    "Nombre Departamento": "CASANARE",
    "Código Municipio": 85440,
    "Nombre Municipio": "VILLANUEVA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,927797",
    "Latitud": "4,61035"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86001,
    "Nombre Municipio": "MOCOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,654238",
    "Latitud": "1,151172"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86219,
    "Nombre Municipio": "COLÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,972566",
    "Latitud": "1,190133"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86320,
    "Nombre Municipio": "ORITO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,873276",
    "Latitud": "0,663593"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86568,
    "Nombre Municipio": "PUERTO ASÍS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,496887",
    "Latitud": "0,505627"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86569,
    "Nombre Municipio": "PUERTO CAICEDO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,606118",
    "Latitud": "0,687784"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86571,
    "Nombre Municipio": "PUERTO GUZMÁN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,407663",
    "Latitud": "0,962854"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86573,
    "Nombre Municipio": "PUERTO LEGUÍZAMO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-74,781842",
    "Latitud": "-0,192318"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86749,
    "Nombre Municipio": "SIBUNDOY",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,917814",
    "Latitud": "1,20026"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86755,
    "Nombre Municipio": "SAN FRANCISCO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,879283",
    "Latitud": "1,174194"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86757,
    "Nombre Municipio": "SAN MIGUEL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,91217",
    "Latitud": "0,34346"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86760,
    "Nombre Municipio": "SANTIAGO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-77,002641",
    "Latitud": "1,147076"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86865,
    "Nombre Municipio": "VALLE DEL GUAMUEZ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,906751",
    "Latitud": "0,423506"
  },
  {
    "Código Departamento": 86,
    "Nombre Departamento": "PUTUMAYO",
    "Código Municipio": 86885,
    "Nombre Municipio": "VILLAGARZÓN",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-76,61721",
    "Latitud": "1,028821"
  },
  {
    "Código Departamento": 88,
    "Nombre Departamento": "ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA",
    "Código Municipio": 88001,
    "Nombre Municipio": "SAN ANDRÉS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Isla",
    "longitud": "-81,707181",
    "Latitud": "12,578108"
  },
  {
    "Código Departamento": 88,
    "Nombre Departamento": "ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA",
    "Código Municipio": 88564,
    "Nombre Municipio": "PROVIDENCIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-81,368386",
    "Latitud": "13,373185"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91001,
    "Nombre Municipio": "LETICIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-69,941721",
    "Latitud": "-4,19895"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91263,
    "Nombre Municipio": "EL ENCANTO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-73,207114",
    "Latitud": "-1,74806"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91405,
    "Nombre Municipio": "LA CHORRERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-72,791889",
    "Latitud": "-1,442617"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91407,
    "Nombre Municipio": "LA PEDRERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-69,585499",
    "Latitud": "-1,320301"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91430,
    "Nombre Municipio": "LA VICTORIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-71,223208",
    "Latitud": "0,054936"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91460,
    "Nombre Municipio": "MIRITÍ - PARANÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-70,98893",
    "Latitud": "-0,888833"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91530,
    "Nombre Municipio": "PUERTO ALEGRÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-74,014461",
    "Latitud": "-1,005674"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91536,
    "Nombre Municipio": "PUERTO ARICA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-71,752186",
    "Latitud": "-2,147039"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91540,
    "Nombre Municipio": "PUERTO NARIÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-70,364937",
    "Latitud": "-3,779934"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91669,
    "Nombre Municipio": "PUERTO SANTANDER",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-72,384213",
    "Latitud": "-0,621184"
  },
  {
    "Código Departamento": 91,
    "Nombre Departamento": "AMAZONAS",
    "Código Municipio": 91798,
    "Nombre Municipio": "TARAPACÁ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-69,741745",
    "Latitud": "-2,890126"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94001,
    "Nombre Municipio": "INÍRIDA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-67,918613",
    "Latitud": "3,866764"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94343,
    "Nombre Municipio": "BARRANCOMINAS",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-69,814066",
    "Latitud": "3,494178"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94883,
    "Nombre Municipio": "SAN FELIPE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-67,067848",
    "Latitud": "1,912495"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94884,
    "Nombre Municipio": "PUERTO COLOMBIA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-67,566774",
    "Latitud": "2,726438"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94885,
    "Nombre Municipio": "LA GUADALUPE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-66,963692",
    "Latitud": "1,632464"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94886,
    "Nombre Municipio": "CACAHUAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-67,413312",
    "Latitud": "3,52617"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94887,
    "Nombre Municipio": "PANA PANA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-69,0099",
    "Latitud": "1,865668"
  },
  {
    "Código Departamento": 94,
    "Nombre Departamento": "GUAINÍA",
    "Código Municipio": 94888,
    "Nombre Municipio": "MORICHAL",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-69,919404",
    "Latitud": "2,265132"
  },
  {
    "Código Departamento": 95,
    "Nombre Departamento": "GUAVIARE",
    "Código Municipio": 95001,
    "Nombre Municipio": "SAN JOSÉ DEL GUAVIARE",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,639254",
    "Latitud": "2,565932"
  },
  {
    "Código Departamento": 95,
    "Nombre Departamento": "GUAVIARE",
    "Código Municipio": 95015,
    "Nombre Municipio": "CALAMAR",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,655197",
    "Latitud": "1,960982"
  },
  {
    "Código Departamento": 95,
    "Nombre Departamento": "GUAVIARE",
    "Código Municipio": 95025,
    "Nombre Municipio": "EL RETORNO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-72,627304",
    "Latitud": "2,330164"
  },
  {
    "Código Departamento": 95,
    "Nombre Departamento": "GUAVIARE",
    "Código Municipio": 95200,
    "Nombre Municipio": "MIRAFLORES",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,950416",
    "Latitud": "1,337539"
  },
  {
    "Código Departamento": 97,
    "Nombre Departamento": "VAUPÉS",
    "Código Municipio": 97001,
    "Nombre Municipio": "MITÚ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-70,232641",
    "Latitud": "1,253151"
  },
  {
    "Código Departamento": 97,
    "Nombre Departamento": "VAUPÉS",
    "Código Municipio": 97161,
    "Nombre Municipio": "CARURÚ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-71,30221",
    "Latitud": "1,016116"
  },
  {
    "Código Departamento": 97,
    "Nombre Departamento": "VAUPÉS",
    "Código Municipio": 97511,
    "Nombre Municipio": "PACOA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-71,004339",
    "Latitud": "0,020698"
  },
  {
    "Código Departamento": 97,
    "Nombre Departamento": "VAUPÉS",
    "Código Municipio": 97666,
    "Nombre Municipio": "TARAIRA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-69,635497",
    "Latitud": "-0,564984"
  },
  {
    "Código Departamento": 97,
    "Nombre Departamento": "VAUPÉS",
    "Código Municipio": 97777,
    "Nombre Municipio": "PAPUNAHUA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-70,76091",
    "Latitud": "1,908124"
  },
  {
    "Código Departamento": 97,
    "Nombre Departamento": "VAUPÉS",
    "Código Municipio": 97889,
    "Nombre Municipio": "YAVARATÉ",
    "Tipo: Municipio / Isla / Área no municipalizada": "Área no municipalizada",
    "longitud": "-69,203337",
    "Latitud": "0,609142"
  },
  {
    "Código Departamento": 99,
    "Nombre Departamento": "VICHADA",
    "Código Municipio": 99001,
    "Nombre Municipio": "PUERTO CARREÑO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-67,487095",
    "Latitud": "6,186636"
  },
  {
    "Código Departamento": 99,
    "Nombre Departamento": "VICHADA",
    "Código Municipio": 99524,
    "Nombre Municipio": "LA PRIMAVERA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-70,410515",
    "Latitud": "5,486309"
  },
  {
    "Código Departamento": 99,
    "Nombre Departamento": "VICHADA",
    "Código Municipio": 99624,
    "Nombre Municipio": "SANTA ROSALÍA",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-70,859499",
    "Latitud": "5,136393"
  },
  {
    "Código Departamento": 99,
    "Nombre Departamento": "VICHADA",
    "Código Municipio": 99773,
    "Nombre Municipio": "CUMARIBO",
    "Tipo: Municipio / Isla / Área no municipalizada": "Municipio",
    "longitud": "-69,795533",
    "Latitud": "4,446352"
  }
]

export const municipiosSort: Municipio[] = municipios.sort((a, b) => 
  a["Nombre Municipio"].localeCompare(b["Nombre Municipio"])
);