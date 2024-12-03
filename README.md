start app:
```
# Install the packages
pnpm install

# Bring up the db, this should happen in another pane
docker compose up

# Add a basic config
cp ./config.json.example ./src/scripts/config.json

# Use the current project as the default
sed -i "s|<current dir>|$(pwd)|g" ./src/scripts/config.json

# Fetch the occurances for the processor
pnpm run occurances:fetch --processorName ReleaseCandidates --projectName projectStats

pnpm dev
xdg-open http://localhost:3000
```


To do:
------
Add jest
test / come up with paths for loading state, error state and crit vs non-crit errors in useGet
