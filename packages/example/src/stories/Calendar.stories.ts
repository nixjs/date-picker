import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from '@nixjs23n6/date-picker'
import { fn } from '@storybook/test'
import vi from 'date-fns/locale/vi'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'How to/Calendar',
    component: Calendar,
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
        onChange: fn(),
        onClear: fn(),
        onDone: fn(),
    },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const WithDefault: Story = {
    args: {},
}
export const WithMonth: Story = {
    args: {
        mode: 'year',
    },
}
export const WithYear: Story = {
    args: {
        mode: 'decade',
    },
}

export const WithSingle: Story = {
    args: {
        dateMode: 'single',
    },
}

export const WithRange: Story = {
    args: {
        dateMode: 'range',
    },
}

export const WithSingleWithTimer: Story = {
    args: {
        dateMode: 'single',
        showTime: true,
        hour12: true,
    },
}

export const WithWeekStartsOn: Story = {
    args: {
        weekStartsOn: 1,
    },
}

const today = new Date()
const _todayStart = new Date(today.setHours(0, 0, 0, 0))
const _todayEnd = new Date(today.setHours(23, 59, 59, 999))
export const WithMinMax: Story = {
    args: {
        minDate: new Date(_todayStart.setDate(today.getDate() - 5)),
        maxDate: new Date(_todayEnd.setDate(today.getDate() + 5)),
    },
}

export const WithLocale: Story = {
    args: {
        locale: vi,
    },
}