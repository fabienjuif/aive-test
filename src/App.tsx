import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import './App.css'
// TODO: should come from API (fetch or GraphQL client?)
import detections from './porshe-video-object-detections.json'
import { Object, Point } from './types'
import { drawTextBG, roundRect } from './utils'

type VideoEvent = React.SyntheticEvent<HTMLVideoElement, Event>
interface Video {
  width: number
  height: number
}

const getObjectColor = (o: Object) => {
  switch (o.objectClass) {
    case 'OBJECT_CLASS_PERSON':
      return '#e7bd69'
    default:
      return 'pink'
  }
}

const getWidth = ({
  topLeft,
  bottomRight,
}: {
  topLeft: Point
  bottomRight: Point
}) => bottomRight.x - topLeft.x
const getHeight = ({
  topLeft,
  bottomRight,
}: {
  topLeft: Point
  bottomRight: Point
}) => bottomRight.y - topLeft.y

const getDomain = (o: Object) => o.currentAppearance?.boxes.map((b) => b.time)

const getRange = (o: Object, field: 'x' | 'y' | 'width' | 'height') =>
  o.currentAppearance?.boxes.map((b) => {
    switch (field) {
      case 'x':
        return b.box.topLeft.x
      case 'y':
        return b.box.topLeft.y
      case 'width':
        return getWidth(b.box)
      case 'height':
        return getHeight(b.box)
      default:
        return 0
    }
  })

const getScaledValueOverTime =
  (field: 'x' | 'y' | 'width' | 'height', time: number) => (o: Object) => {
    const domain = getDomain(o)
    const range = getRange(o, field)
    if (!domain || !range) {
      throw new Error('No domain or range found')
    }
    const value = d3.scaleLinear().domain(domain).range(range)(time)
    return value
  }

const getAndSetCurrentAppearance = (time: number) => (o: Object) => {
  const appearance = o.appearances.find((a) => {
    const start = a.boxes[0].time
    const end = a.boxes[a.boxes.length - 1].time

    return time > start && time <= end
  })

  o.currentAppearance = appearance

  return appearance
}

function App() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const detachedContainer = useRef(document.createElement('custom'))
  const dataContainer = useRef(d3.select(detachedContainer.current))

  // when data is fetched over HTTP it should trigger this with new data
  // we store it just to speed up a bit the process
  const objects = useRef(
    dataContainer.current
      .selectAll('.box')
      .data(detections.data.analysis.objects, (d: any) => d.id)
      .enter()
      .append('rect')
      .attr('class', 'box')
  )

  const [video, setVideo] = useState<Video>()

  const setCanvasRef = (el: HTMLCanvasElement) => {
    canvas.current = el
    const ctx = canvas.current?.getContext('2d')
    canvasCtx.current = ctx
  }

  // this callback is used to synchronise video with animation frame (boxes)
  const startTime = useRef<number>(0)
  const onTimeUpdate = (e: VideoEvent) => {
    startTime.current = Date.now() - e.currentTarget.currentTime * 1000
  }

  // take care of request animation frame on unmount
  const raf = useRef<number>(0)
  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  })

  const onPlay = (e: VideoEvent) => {
    startTime.current = Date.now() - e.currentTarget.currentTime * 1000

    const drawBoxes = () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        if (!canvas.current || !canvasCtx.current) return

        // TODO: needs to take care of video speed
        const time = Date.now() - startTime.current

        canvasCtx.current.clearRect(
          0,
          0,
          canvas.current.width,
          canvas.current.height
        )

        objects.current
          .filter((o) => !!getAndSetCurrentAppearance(time)(o))
          .attr('x', getScaledValueOverTime('x', time))
          .attr('y', getScaledValueOverTime('y', time))
          .attr('width', getScaledValueOverTime('width', time))
          .attr('height', getScaledValueOverTime('height', time))
          .each(function (o) {
            if (!canvasCtx.current) return

            const node = d3.select(this) as any

            // color and common style
            const color = getObjectColor(o)
            canvasCtx.current.strokeStyle = color
            canvasCtx.current.fillStyle = color
            canvasCtx.current.lineWidth = 2

            // draw box rect around detected object
            roundRect(
              canvasCtx.current,
              +node.attr('x'),
              +node.attr('y'),
              +node.attr('width'),
              +node.attr('height'),
              { tl: 0, bl: 5, br: 5, tr: 5 }
            )

            // draw label on top of the previous box
            const textBoxHeight = 20
            drawTextBG(
              canvasCtx.current,
              'Person',
              'bold 14px serif',
              textBoxHeight,
              10,
              +node.attr('x'),
              +node.attr('y') - textBoxHeight - 1,
              'white',
              color,
              (x, y, w, h) =>
                roundRect(
                  canvasCtx.current as CanvasRenderingContext2D,
                  x,
                  y,
                  w,
                  h,
                  { tl: 5, bl: 0, br: 0, tr: 5 },
                  true,
                  true
                )
            )
          })

        drawBoxes()
      })
    }
    drawBoxes()
  }

  const onEnded = () => {
    if (raf.current) cancelAnimationFrame(raf.current)
  }

  const onPause = () => {
    onEnded()
  }

  const onLoadedData = (e: VideoEvent) => {
    setVideo({
      width: e.currentTarget.videoWidth,
      height: e.currentTarget.videoHeight,
    })
  }

  return (
    <div className="App">
      <video
        controls
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        onPlay={onPlay}
        onEnded={onEnded}
        onPause={onPause}
      >
        <source src="assets/porshe.mp4" type="video/mp4" />
      </video>
      {video && (
        <canvas
          width={video.width}
          height={video.height}
          className="detections"
          ref={setCanvasRef}
        />
      )}
    </div>
  )
}

export default App
