import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from '@nixjs23n6/date-picker'
import { fn } from '@storybook/test'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'How to/DatePicker',
    component: DatePicker,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {
        portalProps: {
            onChangeCalendarDate: fn(),
        },
    },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const WithDefault: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'bottom-end',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

export const WithRange: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'range',
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'bottom-end',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY ~ DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

export const WithDisabled: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
            disabled: true,
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'bottom-end',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

const today = new Date()
const _todayStart = new Date(today.setHours(0, 0, 0, 0))
const _todayEnd = new Date(today.setHours(23, 59, 59, 999))

export const WithMinMax: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
            minDate: new Date(_todayStart.setDate(today.getDate() - 5)),
            maxDate: new Date(_todayEnd.setDate(today.getDate() + 5)),
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'bottom-end',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

export const WithPlacementTop: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'top',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

export const WithPlacementRight: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'right',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

export const WithPlacementBottom: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'bottom',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}

export const WithPlacementLeft: Story = {
    args: {
        calendarProps: {
            date: new Date(),
            dateMode: 'single',
        },
        portalProps: {
            formatInput: 'dd/MM/yyy',
            format: 'MM/dd/yyy',
            onChangeCalendarDate: fn(),
            placement: 'left',
            offset: [24, 5],
        },
        inputProps: {
            placeholder: 'DD-MM-YYYY',
            suffixHTML: <></>,
        },
    },
}
