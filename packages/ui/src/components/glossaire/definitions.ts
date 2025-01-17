interface Definition {
  id: string
  nom: string
  slug: string
  ordre: number
  description?: string
}

export const definitions: Definition[] = [
  {
    id: 'dom',
    nom: 'Domaines miniers',
    slug: 'domaines',
    ordre: 1,
    description:
      "Territoire national et sous juridiction française, sur lequel l’État ou les collectivités territoriales compétentes sont autorisés à mener ou à faire mener pour leur compte, l'inventaire et l'exploitation des ressources en matières premières du sous-sol classées dans la catégorie des substances de mines.\n\nLes substances de mines sont  regroupées   selon leur nature, leurs méthodes d’exploitation et leurs usages : \nminéraux et métaux, \nhydrocarbures liquides ou gazeux, \ncombustibles fossiles,\néléments radioactifs\n\nDes substances de carrières, telle que les granulats marins, présentent des enjeux équivalents à ceux des substances de mines en matière d’accès à la ressource et empruntent des règles de gestion minière adaptées.\n\nL’exploitation de gîtes de géothermie et l’usage de formations géologiques aptes au stockage souterrain de certaines substances, qui présentent des enjeux équivalents à ceux des substances de mines de part leur localisation dans le sous-sol, empruntent également les règles de gestions minières adaptées à leurs spécificités."
  },
  {
    id: 'dst',
    nom: 'Statuts de démarches',
    slug: 'demarches-statuts',
    ordre: 7
  },
  {
    id: 'dty',
    nom: 'Types de démarches',
    slug: 'demarches-types',
    ordre: 6
  },
  {
    id: 'est',
    nom: "Statuts d'étapes",
    slug: 'etapes-statuts',
    ordre: 9
  },
  {
    id: 'ety',
    nom: "Types d'étapes",
    slug: 'etapes-types',
    ordre: 8
  },
  {
    id: 'sdo',
    nom: 'SDOM (schéma départemental d’orientation minière)',
    slug: 'sdom',
    ordre: 11,
    description:
      'Il est spécifique à la Guyane et a pour vocation de définir les conditions générales applicables à la recherche minière, ainsi que les modalités de l’implantation et de l’exploitation des sites miniers. Il définit un zonage (3 zones : zone 0, 1 et 2) des secteurs ouverts et interdits à l’activité minière et fixe au besoin des contraintes particulières sur certaines zones. \n</br>\n</br>\nTrois zones sont définies : \n</br>\n<ul>\n<li>Zone 0 : activité interdite</li>\n<li>Zone 1 : activité interdite sauf exploitation souterraine et recherches aériennes</li>\n<li>Zone 2 : activité autorisée sous contrainte</li>\n</ul>\nCe zonage traduit la compatibilité des différents espaces du territoire de la Guyane avec les activités minières, en prenant en compte la nécessité de protéger les milieux naturels sensibles, les paysages, les sites et les populations et de gérer de manière équilibrée l’espace et les ressources naturelles. Il tient compte de l’intérêt économique de la Guyane et de la valorisation durable de ses ressources minières. Au sein des secteurs qu’il identifie comme compatibles avec une activité d’exploitation, il fixe les contraintes environnementales et les objectifs à atteindre en matière de remise en état des sites miniers.\n</br>\n</br>\n<a href="http://www.guyane.developpement-durable.gouv.fr/schema-departemental-d-orientation-miniere-a1535.html" target="blank"><b>Arrêté préfectoral du SDOM</b>\n</br>\n</br>\n<a href="https://carto.geoguyane.fr/1/sdom.map" target="blank"><b>Carte du SDOM</b>\n'
  },
  {
    id: 'smi',
    nom: 'Substances et usages du sous-sol',
    slug: 'substances-legales',
    ordre: 10
  },
  {
    id: 'tma',
    nom: 'Autorisations minières',
    slug: 'autorisation-miniere',
    ordre: 3,
    description:
      "Acte administratif individuel qui octroie des droits miniers exclusifs, pour des substances de mines ou des usages du sous-sol, pour une durée et un périmètre fixés. Selon les cas, l’autorité décisionnaire est le ministre chargée des mines, le préfet ou l’Office national des forêts, (mandataire de l'État pour l'administration et la gestion des autorisations de recherches minières pour l’or en Guyane). Certaines autorisations minières peuvent inclurent une autorisation de travaux miniers."
  },
  {
    id: 'tmi',
    nom: 'Titres miniers',
    slug: 'titre-minier',
    ordre: 2,
    description:
      'Acte administratif individuel qui octroie des droits miniers exclusifs, pour des substances de mines ou des usages du sous-sol, pour une durée et dans un périmètre fixés. L’autorité décisionnaire est le ministre chargée des mines. Le titre n’inclut pas d’autorisation de travaux miniers.\n\nVous pouvez vous abonner au titre minier pour recevoir des notifications par email à chaque fois qu’une nouvelle étape est ajoutée.'
  },
  {
    id: 'tst',
    nom: 'Statuts des autorisations et titres miniers',
    slug: 'titres-statuts',
    ordre: 5,
    description:
      'Ce statut caractérise l’état d’avancement du projet minier.\r\nIl indique l’état de disponibilité du domaine minier pour les substances ou les usages visés par le titre ou l’autorisation.'
  },
  {
    id: 'tty',
    nom: 'Types de titres',
    slug: 'titres-types',
    ordre: 4
  },
  {
    id: 'pdm',
    nom: 'Police des mines',
    slug: 'police-des-mines',
    description:
      'La police des mines a pour objet de prévenir et de faire cesser les dommages et les nuisances imputables aux activités de recherches et d’exploitation des mines et spécialement de faire respecter les contraintes et les obligations énoncées dans des décrets pris pour préserver les intérêts mentionnés à l’article L. 161-1 ainsi que les obligations mentionnées à l’article L. 161-2 et par les textes pris pour leur application.',
    ordre: 12
  }
]
