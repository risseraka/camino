import { Definition } from '../definition'

export const TITRES_TYPES_TYPES_IDS = {
  AUTORISATION_DE_PROSPECTION: 'ap',
  AUTORISATION_DE_RECHERCHE: 'ar',
  AUTORISATION_D_EXPLOITATION: 'ax',
  CONCESSION: 'cx',
  INDETERMINE: 'in',
  PERMIS_EXCLUSIF_DE_CARRIERES: 'pc',
  PERMIS_EXCLUSIF_DE_RECHERCHES: 'pr',
  PERMIS_D_EXPLOITATION: 'px'
} as const
export type TitreTypeTypeId = typeof TITRES_TYPES_TYPES_IDS[keyof typeof TITRES_TYPES_TYPES_IDS]

export const TitresTypesTypes: {
  [key in TitreTypeTypeId]: Definition<key>
} = {
  ap: {
    id: 'ap',
    nom: 'autorisation de prospections préalables',
    description:
      "Cette autorisation est applicable aux granulats marins et aux hydrocarbures liquides ou gazeux. Elle donne le droit non exclusif de solliciter l’exécution de tous travaux de recherches en mer destinés à acquérir des connaissances sur le contexte géologique et les gisements du sous-sol marin. Son titulaire ne peut pas disposer des éventuels gisements identifiés. Les sondages dépassant une profondeur de 300 mètres à partir du fond de la mer sont exclus. Sa durée ne peut excéder deux ans. L'autorisation de prospection préalable n'inclut pas d'autorisation de travaux miniers.",
    ordre: 1
  },
  ar: {
    id: 'ar',
    nom: 'autorisation de recherches',
    description:
      "Cette autorisation minière donne un droit de prospection destiné à caractériser un gisement pressenti. Ensuite le titulaire pourra éventuellement faire valoir son droit d’inventeur. Il s’agit généralement de périmètres n'excédant pas quelques kilomètres carrés. Elle se décline pour :\r\n- la géothermie , la durée n'excédant pas trois ans ;\r\n- dans les zones spéciales de carrières pour une durée de trois ans renouvelable sans limite pour la même durée.\r\n- pour les minéraux et métaux, en Guyane, afin d’effectuer des travaux de recherches avec l’accord du propriétaire du sol. Cette autorisation porte exclusivement sur le domaine privé forestier de l’Etat. Elle est accordée par l’Office National des Forêts, mandataire de l’Etat, sous la conduite du préfet.",
    ordre: 2
  },
  ax: {
    id: 'ax',
    nom: "autorisation d'exploitation",
    description:
      "Cette autorisation minière donne un droit d’exploitation d’un gisement de minerais ou de métaux sur une zone n'excédant pas un kilomètre carré dans les départements et régions d’outre-mer. Sa durée de validité est de 4 ans renouvelable une fois.",
    ordre: 4
  },
  cx: {
    id: 'cx',
    nom: 'concession',
    description:
      'Ce titre donne un droit d’exploitation. Il est applicable à tous les domaines miniers excepté dans les zones spéciales de carrières pour ces substances. Elle est accordée pour une durée maximale de cinquante ans et peut faire l’objet de prolongations successives de vingt-cinq ans maximum. La concession donne également l’exclusivité des droits de prospection sur les substances concédées sur son périmètre.',
    ordre: 7
  },
  in: {
    id: 'in',
    nom: 'indéterminé',
    description: 'Titres et autorisations dont les informations disponibles sont insuffisantes pour en déterminer le statut.',
    ordre: 8
  },
  pc: {
    id: 'pc',
    nom: 'permis exclusif de carrières',
    description:
      'Ce titre minier donne le droit d’exploitation d’un gisement de substances de carrière situé dans le périmètre d’une zone spéciale de carrières. Sa durée maximale est de dix ans et peut faire l’objet de prolongations successives. L’autorité décisionnaire est le ministre chargé des mines et le ministre chargé de l’environnement conjointement.',
    ordre: 5
  },
  pr: {
    id: 'pr',
    nom: 'permis exclusif de recherches',
    description:
      'Ce titre minier donne un droit de prospection destiné à faire l’inventaire des gisements sur lesquels le titulaire pourra faire valoir son droit d’inventeur. Il est applicable à tous les domaines miniers excepté les zones spéciales de carrières. Il s’agit généralement de larges périmètres (plusieurs centaines de kilomètres carrés). Sa durée est de cinq ans maximum renouvelable deux fois. Pour les hydrocarbures liquides ou gazeux, l’une de ces trois périodes peut faire l’objet d’une prolongation exceptionnelle de trois ans maximum.',
    ordre: 3
  },
  px: {
    id: 'px',
    nom: "permis d'exploitation",
    description:
      'Ce titre minier donne un droit d’exploitation de gîtes de géothermie (dans un volume déterminé par un périmètre et deux profondeurs). Il est accordé pour trente ans maximum et peut faire l’objet de prolongations successives de quinze ans maximum. Il est également applicable aux mines de minéraux et métaux dans les départements et régions d’outre-mer, pour cinq ans maximum prolongeables deux fois.',
    ordre: 6
  }
}

const titreTypesTypeIds = Object.values(TITRES_TYPES_TYPES_IDS)

export const isTitreTypeType = (titreTypeType: string | undefined | null): titreTypeType is TitreTypeTypeId => titreTypesTypeIds.includes(titreTypeType)
