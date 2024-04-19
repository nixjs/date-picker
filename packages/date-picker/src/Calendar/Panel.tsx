import React from 'react'

const Panel = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    (props: React.PropsWithChildren, ref: React.Ref<HTMLDivElement | null>) => {
        const { children } = props
        return React.createElement(
            'div',
            {
                className: 'calendar',
                ref,
            },
            <div className="calendar-panel">
                <div className="calendar-panel-inner">{children}</div>
            </div>
        )
    }
)

Panel.displayName = 'Panel'

export default Panel
