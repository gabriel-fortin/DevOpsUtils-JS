while true
do
    rsync -hvrPt --delete \
        --filter 'protect WARNING.md' \
        --exclude node_modules \
        /WSL_locations/DevOpsUtils-JS/ /WINDOWS_locations/DevOpsUtils-JS/
    echo -------
    sleep 3
done
