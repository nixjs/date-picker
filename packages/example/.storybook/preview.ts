import type { Preview } from '@storybook/react'
import '@nixjs23n6/date-picker/lib/style/css/index.min.css'
import '../src/datepicker.scss'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: 'default',
            values: [
                {
                    name: 'default',
                    value: '#D9D9D9',
                },
            ],
        },
    },
}

export default preview
