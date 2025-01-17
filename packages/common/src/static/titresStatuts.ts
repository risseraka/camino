import { Couleur } from './couleurs'
import { Definition } from '../definition'

interface TitreStatutDefinition<T> extends Definition<T> {
  couleur: Couleur
}

export const TitresStatutIds = {
  DemandeClassee: 'dmc',
  DemandeInitiale: 'dmi',
  Echu: 'ech',
  Indetermine: 'ind',
  ModificationEnInstance: 'mod',
  Valide: 'val'
} as const

export type TitreStatutId = typeof TitresStatutIds[keyof typeof TitresStatutIds]

export const TitresStatuts: {
  [key in TitreStatutId]: TitreStatutDefinition<key>
} = {
  dmc: {
    id: 'dmc',
    nom: 'demande classée',
    description: 'Titres et autorisations qui font l’objet d’une démarche initiale d’octroi classée sans suite ou rejetée. Le domaine minier reste ouvert pour les substances et usages visés.',
    couleur: 'neutral',
    ordre: 2
  },
  dmi: {
    id: 'dmi',
    nom: 'demande initiale',
    description:
      "Titres et autorisations dont la démarche d’octroi est en cours. Le domaine minier reste ouvert pour les substances ou usages visés jusqu’à la fin de la mise en concurrence de la demande. Si la procédure d’octroi ne prévoit pas de mise en concurrence, le domaine minier reste ouvert jusqu'à l’octroi du titre ou de l’autorisation.",
    couleur: 'warning',
    ordre: 1
  },
  ech: {
    id: 'ech',
    nom: 'échu',
    description: 'Titres et autorisations sur lesquels le projet minier est terminé. Le domaine minier est ouvert pour les substances et les usages visés.',
    couleur: 'neutral',
    ordre: 5
  },
  ind: {
    id: 'ind',
    nom: 'indéterminé',
    description: 'Titres et autorisations dont les informations disponibles sont insuffisantes pour en déterminer le statut.',
    couleur: 'warning',
    ordre: 6
  },
  mod: {
    id: 'mod',
    nom: 'modification en instance',
    description:
      'Titres et autorisations qui font l’objet d’une démarche de modification de leurs propriétés fondamentales (durée, surface, titulaire, amodiataire, substances). Le domaine minier demeure fermé pour les substances et usages visés par la demande en cours, jusqu\'à ce qu\'il soit statué sur la demande de modification.\r\nTant que l’administration ne s’est pas prononcée par décision expresse, le pétitionnaire bénéficie du droit de poursuivre ses travaux dans les limites du périmètre et des substances visées par la nouvelle demande même après une décision implicite de rejet. Au delà de sa date de validité, le titre est dit en "survie provisoire".',
    couleur: 'warning',
    ordre: 4
  },
  val: {
    id: 'val',
    nom: 'valide',
    description:
      "Titres et autorisations sur lesquels peuvent être mis en oeuvre un projet minier, à compter de la date d'octroi et jusqu’à l’échéance fixée. Le domaine minier est fermé pour les substances et usages visés.",
    couleur: 'success',
    ordre: 3
  }
}

export const sortedTitresStatuts = Object.values(TitresStatuts).sort((a, b) => a.ordre - b.ordre)
