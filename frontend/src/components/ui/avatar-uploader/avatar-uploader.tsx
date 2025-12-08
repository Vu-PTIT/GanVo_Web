import React, { useEffect, useRef, useState } from 'react'
import './avatar-uploader.css'

type Props = {
  initialSrc?: string
  accept?: string
  maxSizeMB?: number
  onChange?: (file: File | null) => void
  size?: number // px
}

export default function AvatarUploader({
  initialSrc,
  accept = 'image/*',
  maxSizeMB = 5,
  onChange,
  size = 96
}: Props) {
  const [src, setSrc] = useState<string | null>(initialSrc ?? null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (initialSrc) {
      setSrc(initialSrc)
    }
  }, [initialSrc])

  useEffect(() => {
    return () => {
      // revoke object URLs if created
      if (src && src.startsWith('blob:')) URL.revokeObjectURL(src)
    }
  }, [src])

  const handlePick = () => fileRef.current?.click()

  const handleFile = (f?: File | null) => {
    if (!f) {
      setSrc(initialSrc ?? null)
      onChange?.(null)
      return
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      // simple user feedback; you can replace with nicer UI
      alert(`File quá lớn. Giới hạn ${maxSizeMB} MB.`)
      return
    }
    const url = URL.createObjectURL(f)
    // revoke previous blob url
    if (src && src.startsWith('blob:')) URL.revokeObjectURL(src)
    setSrc(url)
    onChange?.(f)
  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null
    handleFile(file)
    // reset input so same file can be picked again
    if (fileRef.current) fileRef.current.value = ''
  }

  const onRemove = () => handleFile(null)

  return (
    <div className="avatar-uploader">
      <div
        className="avatar-preview"
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onClick={handlePick}
        role="button"
        aria-label="Chọn ảnh đại diện"
      >
        {src ? <img src={src} alt="avatar" /> : <div className="avatar-placeholder">+</div>}
      </div>

      <div className="avatar-controls">
        <button type="button" className="avatar-btn-change" onClick={handlePick}>
          Thay ảnh
        </button>
        <button type="button" className="avatar-btn-remove" onClick={onRemove}>
          Xóa
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
    </div>
  )
}
