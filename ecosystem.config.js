module.exports = {
    apps: [
        {
            name: 'lead-distribution-api',
            cwd: './api',
            script: 'dist/src/main.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'lead-distribution-web',
            cwd: './web',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};