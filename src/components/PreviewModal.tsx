import { useEffect, useMemo } from 'react'
import { Download, ExternalLink, X } from 'lucide-react'
import { fileNameFor, stubFile } from '../lib/api'
import type { Launch } from '../lib/types'
import { Modal } from './Modal'

export function useLaunchFile(l: Launch | null) {
  const stub = useMemo(() => (l && !l.file ? stubFile(l) : null), [l])
  const blobUrl = useMemo(() => (stub ? URL.createObjectURL(new Blob([stub.content], { type: stub.type })) : null), [stub])
  useEffect(() => () => void (blobUrl && URL.revokeObjectURL(blobUrl)), [blobUrl])
  return {
    url: l?.file ?? blobUrl ?? '',
    name: l ? fileNameFor(l) : '',
    previewable: !!l && l.format !== 'cli',
  }
}

export function PreviewModal({ launch, onClose }: { launch: Launch | null; onClose: () => void }) {
  const { url, name, previewable } = useLaunchFile(launch)
  return (
    <Modal open={!!launch} onClose={onClose} label={`Preview ${launch?.name ?? ''}`} wide>
      <div className="pv-head">
        <div className="pv-title">
          <strong>{launch?.name}</strong>
          <span className="mono faint">{name}</span>
        </div>
        <div className="pv-actions">
          <a className="btn btn-secondary btn-sm" href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Open
          </a>
          <a className="btn btn-secondary btn-sm" href={url} download={name}>
            <Download size={14} /> Download
          </a>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close preview">
            <X size={18} />
          </button>
        </div>
      </div>
      {previewable ? (
        <iframe className="pv-frame" src={url} title={`${launch?.name} preview`} sandbox="allow-scripts allow-same-origin allow-downloads allow-forms" />
      ) : (
        <div className="pv-cli">
          <p className="mono">$ node {name}</p>
          <p className="muted">Command-line builds run in a terminal. Download the file and run it with Node.js.</p>
        </div>
      )}
    </Modal>
  )
}
