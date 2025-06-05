import { FC, RefObject, useImperativeHandle, useRef } from "react"

import { useProjectUrl } from "@/state/projectUrl"


export type TaskEditDialogActions = {
  showDialog: () => void
}


export const TaskEditDialog: FC<{
  workItemId: number | null
  title: string
  ref: RefObject<TaskEditDialogActions>
}> = ({
  workItemId,
  title,
  ref,
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useImperativeHandle(ref, () => {
      return {
        showDialog() {
          dialogRef.current?.showModal()
        }
      }
    }, [])

    if (!workItemId) return null

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold mb-3">{title}</h2>
          <p>This task is already added to the current work item</p>

          <div className="modal-action">
            <DevOpsLinkButton workItemId={workItemId} />
          </div>

          <DialogClosingButton />
        </div>

        <DialogClosingBackdrop />
      </dialog>
    )
  }


const DevOpsLinkButton: FC<{
  workItemId: number
}> = ({
  workItemId,
}) => {
    const { projectUrl } = useProjectUrl()

    if (!workItemId) {
      return (
        <span className="btn btn-disabled">
          Edit in DevOps
          <span className="text-xl">↗</span>
        </span>
      )
    }

    const url = `${projectUrl}/_workitems/edit/${workItemId}`

    return (
      <a className="btn btn-info btn-outline" target="_blank" href={url}>
        Edit in DevOps
        <span className="text-xl">↗</span>
      </a>
    )
  }

function DialogClosingButton() {
  return (
    <form method="dialog">
      <button className="btn btn-ghost btn-circle absolute right-2 top-2 text-xl" title="Close">
        <span aria-hidden={true}> × </span>
      </button>
    </form>
  )
}

function DialogClosingBackdrop() {
  return (
    <form method="dialog" className="modal-backdrop">
      <button className="bg-transparent border-0">
        Close
      </button>
    </form>
  )
}