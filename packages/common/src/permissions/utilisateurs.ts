import { isSuper, isAdministrationAdmin, isAdministrationEditeur, User } from '../roles'

export const canCreateEntreprise = (user: User): boolean => isSuper(user) || isAdministrationAdmin(user) || isAdministrationEditeur(user)
export const canCreateUtilisateur = (user: User): boolean => isSuper(user) || isAdministrationAdmin(user)
