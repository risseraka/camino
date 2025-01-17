import SubstancesEdit from './substances-edit.vue'
import { Meta, Story } from '@storybook/vue3'
import {
  SubstanceLegaleId,
  SubstancesLegale
} from 'camino-common/src/static/substancesLegales'
import { DomaineId } from 'camino-common/src/static/domaines'
import { HeritageProp } from 'camino-common/src/etape'

const meta: Meta = {
  title: 'Components/Etape/SubstancesEdit',
  component: SubstancesEdit,
  argTypes: {}
}
export default meta

type Props = {
  substances: (SubstanceLegaleId | undefined)[]
  heritageProps: { substances: HeritageProp }
  incertitudes: { substances: boolean }
  domaineId: DomaineId
}

const Template: Story<Props> = (args: Props) => ({
  components: { SubstancesEdit },
  setup() {
    return { args }
  },
  data: () => ({
    substances: ['auru']
  }),
  template: `<SubstancesEdit  v-bind="args" :substances='substances'/>`
})
const etapeHeritage = {
  etape: {
    duree: 4,
    dateFin: '2020-01-01',
    dateDebut: '2020-01-01',
    date: '2020-01-01',
    titulaires: [],
    amodiataires: [],
    type: { nom: 'Demande' },
    substances: [SubstancesLegale.auru.id],
    incertitudes: { substances: true },
    contenu: {}
  }
}
export const SansHeritage = Template.bind({})
SansHeritage.args = {
  domaineId: 'm',
  heritageProps: {
    substances: {
      actif: false,
      ...etapeHeritage
    }
  },
  incertitudes: { substances: true }
}

export const AvecHeritage = Template.bind({})
AvecHeritage.args = {
  domaineId: 'm',
  heritageProps: {
    substances: {
      actif: true,
      ...etapeHeritage
    }
  },
  incertitudes: { substances: true }
}
