import { ExplorationPage } from '@/components/ExplorationPage'
import { TOTAL_PAGES } from '@/components/logos'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Assembly Intelligence Lab | Logo Exploration',
}

interface PageProps {
  params: Promise<{
    number: string
  }>
}

export async function generateStaticParams() {
  const pages = []
  for (let i = 2; i <= TOTAL_PAGES; i++) {
    pages.push({ number: i.toString() })
  }
  return pages
}

export default async function PaginationPage(props: PageProps) {
  const params = await props.params
  const pageNumber = parseInt(params.number, 10)

  if (isNaN(pageNumber) || pageNumber < 2 || pageNumber > TOTAL_PAGES) {
    notFound()
  }

  return <ExplorationPage currentPage={pageNumber} />
}
