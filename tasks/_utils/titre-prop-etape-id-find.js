// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

const titrePropEtapeIdFind = (titreDemarches, prop) =>
  // filtre les démarches acceptée ou terminée
  titreDemarches
    .filter(titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.demarcheStatutId)
    )
    // parcourt les démarches
    .reduce((etapeId, titreDemarche) => {
      if (!etapeId) {
        // filtre les étapes acceptation, fait ou favorable
        const etape = titreDemarche.etapes
          .filter(
            titreEtape =>
              ['acc', 'fai', 'fav'].includes(titreEtape.etapeStatutId) &&
              ['dpu', 'dex'].includes(titreEtape.etapeId)
          )
          // trouve une étape qui contient la propriété
          .find(
            titreEtape =>
              (titreEtape[prop] &&
                Array.isArray(titreEtape[prop]) &&
                titreEtape[prop].length) ||
              (titreEtape[prop] && !Array.isArray(titreEtape[prop]))
          )

        etapeId = (etape && etape.id) || (!etape && null)
      }

      return etapeId
    }, null)

module.exports = titrePropEtapeIdFind
