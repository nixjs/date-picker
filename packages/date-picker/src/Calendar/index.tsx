import React from 'react'
import { CalendarTypes } from '../types'
import BaseCalendar from './BaseCalendar'

export const Calendar: React.FC<
    CalendarTypes.BaseCalendar &
        CalendarTypes.CalendarSwitchFormat &
        CalendarTypes.CalendarNavigationElement &
        CalendarTypes.TimePickerElement & { className?: string }
> = (props) => {
    return <BaseCalendar {...props} />
}

export default Calendar
