# Instructions
1. Clone repo
2. `yarn install`
3. Create `.env`:
```javascript
API_KEY=tibber_api_key
PRICE_LIMIT=0.3 # In SEK inc taxes
GARO_IP=ip_of_garo
```
4. Add to crontab:
```javascript
1 * * * *       cd $HOME && /usr/bin/node $HOME/tibber-garo/index.js
```
This will run one minute past every hour, and check the current price against `PRICE_LIMIT`, if below, enable charging, else disable.

## Todo
Implement charge override.

API for changing `PRICE_LIMIT`

## Caveats
Manual settings of **['Availablae for charging'|'Not available for charging'|'Schedule']** will be reset every time the program is run.