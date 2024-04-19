import React from 'react'
import { CalendarTypes } from '../types'
import { getWeekdays } from '../utils'

export const Weekdays: React.FC<CalendarTypes.Weekdays> = ({ mode, weekdayFormat = 'EEE', locale, weekStartsOn }) => {
    if (mode === 'month')
        return (
            <div className="calendar-weekday">
                <div className="calendar-row">
                    {getWeekdays({ fmt: weekdayFormat, locale, weekStartsOn }).map((weekDay, i) => (
                        <div key={i} className="calendar-cell calendar-cell-weekdays" aria-hidden="true" aria-label={weekDay}>
                            <span className="calendar-cell-content calendar-cell-content-week">{weekDay}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    return <></>
}
