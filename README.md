# AutoBlueprint

A full-stack web application that automatically generates detailed 2D and 3D building blueprints from basic user inputs.

## Features

- **Input Form**: Enter plot area, shape, location, and number of floors
- **2D Blueprint**: Interactive canvas showing rooms, walls, doors, and windows
- **3D Visualization**: 3D model with realistic room layouts
- **Export Functionality**: Download blueprints as PNG (2D) or GLTF (3D)
- **Responsive Design**: Modern UI with TailwindCSS

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Fabric.js for 2D canvas rendering
- Three.js with @react-three/fiber for 3D visualization
- Axios for API calls

### Backend
- Node.js with Express
- CORS enabled for cross-origin requests
- Procedural blueprint generation algorithm

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Fill in the plot details:
   - Area in square feet
   - Plot shape (Rectangle/Square/Custom)
   - Location (optional)
   - Number of floors
3. Click "Generate Blueprint"
4. View the generated 2D blueprint or switch to 3D visualization
5. Export your blueprint as PNG (2D) or GLTF (3D)

## Blueprint Generation Logic

The application uses intelligent algorithms to generate realistic building layouts:

### Small Plots (< 1000 sq ft)
- 1 bedroom + lounge + kitchen + bathroom
- No parking or reception area

### Medium Plots (1000-2000 sq ft)
- 2 bedrooms + lounge + kitchen + bathroom + parking
- No reception area

### Large Plots (> 2000 sq ft)
- 3+ bedrooms + lounge + kitchen + multiple bathrooms
- Reception area + parking
- Multiple bathrooms

### Features
- Proportional room sizing based on total area
- Realistic wall thickness (6 inches)
- Automatic door and window placement
- Color-coded room types
- Interactive 2D and 3D views

## API Endpoints

### POST /api/generate-blueprint
Generates a blueprint based on input parameters.

**Request Body:**
```json
{
  "area": 1500,
  "shape": "rectangle",
  "location": "New York, NY",
  "floors": 1
}
```

**Response:**
```json
{
  "success": true,
  "blueprint": {
    "rooms": [...],
    "walls": [...],
    "doors": [...],
    "windows": [...],
    "plotDimensions": { "width": 30, "height": 50 },
    "totalArea": 1500,
    "metadata": {
      "location": "New York, NY",
      "floors": 1,
      "generatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Development

### Project Structure
```
AutoBlueprint/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # TailwindCSS styles
│   └── package.json
├── backend/           # Node.js backend
│   ├── server.js         # Express server
│   └── package.json
└── README.md
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
