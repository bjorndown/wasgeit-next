import './index.css'
import { For } from 'solid-js'
import { createServerData$ } from 'solid-start/server'
import { A, useRouteData } from '@solidjs/router'
import { attachDevtoolsOverlay } from '@solid-devtools/overlay'
import { JSDOM } from 'jsdom'

attachDevtoolsOverlay()

const DATE_PATTERN = /^wasgeit\/[0-9]{4}-[0-9]{2}-[0-9]{2}/

export const routeData = () => {
  return createServerData$(async () => {
    const response = await fetch('https://redcoast.fra1.digitaloceanspaces.com')
    const text = await response.text()
    const jsdom = new JSDOM(text)
    return Array.from(new Set(Array.from(jsdom.window.document.querySelectorAll('Contents'))
      .map((node): string => node.querySelector('Key')?.textContent ?? '')
      .filter(key => DATE_PATTERN.test(key))
      .map(key => key.split('/')[1])).keys())
  })
}

export default function Home() {
  const crawlerLogs = useRouteData<typeof routeData>()

  return (
    <main>
      <h1>Status</h1>
      <h2>Runs</h2>
      <ul>
        <For each={crawlerLogs()}>
          {item => (
            <li>
              <A href={`/runs/${item}`}>{item}</A>
            </li>
          )}
        </For>
      </ul>
    </main>
  )
}
