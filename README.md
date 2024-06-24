# Agora Backend with Astro
A complete backend for your Agora projects using Astro. This repo contains a token generator that can be used to secure your video calls.

## Guides
1. [Build a Token Generator with Astro](docs/TOKENS.md)

## Get Started

1. Add your Agora `APP_ID` and `APP_CERTIFICATE` to your `.env` file.
2. Run `npm install` to install all dependecies.
3. Run `npm run dev` to build and run the project.

## End points
Retrieve token
```
/rtc/<channel>/<role>/<uid>.json
```
- `channel` - the channel which the token will be used on
- `role` 
  - `publisher` - can publish and receive data
  - `subscriber` - can only receive data
- `uid` - uid of the user requesting the token