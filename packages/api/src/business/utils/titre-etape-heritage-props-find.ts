import {
  ITitreEtape,
  IEntreprise,
  ITitrePoint,
  ITitreIncertitudes,
  ITitreEntreprise
} from '../../types'
import { objectClone } from '../../tools/index'
import { idGenerate } from '../../database/models/_format/id-create'
import { SubstanceLegaleId } from 'camino-common/src/static/substancesLegales'

const titreEtapePropsIds: (keyof ITitreEtape)[] = [
  'points',
  'titulaires',
  'amodiataires',
  'substances',
  'surface',
  'dateFin',
  'dateDebut',
  'duree'
]

const titrePointsIdsUpdate = (
  titrePoints: ITitrePoint[],
  newTitreEtapeId: string
) =>
  titrePoints.map(p => {
    p.id = idGenerate()
    p.titreEtapeId = newTitreEtapeId

    p.references = p.references.map(r => {
      r.id = idGenerate()
      r.titrePointId = p.id

      return r
    })

    return p
  })

const propertyArrayCheck = (
  newValue: IPropValueArray,
  prevValue: IPropValueArray,
  propId: string
) => {
  if (prevValue?.length !== newValue?.length) {
    return false
  }

  if (prevValue?.length && newValue?.length) {
    if (propId === 'points') {
      const comparator = ({ coordonnees }: ITitrePoint) =>
        `(${coordonnees.x}, ${coordonnees.y})`

      return (
        (newValue as ITitrePoint[]).map(comparator).sort().toString() ===
        (prevValue as ITitrePoint[]).map(comparator).sort().toString()
      )
    } else if (propId === 'substances') {
      return newValue.toString() === prevValue.toString()
    } else if (['titulaires', 'amodiataires'].includes(propId)) {
      const comparator = (propValueArray: ITitreEntreprise) =>
        propValueArray.id + propValueArray.operateur

      return (
        (newValue as ITitreEntreprise[]).map(comparator).sort().toString() ===
        (prevValue as ITitreEntreprise[]).map(comparator).sort().toString()
      )
    }
  }

  return true
}

type IPropValueArray =
  | undefined
  | null
  | IEntreprise[]
  | ITitrePoint[]
  | SubstanceLegaleId[]

type IPropValue = number | string | IPropValueArray

const titreEtapePropCheck = (
  propId: string,
  oldValue?: IPropValue | null,
  newValue?: IPropValue | null
) => {
  if (['titulaires', 'amodiataires', 'substances', 'points'].includes(propId)) {
    return propertyArrayCheck(
      oldValue as IPropValueArray,
      newValue as IPropValueArray,
      propId
    )
  }

  return oldValue === newValue
}

const titreEtapeHeritagePropsFind = (
  titreEtape: ITitreEtape,
  prevTitreEtape?: ITitreEtape | null
) => {
  let hasChanged = false

  let newTitreEtape = titreEtape

  if (!titreEtape.heritageProps) {
    newTitreEtape = objectClone(newTitreEtape)
    newTitreEtape.heritageProps = {}
    hasChanged = true
  }

  titreEtapePropsIds.forEach(propId => {
    const heritage = newTitreEtape.heritageProps![propId]

    if (!heritage) {
      newTitreEtape = objectClone(newTitreEtape)
      hasChanged = true
      newTitreEtape.heritageProps![propId] = { actif: false, etapeId: null }
    }

    const prevHeritage = prevTitreEtape?.heritageProps
      ? prevTitreEtape?.heritageProps[propId]
      : null

    const etapeId =
      prevHeritage?.etapeId && prevHeritage?.actif
        ? prevHeritage.etapeId
        : prevTitreEtape?.id

    if (heritage?.actif) {
      if (prevTitreEtape) {
        const oldValue = titreEtape[propId] as IPropValue | undefined | null
        const newValue = prevTitreEtape[propId] as IPropValue | undefined | null

        if (!titreEtapePropCheck(propId, oldValue, newValue)) {
          hasChanged = true
          newTitreEtape = objectClone(newTitreEtape)

          if (propId === 'points') {
            newTitreEtape.points = titrePointsIdsUpdate(
              newValue as ITitrePoint[],
              newTitreEtape.id
            )
          } else if (propId === 'amodiataires' || propId === 'titulaires') {
            newTitreEtape[propId] = newValue as IEntreprise[]
          } else if (propId === 'substances') {
            newTitreEtape[propId] = newValue as SubstanceLegaleId[]
          } else if (propId === 'dateDebut' || propId === 'dateFin') {
            newTitreEtape[propId] = newValue as string
          } else if (propId === 'duree' || propId === 'surface') {
            newTitreEtape[propId] = newValue as number
          }
        }

        const incertitudePropId = propId as keyof ITitreIncertitudes

        if (
          newTitreEtape.incertitudes &&
          prevTitreEtape.incertitudes &&
          newTitreEtape.incertitudes[incertitudePropId] !==
            prevTitreEtape.incertitudes[incertitudePropId]
        ) {
          hasChanged = true
          newTitreEtape = objectClone(newTitreEtape)
          newTitreEtape.incertitudes![incertitudePropId] =
            prevTitreEtape.incertitudes[incertitudePropId]
        } else if (newTitreEtape.incertitudes && !prevTitreEtape.incertitudes) {
          newTitreEtape = objectClone(newTitreEtape)
          if (
            newTitreEtape.incertitudes &&
            newTitreEtape.incertitudes[incertitudePropId]
          ) {
            hasChanged = true
            delete newTitreEtape.incertitudes[incertitudePropId]
            if (!Object.keys(newTitreEtape.incertitudes).length) {
              newTitreEtape.incertitudes = null
            }
          }
        } else if (
          prevTitreEtape.incertitudes &&
          prevTitreEtape.incertitudes[incertitudePropId] &&
          !newTitreEtape.incertitudes
        ) {
          hasChanged = true
          newTitreEtape = objectClone(newTitreEtape)
          newTitreEtape.incertitudes = {}
          newTitreEtape.incertitudes![incertitudePropId] =
            prevTitreEtape.incertitudes[incertitudePropId]
        }
      } else {
        // l’étape précédente a été supprimée, il faut donc désactiver l’héritage
        hasChanged = true
        newTitreEtape = objectClone(newTitreEtape)
        newTitreEtape.heritageProps![propId].actif = false
      }
    }

    if ((etapeId || heritage?.etapeId) && etapeId !== heritage?.etapeId) {
      hasChanged = true
      newTitreEtape = objectClone(newTitreEtape)
      newTitreEtape.heritageProps![propId].etapeId = etapeId
    }
  })

  return { hasChanged, titreEtape: newTitreEtape }
}

export { titreEtapeHeritagePropsFind, titreEtapePropsIds }
