import React from 'react'
import { CalendarTypes } from './types'
import { addDateByMode, getNextMode, subDateByMode } from './utils'

const modeAccepted: Record<CalendarTypes.Mode, CalendarTypes.Mode[]> = {
    month: ['month', 'year', 'decade'],
    year: ['year', 'decade'],
    decade: ['decade'],
}

export const useMode = (modeInput?: CalendarTypes.Mode) => {
    const [mode, setMode] = React.useState<CalendarTypes.Mode>(modeInput ?? 'month')

    const onSwitchMode = React.useCallback(() => {
        const next = getNextMode(mode)
        if (!modeInput || (modeInput && modeAccepted[modeInput].includes(next))) setMode(next)
    }, [setMode, mode, modeInput])

    return {
        mode,
        setMode,
        onSwitchMode,
    }
}

export const useCursorDate = ({ date, mode }: { date: Date; mode: CalendarTypes.Mode }) => {
    const [cursorDate, setCursorDate] = React.useState<Date>(date)

    const onSubCursorDate = React.useCallback(() => {
        setCursorDate(subDateByMode(cursorDate, mode))
    }, [setCursorDate, subDateByMode, cursorDate, mode])

    const onAddCursorDate = React.useCallback(() => {
        setCursorDate(addDateByMode(cursorDate, mode))
    }, [setCursorDate, addDateByMode, cursorDate, mode])

    return {
        cursorDate,
        setCursorDate,
        onSubCursorDate,
        onAddCursorDate,
    }
}

export const useIsomorphicEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
    eventName: K,
    handler: (event: MediaQueryListEventMap[K]) => void,
    element: React.RefObject<MediaQueryList>,
    options?: boolean | AddEventListenerOptions
): void

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element?: undefined,
    options?: boolean | AddEventListenerOptions
): void

// Element Event based useEventListener interface
function useEventListener<
    K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
    T extends Element = K extends keyof HTMLElementEventMap ? HTMLDivElement : SVGElement
>(
    eventName: K,
    handler: ((event: HTMLElementEventMap[K]) => void) | ((event: SVGElementEventMap[K]) => void),
    element: React.RefObject<T>,
    options?: boolean | AddEventListenerOptions
): void

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    element: React.RefObject<Document>,
    options?: boolean | AddEventListenerOptions
): void

function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
    KM extends keyof MediaQueryListEventMap,
    T extends HTMLElement | SVGAElement | MediaQueryList = HTMLElement
>(
    eventName: KW | KH | KM,
    handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | SVGElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void,
    element?: React.RefObject<T>,
    options?: boolean | AddEventListenerOptions
) {
    // Create a ref that stores handler
    const savedHandler = React.useRef(handler)

    useIsomorphicEffect(() => {
        savedHandler.current = handler
    }, [handler])

    React.useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current ?? window

        if (!(targetElement && targetElement.addEventListener)) return

        // Create event listener that calls handler function stored in ref
        const listener: typeof handler = (event) => {
            savedHandler.current(event)
        }

        targetElement.addEventListener(eventName, listener, options)

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, listener, options)
        }
    }, [eventName, element, options])
}

type EventType = 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'focusin' | 'focusout'

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: React.RefObject<T> | React.RefObject<T>[],
    handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
    eventType: EventType = 'mousedown',
    eventListenerOptions: AddEventListenerOptions = {}
): void {
    useEventListener(
        eventType,
        (event) => {
            const target = event.target as Node

            // Do nothing if the target is not connected element with document
            if (!target || !target.isConnected) {
                return
            }

            const isOutside = Array.isArray(ref)
                ? ref.filter((r) => Boolean(r.current)).every((r) => r.current && !r.current.contains(target))
                : ref.current && !ref.current.contains(target)

            if (isOutside) {
                handler(event)
            }
        },
        undefined,
        eventListenerOptions
    )
}

export function fillRef<T>(ref: React.Ref<T>, node: T) {
    if (typeof ref === 'function') {
        ref(node)
    } else if (typeof ref === 'object' && ref && 'current' in ref) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(ref as any).current = node
    }
}

export function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
    const refList = refs.filter((ref) => ref)
    if (refList.length <= 1) {
        return refList[0]
    }

    return (node: T) => {
        refs.forEach((ref) => {
            fillRef(ref, node)
        })
    }
}
