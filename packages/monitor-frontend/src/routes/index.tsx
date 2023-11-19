import './index.css'
import { createResource, For } from 'solid-js'
import { A } from '@solidjs/router'
import { attachDevtoolsOverlay } from '@solid-devtools/overlay'

attachDevtoolsOverlay()

const DATE_PATTERN = /^wasgeit\/[0-9]{4}-[0-9]{2}-[0-9]{2}/

export default function Home() {
  const [data] = createResource(async () => {
    const response = await fetch('https://redcoast.fra1.digitaloceanspaces.com')
    const text = await response.text()
    const jsdom = new DOMParser().parseFromString(text, 'application/xml')
    // TODO jfc
    return Array.from(
      new Set(
        Array.from(jsdom.querySelectorAll('Contents'))
          .map((node): string => node.querySelector('Key')?.textContent ?? '')
          .filter(key => DATE_PATTERN.test(key))
          .map(key => key.split('/')[1])
          .reverse()
      ).keys()
    ).slice(0, 30)
  })

  return (
    <main>
      <h1>Status</h1>
      <h2>Runs</h2>
      <ul>
        <For each={data()}>
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
