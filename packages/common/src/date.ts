export const datesDiffInDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes())

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))
}

export const daysBetween = (a: CaminoDate, b: CaminoDate) => {
  return datesDiffInDays(new Date(a), new Date(b))
}

export type CaminoDate = string & { __camino: 'Date' }

const checkValidCaminoDate = (str: string): str is CaminoDate => {
  return str.match(/^\d{4}-\d{2}-\d{2}$/) !== null
}

export const toCaminoDate = (date: Date | string): CaminoDate => {
  if (typeof date === 'string') {
    if (checkValidCaminoDate(date)) {
      return date
    } else {
      throw new Error(`Invalid date string: ${date}`)
    }
  } else {
    // Use the Sweden locale because it uses the ISO format
    const dateString = date.toLocaleDateString('sv')
    if (checkValidCaminoDate(dateString)) {
      return dateString
    }
  }
  throw new Error(`Shouldn't get here (invalid toDateStr provided): ${date}`)
}
export type CaminoAnnee = string & { __camino: 'Annee' }

export const getAnnee = (date: CaminoDate): CaminoAnnee => {
  return valideAnnee(date.substring(0, 4))
}

export const getCurrentAnnee = () => getAnnee(toCaminoDate(new Date()))

export const isAnnee = (annee: string): annee is CaminoAnnee => {
  return annee.match(/^\d{4}$/) !== null
}

export function checkValideAnnee(annee: string): asserts annee is CaminoAnnee {
  if (!isAnnee(annee)) {
    throw new Error(`l'année ${annee} n'est pas une année valide`)
  }
}

export function valideAnnee(annee: string | number): CaminoAnnee {
  if (typeof annee === 'number') {
    return valideAnnee(annee.toString(10))
  }
  checkValideAnnee(annee)

  return annee
}
