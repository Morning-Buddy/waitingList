#!/bin/bash

echo "🔍 Checking if all images exist..."
echo ""

missing=0
found=0

# Extract all image paths from index.html
images=$(grep -oE '(src|srcset)="public/[^"]+\.(webp|png)"' index.html | sed 's/.*="//;s/"//' | sort -u)

for img in $images; do
    if [ -f "$img" ]; then
        echo "✅ $img"
        ((found++))
    else
        echo "❌ MISSING: $img"
        ((missing++))
    fi
done

echo ""
echo "📊 Summary:"
echo "   Found: $found images"
echo "   Missing: $missing images"

if [ $missing -eq 0 ]; then
    echo ""
    echo "🎉 All images are present! Your site should work perfectly."
    echo ""
    echo "To test locally, run:"
    echo "   python3 -m http.server 8000"
    echo "Then visit: http://localhost:8000"
else
    echo ""
    echo "⚠️  Some images are missing. Please check the public/ folder."
fi
