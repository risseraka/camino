import { IHeritageProps, IFields, IHeritageContenu } from '../../../types'
import { userSuper } from '../../user-super'
import { titreEtapeGet } from '../../queries/titres-etapes'

const heritagePropsFormat = async (heritageProps: IHeritageProps) => {
  for (const propId of Object.keys(heritageProps)) {
    if (heritageProps[propId]?.etapeId) {
      const fields = { type: { id: {} } } as IFields
      if (propId === 'points') {
        fields.points = { references: { id: {} } }
      } else if (['titulaires', 'amodiataires'].includes(propId)) {
        fields[propId] = { id: {} }
      }

      const titreEtape = await titreEtapeGet(
        heritageProps[propId].etapeId!,
        { fields },
        userSuper
      )

      heritageProps[propId].etape = titreEtape
    }
  }

  return heritageProps
}

const heritageContenuFormat = async (heritageContenu: IHeritageContenu) => {
  const fields = { type: { id: {} } } as IFields
  for (const sectionId of Object.keys(heritageContenu)) {
    if (heritageContenu[sectionId]) {
      for (const elementId of Object.keys(heritageContenu[sectionId])) {
        if (heritageContenu[sectionId][elementId].etapeId) {
          const titreEtape = await titreEtapeGet(
            heritageContenu[sectionId][elementId].etapeId!,
            { fields },
            userSuper
          )

          heritageContenu[sectionId][elementId].etape = titreEtape
        }
      }
    }
  }

  return heritageContenu
}

export { heritagePropsFormat, heritageContenuFormat }
