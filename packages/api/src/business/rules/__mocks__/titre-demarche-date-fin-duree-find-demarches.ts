import { ITitreDemarche } from '../../../types'
import { newDemarcheId } from '../../../database/models/_format/id-create'

const titreDemarchesOctDateFin = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2038-03-11',
        duree: 50 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2013-03-11'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctDateDebut = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2038-03-11',
        duree: 25 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateDebut: '2013-03-11',
        duree: 10 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctDureeZero = [
  {
    id: newDemarcheId('h-cx-courdemanges-1988-oct01'),
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 0,
        points: []
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctIhiDureeZero = [
  {
    id: newDemarcheId('h-cx-courdemanges-1988-oct01'),
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-ihi01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'ihi',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 0,
        points: []
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctPasDeDpu = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctDpuFirst = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctNiDpuNiDex = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'mdp',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctProDuree = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2010-05-23',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2010-05-21',
        duree: 25 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2010-03-11',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctSansDateFinProDuree = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-pro01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        duree: 50 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctRetDateFin = [
  {
    id: 'h-cx-courdemanges-1988-ret01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ret',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ret01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ret01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-ret01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ret01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2200-03-11'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2013-03-11',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctRetDate = [
  {
    id: 'h-cx-courdemanges-1988-ret01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ret',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ret01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ret01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-ret01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ret01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        duree: 50 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctRetNoDex = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'ind',
    ordre: 3
  },
  {
    id: 'h-cx-courdemanges-1988-ret01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ret',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ret01-mfr01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ret01'),
        typeId: 'mfr',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        duree: 50 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesRenPoints = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ren01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06',
        points: [1, 2, 3]
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-oct01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesRenPointsVideDex = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ren01'),
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesRenPointsVideNiDpuNiDex = [
  {
    id: newDemarcheId('h-cx-courdemanges-1988-ren01'),
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-mfr01',
        titreDemarcheId: newDemarcheId('h-cx-courdemanges-1988-ren01'),
        typeId: 'mfr',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06',
        points: []
      }
    ]
  }
] as ITitreDemarche[]

export {
  titreDemarchesOctDateFin,
  titreDemarchesOctDateDebut,
  titreDemarchesOctDureeZero,
  titreDemarchesOctIhiDureeZero,
  titreDemarchesOctPasDeDpu,
  titreDemarchesOctDpuFirst,
  titreDemarchesOctNiDpuNiDex,
  titreDemarchesOctProDuree,
  titreDemarchesOctSansDateFinProDuree,
  titreDemarchesOctRetDateFin,
  titreDemarchesOctRetDate,
  titreDemarchesOctRetNoDex,
  titreDemarchesRenPoints,
  titreDemarchesRenPointsVideDex,
  titreDemarchesRenPointsVideNiDpuNiDex
}
