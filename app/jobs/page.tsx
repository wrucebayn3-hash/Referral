'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFilters } from '@/components/jobs/JobFilters'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<any>({})
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const fetchJobs = useCallback(async (newFilters: any, newPage = 1) => {
    setLoading(true)
    const params = new URLSearchParams({
      ...newFilters,
      page: String(newPage),
      limit: '12',
    })
    Object.keys(params).forEach((key) => {
      if (!params.get(key)) params.delete(key)
    })
    try {
      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      setJobs(data.jobs || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs({})
  }, [fetchJobs])

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters)
    setPage(1)
    fetchJobs(newFilters, 1)
  }

  const handleSave = async (jobId: string) => {
    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (data.saved) {
        setSavedJobs((prev) => new Set([...prev, jobId]))
      } else {
        setSavedJobs((prev) => {
          const next = new Set(prev)
          next.delete(jobId)
          return next
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchJobs(filters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-soft-stone border-b border-hairline py-10">
          <div className="section-container">
            <h1 className="font-display text-section-heading font-normal text-near-black mb-1">
              Browse Jobs
            </h1>
            <p className="text-caption text-muted-slate">
              {total > 0 ? `${total} jobs available` : 'Find your next opportunity'}
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Filters */}
          <div className="mb-8">
            <JobFilters onFilter={handleFilter} />
          </div>

          {/* Results */}
          {loading ? (
            <PageLoading />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description="Try adjusting your filters or check back later for new openings."
            />
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    saved={savedJobs.has(job.id)}
                    onSave={handleSave}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-sm border border-hairline text-caption text-ink hover:bg-soft-stone disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-caption text-muted-slate">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-sm border border-hairline text-caption text-ink hover:bg-soft-stone disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
