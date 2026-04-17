import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    serverExternalPackages: [
        'firebase-admin/storage',
        'firebase-admin/app',
        '@google-cloud/firestore',
        'dotenv',
    ],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
                port: '',
                pathname: '/**',
            },
        ],
    },
    webpack: (config) => {
        config.ignoreWarnings = [
            { module: /handlebars/ },
        ];
        return config;
    },
};

export default withSentryConfig(nextConfig, {
    // Sentry build options
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    
    // Only upload source maps when auth token is available
    silent: !process.env.SENTRY_AUTH_TOKEN,
    
    // Disable source map upload if no auth token
    ...(process.env.SENTRY_AUTH_TOKEN ? {} : {
        disableServerWebpackPlugin: true,
        disableClientWebpackPlugin: true,
    }),
    
    // Hides source maps from generated client bundles
    hideSourceMaps: true,
    
    // Transpile Sentry SDK to be compatible with Next.js
    tunnelRoute: "/monitoring",
    
    // Automatically tree-shake Sentry logger statements
    disableLogger: true,
});
