import { Locale } from 'date-fns'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval'
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval'
import endOfMonth from 'date-fns/endOfMonth'
import endOfWeek from 'date-fns/endOfWeek'
import endOfYear from 'date-fns/endOfYear'
import format from 'date-fns/format'
import getYear from 'date-fns/getYear'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isEqual from 'date-fns/isEqual'
import isSameDay from 'date-fns/isSameDay'
import isSameMonth from 'date-fns/isSameMonth'
import isToday from 'date-fns/isToday'
import setYear from 'date-fns/setYear'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import startOfYear from 'date-fns/startOfYear'
import subMonths from 'date-fns/subMonths'
import subYears from 'date-fns/subYears'
import { BaseCellDateFormat, BaseCellMonthFormat, BaseCellYearFormat, BaseWeekStartsOn } from './consts'
import { CalendarTypes } from './types'

export interface DataPropsArg {
    original: Date
    format: string
    display: string
    isSameDay?: boolean
    isToday?: boolean
}

export const getWeekdays = ({
    fmt = 'EEE',
    weekStartsOn = BaseWeekStartsOn,
    locale
}: {
    fmt: string
    weekStartsOn?: CalendarTypes.WeekStartsOn
    locale?: Locale
}): string[] => {
    const now = new Date()
    return eachDayOfInterval({
        start: startOfWeek(now, {
            locale,
            weekStartsOn
        }),
        end: endOfWeek(now, {
            locale,
            weekStartsOn
        })
    }).map((d) =>
        format(d, fmt, {
            locale,
            weekStartsOn
        })
    )
}

export const toFormat = (date: string | Date, fmt: string, weekStartsOn?: CalendarTypes.WeekStartsOn, locale?: Locale): string => {
    return format(new Date(date), fmt, {
        locale,
        weekStartsOn
    })
}

export const getDaysInMonthMatrixMode = (
    date: Date,
    weekStartsOn: CalendarTypes.WeekStartsOn = BaseWeekStartsOn,
    locale?: Locale
): DataPropsArg[][] => {
    const dateSelected = new Date(date)

    const matrix = eachWeekOfInterval(
        {
            start: startOfMonth(dateSelected),
            end: endOfMonth(dateSelected)
        },
        { weekStartsOn, locale }
    )

    return matrix.map((weekDay) =>
        eachDayOfInterval({
            start: startOfWeek(weekDay, {
                weekStartsOn,
                locale
            }),
            end: endOfWeek(weekDay, {
                weekStartsOn,
                locale
            })
        }).map((day) => ({
            original: day,
            format: format(day, BaseCellDateFormat, {
                locale,
                weekStartsOn
            }),
            display: format(day, 'dd', {
                locale,
                weekStartsOn
            }),
            isSameDay: !isSameMonth(dateSelected, day),
            isToday: isToday(day)
        }))
    )
}

export const getMonthsInYearMatrixMode = (
    date: Date,
    weekStartsOn: CalendarTypes.WeekStartsOn = BaseWeekStartsOn,
    locale?: Locale
): DataPropsArg[][] => {
    const months = eachMonthOfInterval({
        start: startOfYear(date),
        end: endOfYear(date)
    }).map((_date) => ({
        original: _date,
        format: format(_date, BaseCellMonthFormat, {
            locale,
            weekStartsOn
        }),
        display: format(_date, 'MMMM', {
            locale,
            weekStartsOn
        })
    }))
    return groupArr(months)
}

export const getYearsInDecadeMatrixMode = (
    date: Date,
    weekStartsOn: CalendarTypes.WeekStartsOn = BaseWeekStartsOn,
    locale?: Locale
): DataPropsArg[][] => {
    const startYear = Math.floor(getYear(date) / 10) * 10 - 1

    const years = Array(12)
        .fill(10)
        .map((_, i) => {
            const d = startOfYear(setYear(date, startYear + i))
            const fmt = format(d, BaseCellYearFormat, {
                locale,
                weekStartsOn
            })
            return {
                original: d,
                format: fmt,
                display: fmt
            }
        })
    return groupArr(years)
}

export const getDecadeModeTitle = (date: Date): string => {
    const startYear = Math.floor(getYear(date) / 10) * 10 - 1
    return `${startYear} - ${startYear + 10}`
}

export const roundTen = (x: number): number => Math.floor(x / 10) * 10

export const getDifferenceByMode = (mode: CalendarTypes.Mode): Record<string, number> => {
    if (mode === 'month') return { months: 1 }
    if (mode === 'year') return { years: 1 }
    if (mode === 'decade') return { years: 10 }
    return { days: 0 }
}

export const addDateByMode = (date: Date, mode: CalendarTypes.Mode): Date => {
    switch (mode) {
        case 'month':
            return addMonths(date, 1)
        case 'year':
            return addYears(date, 1)
        case 'decade':
            return addYears(date, 10)
        default:
            return new Date(date.valueOf())
    }
}

export const subDateByMode = (date: Date, mode: CalendarTypes.Mode): Date => {
    switch (mode) {
        case 'month':
            return subMonths(date, 1)
        case 'year':
            return subYears(date, 1)
        case 'decade':
            return subYears(date, 10)
        default:
            return new Date(date.valueOf())
    }
}

const nextModeMap: Record<CalendarTypes.Mode, string> = {
    month: 'year',
    year: 'decade',
    decade: 'month'
}

export const getNextMode = (mode: CalendarTypes.Mode): CalendarTypes.Mode => nextModeMap[mode] as CalendarTypes.Mode

export const formatTimeTo24Hours = (hour: string, minute: string, apm: CalendarTypes.APM): string => {
    let hours = `${parseInt(hour, 10) < 10 ? hour.toString().padStart(2, '0') : hour}`
    const minutes = parseInt(minute, 10) < 10 ? minute.toString().padStart(2, '0') : minute
    if (parseInt(hours, 10) === 12) {
        hours = '00'
    }

    if (apm === 'PM' && parseInt(hours, 10) <= 12) {
        hours = `${parseInt(hours, 10) + 12}`
    }
    return `${hours}:${minutes}:00`
}

export const formatDateTo24Hours = (date: string | Date, e: CalendarTypes.Time | null): string =>
    `${toFormat(date, 'yyyy-MM-dd')} ${formatTimeTo24Hours(e?.hour ?? '0', e?.minute ?? '0', e?.apm ?? 'AM')}`

export const groupArr = (data: Date[] | Record<string, any>[] = [], n = 3): any[][] => {
    const group: any = []
    for (let i = 0, end = data.length / n; i < end; ++i) {
        if (data.length > 0) group.push(data.slice(i * n, (i + 1) * n) as never)
    }
    return group
}

export function addToRange(day: Date, range?: CalendarTypes.DateRange): CalendarTypes.DateRange | undefined {
    const { from, to } = range || {}
    if (from && to) {
        if (isSameDay(to, day) && isSameDay(from, day)) {
            return undefined
        }
        if (isSameDay(to, day)) {
            return { from: to, to: undefined }
        }
        if (isSameDay(from, day)) {
            return undefined
        }
        if (isAfter(from, day)) {
            return { from: day, to }
        }
        return { from, to: day }
    }
    if (to) {
        if (isAfter(day, to)) {
            return { from: to, to: day }
        }
        return { from: day, to }
    }
    if (from) {
        if (isBefore(day, from)) {
            return { from: day, to: from }
        }
        return { from, to: day }
    }
    return { from: day, to: undefined }
}

export function toRangeClass(
    day: Date,
    range?: CalendarTypes.DateRange & {
        enteredTo?: Date // Keep track of the last day for mouseEnter.
    }
): string {
    const { from, to, enteredTo } = range || {}
    if (from && to) {
        if (isSameDay(to, from)) return ''
        if (isSameDay(to, day)) return 'date-range--end'
        if (isSameDay(from, day)) return 'date-range--start'
        if (isAfter(day, from) && isAfter(to, day)) return 'date-range--middle'
        return ''
    }
    if (from && enteredTo) {
        if (isSameDay(from, day)) return 'date-range--start'
        if ((isAfter(day, from) && isAfter(enteredTo, day)) || isEqual(enteredTo, day)) return 'date-range--middle'
    }
    if (from && isSameDay(day, from)) return 'date-range--start'
    return ''
}
