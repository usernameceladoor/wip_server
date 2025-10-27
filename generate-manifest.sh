#!/bin/bash
# generate-manifest.sh
# Automatically generates image-manifest.json from actual files

echo "Generating image manifest..."
echo "{"

first_project=true

# Loop through project folders
for project_dir in images/projects/*/; do
    if [ ! -d "$project_dir" ]; then
        continue
    fi
    
    project_name=$(basename "$project_dir")
    
    # Skip thumbnail files
    if [ "$project_name" = "*" ]; then
        continue
    fi
    
    # Add comma between projects
    if [ "$first_project" = true ]; then
        first_project=false
    else
        echo ","
    fi
    
    echo "  \"$project_name\": {"
    echo "    \"images\": ["
    
    first_image=true
    
    # Find all image files, sorted
    find "$project_dir" -maxdepth 1 -type f \( -iname "*.avif" -o -iname "*.png" -o -iname "*.jpg" \) | sort | while read -r filepath; do
        filename=$(basename "$filepath")
        
        # Add comma between images
        if [ "$first_image" = true ]; then
            first_image=false
        else
            echo ","
        fi
        
        echo -n "      \"$filename\""
    done
    
    echo ""
    echo "    ]"
    echo -n "  }"
done

echo ""
echo "}"

echo ""
echo "✅ Manifest generated!"
echo ""
echo "To use: ./generate-manifest.sh > image-manifest.json"
