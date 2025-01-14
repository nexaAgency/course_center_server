# Course Center

## Setup

1. Clone the git repository
   ```bash 
   git clone <url>
   ```
2. Install all dependencies
   ```bash 
   npm install
   ```

## Usage

> [!IMPORTANT]
> 
> You need to create an `.env` file in the root of proejct. Copy all the variables from the `.env-example` file and paste them there. After that, replace the variables in the file with your own variables.


```bash
# local mode
$ npm run start:local

# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Telegram Bot Commands

### `/start`
- **Purpose:** Initializes the bot and sends a message with a button that will allow you to enter the Mini App
