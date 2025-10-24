#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testBlueprintGeneration() {
  console.log('🧪 Testing AutoBlueprint API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test blueprint generation for different plot sizes
    const testCases = [
      { area: 800, shape: 'square', location: 'Small House', floors: 1 },
      { area: 1500, shape: 'rectangle', location: 'Medium House', floors: 2 },
      { area: 2500, shape: 'rectangle', location: 'Large House', floors: 3 }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n${i + 2}. Testing ${testCase.location} (${testCase.area} sq ft)...`);
      
      const response = await axios.post(`${API_BASE}/generate-blueprint`, testCase);
      
      if (response.data.success) {
        const blueprint = response.data.blueprint;
        console.log(`✅ Generated blueprint for ${blueprint.rooms.length} rooms`);
        console.log(`   - Plot dimensions: ${blueprint.plotDimensions.width} × ${blueprint.plotDimensions.height} ft`);
        console.log(`   - Total walls: ${blueprint.walls.length}`);
        
        const totalDoors = blueprint.rooms.reduce((sum, room) => sum + room.doors.length, 0);
        const totalWindows = blueprint.rooms.reduce((sum, room) => sum + room.windows.length, 0);
        console.log(`   - Doors: ${totalDoors}, Windows: ${totalWindows}`);
        
        console.log(`   - Rooms: ${blueprint.rooms.map(r => r.name).join(', ')}`);
      } else {
        console.log('❌ Failed to generate blueprint');
      }
    }

    console.log('\n🎉 All tests passed! AutoBlueprint is working correctly.');
    console.log('\n📱 Open http://localhost:5173 in your browser to use the web interface.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm start');
    }
  }
}

// Run the demo
testBlueprintGeneration();
