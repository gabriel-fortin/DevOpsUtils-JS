import { useGetFileContentCall } from "@/dataAccess/pullRequest"


const CONTEXT_LINES = 3

export const CodeChunk: React.FC<{
  projectName: string | undefined
  repositoryName: string | undefined
  filePath: string
  commitId: string | undefined
  startLine: number
  endLine: number
}> = ({ projectName, repositoryName, filePath, commitId, startLine, endLine }) => {
  const { content, error } = useGetFileContentCall(projectName, repositoryName, filePath, commitId)

  if (error || !content) return null

  const allLines = content.split("\n")
  const sliceStart = Math.max(0, startLine - 1 - CONTEXT_LINES)
  const sliceEnd = Math.min(allLines.length, endLine + CONTEXT_LINES)
  const presentedLines = allLines.slice(sliceStart, sliceEnd)

  return (
    <div className="mb-2 rounded overflow-auto text-xs font-mono border border-base-300">
      <pre className="m-0 p-0">
        {presentedLines.map((line, i) => {
          const lineNumber = sliceStart + i + 1
          const isHighlighted = lineNumber >= startLine && lineNumber <= endLine
          return (
            <div
              key={lineNumber}
              className={isHighlighted ? "bg-primary-content/20" : ""}
            >
              <span className="select-none inline-block w-10 pr-2 text-right text-primary-content/60 border-r border-base-300 mr-2">
                {lineNumber}
              </span>
              {line}
            </div>
          )
        })}
      </pre>
    </div>
  )
}