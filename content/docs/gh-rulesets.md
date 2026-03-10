
RuleSets задает правила для репозитория и автоматически проверяет их при PR.

- **Ruleset**: YAML-файл со списком правил для применения.
- **Rules**: правило определяющее требование к коду, например: *Code Style*; *Security*; *Testing*.
- **GitHub Actions**: Rulesets поддерживаются в github actions/cicd.
- **Centralized Management**: Rulesets могут быть управляемы в одном месте и применяться к нескольким репозиториям.

```
yaml
rules:
  - name: Maximum line length
    description: Lines should not exceed 80 characters.
    language: python
    criteria:
      max_line_length: 80
  - name: Check for debug statements
    description: Debug statements should be removed before commit.
    language: python
    criteria:
      no_debug_statements: true
```

Инструменты, которые можно использовать с Rulesets могут быть разнообразными: linters, static analysis tools, dependency check.

