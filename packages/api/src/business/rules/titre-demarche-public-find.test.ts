import { ITitreDemarche, ITitreEtape } from '../../types'

import { titreDemarchePublicFind } from './titre-demarche-public-find'
import { EtapeTypeId } from 'camino-common/src/static/etapesTypes'
import { newDemarcheId } from '../../database/models/_format/id-create'

const etapesBuild = (etapesProps: Partial<ITitreEtape>[]) =>
  etapesProps.map(
    (etapeProps, i) =>
      ({
        ...etapeProps,
        ordre: i + 1
      } as unknown as ITitreEtape)
  )

describe("publicité d'une démarche", () => {
  test("une démarche sans étape n'est pas publique", () => {
    expect(titreDemarchePublicFind('oct', [], [], 'titreId', [])).toMatchObject(
      {
        publicLecture: false,
        entreprisesLecture: false
      }
    )
  })

  test("une démarche d'octroi sans étape décisive n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dae' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false, entreprisesLecture: false })
  })

  test("une démarche de retrait dont l'étape la plus récente est saisine du préfet est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'spp' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false, entreprisesLecture: false })
  })

  test("une démarche de retrait dont l'étape la plus récente est saisine du préfet est publique", () => {
    expect(
      titreDemarchePublicFind(
        'ret',
        [],
        etapesBuild([{ typeId: 'spp' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true, entreprisesLecture: true })
  })

  test("une démarche de déchéance dont l'étape la plus récente est saisine du préfet est publique", () => {
    expect(
      titreDemarchePublicFind(
        'dec',
        [],
        etapesBuild([{ typeId: 'spp' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true, entreprisesLecture: true })
  })

  test("une démarche dont l'étape la plus récente est demande est visible uniquement par l'entreprise", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mfr' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false, entreprisesLecture: true })
  })

  test("une démarche dont l'étape la plus récente est décision de l'administration est visible uniquement par l'entreprise", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dex' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false, entreprisesLecture: true })
  })

  test("une démarche dont l'étape la plus récente est classement sans suite n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'css' }, { typeId: 'mfr' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est classement sans suite ne change pas de visibilité", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }, { typeId: 'css' }]),
        'titreId',
        [],
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est classement sans suite ne change pas de visibilité", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sca' }, { typeId: 'css' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est désistement du demandeur est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'des' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est désistement du demandeur est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'des' }]),
        'titreId',
        [],
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche ne pouvant pas faire l'objet d'une mise en concurrence dont l'étape la plus récente est recevabilité est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM ne pouvant pas faire l'objet d'une mise en concurrence dont l'étape la plus récente est recevabilité n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche pouvant faire l'objet d'une mise en concurrence dont l'étape la plus récente est recevabilité n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [{ id: 'anf', nom: 'anf', ordre: 1 }],
        etapesBuild([{ typeId: 'mcr' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche dont l'étape la plus récente est mise en concurrence au JORF est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'anf' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est publication de l'avis de décision implicite (historique) est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'apu' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est mise en concurrence au JOUE est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'ane' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est participation du public est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'ppu' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est décision de l'ONF peu importe son statut (historique) est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'def' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est commission ARM peu importe son statut (historique) est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'aca' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est saisine de la commission ARM est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sca' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est décision implicite au statut accepté est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dim', statutId: 'acc' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est décision implicite au statut rejeté n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([
          { typeId: 'anf', statutId: 'fai' },
          { typeId: 'dim', statutId: 'rej' }
        ]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche d'un titre non AXM dont l'étape la plus récente est décision de l'administration au statut rejeté n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dex', statutId: 'rej' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est décision de l'administration au statut rejeté est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }, { typeId: 'dex', statutId: 'rej' }]),
        'titreId',
        [],
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est décision de l'administration au statut accepté est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dex', statutId: 'acc' }]),
        'titreId',
        [],
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est publication de décision au JORF au statut au statut accepté publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dpu', statutId: 'acc' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est décision unilatérale est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dux' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est publication de décision unilatérale est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dup' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est publication de décision au recueil des actes administratifs est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'rpu' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est signature de l'autorisation de recherche minière est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sco' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est signature de l'avenant à l'autorisation de recherche minière est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sco' }]),
        'titreId',
        [],
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est décision d'annulation par le juge administratif est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'and', statutId: 'fav' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est décision d'annulation par le juge administratif au statut fait n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'and', statutId: 'fai' }]),
        'titreId',
        []
      )
    ).toMatchObject({ publicLecture: false })
  })

  test.each(['ren', 'pro'])(
    "une démarche %s dont l'étape la plus récente est le dépot de la demande n'est pas publique",
    (demarcheTypeId: string) => {
      expect(
        titreDemarchePublicFind(
          demarcheTypeId,
          [],
          etapesBuild([{ typeId: 'mdp', statutId: 'fai' }]),
          'titreId',
          [],
          'arm'
        )
      ).toMatchObject({ publicLecture: false })
    }
  )

  test.each(['ren', 'pro'])(
    "une démarche %s dont l'étape la plus récente est recevabilité de la demande n'est pas publique",
    (demarcheTypeId: string) => {
      expect(
        titreDemarchePublicFind(
          demarcheTypeId,
          [],
          etapesBuild([{ typeId: 'mcr' }]),
          'titreId',
          [],
          'arm'
        )
      ).toMatchObject({ publicLecture: false })
    }
  )

  test.each(['ren', 'pro'])(
    "une démarche %s dont l'étape la plus récente est l’expertise de l’onf est publique",
    (demarcheTypeId: string) => {
      expect(
        titreDemarchePublicFind(
          demarcheTypeId,
          [],
          etapesBuild([{ typeId: 'eof' }]),
          'titreId',
          [],
          'arm'
        )
      ).toMatchObject({ publicLecture: true })
    }
  )

  test.each(['ren', 'pro'])(
    "une démarche %s dont l'étape la plus récente est la décisision de classement sans suite est publique",
    (demarcheTypeId: string) => {
      expect(
        titreDemarchePublicFind(
          demarcheTypeId,
          [],
          etapesBuild([{ typeId: 'css' }]),
          'titreId',
          [],
          'arm'
        )
      ).toMatchObject({ publicLecture: true })
    }
  )

  test.each(['ren', 'pro'])(
    "une démarche %s dont l'étape la plus récente est le désistement est publique",
    (demarcheTypeId: string) => {
      expect(
        titreDemarchePublicFind(
          demarcheTypeId,
          [],
          etapesBuild([{ typeId: 'des' }]),
          'titreId',
          [],
          'arm'
        )
      ).toMatchObject({ publicLecture: true })
    }
  )

  test.each<EtapeTypeId>([
    'ane',
    'anf',
    'dex',
    'dpu',
    'dup',
    'rpu',
    'ppu',
    'ppc',
    'epu',
    'epc'
  ])(
    "une démarche d’un titre non énergétique dont l'étape la plus récente est %s est public",
    etapeTypeId => {
      expect(
        titreDemarchePublicFind(
          'oct',
          [],
          etapesBuild([{ typeId: etapeTypeId }]),
          'titreId',
          [],
          'arm'
        )
      ).toMatchObject({ publicLecture: true })
    }
  )

  test('le titre WQaZgPfDcQw9tFliMgBIDH3Z ne doit pas être public', () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'ane' }]),
        'WQaZgPfDcQw9tFliMgBIDH3Z',
        []
      )
    ).toMatchObject({ publicLecture: false })
  })

  const demarches: ITitreDemarche[] = [
    {
      id: newDemarcheId('m-pr-saint-pierre-2014-pro01'),
      titreId: 'm-pr-saint-pierre-2014',
      type: { id: 'pr2', nom: 'unused', ordre: 1, etapesTypes: [] },
      typeId: 'pr2',
      statutId: 'eco',
      ordre: 3,
      etapes: [
        {
          date: '2020-06-01',
          typeId: 'mfr',
          statutId: 'fai',
          id: 'id',
          titreDemarcheId: newDemarcheId('m-pr-saint-pierre-2014-pro02')
        }
      ]
    },
    {
      id: newDemarcheId('m-pr-saint-pierre-2014-pro01'),
      titreId: 'm-pr-saint-pierre-2014',
      type: { id: 'pr1', nom: 'unused', ordre: 1, etapesTypes: [] },
      typeId: 'pr1',
      statutId: 'acc',
      ordre: 2,
      etapes: [
        {
          date: '2020-01-01',
          typeId: 'dex',
          statutId: 'acc',
          id: 'id',
          titreDemarcheId: newDemarcheId('m-pr-saint-pierre-2014-pro01'),
          ordre: 1,
          dateDebut: null,
          dateFin: '2020-10-01'
        }
      ]
    },
    {
      id: newDemarcheId('m-pr-saint-pierre-2014-oct01'),
      titreId: 'm-pr-saint-pierre-2014',
      type: { id: 'oct', nom: 'unused', ordre: 2, etapesTypes: [] },
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      etapes: [
        {
          id: 'm-pr-saint-pierre-2014-oct01-dex01',
          titreDemarcheId: newDemarcheId('m-pr-saint-pierre-2014-oct01'),
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1,
          date: '1014-04-01',
          dateDebut: null,
          dateFin: '2020-04-01'
        }
      ]
    }
  ]
  test('la demarche d’une prolongation déposée d’un PRM en survie provisoire est public ', () => {
    expect(
      titreDemarchePublicFind(
        'pr1',
        [],
        etapesBuild([{ typeId: 'mfr' }, { typeId: 'mdp' }]),
        'titreId',
        demarches,
        'prm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test('la demarche d’une prolongation non déposée d’un PRM en survie provisoire n’est pas public ', () => {
    expect(
      titreDemarchePublicFind(
        'pr1',
        [],
        etapesBuild([{ typeId: 'mfr' }]),
        'titreId',
        demarches,
        'prm'
      )
    ).toMatchObject({ publicLecture: false })
  })
})
