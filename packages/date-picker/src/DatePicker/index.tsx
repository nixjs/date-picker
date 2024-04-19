import React from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'
import isValid from 'date-fns/isValid'
import { useOnClickOutside, composeRef } from '../hooks'
import { Calendar } from '../Calendar'
import { CalendarTypes, DatePickerTypes } from '../types'
import * as CalendarUtils from '../utils'
import { DatePickerInput } from './types'

export const DatePicker = React.forwardRef<
    HTMLInputElement,
    { portalProps: DatePickerTypes.Portal } & { inputProps: DatePickerInput } & { calendarProps: DatePickerTypes.Calendar }
>(
    (
        props: { portalProps: DatePickerTypes.Portal; inputProps: DatePickerInput; calendarProps: DatePickerTypes.Calendar },
        ref: React.Ref<HTMLInputElement | null>
    ) => {
        const { portalProps, calendarProps, inputProps } = props
        const { suffixClassName, suffixHTML, prefixHTML, prefixClassName, onSuffixClick, onPrefixClick, ...ourInputProps } = inputProps

        const {
            offset = [0, 5],
            zindex = 9990,
            onHide,
            onShow,
            placement = 'bottom',
            strategy = 'fixed',
            visible,
            trigger = 'click',
            formatInput = 'dd/MM/yyyy',
            character = ' ~ ',
            format,
            onChangeCalendarDate,
            classNameWrapper,
            loading = false,
        } = portalProps

        const id = React.useId()
        const portalRef = React.useRef()
        const datePickerRef = React.useRef<HTMLDivElement | null>(null)
        const [_visible, setVisible] = React.useState(visible)

        useOnClickOutside(datePickerRef, () => setVisible(false))

        const inputRef = React.useRef<HTMLInputElement | null>(null)
        const [focus, setFocus] = React.useState<boolean>(false)
        const [dateInputValue, setDateInputValue] = React.useState<string | undefined>('')
        const [storeDate, setStoreDate] = React.useState<Date | undefined>(undefined)
        const [storeDateRange, setStoreDateRange] = React.useState<Array<Date | undefined> | undefined>(undefined)

        const [referenceElement, setReferenceElement] = React.useState(null)
        const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null)
        const { styles, attributes } = usePopper(referenceElement, popperElement, {
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: offset,
                    },
                },
            ],
            placement: placement,
            strategy,
        })

        const getTransitionClass = (state: string) => {
            return state === 'entering' ? 'fade' : state === 'entered' ? 'fade show' : state === 'exiting' ? 'fade' : 'fade'
        }

        const handleCalendar = (date: Date | Array<Date>) => {
            if (!date || (date instanceof Array && Number(date?.length) === 0)) return false
            if (date instanceof Date && isValid(date) && calendarProps.dateMode === 'single') {
                setDateInputValue(CalendarUtils.toFormat(date, formatInput))
                onChangeCalendarDate?.(format ? CalendarUtils.toFormat(date, format) : date)
                setStoreDate(date)
            } else if (date instanceof Array && calendarProps.dateMode === 'range') {
                const value = `${CalendarUtils.toFormat(date[0], formatInput)}${character}${CalendarUtils.toFormat(date[1], formatInput)}`
                setDateInputValue(value)
                onChangeCalendarDate?.(format ? [CalendarUtils.toFormat(date[0], format), CalendarUtils.toFormat(date[1], format)] : date)
                setStoreDateRange(date)
            }
            setVisible(false)
        }

        const handleSuffixClick = () => {
            if (!calendarProps.disabled) setVisible(!_visible)
        }

        const handleFocus: React.FocusEventHandler<HTMLDivElement> = React.useCallback(
            (e) => {
                if (calendarProps.disabled) {
                    e.stopPropagation()
                    return false
                }
                inputRef.current?.focus()
                setFocus(true)
            },
            [calendarProps.disabled]
        )

        const handleBlur: React.FocusEventHandler<HTMLDivElement> = React.useCallback(
            (e) => {
                if (calendarProps.disabled) {
                    e.stopPropagation()
                    return false
                }
                setFocus(false)
            },
            [calendarProps.disabled]
        )

        React.useEffect(() => {
            if (
                calendarProps.dateMode === 'single' &&
                calendarProps?.date &&
                calendarProps?.date instanceof Date &&
                isValid(calendarProps?.date)
            ) {
                setDateInputValue(CalendarUtils.toFormat(calendarProps?.date, formatInput))
                setStoreDate(calendarProps?.date)
            }
            if (calendarProps.dateMode === 'range' && calendarProps?.dateRange?.[0] && calendarProps?.dateRange?.[1]) {
                const value = `${CalendarUtils.toFormat(calendarProps?.dateRange?.[0], formatInput)}${character}${CalendarUtils.toFormat(
                    calendarProps?.dateRange?.[1],
                    formatInput
                )}`
                setDateInputValue(value)
                setStoreDateRange(calendarProps?.dateRange)
            }
        }, [calendarProps?.date, calendarProps.dateMode, calendarProps?.dateRange, formatInput, character])

        return (
            <div id={`date-picker-input-${id}`} className={classNames('date-picker date-picker--single', classNameWrapper, { loading })}>
                {React.cloneElement(
                    <div className={classNames('date-picker-input', inputProps.classNameInputWrapper)}>
                        <div
                            className={classNames('date-picker-input-content', inputProps.classNameInputContent, {
                                'date-picker-input-content--disabled': calendarProps.disabled,
                                'date-picker-input-content--focused': focus,
                                'date-picker-input-content--error': inputProps.error,
                            })}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onClick={handleSuffixClick}
                        >
                            {prefixHTML && (
                                <div
                                    className={classNames('date-picker-addon date-picker-addon--prefix', prefixClassName)}
                                    onClick={onPrefixClick}
                                    role="presentation"
                                >
                                    {prefixHTML}
                                </div>
                            )}
                            <input
                                {...ourInputProps}
                                ref={composeRef(ref, inputRef) as any}
                                value={!loading ? dateInputValue : `${formatInput}${character}${formatInput}`}
                                onChange={inputProps?.onChangeInput}
                                className={classNames('date-picker-input-content-typing', inputProps.classNameInputLabel)}
                                disabled={calendarProps?.disabled}
                                readOnly={calendarProps?.disabled}
                            />
                            {suffixHTML && (
                                <div
                                    className={classNames('date-picker-addon date-picker-addon--suffix', suffixClassName)}
                                    onClick={onSuffixClick}
                                    role="presentation"
                                >
                                    {suffixHTML}
                                </div>
                            )}
                        </div>
                    </div>,
                    {
                        ref: setReferenceElement,
                        ...((trigger === 'click' || trigger.includes('click')) && {
                            onClick: () => setVisible(!_visible),
                        }),
                        ...((trigger === 'focus' || trigger.includes('focus')) && {
                            onFocus: () => setVisible(true),
                            onBlur: () => setVisible(false),
                        }),
                        ...((trigger === 'hover' || trigger.includes('hover')) && {
                            onMouseEnter: () => setVisible(true),
                            onMouseLeave: () => setVisible(false),
                        }),
                    }
                )}
                {typeof window !== 'undefined' &&
                    createPortal(
                        <Transition
                            in={_visible}
                            mountOnEnter
                            nodeRef={portalRef}
                            onEnter={onShow}
                            onExit={onHide}
                            timeout={{
                                enter: 0,
                                exit: 200,
                            }}
                            unmountOnExit
                        >
                            {(state) => {
                                const transitionClass = getTransitionClass(state)
                                return (
                                    <div
                                        id={`date-picker-content-${id}`}
                                        className={classNames(
                                            'date-picker',
                                            `date-picker-${placement.replace('left', 'start').replace('right', 'end')}`,
                                            transitionClass,
                                            {
                                                show: state === 'entered',
                                            }
                                        )}
                                        ref={setPopperElement}
                                        role="dialog"
                                        style={{ ...styles.popper, zIndex: zindex }}
                                        {...attributes.popper}
                                    >
                                        <div ref={datePickerRef}>
                                            <Calendar
                                                {...calendarProps}
                                                date={storeDate}
                                                dateRange={storeDateRange}
                                                onChange={handleCalendar}
                                            />
                                        </div>
                                    </div>
                                )
                            }}
                        </Transition>,
                        document.body
                    )}
            </div>
        )
    }
)
