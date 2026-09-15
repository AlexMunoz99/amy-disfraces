/**
 * Base de datos oficial de productos para AMY Disfraces y Accesorios
 * Cada producto incluye soporte para múltiples tallas, precios variables por talla y stock en tiempo real.
 */

const CATALOG_PRODUCTS = [
  {
    id: "hada-bosque",
    name: "Hada del Bosque Encantado",
    category: "fantasia",
    season: "primavera",
    audience: "infantil",
    badge: "Más Vendido",
    badgeColor: "secondary",
    description: "Vestuario confeccionado en satín tornasol con sobrecapas de tul brillante, hojas bordadas en tonos esmeralda y detalles en hilo dorado. Ideal para festivales de primavera, carnavales y fiestas de fantasía.",
    includes: "Vestido con corset ajustable, alas traslúcidas con escarcha dorada y tiara floral artesanal.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 4 (3-4 años)", label: "Talla 4 Infantil", priceSale: 450, priceRent: 220, stock: 5, status: "available" },
      { size: "Talla 6 (5-6 años)", label: "Talla 6 Infantil", priceSale: 490, priceRent: 240, stock: 3, status: "available" },
      { size: "Talla 8 (7-8 años)", label: "Talla 8 Infantil", priceSale: 520, priceRent: 250, stock: 2, status: "low" },
      { size: "Talla 10-12 (9-11 años)", label: "Talla 10-12 Infantil", priceSale: 560, priceRent: 270, stock: 1, status: "low" },
      { size: "Adulto CH/M", label: "Adulto CH/M", priceSale: 720, priceRent: 350, stock: 0, status: "out" }
    ]
  },
  {
    id: "centinela-cosmico",
    name: "Centinela Cósmico / Superhéroe",
    category: "superheroes",
    season: "verano",
    audience: "ambos",
    badge: "Favorito de Niños",
    badgeColor: "primary",
    description: "Enterizo ergonómico de alta elasticidad con relieve muscular termoformado, pechera con emblema metálico brillante y capa desmontable de suave caída.",
    includes: "Traje completo con músculos acolchados, máscara ergonómica transpirable, capa con broches y cinturón utilitario.",
    image: "https://images.unsplash.com/photo-1563240619-44ec0047592c?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 4-6 Infantil", label: "Talla 4-6 Infantil", priceSale: 520, priceRent: 250, stock: 4, status: "available" },
      { size: "Talla 8-10 Infantil", label: "Talla 8-10 Infantil", priceSale: 580, priceRent: 280, stock: 3, status: "available" },
      { size: "Talla 12-14 Infantil", label: "Talla 12-14 Infantil", priceSale: 620, priceRent: 300, stock: 1, status: "low" },
      { size: "Adulto Talla M", label: "Adulto Mediano", priceSale: 790, priceRent: 380, stock: 2, status: "low" },
      { size: "Adulto Talla G/XL", label: "Adulto Grande / XL", priceSale: 850, priceRent: 400, stock: 2, status: "available" }
    ]
  },
  {
    id: "hechicera-victoriana",
    name: "Hechicera Victoriana Gótica",
    category: "halloween",
    season: "otono",
    audience: "adulto",
    badge: "Colección Premium",
    badgeColor: "tertiary",
    description: "Exclusivo vestido largo de corte gótico en terciopelo color vino tinto profundo y encaje negro artesanal. Estilo refinado para Halloween, Noche de Brujas y obras teatrales de época.",
    includes: "Vestido aterciopelado con corset frontal, enagua con cancán, sombrero alto de terciopelo con plumas y gargantilla gótica.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Juvenil / S (Talla 28-30)", label: "Juvenil / S", priceSale: 690, priceRent: 350, stock: 3, status: "available" },
      { size: "Adulto M (Talla 32-34)", label: "Adulto M", priceSale: 790, priceRent: 390, stock: 4, status: "available" },
      { size: "Adulto G (Talla 36-38)", label: "Adulto G", priceSale: 840, priceRent: 420, stock: 1, status: "low" },
      { size: "Adulto XL (Talla 40+)", label: "Adulto XL", priceSale: 890, priceRent: 440, stock: 0, status: "out" }
    ]
  },
  {
    id: "cascanueces-gala",
    name: "Cascanueces de Gala Real",
    category: "navidad",
    season: "invierno",
    audience: "ambos",
    badge: "Exclusivo Amy",
    badgeColor: "primary",
    description: "Traje clásico de gala militar con casaca en terciopelo azul y vivos rojos, charreteras doradas bordadas con flecos, botones dorados de latón y pantalón sastre blanco impecable.",
    includes: "Casaca de gala con charreteras, pantalón blanco de vestir, sombrero chacó militar con pluma y cinturón dorado.",
    image: "https://images.unsplash.com/photo-1543258103-a62bdc069871?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 4-6 Infantil", label: "Talla 4-6 Infantil", priceSale: 560, priceRent: 280, stock: 2, status: "available" },
      { size: "Talla 8-10 Infantil", label: "Talla 8-10 Infantil", priceSale: 620, priceRent: 310, stock: 3, status: "available" },
      { size: "Talla 12-14 Juvenil", label: "Talla 12-14 Juvenil", priceSale: 690, priceRent: 340, stock: 1, status: "low" },
      { size: "Adulto Talla M", label: "Adulto Mediano", priceSale: 890, priceRent: 450, stock: 2, status: "available" },
      { size: "Adulto Talla G", label: "Adulto Grande", priceSale: 940, priceRent: 470, stock: 1, status: "low" }
    ]
  },
  {
    id: "catrina-elegante",
    name: "Catrina Tradicional Mexicana",
    category: "halloween",
    season: "otono",
    audience: "ambos",
    badge: "Tradición y Arte",
    badgeColor: "tertiary",
    description: "Vestido folclórico mexicano con corset bordado con motivos florales multicolores, falda amplia con listones de satín brillante y diadema monumental de cempasúchil artesanal.",
    includes: "Vestido con falda amplia de vuelo, fajilla de listones, tiara monumental con flores y velo de encaje negro.",
    image: "https://images.unsplash.com/photo-1603574670812-d24560880210?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 6-8 Infantil", label: "Talla 6-8 Infantil", priceSale: 520, priceRent: 260, stock: 3, status: "available" },
      { size: "Talla 10-12 Infantil", label: "Talla 10-12 Infantil", priceSale: 590, priceRent: 290, stock: 2, status: "available" },
      { size: "Adulto Talla CH/M", label: "Adulto CH/M", priceSale: 850, priceRent: 420, stock: 4, status: "available" },
      { size: "Adulto Talla G/XL", label: "Adulto G/XL", priceSale: 920, priceRent: 450, stock: 1, status: "low" }
    ]
  },
  {
    id: "santa-claus-gala",
    name: "Santa Claus Imperial de Felpa",
    category: "navidad",
    season: "invierno",
    audience: "adulto",
    badge: "Temporada Decembrina",
    badgeColor: "secondary",
    description: "Traje profesional de lujo confeccionado en terciopelo rojo cereza de alto gramaje con ribetes de peluche blanco extra suave. Diseñado para eventos empresariales, centros comerciales y posadas familiares.",
    includes: "Saco con cierre frontal oculto, pantalón con elástico, cinturón ancho de vinipiel con hebilla dorada maciza, gorro con pompón gigante y cubre-botas.",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Adulto Estándar (M - G)", label: "Adulto Estándar (M - G)", priceSale: 1100, priceRent: 550, stock: 3, status: "available" },
      { size: "Adulto Extra Grande (XL - XXL)", label: "Adulto XL / XXL", priceSale: 1250, priceRent: 600, stock: 2, status: "low" }
    ]
  },
  {
    id: "abejita-escolar",
    name: "Abejita Melífera de Primavera",
    category: "escolar",
    season: "primavera",
    audience: "infantil",
    badge: "Festivales Escolares",
    badgeColor: "secondary",
    description: "Disfraz súper ligero y fresco diseñado especialmente para niños en festivales escolares de primavera. Tela transpirable que permite libre movimiento durante bailes y coreografías.",
    includes: "Vestido / peto a rayas amarillas y negras, alitas de gasa ligera con escarcha y diadema con antenitas flexibles.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80",
    canRent: false,
    variants: [
      { size: "Talla 2 (Maternal)", label: "Talla 2 (Maternal)", priceSale: 340, priceRent: null, stock: 6, status: "available" },
      { size: "Talla 4 (Kinder 1-2)", label: "Talla 4 (Kinder)", priceSale: 370, priceRent: null, stock: 5, status: "available" },
      { size: "Talla 6 (Kinder 3)", label: "Talla 6 (Preescolar)", priceSale: 390, priceRent: null, stock: 2, status: "low" },
      { size: "Talla 8 (Primaria)", label: "Talla 8 (Primaria)", priceSale: 420, priceRent: null, stock: 0, status: "out" }
    ]
  },
  {
    id: "princesa-cristal",
    name: "Princesa del Reino de Hielo",
    category: "fantasia",
    season: "invierno",
    audience: "infantil",
    badge: "Muy Solicitado",
    badgeColor: "primary",
    description: "Vestido con corset de lentejuelas celestes tornasoladas, falda con doble forro de organza y hermosa capa larga con copos de nieve estampados en plata.",
    includes: "Vestido con capa larga de copos de nieve, varita mágica plateada y corona con gemas acrílicas azules.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 4 Infantil", label: "Talla 4 Infantil", priceSale: 480, priceRent: 240, stock: 4, status: "available" },
      { size: "Talla 6 Infantil", label: "Talla 6 Infantil", priceSale: 520, priceRent: 260, stock: 3, status: "available" },
      { size: "Talla 8 Infantil", label: "Talla 8 Infantil", priceSale: 560, priceRent: 280, stock: 2, status: "low" },
      { size: "Talla 10 Infantil", label: "Talla 10 Infantil", priceSale: 590, priceRent: 295, stock: 0, status: "out" }
    ]
  },
  {
    id: "corsario-siete-mares",
    name: "Pirata Corsario de los Mares",
    category: "carnaval",
    season: "verano",
    audience: "ambos",
    badge: "Clásico Favorito",
    badgeColor: "tertiary",
    description: "Conjunto corsario completo con casaca en terciopelo marrón con solapas doradas, chaleco cruzado integrado, camisa con chorrera de encaje y cinturones con hebillas grabadas.",
    includes: "Casaca con camisa y chaleco integrado, pantalón a rayas, sombrero tricornio de pirata, parche para ojo y fajilla roja.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 6-8 Infantil", label: "Talla 6-8 Infantil", priceSale: 490, priceRent: 250, stock: 4, status: "available" },
      { size: "Talla 10-12 Juvenil", label: "Talla 10-12 Juvenil", priceSale: 550, priceRent: 280, stock: 3, status: "available" },
      { size: "Adulto Mediano (M)", label: "Adulto M", priceSale: 750, priceRent: 380, stock: 3, status: "available" },
      { size: "Adulto Grande (G/XL)", label: "Adulto G/XL", priceSale: 790, priceRent: 400, stock: 1, status: "low" }
    ]
  },
  {
    id: "antifaz-veneciano-plumas",
    name: "Antifaces Venecianos & Máscaras Teatrales",
    category: "accesorios",
    season: "carnaval",
    audience: "todos",
    badge: "Accesorios Top",
    badgeColor: "secondary",
    description: "Colección de máscaras venecianas artesanales de yeso ligero termoformado con aplicaciones en hoja de oro, pedrería engastada y finas plumas de pavo real o avestruz.",
    includes: "Máscara rígida artesanal con cinta de sujeción ajustable de satín.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    canRent: false,
    variants: [
      { size: "Antifaz Individual Estándar", label: "Modelo Clásico", priceSale: 180, priceRent: null, stock: 12, status: "available" },
      { size: "Máscara Veneciana con Plumas Largas", label: "Modelo Plumas de Gala", priceSale: 290, priceRent: null, stock: 5, status: "available" },
      { size: "Juego de Pareja (2 Antifaces)", label: "Dúo para Pareja", priceSale: 450, priceRent: null, stock: 3, status: "low" }
    ]
  },
  {
    id: "vampiro-conde",
    name: "Conde Vampiro de Transilvania",
    category: "halloween",
    season: "otono",
    audience: "ambos",
    badge: "Halloween",
    badgeColor: "tertiary",
    description: "Atuendo nocturno de gala con elegante capa de cuello rígido forrada en satín carmesí, chaleco brocado con botones de calavera y corbatín de satín con medallón rojo rubí.",
    includes: "Capa larga con cuello alto reforzado, chaleco brocado con camisa simulada, corbatín con medallón y colmillos estéticos.",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
    canRent: true,
    variants: [
      { size: "Talla 6-8 Infantil", label: "Talla 6-8 Infantil", priceSale: 460, priceRent: 230, stock: 3, status: "available" },
      { size: "Talla 10-12 Infantil", label: "Talla 10-12 Infantil", priceSale: 520, priceRent: 260, stock: 2, status: "available" },
      { size: "Adulto Talla M", label: "Adulto M", priceSale: 740, priceRent: 370, stock: 3, status: "available" },
      { size: "Adulto Talla G", label: "Adulto G", priceSale: 780, priceRent: 390, stock: 1, status: "low" }
    ]
  },
  {
    id: "set-pelucas-cosplay",
    name: "Pelucas Profesionales de Fantasía & Cosplay",
    category: "accesorios",
    season: "todo-el-ano",
    audience: "todos",
    badge: "Accesorios",
    badgeColor: "primary",
    description: "Pelucas de fibra sintética resistente a temperatura moderada (Kanekalon japonés). Variedad de colores vibrantes, cortes bob, melenas largas y rizos voluminosos.",
    includes: "Peluca profesional con red interior ajustable y redecilla para el cabello de regalo.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    canRent: false,
    variants: [
      { size: "Corte Bob Corto (Varios Colores)", label: "Corte Bob Corto", priceSale: 250, priceRent: null, stock: 8, status: "available" },
      { size: "Melena Larga Lisa 80cm", label: "Larga Lisa (80cm)", priceSale: 350, priceRent: null, stock: 6, status: "available" },
      { size: "Fantasía Rizos Extra Volumen", label: "Rizos Extra Volumen", priceSale: 420, priceRent: null, stock: 2, status: "low" }
    ]
  }
];

// Configuración general de la tienda
const STORE_CONFIG = {
  name: "AMY Disfraces y Accesorios",
  phone: "+52 55 1234 5678",
  whatsappNumber: "525512345678", // Número internacional sin '+' ni espacios
  address: "Av. de las Fiestas 340, Local 12 (Plaza Creativa)",
  hours: "Lun - Sáb: 10:00 - 20:00 | Dom: 11:00 - 17:00",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com"
  }
};
