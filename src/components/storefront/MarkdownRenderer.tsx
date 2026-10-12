import React from "react"

export function renderInline(text: string): React.ReactNode {
  // Matches [label](url), **bold**, and *italic*
  const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*[^*]+?\*)/g
  const parts = text.split(tokenRegex)

  return parts.map((part, i) => {
    if (!part) return null

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          className="text-brand-gold underline hover:opacity-80 font-bold"
          target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      )
    }

    // Bold: **content**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-brand-slate">
          {part.slice(2, -2)}
        </strong>
      )
    }

    // Italic: *content*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
      return (
        <em key={i} className="italic text-slate-600">
          {part.slice(1, -1)}
        </em>
      )
    }

    return part
  })
}

export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null

  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  let currentList: { type: "ul" | "ol"; items: string[] } | null = null
  let currentParagraphLines: string[] = []

  const flushParagraph = (key: string | number) => {
    if (currentParagraphLines.length > 0) {
      const paragraphText = currentParagraphLines.join(" ").trim()
      if (paragraphText) {
        elements.push(
          <p key={`p-${key}`} className="text-slate-700 leading-relaxed mb-4">
            {renderInline(paragraphText)}
          </p>
        )
      }
      currentParagraphLines = []
    }
  }

  const flushList = (key: string | number) => {
    if (currentList) {
      if (currentList.type === "ul") {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 space-y-2 mb-5 text-slate-700">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 space-y-2 mb-5 text-slate-700">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        )
      }
      currentList = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // Blank line
    if (!trimmed) {
      flushParagraph(i)
      flushList(i)
      continue
    }

    // Heading 3: ### ...
    if (trimmed.startsWith("### ")) {
      flushParagraph(i)
      flushList(i)
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-black text-brand-slate mt-8 mb-3 pb-2 border-b border-slate-100">
          {renderInline(trimmed.replace(/^###\s+/, ""))}
        </h3>
      )
      continue
    }

    // Heading 2: ## ...
    if (trimmed.startsWith("## ")) {
      flushParagraph(i)
      flushList(i)
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-black text-brand-slate mt-9 mb-4 pb-2 border-b border-slate-200">
          {renderInline(trimmed.replace(/^##\s+/, ""))}
        </h2>
      )
      continue
    }

    // Heading 1: # ...
    if (trimmed.startsWith("# ")) {
      flushParagraph(i)
      flushList(i)
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl font-black text-brand-slate mt-10 mb-4">
          {renderInline(trimmed.replace(/^#\s+/, ""))}
        </h1>
      )
      continue
    }

    // Standalone bold label: **Satıcı** or **Alıcı**
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")) {
      flushParagraph(i)
      flushList(i)
      elements.push(
        <h4 key={`h4-${i}`} className="text-base font-black text-brand-slate mt-5 mb-2">
          {trimmed.slice(2, -2)}
        </h4>
      )
      continue
    }

    // Bullet item: * or -
    if (/^[\*\-]\s+/.test(trimmed)) {
      flushParagraph(i)
      const itemContent = trimmed.replace(/^[\*\-]\s+/, "")
      if (!currentList || currentList.type !== "ul") {
        flushList(i)
        currentList = { type: "ul", items: [itemContent] }
      } else {
        currentList.items.push(itemContent)
      }
      continue
    }

    // Numbered item: 1. ...
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (numMatch && trimmed.length > 3) {
      flushParagraph(i)
      const itemContent = numMatch[2]
      if (!currentList || currentList.type !== "ol") {
        flushList(i)
        currentList = { type: "ol", items: [itemContent] }
      } else {
        currentList.items.push(itemContent)
      }
      continue
    }

    // Info line starting with key: **Key:** Value
    if (trimmed.startsWith("**") && trimmed.includes(":**")) {
      flushParagraph(i)
      flushList(i)
      elements.push(
        <p key={`kv-${i}`} className="text-slate-700 leading-relaxed mb-2">
          {renderInline(trimmed)}
        </p>
      )
      continue
    }

    // Italic note paragraph: *Note*
    if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
      flushParagraph(i)
      flushList(i)
      elements.push(
        <p key={`italic-${i}`} className="text-slate-500 italic text-sm leading-relaxed my-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          {trimmed.slice(1, -1)}
        </p>
      )
      continue
    }

    // Regular paragraph line
    flushList(i)
    currentParagraphLines.push(trimmed)
  }

  flushParagraph("end")
  flushList("end")

  return <div className="space-y-1">{elements}</div>
}
