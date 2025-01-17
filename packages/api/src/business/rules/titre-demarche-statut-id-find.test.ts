import { ITitreEtape, TitreEtapesTravauxTypes as Travaux } from '../../types'

import { titreDemarcheStatutIdFind } from './titre-demarche-statut-id-find'
import { DemarchesStatutsIds as Demarches } from 'camino-common/src/static/demarchesStatuts'
import { newDemarcheId } from '../../database/models/_format/id-create'

const etapesBuild = (etapesProps: Partial<ITitreEtape>[]) =>
  etapesProps.map(
    (etapeProps, i) =>
      ({
        ...etapeProps,
        ordre: i + 1
      } as unknown as ITitreEtape)
  )

describe("statut d'une démarche", () => {
  test('une démarche sans étape a le statut “indéfini”', () => {
    expect(
      titreDemarcheStatutIdFind('oct', [], 'pxm', newDemarcheId())
    ).toEqual('ind')
  })

  test("une démarche d'octroi sans étape décisive a le statut “indéfini”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'anf' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test("une démarche d'octroi dont l'étape de dpu la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'dex', statutId: 'acc' },
          { typeId: 'dpu', statutId: 'acc' }
        ]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre AXM dont l'étape de dex la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'dex', date: '2010-01-01', statutId: 'acc' }]),
        'axm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre ARM dont l'étape de def la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          {
            typeId: 'def',
            statutId: 'acc',
            date: '2010-01-01'
          }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre PRM dont l'étape de rpu la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'rpu', statutId: 'acc' }]),
        'prm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche de prolongation dont l'étape de dpu la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'pro',
        etapesBuild([
          { typeId: 'dex', statutId: 'acc' },
          { typeId: 'dpu', statutId: 'acc' }
        ]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi dont l'étape de sco est faite a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          {
            typeId: 'mfr',
            statutId: 'fai',
            date: '2019-12-10',
            contenu: { arm: { mecanise: true, franchissements: 3 } }
          },
          { typeId: 'mdp', statutId: 'fai', date: '2019-12-11' },
          { typeId: 'pfd', statutId: 'fai', date: '2019-12-13' },
          { typeId: 'dae', statutId: 'exe', date: '2020-01-14' },
          { typeId: 'mcp', statutId: 'com', date: '2020-01-23' },
          { typeId: 'vfd', statutId: 'fai', date: '2020-02-05' },
          { typeId: 'mcr', statutId: 'fav', date: '2020-02-06' },
          { typeId: 'eof', statutId: 'fai', date: '2020-02-07' },
          { typeId: 'aof', statutId: 'fav', date: '2020-02-08' },
          {
            typeId: 'rde',
            statutId: 'fav',
            date: '2020-02-11',
            contenu: { arm: { franchissements: 3 } }
          },
          { typeId: 'sca', statutId: 'fai', date: '2020-06-15' },
          { typeId: 'aca', statutId: 'fav', date: '2020-06-17' },
          { typeId: 'mnb', statutId: 'fai', date: '2020-07-09' },
          { typeId: 'pfc', statutId: 'fai', date: '2020-07-16' },
          { typeId: 'vfc', statutId: 'fai', date: '2020-07-17' },
          { typeId: 'sco', statutId: 'fai', date: '2020-09-28' }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('acc')
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          {
            typeId: 'sco',
            statutId: 'fai',
            date: '2010-09-28'
          }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre autre qu'ARM dont l'étape de sco est faite a le statut “indéfini”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'sco', statutId: 'fai' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test("une démarche d'octroi ne contenant une unique étape de dex acceptée a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'dex', statutId: 'acc' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche d'octroi contenant une étape de publication acceptée après une dex acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'dex', statutId: 'acc' },
          { typeId: 'dpu', statutId: 'acc' }
        ]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi dont l'unique étape de dex est rejetée a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'dex', statutId: 'rej' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('rej')
  })

  test("une démarche d'octroi dont l'étape est men a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'men' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test("une démarche d'octroi d'un titre ARM dont l'étape de mdp (statut fai) a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'mfr', statutId: 'fai' },
          { typeId: 'mdp', statutId: 'fai' }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche d'octroi d'un titre ARM dont l'étape de mcp a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'mfr', statutId: 'fai' },
          { typeId: 'mdp', statutId: 'fai' },
          { typeId: 'pfd', statutId: 'fai' },
          { typeId: 'mcp', statutId: 'com' }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche d'octroi d'un titre ARM dont la dernière étape de def est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          {
            typeId: 'def',
            statutId: 'acc',
            date: '2010-01-01'
          }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre ARM dont la dernière étape de def est rejetée a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          {
            typeId: 'def',
            statutId: 'rej',
            date: '2010-01-12'
          }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('rej')
  })

  test("une démarche d'octroi d'un titre autre qu'ARM dont la dernière étape est une def a le statut “indéfini”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'def', statutId: 'rej' }]),
        'prh',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test("une démarche d'octroi dont l'étape la plus récente est des a le statut “désisté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'des' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('des')
  })

  test("une démarche d'octroi dont l'étape la plus récente est mdp (statut fai) a le statut “déposé”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'mdp', statutId: 'fai' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('dep')
  })

  test("une démarche d'octroi dont l'étape la plus récente est mfr a le statut “en construction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'mfr', statutId: 'aco' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('eco')
  })

  test("une démarche d'octroi dont l'étape la plus récente est mcr a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'mcr' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche d'octroi dont l'étape la plus récente est css a le statut “classé sans suite”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'css' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('cls')
  })

  test("une démarche d'octroi dont l'étape la plus récente d'aca est défavorable a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'mfr', statutId: 'fai', date: '2021-02-25' },
          { typeId: 'mdp', statutId: 'fai', date: '2021-02-26' },
          { typeId: 'pfd', statutId: 'fai', date: '2020-09-03' },
          { typeId: 'mcp', statutId: 'com', date: '2021-02-27' },
          { typeId: 'vfd', statutId: 'fai', date: '2021-03-10' },
          { typeId: 'mcr', statutId: 'fav', date: '2021-03-11' },
          { typeId: 'eof', statutId: 'fai', date: '2021-03-17' },
          { typeId: 'aof', statutId: 'fav', date: '2021-09-23' },
          { typeId: 'sca', statutId: 'fai', date: '2021-09-24' },
          { typeId: 'aca', statutId: 'def', date: '2021-09-25' }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('rej')
  })

  test("une démarche d'octroi dont l'étape la plus récente d'aca est favorable reste “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'mfr', statutId: 'fai', date: '2021-02-25' },
          { typeId: 'mdp', statutId: 'fai', date: '2021-02-26' },
          { typeId: 'pfd', statutId: 'fai', date: '2020-09-03' },
          { typeId: 'mcp', statutId: 'com', date: '2021-02-27' },
          { typeId: 'vfd', statutId: 'fai', date: '2021-03-10' },
          { typeId: 'mcr', statutId: 'fav', date: '2021-03-11' },
          { typeId: 'eof', statutId: 'fai', date: '2021-03-17' },
          { typeId: 'aof', statutId: 'fav', date: '2021-09-23' },
          { typeId: 'sca', statutId: 'fai', date: '2021-09-24' },
          { typeId: 'aca', statutId: 'fav', date: '2021-09-25' }
        ]),
        'arm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test('une démarche de retrait sans aucune étape décisive a le statut “indéterminé”', () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'ihi' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test("une démarche de retrait dont l'étape la plus récente de dup a été faite a le statut “terminé”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'dup', statutId: 'fai' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ter')
  })

  test("une démarche de retrait dont l'étape la plus récente est ide faite a le statut “initié”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'ide' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ini')
  })

  test("une démarche de retrait dont l'étape la plus récente est spp a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'spp' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche de retrait dont l'étape la plus récente est eof a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'ide' }, { typeId: 'eof' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche de retrait dont l'étape la plus récente est aco a le statut “terminé”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'aco' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ter')
  })

  test("une démarche de retrait dont l'étape la plus récente est aof refusée a le statut “css”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'aof', statutId: 'def' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('cls')
  })

  test("une démarche de retrait dont l'étape la plus récente de css a été faite a le statut “classé sans suite”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'css' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('cls')
  })

  test("une démarche de demande dont l'étape la plus récente est spp ne change pas de statut", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'spp' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test("une démarche dont l'étape la plus récente est de type “retrait de la décision” a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'rtd' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche dont l'étape la plus récente est de type “abrogation de la décision” a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'abd' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche dont l'étape la plus récente d'annulation de la décision est favorable a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'and', statutId: 'fai' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ins')
  })

  test("une démarche dont l'étape la plus récente d'annulation de la décision est favorable a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'and', statutId: 'acc' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('acc')
  })

  test("une démarche dont l'étape la plus récente d'annulation de la décision est favorable a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'and', statutId: 'rej' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('rej')
  })

  test('une démarche inexistante a le statut “indéfini”', () => {
    expect(
      titreDemarcheStatutIdFind(
        'xxx',
        etapesBuild([{ typeId: 'mfr' }]),
        'pxm',
        newDemarcheId()
      )
    ).toEqual('ind')
  })

  test.each`
    etapeTypeId                               | statutId | resultId
    ${Travaux.DemandeAutorisationOuverture}   | ${'fai'} | ${Demarches.Depose}
    ${Travaux.DepotDemande}                   | ${'fai'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                   | ${'def'} | ${Demarches.EnInstruction}
    ${Travaux.Recevabilite}                   | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.DemandeComplements}             | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ReceptionComplements}           | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.SaisineAutoriteEnvironmentale}  | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.MemoireReponseExploitant}       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisReception}                  | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.SaisineServiceEtat}             | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisAutoriteEnvironmentale}     | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.MemoireReponseExploitant}       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisRapportDirecteurREAL}       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.TransPrescriptionsDemandeur}    | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisCODERST}                    | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur}     | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ArreteOuvertureTravauxMiniers}  | ${'fai'} | ${Demarches.Accepte}
    ${Travaux.PubliDecisionRecueilActesAdmin} | ${'fai'} | ${Demarches.Accepte}
    ${Travaux.Abandon}                        | ${'fai'} | ${Demarches.Desiste}
  `(
    "pour une démarche de travaux de type 'aom' sur un titre, dont la dernière étape est '$etapeTypeId' au statut $statutId, le résultat est $resultId",
    ({ etapeTypeId, statutId, resultId }) => {
      expect(
        titreDemarcheStatutIdFind(
          'aom',
          etapesBuild([{ typeId: etapeTypeId, statutId }]),
          'pxm',
          newDemarcheId()
        )
      ).toEqual(resultId)
    }
  )

  test.each`
    etapeTypeId                            | statutId | resultId
    ${Travaux.DeclarationOuverture}        | ${'fai'} | ${Demarches.Depose}
    ${Travaux.DepotDemande}                | ${'fai'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                | ${'def'} | ${Demarches.EnInstruction}
    ${Travaux.Recevabilite}                | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.DemandeComplements}          | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ReceptionComplements}        | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.SaisineServiceEtat}          | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisServiceAdminLocal}       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisDDTM}                    | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisAutoriteMilitaire}       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisARS}                     | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisDRAC}                    | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrefetMaritime}          | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisAutresInstances}         | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.RapportDREAL}                | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.TransPrescriptionsDemandeur} | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur}  | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.DonneActeDeclaration}        | ${'fai'} | ${Demarches.Accepte}
    ${Travaux.Abandon}                     | ${'fai'} | ${Demarches.Desiste}
  `(
    "pour une démarche de travaux de type 'dot' sur un titre, dont la dernière étape est '$etapeTypeId' au statut $statutId, le résultat est $resultId",
    ({ etapeTypeId, statutId, resultId }) => {
      expect(
        titreDemarcheStatutIdFind(
          'dot',
          etapesBuild([{ typeId: etapeTypeId, statutId }]),
          'pxm',
          newDemarcheId()
        )
      ).toEqual(resultId)
    }
  )

  test.each`
    etapeTypeId                                 | statutId | resultId
    ${Travaux.DeclarationArret}                 | ${'fai'} | ${Demarches.Depose}
    ${Travaux.DepotDemande}                     | ${'fai'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                     | ${'def'} | ${Demarches.EnInstruction}
    ${Travaux.Recevabilite}                     | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.AvisReception}                    | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.SaisineServiceEtat}               | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ArretePrefectoralSursis}          | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisServiceAdminLocal}            | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisDDTM}                         | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisAutoriteMilitaire}            | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisARS}                          | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisDRAC}                         | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrefetMaritime}               | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisAutresInstances}              | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur}       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.RapportDREAL}                     | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ArretePrefectDonneActe1}          | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ArretePrescriptionComplementaire} | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.MemoireFinTravaux}                | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.Recolement}                       | ${'fai'} | ${Demarches.EnInstruction}
    ${Travaux.ArretePrefectDonneActe2}          | ${'acc'} | ${Demarches.FinPoliceMines}
    ${Travaux.PubliDecisionRecueilActesAdmin}   | ${'fai'} | ${Demarches.FinPoliceMines}
    ${Travaux.PorterAConnaissance}              | ${'fai'} | ${Demarches.FinPoliceMines}
    ${Travaux.Abandon}                          | ${'fai'} | ${Demarches.Desiste}
  `(
    "pour une démarche de travaux de type 'dam' sur un titre, dont la dernière étape est '$etapeTypeId' au statut $statutId, le résultat est $resultId",
    ({ etapeTypeId, statutId, resultId }) => {
      expect(
        titreDemarcheStatutIdFind(
          'dam',
          etapesBuild([{ typeId: etapeTypeId, statutId }]),
          'pxm',
          newDemarcheId()
        )
      ).toEqual(resultId)
    }
  )
})
