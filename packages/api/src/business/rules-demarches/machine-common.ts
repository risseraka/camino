import { IContenu, ITitreEtape } from '../../types'
import {
  EtapeStatutId,
  EtapeStatutKey,
  isStatut
} from 'camino-common/src/static/etapesStatuts'
import {
  EtapeTypeId,
  isEtapeTypeId
} from 'camino-common/src/static/etapesTypes'
import { ADMINISTRATION_IDS } from 'camino-common/src/static/administrations'
import { EtapeTypeEtapeStatut } from 'camino-common/src/static/etapesTypesEtapesStatuts'
import { DemarcheStatutId } from 'camino-common/src/static/demarchesStatuts'

export interface Etape {
  // TODO 2022-07-28 : ceci pourrait être réduit en utilisant les états de 'trad'
  etapeTypeId: EtapeTypeId
  etapeStatutId: EtapeStatutId
  date: string
  contenu?: IContenu
}

export interface CaminoCommonContext {
  demarcheStatut: DemarcheStatutId
  visibilite: 'confidentielle' | 'publique'
}

export const toMachineEtapes = (etapes: ITitreEtape[]): Etape[] => {
  // FIXME si on appelle titreEtapesSortAscByOrdre on se retrouve avec une grosse dépendance cyclique
  return etapes
    .slice()
    .sort((a, b) => a.ordre! - b.ordre!)
    .map(dbEtape => toMachineEtape(dbEtape))
}

const toMachineEtape = (dbEtape: ITitreEtape): Etape => {
  let typeId
  if (isEtapeTypeId(dbEtape.typeId)) {
    typeId = dbEtape.typeId
  } else {
    throw new Error(`l'état ${dbEtape.typeId} est inconnu`)
  }
  let statutId
  if (isStatut(dbEtape.statutId)) {
    statutId = dbEtape.statutId
  } else {
    console.error(
      `le status ${dbEtape.statutId} est inconnu, ${JSON.stringify(dbEtape)}`
    )
    throw new Error(
      `le status ${dbEtape.statutId} est inconnu, ${JSON.stringify(dbEtape)}`
    )
  }

  const machineEtape: Etape = {
    date: dbEtape.date,
    etapeTypeId: typeId,
    etapeStatutId: statutId
  }
  if (dbEtape.contenu) {
    machineEtape.contenu = dbEtape.contenu
  }

  return machineEtape
}

export const tags = {
  responsable: {
    [ADMINISTRATION_IDS['PÔLE TECHNIQUE MINIER DE GUYANE']]: 'responsablePTMG',
    [ADMINISTRATION_IDS['OFFICE NATIONAL DES FORÊTS']]: 'responsableONF',
    [ADMINISTRATION_IDS['DGTM - GUYANE']]: 'responsableDGTM'
  }
} as const

export type Intervenant = keyof typeof tags['responsable']

export const intervenants = Object.keys(tags.responsable) as Array<
  keyof typeof tags.responsable
>

export type DBEtat = { [key in EtapeStatutKey]?: EtapeTypeEtapeStatut }
