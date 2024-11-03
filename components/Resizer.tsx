'use client'

import { Header, Table } from '@tanstack/react-table'
import { MouseEvent, useEffect, useState } from 'react'

interface ResizerProps {
  header: Header<any, unknown>
  table: Table<any>
}

export function Resizer({ header, table }: ResizerProps) {
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!isResizing) return

    function onMouseMove(e: MouseEvent) {
      header.getResizeHandler()(e)
    }

    function onMouseUp() {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', onMouseMove as any)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove as any)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [header, isResizing])

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault()
        setIsResizing(true)
      }}
      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none ${
        isResizing ? 'bg-primary' : 'bg-border'
      }`}
    />
  )
} 