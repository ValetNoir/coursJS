class Pattern {
    constructor(regex, replacement) {
        this.regex = regex
        this.replacement = replacement
    }
  
    apply(raw) {
        return raw.replace(this.regex, this.replacement)
    }
}

class Rule {
    constructor(name, patterns) {
        this.name = name
        this.patterns = patterns
    }
  
    apply(raw) {
        return this.patterns.reduce(
            (result, pattern) => pattern.apply(result),
            raw
        )
    }
}

const defaultRules = [
    new Rule(`header`, [
        new Pattern(/^#{6}\s?([^\n]+)/gm, `<h6>$1</h6>`),
        new Pattern(/^#{5}\s?([^\n]+)/gm, `<h5>$1</h5>`),
        new Pattern(/^#{4}\s?([^\n]+)/gm, `<h4>$1</h4>`),
        new Pattern(/^#{3}\s?([^\n]+)/gm, `<h3>$1</h3>`),
        new Pattern(/^#{2}\s?([^\n]+)/gm, `<h2>$1</h2>`),
        new Pattern(/^#{1}\s?([^\n]+)/gm, `<h1>$1</h1>`),
    ]),
    new Rule(`block`, [
        new Pattern(/^\`{3}\r\n([\s\S]+)\`{3}(\r\n|)/gm, `<center><div class="codeblock"><code>$1</code></div></center>`),
    ]),
    new Rule(`line`, [
        new Pattern(/(\-{3}\r\n|\-{3})/gm, `<hr>`),
    ]),

    new Rule(`image`, [
        new Pattern(/\!\[([^\]]+)\]\((\S+)\)/gm, `<img src="$2" alt="$1" />`),
    ]),
    new Rule(`link`, [
        new Pattern(
            /\[([^\n]+)\]\(([^\n]+)\)/gm,
            `<a href="$2" target="_blank" rel="noopener">$1</a>`
        ),
    ]),
    new Rule(`bold`, [
        new Pattern(/\*\*\s?([^\n]+)\*\*/gm, `<b>$1</b>`),
    ]),
    new Rule(`italic`, [
        new Pattern(/\*\s?([^\n]+)\*/gm, `<i>$1</i>`),
    ]),
    new Rule(`underlined`, [
        new Pattern(/\_\s?([^\n]+)\_/gm, `<u>$1</u>`),
    ]),
    new Rule(`code`, [
        new Pattern(/\`\s?([^\n]+)\`/gm, `<code>$1</code>`),
    ]),

    new Rule(`br`, [
        new Pattern(/\n/gm, `<br>`),
    ]),
    new Rule(`cleanup`, [
        new Pattern(/<\/h6><br>/gm, `</h6>`),
        new Pattern(/<\/h5><br>/gm, `</h5>`),
        new Pattern(/<\/h4><br>/gm, `</h4>`),
        new Pattern(/<\/h3><br>/gm, `</h3>`),
        new Pattern(/<\/h2><br>/gm, `</h2>`),
        new Pattern(/<\/h1><br>/gm, `</h1>`),
    ])
]

class RMark {
    rules = defaultRules
  
    addRuleBefore(rule, before) {
        const index = this.rules.findIndex((r) => r.name === before)
        if (index !== -1) {
            this.rules.splice(index, 0, rule)
        }
        return this
    }

    addRule(rule) {
        this.addRuleBefore(rule, `br`)
        return this
    }

    render(raw) {
        let result = raw
        this.rules.forEach((rule) => {
            result = rule.apply(result)
        })
        return result
    }
}