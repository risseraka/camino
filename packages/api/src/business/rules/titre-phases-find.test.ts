import { ITitreDemarche } from '../../types'
import { titrePhasesFind } from './titre-phases-find'
import {
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuInexistante,
  titreAxmDemarcheOctDexAcc,
  titrePrmDemarcheOctRpuAcc,
  titreDemarcheOctDpuDateDebut,
  titreDemarchesOctProlongation,
  titreDemarchesOctAnnulation,
  titreDemarchesOctAnnulationSansPoints
} from './__mocks__/titre-phases-find-demarches'
import { newDemarcheId } from '../../database/models/_format/id-create'

describe("phases d'une démarche", () => {
  const aujourdhui = '2020-12-01'
  test("un titre qui a une démarche d'octroi avec une dpu a une phase", () => {
    expect(
      titrePhasesFind([titreDemarcheOctDpuAcc], aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2202-01-01',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01')
      }
    ])
  })

  test("un titre qui a une démarche d'octroi sans dpu n'a pas de phase", () => {
    expect(
      titrePhasesFind([titreDemarcheOctDpuInexistante], aujourdhui, 'cxh')
    ).toEqual([])
  })

  test("un titre AXM qui a une démarche d'octroi avec une dex a une phase", () => {
    expect(
      titrePhasesFind([titreAxmDemarcheOctDexAcc], aujourdhui, 'axm')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2202-01-01',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('h-ax-courdemanges-1988-oct01')
      }
    ])
  })

  test("un titre PRM qui a une démarche d'octroi avec une rpu a une phase", () => {
    expect(
      titrePhasesFind([titrePrmDemarcheOctRpuAcc], aujourdhui, 'prm')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2200-01-02',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('m-pr-courdemanges-1988-oct01')
      }
    ])
  })

  test("un titre qui a une démarche d'octroi avec une dpu dont la date de début est renseignée a une phase", () => {
    expect(
      titrePhasesFind([titreDemarcheOctDpuDateDebut], aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2200-01-02',
        dateFin: '2202-01-02',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01')
      }
    ])
  })

  test('un titre qui a une démarche de prolongation avec une dpu a une phase', () => {
    expect(
      titrePhasesFind(titreDemarchesOctProlongation, aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2500-01-01',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01')
      },
      {
        dateDebut: '2500-01-01',
        dateFin: '3000-01-01',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01')
      }
    ])
  })

  test("la phase d'un titre concernée par une démarche d'annulation a une date de fin qui est celle de cette démarche d'annulation", () => {
    expect(
      titrePhasesFind(titreDemarchesOctAnnulation, aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2000-01-02',
        dateFin: '2019-01-02',
        phaseStatutId: 'ech',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01')
      }
    ])
  })

  test("la phase d'un titre concernée par une démarche de renonciation partielle n'est pas affectée par la renonciation", () => {
    expect(
      titrePhasesFind(titreDemarchesOctAnnulationSansPoints, aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2000-01-02',
        dateFin: '2020-01-02',
        phaseStatutId: 'ech',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01')
      }
    ])
  })

  test("modification d'une mutation suite à renonciation totale en décision implicite", () => {
    const demarches: ITitreDemarche[] = [
      {
        id: newDemarcheId('demarcheId1'),
        titreId: 'titreId',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'demarcheId1etapeId2',
            titreDemarcheId: newDemarcheId('demarcheId1'),
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1970-09-17'
          },
          {
            id: 'demarcheId1etapeId1',
            titreDemarcheId: newDemarcheId('demarcheId1'),
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1970-09-09'
          }
        ]
      },
      {
        id: newDemarcheId('demarcheId2'),
        titreId: 'titreId',
        typeId: 'mut',
        statutId: 'acc',
        ordre: 2,
        slug: 'm-cx-pontaubert-1970-mut01',
        etapes: [
          {
            id: 'demarcheId2EtapeId2',
            titreDemarcheId: newDemarcheId('demarcheId2'),
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1994-10-18',
            dateFin: '2044-10-18',
            duree: 600
          },
          {
            id: 'demarcheId2EtapeId1',
            titreDemarcheId: newDemarcheId('demarcheId2'),
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1994-10-13',
            duree: 600
          }
        ]
      },
      {
        id: newDemarcheId('demarcheId3'),
        titreId: 'titreId',
        typeId: 'ren',
        statutId: 'acc',
        ordre: 3,
        etapes: [
          {
            id: 'demarcheId3etapeId1',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'mfr',
            statutId: 'fai',
            ordre: 1,
            date: '2019-10-22'
          },
          {
            id: 'demarcheId3etapeId2',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'mdp',
            statutId: 'fai',
            ordre: 2,
            date: '2019-11-20'
          },
          {
            id: 'demarcheId3etapeId5',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'dex',
            statutId: 'acc',
            ordre: 5,
            date: '2022-05-09'
          },
          {
            id: 'demarcheId3etapeId6',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 6,
            date: '2022-05-09'
          },
          {
            id: 'demarcheId3etapeId3',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'apd',
            statutId: 'fav',
            ordre: 3,
            date: '2020-05-11'
          },
          {
            id: 'demarcheId3etapeId4',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'app',
            statutId: 'fav',
            ordre: 4,
            date: '2020-06-30',
            slug: 'm-cx-pontaubert-1970-ren01-app01'
          }
        ]
      }
    ]
    const aujourdhui = '2022-05-09'
    const titreTypeId = 'cxm'

    const tested = titrePhasesFind(demarches, aujourdhui, titreTypeId)
    expect(tested).toStrictEqual([
      {
        dateDebut: '1970-09-17',
        dateFin: '2018-12-31',
        phaseStatutId: 'ech',
        titreDemarcheId: newDemarcheId('demarcheId1')
      },
      {
        dateDebut: '2018-12-31',
        dateFin: '2022-05-09',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('demarcheId2')
      }
    ])
  })

  test("modification d'une mutation suite à renonciation totale", () => {
    const demarches: ITitreDemarche[] = [
      {
        id: newDemarcheId('demarcheId1'),
        titreId: 'titreId',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'demarcheId1etapeId2',
            titreDemarcheId: newDemarcheId('demarcheId1'),
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1970-09-17'
          },
          {
            id: 'demarcheId1etapeId1',
            titreDemarcheId: newDemarcheId('demarcheId1'),
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1970-09-09'
          }
        ]
      },
      {
        id: newDemarcheId('demarcheId2'),
        titreId: 'titreId',
        typeId: 'mut',
        statutId: 'acc',
        ordre: 2,
        etapes: [
          {
            id: 'demarcheId2EtapeId2',
            titreDemarcheId: newDemarcheId('demarcheId2'),
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1994-10-18',
            dateFin: '2044-10-18',
            duree: 600
          },
          {
            id: 'demarcheId2EtapeId1',
            titreDemarcheId: newDemarcheId('demarcheId2'),
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1994-10-13',
            duree: 600
          }
        ]
      },
      {
        id: newDemarcheId('demarcheId3'),
        titreId: 'titreId',
        typeId: 'ren',
        statutId: 'acc',
        ordre: 3,
        etapes: [
          {
            id: 'demarcheId3etapeId1',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'mfr',
            statutId: 'fai',
            ordre: 1,
            date: '2019-10-22'
          },
          {
            id: 'demarcheId3etapeId2',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'mdp',
            statutId: 'fai',
            ordre: 2,
            date: '2019-11-20'
          },
          {
            id: 'demarcheId3etapeId3',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'apd',
            statutId: 'fav',
            ordre: 3,
            date: '2020-05-11'
          },
          {
            id: 'demarcheId3etapeId5',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'dim',
            statutId: 'acc',
            ordre: 5,
            date: '2022-05-09'
          },
          {
            id: 'demarcheId3etapeId4',
            titreDemarcheId: newDemarcheId('demarcheId3'),
            typeId: 'app',
            statutId: 'fav',
            ordre: 4,
            date: '2020-06-30'
          }
        ]
      }
    ]
    const aujourdhui = '2022-05-09'
    const titreTypeId = 'cxm'

    //  d'un côté on a une dim, de l'autre on a une dex suivie d'une dpu
    const tested = titrePhasesFind(demarches, aujourdhui, titreTypeId)
    expect(tested).toStrictEqual([
      {
        dateDebut: '1970-09-17',
        dateFin: '2018-12-31',
        phaseStatutId: 'ech',
        titreDemarcheId: newDemarcheId('demarcheId1')
      },
      {
        dateDebut: '2018-12-31',
        dateFin: '2022-05-09',
        phaseStatutId: 'val',
        titreDemarcheId: newDemarcheId('demarcheId2')
      }
    ])
  })
})
