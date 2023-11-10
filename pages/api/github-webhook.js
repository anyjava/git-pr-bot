// pages/api/github-webhook.js

import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // GitHub 웹훅 시크릿 검증 (선택적)
        // ...

        // PR 이벤트 확인
        if (req.body.action === 'opened' && req.body.pull_request) {
            const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
            const { owner, repo, number, title } = req.body.pull_request;

            try {
                // PR에 코멘트 작성
                await octokit.issues.createComment({
                    owner,
                    repo,
                    issue_number: number,
                    body: `PR 제목: "${title}"에 대한 에코 응답입니다.`
                });

                return res.status(200).json({ message: 'Comment added' });
            } catch (error) {
                return res.status(500).json({ message: 'Error adding comment', error });
            }
        }

        return res.status(400).json({ message: 'Not a valid PR event' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
