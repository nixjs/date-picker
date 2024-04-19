import React from 'react'
import { format } from 'date-fns'
import { CalendarTypes } from '../types'
import { getDecadeModeTitle } from '../utils'
import classNames from 'classnames'

export const SwitchButton: React.FC<CalendarTypes.SwitchButton & CalendarTypes.CalendarSwitchFormat> = ({
    mode,
    cursorDate,
    onClick,
    monthSwitchFormat = 'LLLL yyyy',
    yearSwitchFormat = 'yyyy',
    locale,
    weekStartsOn,
    disabled,
}) => {
    const handleClick = () => {
        if (disabled) return false
        onClick?.()
    }
    return (
        <div className="calendar-header-view">
            <button type="button" className={classNames('calendar-decade-select', { disabled })} onClick={handleClick} aria-live="polite">
                <span className="calendar-decade-text">
                    {mode !== 'decade'
                        ? format(cursorDate, mode === 'month' ? monthSwitchFormat : yearSwitchFormat, {
                              locale,
                              weekStartsOn,
                          })
                        : getDecadeModeTitle(cursorDate)}
                </span>
            </button>
        </div>
    )
}
