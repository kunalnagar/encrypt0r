#!/bin/bash

# IMPORTANT:
# Set the GitHub repo url
GITHUB_REPO_URL="https://github.com/kunalnagar/encrypt0r"

# Clear the console (UNIX only)
clear

echo "\nStarting the script..."

# Method to check if a command is available
# More info: https://stackoverflow.com/a/677212
is_command_available() {
  COMMAND=$1
  if command -v COMMAND &> /dev/null
  then
    echo "✅ ${COMMAND} is available."
    true
  else
    false
  fi
}

# Check to see if homebrew and hub are installed
echo "\nChecking to see installed software..."
if ! is_command_available brew
then
  echo "⚠️  brew is unavailable. Visit https://brew.sh/ to install\n"
  exit
fi
if ! is_command_available hub
then
  echo "⚠️  hub is unavailable. Please install using: brew install hub\n"
  exit
fi

echo "\n"

# Make sure you are on the latest version of master
git checkout master -f
git pull origin master
git fetch
git reset --hard HEAD

# Generate release notes with a dry-run
npm run release:standard-version -- --dry-run > out.txt
NOTES=$(cat out.txt | sed -n '/^---$/,/^---$/p' | sed '1d;$d')
rm -rf out.txt

# Run standard-version
npm run release:standard-version

# Get the latest created tag
TAG=$(git describe HEAD --abbrev=0)

# Create release-notes file that hub uses
# to create a GitHub release
echo $TAG > release-notes.txt
echo "\n" >> release-notes.txt
echo "$NOTES" >> release-notes.txt

# Create the actual release
# More info: https://hub.github.com/hub-release.1.html
hub release create --copy -F release-notes.txt ${TAG}
rm -rf release-notes.txt

# Push changelog.md and release commit to master
git push origin master

# Output release info
echo "\n"
echo "============================="
echo " 🎉 Done! Released ${TAG}"
echo "============================="
echo "\n"
echo "URL: ${GITHUB_REPO_URL}/releases/${TAG}"
echo "\n"
