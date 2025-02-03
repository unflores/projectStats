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
pnpm run occurances:ingest --processorName ReleaseCandidates --projectName projectStats

pnpm dev
xdg-open http://localhost:3000
```


To do:
------
Add jest
test / come up with paths for loading state, error state and crit vs non-crit errors in useGet
Add lOC per language over time
I want to decide from the creation of the graph data whether to coalesce the data or not
I want to have the axes on the graphs on the front-end be filled from some lib data structure
I want to decide what type of graph to use based on the analysis type. Decide on colors to use based on the analysis type too
Group ingest queries together somewhere better
Give toLine the knowledge of whether or not to coalesce the data
Make command-line not depend on case sensitivity
