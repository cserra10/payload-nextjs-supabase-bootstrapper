#!/bin/bash

# Environment Setup Script
# Reads from master environment files and distributes to individual repositories

set -e

# Default environment if not specified
ENVIRONMENT=${1:-development}

# Validate environment parameter
if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "production" ]]; then
    echo "Error: Environment must be 'development' or 'production'"
    echo "Usage: $0 [development|production]"
    exit 1
fi

# Master environment file path
MASTER_ENV_FILE=".master-env.$ENVIRONMENT"

# Check if master environment file exists
if [[ ! -f "$MASTER_ENV_FILE" ]]; then
    echo "Error: Master environment file '$MASTER_ENV_FILE' not found!"
    echo "Please ensure the file exists in the project root directory."
    exit 1
fi

echo "Setting up environment files for: $ENVIRONMENT"
echo "Reading from: $MASTER_ENV_FILE"

# Function to extract section from master env file
extract_section() {
    local section_name="$1"
    local output_file="$2"
    local temp_file=$(mktemp)
    
    # Extract the section between the specified markers
    awk "/^# ========= \[$section_name\] =========$/{flag=1; next} /^# ========= \[.*\] =========$/{flag=0} flag" "$MASTER_ENV_FILE" > "$temp_file"
    
    # Remove leading empty lines and trailing empty lines
    sed '/./,$!d' "$temp_file" | sed -e :a -e '/^\s*$/{$d;N;ba' -e '}' > "${temp_file}.clean"
    
    # Create output directory if it doesn't exist
    mkdir -p "$(dirname "$output_file")"
    
    # Write to output file
    mv "${temp_file}.clean" "$output_file"
    rm -f "$temp_file"
    
    echo "  ✓ Created: $output_file"
}

# Extract sections for each repository
echo ""
echo "Extracting environment sections..."

# API package
extract_section "api" "packages/api/.env.$ENVIRONMENT"

# DB package  
extract_section "db" "packages/db/.env.$ENVIRONMENT"

# Web package
extract_section "web" "packages/web/.env.$ENVIRONMENT"

# Web-demo package
extract_section "web-demo" "packages/web-demo/.env.$ENVIRONMENT"

echo ""
echo "Environment setup completed successfully!"
echo "All repositories now have their .env.$ENVIRONMENT files configured."