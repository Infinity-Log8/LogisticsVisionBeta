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
        // Fix OpenTelemetry/Sentry semantic-conventions compatibility issue
      if (!config.resolve) config.resolve = {};
      if (!config.resolve.alias) config.resolve.alias = {};
      config.resolve.alias["@opentelemetry/semantic-conventions"] = require.resolve("@opentelemetry/semantic-conventions");
      return config;
    },
};

export default withSentryConfig(nextConfig, {
    silent: true,
    hideSourceMaps: true,
    disableLogger: true,
    tunnelRoute: "/monitoring",
});
