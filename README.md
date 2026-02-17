# Vineyard Progress Tracker

A web application to track progress on vineyard work by marking completed rows and plants on satellite imagery.

## Features

- Upload satellite imagery of your vineyard
- Detect and mark vine rows
- Create multiple progress tasks (pruning, harvesting, etc.)
- Select completed rows/plants
- View real-time progress percentages
- All data stored locally in your browser

## Setup

1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose `main` branch, `/ (root)` folder
5. Save and wait for deployment

## Usage

1. **Upload Image**: Click "Upload Satellite Image" to add your vineyard image
2. **Mark Rows**: Click on the image to place row markers
3. **Create Task**: Add a new task with a name and select which rows are included
4. **Track Progress**: Click on rows in a task to mark them as complete
5. **View Progress**: See real-time percentage completion for each task

## Technologies

- Vanilla JavaScript (no frameworks needed)
- HTML5 Canvas for image manipulation
- LocalStorage for data persistence
- Responsive CSS design
