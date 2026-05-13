'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Award, Lock, Send } from 'lucide-react'

interface ReferralActionsProps {
  referralId: string
  currentStatus: string
}

export function ReferralActions({ referralId, currentStatus }: ReferralActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const updateStatus = async (status: string) => {
    setLoading(status)
    try {
      await fetch(`/api/referrals/${referralId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: notes || undefined }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    setSending(true)
    try {
      await fetch(`/api/referrals/${referralId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      })
      setMessage('')
      router.refresh()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-display text-feature-heading font-medium text-near-black mb-3">Actions</h3>
        <div className="space-y-2">
          {currentStatus === 'PENDING' && (
            <>
              <button
                onClick={() => updateStatus('ACCEPTED')}
                disabled={loading === 'ACCEPTED'}
                className="btn-primary w-full justify-center"
              >
                <CheckCircle className="w-4 h-4" />
                {loading === 'ACCEPTED' ? 'Accepting...' : 'Accept Request'}
              </button>
              <button
                onClick={() => updateStatus('REJECTED')}
                disabled={loading === 'REJECTED'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm border border-red-200 text-red-600 hover:bg-red-50 text-caption transition-colors"
              >
                <XCircle className="w-4 h-4" />
                {loading === 'REJECTED' ? 'Rejecting...' : 'Reject Request'}
              </button>
            </>
          )}
          {currentStatus === 'ACCEPTED' && (
            <>
              <button
                onClick={() => updateStatus('REFERRED')}
                disabled={loading === 'REFERRED'}
                className="btn-primary w-full justify-center"
              >
                <Award className="w-4 h-4" />
                {loading === 'REFERRED' ? 'Marking...' : 'Mark as Referred ✓'}
              </button>
              <button
                onClick={() => updateStatus('CLOSED')}
                disabled={loading === 'CLOSED'}
                className="btn-secondary w-full justify-center"
              >
                <Lock className="w-4 h-4" />
                Close Request
              </button>
            </>
          )}
          {(currentStatus === 'REFERRED' || currentStatus === 'REJECTED' || currentStatus === 'CLOSED') && (
            <p className="text-caption text-muted-slate text-center py-2">
              This request is {currentStatus.toLowerCase()}.
            </p>
          )}
        </div>

        {/* Internal notes */}
        <div className="mt-4 pt-4 border-t border-hairline">
          <label className="label">Internal Notes</label>
          <textarea
            className="input min-h-[80px] resize-none text-micro"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this candidate..."
          />
        </div>
      </div>

      {/* Send message */}
      {(currentStatus === 'ACCEPTED' || currentStatus === 'REFERRED') && (
        <div className="card">
          <h3 className="font-display text-feature-heading font-medium text-near-black mb-3">Send Message</h3>
          <textarea
            className="input min-h-[80px] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to the candidate..."
          />
          <button onClick={sendMessage} disabled={sending || !message.trim()} className="btn-primary mt-2 w-full justify-center">
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      )}
    </div>
  )
}
