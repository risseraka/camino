import {
  Index,
  IArea,
  ITitreAdministrationLocale,
  IAdministration,
  IEntrepriseEtablissement,
  IEntreprise
} from '../types'

const updatesLog = ({
  titresEtapesOrdreUpdated,
  titresDemarchesStatutUpdated,
  titresDemarchesPublicUpdated,
  titresDemarchesOrdreUpdated,
  titresStatutIdUpdated,
  titresPublicUpdated,
  titresPhasesUpdated,
  titresPhasesDeleted,
  titresDatesUpdated,
  pointsReferencesCreated,
  communesUpdated,
  titresEtapesCommunesUpdated,
  titresEtapesCommunesDeleted,
  foretsUpdated,
  titresEtapesForetsUpdated,
  titresEtapesForetsDeleted,
  titresAdministrationsGestionnairesCreated,
  titresAdministrationsGestionnairesDeleted,
  titresEtapesAdministrationsLocalesCreated,
  titresEtapesAdministrationsLocalesDeleted,
  titresPropsEtapeIdUpdated,
  titresPropsContenuUpdated,
  titresCoordonneesUpdated,
  titresTravauxEtapesOrdreUpdated,
  titresTravauxOrdreUpdated,
  titresActivitesCreated,
  titresActivitesStatutIdsUpdated,
  titresUpdatedIndex,
  entreprisesUpdated,
  etablissementsUpdated,
  etablissementsDeleted,
  administrationsUpdated
}: {
  titresEtapesOrdreUpdated?: string[]
  titresDemarchesStatutUpdated?: string[]
  titresDemarchesPublicUpdated?: string[]
  titresDemarchesOrdreUpdated?: string[]
  titresStatutIdUpdated?: string[]
  titresPublicUpdated?: string[]
  titresPhasesUpdated?: string[]
  titresPhasesDeleted?: string[]
  titresDatesUpdated?: string[]
  pointsReferencesCreated?: string[]
  communesUpdated?: IArea[]
  titresEtapesCommunesUpdated?: string[]
  titresEtapesCommunesDeleted?: string[]
  foretsUpdated?: IArea[]
  titresEtapesForetsUpdated?: string[]
  titresEtapesForetsDeleted?: string[]
  titresAdministrationsGestionnairesCreated?: string[]
  titresAdministrationsGestionnairesDeleted?: string[]
  titresEtapesAdministrationsLocalesCreated?: ITitreAdministrationLocale[]
  titresEtapesAdministrationsLocalesDeleted?: ITitreAdministrationLocale[]
  titresPropsEtapeIdUpdated?: string[]
  titresPropsContenuUpdated?: string[]
  titresCoordonneesUpdated?: string[]
  titresTravauxEtapesOrdreUpdated?: string[]
  titresTravauxOrdreUpdated?: string[]
  titresActivitesCreated?: string[]
  titresActivitesStatutIdsUpdated?: string[]
  titresUpdatedIndex?: Index<string>
  entreprisesUpdated?: IEntreprise[]
  etablissementsUpdated?: IEntrepriseEtablissement[]
  etablissementsDeleted?: string[]
  administrationsUpdated?: IAdministration[]
}) => {
  console.info()
  console.info('-')
  console.info('tâches exécutées:')
  if (titresEtapesOrdreUpdated?.length) {
    console.info(
      `mise à jour: ${titresEtapesOrdreUpdated.length} étape(s) (ordre)`
    )
  }

  if (titresDemarchesStatutUpdated?.length) {
    console.info(
      `mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut)`
    )
  }

  if (titresDemarchesPublicUpdated?.length) {
    console.info(
      `mise à jour: ${titresDemarchesPublicUpdated.length} démarche(s) (publicité)`
    )
  }

  if (titresDemarchesOrdreUpdated?.length) {
    console.info(
      `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
    )
  }

  if (titresStatutIdUpdated?.length) {
    console.info(
      `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
    )
  }

  if (titresPublicUpdated?.length) {
    console.info(
      `mise à jour: ${titresPublicUpdated.length} titre(s) (publicité)`
    )
  }

  if (titresPhasesUpdated?.length) {
    console.info(
      `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
    )
  }

  if (titresPhasesDeleted?.length) {
    console.info(
      `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
    )
  }

  if (titresDatesUpdated?.length) {
    console.info(
      `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
    )
  }

  if (pointsReferencesCreated?.length) {
    console.info(
      `création: ${pointsReferencesCreated.length} référence(s) de points`
    )
  }

  if (communesUpdated?.length) {
    console.info(`mise à jour: ${communesUpdated.length} commune(s)`)
  }

  if (titresEtapesCommunesUpdated?.length) {
    console.info(
      `mise à jour: ${titresEtapesCommunesUpdated.length} commune(s) mise(s) à jour dans des étapes`
    )
  }

  if (titresEtapesCommunesDeleted?.length) {
    console.info(
      `mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes`
    )
  }

  if (foretsUpdated?.length) {
    console.info(`mise à jour: ${foretsUpdated.length} foret(s)`)
  }

  if (titresEtapesForetsUpdated?.length) {
    console.info(
      `mise à jour: ${titresEtapesForetsUpdated.length} foret(s) mise(s) à jour dans des étapes`
    )
  }

  if (titresEtapesForetsDeleted?.length) {
    console.info(
      `mise à jour: ${titresEtapesForetsDeleted.length} foret(s) supprimée(s) dans des étapes`
    )
  }

  if (titresAdministrationsGestionnairesCreated?.length) {
    console.info(
      `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
    )
  }

  if (titresAdministrationsGestionnairesDeleted?.length) {
    console.info(
      `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
    )
  }

  if (titresEtapesAdministrationsLocalesCreated?.length) {
    console.info(
      `mise à jour: ${titresEtapesAdministrationsLocalesCreated.length} administration(s) locale(s) ajoutée(s) dans des étapes`
    )
  }

  if (titresEtapesAdministrationsLocalesDeleted?.length) {
    console.info(
      `mise à jour: ${titresEtapesAdministrationsLocalesDeleted.length} administration(s) locale(s) supprimée(s) dans des étapes`
    )
  }

  if (titresPropsEtapeIdUpdated?.length) {
    console.info(
      `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
    )
  }

  if (titresPropsContenuUpdated?.length) {
    console.info(
      `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
    )
  }

  if (titresCoordonneesUpdated?.length) {
    console.info(
      `mise à jour: ${titresCoordonneesUpdated.length} titres(s) (propriétés-étapes)`
    )
  }

  if (titresTravauxEtapesOrdreUpdated?.length) {
    console.info(
      `mise à jour: ${titresTravauxEtapesOrdreUpdated.length} étape(s) de travaux (ordre)`
    )
  }

  if (titresTravauxOrdreUpdated?.length) {
    console.info(
      `mise à jour: ${titresTravauxOrdreUpdated.length} travaux (ordre)`
    )
  }

  if (titresActivitesCreated?.length) {
    console.info(
      `mise à jour: ${titresActivitesCreated.length} activité(s) créée(s)`
    )
  }

  if (titresActivitesStatutIdsUpdated?.length) {
    console.info(
      `mise à jour: ${titresActivitesStatutIdsUpdated.length} activité(s) fermée(s)`
    )
  }

  if (titresUpdatedIndex && Object.keys(titresUpdatedIndex).length) {
    console.info(
      `mise à jour: ${Object.keys(titresUpdatedIndex).length} titre(s) (ids)`
    )
  }

  if (entreprisesUpdated?.length) {
    console.info(
      `mise à jour: ${entreprisesUpdated.length} adresse(s) d'entreprise(s)`
    )
  }

  if (etablissementsUpdated?.length) {
    console.info(
      `mise à jour: ${etablissementsUpdated.length} établissement(s) d'entreprise(s)`
    )
  }

  if (etablissementsDeleted?.length) {
    console.info(
      `suppression: ${etablissementsDeleted.length} établissement(s) d'entreprise(s)`
    )
  }

  if (administrationsUpdated?.length) {
    console.info(
      `mise à jour: ${administrationsUpdated.length} administration(s)`
    )
  }
}

export default updatesLog