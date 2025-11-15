# [AstrBot Plugin Marketplace](https://plugins.astrbot.app/)

A simple AstrBot plugin marketplace page for showcasing plugins for the AstrBot framework.

## Features

* 📦 Browse all available AstrBot plugins
* 🔍 Search for specific plugins
* 🌓 Support for dark/light theme switching

## Environment Variables

Before running the project, you need to configure environment variables. Please follow these steps:

1. Copy `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Modify the configuration in the `.env` file as needed:
   - `VITE_API_ENDPOINTS`: Plugin API endpoint configuration, use `|` to separate multiple API endpoints, format: `name:URL`

## Deployment

The project uses GitHub Actions to automatically deploy to GitHub Pages and Vercel. Each push to the `astrbot-plugins-market` branch will automatically trigger the build and deployment process. But some configuration issues require manual deployment on Vercel.
