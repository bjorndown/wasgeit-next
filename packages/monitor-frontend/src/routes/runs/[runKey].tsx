import { useParams, useRouteData } from '@solidjs/router'
import { createRouteData, RouteDataArgs } from 'solid-start'
import { createResource, createSignal, For, Show } from 'solid-js'
import './runs.module.css'
import type { StrippedSummary } from '@wasgeit/crawler/src/lib/crawler'
import type { Event } from '@wasgeit/common/src/types'
import { EventsPerVenueChart } from '~/components/EventsPerVenueChart'
import { LogfileViewer } from '~/components/LogFileViewer'

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
  const params = useParams()
  const [loadingEventsError, setLoadingEventsError] = createSignal<
    string | undefined
  >()
  const [loadingSummaryError, setLoadingSummaryError] = createSignal<
    string | undefined
  >()
  const logLines = useRouteData<typeof routeData>()
  const [results] = createResource<StrippedSummary>(() =>
    fetch(
      new URL(
        `wasgeit/${params.runKey}/summary.json`,
        'https://redcoast.fra1.digitaloceanspaces.com'
      ).toString()
    )
      .then(r => {
        if (!r.ok) {
          setLoadingSummaryError(
            `Loading summary failed with status ${r.status} ${r.statusText}`
          )
          return { successful: [], broken: [] }
        }
        return r.json()
      })
      .catch(error => {
        console.error(error)
        return { successful: [], broken: [] }
      })
  )
  const [events] = createResource<Event[]>(
    () =>
      fetch(
        new URL(
          `wasgeit/${params.runKey}/events.json`,
          'https://redcoast.fra1.digitaloceanspaces.com'
        ).toString()
      )
        .then(r => {
          if (!r.ok) {
            setLoadingEventsError(
              `Loading events failed with status ${r.status} ${r.statusText}`
            )
            return []
          }
          return r.json()
        })
        .catch(error => {
          console.error(error)
          return []
        }),
    { initialValue: [] }
  )

  return (
    <main>
      <h1>Run {params.runKey}</h1>
      <h2>Events</h2>
      <Show
        when={!loadingEventsError()}
        fallback={<p>Cannot show events: {loadingEventsError()}</p>}
      >
        <EventsPerVenueChart events={events} />
      </Show>
      <h2>Crawlers</h2>
      <Show when={loadingSummaryError()}>
        <p>Cannot show anything here: {loadingSummaryError()}</p>
      </Show>
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
                        <p class="json">
                          {JSON.stringify(ignored.event, null, 2)}
                        </p>
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
      <LogfileViewer logLines={logLines} />
    </main>
  )
}
