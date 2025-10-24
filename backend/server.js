require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Blueprint generation logic
class BlueprintGenerator {
  constructor() {
    this.wallThickness = 6; // inches
    this.doorWidth = 36; // inches
    this.windowWidth = 48; // inches
  }

  // Convert square feet to approximate dimensions
  getPlotDimensions(area, shape) {
    const areaInSqFt = area;
    let width, height;

    switch (shape) {
      case 'square':
        const side = Math.sqrt(areaInSqFt);
        width = height = Math.round(side);
        break;
      case 'rectangle':
        // Golden ratio for aesthetic proportions
        const ratio = 1.618;
        width = Math.round(Math.sqrt(areaInSqFt * ratio));
        height = Math.round(areaInSqFt / width);
        break;
      default:
        // Custom - use square as default
        const sideDefault = Math.sqrt(areaInSqFt);
        width = height = Math.round(sideDefault);
    }

    return { width, height };
  }

  // Determine room configuration based on area
  getRoomConfiguration(area) {
    if (area < 1000) {
      return {
        rooms: [
          { name: 'Lounge', ratio: 0.4 },
          { name: 'Bedroom', ratio: 0.25 },
          { name: 'Kitchen', ratio: 0.2 },
          { name: 'Bathroom', ratio: 0.15 }
        ],
        hasParking: false,
        hasReception: false
      };
    } else if (area < 2000) {
      return {
        rooms: [
          { name: 'Lounge', ratio: 0.3 },
          { name: 'Bedroom 1', ratio: 0.2 },
          { name: 'Bedroom 2', ratio: 0.2 },
          { name: 'Kitchen', ratio: 0.15 },
          { name: 'Bathroom', ratio: 0.1 },
          { name: 'Parking', ratio: 0.05 }
        ],
        hasParking: true,
        hasReception: false
      };
    } else {
      return {
        rooms: [
          { name: 'Reception', ratio: 0.15 },
          { name: 'Lounge', ratio: 0.25 },
          { name: 'Bedroom 1', ratio: 0.15 },
          { name: 'Bedroom 2', ratio: 0.15 },
          { name: 'Bedroom 3', ratio: 0.1 },
          { name: 'Kitchen', ratio: 0.1 },
          { name: 'Bathroom 1', ratio: 0.05 },
          { name: 'Bathroom 2', ratio: 0.05 }
        ],
        hasParking: true,
        hasReception: true
      };
    }
  }

  // Enhanced AI-powered room layout generation
  generateAIRoomLayout(area, config, width, height) {
    // Advanced AI algorithm for optimal room placement
    const rooms = [];
    const totalArea = area;

    // Enhanced room priority system with architectural principles
    const roomPriority = {
      'Lounge': 1,      // Central living space
      'Kitchen': 2,      // Adjacent to dining/living
      'Bedroom': 3,      // Private spaces
      'Bathroom': 4,     // Accessible from bedrooms
      'Parking': 5,      // External access
      'Reception': 6     // Entry point
    };

    // AI room placement algorithm with architectural rules
    const sortedRooms = config.rooms.sort((a, b) => {
      const priorityA = roomPriority[a.name.split(' ')[0]] || 7;
      const priorityB = roomPriority[b.name.split(' ')[0]] || 7;
      return priorityA - priorityB;
    });

    // AI placement with smart grid system
    let currentX = 0;
    let currentY = 0;
    let maxHeight = 0;
    let rowHeight = 0;

    // AI optimization: Calculate optimal room dimensions
    const getOptimalDimensions = (roomArea, roomType) => {
      let aspectRatio = 1.2; // Default square-ish

      // AI decision: Different aspect ratios for different room types
      switch (roomType.toLowerCase()) {
        case 'lounge':
          aspectRatio = 1.4; // Wider for living spaces
          break;
        case 'kitchen':
          aspectRatio = 1.6; // Longer for kitchen workflow
          break;
        case 'bedroom':
          aspectRatio = 1.3; // Slightly rectangular
          break;
        case 'bathroom':
          aspectRatio = 1.1; // More square for efficiency
          break;
        case 'parking':
          aspectRatio = 2.0; // Very wide for cars
          break;
      }

      const roomWidth = Math.round(Math.sqrt(roomArea * aspectRatio));
      const roomHeight = Math.round(roomArea / roomWidth);

      return { width: roomWidth, height: roomHeight };
    };

    sortedRooms.forEach((room, index) => {
      const roomArea = totalArea * room.ratio;
      const { width: roomWidth, height: roomHeight } = getOptimalDimensions(roomArea, room.name);

      // AI decision: Smart room placement
      if (currentX + roomWidth > width * 0.85) {
        currentX = 0;
        currentY += maxHeight + this.wallThickness;
        maxHeight = 0;
        rowHeight = 0;
      }

      // AI optimization: Ensure minimum room sizes
      const minRoomSize = 8; // Minimum 8x8 feet
      const finalWidth = Math.max(roomWidth, minRoomSize);
      const finalHeight = Math.max(roomHeight, minRoomSize);

      // AI constraint: Don't exceed plot boundaries
      const availableWidth = width - currentX;
      const availableHeight = height - currentY;

      const adjustedWidth = Math.min(finalWidth, availableWidth * 0.9);
      const adjustedHeight = Math.min(finalHeight, availableHeight * 0.9);

      rooms.push({
        name: room.name,
        x: currentX,
        y: currentY,
        width: adjustedWidth,
        height: adjustedHeight,
        area: adjustedWidth * adjustedHeight,
        priority: roomPriority[room.name.split(' ')[0]] || 7,
        roomType: room.name.split(' ')[0].toLowerCase()
      });

      currentX += adjustedWidth + this.wallThickness;
      maxHeight = Math.max(maxHeight, adjustedHeight);
      rowHeight = Math.max(rowHeight, adjustedHeight);
    });

    return rooms;
  }

  // AI-powered room layout generation
  async generateLayout(area, shape, buildingType = 'residential') {
    const { width, height } = this.getPlotDimensions(area, shape);
    const aiRooms = await getAIDimensions(area, buildingType);

    let config;

    switch (buildingType.toLowerCase()) {
      case 'hotel':
        config = {
          rooms: [
            { name: 'Reception', ratio: 0.1 },
            { name: 'Lobby', ratio: 0.1 },
            { name: 'Guest Room 1', ratio: 0.1 },
            { name: 'Guest Room 2', ratio: 0.1 },
            { name: 'Guest Room 3', ratio: 0.1 },
            { name: 'Restaurant', ratio: 0.15 },
            { name: 'Kitchen', ratio: 0.1 },
            { name: 'Bathroom 1', ratio: 0.05 },
            { name: 'Bathroom 2', ratio: 0.05 },
            { name: 'Storage', ratio: 0.05 }
          ]
        };
        break;

      case 'bank':
        config = {
          rooms: [
            { name: 'Reception', ratio: 0.1 },
            { name: 'Cash Counter', ratio: 0.15 },
            { name: 'Manager Cabin', ratio: 0.1 },
            { name: 'Office Area', ratio: 0.2 },
            { name: 'Vault', ratio: 0.05 },
            { name: 'Meeting Room', ratio: 0.1 },
            { name: 'Washroom', ratio: 0.05 },
            { name: 'Parking', ratio: 0.1 }
          ]
        };
        break;

      case 'school':
        config = {
          rooms: [
            { name: 'Classroom 1', ratio: 0.15 },
            { name: 'Classroom 2', ratio: 0.15 },
            { name: 'Classroom 3', ratio: 0.15 },
            { name: 'Principal Office', ratio: 0.1 },
            { name: 'Staff Room', ratio: 0.1 },
            { name: 'Computer Lab', ratio: 0.1 },
            { name: 'Library', ratio: 0.1 },
            { name: 'Play Area', ratio: 0.15 }
          ]
        };
        break;

      default:
        config = this.getRoomConfiguration(area);
    }

    let rooms;
    try {
      rooms = await getAIDimensions(area, buildingType);
    } catch (err) {
      console.warn('AI generation failed, using fallback layout');
      rooms = this.generateAIRoomLayout(area, config, width, height);
    }

    return {
      width,
      height,
      area,
      buildingType,
      rooms
    };
  }
}

async function getAIDimensions(area, buildingType) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
    You are an architectural planner. 
    Given a total plot area of ${area} sq ft for a ${buildingType}, 
    return an optimized JSON layout with each room name, width, height, and relative coordinates. 
    Example JSON:
    [{"name":"Lounge","x":0,"y":0,"width":400,"height":300},{"name":"Bedroom","x":400,"y":0,"width":200,"height":200}]
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
}

// API Routes
app.post('/api/generate-blueprint', async (req, res) => {
  try {
    const { area, shape, location, floors = 1, buildingType = 'residential' } = req.body;

    if (!area || area <= 0) {
      return res.status(400).json({ error: 'Area must be a positive number' });
    }

    const generator = new BlueprintGenerator();
    const blueprint = generator.generateLayout(area, shape || 'rectangle', buildingType);

    res.json({
      success: true,
      blueprint: {
        ...blueprint,
        metadata: {
          location,
          floors,
          generatedAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error generating blueprint:', error);
    res.status(500).json({ error: 'Failed to generate blueprint' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AutoBlueprint API is running' });
});

app.listen(PORT, () => {
  console.log(`AutoBlueprint API server running on port ${PORT}`);
});
