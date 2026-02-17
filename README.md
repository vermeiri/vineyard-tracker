# Vineyard Progress Tracker

A web application to track progress on vineyard work by automatically or manually marking vine rows on satellite imagery.

## Features

- Upload satellite imagery of your vineyard
- **🤖 AI-powered automatic row detection** using OpenAI Vision API
- Manual row marking for fine-tuning
- Create multiple progress tasks (pruning, harvesting, etc.)
- Select completed rows/plants
- View real-time progress percentages
- All data stored locally in your browser

## AI-Powered Row Detection

This app uses OpenAI's GPT-4 Vision API to automatically analyze vineyard images and detect rows. This is especially useful for:
- Vineyards with irregular row patterns
- Rows of different lengths
- Large vineyards with many rows
- Saving time on manual marking

### Getting Started with AI Detection

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Upload your vineyard image
3. Enter your API key in the "AI-Powered Detection" section
4. Click "Auto-Detect Rows with AI"
5. Wait 10-30 seconds for analysis
6. Review detected rows and manually adjust if needed

**Security Note:** Your API key is stored in your browser's localStorage. While convenient, localStorage is accessible to any JavaScript code running on the page. Only use this application on trusted devices and networks. Consider using a restricted API key with spending limits.

## Setup

1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose `main` branch, `/ (root)` folder
5. Save and wait for deployment

## Usage

1. **Upload Image**: Click "Upload Satellite Image" to add your vineyard image
2. **AI Detection** (Recommended): 
   - Enter your OpenAI API key
   - Click "Auto-Detect Rows with AI" 
   - Wait for automatic detection
   - Manually adjust any rows if needed
3. **Manual Marking** (Alternative):
   - Click "Add Row Markers" mode
   - Click on the image to place row markers
4. **Create Task**: Add a new task with a name and select which rows are included
5. **Track Progress**: Click on rows in a task to mark them as complete
6. **View Progress**: See real-time percentage completion for each task

## AI Model

The application uses OpenAI's GPT-4 Vision (gpt-4o) model for image analysis. This model:
- Can identify vine rows in satellite/aerial imagery
- Handles rows of varying lengths and spacing
- Works with different types of vineyard layouts
- Provides coordinate data for automatic marker placement

**Privacy Note:** Images are sent to OpenAI for analysis. Do not use sensitive or private images.

## Technologies

- Vanilla JavaScript (no frameworks needed)
- OpenAI GPT-4 Vision API for automatic row detection
- HTML5 Canvas for image manipulation
- LocalStorage for data persistence
- Responsive CSS design
