import camelcase from 'camelcase'

import { ITitre, ITitreActivite } from '../../../types'

import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { userSuper } from '../../../database/user-super'
import {
  concessionsValidesBuild,
  titresSurfaceIndexBuild
} from './statistiques'

const statistiquesGranulatsMarinsActivitesFind = (
  titresActivites: ITitreActivite[],
  props: string[]
) =>
  titresActivites.reduce(
    (acc: { [key: string]: number }, ta) => {
      acc.rapportProductionCount++

      if (ta.statutId === 'dep') acc.activitesDeposesQuantiteCount++

      props.forEach(prop => {
        if (
          ta.contenu &&
          ta.contenu.renseignementsProduction &&
          ta.contenu.renseignementsProduction[prop]
        ) {
          const value = ta.contenu!.renseignementsProduction[prop]
          acc[prop] += Math.abs(Number(value))
        }
      })

      return acc
    },
    {
      rapportProductionCount: 0,
      activitesDeposesQuantiteCount: 0,
      volumeGranulatsExtrait: 0
    }
  )

type IStatsGranulatsMarinsTitresTypesHistorique =
  | 'titresPrw'
  | 'titresPxw'
  | 'titresCxw'

type IStatsGranulatsMarinsTitresTypesInstant =
  | 'titresInstructionExploration'
  | 'titresValPrw'
  | 'titresInstructionExploitation'
  | 'titresValCxw'

const statistiquesGranulatsMarinsTitresGet = (
  titres: { id: string; typeId: string; surface: number }[]
) =>
  titres.reduce(
    (acc, titre) => {
      const id = camelcase(
        `titres-${titre.typeId}`
      ) as IStatsGranulatsMarinsTitresTypesHistorique

      acc[id].quantite++
      acc[id].surface += titre.surface

      return acc
    },
    {
      titresPrw: { quantite: 0, surface: 0 },
      titresPxw: { quantite: 0, surface: 0 },
      titresCxw: { quantite: 0, surface: 0 }
    }
  )

const statistiquesGranulatsMarinsInstantBuild = (titres: ITitre[]) => {
  const statsInstant = titres.reduce(
    (acc, titre) => {
      if (
        titre.titreStatutId &&
        ['val', 'mod', 'dmi'].includes(titre.titreStatutId) &&
        titre.surfaceEtape &&
        titre.surfaceEtape.surface
      ) {
        if (['arw', 'apw', 'prw'].includes(titre.typeId!)) {
          acc.surfaceExploration += titre.surfaceEtape.surface
          if (['mod', 'dmi'].includes(titre.titreStatutId!)) {
            acc.titresInstructionExploration++
          }
        } else {
          if (['val', 'mod'].includes(titre.titreStatutId)) {
            acc.surfaceExploitation += titre.surfaceEtape.surface
          }
          if (['mod', 'dmi'].includes(titre.titreStatutId!)) {
            acc.titresInstructionExploitation++
          }
        }
        const id = camelcase(
          `titres-${titre.titreStatutId!}-${titre.typeId!}`
        ) as IStatsGranulatsMarinsTitresTypesInstant

        acc[id]++
      }

      return acc
    },
    {
      surfaceExploration: 0,
      surfaceExploitation: 0,
      titresInstructionExploration: 0,
      titresValPrw: 0,
      titresInstructionExploitation: 0,
      titresValCxw: 0
    }
  )

  statsInstant.surfaceExploration = Math.floor(
    statsInstant.surfaceExploration * 100
  ) // conversion 1 km² = 100 ha
  statsInstant.surfaceExploitation = Math.floor(
    statsInstant.surfaceExploitation * 100
  ) // conversion 1 km² = 100 ha

  return statsInstant
}

const statistiquesGranulatsMarinsAnneeBuild = (
  titres: ITitre[],
  titresActivites: ITitreActivite[],
  annee: number
) => {
  // les titres créés dans l'année et leur surface lors de l'octroi
  const titresFiltered = titresSurfaceIndexBuild(titres, annee)

  const { titresPrw, titresPxw, titresCxw } =
    statistiquesGranulatsMarinsTitresGet(titresFiltered)

  // les activités de l'année
  const titresActivitesAnneeFiltered = titresActivites.filter(
    ta => ta.annee === annee
  )
  const statistiquesActivites = statistiquesGranulatsMarinsActivitesFind(
    titresActivitesAnneeFiltered,
    ['volumeGranulatsExtrait']
  )

  const activitesDeposesRatio = statistiquesActivites.rapportProductionCount
    ? Math.round(
        (statistiquesActivites.activitesDeposesQuantiteCount * 100) /
          statistiquesActivites.rapportProductionCount
      )
    : 0

  const concessionsValides = concessionsValidesBuild(titres, annee)

  return {
    annee,
    titresPrw,
    titresPxw,
    titresCxw,
    volume: Math.floor(statistiquesActivites.volumeGranulatsExtrait),
    masse: Math.floor(statistiquesActivites.volumeGranulatsExtrait * 1.5),
    activitesDeposesQuantite:
      statistiquesActivites.activitesDeposesQuantiteCount,
    activitesDeposesRatio,
    concessionsValides
  }
}

const statistiquesGranulatsMarins = async () => {
  try {
    const anneeCurrent = new Date().getFullYear()
    // un tableau avec les années depuis 2006
    const annees = Array.from(Array(anneeCurrent - 2006 + 1).keys())
      .map(e => anneeCurrent - e)
      .reverse()

    const titres = await titresGet(
      {
        domainesIds: ['w'],
        typesIds: ['ar', 'ap', 'pr', 'ax', 'px', 'cx']
      },
      {
        fields: {
          surfaceEtape: { id: {} },
          demarches: { phase: { id: {} }, etapes: { id: {} }, type: { id: {} } }
        }
      },
      userSuper
    )

    const titresActivites = await titresActivitesGet(
      { annees, typesIds: ['wrp'] },
      {
        fields: {
          titre: { id: {} }
        }
      },
      userSuper
    )

    return {
      annees: annees.map(annee =>
        statistiquesGranulatsMarinsAnneeBuild(titres, titresActivites, annee)
      ),
      ...statistiquesGranulatsMarinsInstantBuild(titres)
    }
  } catch (e) {
    console.error(e)

    throw e
  }
}

export { statistiquesGranulatsMarins }
