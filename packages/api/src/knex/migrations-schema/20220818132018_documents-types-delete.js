exports.up = async knex => {
  await knex.schema.alterTable('documents', function (table) {
    table.dropForeign('type_id', 'documents_typeid_foreign')
  })

  await knex.schema.alterTable(
    'activites_types__documents_types',
    function (table) {
      table.dropForeign(
        'document_type_id',
        'activitestypes__documentstypes_documenttypeid_foreign'
      )
    }
  )

  await knex.schema.alterTable(
    'etapes_types__documents_types',
    function (table) {
      table.dropForeign(
        'document_type_id',
        'etapestypes__documentstypes_documenttypeid_foreign'
      )
    }
  )

  await knex.schema.alterTable(
    'etapes_types__justificatifs_types',
    function (table) {
      table.dropForeign(
        'document_type_id',
        'etapestypes__justificatifstypes_documenttypeid_foreign'
      )
    }
  )

  await knex.schema.alterTable(
    'titres_types__demarches_types__etapes_types__documents_types',
    function (table) {
      table.dropForeign(
        'document_type_id',
        'titrestypes__demarchestypes__etapestypes__documentstypes_docume'
      )
    }
  )

  await knex.schema.alterTable(
    'titres_types__demarches_types__etapes_types__justificatifs_t',
    function (table) {
      table.dropForeign(
        'document_type_id',
        'titrestypes__demarchestypes__etapestypes__justificatifst_docume'
      )
    }
  )

  await knex.schema.dropTable('entreprises__documents_types')
  await knex.schema.dropTable('documents_types')
}

exports.down = () => ({})
