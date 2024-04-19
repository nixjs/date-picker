import React from 'react'
import { Locale } from 'date-fns'

export type Placement =
    | 'auto'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-start'
export type Trigger = 'hover' | 'click' | 'focus'

export namespace CalendarTypes {
    export type APM = 'AM' | 'PM'

    export type Mode = 'month' | 'year' | 'decade'
    export type DateMode = 'single' | 'range'
    export type DateFormat = string
    /**
     * The index of the first day of the week (0 - Sunday). https://date-fns.org/v2.30.0/docs/eachWeekOfInterval
     */
    export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

    export interface Time {
        hour?: string
        minute?: string
        apm?: APM
    }

    export type DateRange = { from?: Date | undefined; to?: Date | undefined }
    export interface CalendarSwitchFormat {
        /**
         * Customize the button switch
         */
        monthSwitchFormat?: string
        /**
         * Customize the button switch
         */
        yearSwitchFormat?: string
    }

    export interface CalendarNavigation {
        mode: CalendarTypes.Mode
        onSubCursorDate?: () => void
        onAddCursorDate?: () => void
        disabled?: boolean
    }

    export interface CalendarNavigationElement {
        navigationPrevElement?: React.ReactNode
        navigationNextElement?: React.ReactNode
    }

    export interface BaseCalendar {
        /**
         * The date-fns locale object used to localize dates.
         */
        weekdayFormat?: string
        /**
         * Localization configuration <Internationalization>
         */
        locale?: Locale
        /**
         * The index of the first day of the week (0 - Sunday). Overrides the locale's one.
         */
        weekStartsOn?: WeekStartsOn
        /**
         * To set date. Only work with dateMode=single
         */
        date?: Date
        /**
         * To set date range. Only work with dateMode=range
         */
        dateRange?: Array<Date | undefined>
        /**
         * The picker panel of date mode: 'single' | 'multiple' | 'range'
         */
        dateMode?: CalendarTypes.DateMode
        /**
         * The picker panel mode: 'month' | 'year' | 'decade'
         */
        mode?: CalendarTypes.Mode
        /**
         * Set the lower limit of the available date relative to the current selection date
         */
        minDate?: Date
        /**
         * Set the upper limit of the available date relative to the current selection date
         */
        maxDate?: Date
        /**
         * Callback fired when value changed
         */
        onChange?: (date: Date | Date[]) => void
        /**
         * Callback fired when value changed
         */
        onUnvalidateDateRangeChange?: (date: (Date | undefined)[]) => void
        /**
         * Click the Done callback function
         */
        onDone?: (date: Date | null) => void
        /**
         * Click the Clear callback function
         */
        onClear?: (date: Date | null) => void
        /**
         * Custom the label of the Done button
         */
        doneText?: string
        /**
         * Custom the label of the Clear button
         */
        clearText?: string
        /**
         * To provide an additional time selection
         */
        showTime?: boolean
        /**
         * Display hours in 12/24 format
         */
        hour12?: boolean
        /**
         * A disabled state of the calendar
         */
        disabled?: boolean
    }

    export interface TimePickerElement {
        /**
         * Custom a Up element to increase the number
         */
        timeUpElement?: React.ReactNode
        /**
         * Custom a Down element to increase the number
         */
        timeDownElement?: React.ReactNode
    }

    export interface BaseTimePicker {
        /**
         * Callback fired when value changed
         */
        onChange?: (e: CalendarTypes.Time) => void
        /**
         * Hour
         */
        hh?: string | number
        /**
         * Minute
         */
        mm?: string | number
        /**
         * AM/PM
         */
        apm?: CalendarTypes.APM
        /**
         * Display hours in 12/24 format
         */
        hour12?: boolean
        /**
         * A disabled state of the time picker
         */
        disabled?: boolean
    }

    export interface DateDisplay {
        /**
         * Localization configuration <Internationalization>
         */
        locale?: Locale
        /**
         * The index of the first day of the week (0 - Sunday). Overrides the locale's one.
         */
        weekStartsOn?: WeekStartsOn
        /**
         * The date-fns locale object used to localize dates.
         */
        weekdayFormat?: string
        /**
         * The picker panel mode: 'month' | 'year' | 'decade'
         */
        mode: Mode
        /**
         * The picker panel mode: 'month' | 'year' | 'decade'
         */
        inputMode?: Mode
        /**
         * The picker panel of date mode: 'single' | 'multiple' | 'range'
         */
        dateMode?: DateMode
        setMode: (mode: Mode) => void

        minDate?: Date
        maxDate?: Date

        cursorDate: Date
        setCursorDate: (date: Date) => void

        singleDateSelected: Date
        setSingleDateSelected: (date: Date) => void
        rangeDateSelected: CalendarTypes.DateRange & { enteredTo?: Date }
        setRangeDateSelected: (date: CalendarTypes.DateRange & { enteredTo?: Date }) => void
        onSelect: SelectEventHandler
        disabled?: boolean
    }

    export interface Weekdays {
        /**
         * Localization configuration <Internationalization>
         */
        locale?: Locale
        /**
         * The index of the first day of the week (0 - Sunday). Overrides the locale's one.
         */
        weekStartsOn?: WeekStartsOn
        mode: Mode
        weekdayFormat?: string
    }
    export interface SwitchButton {
        /**
         * Localization configuration <Internationalization>
         */
        locale?: Locale
        /**
         * The index of the first day of the week (0 - Sunday). Overrides the locale's one.
         */
        weekStartsOn?: WeekStartsOn
        mode: Mode
        cursorDate: Date
        onClick: () => void
        disabled?: boolean
    }
}

export namespace DatePickerTypes {
    export interface Portal {
        /**
         * The z-index property specifies the stack order of an element
         */
        zindex?: number
        /**
         * Distance between tooltip and target.
         */
        offset?: [number, number]
        /**
         * Callback executed when hide of the calendar card is changed
         */
        onHide?: () => void
        /**
         * Callback executed when show of the calendar card is changed
         */
        onShow?: () => void
        /**
         * Calendar trigger mode. Could be multiple by passing an array.
         */
        trigger?: Trigger | Trigger[]
        /**
         * The position of the calendar relative to the target, which can be one of top left right bottom auto.
         */
        placement?: Placement
        /**
         * Describes the positioning strategy to use. By default, it is absolute, which in the simplest cases does not require repositioning of the datepicker.
         */
        strategy?: 'absolute' | 'fixed'
        /**
         * Force if the calendar is visible or not
         */
        visible?: boolean
        /**
         * Allow to add the class in date picker component
         */
        classNameWrapper?: string
        /**
         * Format date refers to `date-fns` format and it will display on the input componenta
         */
        formatInput?: CalendarTypes.DateFormat
        /**
         * Format date refers to `date-fns` format and will be returning from onChangeCalendarDate function
         */
        format?: CalendarTypes.DateFormat
        /**
         * The character that separates two dates, use for `dateMode=range`
         */
        character?: string
        /**
         * Callback function that changes the calendar date.
         */
        onChangeCalendarDate?: (date: Date | Date[] | string | string[]) => void
        /**
         * Callback function that changes the input in date picker.
         */
        onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
        /**
         * Whether the datepicker is loading
         */
        loading?: boolean
    }
    export interface Calendar
        extends CalendarTypes.BaseCalendar,
            CalendarTypes.CalendarSwitchFormat,
            CalendarTypes.CalendarNavigationElement,
            CalendarTypes.TimePickerElement {}
}

export type SelectEventPayload = {
    /**
     * The picker panel mode: 'single' | 'multiple' | 'range'
     */
    kind: CalendarTypes.DateMode
    /**
     * Value returned
     */
    day: Date | Date[] | CalendarTypes.DateRange | undefined
    /** The mouse event that triggered this event. */
    e?: React.MouseEvent
}
/** The event handler when selecting a single day. */
export type SelectEventHandler = (data: SelectEventPayload) => void
