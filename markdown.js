class Pattern {
    regex;
    replacement;
    constructor(regex, replacement) {
        this.regex = regex;
        this.replacement = replacement;
    }
  
    apply(raw) {
        return raw.replace(this.regex, this.replacement);
    }
}

class Rule {
    name;
    patterns;
    constructor(name, patterns) {
        this.name = name;
        this.patterns = patterns;
    }
  
    apply(raw) {
        return this.patterns.reduce(
            (result, pattern) => pattern.apply(result),
            raw
        );
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
    new Rule(`bold`, [
        new Pattern(/\*\*\s?([^\n]+)\*\*/g, `<b>$1</b>`),
        new Pattern(/\_\_\s?([^\n]+)\_\_/g, `<b>$1</b>`),
    ]),
    new Rule(`italic`, [
        new Pattern(/\*\s?([^\n]+)\*/g, `<i>$1</i>`),
        new Pattern(/\_\s?([^\n]+)\_/g, `<i>$1</i>`),
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
    new Rule(`paragraph`, [
        new Pattern(/([^\n]+\n?)/g, `\n<p>$1</p>\n`),
    ]),
    new Rule(`line`, [
        new Pattern(/(\=|\-|\*){3}/g, `\n<hr>\n`),
    ])
];

class RMark {
    rules = defaultRules;
  
    addRuleBefore(rule, before) {
        const index = this.rules.findIndex((r) => r.name === before);
        if (index !== -1) {
            this.rules.splice(index, 0, rule);
        }
        return this;
    }

    addRule(rule) {
        this.addRuleBefore(rule, `paragraph`);
        return this;
    }

    render(raw) {
        let result = raw;
        this.rules.forEach((rule) => {
            result = rule.apply(result);
        });
        return result;
    }
}