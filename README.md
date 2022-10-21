1. create DB in the psql or with pg admin
2. yarn
3. create .env.development file from .env.example
4. yarn dev

## Commits
If an error occurs during the commit:
```
Aborting commit. Your commit message is invalid.(Please, check README.md)
```
Your commit should be like "feat: YOUR_DESCRIPTION_COMMIT"
for merge "Merge dev to prod"
feat - you can change on the another word like: feat|fix|chore|docs|test|style|refactor|perf|build|ci|revert|content

Also, you commit shouldn't more than 88 characters
(You can check file with rules: .husky/commit-msg)