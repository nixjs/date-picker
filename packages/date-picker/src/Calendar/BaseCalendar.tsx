import React from 'react'
import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import toFormat from 'date-fns/format'
import { BaseTimePicker } from '../TimePicker'
import { BaseDateTimeDefaultFormat } from '../consts'
import { useCursorDate, useMode } from '../hooks'
import { CalendarTypes, SelectEventPayload } from '../types'
import { formatDateTo24Hours } from '../utils'
import { DateDisplay } from './DateDisplay'
import { Footer } from './Footer'
import Navigation from './Navigation'
import Panel from './Panel'
import { SwitchButton } from './SwitchButton'

const BaseCalendar: React.FC<
    CalendarTypes.BaseCalendar &
        CalendarTypes.CalendarSwitchFormat &
        CalendarTypes.CalendarNavigationElement &
        CalendarTypes.TimePickerElement
> = ({
    locale,
    mode: modeInput,
    weekStartsOn,
    weekdayFormat,
    monthSwitchFormat,
    yearSwitchFormat,
    timeDownElement,
    timeUpElement,
    date,
    dateRange,
    dateMode,
    minDate,
    maxDate,
    onChange,
    onUnvalidateDateRangeChange,
    onDone,
    onClear,
    navigationPrevElement,
    navigationNextElement,
    showTime = false,
    hour12,
    clearText = 'Clear',
    doneText = 'Done',
    disabled,
}) => {
    const today = startOfDay(new Date())
    const { mode, setMode, onSwitchMode } = useMode(modeInput)

    const { cursorDate, setCursorDate, onSubCursorDate, onAddCursorDate } = useCursorDate({
        date: dateMode === 'range' && Number(dateRange?.length) > 0 && dateRange?.[0] ? dateRange[0] : date ? new Date(date) : today,
        mode,
    })

    const [selectedTime, setSelectedTime] = React.useState<CalendarTypes.Time>({
        hour: toFormat(date ?? today, hour12 ? 'hh' : 'HH'),
        minute: toFormat(date ?? today, 'mm'),
        apm: toFormat(date ?? today, 'a') as CalendarTypes.APM,
    })
    const [singleDateSelected, setSingleDateSelected] = React.useState<Date>(date ?? today)
    const [rangeDateSelected, setRangeDateSelected] = React.useState<CalendarTypes.DateRange & { enteredTo?: Date }>(
        { from: dateRange?.[0] ?? undefined, to: dateRange?.[1] ?? undefined } ?? {}
    )

    const handleDateChange = (e: SelectEventPayload) => {
        if (e.kind === 'single') {
            const _date = formatDateTo24Hours(toFormat(e.day as Date, BaseDateTimeDefaultFormat), selectedTime)
            onChange?.(parse(_date, BaseDateTimeDefaultFormat, new Date()))
        } else if (e.kind === 'range') {
            const fromOriginal = (e.day as CalendarTypes.DateRange)?.from
            const toOriginal = (e.day as CalendarTypes.DateRange)?.to
            let _fromParser: Date | undefined = undefined,
                _toParser: Date | undefined = undefined

            if (fromOriginal) {
                const _from = formatDateTo24Hours(toFormat(fromOriginal, BaseDateTimeDefaultFormat), selectedTime)
                _fromParser = parse(_from, BaseDateTimeDefaultFormat, new Date())
            }
            if (toOriginal) {
                const _to = formatDateTo24Hours(toFormat(toOriginal, BaseDateTimeDefaultFormat), selectedTime)
                _toParser = parse(_to, BaseDateTimeDefaultFormat, new Date())
            }
            onUnvalidateDateRangeChange?.([_fromParser, _toParser])
            if (_fromParser && _toParser) onChange?.([_fromParser, _toParser])
        }
    }

    const handleTimePickerChange = (e: CalendarTypes.Time) => {
        if (dateMode === 'single' && singleDateSelected && isValid(singleDateSelected)) {
            setSelectedTime(e)
            const d = formatDateTo24Hours(toFormat(new Date(singleDateSelected), BaseDateTimeDefaultFormat), e)
            onChange?.(parse(d, BaseDateTimeDefaultFormat, new Date()))
        }
    }

    const handleClear = () => {
        onDone?.(null)
        onClear?.(null)
    }

    const handleSubmit = () => {
        if (showTime) {
            if (!singleDateSelected) {
                onDone?.(null)
            }
            const _date = formatDateTo24Hours(toFormat(singleDateSelected as Date, BaseDateTimeDefaultFormat), selectedTime)
            onDone?.(parseISO(_date))
        }
    }

    const renderTime = React.useMemo(() => {
        if (!showTime) return <></>
        return (
            <div className="calendar-show-time">
                <div className="calendar-show-time-hr" />
                <BaseTimePicker
                    hh={selectedTime.hour}
                    mm={selectedTime.minute}
                    apm={selectedTime.apm}
                    hour12={hour12}
                    onChange={handleTimePickerChange}
                    timeDownElement={timeDownElement}
                    timeUpElement={timeUpElement}
                />
            </div>
        )
    }, [showTime, selectedTime.hour, selectedTime.minute, selectedTime.apm, hour12, timeDownElement, timeUpElement])

    const renderFooter = React.useMemo(() => {
        if (!showTime) return <></>
        return <Footer clearText={clearText} doneText={doneText} onClear={handleClear} onDone={handleSubmit} />
    }, [clearText, doneText, showTime])

    return (
        <Panel>
            <div className="calendar-header">
                <SwitchButton
                    monthSwitchFormat={monthSwitchFormat}
                    yearSwitchFormat={yearSwitchFormat}
                    cursorDate={cursorDate}
                    mode={mode}
                    locale={locale}
                    weekStartsOn={weekStartsOn}
                    onClick={onSwitchMode}
                    disabled={disabled}
                />
                <Navigation
                    mode={mode}
                    navigationPrevElement={navigationPrevElement}
                    navigationNextElement={navigationNextElement}
                    onAddCursorDate={onAddCursorDate}
                    onSubCursorDate={onSubCursorDate}
                    disabled={disabled}
                />
            </div>
            <DateDisplay
                locale={locale}
                weekStartsOn={weekStartsOn}
                weekdayFormat={weekdayFormat}
                dateMode={dateMode}
                inputMode={modeInput}
                mode={mode}
                minDate={minDate}
                maxDate={maxDate}
                setMode={setMode}
                cursorDate={cursorDate}
                setCursorDate={setCursorDate}
                singleDateSelected={singleDateSelected}
                setSingleDateSelected={setSingleDateSelected}
                rangeDateSelected={rangeDateSelected}
                setRangeDateSelected={setRangeDateSelected}
                onSelect={handleDateChange}
                disabled={disabled}
            />
            {renderTime}
            {renderFooter}
        </Panel>
    )
}

export default BaseCalendar
