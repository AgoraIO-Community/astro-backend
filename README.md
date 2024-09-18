# Agora Backend with Astro

A complete backend and front end for your Astro & Agora projects. This repo contains:

- Token Generator
- Cloud Recording
- Speech-To-Text

## Guides

1. [Build a Token Generator with Astro](docs/TOKENS.md)
2. [Build a Cloud Recording Backend with Astro](docs/CLOUD_RECORDING.md)
3. [Build a Real-Time Speech-To-Text Backend with Astro](docs/SPEECH_TO_TEXT.md)

## Get Started

1. Create a `.env` file with all the properties within the `.env.example`
2. Run `npm install` to install all dependecies.
3. Run `npm run dev` to build and run the project.

## Token Generator Endpoint

```txt
/api/token.json
```

Body needs to contain channel, role, uid, expireTime.

## Cloud Recording Endpoints

```txt
/api/recording/start.json
```

Body needs to contain channel.

```txt
/api/recording/stop.json
```

Body needs to contain channel, sid, resourceId.

```txt
/api/recording/query.json
```

Body needs to contain sid, resourceId.

## Speech-To-Text Endpoints

```txt
/api/transcription/start.json
```

Body needs to contain channel.

```txt
/api/transcription/stop.json
```

Body needs to contain taskId, builderToken.

```txt
/api/transcription/query.json
```

Body needs to contain taskId, builderToken.
