import { ITitreActivite } from '../../types'

import { titresActivitesUpdate } from './titres-activites-update'
import { titreActiviteTypeCheck } from '../utils/titre-activite-type-check'
import { anneesBuild } from '../../tools/annees-build'
import { titresActivitesUpsert } from '../../database/queries/titres-activites'
import { titresGet } from '../../database/queries/titres'
import { activitesTypesGet } from '../../database/queries/metas-activites'
import { titreActivitesBuild } from '../rules/titre-activites-build'

import {
  titresToutesActivites,
  titreActivitesTypes,
  titresSansActivite
} from './__mocks__/titres-activites-update-titres'
import {
  emailsSend,
  emailsWithTemplateSend
} from '../../tools/api-mailjet/emails'
import { EmailTemplateId } from '../../tools/api-mailjet/types'

jest.mock('../../database/queries/titres', () => ({
  titresGet: jest.fn()
}))

jest.mock('../../database/queries/metas-activites', () => ({
  activitesTypesGet: jest.fn()
}))

jest.mock('../utils/titre-activite-type-check', () => ({
  __esModule: true,
  titreActiviteTypeCheck: jest.fn()
}))

jest.mock('../../tools/annees-build', () => ({
  __esModule: true,
  anneesBuild: jest.fn()
}))

jest.mock('../../database/queries/titres-activites', () => ({
  __esModule: true,
  titresActivitesUpsert: jest.fn().mockResolvedValue(true)
}))

jest.mock('../rules/titre-activites-build', () => ({
  __esModule: true,
  titreActivitesBuild: jest.fn().mockResolvedValue(true)
}))

jest.mock('../../tools/api-mailjet/emails', () => ({
  __esModule: true,
  emailsSend: jest.fn().mockImplementation(a => a),
  emailsWithTemplateSend: jest.fn().mockImplementation(a => a)
}))

const titresGetMock = jest.mocked(titresGet, true)
const activitesTypesGetMock = jest.mocked(activitesTypesGet, true)
const titreActiviteTypeCheckMock = jest.mocked(titreActiviteTypeCheck, true)
const anneesBuildMock = jest.mocked(anneesBuild, true)
const titreActivitesBuildMock = jest.mocked(titreActivitesBuild, true)
const emailsSendMock = jest.mocked(emailsSend, true)
const emailsWithTemplateSendMock = jest.mocked(emailsWithTemplateSend, true)

console.info = jest.fn()

describe("activités d'un titre", () => {
  test('met à jour un titre sans activité', async () => {
    titresGetMock.mockResolvedValue(titresSansActivite)
    activitesTypesGetMock.mockResolvedValue(titreActivitesTypes)
    titreActiviteTypeCheckMock.mockReturnValue(true)
    anneesBuildMock.mockReturnValue([2018])
    titreActivitesBuildMock.mockReturnValue([
      { titreId: titresSansActivite[0].id }
    ] as ITitreActivite[])

    const titresActivitesNew = await titresActivitesUpdate()

    expect(titresActivitesNew.length).toEqual(1)

    expect(titreActiviteTypeCheck).toHaveBeenCalledTimes(
      titresSansActivite.length
    )
    expect(titresActivitesUpsert).toHaveBeenCalled()
    expect(titreActivitesBuild).toHaveBeenCalled()
    expect(emailsWithTemplateSendMock).toHaveBeenCalledWith(
      ['email'],
      EmailTemplateId.ACTIVITES_NOUVELLES,
      expect.any(Object)
    )
  })

  test('ne met pas à jour un titre possédant déjà des activités', async () => {
    titresGetMock.mockResolvedValue(titresToutesActivites)
    activitesTypesGetMock.mockResolvedValue(titreActivitesTypes)
    titreActiviteTypeCheckMock.mockReturnValue(true)
    anneesBuildMock.mockReturnValue([2018])
    titreActivitesBuildMock.mockReturnValue([])

    const titresActivitesNew = await titresActivitesUpdate()

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeCheck).toHaveBeenCalledTimes(1)
    expect(titreActivitesBuild).toHaveBeenCalled()
    expect(titresActivitesUpsert).not.toHaveBeenCalled()
    expect(emailsSendMock).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre ne correspondant à aucun type d'activité", async () => {
    titresGetMock.mockResolvedValue(titresSansActivite)
    activitesTypesGetMock.mockResolvedValue(titreActivitesTypes)
    titreActiviteTypeCheckMock.mockReturnValue(false)
    anneesBuildMock.mockReturnValue([2018])

    const titresActivitesNew = await titresActivitesUpdate()

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeCheck).toHaveBeenCalledTimes(1)
    expect(titreActivitesBuild).not.toHaveBeenCalled()
    expect(titresActivitesUpsert).not.toHaveBeenCalled()
  })

  test('ne met pas à jour de titre si les activités ne sont valables sur aucune année', async () => {
    titresGetMock.mockResolvedValue(titresSansActivite)
    activitesTypesGetMock.mockResolvedValue(titreActivitesTypes)
    titreActiviteTypeCheckMock.mockReturnValue(false)
    anneesBuildMock.mockReturnValue([])

    const titresActivitesNew = await titresActivitesUpdate()

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeCheck).not.toHaveBeenCalled()
    expect(titreActivitesBuild).not.toHaveBeenCalled()
    expect(titresActivitesUpsert).not.toHaveBeenCalled()
  })
})
