import { shallowMount, mount } from '@vue/test-utils'
import FondamentalesEdit from './fondamentales-edit.vue'

describe('FondamentalesEdit', () => {
  const $store = {
    state: {
      titreEtapeEdition: {
        metas: {
          entreprises: [
            { id: 'foo', nom: 'bar' },
            { id: 'baz', nom: 'quux' }
          ]
        }
      }
    }
  }

  const etape = {
    id: 'aZHafFDDBksskCO0ZFuaMlPA',
    type: {
      id: 'mfr'
    },
    demarche: {
      type: {
        id: 'oct'
      }
    },
    duree: {
      ans: 0,
      mois: 4
    },
    incertitudes: {
      dateDebut: false,
      dateFin: false,
      amodiataires: false,
      titulaires: false,
      substances: false,
      points: false,
      surface: false
    },
    substances: [],
    titulaires: [],
    amodiataires: [],
    heritageProps: {
      dateDebut: {
        etape: null,
        actif: false
      },
      dateFin: {
        etape: null,
        actif: false
      },
      duree: {
        etape: null,
        actif: false
      },
      surface: {
        etape: null,
        actif: false
      },
      points: {
        etape: null,
        actif: false
      },
      substances: {
        etape: null,
        actif: false
      },
      titulaires: {
        etape: null,
        actif: false
      },
      amodiataires: {
        etape: null,
        actif: false
      }
    }
  }

  test.each`
    titreTypeId | domaineId    | userIsSuper | expected
    ${'ar'}     | ${'m'}       | ${false}    | ${false}
    ${'ar'}     | ${'m'}       | ${true}     | ${true}
    ${'ax'}     | ${'m'}       | ${false}    | ${false}
    ${'ax'}     | ${'m'}       | ${true}     | ${true}
    ${'ni axm'} | ${' ni arm'} | ${false}    | ${true}
    ${'ni axm'} | ${' ni arm'} | ${true}     | ${true}
  `(
    '#canSeeAllDates retourne $expected si utilisateur super => $userIsSuper et démarche est $titreTypeId$domaineId',
    ({ titreTypeId, domaineId, userIsSuper, expected }) => {
      // ARM + utilisateur non-super
      const wrapper = shallowMount(FondamentalesEdit, {
        global: {
          stubs: {
            AutocompleteGroup: true
          }
        },
        props: {
          etape,
          demarcheTypeId: 'oct',
          titreTypeId,
          domaineId,
          userIsAdmin: true,
          userIsSuper,
          substances: []
        }
      })
      expect(wrapper.vm.canSeeAllDates).toBe(expected)
    }
  )

  test('affiche les éléments de dates dans le formulaire seulement si #canSeeAllDates est true', () => {
    let wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ar',
        domaineId: 'm',
        userIsAdmin: true,
        userIsSuper: false,
        substances: []
      }
    })
    expect(wrapper.vm.canSeeAllDates).toBe(false)
    expect(wrapper.html().includes('Date de début')).toBe(false)
    expect(wrapper.html().includes("Date d'échéance")).toBe(false)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ar',
        domaineId: 'm',
        userIsAdmin: true,
        userIsSuper: true,
        substances: []
      }
    })
    expect(wrapper.vm.canSeeAllDates).toBe(true)
    expect(wrapper.html().includes('Date de début')).toBe(true)
    expect(wrapper.html().includes("Date d'échéance")).toBe(true)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ax',
        domaineId: 'm',
        userIsAdmin: true,
        userIsSuper: false,
        substances: []
      }
    })
    expect(wrapper.vm.canSeeAllDates).toBe(false)
    expect(wrapper.html().includes('Date de début')).toBe(false)
    expect(wrapper.html().includes("Date d'échéance")).toBe(false)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ax',
        domaineId: 'm',
        userIsAdmin: true,
        userIsSuper: true,
        substances: []
      }
    })
    expect(wrapper.vm.canSeeAllDates).toBe(true)
    expect(wrapper.html().includes('Date de début')).toBe(true)
    expect(wrapper.html().includes("Date d'échéance")).toBe(true)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ni axm',
        domaineId: 'ni arm',
        userIsAdmin: true,
        userIsSuper: false,
        substances: []
      }
    })
    expect(wrapper.vm.canSeeAllDates).toBe(true)
    expect(wrapper.html().includes('Date de début')).toBe(true)
    expect(wrapper.html().includes("Date d'échéance")).toBe(true)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ni axm',
        domaineId: 'ni arm',
        userIsAdmin: true,
        userIsSuper: true,
        substances: []
      }
    })
    expect(wrapper.vm.canSeeAllDates).toBe(true)
    expect(wrapper.html().includes('Date de début')).toBe(true)
    expect(wrapper.html().includes("Date d'échéance")).toBe(true)
  })

  test("#canAddAmodiataires retourne true si ce n'est ni un arm ni un axm, false sinon", () => {
    let wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ar',
        domaineId: 'm',
        userIsAdmin: true,
        userIsSuper: false,
        substances: []
      }
    })
    expect(wrapper.vm.canAddAmodiataires).toBe(false)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ax',
        domaineId: 'm',
        userIsAdmin: true,
        userIsSuper: false,
        substances: []
      }
    })
    expect(wrapper.vm.canAddAmodiataires).toBe(false)

    wrapper = mount(FondamentalesEdit, {
      global: {
        stubs: {
          AutocompleteGroup: true
        },
        mocks: {
          $store
        }
      },
      props: {
        etape,
        demarcheTypeId: 'oct',
        titreTypeId: 'ni arm',
        domaineId: 'ni axm',
        userIsAdmin: true,
        userIsSuper: false,
        substances: []
      }
    })
    expect(wrapper.vm.canAddAmodiataires).toBe(true)
  })
})
