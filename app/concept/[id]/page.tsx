import { SingleConceptPage } from '@/components/SingleConceptPage'
import { ALL_LOGO_CONCEPTS } from '@/components/logos'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata(props: ConceptPageProps): Promise<Metadata> {
  const params = await props.params
  const conceptId = parseInt(params.id, 10)

  if (isNaN(conceptId) || conceptId < 1 || conceptId > ALL_LOGO_CONCEPTS.length) {
    return { title: 'Not Found' }
  }

  const concept = ALL_LOGO_CONCEPTS[conceptId - 1]
  return {
    title: `Concept ${concept.id.toString().padStart(2, '0')} — ${concept.name} — Assembly Intelligence Lab`,
    description: concept.description,
  }
}

interface ConceptPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return ALL_LOGO_CONCEPTS.map((concept) => ({
    id: concept.id.toString().padStart(2, '0'),
  }))
}

export default async function ConceptPage(props: ConceptPageProps) {
  const params = await props.params
  const conceptId = parseInt(params.id, 10)

  if (isNaN(conceptId) || conceptId < 1 || conceptId > ALL_LOGO_CONCEPTS.length) {
    notFound()
  }

  return <SingleConceptPage conceptId={conceptId} />
}
