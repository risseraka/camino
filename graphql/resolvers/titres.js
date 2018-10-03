const {
  titreGet,
  titresGet,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('../../postgres/queries/titres')

const {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} = require('./_tools-geojson')

const titreFormat = t => {
  t.references =
    t.references &&
    Object.keys(t.references).map(r => ({
      type: r,
      valeur: t.references[r]
    }))

  if (t.points && t.points.length) {
    t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points)
    t.geojsonPoints = geojsonFeatureCollectionPoints(t.points)
  }

  t.demarches &&
    t.demarches.forEach(d => {
      d.etapes &&
        d.etapes.forEach(e => {
          if (e.points.length) {
            e.geojsonMultiPolygon = geojsonFeatureMultiPolygon(e.points)
            e.geojsonPoints = geojsonFeatureCollectionPoints(e.points)
          }
        })
    })

  return t
}

const resolvers = {
  titre: async ({ id }, context, info) => {
    const titre = await titreGet(id)
    return titre && titreFormat(titre)
  },

  titres: async (
    { typeIds, domaineIds, statutIds, substances, noms },
    context,
    info
  ) => {
    console.log(context.user)
    const titres = await titresGet({
      typeIds,
      domaineIds,
      statutIds,
      substances,
      noms
    })

    return titres.map(titre => titre && titreFormat(titre))
  },

  titreAjouter: async ({ titre }, context, info) => titreAjouter(titre),

  titreSupprimer: async ({ id }, context, info) => titreSupprimer(id),

  titreModifier: async ({ titre }, context, info) => titreModifier(titre)
}

module.exports = resolvers
