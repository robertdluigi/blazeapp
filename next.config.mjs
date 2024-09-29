/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {

      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.(".svg")
      );
  
      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          test: /\.node$/,
          use: 'ignore-loader'
        },
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
          use: ["@svgr/webpack"],
        }
      );
      config.externals.argon2 = "argon2";
      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;
  
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ddragon.leagueoflegends.com",
          pathname: "/cdn/img/champion/splash/**", // Allow images from the specified path
        },
        {
          protocol: "https",
          hostname: "utfs.io",
          pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
        },
        {
          protocol: "http",
          hostname: "media.steampowered.com",
          pathname: "/steamcommunity/public/images/apps/**",
        },
        {
          protocol: "https",
          hostname: "cdn.cloudflare.steamstatic.com",
          pathname: "/steam/apps/**",
        },
      ],
    },
    experimental:
    {
      staleTimes: {
        dynamic: 30,
      },
      serverComponentsExternalPackages: ["node-rs/argon2"],
    },

    rewrites: () => {
      return [
        {
          source: "/hashtag/:tag",
          destination: "/search?q=%23:tag",
        },
      ];
    },
    
  };
  
  export default nextConfig;