'use client'

import { deleteUser } from '@/lib/action'
import { useFormStatus } from 'react-dom'
import toast from 'react-hot-toast'

export default function DeleteForm({
  _id,
  name,
}: {
  _id: string
  name: string
}) {
  const { pending } = useFormStatus()
  return (
    <form
      action={async (formData) => {
        const confirmReset = window.confirm(
          "Are you sure to delete this user?"
        );
        if (confirmReset) {
        const res = await deleteUser(formData)
        toast.success(res.message, { duration: 4000, position: "top-center", })}
      }}
    >
      <input type="hidden" name="_id" value={_id} />
      <input type="hidden" name="name" value={name} />
      <button type="submit" disabled={pending} className="btn btn-error btn-outline">
        Delete
      </button>
    </form>
  )
}