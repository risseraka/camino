import { Pojo } from 'objection'

export const titreInsertFormat = (json: Pojo) => {
  delete json.geojsonMultiPolygon
  delete json.geojsonPoints
  delete json.communes
  delete json.surface
  delete json.contenu
  delete json.modification
  delete json.suppression
  delete json.travauxCreation
  delete json.demarchesCreation
  delete json.activitesAbsentes
  delete json.activitesEnConstruction
  delete json.activitesDeposees
  delete json.abonnement

  if (json.type) {
    delete json.type.sections
  }

  return json
}
