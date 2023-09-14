import { createEffect, createMemo, createSignal, For, Resource } from 'solid-js'
import styles from './LogfileViewer.module.css'

export const LogfileViewer = (props: {
  logLines: Resource<string | undefined>
}) => {
  const [logFilter, setLogFilter] = createSignal('')
  const visibleLines = createMemo(() =>
    props
      .logLines()
      ?.split('\n')
      .reverse()
      .filter(line =>
        logFilter().length === 0 ? true : line.includes(logFilter())
      )
  )
  createEffect(() => console.log(logFilter()))
  return (
    <>
      <input type="text" onInput={event => setLogFilter(event.target.value)} />
      <ul class={styles.loglines}>
        <For each={visibleLines()}>
          {line => <li>{line.split(logFilter())}</li>}
        </For>
      </ul>
    </>
  )
}
