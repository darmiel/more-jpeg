import { FaTriangleExclamation } from "react-icons/fa6"

export default function Warning({ warning }: { warning?: string }) {
  return (
    warning && (
      <div className="flex items-center space-x-2 rounded-md border border-red-500 bg-red-500 bg-opacity-25 p-3 text-red-500">
        <FaTriangleExclamation />
        <span>{warning}</span>
      </div>
    )
  )
}
