'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface FilterState {
  q: string
  workMode: string
  jobType: string
  experienceLevel: string
  industry: string
  referralAvailable: string
}

interface JobFiltersProps {
  onFilter: (filters: FilterState) => void
}

const WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE']
const JOB_TYPES = ['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP']
const EXPERIENCE_LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
const INDUSTRIES = ['Fintech', 'SaaS', 'Developer Tools', 'Design Tools', 'Cloud Infrastructure', 'Travel & Hospitality', 'Healthcare', 'E-commerce']

const modeLabels: Record<string, string> = {
  REMOTE: 'Remote', HYBRID: 'Hybrid', ONSITE: 'On-site'
}
const typeLabels: Record<string, string> = {
  FULLTIME: 'Full-time', PARTTIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship'
}
const levelLabels: Record<string, string> = {
  ENTRY: 'Entry', MID: 'Mid', SENIOR: 'Senior', LEAD: 'Lead', EXECUTIVE: 'Executive'
}

export function JobFilters({ onFilter }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    q: '', workMode: '', jobType: '', experienceLevel: '', industry: '', referralAvailable: ''
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const update = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: filters[key] === value ? '' : value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const updateSearch = (q: string) => {
    const newFilters = { ...filters, q }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearAll = () => {
    const reset: FilterState = { q: '', workMode: '', jobType: '', experienceLevel: '', industry: '', referralAvailable: '' }
    setFilters(reset)
    onFilter(reset)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-slate" />
        <input
          type="text"
          placeholder="Search jobs, companies, skills..."
          value={filters.q}
          onChange={(e) => updateSearch(e.target.value)}
          className="input pl-11 pr-4"
        />
      </div>

      {/* Quick filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        {WORK_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => update('workMode', mode)}
            className={`chip text-sm ${filters.workMode === mode ? 'chip-active' : ''}`}
          >
            {modeLabels[mode]}
          </button>
        ))}
        <div className="h-5 w-px bg-hairline mx-1" />
        {JOB_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => update('jobType', type)}
            className={`chip text-sm ${filters.jobType === type ? 'chip-active' : ''}`}
          >
            {typeLabels[type]}
          </button>
        ))}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="ml-auto flex items-center gap-1.5 text-caption text-muted-slate hover:text-ink transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showAdvanced ? 'Less' : 'More filters'}
        </button>
        {hasFilters && (
          <button onClick={clearAll} className="flex items-center gap-1 text-caption text-coral hover:opacity-80">
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Experience Level</label>
            <div className="space-y-1.5">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => update('experienceLevel', level)}
                  className={`w-full text-left px-3 py-1.5 rounded-xs text-caption transition-colors ${
                    filters.experienceLevel === level
                      ? 'bg-near-black text-white'
                      : 'hover:bg-soft-stone text-ink'
                  }`}
                >
                  {levelLabels[level]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Industry</label>
            <div className="space-y-1.5">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => update('industry', industry)}
                  className={`w-full text-left px-3 py-1.5 rounded-xs text-caption transition-colors ${
                    filters.industry === industry
                      ? 'bg-near-black text-white'
                      : 'hover:bg-soft-stone text-ink'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Referral</label>
            <button
              onClick={() => update('referralAvailable', 'true')}
              className={`w-full text-left px-3 py-1.5 rounded-xs text-caption transition-colors ${
                filters.referralAvailable === 'true'
                  ? 'bg-near-black text-white'
                  : 'hover:bg-soft-stone text-ink'
              }`}
            >
              Referral Available
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
