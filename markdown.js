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
        new Pattern(/^#{6}\s?([^\n]+)\r/g, `<h6>$1</h6>`),
        new Pattern(/^#{5}\s?([^\n]+)\r/g, `<h5>$1</h5>`),
        new Pattern(/^#{4}\s?([^\n]+)\r/g, `<h4>$1</h4>`),
        new Pattern(/^#{3}\s?([^\n]+)\r/g, `<h3>$1</h3>`),
        new Pattern(/^#{2}\s?([^\n]+)\r/g, `<h2>$1</h2>`),
        new Pattern(/^#{1}\s?([^\n]+)\r/g, `<h1>$1</h1>`),
    ]),
    new Rule(`block`, [
        new Pattern(/^\`{3}\r\n([\s\S]+)\`{3}(\r\n|)/g, `<center><div class="codeblock"><code>$1</code></div></center>`),
    ]),
    new Rule(`line`, [
        new Pattern(/(\-{3}\r\n|\-{3})/g, `<hr>`),
    ]),

    new Rule(`image`, [
        new Pattern(/\!\[([^\]]+)\]\((\S+)\)/g, `<img src="$2" alt="$1" />`),
    ]),
    new Rule(`link`, [
        new Pattern(
            /\[([^\n]+)\]\(([^\n]+)\)/g,
            `<a href="$2" target="_blank" rel="noopener">$1</a>`
        ),
    ]),
    new Rule(`bold`, [
        new Pattern(/\*\*\s?([^\n]+)\*\*/g, `<b>$1</b>`),
    ]),
    new Rule(`italic`, [
        new Pattern(/\*\s?([^\n]+)\*/g, `<i>$1</i>`),
    ]),
    new Rule(`underlined`, [
        new Pattern(/\_\s?([^\n]+)\_/g, `<u>$1</u>`),
    ]),
    new Rule(`code`, [
        new Pattern(/\`\s?([^\n]+)\`/g, `<code>$1</code>`),
    ]),

    new Rule(`br`, [
        new Pattern(/\n/g, `<br>`),
    ]),
    new Rule(`cleanup`, [
        new Pattern(/<\/h6><br>/g, `</h6>`),
        new Pattern(/<\/h5><br>/g, `</h5>`),
        new Pattern(/<\/h4><br>/g, `</h4>`),
        new Pattern(/<\/h3><br>/g, `</h3>`),
        new Pattern(/<\/h2><br>/g, `</h2>`),
        new Pattern(/<\/h1><br>/g, `</h1>`),
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