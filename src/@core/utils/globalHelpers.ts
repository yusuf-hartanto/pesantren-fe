export const getAllTablerIcons = (): string[] => {
  const icons = new Set<string>()

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | undefined

    try {
      rules = sheet.cssRules
    } catch {
      continue
    }

    if (!rules) continue

    for (const rule of Array.from(rules)) {
      if (
        rule instanceof CSSStyleRule &&
        rule.selectorText.startsWith('.tabler-')
      ) {
        const selectors = rule.selectorText.split(',')

        selectors.forEach(sel => {
          const name = sel.trim().replace('.', '').split(':')[0]

          if (name.startsWith('tabler-')) {
            icons.add(name)
          }
        })
      }
    }
  }

  return Array.from(icons).sort()
}
