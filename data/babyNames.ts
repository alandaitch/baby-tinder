interface BabyName {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  origin: string;
  meaning: string;
  popularity?: number;
}

// Datos extraídos del CSV de nombres argentinos 2010-2014, excluyendo nombres compuestos
export const babyNames: BabyName[] = [
  {
    id: 1,
    name: "Benjamin",
    gender: "male",
    origin: "Hebreo",
    meaning: "Hijo de la mano derecha o del sur",
    popularity: 2986
  },
  {
    id: 2,
    name: "Sofia",
    gender: "female",
    origin: "Griego",
    meaning: "Sabiduría",
    popularity: 2252
  },
  {
    id: 3,
    name: "Bautista",
    gender: "male",
    origin: "Griego",
    meaning: "El que bautiza",
    popularity: 2176
  },
  {
    id: 4,
    name: "Joaquín",
    gender: "male",
    origin: "Hebreo",
    meaning: "Dios ha establecido",
    popularity: 2111
  },
  {
    id: 5,
    name: "Martina",
    gender: "female",
    origin: "Latín",
    meaning: "Consagrada a Marte",
    popularity: 2026
  },
  {
    id: 6,
    name: "Santiago",
    gender: "male",
    origin: "Hebreo",
    meaning: "El que suplanta",
    popularity: 2012
  },
  {
    id: 7,
    name: "Valentina",
    gender: "female",
    origin: "Latín",
    meaning: "La que es fuerte y valiente",
    popularity: 1972
  },
  {
    id: 8,
    name: "Catalina",
    gender: "female",
    origin: "Griego",
    meaning: "La que es pura",
    popularity: 1892
  },
  {
    id: 9,
    name: "Santino",
    gender: "male",
    origin: "Italiano",
    meaning: "Pequeño santo",
    popularity: 1699
  },
  {
    id: 10,
    name: "Valentino",
    gender: "male",
    origin: "Latín",
    meaning: "El que es fuerte y sano",
    popularity: 1665
  },
  {
    id: 11,
    name: "Delfina",
    gender: "female",
    origin: "Griego",
    meaning: "Relacionada con el delfín",
    popularity: 1549
  },
  {
    id: 12,
    name: "Mateo",
    gender: "male",
    origin: "Hebreo",
    meaning: "Regalo de Dios",
    popularity: 1526
  },
  {
    id: 13,
    name: "Agustín",
    gender: "male",
    origin: "Latín",
    meaning: "Venerable, digno de respeto",
    popularity: 1341
  },
  {
    id: 14,
    name: "Francisco",
    gender: "male",
    origin: "Germánico",
    meaning: "El que es libre",
    popularity: 1338
  },
  {
    id: 15,
    name: "Tomás",
    gender: "male",
    origin: "Arameo",
    meaning: "Gemelo",
    popularity: 1315
  },
  {
    id: 16,
    name: "Isabella",
    gender: "female",
    origin: "Hebreo/Italiano",
    meaning: "Consagrada a Dios",
    popularity: 1297
  },
  {
    id: 17,
    name: "Felipe",
    gender: "male",
    origin: "Griego",
    meaning: "El que ama a los caballos",
    popularity: 1251
  },
  {
    id: 18,
    name: "Julieta",
    gender: "female",
    origin: "Latín",
    meaning: "De cabello suave",
    popularity: 1173
  },
  {
    id: 19,
    name: "Victoria",
    gender: "female",
    origin: "Latín",
    meaning: "La victoriosa",
    popularity: 1152
  },
  {
    id: 20,
    name: "Lautaro",
    gender: "male",
    origin: "Mapuche",
    meaning: "Halcón veloz",
    popularity: 1150
  },
  {
    id: 21,
    name: "Josefina",
    gender: "female",
    origin: "Hebreo",
    meaning: "Dios añadirá",
    popularity: 1136
  },
  {
    id: 22,
    name: "Morena",
    gender: "female",
    origin: "Español",
    meaning: "De piel oscura",
    popularity: 1132
  },
  {
    id: 23,
    name: "Juana",
    gender: "female",
    origin: "Hebreo",
    meaning: "Dios es misericordioso",
    popularity: 1091
  },
  {
    id: 24,
    name: "Camila",
    gender: "female",
    origin: "Latín",
    meaning: "Joven asistente en ceremonias religiosas",
    popularity: 1063
  },
  {
    id: 25,
    name: "Ignacio",
    gender: "male",
    origin: "Latín",
    meaning: "El ardiente, fogoso",
    popularity: 1061
  },
  {
    id: 26,
    name: "Guadalupe",
    gender: "female",
    origin: "Árabe",
    meaning: "Río de piedras negras",
    popularity: 1004
  },
  {
    id: 27,
    name: "Emma",
    gender: "female",
    origin: "Germánico",
    meaning: "Universal, completa",
    popularity: 931
  },
  {
    id: 28,
    name: "Jazmín",
    gender: "female",
    origin: "Persa",
    meaning: "Flor de jazmín",
    popularity: 915
  },
  {
    id: 29,
    name: "Facundo",
    gender: "male",
    origin: "Latín",
    meaning: "Elocuente, fértil",
    popularity: 897
  },
  {
    id: 30,
    name: "Máximo",
    gender: "male",
    origin: "Latín",
    meaning: "El más grande",
    popularity: 895
  },
  {
    id: 31,
    name: "Nicolás",
    gender: "male",
    origin: "Griego",
    meaning: "Victoria del pueblo",
    popularity: 862
  },
  {
    id: 32,
    name: "Thiago",
    gender: "male",
    origin: "Portugués/Español",
    meaning: "Variante de Santiago/Diego",
    popularity: 857
  },
  {
    id: 33,
    name: "Lola",
    gender: "female",
    origin: "Español",
    meaning: "Diminutivo de Dolores",
    popularity: 835
  },
  {
    id: 34,
    name: "Valentín",
    gender: "male",
    origin: "Latín",
    meaning: "El que es fuerte y sano",
    popularity: 830
  },
  {
    id: 35,
    name: "Agustina",
    gender: "female",
    origin: "Latín",
    meaning: "Venerable, digna de respeto",
    popularity: 797
  },
  {
    id: 36,
    name: "Pilar",
    gender: "female",
    origin: "Español",
    meaning: "Columna, apoyo, sustento",
    popularity: 795
  },
  {
    id: 37,
    name: "Alma",
    gender: "female",
    origin: "Latín",
    meaning: "Nutriente, que alimenta",
    popularity: 779
  },
  {
    id: 38,
    name: "Emilia",
    gender: "female",
    origin: "Latín",
    meaning: "Rival, émula",
    popularity: 779
  },
  {
    id: 39,
    name: "Matías",
    gender: "male",
    origin: "Hebreo",
    meaning: "Regalo de Dios",
    popularity: 778
  },
  {
    id: 40,
    name: "Renata",
    gender: "female",
    origin: "Latín",
    meaning: "Renacida, nacida de nuevo",
    popularity: 745
  },
  {
    id: 41,
    name: "Malena",
    gender: "female",
    origin: "Hebreo",
    meaning: "Torre elevada, amarga",
    popularity: 739
  },
  {
    id: 42,
    name: "Olivia",
    gender: "female",
    origin: "Latín",
    meaning: "Olivo, símbolo de paz",
    popularity: 686
  },
  {
    id: 43,
    name: "Franco",
    gender: "male",
    origin: "Germánico",
    meaning: "Libre, sincero",
    popularity: 657
  },
  {
    id: 44,
    name: "Bianca",
    gender: "female",
    origin: "Italiano",
    meaning: "Blanca, pura",
    popularity: 656
  },
  {
    id: 45,
    name: "Bruno",
    gender: "male",
    origin: "Germánico",
    meaning: "Moreno, de cabello oscuro",
    popularity: 648
  },
  {
    id: 46,
    name: "Pedro",
    gender: "male",
    origin: "Griego",
    meaning: "Piedra, roca",
    popularity: 640
  },
  {
    id: 47,
    name: "Lucas",
    gender: "male",
    origin: "Griego",
    meaning: "Luminoso, brillante",
    popularity: 618
  },
  {
    id: 48,
    name: "Simón",
    gender: "male",
    origin: "Hebreo",
    meaning: "El que escucha",
    popularity: 593
  },
  {
    id: 49,
    name: "Julia",
    gender: "female",
    origin: "Latín",
    meaning: "De cabello suave, juvenil",
    popularity: 593
  },
  {
    id: 50,
    name: "Manuel",
    gender: "male",
    origin: "Hebreo",
    meaning: "Dios está con nosotros",
    popularity: 581
  }
];

export default babyNames;
