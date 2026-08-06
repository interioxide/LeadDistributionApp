module.exports = {
    apps: [
        {
            name: 'api',
            cwd: './api',
            script: 'dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};