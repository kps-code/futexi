import type { Metadata } from 'next'
import { DemoShell } from '@/components/demos-shared/chrome'
import { CtaBand } from '@/components/demos-shared/sections'
import { nila } from '@/content/demo-businesses'
import { interiorKinds, interiorProjects } from '@/content/demo-interior'
import { getSiteSettings } from '@/server/site-data'
import { playfair } from '../font'
import { ProjectList } from './project-list'

export const metadata: Metadata = {
  title: `Projects · ${nila.name}`,
  description: `${interiorProjects.length} homes, offices and cafes across Chennai, designed and built by ${nila.name}. Portfolio website concept by KAPOSA FUTEXI.`,
}

/** Interior Designer demo: the projects gallery with filters. */
export default async function NilaProjectsPage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell
      business={nila}
      whatsappNumber={settings.whatsappNumber}
      ctaHref={`${nila.path}#enquire`}
      className={playfair.variable}
    >
      <section className="container-dm pt-12 pb-8 sm:pt-16 sm:pb-10">
        <p className="text-dm-accent-ink text-xs font-semibold tracking-[0.18em] uppercase">Portfolio</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Spaces that feel lived in.
        </h1>
        <p className="text-dm-muted mt-5 max-w-2xl text-pretty sm:text-lg">
          {interiorProjects.length} projects across Chennai: homes, an office and a cafe. Filter by type, then
          open any project for the full story, palette and plans.
        </p>
      </section>
      <ProjectList projects={interiorProjects} kinds={interiorKinds} basePath={nila.path} />
      <CtaBand
        business={nila}
        title="Have a space in mind?"
        line="Send a few photos and the floor plan if you have one. We reply within a working day."
        href={`${nila.path}#enquire`}
        label="Start a project"
      />
    </DemoShell>
  )
}
