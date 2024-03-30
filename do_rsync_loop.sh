while true
do
    rsync -hvrPt --delete \
        --exclude node_modules \
        --exclude .next \
        /WSL_locations/DevOpsUtils-JS/ /WINDOWS_locations/DevOpsUtils-JS/
    echo -------
    sleep 3
done
