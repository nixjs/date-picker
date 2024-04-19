import React from 'react'
import { CalendarTypes } from '../types'

const Navigation: React.FC<CalendarTypes.CalendarNavigation & CalendarTypes.CalendarNavigationElement> = ({
    mode,
    navigationPrevElement,
    navigationNextElement,
    onAddCursorDate,
    onSubCursorDate,
    disabled,
}) => {
    const handleSub = () => {
        if (disabled) return false
        onSubCursorDate?.()
    }
    const handleAdd = () => {
        if (disabled) return false
        onSubCursorDate?.()
    }
    return (
        <div className="calendar-navigation">
            <button
                name={`previous-${mode}`}
                aria-label={`Go to previous ${mode}`}
                className="calendar-prev"
                type="button"
                onClick={handleSub}
            >
                {navigationPrevElement}
            </button>
            <button name={`next-${mode}`} aria-label={`Go to next ${mode}`} className="calendar-next" type="button" onClick={handleAdd}>
                {navigationNextElement}
            </button>
        </div>
    )
}

export default Navigation
