import { assign, createMachine } from 'xstate'
import { CaminoMachine } from '../machine-helper'
import { CaminoCommonContext, DBEtat, tags } from '../machine-common'
import { EtapesTypesEtapesStatuts as ETES } from 'camino-common/src/static/etapesTypesEtapesStatuts'
import { DemarchesStatutsIds } from 'camino-common/src/static/demarchesStatuts'
import { ADMINISTRATION_IDS } from 'camino-common/src/static/administrations'

// FIXME
// ? vérifier la visibilité classement sans suite (@laure)
// ? brancher le calcul de la visibilité
export type AXMOctXStateEvent =
  | { type: 'FAIRE_DEMANDE' }
  | { type: 'DEPOSER_DEMANDE' }
  | { type: 'RENDRE_DAE_EXEMPTEE' }
  | { type: 'RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE' }
  | { type: 'RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE_AVEC_RESERVE' }
  | { type: 'RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_DEFAVORABLE' }
  | { type: 'RENDRE_DAE_REQUISE' }
  | { type: 'MODIFIER_DEMANDE_APRES_DAE' }
  | { type: 'DEMANDER_COMPLEMENTS_POUR_RECEVABILITE' }
  | { type: 'RECEVOIR_COMPLEMENTS_POUR_RECEVABILITE' }
  | { type: 'FAIRE_RECEVABILITE_DEMANDE_FAVORABLE' }
  | { type: 'FAIRE_RECEVABILITE_DEMANDE_DEFAVORABLE' }
  | { type: 'MODIFIER_LA_DEMANDE' }
  | { type: 'FAIRE_SAISINE_COLLECTIVITES_LOCALES' }
  | { type: 'RENDRE_AVIS_DUN_MAIRE' }
  | { type: 'RENDRE_AVIS_DREAL' }
  | { type: 'FAIRE_SAISINE_DES_SERVICES' }
  | { type: 'RENDRE_AVIS_DGTM_MNBST' }
  | { type: 'FAIRE_SAISINE_COMMISSION_DEPARTEMENTALE_DES_MINES' }
  | { type: 'RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES' }
  | { type: 'RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES_AJOURNE' }
  | { type: 'FAIRE_SAISINE_AUTORITE_SIGNATAIRE' }
  | { type: 'RENDRE_DECISION_ADMINISTRATION_ACCEPTE' }
  | { type: 'RENDRE_DECISION_ADMINISTRATION_REJETE' }
  | { type: 'NOTIFIER_DEMANDEUR' }
  | { type: 'PUBLIER_DECISIONS_RECUEIL_ACTES_ADMINISTRATIFS' }
  | { type: 'PUBLIER_DANS_UN_JOURNAL_LOCAL_OU_NATIONAL' }
  | { type: 'NOTIFIER_COLLECTIVITES_LOCALES' }
  | { type: 'RENDRE_DECISION_ABROGATION' }
  | { type: 'RENDRE_DECISION_RETRAIT' }
  | { type: 'RENDRE_AVIS_DGTMAUCUL' }
  | {
      type: 'RENDRE_AVIS_DIRECTION_ENTREPRISE_CONCURRENCE_CONSOMMATION_TRAVAIL_EMPLOI'
    }
  | { type: 'RENDRE_AVIS_DIRECTION_ALIMENTATION_AGRICULTURE_FORET' }
  | { type: 'RENDRE_AVIS_DIRECTION_REGIONALE_AFFAIRES_CULTURELLES' }
  | { type: 'RENDRE_AVIS_AGENCE_REGIONALE_SANTE' }
  | { type: 'RENDRE_AVIS_DIRECTION_REGIONALE_FINANCES_PUBLIQUES' }
  | { type: 'RENDRE_AVIS_CAISSE_GENERALE_DE_SECURITE_SOCIALE' }
  | { type: 'RENDRE_AVIS_OFFICE_NATIONAL_DES_FORETS' }
  | { type: 'RENDRE_AVIS_ETAT_MAJOR_ORPAILLAGE_ET_PECHE_ILLICITE' }
  | { type: 'RENDRE_AVIS_GENDARMERIE_NATIONALE' }
  | { type: 'FAIRE_CONFIRMATION_PROPRIETAIRE_DU_SOL' }
  | { type: 'FAIRE_NOTE_INTERNE_SIGNALEE' }
  | { type: 'DEMANDER_INFORMATION_POUR_AVIS_DREAL' }
  | { type: 'RECEVOIR_INFORMATION_POUR_AVIS_DREAL' }
  | { type: 'RENDRE_DECISION_IMPLICITE_REJET' }
  | { type: 'RENDRE_DECISION_ANNULATION_PAR_JUGE_ADMINISTRATIF' }
  | { type: 'FAIRE_DESISTEMENT_DEMANDEUR' }
  | { type: 'FAIRE_CLASSEMENT_SANS_SUITE' }

const trad: { [key in AXMOctXStateEvent['type']]: DBEtat } = {
  FAIRE_DEMANDE: ETES.demande,
  DEPOSER_DEMANDE: ETES.depotDeLaDemande,
  RENDRE_DAE_EXEMPTEE: {
    EXEMPTE:
      ETES
        .decisionDeLaMissionAutoriteEnvironnementale_ExamenAuCasParCasDuProjet_
        .EXEMPTE
  },
  RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE: {
    FAVORABLE: ETES.decisionDuProprietaireDuSol.FAVORABLE
  },
  RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE_AVEC_RESERVE: {
    FAVORABLE_AVEC_RESERVE:
      ETES.decisionDuProprietaireDuSol.FAVORABLE_AVEC_RESERVE
  },
  RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_DEFAVORABLE: {
    DEFAVORABLE: ETES.decisionDuProprietaireDuSol.DEFAVORABLE
  },
  RENDRE_DAE_REQUISE: {
    REQUIS:
      ETES
        .decisionDeLaMissionAutoriteEnvironnementale_ExamenAuCasParCasDuProjet_
        .REQUIS
  },
  MODIFIER_DEMANDE_APRES_DAE:
    ETES.modificationDeLaDemande_DecisionDeLaMissionAutoriteEnvironnementale_ExamenAuCasParCasDuProjet_,
  DEMANDER_COMPLEMENTS_POUR_RECEVABILITE:
    ETES.demandeDeComplements_RecevabiliteDeLaDemande_,
  RECEVOIR_COMPLEMENTS_POUR_RECEVABILITE:
    ETES.receptionDeComplements_RecevabiliteDeLaDemande_,
  FAIRE_RECEVABILITE_DEMANDE_FAVORABLE: {
    FAVORABLE: ETES.recevabiliteDeLaDemande.FAVORABLE
  },
  FAIRE_RECEVABILITE_DEMANDE_DEFAVORABLE: {
    DEFAVORABLE: ETES.recevabiliteDeLaDemande.DEFAVORABLE
  },
  MODIFIER_LA_DEMANDE: ETES.modificationDeLaDemande,
  FAIRE_SAISINE_COLLECTIVITES_LOCALES: ETES.saisineDesCollectivitesLocales,
  RENDRE_AVIS_DUN_MAIRE: ETES.avisDunMaire,
  RENDRE_AVIS_DREAL:
    ETES.avisEtRapportDuDirecteurRegionalChargeDeLenvironnementDeLamenagementEtDuLogement,
  FAIRE_SAISINE_DES_SERVICES: ETES.saisineDesServices,
  RENDRE_AVIS_DGTM_MNBST:
    ETES.avisDGTMServiceMilieuxNaturelsBiodiversiteSitesEtPaysages_MNBST_,
  FAIRE_SAISINE_COMMISSION_DEPARTEMENTALE_DES_MINES:
    ETES.saisineDeLaCommissionDepartementaleDesMines_CDM_,
  RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES: {
    FAVORABLE: ETES.avisDeLaCommissionDepartementaleDesMines_CDM_.FAVORABLE,
    FAVORABLE_AVEC_RESERVE:
      ETES.avisDeLaCommissionDepartementaleDesMines_CDM_.FAVORABLE_AVEC_RESERVE,
    DEFAVORABLE: ETES.avisDeLaCommissionDepartementaleDesMines_CDM_.DEFAVORABLE,
    DEFAVORABLE_AVEC_RESERVES:
      ETES.avisDeLaCommissionDepartementaleDesMines_CDM_
        .DEFAVORABLE_AVEC_RESERVES
  },
  RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES_AJOURNE: {
    AJOURNE: ETES.avisDeLaCommissionDepartementaleDesMines_CDM_.AJOURNE
  },
  FAIRE_SAISINE_AUTORITE_SIGNATAIRE: ETES.saisineDeLautoriteSignataire,
  RENDRE_DECISION_ADMINISTRATION_ACCEPTE: {
    ACCEPTE: ETES.decisionDeLadministration.ACCEPTE
  },
  RENDRE_DECISION_ADMINISTRATION_REJETE: {
    REJETE: ETES.decisionDeLadministration.REJETE
  },
  NOTIFIER_DEMANDEUR: ETES.notificationAuDemandeur,
  PUBLIER_DECISIONS_RECUEIL_ACTES_ADMINISTRATIFS:
    ETES.publicationDeDecisionAuRecueilDesActesAdministratifs,
  PUBLIER_DANS_UN_JOURNAL_LOCAL_OU_NATIONAL:
    ETES.publicationDansUnJournalLocalOuNational,
  NOTIFIER_COLLECTIVITES_LOCALES: ETES.notificationDesCollectivitesLocales,
  RENDRE_DECISION_ABROGATION: ETES.abrogationDeLaDecision,
  RENDRE_DECISION_RETRAIT: ETES.retraitDeLaDecision,
  RENDRE_AVIS_DGTMAUCUL:
    ETES.avisDGTMServiceAmenagementUrbanismeConstructionLogement_AUCL_,
  RENDRE_AVIS_DIRECTION_ENTREPRISE_CONCURRENCE_CONSOMMATION_TRAVAIL_EMPLOI:
    ETES.avisDeLaDirectionDesEntreprisesDeLaConcurrenceDeLaConsommationDuTravailEtDeLemploi,
  RENDRE_AVIS_DIRECTION_ALIMENTATION_AGRICULTURE_FORET:
    ETES.avisDeLaDirectionDalimentationDeLagricultureEtDeLaForet,
  RENDRE_AVIS_DIRECTION_REGIONALE_AFFAIRES_CULTURELLES:
    ETES.avisDeDirectionRegionaleDesAffairesCulturelles,
  RENDRE_AVIS_AGENCE_REGIONALE_SANTE: ETES.avisDeLagenceRegionaleDeSante,
  RENDRE_AVIS_DIRECTION_REGIONALE_FINANCES_PUBLIQUES:
    ETES.avisDeLaDirectionRegionaleDesFinancesPubliques,
  RENDRE_AVIS_CAISSE_GENERALE_DE_SECURITE_SOCIALE:
    ETES.avisDeLaCaisseGeneraleDeSecuriteSociale,
  RENDRE_AVIS_OFFICE_NATIONAL_DES_FORETS: ETES.avisDeLOfficeNationalDesForets,
  RENDRE_AVIS_ETAT_MAJOR_ORPAILLAGE_ET_PECHE_ILLICITE:
    ETES.avisDeLetatMajorOrpaillageEtPecheIllicite_EMOPI_,
  RENDRE_AVIS_GENDARMERIE_NATIONALE: ETES.avisDeLaGendarmerieNationale,
  FAIRE_CONFIRMATION_PROPRIETAIRE_DU_SOL:
    ETES.confirmationDeLaccordDuProprietaireDuSol,
  FAIRE_NOTE_INTERNE_SIGNALEE: ETES.noteInterneSignalee,
  DEMANDER_INFORMATION_POUR_AVIS_DREAL:
    ETES.demandeDinformations_AvisDuDREALDEALOuDGTM_,
  RECEVOIR_INFORMATION_POUR_AVIS_DREAL:
    ETES.receptionDinformation_AvisDuDREALDEALOuDGTM_,
  RENDRE_DECISION_IMPLICITE_REJET: { REJETE: ETES.decisionImplicite.REJETE },
  RENDRE_DECISION_ANNULATION_PAR_JUGE_ADMINISTRATIF:
    ETES.decisionDuJugeAdministratif,
  FAIRE_DESISTEMENT_DEMANDEUR: ETES.desistementDuDemandeur,
  FAIRE_CLASSEMENT_SANS_SUITE: ETES.classementSansSuite
}

// basé sur https://cacoo.com/diagrams/iUPEVBYNBjsiirfE/249D0
export class AxmOctMachine extends CaminoMachine<
  AxmContext,
  AXMOctXStateEvent
> {
  constructor() {
    super(axmOctMachine, trad)
  }
}
interface AxmContext extends CaminoCommonContext {
  demandeFaite: boolean
  daeRequiseOuDemandeDeposee: boolean
  decisionDuProprietaireDuSolFavorableSansReserve: boolean
  saisineDesCollectivitesLocalesFaite: boolean
  saisineDesServicesFaite: boolean
}
const axmOctMachine = createMachine<AxmContext, AXMOctXStateEvent>({
  predictableActionArguments: true,
  id: 'AXMOct',
  initial: 'demandeAFaireEtDecisionsARendre',
  context: {
    demarcheStatut: DemarchesStatutsIds.EnConstruction,
    demandeFaite: false,
    decisionDuProprietaireDuSolFavorableSansReserve: false,
    saisineDesCollectivitesLocalesFaite: false,
    saisineDesServicesFaite: false,
    daeRequiseOuDemandeDeposee: false,
    visibilite: 'confidentielle'
  },
  on: {
    FAIRE_NOTE_INTERNE_SIGNALEE: {
      actions: assign<AxmContext, { type: 'FAIRE_NOTE_INTERNE_SIGNALEE' }>({}),
      cond: context => context.demandeFaite
    },
    FAIRE_DESISTEMENT_DEMANDEUR: {
      cond: context =>
        context.demandeFaite &&
        [
          DemarchesStatutsIds.EnConstruction,
          DemarchesStatutsIds.Depose,
          DemarchesStatutsIds.EnInstruction
        ].includes(context.demarcheStatut),
      target: 'desistementDuDemandeurRendu'
    },
    FAIRE_CLASSEMENT_SANS_SUITE: {
      cond: context =>
        context.daeRequiseOuDemandeDeposee &&
        [
          DemarchesStatutsIds.EnConstruction,
          DemarchesStatutsIds.Depose,
          DemarchesStatutsIds.EnInstruction
        ].includes(context.demarcheStatut),
      target: 'classementSansSuiteRendu'
    }
  },
  states: {
    demandeAFaireEtDecisionsARendre: {
      type: 'parallel',
      states: {
        demandeMachine: {
          initial: 'demandeAFaire',
          states: {
            demandeAFaire: {
              on: {
                FAIRE_DEMANDE: 'demandeFaite'
              }
            },
            demandeFaite: {
              type: 'final',
              entry: assign<AxmContext>({ demandeFaite: true })
            }
          }
        },
        decisionAutoriteEnvironnementaleMachine: {
          initial: 'decisionARendre',
          states: {
            decisionARendre: {
              on: {
                RENDRE_DAE_REQUISE: {
                  target: 'demandeAModifier',
                  actions: assign<AxmContext, { type: 'RENDRE_DAE_REQUISE' }>({
                    daeRequiseOuDemandeDeposee: true
                  })
                },
                RENDRE_DAE_EXEMPTEE: 'demandeExemptee'
              }
            },
            demandeAModifier: {
              on: { MODIFIER_DEMANDE_APRES_DAE: 'demandeModifiee' }
            },
            demandeExemptee: { type: 'final' },
            demandeModifiee: { type: 'final' }
          }
        },
        decisionDuProprietaireDuSolMachine: {
          initial: 'decisionARendre',
          states: {
            decisionARendre: {
              on: {
                RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE: {
                  target: 'decisionRendue',
                  actions: assign<
                    AxmContext,
                    { type: 'RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE' }
                  >({
                    decisionDuProprietaireDuSolFavorableSansReserve: true
                  })
                },
                RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_FAVORABLE_AVEC_RESERVE:
                  'decisionRendue',
                RENDRE_DECISION_DU_PROPRIETAIRE_DU_SOL_DEFAVORABLE:
                  '#classementSansSuiteAFaire'
              }
            },
            decisionRendue: { type: 'final' }
          }
        }
      },

      onDone: {
        target: 'depotDeLaDemandeAFaire'
      }
    },
    depotDeLaDemandeAFaire: {
      tags: [tags.responsable[ADMINISTRATION_IDS['DGTM - GUYANE']]],
      on: {
        DEPOSER_DEMANDE: {
          target: 'recevabiliteDeLaDemandeAFaire',
          actions: assign<AxmContext, { type: 'DEPOSER_DEMANDE' }>({
            demarcheStatut: DemarchesStatutsIds.Depose,
            daeRequiseOuDemandeDeposee: true
          })
        }
      }
    },
    recevabiliteDeLaDemandeAFaire: {
      tags: [tags.responsable[ADMINISTRATION_IDS['DGTM - GUYANE']]],
      on: {
        DEMANDER_COMPLEMENTS_POUR_RECEVABILITE:
          'complementsPourRecevabiliteAFaire',
        FAIRE_RECEVABILITE_DEMANDE_FAVORABLE: {
          target: 'saisinesAFairePuisRendreAvisDREAL',
          actions: assign<
            AxmContext,
            { type: 'FAIRE_RECEVABILITE_DEMANDE_FAVORABLE' }
          >({
            demarcheStatut: DemarchesStatutsIds.EnInstruction,
            visibilite: 'publique'
          })
        },
        FAIRE_RECEVABILITE_DEMANDE_DEFAVORABLE: 'modificationDeLaDemandeAFaire',
        RENDRE_DECISION_IMPLICITE_REJET: {
          target: 'decisionAnnulationParJugeAdministratifAFaire',
          actions: assign<
            AxmContext,
            { type: 'RENDRE_DECISION_IMPLICITE_REJET' }
          >({
            demarcheStatut: DemarchesStatutsIds.Rejete,
            visibilite: 'publique'
          })
        }
      }
    },
    complementsPourRecevabiliteAFaire: {
      on: {
        RECEVOIR_COMPLEMENTS_POUR_RECEVABILITE: 'recevabiliteDeLaDemandeAFaire',
        FAIRE_RECEVABILITE_DEMANDE_FAVORABLE: {
          target: 'saisinesAFairePuisRendreAvisDREAL',
          actions: assign<
            AxmContext,
            { type: 'FAIRE_RECEVABILITE_DEMANDE_FAVORABLE' }
          >({
            demarcheStatut: DemarchesStatutsIds.EnInstruction,
            visibilite: 'publique'
          })
        },
        FAIRE_RECEVABILITE_DEMANDE_DEFAVORABLE: 'modificationDeLaDemandeAFaire'
      }
    },
    modificationDeLaDemandeAFaire: {
      on: {
        MODIFIER_LA_DEMANDE: 'recevabiliteDeLaDemandeAFaire'
      }
    },
    saisinesAFairePuisRendreAvisDREAL: {
      type: 'parallel',
      states: {
        rendreAvisDrealMachine: {
          initial: 'rendreAvisDrealPasEncorePossible',
          states: {
            rendreAvisDrealPasEncorePossible: {
              always: {
                target: 'rendreAvisDrealAFaire',
                cond: (context: AxmContext) =>
                  context.saisineDesServicesFaite &&
                  context.saisineDesCollectivitesLocalesFaite &&
                  context.decisionDuProprietaireDuSolFavorableSansReserve
              }
            },
            rendreAvisDrealAFaire: {
              tags: [tags.responsable[ADMINISTRATION_IDS['DGTM - GUYANE']]],
              on: {
                RENDRE_AVIS_DREAL:
                  '#saisineOuAvisCommissionDepartementaleDesMinesARendre'
              }
            }
          }
        },
        demandeInformationPourAvisDREALMachine: {
          initial: 'demandeInformationPourAvisDREALAFaire',
          states: {
            demandeInformationPourAvisDREALAFaire: {
              on: {
                DEMANDER_INFORMATION_POUR_AVIS_DREAL:
                  'receptionInformationPourAvisDREALAFaire'
              }
            },
            receptionInformationPourAvisDREALAFaire: {
              on: {
                RECEVOIR_INFORMATION_POUR_AVIS_DREAL:
                  'demandeInformationPourAvisDREALAFaire'
              }
            }
          }
        },
        saisineCollectivitesLocalesMachine: {
          initial: 'saisineCollectivitesLocalesAFaire',
          states: {
            saisineCollectivitesLocalesAFaire: {
              on: {
                FAIRE_SAISINE_COLLECTIVITES_LOCALES: {
                  target: 'avisDunMaireARendre',
                  cond: context => !context.saisineDesCollectivitesLocalesFaite,
                  actions: assign<
                    AxmContext,
                    { type: 'FAIRE_SAISINE_COLLECTIVITES_LOCALES' }
                  >({
                    saisineDesCollectivitesLocalesFaite: true
                  })
                }
              }
            },
            avisDunMaireARendre: {
              on: { RENDRE_AVIS_DUN_MAIRE: 'avisDunMaireRendu' }
            },
            avisDunMaireRendu: { type: 'final' }
          }
        },
        saisineDesServicesMachine: {
          initial: 'saisineDesServicesAFaire',
          states: {
            saisineDesServicesAFaire: {
              on: {
                FAIRE_SAISINE_DES_SERVICES: {
                  target: 'avisDesServicesARendre',
                  cond: context => !context.saisineDesServicesFaite,
                  actions: assign<
                    AxmContext,
                    { type: 'FAIRE_SAISINE_DES_SERVICES' }
                  >({
                    saisineDesServicesFaite: true
                  })
                }
              }
            },
            avisDesServicesARendre: {
              type: 'parallel',

              states: {
                confirmationAccordProprietaireDuSolMachine: {
                  initial: 'confirmationAccordProprietaireDuSolAFaire',
                  states: {
                    confirmationAccordProprietaireDuSolAFaire: {
                      on: {
                        FAIRE_CONFIRMATION_PROPRIETAIRE_DU_SOL:
                          'confirmationAccordProprietaireDuSolFait'
                      }
                    },
                    confirmationAccordProprietaireDuSolFait: {
                      type: 'final',
                      entry: assign<AxmContext>({
                        decisionDuProprietaireDuSolFavorableSansReserve: true
                      })
                    }
                  }
                },
                avisDgtmMNBSTMachine: {
                  initial: 'avisDgtmMNBSTARendre',
                  states: {
                    avisDgtmMNBSTARendre: {
                      on: { RENDRE_AVIS_DGTM_MNBST: 'avisDgtmMNBSTRendu' }
                    },
                    avisDgtmMNBSTRendu: { type: 'final' }
                  }
                },
                avisDGTMAUCULMachine: {
                  initial: 'avisDGTMAUCULARendre',
                  states: {
                    avisDGTMAUCULARendre: {
                      on: { RENDRE_AVIS_DGTMAUCUL: 'avisDGTMAUCULRendu' }
                    },
                    avisDGTMAUCULRendu: { type: 'final' }
                  }
                },
                avisDirectionEntrepriseConcurrenceConsommationTravailEmploiMachine:
                  {
                    initial:
                      'avisDirectionEntrepriseConcurrenceConsommationTravailEmploiARendre',
                    states: {
                      avisDirectionEntrepriseConcurrenceConsommationTravailEmploiARendre:
                        {
                          on: {
                            RENDRE_AVIS_DIRECTION_ENTREPRISE_CONCURRENCE_CONSOMMATION_TRAVAIL_EMPLOI:
                              'avisDirectionEntrepriseConcurrenceConsommationTravailEmploiRendu'
                          }
                        },
                      avisDirectionEntrepriseConcurrenceConsommationTravailEmploiRendu:
                        { type: 'final' }
                    }
                  },
                avisDirectionAlimentationAgricultureForetMachine: {
                  initial: 'avisDirectionAlimentationAgricultureForetARendre',
                  states: {
                    avisDirectionAlimentationAgricultureForetARendre: {
                      on: {
                        RENDRE_AVIS_DIRECTION_ALIMENTATION_AGRICULTURE_FORET:
                          'avisDirectionAlimentationAgricultureForetRendu'
                      }
                    },
                    avisDirectionAlimentationAgricultureForetRendu: {
                      type: 'final'
                    }
                  }
                },
                avisDirectionRegionaleAffairesCulturellesMachine: {
                  initial: 'avisDirectionRegionaleAffairesCulturellesARendre',
                  states: {
                    avisDirectionRegionaleAffairesCulturellesARendre: {
                      on: {
                        RENDRE_AVIS_DIRECTION_REGIONALE_AFFAIRES_CULTURELLES:
                          'avisDirectionRegionaleAffairesCulturellesRendu'
                      }
                    },
                    avisDirectionRegionaleAffairesCulturellesRendu: {
                      type: 'final'
                    }
                  }
                },
                avisAgenceRegionaleSanteMachine: {
                  initial: 'avisAgenceRegionaleSanteARendre',
                  states: {
                    avisAgenceRegionaleSanteARendre: {
                      on: {
                        RENDRE_AVIS_AGENCE_REGIONALE_SANTE:
                          'avisAgenceRegionaleSanteRendu'
                      }
                    },
                    avisAgenceRegionaleSanteRendu: { type: 'final' }
                  }
                },
                avisDirectionRegionaleFinancesPubliquesMachine: {
                  initial: 'avisDirectionRegionaleFinancesPubliquesARendre',
                  states: {
                    avisDirectionRegionaleFinancesPubliquesARendre: {
                      on: {
                        RENDRE_AVIS_DIRECTION_REGIONALE_FINANCES_PUBLIQUES:
                          'avisDirectionRegionaleFinancesPubliquesRendu'
                      }
                    },
                    avisDirectionRegionaleFinancesPubliquesRendu: {
                      type: 'final'
                    }
                  }
                },
                avisCaisseGeneraleDeSecuriteSocialeMachine: {
                  initial: 'avisCaisseGeneraleDeSecuriteSocialeARendre',
                  states: {
                    avisCaisseGeneraleDeSecuriteSocialeARendre: {
                      on: {
                        RENDRE_AVIS_CAISSE_GENERALE_DE_SECURITE_SOCIALE:
                          'avisCaisseGeneraleDeSecuriteSocialeRendu'
                      }
                    },
                    avisCaisseGeneraleDeSecuriteSocialeRendu: { type: 'final' }
                  }
                },
                avisOfficeNationalDesForetsMachine: {
                  initial: 'avisOfficeNationalDesForetsARendre',
                  states: {
                    avisOfficeNationalDesForetsARendre: {
                      on: {
                        RENDRE_AVIS_OFFICE_NATIONAL_DES_FORETS:
                          'avisOfficeNationalDesForetsRendu'
                      }
                    },
                    avisOfficeNationalDesForetsRendu: { type: 'final' }
                  }
                },
                avisGendarmerieNationaleMachine: {
                  initial: 'avisGendarmerieNationaleARendre',
                  states: {
                    avisGendarmerieNationaleARendre: {
                      on: {
                        RENDRE_AVIS_GENDARMERIE_NATIONALE:
                          'avisGendarmerieNationaleRendu'
                      }
                    },
                    avisGendarmerieNationaleRendu: { type: 'final' }
                  }
                },
                avisEtatMajorOrpaillageEtPecheIlliciteMachine: {
                  initial: 'avisEtatMajorOrpaillageEtPecheIlliciteARendre',
                  states: {
                    avisEtatMajorOrpaillageEtPecheIlliciteARendre: {
                      on: {
                        RENDRE_AVIS_ETAT_MAJOR_ORPAILLAGE_ET_PECHE_ILLICITE:
                          'avisEtatMajorOrpaillageEtPecheIlliciteRendu'
                      }
                    },
                    avisEtatMajorOrpaillageEtPecheIlliciteRendu: {
                      type: 'final'
                    }
                  }
                }
              },
              onDone: 'avisDesServicesRendus'
            },
            avisDesServicesRendus: { type: 'final' }
          }
        }
      }
    },
    avisDREALARendre: {
      tags: [tags.responsable[ADMINISTRATION_IDS['DGTM - GUYANE']]],
      on: {
        RENDRE_AVIS_DREAL:
          'saisineOuAvisCommissionDepartementaleDesMinesARendre'
      }
    },
    saisineOuAvisCommissionDepartementaleDesMinesARendre: {
      id: 'saisineOuAvisCommissionDepartementaleDesMinesARendre',
      on: {
        FAIRE_SAISINE_COMMISSION_DEPARTEMENTALE_DES_MINES:
          'avisCommissionDepartementaleDesMinesARendre',
        RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES_AJOURNE:
          'avisDREALARendre',
        RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES:
          'saisineAutoriteSignataireOuDecisionAdministrationARendre'
      }
    },
    avisCommissionDepartementaleDesMinesARendre: {
      on: {
        RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES_AJOURNE:
          'avisDREALARendre',
        RENDRE_AVIS_COMMISSION_DEPARTEMENTALE_DES_MINES:
          'saisineAutoriteSignataireOuDecisionAdministrationARendre'
      }
    },
    saisineAutoriteSignataireOuDecisionAdministrationARendre: {
      on: {
        FAIRE_SAISINE_AUTORITE_SIGNATAIRE: 'decisionAdministrationARendre',
        RENDRE_DECISION_ADMINISTRATION_ACCEPTE: {
          target: 'decisionAdministrationRendue',
          actions: assign<
            AxmContext,
            { type: 'RENDRE_DECISION_ADMINISTRATION_ACCEPTE' }
          >({
            demarcheStatut: DemarchesStatutsIds.Accepte
          })
        },
        RENDRE_DECISION_ADMINISTRATION_REJETE: {
          target: 'decisionAdministrationRendue',
          actions: assign<
            AxmContext,
            { type: 'RENDRE_DECISION_ADMINISTRATION_REJETE' }
          >({
            demarcheStatut: DemarchesStatutsIds.Rejete
          })
        }
      }
    },
    decisionAdministrationARendre: {
      on: {
        RENDRE_DECISION_ADMINISTRATION_ACCEPTE: {
          target: 'decisionAdministrationRendue',
          actions: assign<
            AxmContext,
            { type: 'RENDRE_DECISION_ADMINISTRATION_ACCEPTE' }
          >({
            demarcheStatut: DemarchesStatutsIds.Accepte
          })
        },
        RENDRE_DECISION_ADMINISTRATION_REJETE: {
          target: 'decisionAdministrationRendue',
          actions: assign<
            AxmContext,
            { type: 'RENDRE_DECISION_ADMINISTRATION_REJETE' }
          >({
            demarcheStatut: DemarchesStatutsIds.Rejete
          })
        }
      }
    },
    decisionAdministrationRendue: {
      on: {
        RENDRE_DECISION_ABROGATION: 'decisionAbrogationFaite',
        RENDRE_DECISION_RETRAIT: 'decisionRetraitFaite',
        RENDRE_DECISION_ANNULATION_PAR_JUGE_ADMINISTRATIF: {
          target: 'decisionAnnulationParJugeAdministratifRendu'
        },
        NOTIFIER_DEMANDEUR: { target: 'publicationsEtNotificationsMachine' },
        PUBLIER_DECISIONS_RECUEIL_ACTES_ADMINISTRATIFS:
          'publicationsEtNotificationsMachine',
        PUBLIER_DANS_UN_JOURNAL_LOCAL_OU_NATIONAL:
          'publicationsEtNotificationsMachine',
        NOTIFIER_COLLECTIVITES_LOCALES: 'publicationsEtNotificationsMachine'
      }
    },
    publicationsEtNotificationsMachine: {
      type: 'parallel',
      states: {
        notificationDuDemadeurMachine: {
          initial: 'notificationDuDemandeurAFaire',
          states: {
            notificationDuDemandeurAFaire: {
              always: {
                target: 'notificationDuDemandeurFaite',
                cond: (_context, _event, meta) => {
                  return meta.state.history?.event.type === 'NOTIFIER_DEMANDEUR'
                }
              },
              on: { NOTIFIER_DEMANDEUR: 'notificationDuDemandeurFaite' }
            },
            notificationDuDemandeurFaite: { type: 'final' }
          }
        },
        publicationDecisionsRecueilActesAdministratifsMachine: {
          initial: 'publicationDecisionsRecueilActesAdministratifsAFaire',
          states: {
            publicationDecisionsRecueilActesAdministratifsAFaire: {
              always: {
                target: 'publicationDecisionsRecueilActesAdministratifsFaite',
                cond: (_context, _event, meta) => {
                  return (
                    meta.state.history?.event.type ===
                    'PUBLIER_DECISIONS_RECUEIL_ACTES_ADMINISTRATIFS'
                  )
                }
              },
              on: {
                PUBLIER_DECISIONS_RECUEIL_ACTES_ADMINISTRATIFS:
                  'publicationDecisionsRecueilActesAdministratifsFaite'
              }
            },
            publicationDecisionsRecueilActesAdministratifsFaite: {
              type: 'final'
            }
          }
        },
        publicationDansUnJournalLocalOuNationalMachine: {
          initial: 'publicationDansUnJournalLocalOuNationalAFaire',
          states: {
            publicationDansUnJournalLocalOuNationalAFaire: {
              always: {
                target: 'publicationDansUnJournalLocalOuNationalFaite',
                cond: (_context, _event, meta) => {
                  return (
                    meta.state.history?.event.type ===
                    'PUBLIER_DANS_UN_JOURNAL_LOCAL_OU_NATIONAL'
                  )
                }
              },
              on: {
                PUBLIER_DANS_UN_JOURNAL_LOCAL_OU_NATIONAL:
                  'publicationDansUnJournalLocalOuNationalFaite'
              }
            },
            publicationDansUnJournalLocalOuNationalFaite: { type: 'final' }
          }
        },
        notificationDesCollectivitesLocalesMachine: {
          initial: 'notificationDesCollectivitesLocalesAFaire',
          states: {
            notificationDesCollectivitesLocalesAFaire: {
              always: {
                target: 'notificationDesCollectivitesLocalesFaite',
                cond: (_context, _event, meta) => {
                  return (
                    meta.state.history?.event.type ===
                    'NOTIFIER_COLLECTIVITES_LOCALES'
                  )
                }
              },
              on: {
                NOTIFIER_COLLECTIVITES_LOCALES:
                  'notificationDesCollectivitesLocalesFaite'
              }
            },
            notificationDesCollectivitesLocalesFaite: { type: 'final' }
          }
        }
      }
    },
    decisionAnnulationParJugeAdministratifAFaire: {
      on: {
        RENDRE_DECISION_ANNULATION_PAR_JUGE_ADMINISTRATIF:
          'decisionAnnulationParJugeAdministratifRendu'
      }
    },
    classementSansSuiteAFaire: {
      id: 'classementSansSuiteAFaire',
      tags: [tags.responsable[ADMINISTRATION_IDS['DGTM - GUYANE']]],
      on: {
        FAIRE_CLASSEMENT_SANS_SUITE: 'classementSansSuiteRendu'
      }
    },
    decisionAbrogationFaite: { type: 'final' },
    decisionRetraitFaite: { type: 'final' },
    decisionAnnulationParJugeAdministratifRendu: {
      type: 'final',
      entry: assign<AxmContext>({ demarcheStatut: DemarchesStatutsIds.Rejete })
    },
    desistementDuDemandeurRendu: {
      type: 'final',
      entry: assign<AxmContext>({
        demarcheStatut: DemarchesStatutsIds.Desiste,
        visibilite: 'publique'
      })
    },
    classementSansSuiteRendu: {
      type: 'final',
      entry: assign<AxmContext>({
        demarcheStatut: DemarchesStatutsIds.ClasseSansSuite,
        visibilite: 'publique'
      })
    }
  }
})
