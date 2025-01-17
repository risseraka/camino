import { Definition } from '../definition'

interface DemarchesDefinition<T> extends Definition<T> {
  titulaires?: boolean
  renouvelable?: boolean
  travaux?: boolean
  substances?: boolean
  points?: boolean
  duree?: boolean
  exception?: boolean
  auto?: boolean
}
export const DEMARCHES_TYPES_IDS = {
  Amodiation: 'amo',
  AutorisationDOuvertureDeTravaux: 'aom',
  Cession: 'ces',
  Conversion: 'con',
  DeclarationDArretDefinitifDesTravaux: 'dam',
  Decheance: 'dec',
  DeplacementDePerimetre: 'dep',
  DeclarationDOuvertureDeTravaux: 'dot',
  ExtensionDePerimetre: 'exp',
  ExtensionDeSubstance: 'exs',
  Fusion: 'fus',
  Mutation: 'mut',
  Octroi: 'oct',
  Prolongation1: 'pr1',
  Prolongation2: 'pr2',
  ProlongationExceptionnelle: 'pre',
  Prolongation: 'pro',
  Prorogation: 'prr',
  Renonciation: 'ren',
  ResiliationAnticipeeDAmodiation: 'res',
  Retrait: 'ret',
  DemandeDeTitreDExploitation: 'vct',
  MutationPartielle: 'vut'
} as const

export const DemarchesTypesIds = Object.values(DEMARCHES_TYPES_IDS)

export type DemarcheTypeId = typeof DEMARCHES_TYPES_IDS[keyof typeof DEMARCHES_TYPES_IDS]

export const DemarchesTypes: {
  [key in DemarcheTypeId]: DemarchesDefinition<key>
} = {
  amo: {
    id: 'amo',
    nom: 'amodiation',
    description:
      'Démarche co-initiée par le titulaire de certains titres miniers d’exploitation et l’entreprise souhaitant devenir amodiataire du titre. C’est une location de l’exploitation d’un gisement à un tiers par le titulaire du titre en contrepartie d’un loyer ou / et du versement d’une quantité donnée des substances extraites. L’amodiation donne lieu à un contrat entre le titulaire du titre et l’amodiataire pour une durée fixée. Afin d’en bénéficier, l’intéressé doit satisfaire aux critères d’attribution exigés pour être détenteurs du titre minier. L’amodiation n’est pas une sous-traitance. En effet, le sous-traitant est rémunéré par le titulaire du titre pour l’exécution de prestations sur la base d’une facture et non d’un loyer.',
    ordre: 12,
    titulaires: true,
    renouvelable: true
  },
  aom: {
    id: 'aom',
    nom: "Autorisation d'ouverture de travaux",
    description: "Autorisation d'ouverture de travaux",
    ordre: 100,
    travaux: true
  },
  ces: {
    id: 'ces',
    nom: 'cession',
    description:
      'Démarche obsolète. Co-initiée par le titulaire du titre minier et l’entreprise souhaitant devenir titulaire ou co-titulaire elle remplit une fonction proche de la mutation dans le code minier actuel.',
    ordre: 16,
    titulaires: true
  },
  con: {
    id: 'con',
    nom: 'conversion',
    description:
      'Démarche appliquée à un titre d’exploitation d’hydrocarbures liquides ou gazeux. Elle permet de substituer les substances initiales par d’autres substances de mines connexes aux hydrocarbures contenus dans le gisement ou bien par un autre usage du sous-sol. La demande de conversion peut être réalisée au plus tard 4 ans avant l’échéance de son titre. Elle doit de surcroît démontrer la rentabilité économique de la poursuite de l’exploitation du gisement, mais ne fait pas l’objet d’une mise en concurrence.',
    ordre: 11,
    substances: true
  },
  dam: {
    id: 'dam',
    nom: "Déclaration d'arrêt définitif des travaux",
    description: "Déclaration d'arrêt définitif des travaux",
    ordre: 120,
    travaux: true
  },
  dec: {
    id: 'dec',
    nom: 'déchéance',
    description:
      'Démarche obsolète. L’autorité administrative pouvait retirer les droits liés aux autorisations et titres miniers en cours de validité si le titulaire ne remplissait plus certaines prescriptions légales. La déchéance avait pour effet de permettre à l’Etat de réattribuer le titre ou l’autorisation lors d’un appel d’offre.',
    ordre: 21,
    titulaires: true
  },
  dep: {
    id: 'dep',
    nom: 'déplacement de périmètre',
    description:
      'Démarche appliquée aux autorisation d’exploitation de minéraux et métaux pour déplacer le centre du périmètre de celle-ci dans la limite de 200 mètres. Les zones déjà exploitées doivent être maintenues à l’intérieur du périmètre déplacé.',
    ordre: 8,
    points: true,
    renouvelable: true
  },
  dot: {
    id: 'dot',
    nom: "Déclaration d'ouverture de travaux",
    description: "Déclaration d'ouverture de travaux",
    ordre: 110,
    travaux: true
  },
  exp: {
    id: 'exp',
    nom: 'extension de périmètre',
    description: "Démarche appliquée aux permis exclusifs de recherches, permis d'exploitation de minéraux et métaux et concessions pour étendre leurs périmètres.",
    ordre: 7,
    duree: true,
    points: true,
    renouvelable: true
  },
  exs: {
    id: 'exs',
    nom: 'extension de substance',
    description:
      "Démarche appliquée aux autorisations d'exploitation et aux permis exclusifs de recherches de minéraux et métaux pour étendre la liste des substances non connexes autorisées à la prospection. Elle s’applique aussi aux concessions de géothermie qui peuvent être étendues à des substances de mines non connexes.",
    ordre: 10,
    duree: true,
    substances: true,
    renouvelable: true
  },
  fus: {
    id: 'fus',
    nom: 'fusion',
    description:
      'Démarche appliquée aux permis exclusifs de recherches contigus. Elle conduit à la création d’un nouveau titre à partir de la fusion des périmètres de plusieurs permis exclusifs de recherches qui se trouvent dans la même période de validité (octroi, prolongation 1 ou prolongation 2).',
    ordre: 9,
    duree: true,
    points: true,
    titulaires: true,
    renouvelable: true
  },
  mut: {
    id: 'mut',
    nom: 'mutation',
    description:
      'Démarche co-initiée par le titulaire du titre minier et l’entreprise souhaitant devenir titulaire ou co-titulaire du titre. Il s’agit de la cession d’un titre minier en cours de validité par son détenteur à un tiers. Elle peut porter sur la totalité du périmètre du titre initial ou sur une partie de celui-ci. Le titulaire initial conserve ses droits sur la partie restante. Afin de  bénéficier d’une mutation, l’intéressé doit satisfaire aux critères d’attribution exigés pour les détenteurs du titre minier équivalent. La décision du ministre ne préjuge en aucun cas des conditions financières fixées entre  les deux parties.',
    ordre: 14,
    duree: true,
    points: true,
    titulaires: true,
    renouvelable: true
  },
  oct: {
    id: 'oct',
    nom: 'octroi',
    description: 'Démarche à l’initiative d’une personne physique ou morale en vue de l’obtention d’une autorisation ou d’un titre minier pour une première période de validité définie.',
    ordre: 1,
    duree: true,
    points: true,
    substances: true,
    titulaires: true
  },
  pr1: {
    id: 'pr1',
    nom: 'prolongation 1',
    description:
      "Démarche appliquée à une autorisation ou un titre minier qui a fait l’objet d’un octroi initial. Elle prolonge sa durée de validité. Une première prolongation est applicable aux permis exclusifs de recherches et aux permis d'exploitation de minéraux et métaux en outre-mer pour une durée de 5 ans maximum. Pour des permis exclusifs de recherches d’hydrocarbures liquides ou gazeux, la première prolongation s’accompagne obligatoirement d’une réduction de 50% de la surface du titre.",
    ordre: 3,
    duree: true,
    points: true
  },
  pr2: {
    id: 'pr2',
    nom: 'prolongation 2',
    description:
      "Démarche appliquée à une autorisation ou un titre minier qui a fait l’objet d’une première prolongation. Elle prolonge sa durée de validité. Une seconde prolongation est applicable aux permis exclusifs de recherches et aux permis d'exploitation de minéraux et métaux en outre-mer pour une durée de 5 ans maximum. Seules deux prolongations successives sont admises pour ces titres. A l’exception des permis exclusifs de recherches d’hydrocarbures liquides ou gazeux qui peuvent faire l’objet d’une prolongation exceptionnelle. Pour ces derniers, la seconde prolongation s’accompagne obligatoirement d’une réduction de 25% de la surface du titre.",
    ordre: 4,
    duree: true,
    points: true
  },
  pre: {
    id: 'pre',
    nom: 'prolongation exceptionnelle',
    description:
      'Démarche appliquée à un permis exclusif de recherches d’hydrocarbures liquides ou gazeux. Elle prolonge sa durée de validité de trois ans maximum. La prolongation exceptionnelle ne peut être mobilisée qu’une fois au cours de la vie du titres et ne s’accompagne pas nécessairement d’une réduction de sa surface.',
    ordre: 5,
    duree: true,
    exception: true
  },
  pro: {
    id: 'pro',
    nom: 'prolongation',
    description:
      "Démarche appliquée à une autorisation ou un titre minier qui a fait l’objet d’un octroi initial. Des prolongations sans limitation sont applicables aux concessions pour des durées maximales successives de 25 ans, aux permis d'exploitation de géothermie pour des durées maximales successives de 15 ans, aux permis exclusifs de carrières pour des durées maximales successives de 10 ans et aux autorisations de recherches de carrières pour des durées maximales successives de 3 ans.\nUne prolongation unique est applicable aux autorisations de recherches et aux autorisations d'exploitation de minéraux et métaux en Guyane pour respectivement 4 mois et 4 ans maximum.",
    ordre: 2,
    duree: true,
    points: true,
    renouvelable: true
  },
  prr: {
    id: 'prr',
    nom: 'prorogation',
    description:
      'Démarche obsolète. Initiée par l’autorité administrative, elle proroge la durée de validité d’un titre d’exploration, de droit et sans formalité, jusqu’à l’intervention d’une décision sur une demande de titre d’exploitation portant sur ce titre d’exploration visé. Le code minier actuel y a substitué le régime de “survie provisoire”.',
    ordre: 17,
    duree: true,
    points: true,
    renouvelable: true
  },
  ren: {
    id: 'ren',
    nom: 'renonciation',
    description:
      'Démarche appliquée à une autorisation ou un titre minier pour anticiper son échéance. Elle peut porter sur tout ou partie du périmètre. Cela est possible sous réserve d’avoir procédé aux mesures de remise en état dont le préfet lui aura a donné acte définitivement. La renonciation a pour effet de replacer le gisement dans la catégorie de ceux ouverts aux recherches.',
    ordre: 19,
    duree: true,
    points: true,
    titulaires: true,
    renouvelable: true
  },
  res: {
    id: 'res',
    nom: "résiliation anticipée d'amodiation",
    description:
      'Démarche co-initiée par le titulaire de certains titres miniers d’exploitation et l’entreprise amodiataire du titre. Elle conduit à une fin anticipée du contrat d’amodiation sur l’accord des deux parties sans affecter le statut du titre minier.',
    ordre: 13,
    titulaires: true,
    renouvelable: true
  },
  ret: {
    id: 'ret',
    nom: 'retrait',
    description:
      'Démarche initiée par l’autorité administrative. Le ministre chargé des mines pour les titres et le préfet pour les autorisations d’exploitation peuvent retirer les autorisations et les titres miniers en cours de validité si l’intéressé ne remplit plus certaines prescriptions légales.\r\nLe retrait a pour effet de replacer le gisement dans la situation de ceux ouverts aux recherches.',
    ordre: 20,
    duree: true
  },
  vct: {
    id: 'vct',
    nom: "demande de titre d'exploitation",
    description:
      'Démarche virtuelle utilisée dans Camino pour lier une demande initiale de concession ou de permis d’exploitation à une autorisation ou un titre miniers d’exploration créateur d’un droit d’inventeur sur un gisement.',
    ordre: 18,
    duree: true,
    points: true,
    substances: true,
    titulaires: true,
    renouvelable: true,
    auto: true
  },
  vut: {
    id: 'vut',
    nom: 'mutation partielle',
    description:
      'Démarche virtuelle d’une démarche de mutation portant sur une partie d’un titre minier. Cette démarche a pour effet de créer un nouveau titre minier sans qu’une démarche d’octroi en soit le fait générateur.',
    ordre: 15,
    duree: true,
    points: true,
    titulaires: true,
    renouvelable: true,
    auto: true
  }
} as const

export const isDemarcheTypeId = (demarcheTypeId: string | undefined | null): demarcheTypeId is DemarcheTypeId => DemarchesTypesIds.includes(demarcheTypeId)

export const isDemarcheTypeOctroi = (demarcheTypeId: DemarcheTypeId): boolean => {
  const demarchesTypesOctroi: DemarcheTypeId[] = [DEMARCHES_TYPES_IDS.Octroi, DEMARCHES_TYPES_IDS.MutationPartielle, DEMARCHES_TYPES_IDS.Fusion, DEMARCHES_TYPES_IDS.DemandeDeTitreDExploitation]

  return demarchesTypesOctroi.includes(demarcheTypeId)
}
export const isDemarcheTypeWithPhase = (demarcheTypeId: DemarcheTypeId): boolean => {
  if (isDemarcheTypeOctroi(demarcheTypeId)) {
    return true
  }
  const demarchesTypesWithPhases: DemarcheTypeId[] = [
    DEMARCHES_TYPES_IDS.Prolongation,
    DEMARCHES_TYPES_IDS.Prolongation1,
    DEMARCHES_TYPES_IDS.Prolongation2,
    DEMARCHES_TYPES_IDS.ProlongationExceptionnelle
  ]

  return demarchesTypesWithPhases.includes(demarcheTypeId)
}
