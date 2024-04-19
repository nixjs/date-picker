import React from 'react'
import classNames from 'classnames'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isValid from 'date-fns/isValid'
import { enUS } from 'date-fns/locale'
import { BaseCellDateFormat, BaseCellMonthFormat, BaseCellYearFormat } from '../consts'
import { CalendarTypes } from '../types'
import {
    DataPropsArg,
    getDaysInMonthMatrixMode,
    getMonthsInYearMatrixMode,
    getYearsInDecadeMatrixMode,
    roundTen,
    toFormat,
    toRangeClass,
} from '../utils'
import { Weekdays } from './Weekdays'

export const DateDisplay: React.FC<CalendarTypes.DateDisplay> = ({
    locale = enUS,
    weekStartsOn = 0,
    weekdayFormat,
    dateMode,
    inputMode = 'month',
    mode,
    setMode,
    minDate,
    maxDate,
    cursorDate,
    setCursorDate,
    singleDateSelected,
    setSingleDateSelected,
    rangeDateSelected,
    setRangeDateSelected,
    onSelect,
    disabled,
}) => {
    const id = React.useId()

    const mCursorDate = getMonth(cursorDate)

    let _dateSelected = new Date()
    if (dateMode === 'single') {
        _dateSelected = singleDateSelected
    } else if (dateMode === 'range' && rangeDateSelected?.from) {
        _dateSelected = rangeDateSelected.from
    }

    const dateSelected = toFormat(_dateSelected, BaseCellDateFormat)
    const monthSelected = toFormat(_dateSelected, BaseCellMonthFormat)
    const yearSelected = toFormat(_dateSelected, BaseCellYearFormat)

    const isSelectingFirstDay = (from: Date | undefined, to: Date | undefined, day: Date) => {
        const isBeforeFirstDay = from && isBefore(day, from)
        const isRangeSelected = from && to
        return !from || isBeforeFirstDay || isRangeSelected
    }

    const handleDayMouseEnter = React.useCallback(
        (cell: DataPropsArg, isOffRange: boolean, isOffRangeStart: boolean, isOffRangeEnd: boolean) => {
            // out of range
            if (cell.isSameDay || isOffRange || isOffRangeStart || isOffRangeEnd) {
                return
            }
            const { from, to } = rangeDateSelected
            if (from && !to) {
                setRangeDateSelected({
                    from,
                    to,
                    enteredTo: !isSelectingFirstDay(from, to, cell.original) ? cell.original : undefined,
                })
            }
        },
        [rangeDateSelected, setRangeDateSelected]
    )

    const handleCalendarTableMouseLeave = React.useCallback(() => {
        setRangeDateSelected({ ...rangeDateSelected, enteredTo: undefined })
    }, [rangeDateSelected, setRangeDateSelected])

    const emitDateRange = React.useCallback(
        ({ from, to, enteredTo, e }: { from?: Date; to?: Date; enteredTo?: Date; e?: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
            if (from && to && enteredTo) {
                onSelect({
                    kind: 'range',
                    day: { from, to },
                    e,
                })
            }
        },
        [onSelect]
    )

    const handleCell = React.useCallback(
        (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>,
            cell: DataPropsArg,
            isOffRange: boolean,
            isOffRangeStart: boolean,
            isOffRangeEnd: boolean
        ) => {
            if (disabled) return false
            // out of range
            if (cell.isSameDay || isOffRange || isOffRangeStart || isOffRangeEnd) {
                return
            }

            if (dateMode === 'single') {
                setSingleDateSelected(cell.original)
                onSelect({
                    kind: 'single',
                    day: cell.original,
                    e,
                })
            } else if (dateMode === 'range') {
                const { from, to } = rangeDateSelected
                const day = cell.original

                if (from && to && day >= from && day <= to) {
                    setRangeDateSelected({
                        from: day,
                        to: undefined,
                        enteredTo: undefined,
                    })
                    onSelect({
                        kind: 'range',
                        day: {
                            from: day,
                        },
                        e,
                    })
                    return false
                }

                if (isSelectingFirstDay(from, to, day)) {
                    setRangeDateSelected({
                        from: day,
                        to: undefined,
                        enteredTo: undefined,
                    })
                    emitDateRange({ from: day })
                } else {
                    setRangeDateSelected({
                        from,
                        to: day,
                        enteredTo: undefined,
                    })
                    emitDateRange({ from, to: day, enteredTo: day, e })
                }
            }
        },
        [dateMode, rangeDateSelected, setSingleDateSelected, setRangeDateSelected, onSelect, emitDateRange]
    )

    const renderView = React.useMemo(() => {
        if (mode === 'month')
            return getDaysInMonthMatrixMode(cursorDate, weekStartsOn, locale).map((row, rowIdx: number) => {
                return (
                    <div className="calendar-row" key={rowIdx}>
                        {row.map((cell, cellIdx: number) => {
                            const yDate = getYear(cell.original)
                            const mDate = getMonth(cell.original)
                            const isOffRange = mDate !== mCursorDate
                            let isOffRangeStart = false
                            let isOffRangeEnd = false

                            if (minDate && isValid(minDate)) {
                                isOffRangeStart = yDate < getYear(minDate) || isBefore(cell.original, minDate)
                            }
                            if (maxDate && isValid(maxDate)) {
                                isOffRangeEnd = yDate > getYear(maxDate) || isAfter(cell.original, maxDate)
                            }
                            return (
                                <div
                                    key={cellIdx}
                                    className={classNames(
                                        'calendar-cell calendar-cell-date',
                                        {
                                            'calendar-cell-date-selected': cell.format === dateSelected && dateMode !== 'range',
                                            'calendar-cell-date-offrange': cell.isSameDay || isOffRange,
                                            'calendar-cell-date-outrange': isOffRangeStart || isOffRangeEnd,
                                            'calendar-cell-date-today': cell.isToday,
                                        },
                                        dateMode === 'range'
                                            ? toRangeClass(cell.original, {
                                                  from: rangeDateSelected.from,
                                                  to: rangeDateSelected.to,
                                                  enteredTo: rangeDateSelected.enteredTo,
                                              })
                                            : ''
                                    )}
                                    aria-hidden="true"
                                    role="gridcell"
                                    onClick={(e) => {
                                        handleCell(e, cell, isOffRange, isOffRangeStart, isOffRangeEnd)
                                    }}
                                    onMouseEnter={() => handleDayMouseEnter(cell, isOffRange, isOffRangeStart, isOffRangeEnd)}
                                >
                                    <span className="calendar-cell-content calendar-cell-date-content">{cell.display}</span>
                                </div>
                            )
                        })}
                    </div>
                )
            })
        if (mode === 'year')
            return getMonthsInYearMatrixMode(cursorDate, weekStartsOn, locale).map((row, rowIdx) => {
                return (
                    <div className="calendar-row" key={rowIdx}>
                        {row.map((cell, cellIdx: number) => {
                            let isOffRangeStart = false
                            let isOffRangeEnd = false
                            const sCursorDate = cell.original.getTime()
                            if (minDate && isValid(minDate)) {
                                isOffRangeStart = sCursorDate < minDate?.getTime()
                            }
                            if (maxDate && isValid(maxDate)) {
                                isOffRangeEnd = sCursorDate > maxDate?.getTime()
                            }
                            return (
                                <div
                                    className={classNames('calendar-cell calendar-cell-month', {
                                        'calendar-cell-month-selected': cell.format === monthSelected,
                                        'calendar-cell-month-outrange': isOffRangeStart || isOffRangeEnd,
                                    })}
                                    aria-hidden="true"
                                    role="gridcell"
                                    title={cell.display}
                                    key={cellIdx}
                                    onClick={() => {
                                        if (!isOffRangeStart && !isOffRangeEnd) {
                                            setCursorDate(cell.original)
                                            if (inputMode === 'month') setMode('month')
                                        }
                                    }}
                                >
                                    <span className="calendar-cell-content calendar-cell-month-content">{cell.display}</span>
                                </div>
                            )
                        })}
                    </div>
                )
            })
        if (mode === 'decade')
            return getYearsInDecadeMatrixMode(cursorDate, weekStartsOn, locale).map((row, rowIdx) => {
                return (
                    <div className="calendar-row" key={rowIdx}>
                        {row.map((cell, cellIdx: number) => {
                            const isOffRange =
                                getYear(cell.original) + 1 < roundTen(getYear(cursorDate)) ||
                                getYear(cell.original) >= roundTen(getYear(cursorDate)) + 10

                            const yDate = getYear(cell.original)

                            let isOffRangeStart = false
                            let isOffRangeEnd = false

                            if (minDate && isValid(minDate)) {
                                isOffRangeStart = yDate < getYear(minDate)
                            }
                            if (maxDate && isValid(maxDate)) {
                                isOffRangeEnd = yDate > getYear(maxDate)
                            }
                            return (
                                <div
                                    className={classNames('calendar-cell calendar-cell-decade', {
                                        'calendar-cell-decade-selected': cell.format === yearSelected,
                                        'calendar-cell-decade-offrange': isOffRange,
                                        'calendar-cell-decade-outrange': isOffRangeStart || isOffRangeEnd,
                                    })}
                                    aria-hidden="true"
                                    role="gridcell"
                                    title={cell.display}
                                    key={cellIdx}
                                    onClick={() => {
                                        // off range
                                        if (isOffRange || isOffRangeStart || isOffRangeEnd) {
                                            return
                                        }
                                        setCursorDate(cell.original)
                                        if (inputMode === 'month' || inputMode === 'year') setMode('year')
                                    }}
                                >
                                    <span className="calendar-cell-content calendar-cell-decade-content">{cell.display}</span>
                                </div>
                            )
                        })}
                    </div>
                )
            })
        return <></>
    }, [
        weekStartsOn,
        locale,
        mode,
        dateMode,
        inputMode,
        cursorDate,
        mCursorDate,
        minDate,
        maxDate,
        dateSelected,
        monthSelected,
        yearSelected,
        rangeDateSelected.from,
        rangeDateSelected.to,
        rangeDateSelected.enteredTo,
        handleCell,
        handleDayMouseEnter,
        setCursorDate,
        setMode,
    ])

    return (
        <div className="calendar-table-outer" tabIndex={-1}>
            <Weekdays mode={mode} weekdayFormat={weekdayFormat} locale={locale} weekStartsOn={weekStartsOn} />
            <div
                className={classNames('calendar-table-inner', `calendar-table-inner--${mode}`, {
                    disabled,
                })}
            >
                <div
                    className="calendar-table"
                    aria-labelledby={`calendar-${id}`}
                    role="grid"
                    tabIndex={0}
                    onMouseLeave={handleCalendarTableMouseLeave}
                >
                    {renderView}
                </div>
            </div>
        </div>
    )
}
