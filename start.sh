#!/bin/bash

# Configuration: Update these paths and commands for your project
FRONTEND_DIR="./Frontend/client"
BACKEND_DIR="./Backend"
FRONTEND_CMD="npm run dev"
BACKEND_CMD="npm run dev"

# Function to start a service in background and monitor it
start_and_monitor() {
    local dir="$1"
    local cmd="$2"
    local name="$3"
    local pid_file="/tmp/${name}.pid"

    while true; do
        echo "Starting $name..."
        cd "$dir" || exit 1
        $cmd &
        echo $! > "$pid_file"

        # Wait for the process to exit
        wait $!
        echo "$name exited. Restarting in 3 seconds..."
        sleep 3
    done
}

# Start both services in parallel
start_and_monitor "$FRONTEND_DIR" "$FRONTEND_CMD" "Frontend" &
start_and_monitor "$BACKEND_DIR" "$BACKEND_CMD" "Backend" &

# Wait for all background processes
wait
