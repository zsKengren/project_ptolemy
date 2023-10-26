export const token = {
    base: 'inline-flex items-center cursor-default aria-disabled aria-disabled:cursor-not-allowed aria-disabled:opacity-75',
    rounded: 'rounded-md',
    font: 'font-medium',
    size: {
      xs: 'text-xs px-1.5 py-0.5',
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-sm px-2 py-0.5',
      lg: 'text-md px-2 py-0.5',
      xl: 'text-lg px-2 py-0.5'
    },
    padding: {
        xs: 'px-2.5 py-1.5',
        sm: 'px-2.5 py-1.5',
        md: 'px-2.5 py-1.5',
        lg: 'px-3 py-2',
        xl: 'px-3.5 py-2.5'
      },
    color: {
      white: {
        solid: 'ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-900 aria-disabled:bg-white dark:aria-disabled:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 aria-selected:ring-2 aria-selected:ring-primary-500 dark:aria-selected:ring-primary-400'
      },
      gray: {
        solid: 'ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 aria-disabled:bg-gray-50 dark:aria-disabled:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 aria-selected:ring-2 aria-selected:ring-primary-500 dark:aria-selected:ring-primary-400'
      },
      black: {
        solid: 'text-white dark:text-gray-900 bg-gray-900 dark:bg-white aria-disabled:bg-gray-900 dark:aria-disabled:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 aria-selected:ring-inset aria-selected:ring-2 aria-selected:ring-primary-500 dark:aria-selected:ring-primary-400'
      }
    },
    variant: {
      solid: 'bg-{color}-500 dark:bg-{color}-400 text-white dark:text-gray-900 aria-disabled:bg-{color}-500 dark:aria-disabled:bg-{color}-400 hover:bg-{color}-600 dark:hover:bg-{color}-500 ',
      outline: 'text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 aria-disabled:bg-transparent dark:aria-disabled:bg-transparent hover:bg-{color}-50 dark:hover:bg-{color}-950 aria-selected:ring-2 aria-selected:ring-{color}-500 dark:aria-selected:ring-{color}-400',
      soft: 'bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400 aria-disabled:bg-{color}-50 dark:aria-disabled:bg-{color}-950 hover:bg-{color}-100 dark:hover:bg-{color}-900 aria-selected:ring-2 aria-selected:ring-inset aria-selected:ring-{color}-500 dark:aria-selected:ring-{color}-400',
      subtle: 'bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 ring-opacity-25 dark:ring-opacity-25 aria-disabled:bg-{color}-50 dark:aria-disabled:bg-{color}-950 hover:bg-{color}-100 dark:hover:bg-{color}-900 aria-selected:ring-2 aria-selected:ring-inset aria-selected:ring-{color}-500 dark:aria-selected:ring-{color}-400'
    },

    icon: {
      base: 'flex-shrink-0',
      size: {
        xs: 'h-4 w-4',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-5 w-5',
        xl: 'h-5 w-5'
      },
      leading: {
        wrapper: 'absolute inset-y-0 start-0 flex items-center',
        pointer: 'pointer-events-none',
        padding: {
          xs: 'ps-1',
          sm: 'ps-1',
          md: 'ps-1',
          lg: 'ps-2',
          xl: 'ps-3'
        }
      },
      trailing: {
        wrapper: 'absolute inset-y-0 end-0 flex items-center',
        padding: {
          xs: 'pe-1',
          sm: 'pe-1',
          md: 'pe-1',
          lg: 'pe-1.5',
          xl: 'pe-2'
        }
      }
    },
    default: {
      size: 'sm',
      variant: 'solid',
      color: 'primary'
    }
  }

  export const tokenInput = {
    wrapper: 'box-border flex flex-wrap rounded-md items-center',
    base: 'bg-transparent focus:outline-none border-none focus:ring-0 focus:shadow-none grow disabled:cursor-not-allowed disabled:opacity-75',
    rounded: 'rounded-md',
    placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-base'
    },
    gap: {
      xs: 'gap-x-1 gap-y-1',
      sm: 'gap-x-1 gap-y-1',
      md: 'gap-x-1.5 gap-y-1.5',
      lg: 'gap-x-2 gap-y-2',
      xl: 'gap-x-2 gap-y-2'
    },
    padding: {
      xs: 'px-2 py-1.5',
      sm: 'px-2 py-1.5',
      md: 'px-2.5 py-2',
      lg: 'px-3 py-2.5',
      xl: 'px-3 py-2.5'
    },
    trailing: {
      padding: {
        '2xs': 'pe-7',
        xs: 'pe-8',
        sm: 'pe-9',
        md: 'pe-10',
        lg: 'pe-11',
        xl: 'pe-12'
      }
    },
    color: {
      white: {
        outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400'
      },
      gray: {
        outline: 'shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400'
      }
    },
    variant: {
      outline: 'shadow-sm bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 focus-within:ring-2 focus-within:ring-{color}-500 dark:focus-within:ring-{color}-400',
      none: 'bg-transparent focus-within:ring-0 focus-within:shadow-none'
    },
    icon: {
      base: 'flex-shrink-0 text-gray-400 dark:text-gray-500',
      color: 'text-{color}-500 dark:text-{color}-400',
      size: {
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        md: 'h-5 w-5',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6'
      },
      leading: {
        wrapper: 'flex flex-wrap items-center ',
        padding: {
          xs: 'ps-2',
          sm: 'ps-2',
          md: 'ps-2.5',
          lg: 'ps-3',
          xl: 'ps-3'
        }
      },
      trailing: {
        wrapper: 'flex flex-wrap items-center',
        pointer: 'pointer-events-none',
        padding: {
          xs: 'pe-2',
          sm: 'pe-2',
          md: 'pe-2.5',
          lg: 'pe-3',
          xl: 'pe-3'
        }
      }
    },
    default: {
      size: 'sm',
      color: 'white',
      variant: 'outline',
      loadingIcon: 'i-heroicons-arrow-path-20-solid'
    }
  }
