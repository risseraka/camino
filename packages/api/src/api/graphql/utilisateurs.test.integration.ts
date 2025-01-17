import { app } from '../../../tests/app'
import {
  graphQLCall,
  queryImport,
  tokenCreate
} from '../../../tests/_utils/index'
import { userAdd } from '../../knex/user-add'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { dbManager } from '../../../tests/db-manager'
import { Administrations } from 'camino-common/src/static/administrations'
import { Knex } from 'knex'

console.info = jest.fn()
console.error = jest.fn()
let knex: Knex<any, unknown[]>
beforeAll(async () => {
  knex = await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.reseedDb()
})

afterAll(async () => {
  await dbManager.closeKnex()
})

describe('utilisateurModifier', () => {
  const utilisateurModifierQuery = queryImport('utilisateur-modifier')

  test('ne peut pas modifier un compte (utilisateur anonyme)', async () => {
    const res = await graphQLCall(utilisateurModifierQuery, {
      utilisateur: {
        id: 'test',
        prenom: 'toto-updated',
        nom: 'test-updated',
        email: 'test@camino.local'
      }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut modifier son compte utilisateur', async () => {
    await userAdd(knex, {
      id: 'test',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      role: 'defaut',
      dateCreation: '2022-05-12'
    })

    const token = tokenCreate({ id: 'test' })

    const req = request(app)
      .post('/')
      .send({
        query: utilisateurModifierQuery,
        variables: {
          utilisateur: {
            id: 'test',
            prenom: 'toto-updated',
            nom: 'test-updated',
            email: 'test@camino.local'
          }
        }
      })

    req.cookies = `accessToken=${token}`

    const res = await req

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { utilisateurModifier: { id: 'test' } }
    })
  })

  test('ne peut pas modifier un compte utilisateur avec un email existant', async () => {
    await userAdd(knex, {
      id: 'test1',
      prenom: 'toto1',
      nom: 'test1',
      email: 'test1@camino.local',
      motDePasse: 'mot-de-passe',
      role: 'defaut',
      dateCreation: '2022-05-12'
    })

    await userAdd(knex, {
      id: 'test2',
      prenom: 'toto2',
      nom: 'test2',
      email: 'test2@camino.local',
      motDePasse: 'mot-de-passe',
      role: 'defaut',
      dateCreation: '2022-05-12'
    })

    const res = await graphQLCall(
      utilisateurModifierQuery,
      {
        utilisateur: {
          id: 'test2',
          nom: 'test2',
          prenom: 'toto2',
          email: 'test1@camino.local'
        }
      },
      'super'
    )

    expect(res.body.errors[0].message).toEqual(
      'un utilisateur avec cet email existe déjà'
    )
  })
})

describe('utilisateursCreer', () => {
  const utilisateurCreerQuery = queryImport('utilisateur-creer')

  test("ne peut pas créer de compte sans token ou si le token ne contient pas d'email", async () => {
    const res = await graphQLCall(utilisateurCreerQuery, {
      utilisateur: {
        prenom: 'toto',
        nom: 'test',
        email: 'test@camino.local',
        motDePasse: 'mot-de-passe'
      }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('crée un compte utilisateur si le token contient son email', async () => {
    const token = tokenCreate({ email: 'test@camino.local' })

    const req = request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe'
          }
        }
      })

    req.cookies = `accessToken=${token}`
    const res = await req

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { utilisateurCreer: { prenom: 'toto' } }
    })
  })

  test("en tant que 'defaut', ne peut pas créer de compte 'super'", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          role: 'super'
        }
      },
      'defaut'
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("en tant que 'defaut', ne peut pas créer de compte avec un email différent", async () => {
    const token = tokenCreate({ id: 'defaut', email: 'test@camino.local' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'autre@camino.local',
            motDePasse: 'mot-de-passe'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("en tant que 'super', peut créer un compte utilisateur 'super'", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          role: 'super'
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { utilisateurCreer: { prenom: 'toto' } }
    })
  })

  test("en tant que 'defaut', ne peut pas être associé à une administration", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          administrationId: Administrations['aut-97300-01'].id
        }
      },
      'defaut'
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("en tant qu'admin', peut être associé à une administrations", async () => {
    const administration = Administrations['aut-97300-01']
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'test',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          role: 'admin',
          administrationId: administration.id
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { utilisateurCreer: { prenom: 'test' } }
    })
  })

  test("ne peut pas être associé à une entreprise (utilisateur 'defaut')", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          entreprises: [{ id: 'entreprise' }]
        }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      "le rôle de cet utilisateur ne permet pas de l'associer à une entreprise"
    )
  })

  test("peut être associé à une entreprise (utilisateur 'entreprise')", async () => {
    await knex('entreprises').insert({ id: 'entreprise', nom: 'entre' })

    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          role: 'entreprise',
          entreprises: [{ id: 'entreprise' }]
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { utilisateurCreer: { prenom: 'toto' } }
    })
  })
})

describe('utilisateurSupprimer', () => {
  const utilisateurSupprimerQuery = queryImport('utilisateur-supprimer')

  test('ne peut pas supprimer un compte (utilisateur anonyme)', async () => {
    const res = await graphQLCall(utilisateurSupprimerQuery, { id: 'test' })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut supprimer son compte utilisateur', async () => {
    await userAdd(knex, {
      id: 'test',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      role: 'defaut',
      dateCreation: '2022-05-12'
    })

    const token = tokenCreate({ id: 'test' })

    const req = request(app)
      .post('/')
      .send({
        query: utilisateurSupprimerQuery,
        variables: { id: 'test' }
      })
    req.cookies = `accessToken=${token}`

    const res = await req
    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { utilisateurSupprimer: { id: 'test' } }
    })
  })

  test('peut supprimer un utilisateur (utilisateur super)', async () => {
    const id = 'user-todelete'
    await userAdd(knex, {
      id,
      prenom: 'userToDelete',
      nom: 'test',
      email: 'user-to-delete@camino.local',
      motDePasse: 'mot-de-passe',
      role: 'defaut',
      dateCreation: '2022-05-12'
    })

    const res = await graphQLCall(utilisateurSupprimerQuery, { id }, 'super')

    expect(res.body).toMatchObject({ data: { utilisateurSupprimer: { id } } })
  })

  test('ne peut pas supprimer un utilisateur inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(
      utilisateurSupprimerQuery,
      { id: 'toto' },
      'super'
    )

    expect(res.body.errors[0].message).toMatch(/aucun utilisateur avec cet id/)
  })
})

describe('utilisateurEmailModifier', () => {
  const utilisateurEmailModifierQuery = queryImport(
    'utilisateur-email-modifier'
  )

  const userId = 'test'
  const oldUserEmail = 'test@camino.local'
  const newUserEmail = 'newtest@camino.local'
  const emailToken = jwt.sign(
    { id: userId, email: newUserEmail },
    process.env.JWT_SECRET!
  )
  test('ne peut pas modifier l’email d’un autre utilisateur', async () => {
    const res = await graphQLCall(
      utilisateurEmailModifierQuery,
      { emailToken },
      'super'
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('peut modifier son email', async () => {
    await userAdd(knex, {
      id: userId,
      prenom: 'toto',
      nom: 'test',
      email: oldUserEmail,
      motDePasse: 'mot-de-passe',
      role: 'defaut',
      dateCreation: '2022-05-12'
    })
    const token = tokenCreate({ id: userId })

    const req = request(app).post('/').send({
      query: utilisateurEmailModifierQuery,
      variables: { emailToken }
    })
    req.cookies = `accessToken=${token}`
    const res = await req

    expect(res.body.data.utilisateurEmailModifier.email).toBe(newUserEmail)
  })
})
