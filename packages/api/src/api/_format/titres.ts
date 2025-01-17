import {
  ITitre,
  IAdministration,
  IGeoJson,
  IFields,
  ISection,
  IContenusTitreEtapesIds,
  ITitreDemarche
} from '../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'

import { dupRemove } from '../../tools'

import { administrationFormat } from './administrations'
import { entrepriseFormat } from './entreprises'
import { titreActiviteFormat } from './titres-activites'
import { titreDemarcheFormat } from './titres-demarches'
import { titreFormatFields } from './_fields'
import { ADMINISTRATION_TYPES } from 'camino-common/src/static/administrations'

const titreTypeSectionsFormat = (
  contenusTitreEtapesIds: IContenusTitreEtapesIds,
  demarches: ITitreDemarche[]
) => {
  const sections = [] as ISection[]

  Object.keys(contenusTitreEtapesIds).some(sectionId => {
    if (!contenusTitreEtapesIds![sectionId]) return false

    Object.keys(contenusTitreEtapesIds![sectionId]).some(elementId => {
      const etapeId = contenusTitreEtapesIds![sectionId][elementId]

      if (!etapeId) return false

      demarches!.some(d => {
        if (!d.etapes) return false

        const etape = d.etapes.find(e => e.id === etapeId)

        if (!etape) return false

        // sinon, si l'étape correspond à l'id de `contenusTitreEtapesIds`
        // et que l'étape n'a ni contenu ni section ni l'élément qui nous intéresse
        // on ne cherche pas plus loin
        if (
          !etape.contenu ||
          !etape.contenu[sectionId] ||
          etape.contenu[sectionId][elementId] === undefined ||
          !etape.type?.sections
        ) {
          return false
        }

        const etapeSection = etape.type.sections.find(s => s.id === sectionId)

        if (!etapeSection || !etapeSection.elements) return false

        const etapeElement = etapeSection.elements.find(e => e.id === elementId)

        if (!etapeElement) return false

        // ajoute la section dans le titre si elle n'existe pas encore
        let titreTypeSection = sections.find(s => s.id === sectionId)

        if (!titreTypeSection) {
          titreTypeSection = { ...etapeSection, elements: [] }

          sections.push(titreTypeSection)
        }

        if (!titreTypeSection.elements) {
          titreTypeSection.elements = []
        }

        // ajoute l'élément dans les sections du titre s'il n'existe pas encore
        const titreElement = titreTypeSection.elements.find(
          e => e.id === elementId
        )

        if (!titreElement) {
          titreTypeSection.elements.push(etapeElement)
        }

        // continue l'itération
        return false
      })

      return false
    })

    return false
  })

  return sections
}

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes SQL (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = (t: ITitre, fields: IFields = titreFormatFields) => {
  if (t.confidentiel) {
    // Si le titre est confidentiel, on a le droit de voir que son périmètre sur la carte
    t = {
      titreStatutId: t.titreStatutId,
      type: t.type,
      domaine: t.domaine,
      points: t.points
    } as ITitre
  }

  if (!fields) return t

  if (fields.geojsonMultiPolygon && t.points?.length) {
    t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points) as IGeoJson
  }

  if (fields.geojsonPoints && t.points?.length) {
    t.geojsonPoints = geojsonFeatureCollectionPoints(
      t.points
    ) as unknown as IGeoJson
  }

  if (fields.geojsonCentre && t.coordonnees && t.propsTitreEtapesIds.points) {
    t.geojsonCentre = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [t.coordonnees.x, t.coordonnees.y]
      },
      properties: { etapeId: t.propsTitreEtapesIds.points }
    }
  }

  if (fields.demarches && t.demarches?.length) {
    t.demarches = t.demarches.map(td =>
      titreDemarcheFormat(td, fields.demarches)
    )
  }

  if (
    fields.type?.sections &&
    t.contenusTitreEtapesIds &&
    t.demarches?.length
  ) {
    t.type!.sections = titreTypeSectionsFormat(
      t.contenusTitreEtapesIds,
      t.demarches
    )
  }

  if (fields.surface && t.surfaceEtape) {
    t.surface = t.surfaceEtape.surface
  }

  if (fields.activites && t.activites?.length) {
    t.activites = t.activites.map(ta => {
      ta.titre = t

      return titreActiviteFormat(ta)
    })
  }

  if (fields.administrations) {
    t.administrations = titreAdministrationsGet(t)
    delete t.administrationsGestionnaires
    delete t.administrationsLocales
  }

  t.titulaires = t.titulaires?.map(entrepriseFormat)

  t.amodiataires = t.amodiataires?.map(entrepriseFormat)

  return t
}

export const titreAdministrationsGet = (titre: ITitre): IAdministration[] => {
  let result: IAdministration[] = []
  const hasAdministrations =
    titre.administrationsGestionnaires?.length ||
    titre.administrationsLocales?.length
  if (hasAdministrations) {
    // fusionne administrations gestionnaires et locales
    const administrations = dupRemove('id', [
      ...(titre.administrationsGestionnaires || []),
      ...(titre.administrationsLocales || [])
    ]) as IAdministration[]

    result = administrations.map(administrationFormat)

    result = administrations.sort(
      (a, b) =>
        ADMINISTRATION_TYPES[a.typeId].ordre -
        ADMINISTRATION_TYPES[b.typeId].ordre
    )
  }

  return result
}

const titresFormat = (titres: ITitre[], fields = titreFormatFields) =>
  titres &&
  titres.reduce((acc: ITitre[], titre) => {
    const titreFormated = titreFormat(titre, fields)

    if (titreFormated) {
      acc.push(titreFormated)
    }

    return acc
  }, [])

export { titreFormatFields, titreFormat, titresFormat }
