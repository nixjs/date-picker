import React from 'react'

export interface FooterPropArg {
    clearText: string
    doneText: string
    onDone: () => void
    onClear: () => void
}

export const Footer: React.FC<FooterPropArg> = ({ clearText, doneText, onClear, onDone }) => {
    return (
        <div className="calendar-footer">
            <div className="calendar-button-group">
                <button className="calendar-button calendar-button--clear" type="button" onClick={onClear}>
                    {clearText ?? 'Clear'}
                </button>
                <button className="calendar-button calendar-button--done" type="button" onClick={onDone}>
                    {doneText ?? 'Done'}
                </button>
            </div>
        </div>
    )
}
