import { Spinner } from "./spinner"

interface LoadingSpinnerProps {
  size?: number
}

export function LoadingSpinner({ size = 24 }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <Spinner size={size} />
    </div>
  )
}

