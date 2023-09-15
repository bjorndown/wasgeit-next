import { createMemo, createSignal, For, Resource } from 'solid-js'
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
        logFilter().length === 0 ? line.length > 0 : line.includes(logFilter())
      )
  )
  return (
    <>
      <input type="text" onInput={event => setLogFilter(event.target.value)} />
      <ul class={styles.loglines}>
        <For each={visibleLines()}>{line => <li class="json">{line}</li>}</For>
      </ul>
    </>
  )
}
