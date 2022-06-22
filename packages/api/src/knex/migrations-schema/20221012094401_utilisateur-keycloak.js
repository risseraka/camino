exports.up = knex =>
  knex.schema.alterTable('utilisateurs', function (table) {
    table.dropColumn('mot_de_passe')
    table.dropColumn('refresh_token')
  })

exports.down = () => ({})
