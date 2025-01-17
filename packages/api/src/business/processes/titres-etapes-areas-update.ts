import {
  geojsonFeatureMultiPolygon,
  geojsonIntersectsCommunes,
  geojsonIntersectsSecteursMaritime,
  geojsonIntersectsForets,
  geojsonIntersectsSDOM
} from '../../tools/geojson'
import { titresEtapesGet } from '../../database/queries/titres-etapes'
import TitresCommunes from '../../database/models/titres-communes'
import TitresForets from '../../database/models/titres-forets'
import { userSuper } from '../../database/user-super'
import TitresSDOMZones from '../../database/models/titres--sdom-zones'
import { Feature } from '@turf/helpers'
import TitresEtapes from '../../database/models/titres-etapes'
import TitresSecteursMaritime from '../../database/models/titres-secteurs-maritime'

/**
 * Met à jour tous les territoires d’une liste d’étapes
 * @param titresEtapesIds - liste d’étapes
 * @returns toutes les modifications effectuées
 */
export const titresEtapesAreasUpdate = async (
  titresEtapesIds?: string[]
): Promise<void> => {
  console.info()
  console.info('communes, forêts et zones du SDOM associées aux étapes…')

  const titresEtapes = await titresEtapesGet(
    { titresEtapesIds, etapesTypesIds: null, titresDemarchesIds: null },
    {
      fields: {
        points: { id: {} },
        communes: { id: {} },
        forets: { id: {} },
        sdomZones: { id: {} },
        secteursMaritime: { id: {} }
      }
    },
    userSuper
  )

  console.info('étapes chargées')

  for (let i = 0; i < titresEtapes.length; i++) {
    const titreEtape = titresEtapes[i]
    if (i % 1000 === 0) {
      console.info(`${i} étapes traitées`)
    }
    try {
      if (titreEtape.points?.length) {
        const multipolygonGeojson = geojsonFeatureMultiPolygon(
          titreEtape.points
        ) as Feature
        await intersectForets(multipolygonGeojson, titreEtape)
        await intersectSdom(multipolygonGeojson, titreEtape)
        await intersectCommunes(multipolygonGeojson, titreEtape)
        await intersectSecteursMaritime(multipolygonGeojson, titreEtape)
      }
    } catch (e) {
      console.error(
        `Une erreur est survenue lors du traitement de l'étape ${titreEtape.id}`
      )
      throw e
    }
  }
}
async function intersectSdom(
  multipolygonGeojson: Feature,
  titreEtape: Pick<TitresEtapes, 'sdomZones' | 'id'>
) {
  if (!titreEtape.sdomZones) {
    throw new Error('les zones du SDOM de l’étape ne sont pas chargées')
  }
  const sdomZonesIds = await geojsonIntersectsSDOM(multipolygonGeojson)

  if (sdomZonesIds.fallback) {
    if (sdomZonesIds.fallback) {
      console.warn(`utilisation du fallback pour l'étape ${titreEtape.id}`)
    }
  }
  for (const sdomZoneId of sdomZonesIds.data) {
    if (!titreEtape.sdomZones.some(({ id }) => id === sdomZoneId)) {
      await TitresSDOMZones.query().insert({
        titreEtapeId: titreEtape.id,
        sdomZoneId
      })
      console.info(
        `Ajout de la zone du SDOM ${sdomZoneId} sur l'étape ${titreEtape.id}`
      )
    }
  }
  for (const sdomZone of titreEtape.sdomZones) {
    if (!sdomZonesIds.data.some(id => id === sdomZone.id)) {
      await TitresSDOMZones.query()
        .delete()
        .where('titreEtapeId', titreEtape.id)
        .andWhere('sdomZoneId', sdomZone.id)
      console.info(
        `Suppression de la zone du SDOM ${sdomZone.id} sur l'étape ${titreEtape.id}`
      )
    }
  }
}

async function intersectForets(
  multipolygonGeojson: Feature,
  titreEtape: Pick<TitresEtapes, 'forets' | 'id'>
) {
  if (!titreEtape.forets) {
    throw new Error('les forêts de l’étape ne sont pas chargées')
  }

  const foretIds = await geojsonIntersectsForets(multipolygonGeojson)

  if (foretIds.fallback) {
    console.warn(`utilisation du fallback pour l'étape ${titreEtape.id}`)
  }
  for (const foretId of foretIds.data) {
    if (!titreEtape.forets.some(({ id }) => id === foretId)) {
      await TitresForets.query().insert({
        titreEtapeId: titreEtape.id,
        foretId
      })
      console.info(`Ajout de la forêt ${foretId} sur l'étape ${titreEtape.id}`)
    }
  }
  for (const foret of titreEtape.forets) {
    if (!foretIds.data.some(id => id === foret.id)) {
      await TitresForets.query()
        .delete()
        .where('titreEtapeId', titreEtape.id)
        .andWhere('foretId', foret.id)
      console.info(
        `Suppression de la forêt ${foret.id} sur l'étape ${titreEtape.id}`
      )
    }
  }
}

async function intersectCommunes(
  multipolygonGeojson: Feature,
  titreEtape: Pick<TitresEtapes, 'communes' | 'id'>
) {
  if (!titreEtape.communes) {
    throw new Error('les communes de l’étape ne sont pas chargées')
  }

  const communes = await geojsonIntersectsCommunes(multipolygonGeojson)

  if (communes.fallback) {
    console.warn(`utilisation du fallback pour l'étape ${titreEtape.id}`)
  }
  for (const commune of communes.data) {
    const oldCommune = titreEtape.communes.find(({ id }) => id === commune.id)
    if (!oldCommune) {
      await TitresCommunes.query().insert({
        titreEtapeId: titreEtape.id,
        communeId: commune.id,
        surface: commune.surface
      })
      console.info(
        `Ajout de la commune ${commune.id} sur l'étape ${titreEtape.id}`
      )
    } else if (oldCommune.surface !== commune.surface) {
      await TitresCommunes.query()
        .patch({
          surface: commune.surface
        })
        .where('titreEtapeId', titreEtape.id)
        .andWhere('communeId', commune.id)
      console.info(
        `Mise à jour de la surface de la commune ${commune.id} sur l'étape ${titreEtape.id} (${oldCommune.surface} -> ${commune.surface})`
      )
    }
  }
  for (const commune of titreEtape.communes) {
    if (!communes.data.some(({ id }) => id === commune.id)) {
      await TitresCommunes.query()
        .delete()
        .where('titreEtapeId', titreEtape.id)
        .andWhere('communeId', commune.id)
      console.info(
        `Suppression de la commune ${commune.id} sur l'étape ${titreEtape.id}`
      )
    }
  }
}

async function intersectSecteursMaritime(
  multipolygonGeojson: Feature,
  titreEtape: Pick<TitresEtapes, 'secteursMaritime' | 'id'>
) {
  if (!titreEtape.secteursMaritime) {
    throw new Error('les secteurs maritime de l’étape ne sont pas chargées')
  }
  const secteurMaritimeIds = await geojsonIntersectsSecteursMaritime(
    multipolygonGeojson
  )

  if (secteurMaritimeIds.fallback) {
    console.warn(`utilisation du fallback pour l'étape ${titreEtape.id}`)
  }
  for (const secteurMaritimeId of secteurMaritimeIds.data) {
    if (
      !titreEtape.secteursMaritime.some(({ id }) => id === secteurMaritimeId)
    ) {
      await TitresSecteursMaritime.query().insert({
        titreEtapeId: titreEtape.id,
        secteurMaritimeId
      })
      console.info(
        `Ajout du secteur maritime ${secteurMaritimeId} sur l'étape ${titreEtape.id}`
      )
    }
  }
  for (const secteurMaritime of titreEtape.secteursMaritime) {
    if (!secteurMaritimeIds.data.some(id => id === secteurMaritime.id)) {
      await TitresSecteursMaritime.query()
        .delete()
        .where('titre_etape_id', titreEtape.id)
        .andWhere('secteur_maritime_id', secteurMaritime.id)
      console.info(
        `Suppression du secteur maritime ${secteurMaritime.id} sur l'étape ${titreEtape.id}`
      )
    }
  }
}
