// =============================================
// HunyaCodingAI Backend - GitHub OAuth Server
// =============================================
// Setup:
// 1. npm install express cors dotenv axios
// 2. Create .env file with GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
// 3. node server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// Middleware
// =============================================
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());

// =============================================
// Configuration
// =============================================
GITHUB_CLIENT_ID = Iv23litOB1HajHCZRaVn;
GITHUB_CLIENT_SECRET = f68019a5683ce649ba9f809420fb8108c99178c1;
GITHUB_API_URL = 'https://github.com/apps/hunyaai';
GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

// =============================================
// Routes
// =============================================

/**
 * POST /api/github/token
 * Exchange authorization code for access token
 * 
 * Request body:
 * {
 *   code: "string" // GitHub authorization code
 * }
 * 
 * Response:
 * {
 *   access_token: "string",
 *   user: {
 *     id: number,
 *     login: "string",
 *     name: "string",
 *     avatar_url: "string",
 *     email: "string"
 *   }
 * }
 */
app.post('/api/github/token', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code is required' });
        }

        if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
            return res.status(500).json({ error: 'GitHub OAuth credentials not configured' });
        }

        // Step 1: Exchange code for access token
        console.log('Exchanging authorization code for access token...');
        const tokenResponse = await axios.post(
            GITHUB_TOKEN_URL,
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code
            },
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(400).json({ 
                error: 'Failed to obtain access token',
                details: tokenResponse.data
            });
        }

        // Step 2: Fetch user information using the access token
        console.log('Fetching user information...');
        const userResponse = await axios.get(`${GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        const user = userResponse.data;

        // Step 3: Return success response
        res.json({
            success: true,
            access_token: accessToken,
            user: {
                id: user.id,
                login: user.login,
                name: user.name || user.login,
                avatar_url: user.avatar_url,
                email: user.email || user.login + '@users.noreply.github.com',
                bio: user.bio,
                public_repos: user.public_repos,
                followers: user.followers,
                following: user.following
            }
        });

    } catch (error) {
        console.error('OAuth token exchange error:', error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid authorization code or expired code',
                message: error.response.data?.error_description || error.message
            });
        }

        res.status(500).json({ 
            error: 'Failed to exchange authorization code for access token',
            message: error.message
        });
    }
});

/**
 * POST /api/github/commit
 * Push code to GitHub repository
 * 
 * Request body:
 * {
 *   access_token: "string",
 *   owner: "string",
 *   repo: "string",
 *   branch: "string",
 *   message: "string",
 *   content: "string" (base64 encoded file content)
 * }
 */
app.post('/api/github/commit', async (req, res) => {
    try {
        const { access_token, owner, repo, branch, message, content, filePath } = req.body;

        if (!access_token || !owner || !repo || !message || !content || !filePath) {
            return res.status(400).json({ 
                error: 'Missing required fields: access_token, owner, repo, message, content, filePath' 
            });
        }

        // Get current file SHA if it exists (for update)
        let sha = null;
        try {
            const fileResponse = await axios.get(
                `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                }
            );
            sha = fileResponse.data.sha;
        } catch (error) {
            // File doesn't exist, which is fine for creating new files
            if (error.response?.status !== 404) {
                throw error;
            }
        }

        // Prepare commit payload
        const commitPayload = {
            message: message,
            content: Buffer.from(content).toString('base64'),
            branch: branch
        };

        if (sha) {
            commitPayload.sha = sha;
        }

        // Push commit to GitHub
        console.log(`Committing to ${owner}/${repo}/${filePath}...`);
        const commitResponse = await axios.put(
            `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${filePath}`,
            commitPayload,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );

        res.json({
            success: true,
            message: 'Code committed successfully',
            commit: {
                sha: commitResponse.data.commit.sha,
                url: commitResponse.data.commit.html_url,
                message: message,
                file: filePath
            }
        });

    } catch (error) {
        console.error('GitHub commit error:', error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                error: 'Unauthorized - Invalid or expired access token'
            });
        }

        if (error.response?.status === 404) {
            return res.status(404).json({ 
                error: 'Repository not found'
            });
        }

        res.status(500).json({ 
            error: 'Failed to commit code to GitHub',
            message: error.message
        });
    }
});

/**
 * GET /api/github/repos
 * Get list of user repositories
 */
app.get('/api/github/repos', async (req, res) => {
    try {
        const { access_token } = req.query;

        if (!access_token) {
            return res.status(400).json({ error: 'access_token is required' });
        }

        const reposResponse = await axios.get(`${GITHUB_API_URL}/user/repos`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/vnd.github.v3+json'
            },
            params: {
                sort: 'updated',
                direction: 'desc',
                per_page: 30
            }
        });

        res.json({
            success: true,
            repositories: reposResponse.data.map(repo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                url: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                created_at: repo.created_at,
                updated_at: repo.updated_at
            }))
        });

    } catch (error) {
        console.error('GitHub repos fetch error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch repositories',
            message: error.message
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'HunyaCodingAI Backend',
        version: '1.0.0'
    });
});

// =============================================
// Error Handling
// =============================================
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// =============================================
// Server Startup
// =============================================
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('🚀 HunyaCodingAI Backend Server');
    console.log(`${'='.repeat(60)}`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`${'='.repeat(60)}\n`);

    // Configuration check
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        console.warn('⚠️  WARNING: GitHub OAuth credentials not configured!');
        console.warn('Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env file\n');
    }
});

module.exports = app;
