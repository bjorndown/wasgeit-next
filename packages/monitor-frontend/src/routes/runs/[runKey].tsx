import { useParams, useRouteData } from '@solidjs/router'
import { createRouteData, RouteDataArgs } from 'solid-start'
import { createResource, For, Show } from 'solid-js'
import styles from './runs.module.css'
import type { StrippedSummary } from '@wasgeit/crawler/src/lib/crawler'
import type { Event } from '@wasgeit/common/src/types'
import { EventsPerVenueChart } from '~/components/EventsPerVenueChart'
import { EVENTS_JSON_URL } from '@wasgeit/common/src/constants'

export const routeData = ({ params }: RouteDataArgs) => {
  return createRouteData(async () => {
    const response = await fetch(
      new URL(
        `wasgeit/${params.runKey}/log.jsonl`,
        'https://redcoast.fra1.digitaloceanspaces.com'
      ).toString()
    )
    return response.text()
  })
}

export default function Runs() {
  const crawlerLogs = useRouteData<typeof routeData>()
  const params = useParams()
  const [results] = createResource<StrippedSummary>(() =>
    fetch(
      new URL(
        `wasgeit/${params.runKey}/summary.json`,
        'https://redcoast.fra1.digitaloceanspaces.com'
      ).toString()
    ).then(r => r.json())
  )
  const [events] = createResource<Event[]>(
    () => fetch(EVENTS_JSON_URL).then(r => r.json()),
    { initialValue: [] }
  )

  return (
    <main>
      <h1>Run {params.runKey}</h1>
      <h2>Summary</h2>
      <EventsPerVenueChart events={events} />
      <Show when={results()?.broken?.length}>
        <h3>Broken</h3>
        <For each={results()?.broken}>
          {result => (
            <>
              <h4>{result.crawlerKey}</h4>
              {result.error.message}
            </>
          )}
        </For>
      </Show>
      <Show when={results()?.successful?.length}>
        <h3>Problems</h3>
        <For each={results()?.successful}>
          {result => (
            <Show when={result.ignored.length || result.broken.length}>
              <h4>{result.key}</h4>
              <Show when={result.ignored.length}>
                <h5>Ignored</h5>
                <ul>
                  <For each={result.ignored}>
                    {ignored => (
                      <li>
                        {ignored.reason}:{' '}
                        <pre>{JSON.stringify(ignored.event, null, 2)}</pre>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
              <Show when={result.broken.length}>
                <h5>Ignored</h5>
                <ul>
                  <For each={result.broken}>
                    {broken => <li>{JSON.stringify(broken)}</li>}
                  </For>
                </ul>
              </Show>
            </Show>
          )}
        </For>
      </Show>
      <h2>Log</h2>
      <ul class={styles.loglines}>
        <For each={crawlerLogs()?.split('\n').reverse()}>
          {line => <li>{line}</li>}
        </For>
      </ul>
      <h2>Events</h2>
    </main>
  )
}
