import React from 'react'

export interface DatePickerInput
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'type' | 'disabled' | 'readOnly'> {
    /**
     * The class for label input
     */
    classNameInputLabel?: string
    /**
     * The class for helper text input
     */
    classNameInputHelperText?: string
    /**
     * The class for content input
     */
    classNameInputContent?: string
    /**
     * The class for wrap input
     */
    classNameInputWrapper?: string
    /**
     * The prefix HTML for the input
     */
    prefixHTML?: React.ReactNode
    /**
     * The suffix HTML for the input
     */
    suffixHTML?: React.ReactNode
    /**
     * The class for the prefix input
     */
    prefixClassName?: string
    /**
     * The class for the suffix input
     */
    suffixClassName?: string
    /**
     * Callback fired when the prefix element is clicked.
     */
    onPrefixClick?: (e: React.MouseEvent<HTMLDivElement>) => void
    /**
     * Callback fired when the suffix element is clicked.
     */
    onSuffixClick?: (e: React.MouseEvent<HTMLDivElement>) => void
    /**
     * Show class error for wrap input
     */
    error?: boolean
    /**
     * Callback function that changes the input in date picker
     */
    onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
