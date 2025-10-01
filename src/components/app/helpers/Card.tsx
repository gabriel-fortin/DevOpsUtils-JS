
const Card: React.FC<{
  children?: React.ReactNode
  render?: React.ReactNode
  isHighlighted?: boolean
}> = ({
  children,
  render: childrenToRender,
  isHighlighted = false,
}) => {
    const border = isHighlighted ? "border border-accent" : "border-2 border-primary"
    return (
      <div className={`card p-4 m-1 ${border}`}>
        {childrenToRender}
        {children}
        {isHighlighted &&
          <span className="absolute left-0.5 top-4 bottom-4
                          rounded-sm bg-accent w-0.5 animate-pulse">
          </span>}
      </div>
    )
  }

export default Card