import { Definition } from '../definition'

export const DOCUMENTS_TYPES_IDS = {
  "Avis d'un service de l'administration centrale": 'aac',
  'Accord du propriétaire du sol ou du gestionnaire': 'acc',
  'Avis de la commission départementale des mines': 'acd',
  "Avis du conseil général de l'économie (CGE)": 'acg',
  'Avis des services civils et militaires': 'acm',
  "Accusé de réception d'une demande": 'acr',
  'Avis du directeur régional chargé des mines': 'adr',
  "Avis d'enquête publique": 'aep',
  "Arrêté autorisant l'ouverture de travaux miniers": 'aot',
  'Arrêté de second donné acte (AP2)': 'apd',
  'Avis du préfet': 'apf',
  'Arrêté de police des mines': 'apm',
  'Arrêté de premier donné acte (AP1)': 'apu',
  'Arrêté de refus ': 'are',
  'Arrêté ministériel': 'arm',
  'Arrêté préfectoral': 'arp',
  Arrêté: 'arr',
  'Attestation fiscale': 'atf',
  'Avis de mise en concurrence': 'avc',
  Avenant: 'ave',
  Avis: 'avi',
  '3 derniers bilans et comptes de résultats': 'bil',
  "Contrat d'amodiation": 'cam',
  'Documents cartographiques': 'car',
  'Courrier de demande de compléments': 'cco',
  'Cahier des charges': 'cdc',
  'Courrier de notification de la recevabilité': 'cnr',
  Contrat: 'cnt',
  'Compléments au dossier de demande': 'cod',
  Convention: 'con',
  Courrier: 'cou',
  'Courrier de saisine du préfet ': 'csp',
  'Curriculum vitae': 'cur',
  Déclaration: 'dcl',
  'Déclarations bancaires ou cautions appropriées': 'deb',
  Décret: 'dec',
  Décision: 'dei',
  'Décision cas par cas': 'dep',
  'Dossier "Loi sur l\'eau"': 'doe',
  'Dossier de demande': 'dom',
  Dossier: 'dos',
  "Extrait du registre des délibérations de la section des travaux public du Conseil d'Etat": 'erd',
  Facture: 'fac',
  'Fiche de complétude': 'fic',
  'Fiche de présentation': 'fip',
  'Formulaire de demande': 'for',
  'Identification de matériel': 'idm',
  'Justificatif d’adhésion à la charte des bonnes pratiques': 'jac',
  'Justificatif des capacités financières': 'jcf',
  'Justificatif des capacités techniques': 'jct',
  'Justification d’existence du gisement': 'jeg',
  "Justificatif d'identité": 'jid',
  'Justificatif de paiement': 'jpa',
  Kbis: 'kbi',
  "Lettre de saisine des services de l'administration centrale": 'lac',
  "Lettre de saisine du conseil d'Etat": 'lce',
  "Lettre de saisine du conseil général de l'économie (CGE)": 'lcg',
  'Lettre de saisine des services civils et militaires': 'lcm',
  'Lettre de demande': 'lem',
  Lettre: 'let',
  'Liste des travaux antérieurs': 'lis',
  'Lettre de saisine du préfet': 'lpf',
  'Mesures prévues pour réhabiliter le site ': 'mes',
  "Méthodes pour l'exécution des travaux": 'met',
  Motif: 'mot',
  "Note à l'autorité signataire": 'nas',
  'Notification de demande concurrente': 'ndc',
  'Notification de décision': 'ndd',
  'Notice d’impact renforcée': 'nir',
  'Note interne signalée': 'nis',
  "Notice d'incidence": 'noi',
  Notes: 'not',
  'Ordre du jour de la commission départementale des mines': 'ocd',
  'Ordonnance du Roi': 'odr',
  Ordonnance: 'ord',
  Plan: 'pla',
  'Programme des travaux ': 'prg',
  'Projet de prescriptions': 'pro',
  'Publication au JORF': 'pub',
  'PV de récolement': 'pvr',
  'Rapport de l’administration centrale chargé des mines': 'rac',
  'Rapport DREAL': 'rad',
  Rapport: 'rap',
  'Rapport du commissaire enquêteur': 'rce',
  'Rapport de recevabilité': 'rcr',
  'Rapport de la direction régionale chargée des mines': 'rdr',
  "Récépissé de déclaration d'ouverture des travaux miniers": 'rdt',
  'Récépissé "Loi sur l\'eau"': 'rec',
  "Rapport environnemental d'exploration": 'ree',
  'Références professionnelles ': 'ref',
  "Rapport financier d'exploration": 'rfe',
  "rapport annuel d'exploitation": 'rgr',
  'Rapport d’intensité d’exploration': 'rie',
  "Rapport social et économique d'exploration": 'rse',
  'Schéma de pénétration du massif forestier': 'sch',
  'Avis de situation au répertoire Sirene': 'sir'
} as const

export type DocumentsTypeId = typeof DOCUMENTS_TYPES_IDS[keyof typeof DOCUMENTS_TYPES_IDS]
export type DocumentsType<T = DocumentsTypeId> = Omit<Definition<T>, 'description' | 'ordre'> & { description?: string }
export const DocumentsTypes: { [key in DocumentsTypeId]: DocumentsType<key> } = {
  aac: {
    id: 'aac',
    nom: "Avis d'un service de l'administration centrale"
  },
  acc: {
    id: 'acc',
    nom: 'Accord du propriétaire du sol ou du gestionnaire'
  },
  acd: {
    id: 'acd',
    nom: 'Avis de la commission départementale des mines'
  },
  acg: {
    id: 'acg',
    nom: "Avis du conseil général de l'économie (CGE)"
  },
  acm: {
    id: 'acm',
    nom: 'Avis des services civils et militaires'
  },
  acr: {
    id: 'acr',
    nom: "Accusé de réception d'une demande"
  },
  adr: {
    id: 'adr',
    nom: 'Avis du directeur régional chargé des mines'
  },
  aep: {
    id: 'aep',
    nom: "Avis d'enquête publique"
  },
  aot: {
    id: 'aot',
    nom: "Arrêté autorisant l'ouverture de travaux miniers"
  },
  apd: {
    id: 'apd',
    nom: 'Arrêté de second donné acte (AP2)'
  },
  apf: {
    id: 'apf',
    nom: 'Avis du préfet'
  },
  apm: {
    id: 'apm',
    nom: 'Arrêté de police des mines'
  },
  apu: {
    id: 'apu',
    nom: 'Arrêté de premier donné acte (AP1)'
  },
  are: {
    id: 'are',
    nom: 'Arrêté de refus '
  },
  arm: {
    id: 'arm',
    nom: 'Arrêté ministériel'
  },
  arp: {
    id: 'arp',
    nom: 'Arrêté préfectoral'
  },
  arr: {
    id: 'arr',
    nom: 'Arrêté'
  },
  atf: {
    id: 'atf',
    nom: 'Attestation fiscale'
  },
  avc: {
    id: 'avc',
    nom: 'Avis de mise en concurrence'
  },
  ave: {
    id: 'ave',
    nom: 'Avenant'
  },
  avi: {
    id: 'avi',
    nom: 'Avis'
  },
  bil: {
    id: 'bil',
    nom: '3 derniers bilans et comptes de résultats'
  },
  cam: {
    id: 'cam',
    nom: "Contrat d'amodiation"
  },
  car: {
    id: 'car',
    nom: 'Documents cartographiques'
  },
  cco: {
    id: 'cco',
    nom: 'Courrier de demande de compléments'
  },
  cdc: {
    id: 'cdc',
    nom: 'Cahier des charges'
  },
  cnr: {
    id: 'cnr',
    nom: 'Courrier de notification de la recevabilité'
  },
  cnt: {
    id: 'cnt',
    nom: 'Contrat'
  },
  cod: {
    id: 'cod',
    nom: 'Compléments au dossier de demande'
  },
  con: {
    id: 'con',
    nom: 'Convention'
  },
  cou: {
    id: 'cou',
    nom: 'Courrier'
  },
  csp: {
    id: 'csp',
    nom: 'Courrier de saisine du préfet '
  },
  cur: {
    id: 'cur',
    nom: 'Curriculum vitae'
  },
  dcl: {
    id: 'dcl',
    nom: 'Déclaration'
  },
  deb: {
    id: 'deb',
    nom: 'Déclarations bancaires ou cautions appropriées'
  },
  dec: {
    id: 'dec',
    nom: 'Décret'
  },
  dei: {
    id: 'dei',
    nom: 'Décision'
  },
  dep: {
    id: 'dep',
    nom: 'Décision cas par cas'
  },
  doe: {
    id: 'doe',
    nom: 'Dossier "Loi sur l\'eau"'
  },
  dom: {
    id: 'dom',
    nom: 'Dossier de demande'
  },
  dos: {
    id: 'dos',
    nom: 'Dossier'
  },
  erd: {
    id: 'erd',
    nom: "Extrait du registre des délibérations de la section des travaux public du Conseil d'Etat"
  },
  fac: {
    id: 'fac',
    nom: 'Facture'
  },
  fic: {
    id: 'fic',
    nom: 'Fiche de complétude'
  },
  fip: {
    id: 'fip',
    nom: 'Fiche de présentation'
  },
  for: {
    id: 'for',
    nom: 'Formulaire de demande'
  },
  idm: {
    id: 'idm',
    nom: 'Identification de matériel'
  },
  jac: {
    id: 'jac',
    nom: 'Justificatif d’adhésion à la charte des bonnes pratiques'
  },
  jcf: {
    id: 'jcf',
    nom: 'Justificatif des capacités financières'
  },
  jct: {
    id: 'jct',
    nom: 'Justificatif des capacités techniques'
  },
  jeg: {
    id: 'jeg',
    nom: 'Justification d’existence du gisement'
  },
  jid: {
    id: 'jid',
    nom: "Justificatif d'identité"
  },
  jpa: {
    id: 'jpa',
    nom: 'Justificatif de paiement'
  },
  kbi: {
    id: 'kbi',
    nom: 'Kbis'
  },
  lac: {
    id: 'lac',
    nom: "Lettre de saisine des services de l'administration centrale"
  },
  lce: {
    id: 'lce',
    nom: "Lettre de saisine du conseil d'Etat"
  },
  lcg: {
    id: 'lcg',
    nom: "Lettre de saisine du conseil général de l'économie (CGE)"
  },
  lcm: {
    id: 'lcm',
    nom: 'Lettre de saisine des services civils et militaires'
  },
  lem: {
    id: 'lem',
    nom: 'Lettre de demande'
  },
  let: {
    id: 'let',
    nom: 'Lettre'
  },
  lis: {
    id: 'lis',
    nom: 'Liste des travaux antérieurs',
    description: 'Liste des travaux auxquels le demandeur a participé au cours des 3 dernières années'
  },
  lpf: {
    id: 'lpf',
    nom: 'Lettre de saisine du préfet'
  },
  mes: {
    id: 'mes',
    nom: 'Mesures prévues pour réhabiliter le site '
  },
  met: {
    id: 'met',
    nom: "Méthodes pour l'exécution des travaux"
  },
  mot: {
    id: 'mot',
    nom: 'Motif'
  },
  nas: {
    id: 'nas',
    nom: "Note à l'autorité signataire"
  },
  ndc: {
    id: 'ndc',
    nom: 'Notification de demande concurrente'
  },
  ndd: {
    id: 'ndd',
    nom: 'Notification de décision'
  },
  nir: {
    id: 'nir',
    nom: 'Notice d’impact renforcée'
  },
  nis: {
    id: 'nis',
    nom: 'Note interne signalée'
  },
  noi: {
    id: 'noi',
    nom: "Notice d'incidence"
  },
  not: {
    id: 'not',
    nom: 'Notes'
  },
  ocd: {
    id: 'ocd',
    nom: 'Ordre du jour de la commission départementale des mines'
  },
  odr: {
    id: 'odr',
    nom: 'Ordonnance du Roi'
  },
  ord: {
    id: 'ord',
    nom: 'Ordonnance'
  },
  pla: {
    id: 'pla',
    nom: 'Plan'
  },
  prg: {
    id: 'prg',
    nom: 'Programme des travaux '
  },
  pro: {
    id: 'pro',
    nom: 'Projet de prescriptions'
  },
  pub: {
    id: 'pub',
    nom: 'Publication au JORF'
  },
  pvr: {
    id: 'pvr',
    nom: 'PV de récolement'
  },
  rac: {
    id: 'rac',
    nom: 'Rapport de l’administration centrale chargé des mines'
  },
  rad: {
    id: 'rad',
    nom: 'Rapport DREAL'
  },
  rap: {
    id: 'rap',
    nom: 'Rapport'
  },
  rce: {
    id: 'rce',
    nom: 'Rapport du commissaire enquêteur'
  },
  rcr: {
    id: 'rcr',
    nom: 'Rapport de recevabilité'
  },
  rdr: {
    id: 'rdr',
    nom: 'Rapport de la direction régionale chargée des mines'
  },
  rdt: {
    id: 'rdt',
    nom: "Récépissé de déclaration d'ouverture des travaux miniers"
  },
  rec: {
    id: 'rec',
    nom: 'Récépissé "Loi sur l\'eau"'
  },
  ree: {
    id: 'ree',
    nom: "Rapport environnemental d'exploration"
  },
  ref: {
    id: 'ref',
    nom: 'Références professionnelles ',
    description: 'Références professionnelles du demandeur ou celles des cadres chargés du suivi et de la conduite des travaux'
  },
  rfe: {
    id: 'rfe',
    nom: "Rapport financier d'exploration"
  },
  rgr: {
    id: 'rgr',
    nom: "rapport annuel d'exploitation"
  },
  rie: {
    id: 'rie',
    nom: 'Rapport d’intensité d’exploration'
  },
  rse: {
    id: 'rse',
    nom: "Rapport social et économique d'exploration"
  },
  sch: {
    id: 'sch',
    nom: 'Schéma de pénétration du massif forestier'
  },
  sir: {
    id: 'sir',
    nom: 'Avis de situation au répertoire Sirene'
  }
}

export const documentsTypes = Object.values(DocumentsTypes)

export const documentsTypesEntreprises: DocumentsTypeId[] = ['atf', 'cur', 'idm', 'jcf', 'jct', 'jid', 'kbi', 'sir']
